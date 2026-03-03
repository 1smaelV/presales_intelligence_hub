import { CopilotSessionContext, CopilotMode } from '../modules/presales-copilot/types';
import { createChatCompletion } from './client';
import { AIMessage, AIProvider } from './types';
import { AVAILABLE_TOOLS, ToolCall } from './tools';
import { generateExecutiveBrief } from './briefAgent';
import { BriefData, GeneratedBrief } from '../modules/briefs/constants';

export interface ChatAgentOptions {
    provider?: AIProvider;
    model?: string;
    temperature?: number;
    attachments?: { name: string; content: string }[];
}

const SYSTEM_PROMPTS = {
    assistant: `You are an expert Presales Solutions Architect Assistant. 
    Your goal is to help the user prepare for meetings, understand client needs, and position solutions effectively.
    Always be professional, concise, and value-oriented.
    Use the provided session context to tailor your answers.
    If the user provides attached documents, USE THEM as the primary source of truth for your answers.
    `,
    // ... prompts kept same ...
    writer: `You are a professional Business Copywriter for Presales.
    Your goal is to draft high-quality emails, proposals, and executive summaries.
    Tone: Professional, persuasive, and clear.
    Focus on value proposition and addressing client pain points.`,

    critic: `You are a critical Deal Reviewer ("Red Teamer").
    Your goal is to find gaps, risks, and weaknesses in the user's strategy or understanding.
    Be direct but constructive. Ask tough questions that the client might ask.
    Focus on competitive threats and implementation risks.`
};

const TOOL_INSTRUCTION = `
You have access to the following tools:
${JSON.stringify(AVAILABLE_TOOLS, null, 2)}

To use a tool, you MUST respond ONLY with a JSON object in the following format:
{
  "tool": "tool_name",
  "parameters": {
    "param1": "value1",
    ...
  }
}

Do not add any text before or after the JSON object when calling a tool.
If you don't need to use a tool, respond normally.
`;

export interface AgentResponse {
    content: string;
    artifact?: GeneratedBrief;
}

export async function sendChatMessage(
    history: { role: 'user' | 'assistant'; content: string }[],
    context: CopilotSessionContext,
    mode: CopilotMode,
    options?: ChatAgentOptions,
    onStatusChange?: (status: string) => void
): Promise<AgentResponse> {
    const systemPrompt = SYSTEM_PROMPTS[mode] + TOOL_INSTRUCTION;

    const contextBlock = `
    SESSION CONTEXT:
    - Industry: ${context.industry}
    - Client Role: ${context.clientRole}
    - Sales Cycle Stage: ${context.salesCycleStage}
    - Additional Context: ${context.freeTextContext}
    `;

    // Handle Attachments (Context Stuffing)
    let attachmentBlock = '';
    if (options?.attachments && options.attachments.length > 0) {
        attachmentBlock = `\n\nATTACHED DOCUMENTS:\n` +
            options.attachments.map(att => `--- DOCUMENT: ${att.name} ---\n${att.content}\n--- END DOCUMENT ---\n`).join('\n');
    }

    const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt + contextBlock + attachmentBlock },
        ...history.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    try {
        const completion = await createChatCompletion(messages, {
            temperature: options?.temperature || 0.7,
            provider: options?.provider,
            model: options?.model,
        });

        const content = completion.choices?.[0]?.message?.content;

        if (!content) return { content: "I'm sorry, I couldn't generate a response." };

        // Check for Tool Call
        try {
            const cleaned = content.trim().replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
            if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
                const parsed: ToolCall = JSON.parse(cleaned);

                if (parsed.tool === 'generate_brief') {
                    if (onStatusChange) onStatusChange("Generating Executive Brief... this may take a moment.");

                    // Map parameters to BriefData
                    const briefData: BriefData = {
                        industry: parsed.parameters.industry || context.industry,
                        clientRole: context.clientRole, // Use context as default
                        meetingType: 'Executive Briefing', // Default for now
                        context: `Company: ${parsed.parameters.companyName}. Solution: ${parsed.parameters.solutionFocus}. ${context.freeTextContext}`
                    };

                    const brief = await generateExecutiveBrief(briefData);

                    return {
                        content: `I have generated an executive brief for **${parsed.parameters.companyName}**.\n\n` +
                            `**Elevator Pitch:**\n${brief.elevatorPitch}\n\n` +
                            `**Discovery Questions:**\n${brief.discoveryQuestions.map(q => `- ${q}`).join('\n')}\n\n` +
                            `*(Click "View Full Brief" to see the complete report)*`,
                        artifact: brief
                    };
                }
            }
        } catch (e) {
            // Not a JSON or tool call, return normal content
        }

        return { content };
    } catch (error) {
        console.error('Chat generation failed', error);
        return { content: "I'm having trouble connecting to the AI service right now. Please try again." };
    }
}
export async function sendProjectChatMessage(
    projectId: string,
    history: { role: 'user' | 'assistant'; content: string }[],
    project: any, // Using any for now to avoid circular import issues if they arise
    mode: CopilotMode,
    options?: ChatAgentOptions,
    onStatusChange?: (status: string) => void
): Promise<AgentResponse & { sources?: any[] }> {
    const systemPrompt = SYSTEM_PROMPTS[mode] + TOOL_INSTRUCTION;

    // 1. RAG Retrieval
    let contextBlock = '';
    let sources: any[] = [];

    if (onStatusChange) onStatusChange("Searching project knowledge base...");

    try {
        const query = history[history.length - 1].content;
        const RAG_BASE_URL = 'http://localhost:3001/api'; // Direct fetch to avoid dependencies
        const ragResponse = await fetch(`${RAG_BASE_URL}/projects/${projectId}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, topK: 5 }),
        });

        if (ragResponse.ok) {
            sources = await ragResponse.json();
            if (sources.length > 0) {
                contextBlock = `\n\nRELEVANT PROJECT DATA (RAG):\n` +
                    sources.map((s, idx) => `[Source ${idx + 1}: ${s.fileName}]\n${s.snippet}\n`).join('\n');
            }
        }
    } catch (error) {
        console.error('[DEBUG] RAG retrieval failed in sendProjectChatMessage:', error);
    }

    const projectBlock = `
    PROJECT CONTEXT:
    - Name: ${project.name}
    - Industry: ${project.industry}
    - Client Role: ${project.clientRole}
    - Stage: ${project.salesCycleStage}
    `;

    const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt + projectBlock + contextBlock },
        ...history.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    if (onStatusChange) onStatusChange("Thinking...");

    try {
        const completion = await createChatCompletion(messages, {
            temperature: options?.temperature || 0.7,
            provider: options?.provider,
            model: options?.model,
        });

        const content = completion.choices?.[0]?.message?.content;

        if (!content) return { content: "I'm sorry, I couldn't generate a response." };

        // Handle Tool Calls (Brief Generator)
        try {
            const cleaned = content.trim().replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
            if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
                const parsed: ToolCall = JSON.parse(cleaned);

                if (parsed.tool === 'generate_brief') {
                    if (onStatusChange) onStatusChange("Generating Executive Brief...");

                    const briefData: BriefData = {
                        industry: parsed.parameters.industry || project.industry,
                        clientRole: project.clientRole,
                        meetingType: 'Executive Briefing',
                        context: `Company: ${parsed.parameters.companyName}. Solution: ${parsed.parameters.solutionFocus}. ${project.description || ''}`
                    };

                    const brief = await generateExecutiveBrief(briefData);

                    return {
                        content: `I have generated an executive brief for **${parsed.parameters.companyName}** based on our project data.\n\n` +
                            `**Elevator Pitch:**\n${brief.elevatorPitch}\n\n` +
                            `*(Detailed brief visible in the right panel)*`,
                        artifact: brief,
                        sources
                    };
                }
            }
        } catch (e) {
            // Not a tool call
        }

        return { content, sources };
    } catch (error) {
        console.error('[DEBUG] Chat generation failed in sendProjectChatMessage:', error);
        return { content: "I'm having trouble connecting to the AI service. Please try again.", sources: [] };
    }
}

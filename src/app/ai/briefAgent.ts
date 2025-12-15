import { BriefData, GeneratedBrief } from '../modules/briefs/constants';
import { generateBriefData } from '../modules/briefs/utils';
import { createChatCompletion } from './client';
import { BRIEF_AGENT_SYSTEM_PROMPT, buildBriefUserPrompt } from './prompts/briefAgentPrompt';
import { AIMessage, AIProvider } from './types';

/**
 * Helper to ensure a value is a valid string array.
 * Filters out non-string and empty values.
 */
const coerceArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map(item => (typeof item === 'string' ? item : '')).filter(Boolean);
};

/**
 * Maps the AI response to a safe case study object structure.
 * Provides defaults for missing fields.
 */
const mapCaseStudy = (payload: any) => ({
  title: typeof payload?.title === 'string' && payload.title ? payload.title : 'Relevant Case Study',
  summary:
    typeof payload?.summary === 'string' && payload.summary
      ? payload.summary
      : 'Case study details will be added once available.',
  metrics: coerceArray(payload?.metrics).length
    ? coerceArray(payload?.metrics)
    : ['ROI and efficiency impact', 'Timeline to value', 'Adoption highlights'],
});

/**
 * Transforms the AI JSON payload into the internal GeneratedBrief definition.
 * Merges original request data with generated insights.
 */
const mapBriefResponse = (briefData: BriefData, payload: any): GeneratedBrief => ({
  industry: payload?.metadata?.industry || briefData.industry,
  meetingType: payload?.metadata?.meetingType || briefData.meetingType,
  clientRole: payload?.metadata?.clientRole || briefData.clientRole,
  context: payload?.metadata?.context || briefData.context,
  elevatorPitch: typeof payload?.elevatorPitch === 'string' ? payload.elevatorPitch : '',
  discoveryQuestions: coerceArray(payload?.discoveryQuestions),
  industryInsights: coerceArray(payload?.industryInsights),
  positioning: coerceArray(payload?.positioning),
  caseStudy: mapCaseStudy(payload?.caseStudy),
});

/**
 * Generates an executive brief using the configured AI provider.
 * Orchestrates prompt assembly, API calling, and response parsing.
 * Falls back to static template generation on failure.
 * 
 * @param {BriefData} briefData - The user input to generate from.
 * @param {object} options - Configuration for AI provider and model.
 * @returns {Promise<GeneratedBrief>} The generated brief object.
 */
export async function generateExecutiveBrief(
  briefData: BriefData,
  options?: { provider?: AIProvider; model?: string }
): Promise<GeneratedBrief> {
  const messages: AIMessage[] = [
    { role: 'system', content: BRIEF_AGENT_SYSTEM_PROMPT },
    { role: 'user', content: buildBriefUserPrompt(briefData) },
  ];

  try {
    const completion = await createChatCompletion(messages, {
      temperature: 0.2,
      provider: options?.provider,
      model: options?.model,
    });
    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from model');
    }

    const cleaned = content.trim().replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return mapBriefResponse(briefData, parsed);
  } catch (error) {
    console.error('AI brief generation failed, using fallback copy', error);
    return generateBriefData(briefData);
  }
}

export { buildBriefUserPrompt };

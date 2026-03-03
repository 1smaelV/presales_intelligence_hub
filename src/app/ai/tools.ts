// CopilotSessionContext removed as it was unused

export interface ToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
    };
}

export const GENERATE_BRIEF_TOOL: ToolDefinition = {
    name: "generate_brief",
    description: "Generates a comprehensive executive brief, research summary, or competitive battlecard for a specific company and opportunity. Use this when the user asks for a 'brief', 'summary', 'research', or 'battlecard'.",
    parameters: {
        type: "object",
        properties: {
            companyName: {
                type: "string",
                description: "The name of the client company or prospect."
            },
            solutionFocus: {
                type: "string",
                description: "The main solution or product being pitched (e.g. 'Cybersecurity', 'Cloud Migration')."
            },
            industry: {
                type: "string",
                description: "The industry of the client (optional, inferred from context if missing)."
            }
        },
        required: ["companyName"]
    }
};

export const AVAILABLE_TOOLS = [GENERATE_BRIEF_TOOL];

export interface ToolCall {
    tool: string;
    parameters: any;
}

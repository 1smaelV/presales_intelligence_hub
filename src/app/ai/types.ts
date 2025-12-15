export type AIMessageRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export type AIProvider = 'openai' | 'gemini';

export interface ChatCompletionChoice {
  message: {
    role: string;
    content: string;
  };
}

export interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
}

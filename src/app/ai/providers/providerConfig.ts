import { AIMessage, ChatCompletionResponse } from '../types';

export type ProviderConfig = {
  apiKeyName: 'OPENAI_API_KEY' | 'GEMINI_API_KEY';
  defaultModel: string;
  buildRequest: (args: {
    apiKey: string;
    messages: AIMessage[];
    model: string;
    temperature: number;
  }) => { url: string; init: RequestInit };
  parseResponse: (payload: any) => ChatCompletionResponse;
};


import { ChatCompletionResponse } from '../types';
import { ProviderConfig } from './providerConfig';

const OPENAI_DEFAULT_MODEL =
  import.meta.env.BRIEF_MODEL ||
  import.meta.env.OPENAI_MODEL ||
  import.meta.env.AI_ANALYZER_MODEL ||
  'gpt-4o-mini';

// Isolated OpenAI provider so Gemini wiring can evolve independently.
export const openAIProvider: ProviderConfig = {
  apiKeyName: 'OPENAI_API_KEY',
  defaultModel: OPENAI_DEFAULT_MODEL,
  buildRequest: ({ apiKey, messages, model, temperature }) => ({
    url: 'https://api.openai.com/v1/chat/completions',
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        messages,
      }),
    },
  }),
  parseResponse: payload => payload as ChatCompletionResponse,
};

export { OPENAI_DEFAULT_MODEL };


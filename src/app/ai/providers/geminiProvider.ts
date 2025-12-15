import { ChatCompletionResponse } from '../types';
import { ProviderConfig } from './providerConfig';

const GEMINI_DEFAULT_MODEL = import.meta.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai';

// Gemini provider follows the openai-compatible endpoint used in notebooks/test_gemini.ipynb.
export const geminiProvider: ProviderConfig = {
  apiKeyName: 'GEMINI_API_KEY',
  defaultModel: GEMINI_DEFAULT_MODEL,
  buildRequest: ({ apiKey, messages, model, temperature }) => ({
    url: `${GEMINI_BASE_URL}/chat/completions`,
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

export { GEMINI_DEFAULT_MODEL };


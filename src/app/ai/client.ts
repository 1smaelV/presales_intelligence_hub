import { geminiProvider } from './providers/geminiProvider';
import { ProviderConfig } from './providers/providerConfig';
import { openAIProvider } from './providers/openaiProvider';
import { AIMessage, AIProvider, ChatCompletionResponse } from './types';

const DEFAULT_TEMPERATURE = 0.2;

// Map string keys to provider implementations
const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  openai: openAIProvider,
  gemini: geminiProvider,
};

const getProvider = (provider?: AIProvider) => PROVIDERS[provider || 'openai'];

const getApiKey = (provider: ProviderConfig) =>
  (import.meta.env as Record<string, string | undefined>)[provider.apiKeyName];

/**
 * Creates a chat completion request to the specified AI provider.
 * Handles provider selection, API key retrieval, and request building.
 * 
 * @param {AIMessage[]} messages - The conversation history.
 * @param {object} [options] - Optional settings for model, provider, and temperature.
 * @returns {Promise<ChatCompletionResponse>} The parsed response from the AI provider.
 * @throws {Error} If the API key is missing or the request fails.
 */
export async function createChatCompletion(
  messages: AIMessage[],
  options?: { model?: string; provider?: AIProvider; temperature?: number }
): Promise<ChatCompletionResponse> {
  const provider = getProvider(options?.provider);
  const apiKey = getApiKey(provider);

  if (!apiKey) {
    throw new Error(`Missing ${provider.apiKeyName} for ${options?.provider || 'openai'} requests.`);
  }

  const model = options?.model || provider.defaultModel;
  const temperature = options?.temperature ?? DEFAULT_TEMPERATURE;
  const { url, init } = provider.buildRequest({ apiKey, messages, model, temperature });

  const response = await fetch(url, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  return provider.parseResponse(payload);
}

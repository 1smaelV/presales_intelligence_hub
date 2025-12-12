import { AIMessage, ChatCompletionResponse } from './types';

const DEFAULT_MODEL =
  import.meta.env.BRIEF_MODEL ||
  import.meta.env.OPENAI_MODEL ||
  import.meta.env.AI_ANALYZER_MODEL ||
  'gpt-4o-mini';

const getApiKey = () => import.meta.env.OPENAI_API_KEY;

export async function createChatCompletion(
  messages: AIMessage[],
  options?: { model?: string; temperature?: number }
): Promise<ChatCompletionResponse> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY for OpenAI requests.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options?.model || DEFAULT_MODEL,
      temperature: options?.temperature ?? 0.2,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<ChatCompletionResponse>;
}

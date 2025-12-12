import { BriefData, GeneratedBrief } from './constants';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const persistBriefResult = async (
  briefData: BriefData,
  generatedBrief: GeneratedBrief
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/briefs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      briefData,
      generatedBrief,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to save brief (${response.status}): ${message}`);
  }
};

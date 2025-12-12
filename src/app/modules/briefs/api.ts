import { BriefData, GeneratedBrief } from './constants';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export interface CategorizedQuestions {
  name: string;
  questions: string[];
}

export interface RoleCategories {
  role: string;
  categories: CategorizedQuestions[];
}

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

export const fetchIndustryQuestions = async (
  industry: string,
  clientRole?: string
): Promise<RoleCategories[]> => {
  if (!industry) return [];
  const params = new URLSearchParams({ industry });
  if (clientRole) params.set('clientRole', clientRole);

  const response = await fetch(`${API_BASE_URL}/api/questions?${params.toString()}`);

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to load questions (${response.status}): ${message}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.roleCategories) ? payload.roleCategories : [];
};

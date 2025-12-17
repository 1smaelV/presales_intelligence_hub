import { BriefData, GeneratedBrief } from './constants';

/**
 * Resolves the base URL for the backend API.
 * Uses the VITE_API_URL environment variable if set.
 * Defaults to localhost:3001 if running on Vite's default dev port (5173).
 * Otherwise falls back to the current window origin.
 * 
 * @returns {string} The resolved API base URL without strict trailing slash.
 */
const resolveApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_URL;
  if (envBase) return envBase.replace(/\/$/, '');

  if (typeof window === 'undefined') return '';

  const origin = window.location.origin.replace(/\/$/, '');

  // Helpful dev fallback: if running Vite on 5173, assume API on 3001.
  if (origin.includes('localhost:5173')) return 'http://localhost:3001';

  return origin;
};

const API_BASE_URL = resolveApiBaseUrl();

/**
 * Represents a category of questions with a specific name.
 */
export interface CategorizedQuestions {
  name: string;
  questions: string[];
}

/**
 * Represents questions categorized by client role.
 */
export interface RoleCategories {
  role: string;
  categories: CategorizedQuestions[];
}

/**
 * Represents a saved brief entry returned from the backend.
 */
export interface BriefHistoryItem {
  id: string;
  industry: string;
  meetingType: string;
  clientRole: string;
  createdAt: string | null;
  elevatorPitch: string;
  discoveryQuestions: string[];
  industryInsights: string[];
  positioning: string[];
  caseStudy: {
    title: string;
    summary: string;
    metrics: string[];
  } | null;
  context: string;
}

/**
 * Persists the generated brief to the backend.
 * 
 * @param {BriefData} briefData - The input data used to generate the brief.
 * @param {GeneratedBrief} generatedBrief - The structured brief output from the AI.
 * @throws {Error} If the API request fails.
 */
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

/**
 * Fetches industry-specific questions from the backend API.
 * 
 * @param {string} industry - The target industry to fetch questions for.
 * @param {string} [clientRole] - (Optional) The specific client role to filter by.
 * @returns {Promise<RoleCategories[]>} A list of question categories grouped by role.
 * @throws {Error} If the API request fails.
 */
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

/**
 * Fetches the list of recently generated briefs with optional filters.
 * 
 * @param {object} filters - Optional filters for industry and client role.
 * @returns {Promise<BriefHistoryItem[]>} The list of briefs for display.
 * @throws {Error} If the API request fails.
 */
export const fetchBriefHistory = async (filters?: { industry?: string; clientRole?: string }): Promise<BriefHistoryItem[]> => {
  const params = new URLSearchParams();
  if (filters?.industry) params.set('industry', filters.industry);
  if (filters?.clientRole) params.set('clientRole', filters.clientRole);

  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/api/briefs${query ? `?${query}` : ''}`);

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to load briefs (${response.status}): ${message}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.briefs) ? payload.briefs : [];
};

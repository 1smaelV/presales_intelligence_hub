import { BriefData, GeneratedBrief } from '../modules/briefs/constants';
import { generateBriefData } from '../modules/briefs/utils';
import { createChatCompletion } from './client';
import { BRIEF_AGENT_SYSTEM_PROMPT, buildBriefUserPrompt } from './prompts/briefAgentPrompt';
import { AIMessage } from './types';

const coerceArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map(item => (typeof item === 'string' ? item : '')).filter(Boolean);
};

const mapCaseStudy = (payload: any) => ({
  title: typeof payload?.title === 'string' && payload.title ? payload.title : 'Relevant Case Study',
  summary:
    typeof payload?.summary === 'string' && payload.summary
      ? payload.summary
      : 'Case study details will be added once available.',
  metrics: coerceArray(payload?.metrics).length
    ? coerceArray(payload?.metrics)
    : ['ROI and efficiency impact', 'Timeline to value', 'Adoption highlights'],
});

const mapBriefResponse = (briefData: BriefData, payload: any): GeneratedBrief => ({
  industry: payload?.metadata?.industry || briefData.industry,
  meetingType: payload?.metadata?.meetingType || briefData.meetingType,
  clientRole: payload?.metadata?.clientRole || briefData.clientRole,
  context: payload?.metadata?.context || briefData.context,
  elevatorPitch: typeof payload?.elevatorPitch === 'string' ? payload.elevatorPitch : '',
  discoveryQuestions: coerceArray(payload?.discoveryQuestions),
  industryInsights: coerceArray(payload?.industryInsights),
  positioning: coerceArray(payload?.positioning),
  caseStudy: mapCaseStudy(payload?.caseStudy),
});

export async function generateExecutiveBrief(briefData: BriefData): Promise<GeneratedBrief> {
  const messages: AIMessage[] = [
    { role: 'system', content: BRIEF_AGENT_SYSTEM_PROMPT },
    { role: 'user', content: buildBriefUserPrompt(briefData) },
  ];

  try {
    const completion = await createChatCompletion(messages, { temperature: 0.2 });
    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from model');
    }

    const parsed = JSON.parse(content);
    return mapBriefResponse(briefData, parsed);
  } catch (error) {
    console.error('AI brief generation failed, using fallback copy', error);
    return generateBriefData(briefData);
  }
}

export { buildBriefUserPrompt };

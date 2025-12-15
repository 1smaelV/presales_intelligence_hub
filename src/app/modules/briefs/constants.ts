/**
 * List of supported industries for the briefing tool.
 */
export const industries = [
    'Healthcare',
    'Financial Services',
    'Retail',
    'Manufacturing',
    'Technology',
    'Insurance',
    'Telecommunications',
    'Energy & Utilities',
    'Other'
];

/**
 * List of standard meeting types to tailor the brief context.
 */
export const meetingTypes = [
    'Intro Call',
    'Discovery Session',
    'Executive Briefing',
    'Partnership Discussion',
    'Conference/Event',
    'Follow-up Meeting'
];

/**
 * List of potential client roles to customize communication style and focus.
 */
export const clientRoles = [
    'C-Suite (CEO, CTO, CFO)',
    'VP Level',
    'Director',
    'Manager',
    'Technical Lead',
    'Business Analyst'
];

/**
 * Structure of the user input data required to generate a brief.
 */
export interface BriefData {
    industry: string;
    meetingType: string;
    clientRole: string;
    /** Additional context provided by the user (optional). */
    context: string;
}

/**
 * Structure of the fully generated executive brief returned by the AI.
 */
export interface GeneratedBrief {
    industry: string;
    meetingType: string;
    clientRole: string;
    context: string;
    elevatorPitch: string;
    discoveryQuestions: string[];
    caseStudy: {
        title: string;
        summary: string;
        metrics: string[];
    };
    industryInsights: string[];
    positioning: string[];
}

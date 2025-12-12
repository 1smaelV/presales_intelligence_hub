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

export const meetingTypes = [
    'Intro Call',
    'Discovery Session',
    'Executive Briefing',
    'Partnership Discussion',
    'Conference/Event',
    'Follow-up Meeting'
];

export const clientRoles = [
    'C-Suite (CEO, CTO, CFO)',
    'VP Level',
    'Director',
    'Manager',
    'Technical Lead',
    'Business Analyst'
];

export interface BriefData {
    industry: string;
    meetingType: string;
    clientRole: string;
    context: string;
}

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

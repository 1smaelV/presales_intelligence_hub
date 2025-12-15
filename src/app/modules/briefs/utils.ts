import { BriefData, GeneratedBrief } from './constants';

/**
 * Retrieves a tailored elevator pitch based on the client's industry.
 * 
 * @param {string} industry - The target industry.
 * @returns {string} The industry-specific or default elevator pitch.
 */
export const getElevatorPitch = (industry: string) => {
    const pitches: Record<string, string> = {
        'Healthcare': 'We help healthcare organizations transform patient care and operational efficiency through intelligent agentic automation that adapts to complex clinical workflows, ensuring compliance while reducing administrative burden by up to 60%.',
        'Financial Services': 'We enable financial institutions to accelerate digital transformation with agentic AI systems that autonomously handle complex processes from loan origination to fraud detection while maintaining strict regulatory compliance.',
        'Retail': 'We empower retailers to create seamless, personalized customer experiences through agentic systems that dynamically optimize inventory, pricing, and customer engagement across all channels in real-time.',
        'Manufacturing': 'We help manufacturers achieve operational excellence through intelligent agents that optimize production scheduling, predictive maintenance, and supply chain coordination.',
        'Technology': 'We accelerate innovation for tech companies by deploying agentic AI that automates complex development workflows and scales operations without proportional headcount growth.',
        'default': 'We partner with enterprise leaders to deploy agentic AI systems that transform business operations moving beyond simple automation to intelligent agents that reason, adapt, and execute complex workflows autonomously.'
    };
    return pitches[industry] || pitches['default'];
};

/**
 * Generates a list of discovery questions tailored to the industry.
 * Combines a base set of questions with industry-specific additions.
 * 
 * @param {string} industry - The target industry.
 * @returns {string[]} An array of discovery questions.
 */
export const getDiscoveryQuestions = (industry: string) => {
    const base = [
        'What business processes currently require the most manual intervention or slow your teams down?',
        'Where do you see the biggest opportunity for intelligent automation in your organization?',
        'How does data currently flow between your critical systems? Are there pain points or bottlenecks?',
        'If you could eliminate one operational bottleneck tomorrow with AI, what would deliver the most value?',
        'What constraints do you have around data privacy, governance, or regulatory compliance?'
    ];
    const specific: Record<string, string[]> = {
        'Healthcare': ['How are you handling prior authorization processes today?', 'What percentage of staff time is spent on documentation versus patient care?'],
        'Financial Services': ['How are you balancing innovation speed with regulatory compliance?', 'What is your current approach to fraud detection?'],
        'Retail': ['How quickly can you respond to demand fluctuations?', 'What is your customer data utilization rate across channels?'],
        'Manufacturing': ['What is your equipment downtime rate?', 'How do you coordinate across your supply chain during disruptions?']
    };
    return [...base, ...(specific[industry] || [])];
};

/**
 * Retrieves a placeholder case study object for the given industry.
 * Note: This currently returns generic placeholders to be filled with real data.
 * 
 * @param {string} industry - The target industry.
 * @returns {object} An object containing the title, summary, and placeholder metrics.
 */
export const getCaseStudy = (industry: string) => ({
    title: `${industry} Transformation Example`,
    summary: 'Detailed case study content will be populated here based on your materials.',
    metrics: ['Placeholder for key metrics', 'ROI and timeline data', 'Business impact summary']
});

/**
 * Provides key industry insights and statistical data points.
 * 
 * @param {string} industry - The target industry.
 * @returns {string[]} A list of insights relevant to the industry.
 */
export const getIndustryInsights = (industry: string) => {
    const insights: Record<string, string[]> = {
        'Healthcare': ['Administrative costs account for 25-30% of total healthcare spending', 'Provider burnout driven by documentation burden is at all-time high', 'Interoperability challenges create $30B+ in annual waste'],
        'Financial Services': ['Manual loan processing takes 30-45 days on average', 'Fraud losses exceed $40B annually', 'Customer expectations for real-time service are reshaping the industry'],
        'Retail': ['Inventory optimization can improve margins by 2-5 percentage points', 'Personalization drives 10-30% revenue uplift', 'Omnichannel customers spend 3-4x more'],
        'default': ['Agentic AI adoption is accelerating', 'Early adopters seeing 40-60% efficiency gains', 'Integration remains a critical success factor']
    };
    return insights[industry] || insights['default'];
};

/**
 * Returns standard competitive positioning statements.
 * These highlight the unique value proposition of the agentic AI solution.
 * 
 * @returns {string[]} A list of positioning statements.
 */
export const getPositioning = () => [
    'Unlike RPA or basic automation, agentic systems reason through complex scenarios and adapt to changing conditions',
    'Our platform integrates with your existing tech stack (Azure, AWS, ServiceNow, Salesforce)',
    'We focus on business outcomes first with high-impact use cases that deliver ROI in 4-8 weeks',
    'Enterprise-grade security, governance, and compliance built-in from day one'
];

/**
 * Generates a complete executive brief object based on user input.
 * Aggregates data from the various helper functions (pitch, questions, etc.).
 * 
 * @param {BriefData} briefData - The user input data.
 * @returns {GeneratedBrief} The complete, structured brief.
 */
export const generateBriefData = (briefData: BriefData): GeneratedBrief => {
    return {
        industry: briefData.industry,
        meetingType: briefData.meetingType,
        clientRole: briefData.clientRole,
        context: briefData.context,
        elevatorPitch: getElevatorPitch(briefData.industry),
        discoveryQuestions: getDiscoveryQuestions(briefData.industry),
        caseStudy: getCaseStudy(briefData.industry),
        industryInsights: getIndustryInsights(briefData.industry),
        positioning: getPositioning()
    };
};

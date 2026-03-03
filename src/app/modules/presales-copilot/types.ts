export interface Project {
    _id?: string;
    name: string;
    industry: string;
    clientRole: string;
    salesCycleStage: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    metadata?: {
        materialCount: number;
        lastActivityAt: string;
    };
}

export interface ProjectMaterial {
    _id?: string;
    projectId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt?: string;
    processingStatus: 'pending' | 'processing' | 'ready' | 'failed';
    processingError?: string;
    chunkCount?: number;
}

export interface RAGSource {
    materialId: string;
    fileName: string;
    snippet: string;
    score: number;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    artifact?: any; // Reusing GeneratedBrief logic
    sources?: RAGSource[];
    timestamp?: string;
}

export interface ChatSession {
    _id?: string;
    projectId: string;
    messages: ChatMessage[];
    mode: CopilotMode;
    createdAt?: string;
    updatedAt?: string;
}

export interface CopilotSessionContext {
    industry: string;
    clientRole: string;
    salesCycleStage: string;
    freeTextContext: string;
    documents?: File[];
}

export type CopilotMode = 'assistant' | 'writer' | 'critic';

export const salesCycleStages = [
    'Discovery / Prospecting',
    'Solution Design',
    'Demo / POC',
    'Proposal / Negotiation',
    'Closing',
    'Implementation / Handoff'
];

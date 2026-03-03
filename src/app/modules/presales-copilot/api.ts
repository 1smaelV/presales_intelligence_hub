import { Project, ProjectMaterial, ChatMessage } from './types';

const BASE_URL = 'http://localhost:3001/api';

export async function fetchProjects(filters: { search?: string, industry?: string, stage?: string } = {}) {
    const params = new URLSearchParams(filters as any).toString();
    const response = await fetch(`${BASE_URL}/projects?${params}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json() as Promise<Project[]>;
}

export async function createProject(data: Partial<Project>) {
    const response = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json() as Promise<Project>;
}

export async function updateProject(id: string, data: Partial<Project>) {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
}

export async function deleteProject(id: string) {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
}

export async function fetchMaterials(projectId: string) {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/materials`);
    if (!response.ok) throw new Error('Failed to fetch materials');
    return response.json() as Promise<ProjectMaterial[]>;
}

export async function uploadMaterial(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/projects/${projectId}/materials`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload material');
    return response.json() as Promise<ProjectMaterial>;
}

export async function deleteMaterial(materialId: string) {
    const response = await fetch(`${BASE_URL}/materials/${materialId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete material');
    return response.json();
}

export async function fetchChatHistory(projectId: string) {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/chat`);
    if (!response.ok) throw new Error('Failed to fetch chat history');
    return response.json() as Promise<ChatMessage[]>;
}

export async function saveChatMessages(projectId: string, messages: ChatMessage[]) {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
    });
    if (!response.ok) throw new Error('Failed to save chat messages');
    return response.json();
}

export async function clearChatHistory(projectId: string) {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/chat`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear chat history');
    return response.json();
}

export async function queryRAG(projectId: string, query: string, topK: number = 5) {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK }),
    });
    if (!response.ok) throw new Error('RAG query failed');
    return response.json();
}

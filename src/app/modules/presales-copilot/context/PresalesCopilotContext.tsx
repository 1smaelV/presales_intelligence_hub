import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Project, ProjectMaterial, ChatMessage } from '../types';
import { fetchProjects, fetchMaterials, fetchChatHistory } from '../api';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

interface FilterOptions {
    search?: string;
    industry?: string;
    stage?: string;
}

interface PresalesCopilotContextType {
    // Data
    projects: Project[];
    projectsById: Map<string, Project>;
    materialsByProjectId: Map<string, ProjectMaterial[]>;
    chatHistoryByProjectId: Map<string, ChatMessage[]>;

    // Loading states
    isLoadingProjects: boolean;
    loadingMaterialsForProjects: Set<string>;
    loadingChatForProjects: Set<string>;

    // Errors
    projectsError: string | null;
    materialsErrors: Map<string, string>;
    chatErrors: Map<string, string>;

    // Actions
    loadProjects: (filters?: FilterOptions) => Promise<void>;
    loadMaterialsForProject: (projectId: string, force?: boolean) => Promise<void>;
    loadChatHistoryForProject: (projectId: string, force?: boolean) => Promise<void>;
    invalidateProject: (projectId: string) => void;
    invalidateMaterials: (projectId: string) => void;
    invalidateChat: (projectId: string) => void;
    refreshProjects: () => Promise<void>;

    // Polling
    startMaterialsPolling: (projectId: string) => void;
    stopMaterialsPolling: (projectId: string) => void;

    // Last visited project (for prefetching)
    setLastVisitedProject: (projectId: string) => void;
}

const PresalesCopilotContext = createContext<PresalesCopilotContextType | undefined>(undefined);

// const CACHE_TTL_PROJECTS = 5 * 60 * 1000; // 5 minutos (unused, commented out for strict TS)
const CACHE_TTL_MATERIALS = 30 * 1000; // 30 segundos
const CACHE_TTL_CHAT = 60 * 1000; // 1 minuto
const POLLING_INTERVAL = 3000; // 3 segundos

export const PresalesCopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State
    const [projects, setProjects] = useState<Project[]>([]);
    const [, setProjectsCache] = useState<CacheEntry<Project[]> | null>(null); // Destructuring only the setter to avoid TS6133
    const [materialsCache, setMaterialsCache] = useState<Map<string, CacheEntry<ProjectMaterial[]>>>(new Map());
    const [chatCache, setChatCache] = useState<Map<string, CacheEntry<ChatMessage[]>>>(new Map());

    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [loadingMaterialsForProjects, setLoadingMaterialsForProjects] = useState<Set<string>>(new Set());
    const [loadingChatForProjects, setLoadingChatForProjects] = useState<Set<string>>(new Set());

    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [materialsErrors, setMaterialsErrors] = useState<Map<string, string>>(new Map());
    const [chatErrors, setChatErrors] = useState<Map<string, string>>(new Map());

    const pollingIntervalsRef = useRef<Map<string, number>>(new Map());

    // Derived state
    const projectsById = useMemo(() => {
        const map = new Map<string, Project>();
        projects.forEach(p => {
            if (p._id) map.set(p._id, p);
        });
        return map;
    }, [projects]);

    const materialsByProjectId = useMemo(() => {
        const map = new Map<string, ProjectMaterial[]>();
        materialsCache.forEach((entry, projectId) => {
            map.set(projectId, entry.data);
        });
        return map;
    }, [materialsCache]);

    const chatHistoryByProjectId = useMemo(() => {
        const map = new Map<string, ChatMessage[]>();
        chatCache.forEach((entry, projectId) => {
            map.set(projectId, entry.data);
        });
        return map;
    }, [chatCache]);

    // Load projects with cache
    const loadProjects = useCallback(async (filters?: FilterOptions) => {
        const now = Date.now();

        // Check if filters are empty
        const hasFilters = filters && (filters.search || filters.industry || filters.stage);

        setIsLoadingProjects(true);
        setProjectsError(null);

        try {
            const data = await fetchProjects(filters || {});
            setProjects(data);

            // Only cache if no filters applied
            if (!hasFilters) {
                const cacheEntry = { data, timestamp: now };
                setProjectsCache(cacheEntry);

                // Persist to sessionStorage
                try {
                    sessionStorage.setItem('presales_projects_cache', JSON.stringify(cacheEntry));
                } catch (e) {
                    console.warn('Failed to save to sessionStorage:', e);
                }
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            setProjectsError('Failed to load projects');
        } finally {
            setIsLoadingProjects(false);
        }
    }, []);

    // Load materials for a project
    const loadMaterialsForProject = useCallback(async (projectId: string, force = false) => {
        const now = Date.now();
        const cached = materialsCache.get(projectId);

        // Check cache freshness
        if (!force && cached && (now - cached.timestamp) < CACHE_TTL_MATERIALS) {
            return; // Cache is fresh
        }

        setLoadingMaterialsForProjects(prev => new Set(prev).add(projectId));

        try {
            const data = await fetchMaterials(projectId);
            const newCache = new Map(materialsCache);
            newCache.set(projectId, { data, timestamp: now });
            setMaterialsCache(newCache);

            // Check if any material is processing - start polling if needed
            const hasProcessing = data.some(m => m.processingStatus === 'processing' || m.processingStatus === 'pending');
            if (hasProcessing) {
                startMaterialsPolling(projectId);
            }
        } catch (error) {
            console.error(`Error loading materials for project ${projectId}:`, error);
            const newErrors = new Map(materialsErrors);
            newErrors.set(projectId, 'Failed to load materials');
            setMaterialsErrors(newErrors);
        } finally {
            setLoadingMaterialsForProjects(prev => {
                const next = new Set(prev);
                next.delete(projectId);
                return next;
            });
        }
    }, [materialsCache, materialsErrors]);

    // Load chat history
    const loadChatHistoryForProject = useCallback(async (projectId: string, force = false) => {
        const now = Date.now();
        const cached = chatCache.get(projectId);

        if (!force && cached && (now - cached.timestamp) < CACHE_TTL_CHAT) {
            return;
        }

        setLoadingChatForProjects(prev => new Set(prev).add(projectId));

        try {
            const data = await fetchChatHistory(projectId);
            const newCache = new Map(chatCache);
            newCache.set(projectId, { data, timestamp: now });
            setChatCache(newCache);
        } catch (error) {
            console.error(`Error loading chat history for project ${projectId}:`, error);
            const newErrors = new Map(chatErrors);
            newErrors.set(projectId, 'Failed to load chat history');
            setChatErrors(newErrors);
        } finally {
            setLoadingChatForProjects(prev => {
                const next = new Set(prev);
                next.delete(projectId);
                return next;
            });
        }
    }, [chatCache, chatErrors]);

    // Polling for materials processing
    const startMaterialsPolling = useCallback((projectId: string) => {
        // Clear existing interval if any
        if (pollingIntervalsRef.current.has(projectId)) {
            clearInterval(pollingIntervalsRef.current.get(projectId)!);
        }

        const interval = setInterval(() => {
            loadMaterialsForProject(projectId, true);
        }, POLLING_INTERVAL);

        pollingIntervalsRef.current.set(projectId, interval);
    }, [loadMaterialsForProject]);

    const stopMaterialsPolling = useCallback((projectId: string) => {
        const interval = pollingIntervalsRef.current.get(projectId);
        if (interval) {
            clearInterval(interval);
            pollingIntervalsRef.current.delete(projectId);
        }
    }, []);

    // Invalidation functions
    const invalidateProject = useCallback((_projectId: string) => {
        setProjectsCache(null);
        try {
            sessionStorage.removeItem('presales_projects_cache');
        } catch (e) {
            console.warn('Failed to clear sessionStorage:', e);
        }
    }, []);

    const invalidateMaterials = useCallback((projectId: string) => {
        const newCache = new Map(materialsCache);
        newCache.delete(projectId);
        setMaterialsCache(newCache);
    }, [materialsCache]);

    const invalidateChat = useCallback((projectId: string) => {
        const newCache = new Map(chatCache);
        newCache.delete(projectId);
        setChatCache(newCache);
    }, [chatCache]);

    const refreshProjects = useCallback(async () => {
        setProjectsCache(null);
        await loadProjects();
    }, [loadProjects]);

    const setLastVisitedProject = useCallback((projectId: string) => {
        try {
            localStorage.setItem('presales_last_visited_project', projectId);
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    }, []);

    // Initial load from cache + prefetch
    useEffect(() => {
        // Try to load from sessionStorage
        try {
            const cached = sessionStorage.getItem('presales_projects_cache');
            if (cached) {
                const parsed = JSON.parse(cached);
                setProjectsCache(parsed);
                setProjects(parsed.data);
            }
        } catch (e) {
            console.warn('Failed to parse cached projects:', e);
        }

        // Always load fresh data
        loadProjects();

        // Prefetch materials for last visited project
        try {
            const lastVisited = localStorage.getItem('presales_last_visited_project');
            if (lastVisited) {
                // Small delay to not block initial render
                setTimeout(() => {
                    loadMaterialsForProject(lastVisited);
                }, 500);
            }
        } catch (e) {
            console.warn('Failed to prefetch last visited project:', e);
        }
    }, []);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            pollingIntervalsRef.current.forEach(interval => clearInterval(interval));
        };
    }, []);

    // Auto-stop polling when all materials are ready
    useEffect(() => {
        materialsByProjectId.forEach((materials, projId) => {
            const hasProcessing = materials.some(m => m.processingStatus === 'processing' || m.processingStatus === 'pending');
            if (!hasProcessing && pollingIntervalsRef.current.has(projId)) {
                stopMaterialsPolling(projId);
            }
        });
    }, [materialsByProjectId, stopMaterialsPolling]);

    const value = useMemo(() => ({
        projects,
        projectsById,
        materialsByProjectId,
        chatHistoryByProjectId,
        isLoadingProjects,
        loadingMaterialsForProjects,
        loadingChatForProjects,
        projectsError,
        materialsErrors,
        chatErrors,
        loadProjects,
        loadMaterialsForProject,
        loadChatHistoryForProject,
        invalidateProject,
        invalidateMaterials,
        invalidateChat,
        refreshProjects,
        startMaterialsPolling,
        stopMaterialsPolling,
        setLastVisitedProject,
    }), [
        projects,
        projectsById,
        materialsByProjectId,
        chatHistoryByProjectId,
        isLoadingProjects,
        loadingMaterialsForProjects,
        loadingChatForProjects,
        projectsError,
        materialsErrors,
        chatErrors,
        loadProjects,
        loadMaterialsForProject,
        loadChatHistoryForProject,
        invalidateProject,
        invalidateMaterials,
        invalidateChat,
        refreshProjects,
        startMaterialsPolling,
        stopMaterialsPolling,
        setLastVisitedProject,
    ]);

    return (
        <PresalesCopilotContext.Provider value={value}>
            {children}
        </PresalesCopilotContext.Provider>
    );
};

export const usePresalesCopilot = () => {
    const context = useContext(PresalesCopilotContext);
    if (!context) {
        throw new Error('usePresalesCopilot must be used within PresalesCopilotProvider');
    }
    return context;
};

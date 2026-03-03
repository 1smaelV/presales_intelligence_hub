import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { uploadMaterial, deleteMaterial, updateProject } from '../api';
import { usePresalesCopilot } from '../context/PresalesCopilotContext';
import {
    ArrowLeft,
    MessageSquare,
    Settings,
    RefreshCcw,
    LayoutDashboard,
    Building2,
    Clock,
    Info
} from 'lucide-react';
import MaterialUploader from './MaterialUploader';
import MaterialList from './MaterialList';
import ProjectForm from './ProjectForm';

interface ProjectWorkspaceProps {
    project: Project;
    onBack: () => void;
    onChat: () => void;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ project, onBack, onChat }) => {
    const {
        materialsByProjectId,
        loadingMaterialsForProjects,
        loadMaterialsForProject,
        invalidateMaterials,
        startMaterialsPolling,
        invalidateProject,
    } = usePresalesCopilot();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project>(project);

    const materials = materialsByProjectId.get(currentProject._id!) || [];
    const isLoading = loadingMaterialsForProjects.has(currentProject._id!);

    useEffect(() => {
        loadMaterialsForProject(currentProject._id!);
    }, [currentProject._id, loadMaterialsForProject]);

    const handleUpload = async (file: File) => {
        await uploadMaterial(currentProject._id!, file);
        invalidateMaterials(currentProject._id!);
        invalidateProject(currentProject._id!);
        loadMaterialsForProject(currentProject._id!, true);
        startMaterialsPolling(currentProject._id!);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this material? This will remove its chunks from the RAG system.')) {
            await deleteMaterial(id);
            invalidateMaterials(currentProject._id!);
            invalidateProject(currentProject._id!);
            loadMaterialsForProject(currentProject._id!, true);
        }
    };

    const handleUpdateSettings = async (data: Partial<Project>) => {
        await updateProject(currentProject._id!, data);
        setCurrentProject({ ...currentProject, ...data });
        setIsSettingsOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
            {/* Breadcrumbs / Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                Workspace
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">{currentProject.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Settings className="w-4 h-4" />
                        Project Settings
                    </button>
                    <button
                        onClick={onChat}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Open Intelligent Chat
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Meta */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Project Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Industry</div>
                                    <div className="text-sm font-bold text-gray-900">{currentProject.industry}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                    <LayoutDashboard className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Sales Stage</div>
                                    <div className="text-sm font-bold text-gray-900">{currentProject.salesCycleStage || 'Not set'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Created</div>
                                    <div className="text-sm font-bold text-gray-900">
                                        {new Date(currentProject.createdAt!).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {currentProject.description && (
                            <div className="mt-6 pt-6 border-t border-gray-50">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Description</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {currentProject.description}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-primary-200 mb-2">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">RAG Status</span>
                            </div>
                            <div className="text-2xl font-bold mb-1">
                                {materials.filter(m => m.processingStatus === 'ready').length} Ready
                            </div>
                            <p className="text-sm text-primary-100/80">
                                Materials indexed in the vector library for this project.
                            </p>
                        </div>
                        <RefreshCcw className="absolute top-1/2 right-[-20px] -translate-y-1/2 w-32 h-32 text-white/5 font-black rotate-12" />
                    </div>
                </div>

                {/* Right Column: Material Management */}
                <div className="lg:col-span-2 space-y-8">
                    <MaterialUploader onUpload={handleUpload} />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Project Materials</h2>
                            <button
                                onClick={() => loadMaterialsForProject(currentProject._id!, true)}
                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                title="Refresh List"
                            >
                                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary-600' : ''}`} />
                            </button>
                        </div>
                        <MaterialList materials={materials} onDelete={handleDelete} />
                    </div>
                </div>
            </div>

            {isSettingsOpen && (
                <ProjectForm
                    project={currentProject}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={handleUpdateSettings}
                />
            )}
        </div>
    );
};

export default ProjectWorkspace;

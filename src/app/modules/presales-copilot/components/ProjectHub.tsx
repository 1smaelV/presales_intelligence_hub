import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { industries } from '../../briefs/constants';
import { createProject, deleteProject } from '../api';
import { usePresalesCopilot } from '../context/PresalesCopilotContext';
import {
    Search,
    Plus,
    Filter,
    Briefcase,
    FileText,
    ChevronRight,
    Trash2,
    Clock,
    Building2
} from 'lucide-react';
import ProjectForm from './ProjectForm';

interface ProjectHubProps {
    onSelectProject: (project: Project) => void;
}

const ProjectHub: React.FC<ProjectHubProps> = ({ onSelectProject }) => {
    const {
        projects,
        isLoadingProjects: isLoading,
        loadProjects,
        refreshProjects,
        invalidateProject,
        setLastVisitedProject
    } = usePresalesCopilot();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        industry: '',
        stage: ''
    });

    useEffect(() => {
        loadProjects(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleCreateProject = async (data: Partial<Project>) => {
        await createProject(data);
        refreshProjects();
    };

    const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project? All associated materials and chat history will be lost.')) {
            try {
                await deleteProject(id);
                invalidateProject(id);
                refreshProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleSelectProject = (project: Project) => {
        setLastVisitedProject(project._id!);
        onSelectProject(project);
    };

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Project Hub</h1>
                    <p className="text-gray-500 mt-1">Manage your opportunities and RAG materials.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Project
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="w-full bg-gray-50 border-0 rounded-xl px-12 py-3 text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Search projects..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <select
                        className="bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 transition-all min-w-[150px]"
                        value={filters.industry}
                        onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                    >
                        <option value="">All Industries</option>
                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <button className="p-3 text-gray-400 hover:text-primary-600 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Clock className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => handleSelectProject(project)}
                            className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-primary-50 p-3 rounded-2xl group-hover:bg-primary-100 transition-colors">
                                    <Briefcase className="w-6 h-6 text-primary-600" />
                                </div>
                                <button
                                    onClick={(e) => handleDeleteProject(project._id!, e)}
                                    className="p-2 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                                {project.name}
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Building2 className="w-4 h-4" />
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md text-xs font-medium">{project.industry}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{project.salesCycleStage || 'Unset stage'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                        <FileText className="w-3.5 h-3.5" />
                                        {project.metadata?.materialCount || 0} Materials
                                    </div>
                                </div>
                                <div className="text-primary-600 flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open Workspace <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">
                        Create your first project to start ingesting materials and using RAG.
                    </p>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="mt-6 text-primary-600 font-bold hover:underline"
                    >
                        + Create New Project
                    </button>
                </div>
            )}

            {isFormOpen && (
                <ProjectForm
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleCreateProject}
                />
            )}
        </div>
    );
};

export default ProjectHub;

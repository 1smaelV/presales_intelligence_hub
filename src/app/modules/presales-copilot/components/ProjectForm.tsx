import React, { useState } from 'react';
import { Project, salesCycleStages } from '../types';
import { industries, clientRoles } from '../../briefs/constants';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface ProjectFormProps {
    project?: Project | null;
    onClose: () => void;
    onSave: (data: Partial<Project>) => Promise<void>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Project>>(
        project || {
            name: '',
            industry: '',
            clientRole: '',
            salesCycleStage: '',
            description: ''
        }
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.industry || !formData.clientRole) return;

        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-primary-900 to-primary-800 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold">{project ? 'Edit Project' : 'New Project'}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Project Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="e.g., Cloud Migration for Retailer X"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Industry <span className="text-red-500">*</span></label>
                            <select
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            >
                                <option value="">Select Industry...</option>
                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Client Role <span className="text-red-500">*</span></label>
                            <select
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                value={formData.clientRole}
                                onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                            >
                                <option value="">Select Role...</option>
                                {clientRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Sales Cycle Stage</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            value={formData.salesCycleStage}
                            onChange={(e) => setFormData({ ...formData, salesCycleStage: e.target.value })}
                        >
                            <option value="">Select Stage...</option>
                            {salesCycleStages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Brief overview of the project and goals..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || !formData.name || !formData.industry || !formData.clientRole}
                            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {project ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;

import React from 'react';
import { ProjectMaterial } from '../types';
import {
    FileText,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileCode,
    FileSpreadsheet,
    FileJson,
    Presentation
} from 'lucide-react';

interface MaterialListProps {
    materials: ProjectMaterial[];
    onDelete: (id: string) => Promise<void>;
}

const MaterialList: React.FC<MaterialListProps> = ({ materials, onDelete }) => {
    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case '.pdf': return <FileText className="w-5 h-5 text-red-500" />;
            case '.docx': return <FileText className="w-5 h-5 text-blue-500" />;
            case '.xlsx': return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
            case '.pptx': return <Presentation className="w-5 h-5 text-orange-500" />;
            case '.json': return <FileJson className="w-5 h-5 text-yellow-600" />;
            default: return <FileCode className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: ProjectMaterial['processingStatus']) => {
        switch (status) {
            case 'ready':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready
                    </span>
                );
            case 'processing':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Processing
                    </span>
                );
            case 'failed':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                    </span>
                );
        }
    };

    const Clock = ({ className }: { className: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {materials.map((material) => (
                            <tr key={material._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(material.fileType)}
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-gray-900 truncate max-w-[300px]" title={material.fileName}>
                                                {material.fileName}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {(material.fileSize / 1024).toFixed(1)} KB
                                                {material.processingStatus === 'ready' && material.chunkCount && (
                                                    <span className="ml-2 text-green-600">• {material.chunkCount} chunks</span>
                                                )}
                                            </div>
                                            {material.processingStatus === 'failed' && material.processingError && (
                                                <div className="mt-1 text-xs text-red-600 flex items-start gap-1">
                                                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{material.processingError}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium text-gray-500 uppercase">{material.fileType.replace('.', '')}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(material.processingStatus)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onDelete(material._id!)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {materials.length === 0 && (
                <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No materials uploaded yet.</p>
                </div>
            )}
        </div>
    );
};

export default MaterialList;

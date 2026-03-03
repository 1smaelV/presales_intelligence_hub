import React, { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface MaterialUploaderProps {
    onUpload: (file: File) => Promise<void>;
}

const MaterialUploader: React.FC<MaterialUploaderProps> = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allowedExtensions = ['.txt', '.md', '.json', '.csv', '.pdf', '.docx', '.pptx', '.xlsx'];

    const handleFile = async (file: File) => {
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            alert(`Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`);
            return;
        }

        setIsUploading(true);
        try {
            await onUpload(file);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative group border-2 border-dashed rounded-3xl p-10 transition-all text-center ${isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                accept={allowedExtensions.join(',')}
            />

            <div className="flex flex-col items-center">
                <div className={`p-4 rounded-2xl mb-4 transition-colors ${isDragging ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500'
                    }`}>
                    {isUploading ? (
                        <Loader2 className="w-10 h-10 animate-spin" />
                    ) : (
                        <Upload className="w-10 h-10" />
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isUploading ? 'Uploading Material...' : 'Drop your documents here'}
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                    Support for PDF, Word, PowerPoint, Excel, and text files. Max size 10MB.
                </p>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    Select Files
                </button>
            </div>

            {isDragging && (
                <div className="absolute inset-0 bg-primary-500/10 rounded-3xl pointer-events-none border-2 border-primary-500 animate-pulse" />
            )}
        </div>
    );
};

export default MaterialUploader;

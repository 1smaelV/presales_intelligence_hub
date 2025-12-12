import React from 'react';
import { Layers } from 'lucide-react';

interface ComingSoonProps {
    title: string;
    description: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600">{description}</p>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-12 text-center">
                <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
                <p className="text-gray-600">This section is under development and will be available in a future release.</p>
            </div>
        </div>
    );
};

export default ComingSoon;

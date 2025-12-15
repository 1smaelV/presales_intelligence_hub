import React from 'react';
import { FileText, MessageSquare, BookOpen, Wrench, Layers, Sparkles } from 'lucide-react';

/**
 * Props for the Dashboard component.
 */
interface DashboardProps {
    /** Callback to handle navigation changes within the app */
    onNavigate: (sectionId: string) => void;
}

/**
 * Main dashboard component acting as the landing page and navigation hub.
 * Displays summary cards for different features and a quick-start guide.
 */
const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Presales Intelligence Hub</h1>
                <p className="text-lg text-gray-600">Your command center for confident, strategic Agentic AI conversations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {/* Executive Brief Generator */}
                <div
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('brief-generator')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />

                    <div className="relative z-10">
                        <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                            <Sparkles className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Brief Generator</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">Generate personalized AI-powered prep briefs for any meeting in seconds.</p>
                        <span className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            Get Started <span className="ml-2">→</span>
                        </span>
                    </div>
                </div>

                {/* Case Studies */}
                <div
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('case-studies')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <div className="relative z-10">
                        <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                            <FileText className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Case Studies</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">Industry-specific success stories and transformation examples.</p>
                        <span className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            Explore Stories <span className="ml-2">→</span>
                        </span>
                    </div>
                </div>

                {/* Discovery Questions */}
                <div
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('key-questions')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <div className="relative z-10">
                        <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors duration-300">
                            <MessageSquare className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Discovery Questions</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">Strategic questions to uncover opportunities and pain points.</p>
                        <span className="flex items-center text-amber-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            View Questions <span className="ml-2">→</span>
                        </span>
                    </div>
                </div>

                {/* Talking Points */}
                <div
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('talking-points')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <div className="relative z-10">
                        <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 transition-colors duration-300">
                            <BookOpen className="w-8 h-8 text-rose-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Talking Points</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">Key messages and value propositions for leadership conversations.</p>
                        <span className="flex items-center text-rose-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            Learn More <span className="ml-2">→</span>
                        </span>
                    </div>
                </div>

                {/* Coming Soon Cards */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300 opacity-75">
                    <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                        <Layers className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-3">Concept Library</h3>
                    <p className="text-gray-400 mb-6">Comprehensive Agentic AI concepts and definitions</p>
                    <span className="text-xs font-bold px-3 py-1 bg-gray-200 text-gray-500 rounded-full uppercase tracking-wide">Coming Soon</span>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300 opacity-75">
                    <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                        <Wrench className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-3">Platforms & Tools</h3>
                    <p className="text-gray-400 mb-6">Architecture overview and partner ecosystem</p>
                    <span className="text-xs font-bold px-3 py-1 bg-gray-200 text-gray-500 rounded-full uppercase tracking-wide">Coming Soon</span>
                </div>
            </div>
            <div className="mt-12 bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3" />

                <h3 className="text-2xl font-bold mb-4 relative z-10">🚀 Ready to start?</h3>
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <ol className="list-decimal list-inside space-y-3 text-primary-100">
                        <li>Open the <strong>Brief Generator</strong></li>
                        <li>Enter your client's industry and context</li>
                        <li>Get instant talking points & strategy</li>
                    </ol>
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => onNavigate('brief-generator')}
                            className="bg-white text-primary-900 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg"
                        >
                            Generate Brief Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { LineChart, Sparkles, Bot, Layers, BadgeCheck, RefreshCcw } from 'lucide-react';
import { industries } from '../briefs/constants';

const offerings = [
    'Select Offering...',
    'Agentic Readiness',
    'Agentic Enablement',
    'Agentic Engineering',
    'Agentic Observability',
    'Agentic Knowledge Management',
    'Agentic Data Operations',
    'Agentic Language Model Customization',
    'Agentic Workforce Readiness',
    'Agentic Risk Mitigation',
];

/**
 * Props for the Dashboard component.
 */
interface DashboardProps {
    /** Callback to handle navigation changes within the app */
    onNavigate: (sectionId: string) => void;
    /** Global industry value */
    industry: string;
    /** Setter for global industry */
    setIndustry: (value: string) => void;
    /** Global offering value */
    offering: string;
    /** Setter for global offering */
    setOffering: (value: string) => void;
}

/**
 * Main dashboard component acting as the landing page and navigation hub.
 * Displays summary cards for different features and a quick-start guide.
 */
const Dashboard: React.FC<DashboardProps> = ({ onNavigate, industry, setIndustry, offering, setOffering }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">Presales Intelligence Hub</h1>
                    <p className="text-lg text-gray-600">Your command center for confident, strategic Agentic AI conversations</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Industry</label>
                        <select
                            className="min-w-[200px] border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        >
                            <option value="">Select industry...</option>
                            {industries.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Offering</label>
                        <select
                            className="min-w-[220px] border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            value={offering}
                            onChange={(e) => setOffering(e.target.value)}
                        >
                            {offerings.map(opt => (
                                <option key={opt} value={opt === 'Select Offering...' ? '' : opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setIndustry('');
                            setOffering('');
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {/* General Meeting Prep */}
                <div
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('brief-generator')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />

                    <div className="relative z-10">
                        <div className="bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors duration-300">
                            <Sparkles className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">General Meeting Prep</h3>
                        <p className="text-gray-500 mb-5 leading-relaxed">Generate personalized AI-powered prep for any meeting in seconds.</p>
                        <span className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            Get Started <span className="ml-2">-&gt;</span>
                        </span>
                    </div>
                </div>

                {/* Agentic Use Cases */}
                <div
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('agentic-use-cases')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <div className="relative z-10">
                        <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-amber-600 transition-colors duration-300">
                            <Bot className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Agentic Use Cases</h3>
                        <p className="text-gray-500 mb-5 leading-relaxed">Curated agentic AI patterns mapped to industries and workflows.</p>
                        <span className="flex items-center text-amber-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            Explore Use Cases <span className="ml-2">-&gt;</span>
                        </span>
                    </div>
                </div>

                {/* Our Development Framework */}
                <div
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('development-framework')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <div className="relative z-10">
                        <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-green-600 transition-colors duration-300">
                            <Layers className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Our Development Framework</h3>
                        <p className="text-gray-500 mb-5 leading-relaxed">How we design, build, and govern agentic AI from pilot to production.</p>
                        <span className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            View Framework <span className="ml-2">-&gt;</span>
                        </span>
                    </div>
                </div>

                {/* Value Proposition */}
                <div
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                    onClick={() => onNavigate('value-proposition')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <div className="relative z-10">
                        <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                            <BadgeCheck className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Value Proposition</h3>
                        <p className="text-gray-500 mb-5 leading-relaxed">Proof points, ROI levers, and differentiators tailored to the buyer.</p>
                        <span className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            Review Value <span className="ml-2">-&gt;</span>
                        </span>
                    </div>
                </div>

                {/* Prospect Analyzer */}
                <a
                    href="https://prospect-analyzer.onrender.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden block"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <div className="relative z-10">
                        <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-purple-600 transition-colors duration-300">
                            <LineChart className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Prospect Analyzer</h3>
                        <p className="text-gray-500 mb-5 leading-relaxed">External tool for deep dive analysis into prospect data.</p>
                        <span className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                            Open Analyzer <span className="ml-2">-&gt;</span>
                        </span>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Dashboard;

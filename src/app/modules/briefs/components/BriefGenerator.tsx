import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { industries, meetingTypes, clientRoles, BriefData, GeneratedBrief } from '../constants';
import { persistBriefResult } from '../api';
import { generateExecutiveBrief } from '../../../ai/briefAgent';
import { GEMINI_DEFAULT_MODEL } from '../../../ai/providers/geminiProvider';
import { OPENAI_DEFAULT_MODEL } from '../../../ai/providers/openaiProvider';
import { AIProvider } from '../../../ai/types';
import { Sparkles, FileText, PanelLeftClose, PanelLeftOpen, ArrowRight, Loader2 } from 'lucide-react';
import BriefResults from './BriefResults';

/**
 * Props for the BriefGenerator component.
 * Manages the state of the brief form data and the generated result.
 */
interface BriefGeneratorProps {
    briefData: BriefData;
    setBriefData: Dispatch<SetStateAction<BriefData>>;
    generatedBrief: GeneratedBrief | null;
    setGeneratedBrief: (brief: GeneratedBrief | null) => void;
    lockedIndustry?: string;
}

/**
 * A visual loading component displayed while the AI is generating the brief.
 */
const BriefLoadingState = () => {
    const loadingSteps = [
        "Analyzing Industry Trends...",
        "Scanning Competitive Landscape...",
        "Identifying Key Opportunities...",
        "Drafting Executive Summary..."
    ];
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % loadingSteps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-primary-100 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute inset-0 border-4 border-primary-50 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary-600 animate-pulse" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[1.75rem]">
                {loadingSteps[stepIndex]}
            </h3>
            <p className="text-gray-500 max-w-sm">
                Our AI agents are gathering insights to prepare your meeting brief.
            </p>
        </div>
    );
};

const BriefGenerator: React.FC<BriefGeneratorProps> = ({
    briefData,
    setBriefData,
    generatedBrief,
    setGeneratedBrief,
    lockedIndustry
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(true);

    const [modelSelection, setModelSelection] = useState<{ provider: AIProvider; model: string }>(() => ({
        provider: 'openai',
        model: OPENAI_DEFAULT_MODEL
    }));

    const modelOptions: { label: string; value: string; provider: AIProvider }[] = [
        { label: `OpenAI - ${OPENAI_DEFAULT_MODEL}`, value: OPENAI_DEFAULT_MODEL, provider: 'openai' },
        { label: `Google - ${GEMINI_DEFAULT_MODEL}`, value: GEMINI_DEFAULT_MODEL, provider: 'gemini' }
    ];

    // Initialize industry from locked context if available
    useEffect(() => {
        if (lockedIndustry && !briefData.industry) {
            setBriefData((prev: BriefData) => ({ ...prev, industry: lockedIndustry }));
        }
    }, [lockedIndustry, briefData.industry, setBriefData]);

    // Ensure form is visible when a new brief is generated
    useEffect(() => {
        if (generatedBrief) {
            setShowForm(true);
        }
    }, [generatedBrief]);

    const handleGenerateBrief = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const brief = await generateExecutiveBrief(briefData, {
                provider: modelSelection.provider,
                model: modelSelection.model
            });
            setGeneratedBrief(brief);
            try {
                await persistBriefResult(briefData, brief);
            } catch (persistError) {
                console.error('Brief persistence failed', persistError);
            }
        } catch (err) {
            console.error('Brief generation failed', err);
            setError('We could not reach the AI agent. Using fallback content.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = briefData.industry && briefData.meetingType && briefData.clientRole;

    return (
        <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {/* Toggle Form Button (Visible mainly in list mode or mobile) */}
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${showForm ? 'text-primary-600 bg-gray-50' : 'text-gray-400'}`}
                        title={showForm ? "Hide Details" : "Show Details"}
                    >
                        {showForm ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary-600" />
                            General Meeting Prep
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">AI-powered preparation for your client meetings</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                        <span className="text-xs font-medium text-gray-500">Model:</span>
                        <select
                            className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                            value={`${modelSelection.provider}:${modelSelection.model}`}
                            onChange={(e) => {
                                const [provider, model] = e.target.value.split(':');
                                setModelSelection({ provider: provider as AIProvider, model });
                            }}
                        >
                            {modelOptions.map(option => (
                                <option key={`${option.provider}:${option.value}`} value={`${option.provider}:${option.value}`}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA - Using Flexbox for Layout */}
            <div className="flex-1 flex gap-0 min-h-0 relative transition-all duration-300">
                {/* LEFT COLUMN: Input Form */}
                <div className={`
                    flex flex-col h-full min-h-0 transition-all duration-300 ease-in-out border-r border-transparent
                    ${showForm ? 'w-full lg:w-1/3 opacity-100 mr-8' : 'w-0 opacity-0 overflow-hidden mr-0'}
                `}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden min-w-[320px]">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-900">Meeting Details</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Define context to generate tailored insights</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200">
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Industry <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                                            value={briefData.industry}
                                            onChange={(e) => setBriefData({ ...briefData, industry: e.target.value })}
                                        >
                                            <option value="">Select industry...</option>
                                            {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Meeting Type <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                                            value={briefData.meetingType}
                                            onChange={(e) => setBriefData({ ...briefData, meetingType: e.target.value })}
                                        >
                                            <option value="">Select meeting type...</option>
                                            {meetingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Client Role <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                                            value={briefData.clientRole}
                                            onChange={(e) => setBriefData({ ...briefData, clientRole: e.target.value })}
                                        >
                                            <option value="">Select client role...</option>
                                            {clientRoles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Additional Context</label>
                                    <textarea
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all resize-none"
                                        rows={4}
                                        placeholder="Any specific topics, challenges, or goals..."
                                        value={briefData.context}
                                        onChange={(e) => setBriefData({ ...briefData, context: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-gray-50/30">
                            {error && (
                                <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                    {error}
                                </div>
                            )}
                            <button
                                className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${isFormValid && !isLoading
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                onClick={handleGenerateBrief}
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Generating Strategy...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Generate Brief</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Results Area */}
                <div className="flex-1 flex flex-col justify-start h-full min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                    {isLoading ? (
                        <BriefLoadingState />
                    ) : !generatedBrief ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 rotate-3 transform transition-transform hover:rotate-6">
                                <FileText className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Prepare?</h3>
                            <p className="max-w-md mx-auto">
                                Fill in the meeting details on the left and let our AI generate a comprehensive strategy brief for you.
                            </p>
                        </div>
                    ) : (
                        <BriefResults brief={generatedBrief} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BriefGenerator;

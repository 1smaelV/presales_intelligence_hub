import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { industries, meetingTypes, clientRoles, BriefData, GeneratedBrief } from '../constants';
import { persistBriefResult } from '../api';
import { generateExecutiveBrief } from '../../../ai/briefAgent';
import { GEMINI_DEFAULT_MODEL } from '../../../ai/providers/geminiProvider';
import { OPENAI_DEFAULT_MODEL } from '../../../ai/providers/openaiProvider';
import { AIProvider } from '../../../ai/types';

/**
 * Props for the BriefGenerator component.
 * Manages the state of the brief form data and the generated result.
 */
interface BriefGeneratorProps {
    briefData: BriefData;
    setBriefData: Dispatch<SetStateAction<BriefData>>;
    generatedBrief: GeneratedBrief | null;
    setGeneratedBrief: (brief: GeneratedBrief | null) => void;
    selectionLocked: boolean;
    lockedIndustry?: string;
}

/**
 * A visual loading component displayed while the AI is generating the brief.
 * Features a cycling text animation and a pulsing visual to engage the user.
 */
const BriefLoadingState = () => {
    // Steps to display to the user while waiting, simulating the AI's thought process
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
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-24 h-24 mb-8">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>

                {/* Rotating border */}
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 animate-pulse text-center">
                {loadingSteps[stepIndex]}
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
                Our AI agents are gathering insights to prepare your meeting brief.
            </p>
        </div>
    );
};

/**
 * BriefGenerator Component
 * 
 * The main component for the "Generate" tab.
 * It displays a form to collect meeting details, handles the API call to the AI provider,
 * shows a loading state during generation, and displays the final structured brief.
 */
const BriefGenerator: React.FC<BriefGeneratorProps> = ({
    briefData,
    setBriefData,
    generatedBrief,
    setGeneratedBrief,
    selectionLocked,
    lockedIndustry
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Track provider/model choice so we can route the request to the right client.
    const [modelSelection, setModelSelection] = useState<{ provider: AIProvider; model: string }>(() => ({
        provider: 'openai',
        model: OPENAI_DEFAULT_MODEL
    }));

    // Keep explicit options so Gemini wiring matches the notebook-tested endpoint.
    const modelOptions: { label: string; value: string; provider: AIProvider }[] = [
        {
            label: `OpenAI - ${OPENAI_DEFAULT_MODEL}`,
            value: OPENAI_DEFAULT_MODEL,
            provider: 'openai'
        },
        {
            label: `Google - ${GEMINI_DEFAULT_MODEL}`,
            value: GEMINI_DEFAULT_MODEL,
            provider: 'gemini'
        }
    ];

    useEffect(() => {
        if (selectionLocked && lockedIndustry && briefData.industry !== lockedIndustry) {
            setBriefData((prev: BriefData) => ({ ...prev, industry: lockedIndustry }));
        }
    }, [selectionLocked, lockedIndustry, briefData.industry, setBriefData]);

    /**
     * Triggers the AI generation process.
     * Validates inputs (implicit via UI disabled state), calls the selected AI provider,
     * and handles success/error states including persistence.
     */
    const handleGenerateBrief = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Call the AI agent with the selected provider (OpenAI or Gemini)
            const brief = await generateExecutiveBrief(briefData, {
                provider: modelSelection.provider,
                model: modelSelection.model
            });
            setGeneratedBrief(brief);
            try {
                await persistBriefResult(briefData, brief);
            } catch (persistError) {
                console.error('Brief persistence failed', persistError);
                setError('Brief generated but could not be saved to the database.');
            }
        } catch (err) {
            console.error('Brief generation failed', err);
            setError('We could not reach the AI agent. Using fallback content.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">General Meeting Prep</h1>
                    <p className="text-gray-600">Create personalized prep materials for your next meeting</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
                    <span className="text-xs font-semibold text-gray-600">Model</span>
                    <select
                        className="text-sm text-gray-800 bg-transparent focus:outline-none"
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
            {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            {/* Conditional Rendering Logic:
                1. If loading, show the animation.
                2. If no brief exists yet, show the input form.
                3. If a brief exists, show the results view.
            */}
            {isLoading ? (
                <BriefLoadingState />
            ) : !generatedBrief ? (
                /* --- Input Form Section --- */
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                            <select
                                className={`w-full border border-gray-300 rounded-lg px-4 py-3 ${selectionLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                value={briefData.industry}
                                onChange={(e) => setBriefData({ ...briefData, industry: e.target.value })}
                                disabled={selectionLocked}
                            >
                                <option value="">Select industry...</option>
                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Type</label>
                            <select className="w-full border border-gray-300 rounded-lg px-4 py-3" value={briefData.meetingType} onChange={(e) => setBriefData({ ...briefData, meetingType: e.target.value })}>
                                <option value="">Select meeting type...</option>
                                {meetingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Role</label>
                            <select className="w-full border border-gray-300 rounded-lg px-4 py-3" value={briefData.clientRole} onChange={(e) => setBriefData({ ...briefData, clientRole: e.target.value })}>
                                <option value="">Select client role...</option>
                                {clientRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Context (Optional)</label>
                            <textarea className="w-full border border-gray-300 rounded-lg px-4 py-3" rows={4} placeholder="Any specific topics, challenges, or goals..." value={briefData.context} onChange={(e) => setBriefData({ ...briefData, context: e.target.value })} />
                        </div>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                            onClick={handleGenerateBrief}
                            disabled={isLoading || !briefData.industry || !briefData.meetingType || !briefData.clientRole}
                        >
                            {isLoading ? 'Generating...' : 'Generate Meeting Prep'}
                        </button>
                    </div>
                </div>
            ) : (
                /* --- Generated Results Section --- */
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-blue-900">Brief Generated for:</p>
                            <p className="text-blue-800">{generatedBrief.industry} | {generatedBrief.meetingType} | {generatedBrief.clientRole}</p>
                        </div>
                        <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium" onClick={() => { setGeneratedBrief(null); setError(null); }}>New Brief</button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Elevator Pitch</h2>
                        <p className="text-gray-700 leading-relaxed">{generatedBrief.elevatorPitch}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Discovery Questions</h2>
                        <ul className="space-y-3">
                            {generatedBrief.discoveryQuestions.map((q, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-3 mt-1">{i + 1}.</span>
                                    <span className="text-gray-700">{q}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Industry Insights</h2>
                        <ul className="space-y-2">
                            {generatedBrief.industryInsights.map((ins, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-green-600 mr-3">&#183;</span>
                                    <span className="text-gray-700">{ins}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Competitive Positioning</h2>
                        <ul className="space-y-2">
                            {generatedBrief.positioning.map((p, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-purple-600 mr-3">-</span>
                                    <span className="text-gray-700">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Relevant Case Study</h2>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{generatedBrief.caseStudy.title}</h3>
                        <p className="text-gray-600 mb-4">{generatedBrief.caseStudy.summary}</p>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Key Metrics:</p>
                            <ul className="space-y-1">
                                {generatedBrief.caseStudy.metrics.map((m, i) => <li key={i} className="text-sm text-gray-600">- {m}</li>)}
                            </ul>
                        </div>
                    </div>
                    {generatedBrief.context && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <h2 className="text-lg font-bold text-amber-900 mb-2">Your Context Notes</h2>
                            <p className="text-amber-800">{generatedBrief.context}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BriefGenerator;

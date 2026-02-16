import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { industries, meetingTypes, clientRoles, BriefData, GeneratedBrief } from '../constants';
import { persistBriefResult } from '../api';
import { generateExecutiveBrief } from '../../../ai/briefAgent';
import { GEMINI_DEFAULT_MODEL } from '../../../ai/providers/geminiProvider';
import { OPENAI_DEFAULT_MODEL } from '../../../ai/providers/openaiProvider';
import { AIProvider } from '../../../ai/types';
import { Sparkles, MessageSquare, Lightbulb, Target, BookOpen, FileText, Send, Loader2, ArrowRight, CheckCircle2, LayoutList, LayoutTemplate, ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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

type ResultTab = 'overview' | 'discovery' | 'market' | 'casestudy';
type ViewMode = 'tabs' | 'list';

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
    const [activeTab, setActiveTab] = useState<ResultTab>('overview');
    const [viewMode, setViewMode] = useState<ViewMode>('tabs');
    const [showForm, setShowForm] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        overview: true,
        discovery: false,
        market: false,
        casestudy: false
    });

    const [modelSelection, setModelSelection] = useState<{ provider: AIProvider; model: string }>(() => ({
        provider: 'openai',
        model: OPENAI_DEFAULT_MODEL
    }));

    const modelOptions: { label: string; value: string; provider: AIProvider }[] = [
        { label: `OpenAI - ${OPENAI_DEFAULT_MODEL}`, value: OPENAI_DEFAULT_MODEL, provider: 'openai' },
        { label: `Google - ${GEMINI_DEFAULT_MODEL}`, value: GEMINI_DEFAULT_MODEL, provider: 'gemini' }
    ];

    useEffect(() => {
        if (selectionLocked && lockedIndustry && briefData.industry !== lockedIndustry) {
            setBriefData((prev: BriefData) => ({ ...prev, industry: lockedIndustry }));
        }
    }, [selectionLocked, lockedIndustry, briefData.industry, setBriefData]);

    // Reset view state when a new brief is generated
    useEffect(() => {
        if (generatedBrief) {
            setActiveTab('overview');
            setViewMode('tabs');
            setShowForm(true); // Keep form visible by default initially
            setExpandedSections({
                overview: true,
                discovery: false, // Collapse others for cleaner initial view
                market: false,
                casestudy: false
            });
        }
    }, [generatedBrief]);

    // Auto-collapse/expand form based on view mode
    useEffect(() => {
        if (viewMode === 'list') {
            setShowForm(false);
            // Expand all by default in list view
            setExpandedSections({
                overview: true,
                discovery: true,
                market: true,
                casestudy: true
            });
        } else {
            setShowForm(true);
        }
    }, [viewMode]);

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

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const isFormValid = briefData.industry && briefData.meetingType && briefData.clientRole;

    const renderBriefContent = () => {
        if (!generatedBrief) return null;

        const OverviewContent = ({ compact = false }) => (
            <>
                {compact ? (
                    <div className="prose prose-sm max-w-none text-gray-700 leading-snug">
                        <p className="text-sm font-medium text-gray-800 italic border-l-4 border-indigo-300 pl-3 py-1 bg-indigo-50/50 rounded-r">
                            "{generatedBrief.elevatorPitch}"
                        </p>
                        {generatedBrief.context && (
                            <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="font-semibold">Context:</span> {generatedBrief.context}
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Target className="w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Send className="w-5 h-5 text-primary-600" />
                                Elevator Pitch
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                <p className="text-lg font-medium text-gray-800">
                                    "{generatedBrief.elevatorPitch}"
                                </p>
                            </div>
                        </section>

                        {generatedBrief.context && (
                            <section className="bg-amber-50 p-5 rounded-xl border border-amber-100 mt-6">
                                <h3 className="text-sm font-bold text-amber-900 mb-2">Context Notes</h3>
                                <p className="text-sm text-amber-800/80">{generatedBrief.context}</p>
                            </section>
                        )}
                    </>
                )}
            </>
        );

        const DiscoveryContent = ({ compact = false }) => (
            <div className={compact ? "space-y-2" : "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"}>
                {!compact && (
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                        Discovery Questions
                    </h3>
                )}
                <div className={compact ? "space-y-2" : "space-y-4"}>
                    {generatedBrief.discoveryQuestions.map((q, i) => (
                        <div key={i} className={`flex gap-3 ${compact ? 'p-2 bg-white/60' : 'p-4 bg-gray-50'} rounded-lg transition-colors group`}>
                            <div className={`flex-shrink-0 ${compact ? 'w-5 h-5 text-xs' : 'w-8 h-8 text-sm'} flex items-center justify-center bg-white rounded text-primary-600 font-bold shadow-sm border border-gray-100 group-hover:border-primary-100`}>
                                {i + 1}
                            </div>
                            <p className={`text-gray-700 font-medium ${compact ? 'text-xs pt-0.5' : 'pt-1'}`}>{q}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

        const MarketContent = ({ compact = false }) => (
            <div className={compact ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "grid gap-6"}>
                <div className={`${compact ? '' : 'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'}`}>
                    {!compact && (
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Industry Insights
                        </h3>
                    )}
                    {compact && <h4 className="text-xs font-bold text-amber-700 uppercase mb-2">Insights</h4>}
                    <ul className="space-y-2">
                        {generatedBrief.industryInsights.map((ins, i) => (
                            <li key={i} className={`flex items-start gap-2 text-gray-700 ${compact ? 'text-xs' : ''}`}>
                                <CheckCircle2 className={`${compact ? 'w-3 h-3 mt-0.5' : 'w-5 h-5'} text-green-500 flex-shrink-0`} />
                                <span>{ins}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`${compact ? '' : 'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'}`}>
                    {!compact && (
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" />
                            Competitive Positioning
                        </h3>
                    )}
                    {compact && <h4 className="text-xs font-bold text-red-700 uppercase mb-2">Positioning</h4>}
                    <ul className="space-y-2">
                        {generatedBrief.positioning.map((p, i) => (
                            <li key={i} className={`flex items-start gap-2 text-gray-700 ${compact ? 'text-xs' : ''}`}>
                                <div className={`${compact ? 'w-1 h-1 mt-1.5' : 'w-1.5 h-1.5 mt-2'} rounded-full bg-red-400 flex-shrink-0`} />
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );

        const CaseStudyContent = ({ compact = false }) => (
            <div className={`${compact ? '' : 'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full'}`}>
                {!compact && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Relevant Case Study</h3>
                            <p className="text-sm text-gray-500">Success story matching your criteria</p>
                        </div>
                    </div>
                )}

                <div className={`${compact ? 'bg-white/50 p-3 mb-3' : 'bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 mb-6'} rounded-xl`}>
                    <h4 className={`${compact ? 'text-sm' : 'text-xl'} font-bold text-gray-900 mb-2`}>{generatedBrief.caseStudy.title}</h4>
                    <p className={`${compact ? 'text-xs' : ''} text-gray-600 leading-relaxed`}>{generatedBrief.caseStudy.summary}</p>
                </div>

                <div>
                    {!compact && <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Key Metrics</h5>}
                    <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-1 sm:grid-cols-2 gap-3'}`}>
                        {generatedBrief.caseStudy.metrics.map((m, i) => (
                            <div key={i} className={`bg-green-50 rounded-lg border border-green-100 flex items-center gap-2 ${compact ? 'p-2' : 'p-3'}`}>
                                <ArrowRight className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-green-600 -rotate-45`} />
                                <span className={`${compact ? 'text-xs' : 'font-medium'} text-green-900`}>{m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        if (viewMode === 'tabs') {
            // Keep subtle animation for tabs
            return (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTab === 'overview' && <OverviewContent />}
                    {activeTab === 'market' && <MarketContent />}
                    {activeTab === 'discovery' && <DiscoveryContent />}
                    {activeTab === 'casestudy' && <CaseStudyContent />}
                </div>
            );
        }

        // List View with Compact Accordions - REMOVED ANIMATION AND ENSURED FULL HEIGHT LAYOUT
        return (
            <div className="pb-10 min-h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Overview Section - Indigo Theme */}
                    <div className="border border-indigo-200 rounded-xl bg-indigo-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                        <button
                            onClick={() => toggleSection('overview')}
                            className="w-full flex items-center justify-between p-3 bg-indigo-100/50 hover:bg-indigo-100 transition-colors text-left"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-md text-indigo-600 shadow-sm">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-indigo-900 text-sm">Brief & Pitch</span>
                            </div>
                            {expandedSections.overview ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
                        </button>
                        {expandedSections.overview && (
                            <div className="p-3 border-t border-indigo-100">
                                <OverviewContent compact={true} />
                            </div>
                        )}
                    </div>

                    {/* Market Section - Amber Theme */}
                    <div className="border border-amber-200 rounded-xl bg-amber-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                        <button
                            onClick={() => toggleSection('market')}
                            className="w-full flex items-center justify-between p-3 bg-amber-100/50 hover:bg-amber-100 transition-colors text-left"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-md text-amber-600 shadow-sm">
                                    <Lightbulb className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-amber-900 text-sm">Market</span>
                            </div>
                            {expandedSections.market ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
                        </button>
                        {expandedSections.market && (
                            <div className="p-3 border-t border-amber-100">
                                <MarketContent compact={true} />
                            </div>
                        )}
                    </div>

                    {/* Discovery Section - Teal Theme */}
                    <div className="border border-teal-200 rounded-xl bg-teal-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                        <button
                            onClick={() => toggleSection('discovery')}
                            className="w-full flex items-center justify-between p-3 bg-teal-100/50 hover:bg-teal-100 transition-colors text-left"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-md text-teal-600 shadow-sm">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-teal-900 text-sm">Discovery</span>
                            </div>
                            {expandedSections.discovery ? <ChevronUp className="w-4 h-4 text-teal-400" /> : <ChevronDown className="w-4 h-4 text-teal-400" />}
                        </button>
                        {expandedSections.discovery && (
                            <div className="p-3 border-t border-teal-100">
                                <DiscoveryContent compact={true} />
                            </div>
                        )}
                    </div>

                    {/* Case Study Section - Violet Theme */}
                    <div className="border border-violet-200 rounded-xl bg-violet-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                        <button
                            onClick={() => toggleSection('casestudy')}
                            className="w-full flex items-center justify-between p-3 bg-violet-100/50 hover:bg-violet-100 transition-colors text-left"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white rounded-md text-violet-600 shadow-sm">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-violet-900 text-sm">Case Study</span>
                            </div>
                            {expandedSections.casestudy ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4 text-violet-400" />}
                        </button>
                        {expandedSections.casestudy && (
                            <div className="p-3 border-t border-violet-100">
                                <CaseStudyContent compact={true} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

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
                {/* We use a wrapper with width transition to animate the collapse */}
                <div className={`
                    flex flex-col h-full min-h-0 transition-all duration-300 ease-in-out border-r border-transparent
                    ${showForm ? 'w-full lg:w-1/3 opacity-100 mr-8' : 'w-0 opacity-0 overflow-hidden mr-0'}
                `}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden min-w-[320px]"> {/* Min-width ensures content doesn't squash during transition */}
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
                                            className={`w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all ${selectionLocked ? 'cursor-not-allowed opacity-80' : ''}`}
                                            value={briefData.industry}
                                            onChange={(e) => setBriefData({ ...briefData, industry: e.target.value })}
                                            disabled={selectionLocked}
                                        >
                                            <option value="">Select industry...</option>
                                            {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                        {!selectionLocked && <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>}
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
                        <div className="flex flex-col h-full bg-white">
                            {/* Tabs Header */}
                            <div className="flex-shrink-0 border-b border-gray-100 bg-white px-2 pt-2 flex items-center justify-between z-10 sticky top-0">
                                {/* TAB BUTTONS (Only show if in tabs mode) */}
                                <div className={`flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 ${viewMode === 'list' ? 'invisible' : ''}`}>
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all relative ${activeTab === 'overview'
                                            ? 'text-primary-700 bg-primary-50/50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Brief & Pitch
                                        {activeTab === 'overview' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('market')}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all relative ${activeTab === 'market'
                                            ? 'text-primary-700 bg-primary-50/50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Lightbulb className="w-4 h-4" />
                                        Market Review
                                        {activeTab === 'market' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('discovery')}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all relative ${activeTab === 'discovery'
                                            ? 'text-primary-700 bg-primary-50/50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Discovery
                                        {activeTab === 'discovery' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('casestudy')}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all relative ${activeTab === 'casestudy'
                                            ? 'text-primary-700 bg-primary-50/50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Case Study
                                        {activeTab === 'casestudy' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                                        )}
                                    </button>
                                </div>

                                {/* VIEW TOGGLE */}
                                <div className="px-2 pb-1 bg-white">
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('tabs')}
                                            className={`p-1.5 rounded-md transition-all ${viewMode === 'tabs' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="Tab View"
                                        >
                                            <LayoutTemplate className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="List View"
                                        >
                                            <LayoutList className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className={`flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 bg-gray-50/30 ${viewMode === 'list' && 'bg-white'}`}>
                                <div className={`max-w-4xl mx-auto space-y-6 ${viewMode === 'list' && 'max-w-none'}`}>

                                    {/* Brief Metadata Banner */}
                                    <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium text-gray-500">
                                        <span className="bg-white border border-gray-200 px-2 py-1 rounded-md">{generatedBrief.industry}</span>
                                        <span className="bg-white border border-gray-200 px-2 py-1 rounded-md">{generatedBrief.meetingType}</span>
                                        <span className="bg-white border border-gray-200 px-2 py-1 rounded-md">{generatedBrief.clientRole}</span>
                                    </div>

                                    {renderBriefContent()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BriefGenerator;

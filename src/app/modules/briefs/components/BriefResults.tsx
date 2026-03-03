import React, { useState, useEffect } from 'react';
import { Target, Send, FileText, MessageSquare, Lightbulb, CheckCircle2, BookOpen, ArrowRight, LayoutTemplate, LayoutList, ChevronUp, ChevronDown } from 'lucide-react';
import { GeneratedBrief } from '../constants';

interface BriefResultsProps {
    brief: GeneratedBrief;
}

type ResultTab = 'overview' | 'discovery' | 'market' | 'casestudy';
type ViewMode = 'tabs' | 'list';

const BriefResults: React.FC<BriefResultsProps> = ({ brief }) => {
    const [activeTab, setActiveTab] = useState<ResultTab>('overview');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        overview: true,
        discovery: true,
        market: true,
        casestudy: true
    });

    // Reset view state when brief changes
    useEffect(() => {
        setActiveTab('overview');
        setViewMode('list');
        setExpandedSections({
            overview: true,
            discovery: true,
            market: true,
            casestudy: true
        });
    }, [brief]);

    // Construct view mode side-effects if needed
    useEffect(() => {
        if (viewMode === 'list') {
            setExpandedSections({
                overview: true,
                discovery: true,
                market: true,
                casestudy: true
            });
        }
    }, [viewMode]);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const OverviewContent = ({ compact = false }) => (
        <>
            {compact ? (
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <Target className="w-3.5 h-3.5" />
                            Elevator Pitch
                        </h4>
                        <p className="text-sm font-medium text-gray-900 italic">
                            "{brief.elevatorPitch}"
                        </p>
                    </div>
                    {brief.context && (
                        <div className="pl-4 border-l-2 border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Context</h4>
                            <p className="text-xs text-gray-500">
                                {brief.context}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <Target className="w-32 h-32" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Send className="w-5 h-5" />
                            </div>
                            Elevator Pitch
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed relative z-10">
                            <p className="text-lg font-medium text-gray-900 leading-relaxed">
                                "{brief.elevatorPitch}"
                            </p>
                        </div>
                    </section>

                    {brief.context && (
                        <section className="bg-white p-5 rounded-xl border border-gray-100 mt-4 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Context Notes
                            </h3>
                            <p className="text-sm text-gray-600">{brief.context}</p>
                        </section>
                    )}
                </>
            )}
        </>
    );

    const DiscoveryContent = ({ compact = false }) => (
        <div className={compact ? "space-y-3" : "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"}>
            {!compact && (
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    Discovery Questions
                </h3>
            )}
            <div className="space-y-3">
                {brief.discoveryQuestions.map((q, i) => (
                    <div key={i} className="flex gap-3 group">
                        <div className={`flex-shrink-0 ${compact ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-xs'} flex items-center justify-center bg-teal-50 text-teal-700 font-bold rounded-full border border-teal-100 mt-0.5`}>
                            {i + 1}
                        </div>
                        <p className="text-sm text-gray-700 leading-snug group-hover:text-gray-900 transition-colors">{q}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const MarketContent = ({ compact = false }) => (
        <div className={compact ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid gap-6"}>
            <div className={`${compact ? '' : 'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all'}`}>
                {!compact && (
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <Lightbulb className="w-5 h-5" />
                        </div>
                        Industry Insights
                    </h3>
                )}
                {compact && (
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Insights
                    </h4>
                )}
                <ul className="space-y-3">
                    {brief.industryInsights.map((ins, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 leading-snug">{ins}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={`${compact ? '' : 'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all'}`}>
                {!compact && (
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <Target className="w-5 h-5" />
                        </div>
                        Competitive Positioning
                    </h3>
                )}
                {compact && (
                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Target className="w-3.5 h-3.5" />
                        Positioning
                    </h4>
                )}
                <ul className="space-y-3">
                    {brief.positioning.map((p, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-2" />
                            <span className="text-sm text-gray-700 leading-snug">{p}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const CaseStudyContent = ({ compact = false }) => (
        <div className={`${compact ? '' : 'bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full'}`}>
            {!compact && (
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Relevant Case Study</h3>
                        <p className="text-xs text-gray-500 font-medium">Success story matching your criteria</p>
                    </div>
                </div>
            )}

            {brief.caseStudy && (
                <>
                    <div className={`rounded-xl ${compact ? 'bg-white/60 p-4 mb-4 border border-violet-100/50' : 'bg-gray-50 p-6 mb-6 border border-gray-100'}`}>
                        <h4 className="text-base font-bold text-gray-900 mb-2">{brief.caseStudy.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{brief.caseStudy.summary}</p>
                    </div>

                    <div>
                        {!compact && <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Key Metrics</h5>}
                        {compact && <h5 className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Outcomes</h5>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {brief.caseStudy.metrics.map((m, i) => (
                                <div key={i} className={`rounded-lg border shadow-sm flex items-center gap-3 ${compact ? 'bg-green-50/50 border-green-100 p-2' : 'bg-white border-gray-200 p-3'}`}>
                                    <div className={`w-1 h-8 rounded-full ${compact ? 'bg-green-400' : 'bg-green-500'}`}></div>
                                    <span className="text-sm font-semibold text-gray-900">{m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return (
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
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                            title="List View"
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('tabs')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'tabs' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Tab View"
                        >
                            <LayoutTemplate className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 bg-gray-50/30 ${viewMode === 'list' && 'bg-white'}`}>
                <div className={`max-w-4xl mx-auto space-y-6 ${viewMode === 'list' && 'max-w-none'}`}>

                    {/* Brief Metadata Banner */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium text-gray-500">
                        <span className="bg-white border border-gray-200 px-2 py-1 rounded-md">{brief.industry}</span>
                        <span className="bg-white border border-gray-200 px-2 py-1 rounded-md">{brief.meetingType}</span>
                        <span className="bg-white border border-gray-200 px-2 py-1 rounded-md">{brief.clientRole}</span>
                    </div>

                    {viewMode === 'tabs' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {activeTab === 'overview' && <OverviewContent />}
                            {activeTab === 'market' && <MarketContent />}
                            {activeTab === 'discovery' && <DiscoveryContent />}
                            {activeTab === 'casestudy' && <CaseStudyContent />}
                        </div>
                    ) : (
                        <div className="pb-10 min-h-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Overview Section - Indigo Theme */}
                                <div className="border border-indigo-100 rounded-xl bg-indigo-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                                    <button
                                        onClick={() => toggleSection('overview')}
                                        className="w-full flex items-center justify-between p-4 bg-indigo-50/50 hover:bg-indigo-100/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm border border-indigo-100">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-indigo-900 text-base block">Brief & Pitch</span>
                                                <span className="text-xs text-indigo-600/80 font-medium">Key message and context</span>
                                            </div>
                                        </div>
                                        {expandedSections.overview ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-indigo-400" />}
                                    </button>
                                    {expandedSections.overview && (
                                        <div className="p-5 border-t border-indigo-100">
                                            <OverviewContent compact={true} />
                                        </div>
                                    )}
                                </div>

                                {/* Market Section - Amber Theme */}
                                <div className="border border-amber-100 rounded-xl bg-amber-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                                    <button
                                        onClick={() => toggleSection('market')}
                                        className="w-full flex items-center justify-between p-4 bg-amber-50/50 hover:bg-amber-100/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white text-amber-600 rounded-lg shadow-sm border border-amber-100">
                                                <Lightbulb className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-amber-900 text-base block">Market Intelligence</span>
                                                <span className="text-xs text-amber-700/80 font-medium">Trends and positioning</span>
                                            </div>
                                        </div>
                                        {expandedSections.market ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
                                    </button>
                                    {expandedSections.market && (
                                        <div className="p-5 border-t border-amber-100">
                                            <MarketContent compact={true} />
                                        </div>
                                    )}
                                </div>

                                {/* Discovery Section - Teal Theme */}
                                <div className="border border-teal-100 rounded-xl bg-teal-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                                    <button
                                        onClick={() => toggleSection('discovery')}
                                        className="w-full flex items-center justify-between p-4 bg-teal-50/50 hover:bg-teal-100/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white text-teal-600 rounded-lg shadow-sm border border-teal-100">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-teal-900 text-base block">Discovery Strategy</span>
                                                <span className="text-xs text-teal-700/80 font-medium">Questions to ask</span>
                                            </div>
                                        </div>
                                        {expandedSections.discovery ? <ChevronUp className="w-5 h-5 text-teal-400" /> : <ChevronDown className="w-5 h-5 text-teal-400" />}
                                    </button>
                                    {expandedSections.discovery && (
                                        <div className="p-5 border-t border-teal-100">
                                            <DiscoveryContent compact={true} />
                                        </div>
                                    )}
                                </div>

                                {/* Case Study Section - Violet Theme */}
                                <div className="border border-violet-100 rounded-xl bg-violet-50/30 overflow-hidden shadow-sm hover:shadow-md transition-all h-fit">
                                    <button
                                        onClick={() => toggleSection('casestudy')}
                                        className="w-full flex items-center justify-between p-4 bg-violet-50/50 hover:bg-violet-100/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white text-violet-600 rounded-lg shadow-sm border border-violet-100">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-violet-900 text-base block">Case Study</span>
                                                <span className="text-xs text-violet-700/80 font-medium">Relevant proof point</span>
                                            </div>
                                        </div>
                                        {expandedSections.casestudy ? <ChevronUp className="w-5 h-5 text-violet-400" /> : <ChevronDown className="w-5 h-5 text-violet-400" />}
                                    </button>
                                    {expandedSections.casestudy && (
                                        <div className="p-5 border-t border-violet-100">
                                            <CaseStudyContent compact={true} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BriefResults;

import React, { useEffect, useMemo, useState } from 'react';
import { BriefHistoryItem, fetchBriefHistory } from '../api';
import { clientRoles, industries } from '../constants';
import { Calendar, RefreshCcw, Clock, Sparkles, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import BriefResults from './BriefResults';

const formatDate = (value: string | null) => {
    if (!value) return 'Date not available';
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Date not available' : date.toLocaleString();
};

interface BriefHistoryProps {
    defaultIndustry?: string;
    selectionLocked?: boolean;
    lockedIndustry?: string;
    onReset?: () => void;
}

const BriefHistory: React.FC<BriefHistoryProps> = ({ defaultIndustry, selectionLocked, lockedIndustry, onReset }) => {
    const [briefs, setBriefs] = useState<BriefHistoryItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ industry?: string; clientRole?: string }>(() => (defaultIndustry ? { industry: defaultIndustry } : {}));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showList, setShowList] = useState(true);

    const selectedBrief = useMemo(
        () => briefs.find(b => b.id === selectedId) || briefs[0],
        [briefs, selectedId]
    );

    const loadBriefs = async () => {
        setLoading(true);
        setError(null);
        try {
            const items = await fetchBriefHistory({
                industry: filters.industry || undefined,
                clientRole: filters.clientRole || undefined
            });
            setBriefs(items);
            if (items.length) {
                if (!selectedId || !items.find(i => i.id === selectedId)) {
                    setSelectedId(items[0].id);
                }
            } else {
                setSelectedId(null);
            }
        } catch (err) {
            console.error('Failed to load briefs', err);
            setError('Unable to load your saved briefs right now.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBriefs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.industry, filters.clientRole]);

    useEffect(() => {
        if (defaultIndustry) {
            setFilters(prev => ({ ...prev, industry: defaultIndustry }));
        }
    }, [defaultIndustry]);

    useEffect(() => {
        if (selectionLocked && lockedIndustry) {
            setFilters(prev => ({ ...prev, industry: lockedIndustry }));
        }
    }, [selectionLocked, lockedIndustry]);

    return (
        <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowList(!showList)}
                        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${showList ? 'text-primary-600 bg-gray-50' : 'text-gray-400'}`}
                        title={showList ? "Hide List" : "Show List"}
                    >
                        {showList ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-primary-600" />
                            Brief History
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Review and reuse your past strategy briefs</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={loadBriefs}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-60 transition-colors text-sm font-medium"
                    disabled={loading}
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters Bar */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showList ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</label>
                                {selectionLocked && onReset && (
                                    <button
                                        onClick={onReset}
                                        className="text-[10px] text-primary-600 hover:text-primary-800 font-medium hover:underline"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>
                            <select
                                className={`w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all ${selectionLocked ? 'cursor-not-allowed opacity-70' : ''}`}
                                value={filters.industry || ''}
                                onChange={e => setFilters(prev => ({ ...prev, industry: e.target.value || undefined }))}
                                disabled={selectionLocked}
                            >
                                <option value="">All industries</option>
                                {industries.map(ind => (
                                    <option key={ind} value={ind}>{ind}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client Role</label>
                            <select
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                                value={filters.clientRole || ''}
                                onChange={e => setFilters(prev => ({ ...prev, clientRole: e.target.value || undefined }))}
                            >
                                <option value="">All roles</option>
                                {clientRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <div className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl px-4 py-2 shadow flex items-center justify-between">
                                <span className="text-xs uppercase tracking-wide text-white/80 font-semibold">Saved Briefs</span>
                                <span className="text-xl font-bold">{briefs.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex-1 flex gap-0 min-h-0 overflow-hidden transition-all duration-300">
                {/* Left Column: Brief List */}
                <div className={`
                    flex flex-col h-full min-h-0 transition-all duration-300 ease-in-out
                    ${showList ? 'w-full lg:w-1/3 opacity-100 mr-6' : 'w-0 opacity-0 overflow-hidden mr-0'}
                    bg-white rounded-2xl shadow-sm border border-gray-100
                `}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="font-semibold text-gray-900 text-sm">Select a Brief</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-200">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-3">
                                <Loader2Icon className="w-6 h-6 animate-spin" />
                                <span className="text-sm">Loading history...</span>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center">
                                {error}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {briefs.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${selectedBrief?.id === item.id
                                            ? 'border-primary-200 bg-primary-50/50 shadow-sm ring-1 ring-primary-100'
                                            : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${selectedBrief?.id === item.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 group-hover:bg-white'
                                                    }`}>
                                                    {item.industry}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                {formatDate(item.createdAt).split(',')[0]}
                                            </span>
                                        </div>
                                        <h3 className={`font-semibold text-sm mb-1 ${selectedBrief?.id === item.id ? 'text-primary-900' : 'text-gray-900'
                                            }`}>
                                            {item.meetingType}
                                        </h3>
                                        <div className="flex items-center text-xs text-gray-500 mb-2">
                                            <span className="truncate max-w-[180px]">{item.clientRole}</span>
                                        </div>
                                        {item.elevatorPitch && (
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed opacity-80">
                                                {item.elevatorPitch}
                                            </p>
                                        )}
                                    </button>
                                ))}
                                {!briefs.length && !loading && (
                                    <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                                        <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-sm">No briefs found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Brief Details */}
                <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                    {selectedBrief ? (
                        <div className="flex flex-col h-full">
                            <div className="flex-shrink-0 border-b border-gray-100 bg-gray-50/30 px-6 py-3 flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Generated on {formatDate(selectedBrief.createdAt)}
                                </span>
                                {/* We could add actions here like 'Export' or 'Copy' later */}
                            </div>

                            <div className="flex-1 overflow-hidden relative">
                                <BriefResults brief={selectedBrief} />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                <Clock className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="max-w-xs mx-auto text-sm">
                                Select a brief from the list to view its strategy and insights.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper component for loading spinner locally
const Loader2Icon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default BriefHistory;

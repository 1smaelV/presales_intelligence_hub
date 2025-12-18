import { useEffect, useMemo, useState } from 'react';
import { BriefHistoryItem, fetchBriefHistory } from '../api';
import { clientRoles, industries } from '../constants';
import { Calendar, RefreshCcw, Clock } from 'lucide-react';

const formatDate = (value: string | null) => {
    if (!value) return 'Date not available';
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Date not available' : date.toLocaleString();
};

interface BriefHistoryProps {
    defaultIndustry?: string;
}

const BriefHistory: React.FC<BriefHistoryProps> = ({ defaultIndustry }) => {
    const [briefs, setBriefs] = useState<BriefHistoryItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ industry?: string; clientRole?: string }>(() => (defaultIndustry ? { industry: defaultIndustry } : {}));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                setSelectedId(items[0].id);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Brief History</h1>
                    <p className="text-gray-600">Review, filter, and reuse the most recent executive briefs.</p>
                </div>
                <button
                    type="button"
                    onClick={loadBriefs}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-60"
                    disabled={loading}
                >
                    <RefreshCcw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800"
                            value={filters.industry || ''}
                            onChange={e => setFilters(prev => ({ ...prev, industry: e.target.value || undefined }))}
                        >
                            <option value="">All industries</option>
                            {industries.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client Role</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800"
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
                        <div className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl p-4 shadow">
                            <p className="text-xs uppercase tracking-wide text-white/80 font-semibold">Recent briefs</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-2xl font-bold">{briefs.length}</p>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{loading ? 'Updating...' : 'Live sync'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {error && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="font-semibold text-gray-800">Recent Briefs</span>
                        <span>{briefs.length ? `${briefs.length} saved` : 'No briefs yet'}</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-h-[640px] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-10 text-gray-500 gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-500"></span>
                                Loading history...
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {briefs.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${selectedBrief?.id === item.id
                                            ? 'border-primary-200 bg-primary-50 shadow-sm'
                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full">
                                                    {item.industry}
                                                </span>
                                                <span className="px-2 py-0.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                                                    {item.clientRole}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm font-semibold text-gray-900">{item.meetingType}</p>
                                        {item.elevatorPitch && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{item.elevatorPitch}</p>
                                        )}
                                    </button>
                                ))}
                                {!briefs.length && !loading && (
                                    <div className="py-8 text-center text-gray-500">
                                        No briefs found. Generate one to see it here.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 min-h-[400px]">
                        {selectedBrief ? (
                            <div className="space-y-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Generated on</p>
                                        <p className="font-semibold text-gray-900">{formatDate(selectedBrief.createdAt)}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-primary-50 text-primary-700 font-semibold text-xs rounded-full border border-primary-100">
                                            {selectedBrief.industry}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-xs rounded-full border border-gray-200">
                                            {selectedBrief.clientRole}
                                        </span>
                                        <span className="px-3 py-1 bg-green-50 text-green-700 font-semibold text-xs rounded-full border border-green-100">
                                            {selectedBrief.meetingType}
                                        </span>
                                    </div>
                                </div>

                                {selectedBrief.elevatorPitch && (
                                    <div className="bg-gradient-to-r from-primary-900 to-indigo-900 text-white rounded-xl p-5 shadow">
                                        <p className="text-xs uppercase tracking-wide text-white/80 font-semibold">Elevator pitch</p>
                                        <p className="mt-2 text-lg leading-relaxed">{selectedBrief.elevatorPitch}</p>
                                    </div>
                                )}

                                {selectedBrief.discoveryQuestions?.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-bold text-gray-900">Discovery Questions</h3>
                                            <span className="text-xs text-gray-500">{selectedBrief.discoveryQuestions.length} saved</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedBrief.discoveryQuestions.map((q, idx) => (
                                                <div key={idx} className="border border-gray-200 rounded-lg p-3 text-sm text-gray-800 bg-gray-50">
                                                    {q}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedBrief.industryInsights?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Industry Insights</h3>
                                        <div className="space-y-2">
                                            {selectedBrief.industryInsights.map((ins, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-gray-800">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                                                    <p className="text-sm leading-snug">{ins}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedBrief.positioning?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Positioning</h3>
                                        <ul className="list-disc list-inside text-gray-800 space-y-1">
                                            {selectedBrief.positioning.map((pos, idx) => (
                                                <li key={idx} className="text-sm">{pos}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedBrief.caseStudy && (
                                    <div className="border border-gray-200 rounded-xl p-4">
                                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Case Study</p>
                                        <h4 className="text-lg font-bold text-gray-900 mt-1">{selectedBrief.caseStudy.title}</h4>
                                        {selectedBrief.caseStudy.summary && (
                                            <p className="text-gray-700 mt-2">{selectedBrief.caseStudy.summary}</p>
                                        )}
                                        {selectedBrief.caseStudy.metrics?.length > 0 && (
                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {selectedBrief.caseStudy.metrics.map((m, idx) => (
                                                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedBrief.context && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <p className="text-xs uppercase tracking-wide text-amber-800 font-semibold">Client Context</p>
                                        <p className="text-amber-900 mt-2 text-sm">{selectedBrief.context}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Select a brief from the list to view details.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BriefHistory;

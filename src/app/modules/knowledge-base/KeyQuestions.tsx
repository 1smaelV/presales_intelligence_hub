import { useEffect, useMemo, useState } from 'react';
import { industries, clientRoles } from '../briefs/constants';
import { fetchIndustryQuestions, RoleCategories } from '../briefs/api';
import { getDiscoveryQuestions } from '../briefs/utils';

const KeyQuestions = () => {
    const [selectedIndustry, setSelectedIndustry] = useState(industries[0]);
    const [roleCategories, setRoleCategories] = useState<RoleCategories[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalQuestions, setModalQuestions] = useState<string[]>([]);

    const fallbackCategory = useMemo(() => {
        const local = getDiscoveryQuestions(selectedIndustry || '').slice(0, 6);
        return [{ role: selectedRole || 'All Roles', categories: [{ name: 'General', questions: local }] }];
    }, [selectedIndustry, selectedRole]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (!selectedIndustry) return;
            setLoading(true);
            setError(null);
            try {
                const result = await fetchIndustryQuestions(selectedIndustry, selectedRole || undefined);
                if (isMounted) {
                    setRoleCategories(result);
                }
            } catch (err) {
                console.error('Failed to fetch industry questions', err);
                if (isMounted) setError('Could not load saved discovery questions for this industry.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => {
            isMounted = false;
        };
    }, [selectedIndustry, selectedRole]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Key Discovery Questions</h1>
                <p className="text-gray-600">Strategic questions to uncover opportunities and guide presales conversations</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Universal Discovery Questions</h2>
                <div className="space-y-4">
                    {getDiscoveryQuestions('').slice(0, 5).map((q, i) => (
                        <div key={i} className="border-l-2 border-blue-300 pl-4 py-2">
                            <p className="font-semibold text-gray-900">{q}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Healthcare', 'Financial Services', 'Retail', 'Manufacturing'].map((ind) => (
                    <div key={ind} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-blue-900 mb-4">{ind}-Specific</h2>
                        <ul className="space-y-3">
                            {getDiscoveryQuestions(ind).slice(5).map((q, i) => (
                                <li key={i} className="text-gray-700">- {q}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white rounded-2xl p-6 shadow-xl border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <p className="text-sm uppercase tracking-wide text-blue-200 font-semibold">Dynamic library</p>
                        <h2 className="text-2xl font-bold">Industry-Curated Discovery Questions</h2>
                        <p className="text-blue-100">Pulled live from the knowledge base collection to match your industry.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                            <label className="text-xs uppercase tracking-wide text-blue-100 font-semibold block mb-2">Industry</label>
                            <select
                                className="bg-blue-800 text-white px-3 py-2 rounded-md border border-white/20 focus:border-white/40 focus:outline-none min-w-[200px]"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                {industries.map(ind => (
                                    <option key={ind} value={ind}>{ind}</option>
                                ))}
                            </select>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                            <label className="text-xs uppercase tracking-wide text-blue-100 font-semibold block mb-2">Client Role</label>
                            <select
                                className="bg-blue-800 text-white px-3 py-2 rounded-md border border-white/20 focus:border-white/40 focus:outline-none min-w-[200px]"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">All roles</option>
                                {clientRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-950/60 border border-white/10 rounded-xl p-4">
                    {loading ? (
                        <div className="flex items-center gap-3 text-blue-100">
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/40 border-t-white"></span>
                            <span className="text-sm font-medium">Loading discovery questions...</span>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 bg-amber-100 text-amber-900 px-4 py-3 rounded-lg border border-amber-300">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {(roleCategories.length ? roleCategories : fallbackCategory).map((roleEntry, roleIdx) => (
                                    <div key={roleEntry.role} className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                        <div className="px-4 py-3 flex items-center justify-between" style={{ background: ['#1e3a8a', '#4338ca', '#0f766e', '#9a3412'][roleIdx % 4] }}>
                                            <div className="text-white font-semibold text-sm flex items-center gap-2">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-white/80"></span>
                                                {roleEntry.role}
                                            </div>
                                            <span className="text-white/80 text-xs uppercase tracking-wide">Role</span>
                                        </div>
                                        <div className="bg-white/5 p-4 grid grid-cols-1 gap-4">
                                            {roleEntry.categories.map(cat => (
                                                <div key={cat.name} className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-base font-semibold text-white">{cat.name}</h3>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full border border-white/10 text-white/80">
                                                            {cat.questions.length} Qs
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {cat.questions.slice(0, 10).map((q, idx) => (
                                                            <div key={idx} className="flex items-start gap-2">
                                                                <span className="mt-1 h-2 w-2 rounded-full bg-sky-300"></span>
                                                                <p className="text-sm text-blue-50 leading-snug">{q}</p>
                                                            </div>
                                                        ))}
                                                        {cat.questions.length > 10 && (
                                                            <button
                                                                type="button"
                                                                className="text-xs font-semibold text-blue-200 hover:text-white inline-flex items-center gap-1"
                                                                onClick={() => {
                                                                    setModalTitle(`${roleEntry.role} · ${cat.name}`);
                                                                    setModalQuestions(cat.questions);
                                                                    setModalOpen(true);
                                                                }}
                                                            >
                                                                Read more +
                                                            </button>
                                                        )}
                                                        {!cat.questions.length && (
                                                            <p className="text-sm text-blue-100/80">No saved questions for this category yet.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-gray-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-blue-100">Full question list</p>
                                <h3 className="text-lg font-semibold">{modalTitle}</h3>
                            </div>
                            <button
                                type="button"
                                className="text-white/80 hover:text-white text-sm font-semibold"
                                onClick={() => setModalOpen(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-3">
                            {modalQuestions.map((q, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <span className="mt-1 text-blue-600 font-semibold">{idx + 1}.</span>
                                    <p className="text-gray-800 leading-snug">{q}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeyQuestions;

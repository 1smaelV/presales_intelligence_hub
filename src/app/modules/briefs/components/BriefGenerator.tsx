import React from 'react';
import { industries, meetingTypes, clientRoles, BriefData, GeneratedBrief } from '../constants';
import { generateBriefData } from '../utils';

interface BriefGeneratorProps {
    briefData: BriefData;
    setBriefData: (data: BriefData) => void;
    generatedBrief: GeneratedBrief | null;
    setGeneratedBrief: (brief: GeneratedBrief | null) => void;
}

const BriefGenerator: React.FC<BriefGeneratorProps> = ({
    briefData,
    setBriefData,
    generatedBrief,
    setGeneratedBrief
}) => {

    const handleGenerateBrief = () => {
        const brief = generateBriefData(briefData);
        setGeneratedBrief(brief);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Brief Generator</h1>
                <p className="text-gray-600">Create personalized prep materials for your next meeting</p>
            </div>
            {!generatedBrief ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                            <select className="w-full border border-gray-300 rounded-lg px-4 py-3" value={briefData.industry} onChange={(e) => setBriefData({ ...briefData, industry: e.target.value })}>
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
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400" onClick={handleGenerateBrief} disabled={!briefData.industry || !briefData.meetingType || !briefData.clientRole}>
                            Generate Executive Brief
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-blue-900">Brief Generated for:</p>
                            <p className="text-blue-800">{generatedBrief.industry} • {generatedBrief.meetingType} • {generatedBrief.clientRole}</p>
                        </div>
                        <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium" onClick={() => setGeneratedBrief(null)}>New Brief</button>
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
                                    <span className="text-green-600 mr-3">•</span>
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
                                    <span className="text-purple-600 mr-3">✓</span>
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
                                {generatedBrief.caseStudy.metrics.map((m, i) => <li key={i} className="text-sm text-gray-600">• {m}</li>)}
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

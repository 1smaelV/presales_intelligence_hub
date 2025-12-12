import { getDiscoveryQuestions } from '../briefs/utils';

const KeyQuestions = () => {
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
                                <li key={i} className="text-gray-700">• {q}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyQuestions;

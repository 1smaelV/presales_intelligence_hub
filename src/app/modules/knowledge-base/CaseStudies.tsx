const CaseStudies = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Studies & Example Wins</h1>
                <p className="text-gray-600">Industry-specific success stories and transformation examples</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Ready for Your Materials</h3>
                <p className="text-blue-800">This section is structured and ready for your case studies.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Healthcare', 'Financial Services', 'Retail', 'Manufacturing'].map((ind, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{ind}</span>
                            <span className="text-sm text-gray-500">Template</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Case Study Template #{idx + 1}</h3>
                        <p className="text-gray-600 mb-4">Your case study content will be displayed here with full formatting and metrics.</p>
                        <div className="bg-gray-50 rounded p-4 text-sm text-gray-600">
                            <p className="font-semibold mb-2">Sample Metrics Format:</p>
                            <p>• Key metric placeholder</p>
                            <p>• ROI and timeline data</p>
                            <p>• Business impact summary</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaseStudies;

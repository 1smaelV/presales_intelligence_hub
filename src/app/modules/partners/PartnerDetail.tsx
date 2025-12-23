
import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface UseCase {
    title: string;
    description: string;
    imageUrl: string;
}

interface CaseStudy {
    title: string;
    summary: string;
    result: string;
}

export interface PartnerData {
    id: number;
    name: string;
    logo: string;
    description: string;
    useCases: UseCase[];
    caseStudies: CaseStudy[];
}

interface PartnerDetailProps {
    partner: PartnerData;
    onBack: () => void;
}

const PartnerDetail: React.FC<PartnerDetailProps> = ({ partner, onBack }) => {
    const [activeTab, setActiveTab] = useState<'useCases' | 'caseStudies'>('useCases');
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % partner.useCases.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + partner.useCases.length) % partner.useCases.length);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Back Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4">
                    <img src={partner.logo} alt={partner.name} className="h-8 max-w-[120px] object-contain" />
                    <h1 className="text-2xl font-bold text-gray-900">{partner.name} Integration</h1>
                </div>
            </div>

            {/* Overview Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Overview</h2>
                <p className="text-gray-600 leading-relaxed max-w-3xl">
                    {partner.description}
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('useCases')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'useCases'
                            ? 'text-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Use Cases
                    {activeTab === 'useCases' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('caseStudies')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'caseStudies'
                            ? 'text-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Case Studies
                    {activeTab === 'caseStudies' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'useCases' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="relative bg-black/5 rounded-2xl overflow-hidden aspect-video md:aspect-[21/9] group">
                            {/* Carousel Image */}
                            <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                {partner.useCases.map((useCase, index) => (
                                    <div key={index} className="min-w-full h-full relative">
                                        <img
                                            src={useCase.imageUrl}
                                            alt={useCase.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                                            <h3 className="text-2xl font-bold mb-2">{useCase.title}</h3>
                                            <p className="text-white/90 max-w-2xl">{useCase.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Controls */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                {partner.useCases.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            {partner.useCases.map((useCase, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`text-left p-4 rounded-xl border transition-all ${currentSlide === idx
                                            ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-100'
                                            : 'bg-white border-gray-100 hover:border-gray-300'
                                        }`}
                                >
                                    <h4 className={`font-semibold mb-1 ${currentSlide === idx ? 'text-primary-900' : 'text-gray-900'}`}>
                                        {useCase.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 line-clamp-2">{useCase.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'caseStudies' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                        {partner.caseStudies.map((study, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex gap-2 mb-3">
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">Success Story</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{study.summary}</p>
                                <div className="pt-4 border-t border-gray-50">
                                    <p className="text-sm font-medium text-gray-900">Key Result:</p>
                                    <p className="text-primary-600 font-bold">{study.result}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerDetail;

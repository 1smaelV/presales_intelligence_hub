import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

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
    tagline?: string;
}

interface PartnerDetailProps {
    partner: PartnerData;
    onBack: () => void;
}

const PartnerDetail: React.FC<PartnerDetailProps> = ({ partner, onBack }) => {
    const [activeTab, setActiveTab] = useState<'useCases' | 'caseStudies'>('useCases');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [viewImage, setViewImage] = useState<string | null>(null);
    const [cardStartIndex, setCardStartIndex] = useState(0);

    const nextCard = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCardStartIndex((prev) => (prev + 1) % partner.useCases.length);
    };

    const prevCard = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCardStartIndex((prev) => (prev - 1 + partner.useCases.length) % partner.useCases.length);
    };

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextIndex = (currentSlide + 1) % partner.useCases.length;
        setCurrentSlide(nextIndex);
        setCardStartIndex(nextIndex);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        const prevIndex = (currentSlide - 1 + partner.useCases.length) % partner.useCases.length;
        setCurrentSlide(prevIndex);
        setCardStartIndex(prevIndex);
    };

    return (
        <>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Overview</h2>
                    <p className="text-gray-600 leading-relaxed w-full">
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
                <div className="min-h-[200px]">
                    {activeTab === 'useCases' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="relative bg-gray-100/50 rounded-xl overflow-hidden aspect-video md:aspect-[4/1] group">
                                {/* Carousel Track */}
                                <div
                                    className="absolute top-0 bottom-0 left-0 right-0 flex items-center transition-transform duration-500 ease-out will-change-transform"
                                    style={{ transform: `translateX(${15 - (currentSlide * 70)}%)` }}
                                >
                                    {partner.useCases.map((useCase, index) => (
                                        <div
                                            key={index}
                                            className={`
                                                w-[70%] h-[90%] flex-shrink-0 px-3 transition-all duration-500 ease-out
                                                ${index === currentSlide
                                                    ? 'opacity-100 scale-100 z-10'
                                                    : 'opacity-40 scale-90 hover:opacity-60 cursor-pointer z-0 grayscale-[0.3]'
                                                }
                                            `}
                                            onClick={(e) => {
                                                if (index !== currentSlide) {
                                                    e.stopPropagation();
                                                    setCurrentSlide(index);
                                                    setCardStartIndex(index);
                                                }
                                            }}
                                        >
                                            <div
                                                className={`
                                                    relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black
                                                    ${index === currentSlide ? 'cursor-zoom-in ring-1 ring-white/20' : ''}
                                                `}
                                                onClick={() => index === currentSlide && setViewImage(useCase.imageUrl)}
                                            >
                                                <img
                                                    src={useCase.imageUrl}
                                                    alt={useCase.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                                />

                                                {/* Text Overlay - Only active */}
                                                <div
                                                    className={`
                                                        absolute inset-0 flex flex-col justify-end p-4 pointer-events-none transition-opacity duration-500 delay-100
                                                        ${index === currentSlide ? 'opacity-100' : 'opacity-0'}
                                                    `}
                                                >
                                                    <div
                                                        className="backdrop-blur-md border-l-4 border-primary-500 p-3 rounded-r-lg max-w-md shadow-lg transform translate-y-0 transition-transform duration-500"
                                                        style={{ backgroundColor: 'rgba(0, 95, 107, 0.5)' }}
                                                    >
                                                        <h3 className="text-lg font-bold mb-0.5 text-white">{useCase.title}</h3>
                                                        <p className="text-white/90 text-xs leading-relaxed">{useCase.description}</p>
                                                    </div>
                                                </div>

                                                {/* Zoom Cue Overlay - Only active */}
                                                {index === currentSlide && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
                                                        <div
                                                            className="backdrop-blur-sm p-3 rounded-full mb-2 shadow-lg"
                                                            style={{ backgroundColor: '#005f6b' }}
                                                        >
                                                            <ZoomIn className="w-8 h-8 text-white" />
                                                        </div>
                                                        <span
                                                            className="text-white font-medium text-sm tracking-wide drop-shadow-md px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
                                                            style={{ backgroundColor: 'rgba(0, 95, 107, 0.9)' }}
                                                        >
                                                            Click to Zoom
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Controls */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-[#005f6b]/80 hover:bg-[#005f6b] backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-lg border border-white/10 z-20 group-hover:bg-[#005f6b]"
                                >
                                    <ChevronLeft className="w-6 h-6 animate-pulse" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#005f6b]/80 hover:bg-[#005f6b] backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-lg border border-white/10 z-20 group-hover:bg-[#005f6b]"
                                >
                                    <ChevronRight className="w-6 h-6 animate-pulse" />
                                </button>

                                {/* Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                    {partner.useCases.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentSlide(idx);
                                                setCardStartIndex(idx);
                                            }}
                                            className={`
                                                h-1.5 rounded-full transition-all duration-300 
                                                ${currentSlide === idx ? 'bg-white w-8 shadow-glow' : 'bg-white/40 w-2 hover:bg-white/70'}
                                            `}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <button
                                    onClick={prevCard}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors flex-shrink-0"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[0, 1, 2].map((offset) => {
                                        const idx = (cardStartIndex + offset) % partner.useCases.length;
                                        const useCase = partner.useCases[idx];
                                        return (
                                            <button
                                                key={`${idx}-${offset}`}
                                                onClick={() => {
                                                    if (currentSlide === idx) {
                                                        setViewImage(useCase.imageUrl);
                                                    } else {
                                                        setCurrentSlide(idx);
                                                        setCardStartIndex(idx);
                                                    }
                                                }}
                                                className={`text-left p-4 rounded-xl border transition-all h-full ${currentSlide === idx
                                                    ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-100'
                                                    : 'bg-white border-gray-100 hover:border-gray-300'
                                                    }`}
                                            >
                                                <h4 className={`font-semibold mb-1 ${currentSlide === idx ? 'text-primary-900' : 'text-gray-900'}`}>
                                                    {useCase.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-2">{useCase.description}</p>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={nextCard}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors flex-shrink-0"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
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

            {/* Image Modal */}
            {viewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setViewImage(null)}
                >
                    <button
                        onClick={() => setViewImage(null)}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={viewImage}
                        alt="Full view"
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default PartnerDetail;

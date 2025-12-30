import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, ExternalLink, Monitor, Bot, Building2, FileText, Info } from 'lucide-react';

interface UseCase {
    title: string;
    description: string;
    imageUrl: string;
}

interface CaseStudy {
    title: string;
    summary: string;
    result: string;
    url?: string;
}

export interface PartnerData {
    id: number;
    name: string;
    logo: string;
    description: string;
    useCases: UseCase[];
    caseStudies: CaseStudy[];
    tagline?: string;
    stats?: {
        useCases: number;
        agents: number;
        industries: number;
    };
}

interface PartnerDetailProps {
    partner: PartnerData;
    onBack: () => void;
}

const PartnerDetail: React.FC<PartnerDetailProps> = ({ partner, onBack }) => {
    const [activeTab, setActiveTab] = useState<'useCases' | 'caseStudies'>('useCases');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [viewImage, setViewImage] = useState<string | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    // Get the currently viewed use case details
    const activeImageUseCase = viewImage ? partner.useCases.find(uc => uc.imageUrl === viewImage) : null;
    // const [cardStartIndex, setCardStartIndex] = useState(0);

    // const nextCard = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setCardStartIndex((prev) => (prev + 1) % partner.useCases.length);
    // };

    // const prevCard = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setCardStartIndex((prev) => (prev - 1 + partner.useCases.length) % partner.useCases.length);
    // };

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextIndex = (currentSlide + 1) % partner.useCases.length;
        setCurrentSlide(nextIndex);
        // setCardStartIndex(nextIndex);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        const prevIndex = (currentSlide - 1 + partner.useCases.length) % partner.useCases.length;
        setCurrentSlide(prevIndex);
        // setCardStartIndex(prevIndex);
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
                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-2">
                                {/* Use Cases - Amber */}
                                <div className="group bg-white py-2 px-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-[2.5] transition-transform duration-500 opacity-50" />
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        <div className="bg-amber-50 p-1.5 rounded-lg mb-1 group-hover:bg-amber-600 transition-colors duration-300">
                                            <FileText className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 leading-tight group-hover:text-amber-700 transition-colors">{partner.stats?.useCases ?? partner.useCases.length}</span>
                                        <span className="text-[10px] text-gray-500 font-medium group-hover:text-amber-600 transition-colors">Use Cases</span>
                                    </div>
                                </div>

                                {/* Agents - Purple */}
                                <div className="group bg-white py-2 px-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-[2.5] transition-transform duration-500 opacity-50" />
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        <div className="bg-purple-50 p-1.5 rounded-lg mb-1 group-hover:bg-purple-600 transition-colors duration-300">
                                            <Bot className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 leading-tight group-hover:text-purple-700 transition-colors">{partner.stats?.agents ?? 2}</span>
                                        <span className="text-[10px] text-gray-500 font-medium group-hover:text-purple-600 transition-colors">Agents</span>
                                    </div>
                                </div>

                                {/* Industries - Blue */}
                                <div className="group bg-white py-2 px-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-[2.5] transition-transform duration-500 opacity-50" />
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        <div className="bg-blue-50 p-1.5 rounded-lg mb-1 group-hover:bg-blue-600 transition-colors duration-300">
                                            <Building2 className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">{partner.stats?.industries ?? 1}</span>
                                        <span className="text-[10px] text-gray-500 font-medium group-hover:text-blue-600 transition-colors">Industries</span>
                                    </div>
                                </div>
                            </div>

                            {/* ... (carousel code omitted for brevity as it shouldn't change here, but I must be careful with replace_file_content range. I'll use separate replace calls if needed, but here I can just target the stats block if I narrow the range. The user query implies changes to stats cards AND case study cards. I will do 2 separate edits to be safe or one big block if they are close. They are far apart (lines 118 vs 286). I'll use multi_replace.) */}

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
                                                    // setCardStartIndex(index);
                                                }
                                            }}
                                        >
                                            <div
                                                className={`
                                                    relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black group/image
                                                    ${index === currentSlide ? 'cursor-zoom-in ring-1 ring-white/20' : ''}
                                                `}
                                                onClick={() => index === currentSlide && setViewImage(useCase.imageUrl)}
                                            >
                                                <img
                                                    src={useCase.imageUrl}
                                                    alt={useCase.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover/image:scale-105"
                                                />

                                                {/* Text Overlay - Only active */}
                                                <div
                                                    className={`
                                                        absolute inset-0 flex flex-col justify-end p-4 pointer-events-none transition-opacity duration-500 delay-100
                                                        ${index === currentSlide ? 'opacity-100 group-hover/image:opacity-0' : 'opacity-0'}
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
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
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
                                                // setCardStartIndex(idx);
                                            }}
                                            className={`
                                                h-1.5 rounded-full transition-all duration-300 
                                                ${currentSlide === idx ? 'bg-white w-8 shadow-glow' : 'bg-white/40 w-2 hover:bg-white/70'}
                                            `}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center my-3">
                                <div className="flex items-center gap-3 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm rounded-full transition-all hover:shadow-md hover:border-primary-200 cursor-default group/counter">
                                    <Monitor className="w-3.5 h-3.5 text-gray-400 group-hover/counter:text-primary-400 transition-colors" />
                                    <div key={currentSlide} className="flex items-center gap-1 text-sm font-bold animate-in slide-in-from-bottom-2 fade-in duration-300">
                                        <span className="text-primary-600">{currentSlide + 1}</span>
                                        <span className="text-gray-300 font-light mx-0.5">/</span>
                                        <span className="text-gray-500">{partner.useCases.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hidden Navigation Cards */}
                            {/* <div className="flex items-center gap-2 mt-4">
                                <button
                                    onClick={prevCard}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors flex-shrink-0"
                                >
                                    <ChevronLeft className="w-5 h-5" />

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
                            </div> */}
                        </div>
                    )}

                    {activeTab === 'caseStudies' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                            {partner.caseStudies.map((study, idx) => {
                                const CardContent = () => (
                                    <>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                                                    <FileText className="w-4 h-4 text-primary-600" />
                                                </div>
                                                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-sm cursor-default">Success Story</span>
                                            </div>
                                            {study.url && <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{study.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{study.summary}</p>
                                        <div className="pt-4 border-t border-gray-50">
                                            <p className="text-sm font-medium text-gray-900">Key Result:</p>
                                            <p className="text-primary-600 font-bold">{study.result}</p>
                                        </div>
                                    </>
                                );

                                if (study.url) {
                                    return (
                                        <a
                                            key={idx}
                                            href={study.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group block"
                                        >
                                            <CardContent />
                                        </a>
                                    );
                                }

                                return (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <CardContent />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {viewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => {
                        setViewImage(null);
                        setShowInfo(false);
                    }}
                >
                    <button
                        onClick={() => {
                            setViewImage(null);
                            setShowInfo(false);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/35 border border-white/30 text-red-300 hover:bg-red-600 hover:border-red-600 hover:text-white rounded-full transition-all z-50 backdrop-blur-md shadow-sm"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                        <img
                            src={viewImage}
                            alt="Full view"
                            className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200 pointer-events-auto cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Info Button & Card Container */}
                        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center justify-end pointer-events-none px-4">

                            {/* Description Card */}
                            {showInfo && activeImageUseCase && (
                                <div
                                    className="mb-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-2xl w-full mx-auto pointer-events-auto animate-in slide-in-from-bottom-5 duration-300 border border-white/20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{activeImageUseCase.title}</h3>
                                    <p className="text-gray-700 leading-relaxed">{activeImageUseCase.description}</p>
                                </div>
                            )}

                            {/* Info Toggle Button */}
                            {activeImageUseCase && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowInfo(!showInfo);
                                    }}
                                    className={`
                                        pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-full 
                                        backdrop-blur-md transition-all duration-300 shadow-lg border
                                        ${showInfo
                                            ? 'bg-white text-primary-600 border-white/50 hover:bg-gray-50'
                                            : 'bg-white/35 text-primary-200 border-white/30 hover:bg-primary-600 hover:border-primary-500 hover:text-white'
                                        }
                                    `}
                                >
                                    <Info className="w-5 h-5" />
                                    <span className="font-medium">{showInfo ? 'Hide Details' : 'Show Details'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PartnerDetail;

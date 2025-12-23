import React, { useState } from 'react';
import PartnerDetail, { PartnerData } from './PartnerDetail';
import useCase1 from '../../assets/use_case/Gemini_Generated_Image_3729o13729o13729.png';
import useCase2 from '../../assets/use_case/Gemini_Generated_Image_9wsu5n9wsu5n9wsu.png';
import useCase3 from '../../assets/use_case/Gemini_Generated_Image_au4kziau4kziau4k.png';

const partnersData: PartnerData[] = [
    {
        id: 1,
        name: 'Genesys',
        logo: 'https://www.genesys.com/wp-content/themes/genesys-kraken/logo/genesys-com-full-color.svg',
        description: 'Genesys provides the world\'s leading cloud customer experience and contact center solutions. By integrating with Genesys, we enable seamless agentic workflows that enhance customer interactions through real-time intelligence, automated routing, and personalized engagement strategies.',
        useCases: [
            {
                title: 'Intelligent Call Routing',
                description: 'Dynamically routes calls based on caller intent and agent availability using AI-driven scoring.',
                imageUrl: useCase1
            },
            {
                title: 'Real-Time Agent Assist',
                description: 'Proactively surfaces relevant knowledge base articles and talking points during live calls.',
                imageUrl: useCase2
            },
            {
                title: 'Automated Post-Call Analysis',
                description: 'Analyzes call transcripts to extract key insights, sentiment, and follow-up actions automatically.',
                imageUrl: useCase3
            }
        ],
        caseStudies: [
            {
                title: 'Global Bank Transformation',
                summary: 'A leading global bank reduced average handling time by 25% by implementing Genesys-integrated agent assist tools.',
                result: '25% Reduction in AHT'
            },
            {
                title: 'Retailer Customer Loyalty',
                summary: 'Major retailer saw a 15% increase in CSAT scores after deploying personalized routing strategies.',
                result: '+15% CSAT Score'
            }
        ]
    },
    { id: 2, name: 'Partner 2', logo: '', description: '', useCases: [], caseStudies: [] },
    { id: 3, name: 'Partner 3', logo: '', description: '', useCases: [], caseStudies: [] },
    { id: 4, name: 'Partner 4', logo: '', description: '', useCases: [], caseStudies: [] },
    { id: 5, name: 'Partner 5', logo: '', description: '', useCases: [], caseStudies: [] },
    { id: 6, name: 'Partner 6', logo: '', description: '', useCases: [], caseStudies: [] },
];

const Partners: React.FC = () => {
    const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);

    const activePartner = selectedPartnerId ? partnersData.find(p => p.id === selectedPartnerId) : null;

    if (activePartner) {
        return (
            <PartnerDetail
                partner={activePartner}
                onBack={() => setSelectedPartnerId(null)}
            />
        );
    }

    return (
        <div className="space-y-8 fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Partners</h1>
                <p className="text-gray-600">Technical overview and partner ecosystem</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partnersData.map((partner) => (
                    <div
                        key={partner.id}
                        className={`
              relative bg-white rounded-xl shadow-md border border-gray-100 p-8 
              flex items-center justify-center h-48 transition-all duration-300 
              group hover:shadow-xl hover:-translate-y-1
              ${partner.logo ? 'cursor-pointer' : 'opacity-60 border-dashed'}
            `}
                        onClick={() => {
                            if (partner.logo) {
                                setSelectedPartnerId(partner.id);
                            }
                        }}
                    >
                        {partner.logo ? (
                            <img
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                className="max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                        ) : (
                            <div className="text-gray-300 font-medium text-lg">Reserved</div>
                        )}

                        {partner.logo && (
                            <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-primary-100 transition-all duration-300" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Partners;

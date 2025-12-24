import React, { useState } from 'react';
import PartnerDetail, { PartnerData } from './PartnerDetail';
import useCase1 from '../../assets/use_case/Gemini_Generated_Image_3729o13729o13729.png';
import useCase2 from '../../assets/use_case/Gemini_Generated_Image_9wsu5n9wsu5n9wsu.png';
import useCase3 from '../../assets/use_case/Gemini_Generated_Image_au4kziau4kziau4k.png';
import useCase4 from '../../assets/use_case/Gemini_Generated_Image_cgb4nwcgb4nwcgb4.png';

const partnersData: PartnerData[] = [
    {
        id: 1,
        name: 'Genesys',
        logo: 'https://www.genesys.com/wp-content/themes/genesys-kraken/logo/genesys-com-full-color.svg',
        tagline: 'Market leader in the CCaaS (Contact Center as a Service) space, serving 8,000+ organizations globally.',
        description: 'A software company (founded 1990) that builds contact center and customer experience platforms. Primarily use to manage customer interactions across all channels—phone, chat, email, SMS, social media—from a single platform. Used by mid-to-large enterprises with significant customer service operations: banks, insurers, healthcare systems, retailers, telecoms, government agencies. Typically companies with 500+ agents or complex multi-channel needs.',
        useCases: [
            {
                title: 'Auto-summarization using generative AI',
                description: 'Create interaction summaries and interaction reviews for agents and supervisors based on contextual understanding, reducing effort and helping pinpoint key takeaways.',
                imageUrl: useCase1
            },
            {
                title: 'Real-time knowledge automation',
                description: 'Genesys Cloud Copilot uses AI to reduce tedious manual searches by following all customer interactions and presenting critical knowledge to agents at the moment of need.',
                imageUrl: useCase2
            },
            {
                title: 'Predictive Engagement',
                description: 'Proactively guide customers toward successful journeys on your website by applying machine learning, dynamic personas, and outcome probabilities to identify the right moments for proactive engagement through web chat or contextual help content screen pops.',
                imageUrl: useCase3
            },
            {
                title: 'Voice Payment',
                description: 'Ensure secure interactions with a PCI-compliant solution that protects credit card data submitted through automated IVR systems or to a live agent. It helps prevent fraud and preserve customer trust while still delivering a flexible and seamless customer experience.',
                imageUrl: useCase4
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
    { id: 2, name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1200px-Salesforce.com_logo.svg.png', description: 'Coming Soon', useCases: [], caseStudies: [] },
    { id: 3, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png', description: 'Coming Soon', useCases: [], caseStudies: [] },
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
                {partnersData.map((partner) => {
                    const isInteractive = partner.useCases.length > 0;
                    return (
                        <div
                            key={partner.id}
                            className={`
                  relative bg-white rounded-xl shadow-md border border-gray-100 p-8 
                  flex items-center justify-center h-48 transition-all duration-300 
                  ${isInteractive
                                    ? 'group hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                                    : 'opacity-80 cursor-default'
                                }
                  ${!partner.logo && 'opacity-60 border-dashed'}
                `}
                            onClick={() => {
                                if (isInteractive) {
                                    setSelectedPartnerId(partner.id);
                                }
                            }}
                        >
                            {partner.logo ? (
                                <div className="flex flex-col items-center justify-between h-full w-full">
                                    <div className="flex-1 flex items-center justify-center w-full">
                                        <img
                                            src={partner.logo}
                                            alt={`${partner.name} logo`}
                                            className={`max-h-12 max-w-[80%] object-contain transition-all duration-300 ${isInteractive ? 'filter grayscale group-hover:grayscale-0' : 'filter grayscale'}`}
                                        />
                                    </div>
                                    {partner.tagline && (
                                        <p className={`text-[10px] text-center w-full px-2 leading-relaxed transition-opacity duration-300 ${isInteractive ? 'text-gray-500 group-hover:text-gray-800' : 'text-gray-400'}`}>
                                            {partner.tagline}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-300 font-medium text-lg">Reserved</div>
                            )}

                            {isInteractive && (
                                <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-primary-100 transition-all duration-300" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Partners;

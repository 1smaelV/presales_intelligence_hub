import React, { useState } from 'react';
import PartnerDetail, { PartnerData } from './PartnerDetail';
import useCase1 from '../../assets/use_case/Gemini_Generated_Image_3729o13729o13729.png';
import useCase2 from '../../assets/use_case/Gemini_Generated_Image_cw9sctcw9sctcw9s.png';
import useCase3 from '../../assets/use_case/Gemini_Generated_Image_p8qfhhp8qfhhp8qf.png';
import useCase4 from '../../assets/use_case/Gemini_Generated_Image_cgb4nwcgb4nwcgb4.png';

const partnersData: PartnerData[] = [
    {
        id: 1,
        name: 'Genesys',
        logo: 'https://www.genesys.com/wp-content/themes/genesys-kraken/logo/genesys-com-full-color.svg',
        tagline: 'Market leader in the CCaaS (Contact Center as a Service) space, serving 8,000+ organizations globally.',
        description: 'A software company (founded 1990) that builds contact center and customer experience platforms. Primarily use to manage customer interactions across all channels—phone, chat, email, SMS, social media—from a single platform. Used by mid-to-large enterprises with significant customer service operations: banks, insurers, healthcare systems, retailers, telecoms, government agencies. Typically companies with 500+ agents or complex multi-channel needs.',
        stats: {
            useCases: 24,
            agents: 2,
            industries: 26
        },
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
                title: 'Revolutionizing Promise to Pay: Voice Bot transformed Collections',
                summary: 'Collections-specific voice bot that would proactively generate a promise to pay (PTP) from customers by enabling real-time notification and delivery of digital links',
                results: [
                    { icon: 'banknote', text: '$1M PTPs generated' },
                    { icon: 'phone', text: '150k additional volume handled' },
                    { icon: 'check', text: '75% of interactions closed' }
                ],
                url: 'https://cnxmail.sharepoint.com/:p:/r/sites/msteams_4bd7b9/Shared%20Documents/CCaaS%20Partners/Genesys/Sales%20and%20Marketing/Case%20Studies/CNX-BFS-083-2024-10-10%20Collections.pptx?d=w81bd5f0b76b74269a1bca96b1d3b9d53&csf=1&web=1&e=eYuShn'
            },
            {
                title: 'Strategic Innovations Redefining Customer Engagement',
                summary: 'Custom-built solution that meets rigorous RBI guidelines supporting a multi-skilled, multi-channel, multilingual dual-site hybrid contact center.',
                results: [
                    { icon: 'user', text: '100% disclosure compliance' },
                    { icon: 'banknote', text: '$1B+ new revenue for merchant network' },
                    { icon: 'trend', text: '2 years top performer US Fraud' }
                ],
                url: 'https://cnxmail.sharepoint.com/:p:/r/sites/msteams_4bd7b9/Shared%20Documents/CCaaS%20Partners/Genesys/Sales%20and%20Marketing/Case%20Studies/CNX-BFS-091.pptx?d=wf46615108efa4ae1a503affb42118f7c&csf=1&web=1&e=KAOJzA'
            },
            {
                title: 'Transforming VDI Solutions for Unmatched Resilience',
                summary: "Thorough assessment of client's environment to identify pain points within its WAH contact center solution. Recommended key WAH and telephony infrastructure improvements and consolidation, including CCaaS, Dual VDI environment and fully staffed help desk support through ServiceNow.",
                results: [
                    { icon: 'cpu', text: '9 months project from consulting to completion' },
                    { icon: 'clock', text: 'Reduction in downtime' },
                    { icon: 'banknote', text: '$5M+ in cost savings over 5 years' }
                ],
                url: 'https://cnxmail.sharepoint.com/:p:/r/sites/msteams_4bd7b9/Shared%20Documents/CCaaS%20Partners/Genesys/Sales%20and%20Marketing/Case%20Studies/CNX-REC-097-2024-10-16.pptx?d=w9eedf83c09694edebd95a2b26bdd5538&csf=1&web=1&e=qoEPDL'
            }
        ]
    },
    { id: 2, name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1200px-Salesforce.com_logo.svg.png', description: 'Coming Soon', useCases: [], caseStudies: [] },
    { id: 3, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png', description: 'Coming Soon', useCases: [], caseStudies: [] },
    { id: 4, name: 'Partner 4', logo: '', description: '', useCases: [], caseStudies: [] },
    { id: 5, name: 'Partner 5', logo: '', description: '', useCases: [], caseStudies: [] },
    { id: 6, name: 'Partner 6', logo: '', description: '', useCases: [], caseStudies: [] },
];

interface PartnersProps {
    route?: string;
}

const Partners: React.FC<PartnersProps> = ({ route }) => {
    const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);

    React.useEffect(() => {
        if (route && route.includes('/')) {
            const partnerName = route.split('/')[1];
            const partner = partnersData.find(p => p.name.toLowerCase() === partnerName.toLowerCase());
            if (partner) {
                setSelectedPartnerId(partner.id);
            }
        } else if (route === 'partners' || !route) {
            setSelectedPartnerId(null);
        }
    }, [route]);

    const handlePartnerClick = (partner: PartnerData) => {
        setSelectedPartnerId(partner.id);
        const newUrl = `${window.location.pathname}?section=partners/${partner.name.toLowerCase()}`;
        window.history.pushState({}, '', newUrl);
    };

    const handleBack = () => {
        setSelectedPartnerId(null);
        const newUrl = `${window.location.pathname}?section=partners`;
        window.history.pushState({}, '', newUrl);
    };

    const activePartner = selectedPartnerId ? partnersData.find(p => p.id === selectedPartnerId) : null;

    if (activePartner) {
        return (
            <PartnerDetail
                partner={activePartner}
                onBack={handleBack}
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
                            onClick={() => isInteractive && handlePartnerClick(partner)}
                            className={`
                                relative bg-white rounded-xl shadow-md border border-gray-100 p-8 
                                flex items-center justify-center h-48 transition-all duration-300 
                                ${isInteractive
                                    ? 'group hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                                    : 'opacity-80 cursor-default'
                                }
                                ${!partner.logo && 'opacity-60 border-dashed'}
                            `}
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
                                        <p className={`text-xs text-center w-full px-2 leading-relaxed transition-opacity duration-300 ${isInteractive ? 'text-gray-500 group-hover:text-gray-800' : 'text-gray-400'}`}>
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
            </ div >
        </div >
    );
};

export default Partners;

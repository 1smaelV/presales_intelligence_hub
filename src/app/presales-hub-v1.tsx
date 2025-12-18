import { useEffect, useState } from 'react';
import { Home, FileText, Users, MessageSquare, BookOpen, Wrench, GraduationCap, Layers, Sparkles, ChevronLeft, ChevronRight, History, LineChart, PanelLeft, PanelRight, ArrowUpRight, Bot, BadgeCheck } from 'lucide-react';
import headerLogo from './assets/img/image.png';
import { BriefData, GeneratedBrief } from './modules/briefs/constants';
import Dashboard from './modules/dashboard/Dashboard';
import BriefGenerator from './modules/briefs/components/BriefGenerator';
import BriefHistory from './modules/briefs/components/BriefHistory';
import CaseStudies from './modules/knowledge-base/CaseStudies';
import KeyQuestions from './modules/knowledge-base/KeyQuestions';
import TalkingPoints from './modules/knowledge-base/TalkingPoints';
import ComingSoon from './modules/placeholders/ComingSoon';

const offeringOptions = [
  'Select Offering...',
  'Agentic Readiness',
  'Agentic Enablement',
  'Agentic Engineering',
  'Agentic Observability',
  'Agentic Knowledge Management',
  'Agentic Data Operations',
  'Agentic Language Model Customization',
  'Agentic Workforce Readiness',
  'Agentic Risk Mitigation',
];

const industryOptions = [
  'Healthcare',
  'Financial Services',
  'Retail',
  'Manufacturing',
  'Technology',
  'Insurance',
  'Telecommunications',
  'Energy & Utilities',
  'Other',
];

const PresalesHub = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [globalIndustry, setGlobalIndustry] = useState<string>('');
  const [globalOffering, setGlobalOffering] = useState<string>('');
  const [briefData, setBriefData] = useState<BriefData>({
    industry: '',
    meetingType: '',
    clientRole: '',
    context: '',
  });
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [showGuardModal, setShowGuardModal] = useState(false);
  const [modalIndustry, setModalIndustry] = useState<string>('');
  const [modalOffering, setModalOffering] = useState<string>('');

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, active: true },
    { id: 'brief-generator', name: 'General Meeting Prep', icon: Sparkles, active: true },
    { id: 'agentic-use-cases', name: 'Agentic Use Cases', icon: Bot, active: true },
    { id: 'development-framework', name: 'Development Framework', icon: Layers, active: true, external: true, href: 'https://www.concentrix.com/services-solutions/agentic-ai/' },
    { id: 'value-proposition', name: 'Value Proposition', icon: BadgeCheck, active: true },
    { id: 'brief-history', name: 'Brief History', icon: History, active: true },
    { id: 'case-studies', name: 'Case Studies', icon: FileText, active: true },
    { id: 'key-questions', name: 'Key Questions', icon: MessageSquare, active: true },
    { id: 'prospect-analyzer', name: 'Prospect Analyzer', icon: LineChart, active: true, external: true, href: 'https://prospect-analyzer.onrender.com/dashboard' },
    { id: 'talking-points', name: 'Talking Points', icon: BookOpen, active: true },
    { id: 'concepts', name: 'Concept Library', icon: Layers, active: false },
    { id: 'platforms', name: 'Platforms & Tools', icon: Wrench, active: false },
    { id: 'team-skills', name: 'Team Capabilities', icon: Users, active: false },
    { id: 'training', name: 'Training Plans', icon: GraduationCap, active: false },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNavigate}
            industry={globalIndustry}
            setIndustry={setGlobalIndustry}
            offering={globalOffering}
            setOffering={setGlobalOffering}
          />
        );
      case 'brief-generator':
        return (
          <BriefGenerator
            briefData={briefData}
            setBriefData={setBriefData}
            generatedBrief={generatedBrief}
            setGeneratedBrief={setGeneratedBrief}
          />
        );
      case 'brief-history':
        return <BriefHistory defaultIndustry={globalIndustry || undefined} />;
      case 'agentic-use-cases':
        return <ComingSoon title="Agentic Use Cases" description="Curated agentic AI patterns by industry and workflow" />;
      case 'value-proposition':
        return <ComingSoon title="Value Proposition" description="Proof points, ROI levers, and differentiators" />;
      case 'case-studies':
        return <CaseStudies />;
      case 'key-questions':
        return <KeyQuestions defaultIndustry={globalIndustry || undefined} />;
      case 'talking-points':
        return <TalkingPoints />;
      case 'concepts':
        return <ComingSoon title="Agentic AI Concept Library" description="Comprehensive definitions and explanations" />;
      case 'platforms':
        return <ComingSoon title="Platforms, Tools & Architecture" description="Technical overview and partner ecosystem" />;
      case 'team-skills':
        return <ComingSoon title="Team Capabilities" description="Skills and expertise overview" />;
      case 'training':
        return <ComingSoon title="Training Plans for Leadership" description="Educational resources and crash courses" />;
      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
            industry={globalIndustry}
            setIndustry={setGlobalIndustry}
            offering={globalOffering}
            setOffering={setGlobalOffering}
          />
        );
    }
  };

  useEffect(() => {
    setBriefData(prev => ({ ...prev, industry: globalIndustry }));
  }, [globalIndustry]);

  const requiresIndustry = (sectionId: string) => sectionId !== 'prospect-analyzer' && sectionId !== 'dashboard' && sectionId !== 'development-framework';

  const handleNavigate = (sectionId: string) => {
    if (requiresIndustry(sectionId) && !globalIndustry) {
      setPendingSection(sectionId);
      setModalIndustry(globalIndustry || '');
      setModalOffering(globalOffering || '');
      setShowGuardModal(true);
      return;
    }
    setActiveSection(sectionId);
  };

  const handleGuardSubmit = () => {
    if (!modalIndustry) return;
    setGlobalIndustry(modalIndustry);
    setGlobalOffering(modalOffering);
    setShowGuardModal(false);
    if (pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-primary-700 text-white shadow-sm">
        <button
          type="button"
          onClick={() => handleNavigate('dashboard')}
          className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 w-full text-left"
          aria-label="Go to Dashboard"
        >
          <img src={headerLogo} alt="Presales Hub logo" className="h-10 w-auto drop-shadow-sm" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight">Presales Hub</span>
            <span className="text-xs font-medium text-white/80">Intelligence Center</span>
          </div>
        </button>
      </header>

      <div className={`flex min-h-[calc(100vh-64px)] ${sidebarPosition === 'right' ? 'flex-row-reverse' : ''}`}>
        {/* Sidebar */}
        <div className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white ${sidebarPosition === 'left' ? 'border-r' : 'border-l'} border-gray-200 flex flex-col shadow-sm transition-all duration-200`}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavigate('dashboard')}
              title="Presales Intelligence Hub"
            >
              <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="p-2 rounded-lg text-gray-500 hover:text-primary-700 hover:bg-gray-100 transition-colors"
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed
                ? (sidebarPosition === 'left' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
                : (sidebarPosition === 'left' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
              }
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {navigation.map(item => {
              const Icon = item.icon;

              if ((item as any).external) {
                return (
                  <a
                    key={item.id}
                    href={(item as any).href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                    title={isSidebarCollapsed ? item.name : undefined}
                    aria-label={isSidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className={`w-5 h-5 ${!isSidebarCollapsed ? 'mr-3' : ''} transition-colors text-gray-400 group-hover:text-gray-600`} />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </a>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${activeSection === item.id
                    ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                    : item.active
                      ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      : 'text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                  disabled={!item.active}
                  title={isSidebarCollapsed ? item.name : undefined}
                  aria-label={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${!isSidebarCollapsed ? 'mr-3' : ''} transition-colors ${activeSection === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                  {!item.active && !isSidebarCollapsed && (
                    <span className="ml-auto text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 flex flex-col gap-4">
            <button
              onClick={() => setSidebarPosition(prev => prev === 'left' ? 'right' : 'left')}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} w-full p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors`}
              title={sidebarPosition === 'left' ? 'Move sidebar to right' : 'Move sidebar to left'}
            >
              {sidebarPosition === 'left' ? <PanelRight className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              {!isSidebarCollapsed && <span className="ml-3 text-sm font-medium">Move to {sidebarPosition === 'left' ? 'Right' : 'Left'}</span>}
            </button>

            {!isSidebarCollapsed && (
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-4 text-white shadow-lg">
                <p className="text-sm font-medium opacity-90 mb-1">Pro Tip</p>
                <p className="text-xs opacity-75">Use General Meeting Prep before every client meeting.</p>
              </div>
            )}
          </div>
        </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500 space-y-6">
          {renderContent()}
        </div>
      </div>
      </div>

      {showGuardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Selection required</p>
                <h3 className="text-xl font-bold text-gray-900">Choose Industry (required) & Offering (optional)</h3>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowGuardModal(false);
                  setPendingSection(null);
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600">
                  Industry<span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  value={modalIndustry}
                  onChange={(e) => setModalIndustry(e.target.value)}
                >
                  <option value="">Select industry...</option>
                  {industryOptions.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600">Offering (optional)</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  value={modalOffering}
                  onChange={(e) => setModalOffering(e.target.value)}
                >
                  {offeringOptions.map(opt => (
                    <option key={opt} value={opt === 'Select Offering...' ? '' : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setShowGuardModal(false);
                  setPendingSection(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!modalIndustry}
                onClick={handleGuardSubmit}
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${modalIndustry ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresalesHub;

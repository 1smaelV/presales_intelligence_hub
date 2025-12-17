import { useState } from 'react';
import { Home, FileText, Users, MessageSquare, BookOpen, Wrench, GraduationCap, Layers, Sparkles, ChevronLeft, ChevronRight, History, LineChart, PanelLeft, PanelRight } from 'lucide-react';
import { BriefData, GeneratedBrief } from './modules/briefs/constants';
import Dashboard from './modules/dashboard/Dashboard';
import BriefGenerator from './modules/briefs/components/BriefGenerator';
import BriefHistory from './modules/briefs/components/BriefHistory';
import CaseStudies from './modules/knowledge-base/CaseStudies';
import KeyQuestions from './modules/knowledge-base/KeyQuestions';
import TalkingPoints from './modules/knowledge-base/TalkingPoints';
import ComingSoon from './modules/placeholders/ComingSoon';

/**
 * PresalesHub - Main Application Component
 * 
 * Serves as the root layout and navigation manager for the Presales Intelligence Hub.
 * Manages the global state for the General Meeting Prep to persist data when switching views.
 */
const PresalesHub = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [briefData, setBriefData] = useState<BriefData>({
    industry: '',
    meetingType: '',
    clientRole: '',
    context: ''
  });
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');

  // Navigation configuration defining sections, icons, and availability status
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, active: true },
    { id: 'brief-generator', name: 'General Meeting Prep', icon: Sparkles, active: true },
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

  /**
   * Renders the active component based on the current selection in the sidebar.
   */
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
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
        return <BriefHistory />;
      case 'case-studies':
        return <CaseStudies />;
      case 'key-questions':
        return <KeyQuestions />;
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
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 font-sans ${sidebarPosition === 'right' ? 'flex-row-reverse' : ''}`}>
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white ${sidebarPosition === 'left' ? 'border-r' : 'border-l'} border-gray-200 flex flex-col shadow-sm transition-all duration-200`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveSection('dashboard')}
            title="Presales Intelligence Hub"
          >
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary-700 transition-colors">Presales Hub</h2>
                <p className="text-xs text-gray-500 font-medium">Intelligence Center</p>
              </div>
            )}
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

            // Handle external links differently
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
                      <span className="ml-2 text-xs text-gray-400">↗</span>
                    </div>
                  )}
                </a>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
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
            title={sidebarPosition === 'left' ? "Move sidebar to right" : "Move sidebar to left"}
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
        <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PresalesHub;

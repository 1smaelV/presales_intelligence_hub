import { useState } from 'react';
import { Home, FileText, Users, MessageSquare, BookOpen, Wrench, GraduationCap, Layers, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { BriefData, GeneratedBrief } from './modules/briefs/constants';
import Dashboard from './modules/dashboard/Dashboard';
import BriefGenerator from './modules/briefs/components/BriefGenerator';
import CaseStudies from './modules/knowledge-base/CaseStudies';
import KeyQuestions from './modules/knowledge-base/KeyQuestions';
import TalkingPoints from './modules/knowledge-base/TalkingPoints';
import ComingSoon from './modules/placeholders/ComingSoon';

const PresalesHub = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [briefData, setBriefData] = useState<BriefData>({
    industry: '',
    meetingType: '',
    clientRole: '',
    context: ''
  });
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, active: true },
    { id: 'brief-generator', name: 'Brief Generator', icon: Sparkles, active: true },
    { id: 'case-studies', name: 'Case Studies', icon: FileText, active: true },
    { id: 'key-questions', name: 'Key Questions', icon: MessageSquare, active: true },
    { id: 'talking-points', name: 'Talking Points', icon: BookOpen, active: true },
    { id: 'concepts', name: 'Concept Library', icon: Layers, active: false },
    { id: 'platforms', name: 'Platforms & Tools', icon: Wrench, active: false },
    { id: 'team-skills', name: 'Team Capabilities', icon: Users, active: false },
    { id: 'training', name: 'Training Plans', icon: GraduationCap, active: false },
  ];

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
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-200`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Presales Hub</h2>
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
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navigation.map(item => {
            const Icon = item.icon;
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

        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-4 text-white shadow-lg">
              <p className="text-sm font-medium opacity-90 mb-1">Pro Tip</p>
              <p className="text-xs opacity-75">Use the Brief Generator before every client meeting.</p>
            </div>
          </div>
        )}
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

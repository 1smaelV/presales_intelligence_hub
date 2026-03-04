import React, { useState } from 'react';
import { Project } from './types';
import ProjectHub from './components/ProjectHub';
import ProjectWorkspace from './components/ProjectWorkspace';
import IntelligentChat from './components/IntelligentChat';
import TokenGate from './components/TokenGate';
import { PresalesCopilotProvider } from './context/PresalesCopilotContext';

type Phase = 'hub' | 'workspace' | 'chat';

const PresalesCopilotContent: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('hub');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check session storage on mount to persist auth during session
  React.useEffect(() => {
    const authStatus = sessionStorage.getItem('presales_copilot_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleValidationSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('presales_copilot_auth', 'true');
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setPhase('workspace');
  };

  const handleBackToHub = () => {
    setSelectedProject(null);
    setPhase('hub');
  };

  const handleGoToChat = () => {
    setPhase('chat');
  };

  const handleBackToWorkspace = () => {
    setPhase('workspace');
  };

  if (!isAuthenticated) {
    return <TokenGate onValidated={handleValidationSuccess} />;
  }

  return (
    <div className="w-full h-full min-h-[600px]">
      {phase === 'hub' && (
        <ProjectHub onSelectProject={handleSelectProject} />
      )}
      {phase === 'workspace' && selectedProject && (
        <ProjectWorkspace
          project={selectedProject}
          onBack={handleBackToHub}
          onChat={handleGoToChat}
        />
      )}
      {phase === 'chat' && selectedProject && (
        <IntelligentChat
          project={selectedProject}
          onBack={handleBackToWorkspace}
        />
      )}
    </div>
  );
};

const PresalesCopilot: React.FC = () => {
  return (
    <PresalesCopilotProvider>
      <PresalesCopilotContent />
    </PresalesCopilotProvider>
  );
};

export default PresalesCopilot;

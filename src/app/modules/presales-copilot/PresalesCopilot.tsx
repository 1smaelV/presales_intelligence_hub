import React, { useState } from 'react';
import { Project } from './types';
import ProjectHub from './components/ProjectHub';
import ProjectWorkspace from './components/ProjectWorkspace';
import IntelligentChat from './components/IntelligentChat';
import { PresalesCopilotProvider } from './context/PresalesCopilotContext';

type Phase = 'hub' | 'workspace' | 'chat';

const PresalesCopilotContent: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('hub');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

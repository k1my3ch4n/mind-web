import { useNavigate } from 'react-router-dom';

import { loadExampleProject, resetProject, useHasProjectData } from '@features/project-io';
import { AppFooter } from '@shared/ui';

import HomeHero from './HomeHero';

function HomePage() {
  const navigate = useNavigate();
  const hasProjectData = useHasProjectData();

  const handleStartNewProject = () => {
    if (hasProjectData && !window.confirm('기존 작업 내용이 모두 삭제됩니다. 계속할까요?')) {
      return;
    }
    resetProject();
    navigate('/workspace');
  };

  const handleContinueProject = () => {
    navigate('/workspace');
  };

  const handleOpenExample = () => {
    if (
      hasProjectData &&
      !window.confirm(
        '현재 작업을 예제 프로젝트로 바꿉니다. 기존 작업 내용은 삭제됩니다. 계속할까요?',
      )
    ) {
      return;
    }
    loadExampleProject();
    navigate('/workspace');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-brand-50/40">
      <HomeHero
        hasProjectData={hasProjectData}
        onStartNewProject={handleStartNewProject}
        onOpenExample={handleOpenExample}
        onContinueProject={handleContinueProject}
      />

      <AppFooter />
    </div>
  );
}

export default HomePage;

import { useNavigate } from 'react-router-dom';

import { resetProject, useHasProjectData } from '@features/project-io';
import { AppFooter, Logo } from '@shared/ui';

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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-col items-center gap-4">
          <Logo size={64} />
          <h1 className="text-3xl font-bold text-gray-900">mind-web</h1>
          <p className="max-w-md text-center text-sm leading-relaxed text-gray-500">
            마인드맵으로 웹 페이지 구조를 설계하고, 그 구조 그대로 클릭 가능한 프로토타입을
            확인하세요.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleStartNewProject}
              className="rounded-md bg-[#863bff] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#7527ec]"
            >
              새 프로젝트 시작
            </button>
            <button
              type="button"
              onClick={handleContinueProject}
              disabled={!hasProjectData}
              className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              이어서 작업하기
            </button>
          </div>
          {!hasProjectData && <p className="text-xs text-gray-400">저장된 작업이 없습니다</p>}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default HomePage;

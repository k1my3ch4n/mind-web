import { useRef, type ChangeEvent } from 'react';
import { FolderOpen, Save } from 'lucide-react';

import {
  applyProjectFile,
  buildProjectFile,
  downloadProjectFile,
  parseProjectFile,
} from '../model/projectFile';

function ProjectIOControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadProjectFile(buildProjectFile());
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const text = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      window.alert('올바른 JSON 파일이 아닙니다.');
      return;
    }

    const projectFile = parseProjectFile(parsed);
    if (!projectFile) {
      window.alert('mind-web 프로젝트 파일 형식이 아닙니다.');
      return;
    }

    if (!window.confirm('현재 작업 중인 구조를 불러온 파일로 덮어씁니다. 계속할까요?')) return;

    applyProjectFile(projectFile);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        title="프로젝트 JSON 파일 저장"
        onClick={handleExport}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Save size={14} aria-hidden />
        프로젝트 저장
      </button>
      <button
        type="button"
        title="프로젝트 JSON 파일 열기"
        onClick={handleImportClick}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <FolderOpen size={14} aria-hidden />
        프로젝트 열기
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ProjectIOControls;

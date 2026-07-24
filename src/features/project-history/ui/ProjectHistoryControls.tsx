import { useEffect } from 'react';
import { Redo2, Undo2 } from 'lucide-react';

import {
  redoProject,
  startProjectHistory,
  undoProject,
  useProjectHistoryStore,
} from '../model/history';

function isTextEditingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function ProjectHistoryControls() {
  const canUndo = useProjectHistoryStore((state) => state.canUndo);
  const canRedo = useProjectHistoryStore((state) => state.canRedo);

  useEffect(() => startProjectHistory(), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextEditingTarget(event.target) || event.altKey) return;
      if (!(event.metaKey || event.ctrlKey)) return;

      const key = event.key.toLowerCase();
      const didHandle =
        key === 'z'
          ? event.shiftKey
            ? redoProject()
            : undoProject()
          : key === 'y'
            ? redoProject()
            : false;

      if (didHandle) event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="flex items-center rounded-md border border-gray-200 bg-gray-50 p-0.5"
      aria-label="작업 기록"
    >
      <button
        type="button"
        aria-label="실행 취소"
        title="실행 취소 (Ctrl/Cmd+Z)"
        disabled={!canUndo}
        onClick={undoProject}
        className="flex h-7 w-8 items-center justify-center rounded text-base text-gray-600 hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
      >
        <Undo2 size={15} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="다시 실행"
        title="다시 실행 (Ctrl/Cmd+Shift+Z)"
        disabled={!canRedo}
        onClick={redoProject}
        className="flex h-7 w-8 items-center justify-center rounded text-base text-gray-600 hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
      >
        <Redo2 size={15} aria-hidden />
      </button>
    </div>
  );
}

export default ProjectHistoryControls;

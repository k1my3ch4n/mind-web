import { useCallback, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { MindMapCanvas } from '@widgets/mind-map-canvas';
import { LayoutEditorPanel } from '@widgets/layout-editor';
import { ProjectIOControls } from '@features/project-io';
import { ProjectHistoryControls } from '@features/project-history';
import { Logo } from '@shared/ui';

import WorkspaceStatusBar from './WorkspaceStatusBar';

const INITIAL_RATIO = 0.6;
const MIN_RATIO = 0.3;
const MAX_RATIO = 0.75;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function WorkspaceLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(INITIAL_RATIO);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const toggleEditorExpanded = useCallback(() => setIsEditorExpanded((prev) => !prev), []);

  const handleDividerMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const { left, width } = container.getBoundingClientRect();

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      setRatio(clamp((moveEvent.clientX - left) / width, MIN_RATIO, MAX_RATIO));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleDividerKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? -1 : 1;
    const step = event.shiftKey ? 0.05 : 0.02;
    setRatio((current) => clamp(current + direction * step, MIN_RATIO, MAX_RATIO));
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <Link
          to="/"
          title="메인으로 (작업 내용은 자동 저장됩니다)"
          className="flex items-center gap-2 hover:opacity-80"
        >
          <Logo size={20} />
          <h1 className="text-sm font-semibold text-gray-900">mind-web</h1>
        </Link>
        <div className="flex items-center gap-2">
          <ProjectHistoryControls />
          <span className="h-5 w-px bg-gray-200" aria-hidden />
          <ProjectIOControls />
        </div>
      </header>

      <div ref={containerRef} className="flex min-h-0 flex-1">
        <div
          style={{ width: isEditorExpanded ? '0%' : `${ratio * 100}%` }}
          className="h-full min-w-0 overflow-hidden"
        >
          <MindMapCanvas />
        </div>

        {!isEditorExpanded && (
          <div
            role="separator"
            aria-label="캔버스와 편집기 너비 조절"
            aria-orientation="vertical"
            aria-valuemin={MIN_RATIO * 100}
            aria-valuemax={MAX_RATIO * 100}
            aria-valuenow={Math.round(ratio * 100)}
            tabIndex={0}
            title="드래그하거나 좌우 화살표로 너비 조절"
            onMouseDown={handleDividerMouseDown}
            onKeyDown={handleDividerKeyDown}
            className="w-1 shrink-0 cursor-col-resize bg-gray-200 transition-colors hover:bg-brand-400 focus:bg-brand-500 focus:outline-none"
          />
        )}

        <div
          style={{ width: isEditorExpanded ? '100%' : `${(1 - ratio) * 100}%` }}
          className={`h-full min-w-0 ${isEditorExpanded ? '' : 'border-l border-gray-100'}`}
        >
          <LayoutEditorPanel isExpanded={isEditorExpanded} onToggleExpand={toggleEditorExpanded} />
        </div>
      </div>

      <WorkspaceStatusBar />
    </div>
  );
}

export default WorkspaceLayout;

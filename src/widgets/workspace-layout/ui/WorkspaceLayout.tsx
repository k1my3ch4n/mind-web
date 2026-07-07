import { useCallback, useRef, useState, type MouseEvent } from 'react';

import { MindMapCanvas } from '@widgets/mind-map-canvas';
import { LayoutEditorPanel } from '@widgets/layout-editor';
import { ProjectIOControls } from '@features/project-io';

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

  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <h1 className="text-sm font-semibold text-gray-900">mind-web</h1>
        <ProjectIOControls />
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
            onMouseDown={handleDividerMouseDown}
            className="w-1 shrink-0 cursor-col-resize bg-gray-200 transition-colors hover:bg-blue-400"
          />
        )}

        <div
          style={{ width: isEditorExpanded ? '100%' : `${(1 - ratio) * 100}%` }}
          className={`h-full min-w-0 ${isEditorExpanded ? '' : 'border-l border-gray-100'}`}
        >
          <LayoutEditorPanel isExpanded={isEditorExpanded} onToggleExpand={toggleEditorExpanded} />
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLayout;

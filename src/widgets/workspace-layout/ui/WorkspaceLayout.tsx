import { useCallback, useRef, useState, type MouseEvent } from 'react';

import { MindMapCanvas } from '@widgets/mind-map-canvas';
import { LayoutEditorPanel } from '@widgets/layout-editor';

const INITIAL_RATIO = 0.6;
const MIN_RATIO = 0.3;
const MAX_RATIO = 0.75;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function WorkspaceLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(INITIAL_RATIO);

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
      <header className="flex h-12 shrink-0 items-center border-b border-gray-200 bg-white px-4">
        <h1 className="text-sm font-semibold text-gray-900">mind-web</h1>
      </header>

      <div ref={containerRef} className="flex min-h-0 flex-1">
        <div style={{ width: `${ratio * 100}%` }} className="h-full min-w-0">
          <MindMapCanvas />
        </div>

        <div
          onMouseDown={handleDividerMouseDown}
          className="w-1 shrink-0 cursor-col-resize bg-gray-200 transition-colors hover:bg-blue-400"
        />

        <div style={{ width: `${(1 - ratio) * 100}%` }} className="h-full min-w-0 border-l border-gray-100">
          <LayoutEditorPanel />
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLayout;

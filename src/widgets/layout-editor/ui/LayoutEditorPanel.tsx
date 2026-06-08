import { useState } from 'react';

import { useNodeStore } from '@entities/node';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

import ComponentPalette from './ComponentPalette';
import Artboard from './Artboard';
import PropertyPanel from './PropertyPanel';

type EditorTab = 'design' | 'preview';

const TABS: { key: EditorTab; label: string }[] = [
  { key: 'design', label: '디자인' },
  { key: 'preview', label: '프리뷰' },
];

function EmptyEditorState() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-gray-300">
      캔버스에서 페이지를 선택하면
      <br />
      이곳에서 레이아웃을 편집할 수 있어요.
    </div>
  );
}

function LayoutEditorPanel() {
  const [activeTab, setActiveTab] = useState<EditorTab>('design');

  const selectedNodeId = useCanvasSelectionStore((state) => state.selectedNodeId);
  const selectedNode = useNodeStore((state) =>
    state.nodes.find((node) => node.id === selectedNodeId),
  );

  if (!selectedNode) {
    return <EmptyEditorState />;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{selectedNode.data.name}</p>
          <p className="truncate text-xs text-gray-400">{selectedNode.data.route}</p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-md bg-gray-100 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'design' ? (
        <div className="flex flex-1 overflow-auto">
          <ComponentPalette />
          <Artboard node={selectedNode} />
          <PropertyPanel />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center text-sm text-gray-300">
          라이브 프리뷰는 Phase 5에서 제공될 예정이에요.
        </div>
      )}
    </div>
  );
}

export default LayoutEditorPanel;

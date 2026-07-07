import { useState } from 'react';

import { useNodeStore } from '@entities/node';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

import PageComponentEditor from './PageComponentEditor';
import LivePreviewView from './LivePreviewView';

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

interface LayoutEditorPanelProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function LayoutEditorPanel({ isExpanded, onToggleExpand }: LayoutEditorPanelProps) {
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
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex gap-1 rounded-md bg-gray-100 p-0.5">
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
          <button
            type="button"
            onClick={onToggleExpand}
            className="rounded px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
          >
            {isExpanded ? '← 캔버스' : '⛶ 전체화면'}
          </button>
        </div>
      </div>

      {activeTab === 'design' ? (
        <PageComponentEditor node={selectedNode} />
      ) : (
        <LivePreviewView canvasSelectedNodeId={selectedNode.id} />
      )}
    </div>
  );
}

export default LayoutEditorPanel;

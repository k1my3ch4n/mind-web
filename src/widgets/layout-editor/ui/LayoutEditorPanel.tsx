import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import { useNodeStore } from '@entities/node';
import {
  usePageComponentStore,
  type PageComponentData,
  type PageComponentType,
} from '@entities/page-component';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

import ComponentPalette from './ComponentPalette';
import Artboard, { ARTBOARD_DROP_ZONE_ID } from './Artboard';
import PropertyPanel from './PropertyPanel';

type EditorTab = 'design' | 'preview';

const TABS: { key: EditorTab; label: string }[] = [
  { key: 'design', label: '디자인' },
  { key: 'preview', label: '프리뷰' },
];

interface DragData {
  source: 'palette' | 'artboard';
  componentType?: PageComponentType;
}

// 빈 배열을 매번 새로 만들면 zustand의 useSyncExternalStore가 매 렌더마다 다른 참조로 인식해 무한 루프에 빠진다.
const EMPTY_COMPONENTS: PageComponentData[] = [];

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
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const selectedNodeId = useCanvasSelectionStore((state) => state.selectedNodeId);
  const selectedNode = useNodeStore((state) =>
    state.nodes.find((node) => node.id === selectedNodeId),
  );

  const components = usePageComponentStore((state) =>
    selectedNode ? (state.componentsByNodeId[selectedNode.id] ?? EMPTY_COMPONENTS) : EMPTY_COMPONENTS,
  );
  const addComponent = usePageComponentStore((state) => state.addComponent);
  const reorderComponents = usePageComponentStore((state) => state.reorderComponents);
  const removeComponent = usePageComponentStore((state) => state.removeComponent);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // 다른 페이지를 선택하면 이전 페이지에서 선택했던 컴포넌트 상태를 초기화한다 (렌더링 중 조정 — useEffect 대신 권장 패턴).
  const [trackedNodeId, setTrackedNodeId] = useState(selectedNode?.id);
  if (trackedNodeId !== selectedNode?.id) {
    setTrackedNodeId(selectedNode?.id);
    setSelectedComponentId(null);
  }

  if (!selectedNode) {
    return <EmptyEditorState />;
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const dragData = active.data.current as DragData | undefined;
    if (!dragData) return;

    if (dragData.source === 'palette' && dragData.componentType) {
      addComponent(selectedNode.id, dragData.componentType);
      return;
    }

    if (dragData.source === 'artboard' && over.id !== ARTBOARD_DROP_ZONE_ID && active.id !== over.id) {
      reorderComponents(selectedNode.id, String(active.id), String(over.id));
    }
  };

  const selectedComponent = components.find((component) => component.id === selectedComponentId) ?? null;

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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex flex-1 overflow-auto">
            <ComponentPalette />
            <Artboard
              node={selectedNode}
              components={components}
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
              onRemoveComponent={(componentId) => {
                removeComponent(selectedNode.id, componentId);
                if (selectedComponentId === componentId) setSelectedComponentId(null);
              }}
            />
            <PropertyPanel nodeId={selectedNode.id} component={selectedComponent} />
          </div>
        </DndContext>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center text-sm text-gray-300">
          라이브 프리뷰는 Phase 5에서 제공될 예정이에요.
        </div>
      )}
    </div>
  );
}

export default LayoutEditorPanel;

import { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import {
  usePageComponentStore,
  EMPTY_PAGE_COMPONENTS,
  type PageComponentType,
} from '@entities/page-component';
import type { PageNodeSummary } from '@entities/node';

import ComponentPalette from './ComponentPalette';
import Artboard, { ARTBOARD_DROP_ZONE_ID } from './Artboard';
import PropertyPanel from './PropertyPanel';

interface DragData {
  source: 'palette' | 'artboard';
  componentType?: PageComponentType;
}

interface PageComponentEditorProps {
  node: PageNodeSummary;
}

function PageComponentEditor({ node }: PageComponentEditorProps) {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const components = usePageComponentStore(
    (state) => state.componentsByNodeId[node.id] ?? EMPTY_PAGE_COMPONENTS,
  );
  const addComponent = usePageComponentStore((state) => state.addComponent);
  const reorderComponents = usePageComponentStore((state) => state.reorderComponents);
  const removeComponent = usePageComponentStore((state) => state.removeComponent);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleAddComponent = (type: PageComponentType) => {
    const componentId = addComponent(node.id, type);
    setSelectedComponentId(componentId);
  };

  // 다른 페이지로 바뀌면 이전 페이지에서 선택했던 컴포넌트 상태를 초기화한다 (렌더링 중 조정 — useEffect 대신 권장 패턴).
  const [trackedNodeId, setTrackedNodeId] = useState(node.id);
  if (trackedNodeId !== node.id) {
    setTrackedNodeId(node.id);
    setSelectedComponentId(null);
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const dragData = active.data.current as DragData | undefined;
    if (!dragData) return;

    if (dragData.source === 'palette' && dragData.componentType) {
      handleAddComponent(dragData.componentType);
      return;
    }

    if (
      dragData.source === 'artboard' &&
      over.id !== ARTBOARD_DROP_ZONE_ID &&
      active.id !== over.id
    ) {
      reorderComponents(node.id, String(active.id), String(over.id));
    }
  };

  const selectedComponent =
    components.find((component) => component.id === selectedComponentId) ?? null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <ComponentPalette onAddComponent={handleAddComponent} />
        <Artboard
          node={node}
          components={components}
          selectedComponentId={selectedComponentId}
          onSelectComponent={setSelectedComponentId}
          onRemoveComponent={(componentId) => {
            removeComponent(node.id, componentId);
            if (selectedComponentId === componentId) setSelectedComponentId(null);
          }}
        />
        {selectedComponent && (
          <PropertyPanel
            nodeId={node.id}
            component={selectedComponent}
            onClose={() => setSelectedComponentId(null)}
          />
        )}
      </div>
    </DndContext>
  );
}

export default PageComponentEditor;

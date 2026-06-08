import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { PageComponentPreview, type PageComponentData } from '@entities/page-component';
import type { PageNode } from '@entities/node';

export const ARTBOARD_DROP_ZONE_ID = 'artboard-drop-zone';

interface ArtboardProps {
  node: PageNode;
  components: PageComponentData[];
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string | null) => void;
  onRemoveComponent: (componentId: string) => void;
}

interface SortableComponentRowProps {
  component: PageComponentData;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableComponentRow({ component, selected, onSelect, onRemove }: SortableComponentRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    data: { source: 'artboard' },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      className={`group relative cursor-grab rounded-md border p-2 transition-colors active:cursor-grabbing ${
        selected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-200'
      } ${isDragging ? 'z-10 opacity-60' : ''}`}
    >
      <div className="pointer-events-none">
        <PageComponentPreview component={component} />
      </div>
      <button
        type="button"
        aria-label="컴포넌트 삭제"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 hidden h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-xs leading-none text-gray-400 shadow-sm group-hover:flex hover:border-red-300 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
}

function Artboard({ node, components, selectedComponentId, onSelectComponent, onRemoveComponent }: ArtboardProps) {
  const { setNodeRef: setDropZoneRef, isOver } = useDroppable({ id: ARTBOARD_DROP_ZONE_ID });
  const componentIds = components.map((component) => component.id);

  return (
    <div className="flex min-w-[220px] flex-1 flex-col gap-4 overflow-auto bg-gray-50 p-6">
      <div className="mx-auto flex w-full max-w-md shrink-0 flex-col items-center gap-0.5 text-center">
        <p className="text-sm font-medium text-gray-900">{node.data.name}</p>
        <p className="text-xs text-gray-400">{node.data.route}</p>
      </div>

      <div
        ref={setDropZoneRef}
        onClick={() => onSelectComponent(null)}
        className={`mx-auto flex w-full max-w-md flex-1 flex-col gap-2 rounded-lg border border-dashed p-4 transition-colors ${
          isOver ? 'border-blue-300 bg-blue-50/50' : 'border-gray-300 bg-white'
        }`}
      >
        {components.length === 0 ? (
          <p className="m-auto max-w-[16rem] text-center text-xs text-gray-300">
            왼쪽 팔레트에서 컴포넌트를 드래그해 이곳에 놓으면 페이지 레이아웃이 만들어져요.
          </p>
        ) : (
          <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
            {components.map((component) => (
              <SortableComponentRow
                key={component.id}
                component={component}
                selected={component.id === selectedComponentId}
                onSelect={() => onSelectComponent(component.id)}
                onRemove={() => onRemoveComponent(component.id)}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

export default Artboard;

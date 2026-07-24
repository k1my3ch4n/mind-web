import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Monitor, Smartphone, Tablet, X, type LucideIcon } from 'lucide-react';

import { PageComponentPreview, type PageComponentData } from '@entities/page-component';
import type { PageNodeSummary } from '@entities/node';

export const ARTBOARD_DROP_ZONE_ID = 'artboard-drop-zone';

type ArtboardViewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_OPTIONS: {
  key: ArtboardViewport;
  label: string;
  widthClass: string;
  icon: LucideIcon;
}[] = [
  { key: 'desktop', label: '데스크톱', widthClass: 'max-w-3xl', icon: Monitor },
  { key: 'tablet', label: '태블릿', widthClass: 'max-w-xl', icon: Tablet },
  { key: 'mobile', label: '모바일', widthClass: 'max-w-sm', icon: Smartphone },
];

interface ArtboardProps {
  node: PageNodeSummary;
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

function SortableComponentRow({
  component,
  selected,
  onSelect,
  onRemove,
}: SortableComponentRowProps) {
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
        selected
          ? 'border-brand-400 ring-2 ring-brand-100'
          : 'border-transparent hover:border-gray-200'
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
        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:border-red-300 hover:text-red-500 focus:opacity-100"
      >
        <X size={12} aria-hidden />
      </button>
    </div>
  );
}

function Artboard({
  node,
  components,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent,
}: ArtboardProps) {
  const { setNodeRef: setDropZoneRef, isOver } = useDroppable({ id: ARTBOARD_DROP_ZONE_ID });
  const [viewport, setViewport] = useState<ArtboardViewport>('desktop');
  const componentIds = components.map((component) => component.id);
  const viewportWidthClass =
    VIEWPORT_OPTIONS.find((option) => option.key === viewport)?.widthClass ?? 'max-w-3xl';

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-auto bg-gray-100 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{node.data.name}</p>
          <p className="truncate text-xs text-gray-400">{node.data.route}</p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          {VIEWPORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={viewport === option.key}
              onClick={() => setViewport(option.key)}
              title={`${option.label} 화면으로 보기`}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                viewport === option.key
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <option.icon size={12} aria-hidden />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-[280px] flex-1 items-start justify-center overflow-auto pb-6">
        <div
          className={`flex min-h-[460px] w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-[max-width] duration-200 ${viewportWidthClass}`}
        >
          <div className="flex h-9 shrink-0 items-center gap-3 border-b border-gray-200 bg-gray-50 px-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-300" />
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
            </div>
            <div className="min-w-0 flex-1 truncate rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-400">
              mind-web.local{node.data.route}
            </div>
          </div>

          <div
            ref={setDropZoneRef}
            onClick={() => onSelectComponent(null)}
            className={`flex w-full flex-1 flex-col gap-2 border-2 border-dashed p-5 transition-colors ${
              isOver ? 'border-brand-300 bg-brand-50/50' : 'border-transparent bg-white'
            }`}
          >
            {components.length === 0 ? (
              <div className="m-auto max-w-[18rem] text-center">
                <p className="text-sm font-medium text-gray-500">페이지가 아직 비어 있어요</p>
                <p className="mt-1 text-xs leading-5 text-gray-400">
                  왼쪽 컴포넌트를 클릭하거나 이곳으로 드래그해 첫 화면을 구성해보세요.
                </p>
              </div>
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
      </div>
    </div>
  );
}

export default Artboard;

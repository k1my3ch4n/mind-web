import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import type { PageComponentType } from '@entities/page-component';

const PALETTE_ITEMS: { type: PageComponentType; label: string }[] = [
  { type: 'button', label: '버튼' },
  { type: 'text', label: '텍스트' },
  { type: 'image', label: '이미지' },
  { type: 'input', label: '입력' },
  { type: 'card', label: '카드' },
  { type: 'modal', label: '모달' },
];

interface PaletteDragItemProps {
  type: PageComponentType;
  label: string;
}

function PaletteDragItem({ type, label }: PaletteDragItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { source: 'palette', componentType: type },
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`cursor-grab rounded border border-dashed border-gray-200 px-2 py-1.5 text-xs text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600 active:cursor-grabbing ${
        isDragging ? 'z-10 opacity-50' : ''
      }`}
    >
      {label}
    </li>
  );
}

function ComponentPalette() {
  return (
    <div className="flex w-40 shrink-0 flex-col border-r border-gray-100 p-3">
      <h3 className="mb-2 text-xs font-medium text-gray-400">컴포넌트</h3>
      <ul className="flex flex-col gap-1.5">
        {PALETTE_ITEMS.map((item) => (
          <PaletteDragItem key={item.type} type={item.type} label={item.label} />
        ))}
      </ul>
    </div>
  );
}

export default ComponentPalette;

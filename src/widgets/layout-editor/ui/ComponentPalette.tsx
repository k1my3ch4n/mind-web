import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  AppWindow,
  Image as ImageIcon,
  MousePointerClick,
  PanelsTopLeft,
  TextCursorInput,
  Type,
  type LucideIcon,
} from 'lucide-react';

import type { PageComponentType } from '@entities/page-component';

const PALETTE_ITEMS: { type: PageComponentType; label: string; icon: LucideIcon }[] = [
  { type: 'button', label: '버튼', icon: MousePointerClick },
  { type: 'text', label: '텍스트', icon: Type },
  { type: 'image', label: '이미지', icon: ImageIcon },
  { type: 'input', label: '입력', icon: TextCursorInput },
  { type: 'card', label: '카드', icon: PanelsTopLeft },
  { type: 'modal', label: '모달', icon: AppWindow },
];

interface PaletteDragItemProps {
  type: PageComponentType;
  label: string;
  icon: LucideIcon;
  onAdd: (type: PageComponentType) => void;
}

function PaletteDragItem({ type, label, icon: Icon, onAdd }: PaletteDragItemProps) {
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
      className={`cursor-grab rounded-lg border border-gray-200 bg-white transition-colors hover:border-brand-300 hover:bg-brand-50 active:cursor-grabbing ${
        isDragging ? 'z-10 opacity-50' : ''
      }`}
    >
      <button
        type="button"
        title={`${label}을 드래그하거나 클릭해서 추가`}
        onClick={() => onAdd(type)}
        className="flex w-full flex-col items-center gap-1 px-1 py-2 text-gray-500 hover:text-brand-700"
      >
        <Icon size={15} strokeWidth={1.8} aria-hidden />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    </li>
  );
}

interface ComponentPaletteProps {
  onAddComponent: (type: PageComponentType) => void;
}

function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  return (
    <aside className="flex w-28 shrink-0 flex-col border-r border-gray-200 bg-white p-3">
      <h3 className="text-xs font-semibold text-gray-700">컴포넌트</h3>
      <p className="mt-1 text-[10px] leading-4 text-gray-400">클릭 또는 드래그</p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {PALETTE_ITEMS.map((item) => (
          <PaletteDragItem key={item.type} {...item} onAdd={onAddComponent} />
        ))}
      </ul>
    </aside>
  );
}

export default ComponentPalette;

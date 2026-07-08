import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

import { useNodeStore } from '../model/store';
import type { PageNode } from '../model/types';

interface InlineEditableTextProps {
  value: string;
  onCommit: (next: string) => void;
  className: string;
  placeholder?: string;
}

function InlineEditableText({ value, onCommit, className, placeholder }: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onCommit(draft.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit();
    if (event.key === 'Escape') setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onFocus={(event) => event.target.select()}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={`nodrag w-full rounded border border-blue-400 px-1 outline-none ${className}`}
      />
    );
  }

  return (
    <p
      onDoubleClick={() => {
        setDraft(value);
        setIsEditing(true);
      }}
      className={`truncate ${className}`}
    >
      {value || placeholder}
    </p>
  );
}

interface PageNodeCardProps extends NodeProps<PageNode> {
  // 페이지 레이아웃 미니 미리보기 slot — 컴포넌트 데이터와의 결합은 widget 레이어에서 주입한다.
  miniPreview?: ReactNode;
}

function PageNodeCard({ id, data, selected, miniPreview }: PageNodeCardProps) {
  const renameNode = useNodeStore((state) => state.renameNode);

  return (
    <div
      className={`w-56 rounded-lg border bg-white shadow-sm transition-colors ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />
      <Handle type="source" position={Position.Right} className="!bg-gray-400" />

      <div className="border-b border-gray-100 px-3 py-2">
        <InlineEditableText
          value={data.name}
          onCommit={(name) => renameNode(id, { name: name || '새 페이지' })}
          className="text-sm font-medium text-gray-900"
          placeholder="페이지 이름"
        />
        <InlineEditableText
          value={data.route}
          onCommit={(route) => renameNode(id, { route: route || '/' })}
          className="text-xs text-gray-400"
          placeholder="/route"
        />
      </div>

      {miniPreview ? (
        <div className="m-3 h-20 overflow-hidden rounded border border-gray-100 bg-gray-50/60 p-2">
          {miniPreview}
        </div>
      ) : (
        <div className="m-3 flex h-20 items-center justify-center rounded border border-dashed border-gray-200 text-xs text-gray-300">
          레이아웃 미리보기
        </div>
      )}
    </div>
  );
}

export default PageNodeCard;

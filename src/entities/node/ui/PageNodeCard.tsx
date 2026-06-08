import { useState, type KeyboardEvent } from 'react';
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

function PageNodeCard({ id, data, selected }: NodeProps<PageNode>) {
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

      <div className="m-3 flex h-20 items-center justify-center rounded border border-dashed border-gray-200 text-xs text-gray-300">
        레이아웃 미리보기
      </div>
    </div>
  );
}

export default PageNodeCard;

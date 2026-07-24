import { useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { File, Home, MoreHorizontal, Trash2 } from 'lucide-react';

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
        className={`nodrag w-full rounded border border-brand-400 px-1 outline-none ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      title="클릭하여 수정"
      onClick={() => {
        setDraft(value);
        setIsEditing(true);
      }}
      className={`nodrag w-full truncate rounded text-left outline-none hover:bg-brand-50 focus-visible:bg-brand-50 ${className}`}
    >
      {value || placeholder}
    </button>
  );
}

export type PageNodeRouteStatus = 'valid' | 'duplicate' | 'invalid';

interface PageNodeCardProps extends NodeProps<PageNode> {
  // 페이지 레이아웃 미니 미리보기 slot — 컴포넌트 데이터와의 결합은 widget 레이어에서 주입한다.
  miniPreview?: ReactNode;
  componentCount?: number;
  routeStatus?: PageNodeRouteStatus;
  onDelete?: () => void;
}

function PageNodeCard({
  id,
  data,
  selected,
  miniPreview,
  componentCount = 0,
  routeStatus = 'valid',
  onDelete,
}: PageNodeCardProps) {
  const renameNode = useNodeStore((state) => state.renameNode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsMenuOpen(false);
  };

  const statusLabel =
    routeStatus === 'duplicate'
      ? '경로 중복'
      : routeStatus === 'invalid'
        ? '경로 확인'
        : '경로 정상';
  const statusClass = routeStatus === 'valid' ? 'text-emerald-600' : 'text-amber-600';

  return (
    <div
      className={`w-60 overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${
        selected
          ? 'border-brand-600 ring-4 ring-brand-100'
          : 'border-gray-200 hover:border-brand-200 hover:shadow-md'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        title="이 페이지로 연결"
        className="!h-3 !w-3 !border-2 !border-white !bg-brand-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        title="다른 페이지로 연결"
        className="!h-3 !w-3 !border-2 !border-white !bg-brand-600"
      />

      <div className="flex items-start gap-2 border-b border-gray-100 px-3 py-2.5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm text-brand-600">
          {data.route === '/' ? <Home size={15} aria-hidden /> : <File size={15} aria-hidden />}
        </div>
        <div className="min-w-0 flex-1">
          <InlineEditableText
            value={data.name}
            onCommit={(name) => renameNode(id, { name: name || '새 페이지' })}
            className="text-sm font-semibold text-gray-900"
            placeholder="페이지 이름"
          />
          <InlineEditableText
            value={data.route}
            onCommit={(route) => renameNode(id, { route: route || '/' })}
            className={`mt-0.5 text-xs ${
              routeStatus === 'valid' ? 'text-gray-400' : 'text-amber-600'
            }`}
            placeholder="/route"
          />
        </div>

        {onDelete && (
          <div className="nodrag nopan relative" onBlur={handleMenuBlur}>
            <button
              type="button"
              aria-label={`${data.name} 페이지 메뉴`}
              aria-expanded={isMenuOpen}
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((current) => !current);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <MoreHorizontal size={16} aria-hidden />
            </button>
            {isMenuOpen && (
              <div className="absolute top-8 right-0 z-20 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                <p className="px-2 py-1.5 text-[11px] text-gray-400">이름과 경로는 클릭해 수정</p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={13} className="mr-1.5 inline" aria-hidden />
                  페이지 삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {miniPreview ? (
        <div className="m-3 h-20 overflow-hidden rounded-lg border border-gray-100 bg-gray-50/60 p-2">
          {miniPreview}
        </div>
      ) : (
        <div className="m-3 flex h-20 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 text-xs text-gray-400">
          컴포넌트를 추가해보세요
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-3 py-2 text-[11px]">
        <span className="text-gray-500">컴포넌트 {componentCount}개</span>
        <span className={`font-medium ${statusClass}`}>
          {routeStatus === 'valid' ? '✓ ' : '● '}
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export default PageNodeCard;

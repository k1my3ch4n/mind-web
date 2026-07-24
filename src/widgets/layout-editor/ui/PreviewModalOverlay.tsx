import { useEffect, useId, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';

import type { PageComponentData } from '@entities/page-component';

interface PreviewModalOverlayProps {
  component: PageComponentData;
  // onClickNodeId 대상 노드의 route — 이동 버튼 라벨용 (대상이 없거나 삭제됐으면 null)
  targetRoute: string | null;
  onClose: () => void;
  onNavigate: (() => void) | null;
}

// 프리뷰 pane 내부 오버레이 — fixed가 아니라 relative 래퍼 기준 absolute로 덮는다.
function PreviewModalOverlay({
  component,
  targetRoute,
  onClose,
  onNavigate,
}: PreviewModalOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelector =
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    const focusableElements = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));

    (focusableElements()[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      if (elements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex w-full max-w-xs flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <p id={titleId} className="text-sm font-medium text-gray-900">
            {component.text}
          </p>
          <button
            type="button"
            aria-label="모달 닫기"
            onClick={onClose}
            className="shrink-0 rounded px-1 text-sm text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
        <p className="text-xs text-gray-400">
          프리뷰 모달 — 실제 페이지에서는 이 자리에 모달 콘텐츠가 들어가요.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
          >
            닫기
          </button>
          {onNavigate && (
            <button
              type="button"
              onClick={onNavigate}
              className="flex items-center gap-1 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700"
            >
              {targetRoute ?? '이동'}
              <ArrowRight size={12} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewModalOverlay;

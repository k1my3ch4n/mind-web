import type { PageComponentData } from '@entities/page-component';

interface PreviewModalOverlayProps {
  component: PageComponentData;
  // onClickNodeId 대상 노드의 route — 이동 버튼 라벨용 (대상이 없거나 삭제됐으면 null)
  targetRoute: string | null;
  onClose: () => void;
  onNavigate: (() => void) | null;
}

// 프리뷰 pane 내부 오버레이 — fixed가 아니라 relative 래퍼 기준 absolute로 덮는다.
function PreviewModalOverlay({ component, targetRoute, onClose, onNavigate }: PreviewModalOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-xs flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900">{component.text}</p>
          <button
            type="button"
            aria-label="모달 닫기"
            onClick={onClose}
            className="shrink-0 rounded px-1 text-sm text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-gray-400">프리뷰 모달 — 실제 페이지에서는 이 자리에 모달 콘텐츠가 들어가요.</p>
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
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            >
              {targetRoute ?? '이동'} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewModalOverlay;

import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

import { useNodeStore, usePageNodeSummary } from '@entities/node';
import {
  usePageComponentStore,
  EMPTY_PAGE_COMPONENTS,
  PageComponentPreview,
} from '@entities/page-component';

import PageComponentEditor from './PageComponentEditor';
import PreviewModalOverlay from './PreviewModalOverlay';

interface LivePreviewViewProps {
  canvasSelectedNodeId: string;
}

function LivePreviewView({ canvasSelectedNodeId }: LivePreviewViewProps) {
  const [previewNodeId, setPreviewNodeId] = useState(canvasSelectedNodeId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // 이전 페이지 nodeId 스택 (현재 페이지 미포함) — 탭 전환/선택 해제 시 언마운트로 소멸하는 것은 의도된 동작
  const [history, setHistory] = useState<string[]>([]);
  // 열린 모달의 컴포넌트 id (boolean이 아닌 이유: 한 페이지에 modal 컴포넌트가 여러 개일 수 있음)
  const [openModalComponentId, setOpenModalComponentId] = useState<string | null>(null);

  // 캔버스에서 다른 노드/엣지를 선택하면 프리뷰도 그 페이지로 따라간다 (렌더링 중 조정 — useEffect 대신 권장 패턴).
  // 캔버스 점프는 프리뷰 내 내비게이션이 아닌 외부 텔레포트이므로 히스토리를 리셋하고 모달도 닫는다.
  const [trackedSelectedNodeId, setTrackedSelectedNodeId] = useState(canvasSelectedNodeId);
  if (trackedSelectedNodeId !== canvasSelectedNodeId) {
    setTrackedSelectedNodeId(canvasSelectedNodeId);
    setPreviewNodeId(canvasSelectedNodeId);
    setHistory([]);
    setOpenModalComponentId(null);
  }

  const previewNode = usePageNodeSummary(previewNodeId);
  const components = usePageComponentStore((state) =>
    previewNode
      ? (state.componentsByNodeId[previewNode.id] ?? EMPTY_PAGE_COMPONENTS)
      : EMPTY_PAGE_COMPONENTS,
  );

  // 열린 모달은 state가 아니라 컴포넌트 목록에서 파생 — 드로어에서 삭제되면 유령 모달 없이 자동 소멸
  const openModal = components.find((component) => component.id === openModalComponentId) ?? null;
  const modalTargetNodeId = openModal?.onClickNodeId ?? null;
  const modalTarget = usePageNodeSummary(modalTargetNodeId);

  if (!previewNode) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-gray-500">
        이 페이지가 삭제되었어요.
      </div>
    );
  }

  const navigateTo = (nextNodeId: string) => {
    setOpenModalComponentId(null);
    if (nextNodeId === previewNode.id) return; // 같은 페이지로의 이동은 no-op (히스토리 오염 방지)
    setHistory((prev) => [...prev, previewNode.id]);
    setPreviewNodeId(nextNodeId);
  };

  const goBack = () => {
    // 스택에 쌓인 노드가 캔버스에서 삭제됐을 수 있으므로 생존 노드가 나올 때까지 건너뛴다.
    const liveNodeIds = new Set(useNodeStore.getState().nodes.map((node) => node.id));
    const stack = [...history];
    let target: string | undefined;
    while ((target = stack.pop()) !== undefined && !liveNodeIds.has(target)) {
      // 삭제된 노드 스킵
    }
    setHistory(stack);
    if (target) {
      setPreviewNodeId(target);
      setOpenModalComponentId(null);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={goBack}
          disabled={history.length === 0}
          className="rounded-full px-1.5 py-0.5 text-sm text-gray-500 transition-colors hover:bg-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent"
        >
          <ArrowLeft size={14} aria-hidden />
        </button>
        <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <span>{previewNode.data.route}</span>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2 overflow-auto bg-gray-50 p-6">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
            {components.length === 0 ? (
              <p className="m-auto max-w-[16rem] text-center text-xs text-gray-500">
                아직 배치된 컴포넌트가 없어요.
              </p>
            ) : (
              components.map((component) => {
                const isModal = component.type === 'modal';
                const onClickNodeId = component.onClickNodeId;
                const handleClick = isModal
                  ? () => setOpenModalComponentId(component.id) // onClickNodeId 없어도 모달은 열린다
                  : onClickNodeId
                    ? () => navigateTo(onClickNodeId)
                    : undefined;
                return (
                  <div
                    key={component.id}
                    onClick={handleClick}
                    className={`rounded-md p-1 transition-colors ${
                      handleClick ? 'cursor-pointer hover:ring-2 hover:ring-brand-100' : ''
                    }`}
                  >
                    <PageComponentPreview component={component} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 오버레이는 스크롤 div의 형제로 — 내부에 넣으면 백드롭이 스크롤에 밀려 올라간다 */}
        {openModal && (
          <PreviewModalOverlay
            component={openModal}
            targetRoute={modalTarget?.data.route ?? null}
            onClose={() => setOpenModalComponentId(null)}
            onNavigate={
              modalTargetNodeId && modalTarget ? () => navigateTo(modalTargetNodeId) : null
            }
          />
        )}
      </div>

      <div className="shrink-0 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          className="flex w-full items-center justify-center gap-1 px-4 py-2 text-center text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          {isDrawerOpen ? '레이아웃 편집 닫기' : '레이아웃 편집 열기'}
          {isDrawerOpen ? (
            <ChevronDown size={13} aria-hidden />
          ) : (
            <ChevronUp size={13} aria-hidden />
          )}
        </button>
        {isDrawerOpen && (
          <div className="h-72 border-t border-gray-100">
            <PageComponentEditor node={previewNode} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LivePreviewView;

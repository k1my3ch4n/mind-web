import { useState } from 'react';

import { usePageNodeSummary } from '@entities/node';
import { usePageComponentStore, EMPTY_PAGE_COMPONENTS, PageComponentPreview } from '@entities/page-component';

import PageComponentEditor from './PageComponentEditor';

interface LivePreviewViewProps {
  canvasSelectedNodeId: string;
}

function LivePreviewView({ canvasSelectedNodeId }: LivePreviewViewProps) {
  const [previewNodeId, setPreviewNodeId] = useState(canvasSelectedNodeId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 캔버스에서 다른 노드/엣지를 선택하면 프리뷰도 그 페이지로 따라간다 (렌더링 중 조정 — useEffect 대신 권장 패턴).
  const [trackedSelectedNodeId, setTrackedSelectedNodeId] = useState(canvasSelectedNodeId);
  if (trackedSelectedNodeId !== canvasSelectedNodeId) {
    setTrackedSelectedNodeId(canvasSelectedNodeId);
    setPreviewNodeId(canvasSelectedNodeId);
  }

  const previewNode = usePageNodeSummary(previewNodeId);
  const components = usePageComponentStore((state) =>
    previewNode ? (state.componentsByNodeId[previewNode.id] ?? EMPTY_PAGE_COMPONENTS) : EMPTY_PAGE_COMPONENTS,
  );

  if (!previewNode) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-gray-300">
        이 페이지가 삭제되었어요.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <span>{previewNode.data.route}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-auto bg-gray-50 p-6">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
          {components.length === 0 ? (
            <p className="m-auto max-w-[16rem] text-center text-xs text-gray-300">
              아직 배치된 컴포넌트가 없어요.
            </p>
          ) : (
            components.map((component) => {
              const clickable = Boolean(component.onClickNodeId);
              return (
                <div
                  key={component.id}
                  onClick={clickable ? () => setPreviewNodeId(component.onClickNodeId as string) : undefined}
                  className={`rounded-md p-1 transition-colors ${
                    clickable ? 'cursor-pointer hover:ring-2 hover:ring-blue-100' : ''
                  }`}
                >
                  <PageComponentPreview component={component} />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          className="w-full px-4 py-2 text-center text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          {isDrawerOpen ? '레이아웃 편집 닫기 ▾' : '레이아웃 편집 열기 ▴'}
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

import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';

import { useNodeStore } from '@entities/node';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

import { useStructureIssues } from '../model/useStructureIssues';
import type { StructureIssue, StructureIssueType } from '../model/types';

const ISSUE_TYPE_LABEL: Record<StructureIssueType, string> = {
  'isolated-node': '고립',
  'unreachable-page': '도달 불가',
  'dead-route': '죽은 라우트',
};

function StructureInsightPanel() {
  const { issues, usedFallbackRoot } = useStructureIssues();
  const [isOpen, setIsOpen] = useState(false);
  const { setCenter } = useReactFlow();

  const handleIssueClick = (issue: StructureIssue) => {
    // cross-store 조회는 이벤트 핸들러에서 getState로 (기존 widget/feature 레이어 컨벤션)
    useCanvasSelectionStore.getState().setSelectedNodeId(issue.nodeId);
    const node = useNodeStore.getState().nodes.find((candidate) => candidate.id === issue.nodeId);
    if (node) {
      setCenter(
        node.position.x + (node.measured?.width ?? 0) / 2,
        node.position.y + (node.measured?.height ?? 0) / 2,
        { zoom: 1, duration: 500 },
      );
    }
  };

  const hasIssues = issues.length > 0;

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
          hasIssues
            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
            : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
        }`}
      >
        {hasIssues ? `⚠ 구조 이슈 ${issues.length}` : '✓ 구조 OK'}
      </button>

      {isOpen && (
        <div className="w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
          {hasIssues ? (
            <>
              {usedFallbackRoot && (
                <p className="border-b border-gray-100 px-3 py-2 text-[11px] text-gray-400">
                  루트(&apos;/&apos;) 페이지가 없어 첫 페이지 기준으로 도달성을 검사했어요.
                </p>
              )}
              <ul className="max-h-72 overflow-auto py-1">
                {issues.map((issue) => (
                  <li key={issue.id}>
                    <button
                      type="button"
                      onClick={() => handleIssueClick(issue)}
                      className="flex w-full items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-gray-50"
                    >
                      <span className="mt-0.5 shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                        {ISSUE_TYPE_LABEL[issue.type]}
                      </span>
                      <span className="text-xs text-gray-600">{issue.message}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="px-3 py-3 text-center text-xs text-gray-300">
              발견된 구조 이슈가 없어요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default StructureInsightPanel;

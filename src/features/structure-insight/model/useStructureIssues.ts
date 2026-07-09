import { useMemo } from 'react';

import { usePageNodeSummaries } from '@entities/node';
import { useEdgeStore } from '@entities/edge';
import { usePageComponentStore } from '@entities/page-component';

import { analyzeStructure, type StructureAnalysisResult } from './analyzeStructure';

// 분석은 selector 안이 아니라 useMemo에서 실행한다 — selector가 매 호출 새 배열을 반환하면
// getSnapshot 무한 루프에 빠진다 (EMPTY_PAGE_COMPONENTS와 같은 트랩).
// 노드는 usePageNodeSummaries로 구독해 드래그(position 변경) 프레임마다 재분석하지 않는다.
export function useStructureIssues(): StructureAnalysisResult {
  const nodes = usePageNodeSummaries();
  const edges = useEdgeStore((state) => state.edges);
  const componentsByNodeId = usePageComponentStore((state) => state.componentsByNodeId);

  return useMemo(
    () => analyzeStructure({ nodes, edges, componentsByNodeId }),
    [nodes, edges, componentsByNodeId],
  );
}

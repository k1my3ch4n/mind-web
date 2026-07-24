import { findDuplicatePageRoutes, isValidPageRoute, type PageNodeSummary } from '@entities/node';
import type { RouteEdge } from '@entities/edge';
import type { PageComponentData } from '@entities/page-component';

import type { StructureIssue } from './types';

export interface StructureAnalysisInput {
  nodes: PageNodeSummary[];
  edges: Pick<RouteEdge, 'id' | 'source' | 'target'>[];
  componentsByNodeId: Record<string, PageComponentData[]>;
}

export interface StructureAnalysisResult {
  issues: StructureIssue[];
  // 루트('/') 페이지가 없어 첫 페이지를 기준으로 도달성을 검사한 경우 — 패널 캡션 안내용
  usedFallbackRoot: boolean;
}

// 노드=페이지·엣지=라우트 그래프의 정합성 이슈를 탐지하는 순수 함수 (React/zustand 무의존).
export function analyzeStructure({
  nodes,
  edges,
  componentsByNodeId,
}: StructureAnalysisInput): StructureAnalysisResult {
  const issues: StructureIssue[] = [];

  // ① 라우트 형식·중복 — 페이지 수와 무관하게 즉시 안내한다.
  const duplicateRoutes = findDuplicatePageRoutes(nodes.map((node) => node.data.route));
  for (const node of nodes) {
    if (!isValidPageRoute(node.data.route)) {
      issues.push({
        id: `invalid-route:${node.id}`,
        type: 'invalid-route',
        nodeId: node.id,
        message: `"${node.data.name}"의 경로는 /로 시작하고 공백·쿼리·해시를 포함하지 않아야 해요.`,
      });
    }
    if (duplicateRoutes.has(node.data.route)) {
      issues.push({
        id: `duplicate-route:${node.id}`,
        type: 'duplicate-route',
        nodeId: node.id,
        message: `"${node.data.route}" 경로가 다른 페이지와 중복되어 있어요.`,
      });
    }
  }

  // 페이지가 1개뿐이면 아직 연결 구조가 없다 — 첫 페이지부터 고립 경고를 띄우지 않는다.
  if (nodes.length <= 1) return { issues, usedFallbackRoot: false };

  // ② 고립 노드 — 어떤 엣지에도 붙어 있지 않은 노드 (self-loop도 "붙어 있음"으로 취급)
  const connectedNodeIds = new Set<string>();
  for (const edge of edges) {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  }
  const isolatedNodeIds = new Set<string>();
  for (const node of nodes) {
    if (connectedNodeIds.has(node.id)) continue;
    isolatedNodeIds.add(node.id);
    issues.push({
      id: `isolated-node:${node.id}`,
      type: 'isolated-node',
      nodeId: node.id,
      message: `"${node.data.name}" 페이지가 어떤 라우트와도 연결되어 있지 않아요.`,
    });
  }

  // ③ 도달 불가 페이지 — 루트에서 방향 그래프(source→target) BFS로 못 닿는 노드.
  //    고립 노드는 정의상 여기에도 걸리므로 제외 (노드당 가장 구체적인 이슈 1개).
  const rootByRoute = nodes.find((node) => node.data.route === '/');
  const root = rootByRoute ?? nodes[0];
  const outgoingByNodeId = new Map<string, string[]>();
  for (const edge of edges) {
    const targets = outgoingByNodeId.get(edge.source);
    if (targets) targets.push(edge.target);
    else outgoingByNodeId.set(edge.source, [edge.target]);
  }
  const visited = new Set<string>([root.id]);
  const queue: string[] = [root.id];
  while (queue.length > 0) {
    const current = queue.shift() as string;
    for (const target of outgoingByNodeId.get(current) ?? []) {
      if (visited.has(target)) continue;
      visited.add(target);
      queue.push(target);
    }
  }
  for (const node of nodes) {
    if (visited.has(node.id) || isolatedNodeIds.has(node.id)) continue;
    issues.push({
      id: `unreachable-page:${node.id}`,
      type: 'unreachable-page',
      nodeId: node.id,
      message: `"${node.data.name}" 페이지는 "${root.data.name}"(${root.data.route})에서 도달할 수 없어요.`,
    });
  }

  // ④ 죽은 라우트 — 엣지는 있지만 source 페이지에 그 target으로 이동하는 컴포넌트가 없음.
  //    modal 타입도 클릭 수단으로 인정 (프리뷰에서 모달 내 "이동" 버튼이 실제 동작).
  const nodeDataById = new Map(nodes.map((node) => [node.id, node.data]));
  for (const edge of edges) {
    const hasClickSource = (componentsByNodeId[edge.source] ?? []).some(
      (component) => component.onClickNodeId === edge.target,
    );
    if (hasClickSource) continue;
    const sourceData = nodeDataById.get(edge.source);
    const targetData = nodeDataById.get(edge.target);
    if (!sourceData || !targetData) continue;
    issues.push({
      id: `dead-route:${edge.id}`,
      type: 'dead-route',
      nodeId: edge.source,
      edgeId: edge.id,
      message: `"${sourceData.name}" → ${targetData.route} 라우트가 있지만, 클릭해서 이동할 컴포넌트가 없어요.`,
    });
  }

  return { issues, usedFallbackRoot: !rootByRoute && nodes.length > 1 };
}

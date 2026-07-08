import type { Edge } from '@xyflow/react';

// 라우트 엣지의 라벨은 별도 데이터가 아니라 target 노드의 route에서 파생된다 (단일 소스).
export type RouteEdge = Edge<Record<string, never>, 'routeEdge'>;

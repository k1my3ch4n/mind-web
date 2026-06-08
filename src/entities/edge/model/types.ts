import type { Edge } from '@xyflow/react';

export interface RouteEdgeData extends Record<string, unknown> {
  label: string;
}

export type RouteEdge = Edge<RouteEdgeData, 'routeEdge'>;

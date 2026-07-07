import { addEdge, applyEdgeChanges, type Connection, type EdgeChange } from '@xyflow/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { RouteEdge } from './types';

interface EdgeStoreState {
  edges: RouteEdge[];
  onEdgesChange: (changes: EdgeChange<RouteEdge>[]) => void;
  addRouteEdge: (connection: Connection, label?: string) => void;
  updateEdgeLabel: (id: string, label: string) => void;
  loadEdges: (edges: RouteEdge[]) => void;
}

export const useEdgeStore = create<EdgeStoreState>()(
  persist(
    (set, get) => ({
      edges: [],
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      addRouteEdge: (connection, label = '') =>
        set({
          edges: addEdge<RouteEdge>(
            { ...connection, id: crypto.randomUUID(), type: 'routeEdge', data: { label } },
            get().edges,
          ),
        }),
      updateEdgeLabel: (id, label) =>
        set({
          edges: get().edges.map((edge) =>
            edge.id === id ? { ...edge, data: { ...edge.data, label } } : edge,
          ),
        }),
      loadEdges: (edges) => set({ edges }),
    }),
    {
      name: 'mind-web-edges',
      partialize: (state) => ({ edges: state.edges }),
    },
  ),
);

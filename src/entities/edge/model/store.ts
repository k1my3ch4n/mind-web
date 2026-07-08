import { addEdge, applyEdgeChanges, type Connection, type EdgeChange } from '@xyflow/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { RouteEdge } from './types';

interface EdgeStoreState {
  edges: RouteEdge[];
  onEdgesChange: (changes: EdgeChange<RouteEdge>[]) => void;
  addRouteEdge: (connection: Connection) => void;
  loadEdges: (edges: RouteEdge[]) => void;
}

export const useEdgeStore = create<EdgeStoreState>()(
  persist(
    (set, get) => ({
      edges: [],
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      addRouteEdge: (connection) =>
        set({
          edges: addEdge<RouteEdge>(
            { ...connection, id: crypto.randomUUID(), type: 'routeEdge' },
            get().edges,
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

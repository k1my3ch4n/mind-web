import { applyNodeChanges, type NodeChange, type XYPosition } from '@xyflow/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PageNode, PageNodeData } from './types';

interface NodeStoreState {
  nodes: PageNode[];
  onNodesChange: (changes: NodeChange<PageNode>[]) => void;
  addPageNode: (position: XYPosition) => void;
  renameNode: (id: string, data: Partial<PageNodeData>) => void;
  loadNodes: (nodes: PageNode[]) => void;
}

export const useNodeStore = create<NodeStoreState>()(
  persist(
    (set, get) => ({
      nodes: [],
      onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      addPageNode: (position) =>
        set({
          nodes: [
            ...get().nodes,
            {
              id: crypto.randomUUID(),
              type: 'pageNode',
              position,
              data: { name: '새 페이지', route: '/', layout: null },
            },
          ],
        }),
      renameNode: (id, data) =>
        set({
          nodes: get().nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
          ),
        }),
      loadNodes: (nodes) => set({ nodes }),
    }),
    {
      name: 'mind-web-nodes',
      partialize: (state) => ({ nodes: state.nodes }),
    },
  ),
);

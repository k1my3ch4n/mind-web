import { useMemo } from 'react';
import { applyNodeChanges, type NodeChange, type XYPosition } from '@xyflow/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import type { PageNode, PageNodeData, PageNodeSummary } from './types';

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
              data: { name: '새 페이지', route: '/' },
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

// 노드 요약 selector — id(문자열)와 data(참조)만 비교하므로 드래그로 position이 바뀌어도 리렌더되지 않고,
// 이름/라우트가 실제로 바뀔 때(renameNode가 data 객체를 새로 만들 때)만 반응한다.
export function usePageNodeSummary(nodeId: string | null | undefined): PageNodeSummary | null {
  return useNodeStore(
    useShallow((state) => {
      const node = state.nodes.find((candidate) => candidate.id === nodeId);
      return node ? { id: node.id, data: node.data } : null;
    }),
  );
}

// 전체 노드 요약 목록 — 원소를 매번 새 객체로 만들면 shallow 비교가 무력화되므로,
// 드래그 중에도 참조가 유지되는 id/data 배열을 각각 구독한 뒤 합성한다.
export function usePageNodeSummaries(): PageNodeSummary[] {
  const ids = useNodeStore(useShallow((state) => state.nodes.map((node) => node.id)));
  const datas = useNodeStore(useShallow((state) => state.nodes.map((node) => node.data)));

  return useMemo(() => ids.map((id, index) => ({ id, data: datas[index] })), [ids, datas]);
}

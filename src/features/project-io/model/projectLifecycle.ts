import { useEdgeStore } from '@entities/edge';
import { useNodeStore } from '@entities/node';
import { usePageComponentStore } from '@entities/page-component';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

// persist 미들웨어가 set 시점에 localStorage를 함께 갱신하므로 별도 removeItem은 불필요하다.
export function resetProject() {
  useNodeStore.getState().loadNodes([]);
  useEdgeStore.getState().loadEdges([]);
  usePageComponentStore.getState().loadComponents({});
  useCanvasSelectionStore.getState().setSelectedNodeId(null);
}

export function useHasProjectData(): boolean {
  const hasNodes = useNodeStore((state) => state.nodes.length > 0);
  const hasEdges = useEdgeStore((state) => state.edges.length > 0);
  const hasComponents = usePageComponentStore(
    (state) => Object.keys(state.componentsByNodeId).length > 0,
  );
  return hasNodes || hasEdges || hasComponents;
}

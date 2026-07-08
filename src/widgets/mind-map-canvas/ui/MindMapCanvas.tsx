import { useCallback } from 'react';
import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useNodeStore, type PageNode } from '@entities/node';
import { edgeTypes, useEdgeStore, type RouteEdge } from '@entities/edge';
import { usePageComponentStore } from '@entities/page-component';
import { AddPageNodeButton } from '@features/add-page-node';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

import { nodeTypes } from './nodeTypes';

function MindMapCanvasInner() {
  const nodes = useNodeStore((state) => state.nodes);
  const onNodesChange = useNodeStore((state) => state.onNodesChange);

  const edges = useEdgeStore((state) => state.edges);
  const onEdgesChange = useEdgeStore((state) => state.onEdgesChange);
  const addRouteEdge = useEdgeStore((state) => state.addRouteEdge);

  const removeNodeReferences = usePageComponentStore((state) => state.removeNodeReferences);

  const setSelectedNodeId = useCanvasSelectionStore((state) => state.setSelectedNodeId);

  const handleNodesChange = useCallback(
    (changes: NodeChange<PageNode>[]) => {
      onNodesChange(changes);

      // 엣지는 React Flow가 cascading으로 지워주지만, 컴포넌트 쪽 참조는 여기서 함께 정리해야 한다.
      const removedNodeIds = changes
        .filter((change) => change.type === 'remove')
        .map((change) => change.id);
      if (removedNodeIds.length > 0) removeNodeReferences(removedNodeIds);
    },
    [onNodesChange, removeNodeReferences],
  );

  const handleConnect = useCallback(
    (connection: Connection) => addRouteEdge(connection),
    [addRouteEdge],
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: { nodes: PageNode[]; edges: RouteEdge[] }) => {
      // 엣지만 선택된 경우, 그 라우트가 향하는 target 노드를 선택된 것으로 취급한다.
      setSelectedNodeId(selectedNodes[0]?.id ?? selectedEdges[0]?.target ?? null);
    },
    [setSelectedNodeId],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={handleConnect}
      onSelectionChange={handleSelectionChange}
      deleteKeyCode={['Backspace', 'Delete']}
      fitView
    >
      <Background />
      <Controls />
      <Panel position="top-left">
        <AddPageNodeButton />
      </Panel>
    </ReactFlow>
  );
}

function MindMapCanvas() {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <MindMapCanvasInner />
      </ReactFlowProvider>
    </div>
  );
}

export default MindMapCanvas;

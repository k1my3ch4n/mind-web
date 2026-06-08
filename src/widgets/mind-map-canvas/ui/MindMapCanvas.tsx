import { useCallback } from 'react';
import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes, useNodeStore, type PageNode } from '@entities/node';
import { edgeTypes, useEdgeStore, type RouteEdge } from '@entities/edge';
import { AddPageNodeButton } from '@features/add-page-node';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

function MindMapCanvasInner() {
  const nodes = useNodeStore((state) => state.nodes);
  const onNodesChange = useNodeStore((state) => state.onNodesChange);

  const edges = useEdgeStore((state) => state.edges);
  const onEdgesChange = useEdgeStore((state) => state.onEdgesChange);
  const addRouteEdge = useEdgeStore((state) => state.addRouteEdge);

  const setSelection = useCanvasSelectionStore((state) => state.setSelection);

  const handleConnect = useCallback(
    (connection: Connection) => {
      const targetNode = useNodeStore.getState().nodes.find((node) => node.id === connection.target);
      addRouteEdge(connection, targetNode?.data.route);
    },
    [addRouteEdge],
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: { nodes: PageNode[]; edges: RouteEdge[] }) => {
      setSelection({ nodeId: selectedNodes[0]?.id, edgeId: selectedEdges[0]?.id });
    },
    [setSelection],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
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
    <div className="h-screen w-screen">
      <ReactFlowProvider>
        <MindMapCanvasInner />
      </ReactFlowProvider>
    </div>
  );
}

export default MindMapCanvas;

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
import { StructureInsightPanel } from '@features/structure-insight';
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
      zoomOnDoubleClick={false}
      fitView
    >
      <Background />
      <Controls />
      {nodes.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-brand-100 bg-white/95 p-7 text-center shadow-xl shadow-brand-100/50 backdrop-blur">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-xl text-brand-600">
              ◇
            </div>
            <h2 className="text-lg font-semibold text-gray-900">첫 페이지에서 시작해보세요</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              페이지를 만들고 연결하면 마인드맵이 곧 클릭 가능한 웹사이트 구조가 됩니다.
            </p>

            <ol className="my-6 grid grid-cols-3 gap-3 text-left">
              {[
                ['1', '페이지 만들기'],
                ['2', '화면 구성하기'],
                ['3', '프리뷰 확인'],
              ].map(([step, label]) => (
                <li key={step} className="rounded-xl bg-gray-50 p-3">
                  <span className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                    {step}
                  </span>
                  <span className="text-xs font-medium text-gray-600">{label}</span>
                </li>
              ))}
            </ol>

            <AddPageNodeButton variant="onboarding" />
            <p className="mt-3 text-xs text-gray-400">작업 내용은 이 브라우저에 자동 저장됩니다.</p>
          </div>
        </div>
      ) : (
        <>
          <Panel position="top-left">
            <AddPageNodeButton />
          </Panel>
          <Panel position="top-right">
            <StructureInsightPanel />
          </Panel>
        </>
      )}
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

import { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useNodesData,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

// 타입 전용 import — 라벨(=target 노드의 route)의 조회/수정은 React Flow 인스턴스를 통해서만 하므로
// entities/node의 store에는 의존하지 않는다.
import type { PageNode } from '@entities/node';

import type { RouteEdge } from '../model/types';

function RouteEdgeLabel({
  id,
  target,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  selected,
}: EdgeProps<RouteEdge>) {
  const { updateNodeData } = useReactFlow<PageNode>();
  // 라벨은 target 노드의 route에서 파생된다 (단일 소스) — 노드의 route를 바꾸면 라벨도 즉시 따라간다.
  const targetNode = useNodesData<PageNode>(target);
  const route = targetNode?.data.route ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [draftRoute, setDraftRoute] = useState('');

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const startEditing = () => {
    setDraftRoute(route);
    setIsEditing(true);
  };

  const commitEditing = () => {
    updateNodeData(target, { route: draftRoute.trim() || '/' });
    setIsEditing(false);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} className={selected ? '!stroke-blue-500' : undefined} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
        >
          {isEditing ? (
            <input
              autoFocus
              value={draftRoute}
              onChange={(event) => setDraftRoute(event.target.value)}
              onBlur={commitEditing}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitEditing();
                if (event.key === 'Escape') setIsEditing(false);
              }}
              className="w-24 rounded border border-blue-400 bg-white px-1.5 py-0.5 text-xs text-gray-700 outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-500 shadow-sm hover:border-blue-300 hover:text-blue-600"
            >
              {route || '라우트 입력'}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default RouteEdgeLabel;

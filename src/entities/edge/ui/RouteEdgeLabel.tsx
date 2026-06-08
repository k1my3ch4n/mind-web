import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';

import { useEdgeStore } from '../model/store';
import type { RouteEdge } from '../model/types';

function RouteEdgeLabel({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
  selected,
}: EdgeProps<RouteEdge>) {
  const updateEdgeLabel = useEdgeStore((state) => state.updateEdgeLabel);
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(data?.label ?? '');

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const startEditing = () => {
    setDraftLabel(data?.label ?? '');
    setIsEditing(true);
  };

  const commitEditing = () => {
    updateEdgeLabel(id, draftLabel.trim());
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
              value={draftLabel}
              onChange={(event) => setDraftLabel(event.target.value)}
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
              {data?.label || '라우트 입력'}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default RouteEdgeLabel;

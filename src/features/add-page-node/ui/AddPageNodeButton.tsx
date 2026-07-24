import type { MouseEvent } from 'react';
import { useReactFlow } from '@xyflow/react';
import { FilePlus2, Plus } from 'lucide-react';

import { useNodeStore } from '@entities/node';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

interface AddPageNodeButtonProps {
  variant?: 'toolbar' | 'onboarding';
}

function AddPageNodeButton({ variant = 'toolbar' }: AddPageNodeButtonProps) {
  const { screenToFlowPosition } = useReactFlow();
  const addPageNode = useNodeStore((state) => state.addPageNode);
  const setSelectedNodeId = useCanvasSelectionStore((state) => state.setSelectedNodeId);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const canvasBounds = event.currentTarget.closest('.react-flow')?.getBoundingClientRect();
    const center = screenToFlowPosition({
      x: canvasBounds ? canvasBounds.left + canvasBounds.width / 2 : window.innerWidth / 2,
      y: canvasBounds ? canvasBounds.top + canvasBounds.height / 2 : window.innerHeight / 2,
    });
    const spread = variant === 'toolbar' ? 1 : 0;
    const nodeId = addPageNode({
      x: center.x + (Math.random() - 0.5) * 320 * spread,
      y: center.y + (Math.random() - 0.5) * 240 * spread,
    });
    setSelectedNodeId(nodeId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        variant === 'onboarding'
          ? 'inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700'
          : 'inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700'
      }
    >
      {variant === 'onboarding' ? (
        <FilePlus2 size={16} aria-hidden />
      ) : (
        <Plus size={15} aria-hidden />
      )}
      {variant === 'onboarding' ? '홈 페이지 만들기' : '페이지 추가'}
    </button>
  );
}

export default AddPageNodeButton;

import { useReactFlow } from '@xyflow/react';

import { useNodeStore } from '@entities/node';

function AddPageNodeButton() {
  const { screenToFlowPosition } = useReactFlow();
  const addPageNode = useNodeStore((state) => state.addPageNode);

  const handleClick = () => {
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    addPageNode({
      x: center.x + (Math.random() - 0.5) * 320,
      y: center.y + (Math.random() - 0.5) * 240,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700"
    >
      + 페이지
    </button>
  );
}

export default AddPageNodeButton;

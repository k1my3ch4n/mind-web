import type { PageNode } from '@entities/node';

interface ArtboardProps {
  node: PageNode;
}

function Artboard({ node }: ArtboardProps) {
  return (
    <div className="flex min-w-[220px] flex-1 items-center justify-center bg-gray-50 p-6">
      <div className="flex aspect-[3/4] w-full max-w-md flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-white text-center">
        <p className="text-sm font-medium text-gray-900">{node.data.name}</p>
        <p className="text-xs text-gray-400">{node.data.route}</p>
        <p className="mt-2 text-xs text-gray-300">레이아웃 아트보드 (Phase 3에서 구현)</p>
      </div>
    </div>
  );
}

export default Artboard;

import { useEdgeStore } from '@entities/edge';
import { usePageNodeSummaries } from '@entities/node';
import {
  usePageComponentStore,
  type PageComponentAlign,
  type PageComponentData,
  type PageComponentSize,
} from '@entities/page-component';

interface PropertyPanelProps {
  nodeId: string;
  component: PageComponentData | null;
}

interface ToggleGroupProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
}

const ALIGN_OPTIONS: { value: PageComponentAlign; label: string }[] = [
  { value: 'left', label: '왼쪽' },
  { value: 'center', label: '가운데' },
  { value: 'right', label: '오른쪽' },
];

const SIZE_OPTIONS: { value: PageComponentSize; label: string }[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
];

function ToggleGroup<T extends string>({ value, options, onChange }: ToggleGroupProps<T>) {
  return (
    <div className="flex gap-1 rounded-md bg-gray-100 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            value === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PropertyPanel({ nodeId, component }: PropertyPanelProps) {
  const updateComponent = usePageComponentStore((state) => state.updateComponent);
  const nodes = usePageNodeSummaries();

  if (!component) {
    return (
      <div className="flex w-52 shrink-0 flex-col border-l border-gray-100 p-3">
        <h3 className="mb-2 text-xs font-medium text-gray-400">속성</h3>
        <p className="text-xs text-gray-300">아트보드에서 컴포넌트를 선택하면 속성을 편집할 수 있어요.</p>
      </div>
    );
  }

  const update = (patch: Partial<PageComponentData>) => updateComponent(nodeId, component.id, patch);

  // "클릭 시 이동"은 곧 라우트이므로, 캔버스에 해당 엣지가 없으면 자동 생성해 구조와 프리뷰 동작을 일치시킨다.
  const updateOnClickNodeId = (targetNodeId: string | null) => {
    update({ onClickNodeId: targetNodeId });
    if (!targetNodeId || targetNodeId === nodeId) return;

    const { edges, addRouteEdge } = useEdgeStore.getState();
    const hasEdge = edges.some((edge) => edge.source === nodeId && edge.target === targetNodeId);
    if (!hasEdge) {
      addRouteEdge({ source: nodeId, target: targetNodeId, sourceHandle: null, targetHandle: null });
    }
  };

  return (
    <div className="flex w-52 shrink-0 flex-col gap-4 overflow-auto border-l border-gray-100 p-3">
      <h3 className="text-xs font-medium text-gray-400">속성</h3>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-500">텍스트</span>
        <textarea
          rows={2}
          value={component.text}
          onChange={(event) => update({ text: event.target.value })}
          className="resize-none rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-400"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-500">정렬</span>
        <ToggleGroup value={component.align} options={ALIGN_OPTIONS} onChange={(align) => update({ align })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-500">크기</span>
        <ToggleGroup value={component.size} options={SIZE_OPTIONS} onChange={(size) => update({ size })} />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-500">클릭 시 이동</span>
        <select
          value={component.onClickNodeId ?? ''}
          onChange={(event) => updateOnClickNodeId(event.target.value || null)}
          className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-400"
        >
          <option value="">없음</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.data.name} ({node.data.route})
              {node.id === nodeId ? ' · 현재 페이지' : ''}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default PropertyPanel;

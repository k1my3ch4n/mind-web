import type { PageComponentAlign, PageComponentData, PageComponentType } from '../model/types';

// 노드 카드의 한정된 높이(h-20) 안에서 클리핑을 줄이기 위한 표시 개수 상한.
const MAX_VISIBLE = 5;

const ALIGN_CLASS: Record<PageComponentAlign, string> = {
  left: 'self-start',
  center: 'self-center',
  right: 'self-end',
};

// 실제 컴포넌트 렌더링 대신 타입별 단순 도형으로 축약해, 노드가 많아져도 가볍고 미니맵처럼 읽히게 한다.
const SHAPE_CLASS: Record<PageComponentType, string> = {
  button: 'h-2 w-10 rounded-sm bg-blue-400',
  text: 'h-1.5 w-3/4 rounded-full bg-gray-200',
  image: 'h-5 w-full rounded-sm border border-dashed border-gray-300 bg-gray-100',
  input: 'h-2.5 w-full rounded-sm border border-gray-300 bg-white',
  card: 'h-5 w-full rounded-sm border border-gray-200 bg-gray-50',
  modal: 'h-2 w-12 rounded-sm border border-gray-300 bg-white',
};

interface PageComponentMiniPreviewProps {
  components: PageComponentData[];
}

function PageComponentMiniPreview({ components }: PageComponentMiniPreviewProps) {
  const visible = components.slice(0, MAX_VISIBLE);
  const hiddenCount = components.length - visible.length;

  return (
    <div className="flex h-full w-full flex-col gap-1 overflow-hidden">
      {visible.map((component) => (
        <div
          key={component.id}
          className={`shrink-0 ${SHAPE_CLASS[component.type]} ${ALIGN_CLASS[component.align]}`}
        />
      ))}
      {hiddenCount > 0 && (
        <p className="shrink-0 text-[10px] leading-none text-gray-400">+{hiddenCount}</p>
      )}
    </div>
  );
}

export default PageComponentMiniPreview;

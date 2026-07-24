import { useReactFlow, type NodeProps } from '@xyflow/react';

import {
  findDuplicatePageRoutes,
  isValidPageRoute,
  PageNodeCard,
  usePageNodeSummaries,
  type PageNode,
} from '@entities/node';
import {
  usePageComponentStore,
  EMPTY_PAGE_COMPONENTS,
  PageComponentMiniPreview,
} from '@entities/page-component';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

// 노드 카드(entities/node)와 페이지 컴포넌트 데이터(entities/page-component)의 결합은
// entities 간 직접 의존을 피해 widget 레이어에서 합성한다 (handleConnect의 cross-store 패턴과 동일한 기준).
function PageNodeWithMiniPreview(props: NodeProps<PageNode>) {
  const { deleteElements } = useReactFlow();
  const nodes = usePageNodeSummaries();
  const components = usePageComponentStore(
    (state) => state.componentsByNodeId[props.id] ?? EMPTY_PAGE_COMPONENTS,
  );
  const duplicateRoutes = findDuplicatePageRoutes(nodes.map((node) => node.data.route));
  const routeStatus = !isValidPageRoute(props.data.route)
    ? 'invalid'
    : duplicateRoutes.has(props.data.route)
      ? 'duplicate'
      : 'valid';

  const handleDelete = () => {
    if (
      !window.confirm(
        `"${props.data.name}" 페이지를 삭제할까요? 연결과 페이지 구성도 함께 삭제됩니다.`,
      )
    ) {
      return;
    }
    useCanvasSelectionStore.getState().setSelectedNodeId(null);
    void deleteElements({ nodes: [{ id: props.id }] });
  };

  return (
    <PageNodeCard
      {...props}
      componentCount={components.length}
      routeStatus={routeStatus}
      onDelete={handleDelete}
      miniPreview={
        components.length > 0 ? <PageComponentMiniPreview components={components} /> : undefined
      }
    />
  );
}

export default PageNodeWithMiniPreview;

import type { NodeProps } from '@xyflow/react';

import { PageNodeCard, type PageNode } from '@entities/node';
import {
  usePageComponentStore,
  EMPTY_PAGE_COMPONENTS,
  PageComponentMiniPreview,
} from '@entities/page-component';

// 노드 카드(entities/node)와 페이지 컴포넌트 데이터(entities/page-component)의 결합은
// entities 간 직접 의존을 피해 widget 레이어에서 합성한다 (handleConnect의 cross-store 패턴과 동일한 기준).
function PageNodeWithMiniPreview(props: NodeProps<PageNode>) {
  const components = usePageComponentStore(
    (state) => state.componentsByNodeId[props.id] ?? EMPTY_PAGE_COMPONENTS,
  );

  return (
    <PageNodeCard
      {...props}
      miniPreview={
        components.length > 0 ? <PageComponentMiniPreview components={components} /> : undefined
      }
    />
  );
}

export default PageNodeWithMiniPreview;

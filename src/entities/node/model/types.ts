import type { Node } from '@xyflow/react';

export interface PageNodeData extends Record<string, unknown> {
  name: string;
  route: string;
}

export type PageNode = Node<PageNodeData, 'pageNode'>;

// 에디터/프리뷰처럼 노드의 위치(position)와는 무관한 소비자를 위한 요약 뷰 —
// 드래그(position 변경)에 반응하지 않는 selector(usePageNodeSummary 등)와 함께 사용한다.
export type PageNodeSummary = Pick<PageNode, 'id' | 'data'>;

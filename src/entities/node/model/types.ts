import type { Node } from '@xyflow/react';

export interface PageNodeData extends Record<string, unknown> {
  name: string;
  route: string;
  layout: string | null;
}

export type PageNode = Node<PageNodeData, 'pageNode'>;

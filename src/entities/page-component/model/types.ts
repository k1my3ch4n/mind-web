export type PageComponentType = 'button' | 'text' | 'image' | 'input' | 'card' | 'modal';

export type PageComponentAlign = 'left' | 'center' | 'right';

export type PageComponentSize = 'sm' | 'md' | 'lg';

export interface PageComponentData {
  id: string;
  type: PageComponentType;
  text: string;
  align: PageComponentAlign;
  size: PageComponentSize;
  onClickNodeId: string | null;
}

// 런타임 검증(예: 프로젝트 파일 불러오기)에서도 쓸 수 있도록 const 배열을 단일 소스로 두고 타입을 파생한다.
export const PAGE_COMPONENT_TYPES = ['button', 'text', 'image', 'input', 'card', 'modal'] as const;
export type PageComponentType = (typeof PAGE_COMPONENT_TYPES)[number];

export const PAGE_COMPONENT_ALIGNS = ['left', 'center', 'right'] as const;
export type PageComponentAlign = (typeof PAGE_COMPONENT_ALIGNS)[number];

export const PAGE_COMPONENT_SIZES = ['sm', 'md', 'lg'] as const;
export type PageComponentSize = (typeof PAGE_COMPONENT_SIZES)[number];

export interface PageComponentData {
  id: string;
  type: PageComponentType;
  text: string;
  align: PageComponentAlign;
  size: PageComponentSize;
  onClickNodeId: string | null;
}

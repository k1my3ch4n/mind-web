import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PageComponentData, PageComponentType } from './types';

// 매번 새 배열을 반환하면 useSyncExternalStore가 "getSnapshot should be cached" 무한 루프에 빠지므로 고정 참조로 공유한다.
export const EMPTY_PAGE_COMPONENTS: PageComponentData[] = [];

const DEFAULT_TEXT: Record<PageComponentType, string> = {
  button: '버튼',
  text: '텍스트',
  image: '이미지',
  input: '입력값을 입력하세요',
  card: '카드 제목',
  modal: '모달 열기',
};

function createComponent(type: PageComponentType): PageComponentData {
  return {
    id: crypto.randomUUID(),
    type,
    text: DEFAULT_TEXT[type],
    align: 'left',
    size: 'md',
    onClickNodeId: null,
  };
}

interface PageComponentStoreState {
  componentsByNodeId: Record<string, PageComponentData[]>;
  addComponent: (nodeId: string, type: PageComponentType) => void;
  reorderComponents: (nodeId: string, activeId: string, overId: string) => void;
  updateComponent: (nodeId: string, componentId: string, patch: Partial<PageComponentData>) => void;
  removeComponent: (nodeId: string, componentId: string) => void;
}

export const usePageComponentStore = create<PageComponentStoreState>()(
  persist(
    (set, get) => ({
      componentsByNodeId: {},
      addComponent: (nodeId, type) =>
        set({
          componentsByNodeId: {
            ...get().componentsByNodeId,
            [nodeId]: [...(get().componentsByNodeId[nodeId] ?? []), createComponent(type)],
          },
        }),
      reorderComponents: (nodeId, activeId, overId) => {
        const components = get().componentsByNodeId[nodeId] ?? [];
        const activeIndex = components.findIndex((component) => component.id === activeId);
        const overIndex = components.findIndex((component) => component.id === overId);
        if (activeIndex === -1 || overIndex === -1) return;

        set({
          componentsByNodeId: {
            ...get().componentsByNodeId,
            [nodeId]: arrayMove(components, activeIndex, overIndex),
          },
        });
      },
      updateComponent: (nodeId, componentId, patch) =>
        set({
          componentsByNodeId: {
            ...get().componentsByNodeId,
            [nodeId]: (get().componentsByNodeId[nodeId] ?? []).map((component) =>
              component.id === componentId ? { ...component, ...patch } : component,
            ),
          },
        }),
      removeComponent: (nodeId, componentId) =>
        set({
          componentsByNodeId: {
            ...get().componentsByNodeId,
            [nodeId]: (get().componentsByNodeId[nodeId] ?? []).filter(
              (component) => component.id !== componentId,
            ),
          },
        }),
    }),
    {
      name: 'mind-web-page-components',
      partialize: (state) => ({ componentsByNodeId: state.componentsByNodeId }),
    },
  ),
);

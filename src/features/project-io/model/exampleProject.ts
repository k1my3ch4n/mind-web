import { useCanvasSelectionStore } from '@shared/model/selectionStore';

import { applyProjectFile } from './projectFile';
import type { ProjectFile } from './projectFile';

const HOME_NODE_ID = 'example-home';
const PRODUCTS_NODE_ID = 'example-products';
const DETAIL_NODE_ID = 'example-detail';
const CART_NODE_ID = 'example-cart';

function createExampleProject(): ProjectFile {
  return {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    nodes: [
      {
        id: HOME_NODE_ID,
        type: 'pageNode',
        position: { x: 0, y: 160 },
        data: { name: '홈', route: '/' },
      },
      {
        id: PRODUCTS_NODE_ID,
        type: 'pageNode',
        position: { x: 340, y: 40 },
        data: { name: '상품 목록', route: '/products' },
      },
      {
        id: DETAIL_NODE_ID,
        type: 'pageNode',
        position: { x: 680, y: 40 },
        data: { name: '상품 상세', route: '/products/detail' },
      },
      {
        id: CART_NODE_ID,
        type: 'pageNode',
        position: { x: 680, y: 320 },
        data: { name: '장바구니', route: '/cart' },
      },
    ],
    edges: [
      {
        id: 'example-home-products',
        type: 'routeEdge',
        source: HOME_NODE_ID,
        target: PRODUCTS_NODE_ID,
      },
      {
        id: 'example-products-detail',
        type: 'routeEdge',
        source: PRODUCTS_NODE_ID,
        target: DETAIL_NODE_ID,
      },
      {
        id: 'example-detail-cart',
        type: 'routeEdge',
        source: DETAIL_NODE_ID,
        target: CART_NODE_ID,
      },
    ],
    componentsByNodeId: {
      [HOME_NODE_ID]: [
        {
          id: 'example-home-heading',
          type: 'text',
          text: '일상을 더 가볍게 만드는 제품',
          align: 'center',
          size: 'lg',
          onClickNodeId: null,
        },
        {
          id: 'example-home-visual',
          type: 'image',
          text: '시즌 컬렉션',
          align: 'center',
          size: 'lg',
          onClickNodeId: null,
        },
        {
          id: 'example-home-cta',
          type: 'button',
          text: '상품 둘러보기',
          align: 'center',
          size: 'md',
          onClickNodeId: PRODUCTS_NODE_ID,
        },
      ],
      [PRODUCTS_NODE_ID]: [
        {
          id: 'example-products-heading',
          type: 'text',
          text: '이번 주 인기 상품',
          align: 'left',
          size: 'lg',
          onClickNodeId: null,
        },
        {
          id: 'example-product-lamp',
          type: 'card',
          text: '미니멀 데스크 램프',
          align: 'left',
          size: 'lg',
          onClickNodeId: DETAIL_NODE_ID,
        },
        {
          id: 'example-product-tray',
          type: 'card',
          text: '모듈형 수납 트레이',
          align: 'left',
          size: 'md',
          onClickNodeId: DETAIL_NODE_ID,
        },
      ],
      [DETAIL_NODE_ID]: [
        {
          id: 'example-detail-visual',
          type: 'image',
          text: '미니멀 데스크 램프',
          align: 'center',
          size: 'lg',
          onClickNodeId: null,
        },
        {
          id: 'example-detail-copy',
          type: 'text',
          text: '공간에 자연스럽게 스며드는 은은한 조명',
          align: 'left',
          size: 'md',
          onClickNodeId: null,
        },
        {
          id: 'example-detail-cta',
          type: 'button',
          text: '장바구니에 담기',
          align: 'left',
          size: 'md',
          onClickNodeId: CART_NODE_ID,
        },
      ],
      [CART_NODE_ID]: [
        {
          id: 'example-cart-heading',
          type: 'text',
          text: '장바구니',
          align: 'left',
          size: 'lg',
          onClickNodeId: null,
        },
        {
          id: 'example-cart-product',
          type: 'card',
          text: '미니멀 데스크 램프',
          align: 'left',
          size: 'md',
          onClickNodeId: null,
        },
        {
          id: 'example-cart-ready',
          type: 'button',
          text: '주문 준비 완료',
          align: 'right',
          size: 'md',
          onClickNodeId: null,
        },
      ],
    },
  };
}

export function loadExampleProject() {
  applyProjectFile(createExampleProject());
  useCanvasSelectionStore.getState().setSelectedNodeId(HOME_NODE_ID);
}

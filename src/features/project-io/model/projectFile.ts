import { useEdgeStore } from '@entities/edge';
import type { RouteEdge } from '@entities/edge';
import { useNodeStore } from '@entities/node';
import type { PageNode } from '@entities/node';
import {
  usePageComponentStore,
  PAGE_COMPONENT_ALIGNS,
  PAGE_COMPONENT_SIZES,
  PAGE_COMPONENT_TYPES,
} from '@entities/page-component';
import type { PageComponentData } from '@entities/page-component';

export interface ProjectFile {
  formatVersion: 1;
  exportedAt: string;
  nodes: PageNode[];
  edges: RouteEdge[];
  componentsByNodeId: Record<string, PageComponentData[]>;
}

export function buildProjectFile(): ProjectFile {
  return {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    nodes: useNodeStore.getState().nodes,
    edges: useEdgeStore.getState().edges,
    componentsByNodeId: usePageComponentStore.getState().componentsByNodeId,
  };
}

export function downloadProjectFile(file: ProjectFile) {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mind-web-project-${file.exportedAt.slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function includes<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (options as readonly string[]).includes(value);
}

function isPageNode(value: unknown): value is PageNode {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isRecord(value.position) &&
    Number.isFinite(value.position.x) &&
    Number.isFinite(value.position.y) &&
    isRecord(value.data) &&
    typeof value.data.name === 'string' &&
    typeof value.data.route === 'string'
  );
}

function isRouteEdge(value: unknown): value is RouteEdge {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.source === 'string' &&
    typeof value.target === 'string'
  );
}

function isPageComponent(value: unknown): value is PageComponentData {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    includes(PAGE_COMPONENT_TYPES, value.type) &&
    typeof value.text === 'string' &&
    includes(PAGE_COMPONENT_ALIGNS, value.align) &&
    includes(PAGE_COMPONENT_SIZES, value.size) &&
    (value.onClickNodeId === null || typeof value.onClickNodeId === 'string')
  );
}

// 노드 목록을 기준으로 참조 정합성을 맞춘다 — 형식이 맞는 파일은 깨진 참조가 있어도 정리해서 수용한다 (불러오기 관대).
function sanitizeProjectFile(file: ProjectFile): ProjectFile {
  const nodeIds = new Set(file.nodes.map((node) => node.id));

  const edges = file.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

  const componentsByNodeId: Record<string, PageComponentData[]> = {};
  for (const [nodeId, components] of Object.entries(file.componentsByNodeId)) {
    if (!nodeIds.has(nodeId)) continue;
    componentsByNodeId[nodeId] = components.map((component) =>
      component.onClickNodeId && !nodeIds.has(component.onClickNodeId)
        ? { ...component, onClickNodeId: null }
        : component,
    );
  }

  return { ...file, edges, componentsByNodeId };
}

export function parseProjectFile(raw: unknown): ProjectFile | null {
  if (!isRecord(raw)) return null;
  if (raw.formatVersion !== 1) return null;
  if (!Array.isArray(raw.nodes) || !raw.nodes.every(isPageNode)) return null;
  if (!Array.isArray(raw.edges) || !raw.edges.every(isRouteEdge)) return null;

  const componentsByNodeId = raw.componentsByNodeId;
  if (!isRecord(componentsByNodeId)) return null;
  for (const components of Object.values(componentsByNodeId)) {
    if (!Array.isArray(components) || !components.every(isPageComponent)) return null;
  }

  return sanitizeProjectFile({
    formatVersion: 1,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : '',
    nodes: raw.nodes,
    edges: raw.edges,
    componentsByNodeId: componentsByNodeId as Record<string, PageComponentData[]>,
  });
}

export function applyProjectFile(file: ProjectFile) {
  useNodeStore.getState().loadNodes(file.nodes);
  useEdgeStore.getState().loadEdges(file.edges);
  usePageComponentStore.getState().loadComponents(file.componentsByNodeId);
}

import { useEdgeStore } from '@entities/edge';
import type { RouteEdge } from '@entities/edge';
import { useNodeStore } from '@entities/node';
import type { PageNode } from '@entities/node';
import { usePageComponentStore } from '@entities/page-component';
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

export function parseProjectFile(raw: unknown): ProjectFile | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const candidate = raw as Record<string, unknown>;
  if (candidate.formatVersion !== 1) return null;
  if (!Array.isArray(candidate.nodes)) return null;
  if (!Array.isArray(candidate.edges)) return null;
  if (typeof candidate.componentsByNodeId !== 'object' || candidate.componentsByNodeId === null) {
    return null;
  }

  return candidate as unknown as ProjectFile;
}

export function applyProjectFile(file: ProjectFile) {
  useNodeStore.getState().loadNodes(file.nodes);
  useEdgeStore.getState().loadEdges(file.edges);
  usePageComponentStore.getState().loadComponents(file.componentsByNodeId);
}

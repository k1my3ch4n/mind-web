import { create } from 'zustand';

import { useEdgeStore, type RouteEdge } from '@entities/edge';
import { useNodeStore, type PageNode } from '@entities/node';
import { usePageComponentStore, type PageComponentData } from '@entities/page-component';
import { useCanvasSelectionStore } from '@shared/model/selectionStore';

const HISTORY_LIMIT = 50;
const COMMIT_DELAY_MS = 250;

interface ProjectSnapshot {
  nodes: PageNode[];
  edges: RouteEdge[];
  componentsByNodeId: Record<string, PageComponentData[]>;
}

interface ProjectHistoryState {
  canUndo: boolean;
  canRedo: boolean;
  setAvailability: (canUndo: boolean, canRedo: boolean) => void;
}

export const useProjectHistoryStore = create<ProjectHistoryState>((set) => ({
  canUndo: false,
  canRedo: false,
  setAvailability: (canUndo, canRedo) => set({ canUndo, canRedo }),
}));

let past: ProjectSnapshot[] = [];
let present: ProjectSnapshot | null = null;
let future: ProjectSnapshot[] = [];
let commitTimer: ReturnType<typeof setTimeout> | null = null;
let isApplyingSnapshot = false;
let stopSubscriptions: (() => void) | null = null;

function readProjectSnapshot(): ProjectSnapshot {
  const nodes = useNodeStore.getState().nodes.map((node) => ({
    id: node.id,
    type: 'pageNode' as const,
    position: { ...node.position },
    data: { ...node.data },
  }));
  const edges = useEdgeStore.getState().edges.map((edge) => ({
    id: edge.id,
    type: 'routeEdge' as const,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
  }));
  const componentsByNodeId = structuredClone(usePageComponentStore.getState().componentsByNodeId);

  return { nodes, edges, componentsByNodeId };
}

function snapshotKey(snapshot: ProjectSnapshot): string {
  return JSON.stringify(snapshot);
}

function syncAvailability() {
  useProjectHistoryStore.getState().setAvailability(past.length > 0, future.length > 0);
}

function commitCurrentSnapshot() {
  commitTimer = null;
  if (isApplyingSnapshot) return;

  const next = readProjectSnapshot();
  if (!present) {
    present = next;
    syncAvailability();
    return;
  }
  if (snapshotKey(next) === snapshotKey(present)) return;

  past = [...past, present].slice(-HISTORY_LIMIT);
  present = next;
  future = [];
  syncAvailability();
}

function scheduleCommit() {
  if (isApplyingSnapshot) return;
  if (commitTimer) clearTimeout(commitTimer);
  commitTimer = setTimeout(commitCurrentSnapshot, COMMIT_DELAY_MS);
}

function flushPendingCommit() {
  if (!commitTimer) return;
  clearTimeout(commitTimer);
  commitCurrentSnapshot();
}

function applySnapshot(snapshot: ProjectSnapshot) {
  isApplyingSnapshot = true;
  useNodeStore.getState().loadNodes(structuredClone(snapshot.nodes));
  useEdgeStore.getState().loadEdges(structuredClone(snapshot.edges));
  usePageComponentStore.getState().loadComponents(structuredClone(snapshot.componentsByNodeId));
  useCanvasSelectionStore.getState().setSelectedNodeId(null);
  isApplyingSnapshot = false;
}

export function startProjectHistory(): () => void {
  if (stopSubscriptions) return () => undefined;

  const current = readProjectSnapshot();
  if (!present || snapshotKey(current) !== snapshotKey(present)) {
    past = [];
    present = current;
    future = [];
    syncAvailability();
  }

  const unsubscribeNode = useNodeStore.subscribe(scheduleCommit);
  const unsubscribeEdge = useEdgeStore.subscribe(scheduleCommit);
  const unsubscribeComponents = usePageComponentStore.subscribe(scheduleCommit);

  stopSubscriptions = () => {
    flushPendingCommit();
    unsubscribeNode();
    unsubscribeEdge();
    unsubscribeComponents();
    stopSubscriptions = null;
  };

  return stopSubscriptions;
}

export function undoProject(): boolean {
  flushPendingCommit();
  if (!present || past.length === 0) return false;

  const previous = past[past.length - 1];
  past = past.slice(0, -1);
  future = [present, ...future];
  present = previous;
  applySnapshot(previous);
  syncAvailability();
  return true;
}

export function redoProject(): boolean {
  flushPendingCommit();
  if (!present || future.length === 0) return false;

  const next = future[0];
  future = future.slice(1);
  past = [...past, present].slice(-HISTORY_LIMIT);
  present = next;
  applySnapshot(next);
  syncAvailability();
  return true;
}

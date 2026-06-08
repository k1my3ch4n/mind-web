import { create } from 'zustand';

interface CanvasSelectionState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  setSelection: (selection: { nodeId?: string | null; edgeId?: string | null }) => void;
  clearSelection: () => void;
}

export const useCanvasSelectionStore = create<CanvasSelectionState>((set) => ({
  selectedNodeId: null,
  selectedEdgeId: null,
  setSelection: ({ nodeId = null, edgeId = null }) =>
    set({ selectedNodeId: nodeId, selectedEdgeId: edgeId }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),
}));

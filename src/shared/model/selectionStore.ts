import { create } from 'zustand';

interface CanvasSelectionState {
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
}

export const useCanvasSelectionStore = create<CanvasSelectionState>((set) => ({
  selectedNodeId: null,
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
}));

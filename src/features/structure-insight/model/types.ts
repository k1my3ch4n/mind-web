export type StructureIssueType = 'isolated-node' | 'unreachable-page' | 'dead-route';

export interface StructureIssue {
  // React key 겸 안정 식별자 — `${type}:${nodeId | edgeId}`
  id: string;
  type: StructureIssueType;
  // 목록에서 클릭했을 때 선택/포커스할 노드 (dead-route는 source 노드)
  nodeId: string;
  edgeId?: string;
  message: string;
}

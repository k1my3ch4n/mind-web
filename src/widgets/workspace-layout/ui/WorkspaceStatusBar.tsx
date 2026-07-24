import { useEdgeStore } from '@entities/edge';
import { useNodeStore } from '@entities/node';
import { useStructureIssues } from '@features/structure-insight';

function WorkspaceStatusBar() {
  const pageCount = useNodeStore((state) => state.nodes.length);
  const connectionCount = useEdgeStore((state) => state.edges.length);
  const { issues } = useStructureIssues();

  return (
    <footer
      aria-live="polite"
      className="flex h-7 shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 text-[11px] text-gray-500"
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
        <span className="font-medium text-gray-600">자동 저장됨</span>
        <span className="text-gray-300" aria-hidden>
          ·
        </span>
        <span>이 브라우저에 저장</span>
      </div>

      <div className="flex items-center gap-3">
        <span>페이지 {pageCount}개</span>
        <span>연결 {connectionCount}개</span>
        <span className={issues.length > 0 ? 'font-medium text-amber-600' : 'text-emerald-600'}>
          {issues.length > 0 ? `구조 이슈 ${issues.length}개` : '구조 정상'}
        </span>
      </div>
    </footer>
  );
}

export default WorkspaceStatusBar;

interface AppFooterProps {
  variant?: 'default' | 'compact';
}

function AppFooter({ variant = 'default' }: AppFooterProps) {
  if (variant === 'compact') {
    return (
      <footer className="flex h-6 shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 text-[11px] text-gray-400">
        <span>© mind-web</span>
        <span>작업 내용은 이 브라우저에 자동 저장됩니다</span>
      </footer>
    );
  }

  return (
    <footer className="shrink-0 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
      <p>구조를 그리면, 곧 클릭 가능한 프로토타입이 됩니다</p>
      <p className="mt-1">© 2026 mind-web</p>
    </footer>
  );
}

export default AppFooter;

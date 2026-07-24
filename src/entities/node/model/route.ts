const PAGE_ROUTE_PATTERN = /^\/(?:[^\s/?#]+(?:\/[^\s/?#]+)*)?$/;

export function isValidPageRoute(route: string): boolean {
  return PAGE_ROUTE_PATTERN.test(route);
}

export function createUniquePageRoute(existingRoutes: string[]): string {
  const routes = new Set(existingRoutes);
  if (!routes.has('/')) return '/';

  let suffix = 2;
  while (routes.has(`/page-${suffix}`)) suffix += 1;
  return `/page-${suffix}`;
}

export function findDuplicatePageRoutes(routes: string[]): Set<string> {
  const counts = new Map<string, number>();
  for (const route of routes) {
    counts.set(route, (counts.get(route) ?? 0) + 1);
  }

  return new Set(
    [...counts.entries()]
      .filter(([route, count]) => route.length > 0 && count > 1)
      .map(([route]) => route),
  );
}

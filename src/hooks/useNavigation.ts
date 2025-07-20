import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export type NavigationContext = 'global' | 'property';

export function useNavigation() {
  const pathname = usePathname();

  const context = useMemo((): NavigationContext => {
    // Check if we're on a property-specific page
    if (pathname.startsWith('/property/')) {
      return 'property';
    }
    return 'global';
  }, [pathname]);

  const currentPropertyId = useMemo(() => {
    if (context === 'property') {
      // Extract property ID from pathname like /property/123/systems
      const match = pathname.match(/^\/property\/([^\/]+)/);
      return match ? match[1] : null;
    }
    return null;
  }, [pathname, context]);

  return {
    context,
    currentPropertyId,
    pathname,
  };
}

'use client';

import { usePathname } from 'next/navigation';
import { LeftNavigation } from './LeftNavigation';

interface AppLayoutContentProps {
  children: React.ReactNode;
}

export function AppLayoutContent({ children }: AppLayoutContentProps) {
  const pathname = usePathname();

  // Check if we're on an auth route
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // For auth routes, don't show the navigation
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // For app routes, show the navigation
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftNavigation />
      <main className="flex-1 overflow-auto ml-32">{children}</main>
    </div>
  );
}

'use client';

interface AppLayoutContentProps {
  children: React.ReactNode;
}

export function AppLayoutContent({ children }: AppLayoutContentProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

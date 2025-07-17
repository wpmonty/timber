import { LeftNavigation } from '@/components/layout/LeftNavigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftNavigation />
      <main className="flex-1 overflow-auto ml-32">{children}</main>
    </div>
  );
}

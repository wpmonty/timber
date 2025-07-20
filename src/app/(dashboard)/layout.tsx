import { TopNavigation } from '@/components/layout/TopNavigation';
// import { LeftNavigation } from '@/components/layout/LeftNavigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNavigation />
      {/* <LeftNavigation /> */}
      <section className="flex-1 overflow-auto">{children}</section>
    </div>
  );
}

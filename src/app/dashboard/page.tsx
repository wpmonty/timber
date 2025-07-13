import { PropertyOverview } from '@/components/dashboard/PropertyOverview';
import { MaintainablesGrid } from '@/components/dashboard/MaintainablesGrid';
import { MaintenanceLogs } from '@/components/dashboard/MaintenanceLogs';
import { WarningAlerts } from '@/components/dashboard/WarningAlerts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor your systems & appliances maintenance schedules
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/systems">
              <Button variant="outline">View All Systems</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Property Overview */}
      <div className="mb-8">
        <PropertyOverview />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appliances Grid - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <MaintainablesGrid />
        </div>

        {/* Maintenance Logs - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
          <MaintenanceLogs />
        </div>
      </div>

      {/* Warning Alerts */}
      <div className="mt-8">
        <WarningAlerts />
      </div>
    </div>
  );
}

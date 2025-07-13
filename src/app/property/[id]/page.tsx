'use client';

import { PropertyOverview } from '@/components/dashboard/PropertyOverview';
import { MaintainablesGrid } from '@/components/dashboard/MaintainablesGrid';
import { MaintenanceLogs } from '@/components/dashboard/MaintenanceLogs';
import { WarningAlerts } from '@/components/dashboard/WarningAlerts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useProperty } from '@/hooks/api/properties';
import { useSystems } from '@/hooks/api/systems';
import { useLogs } from '@/hooks/api/logs';

interface PropertyPageProps {
  params: { id: string };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = params;

  const {
    data: properties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperty(id);
  const { data: systems, isLoading: systemsLoading, error: systemsError } = useSystems(id);
  const { data: logs, isLoading: logsLoading, error: logsError } = useLogs(id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property {id}</h1>
            <p className="mt-2 text-gray-600">
              Monitor your systems & appliances maintenance schedules
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/property/${id}/systems`}>
              <Button variant="outline">View All Systems</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Property Overview */}
      <div className="mb-8">
        <PropertyOverview
          properties={properties ? [properties] : undefined}
          systems={systems ? systems : undefined}
          logs={logs ? logs : undefined}
          propertiesLoading={propertiesLoading}
          propertiesError={propertiesError}
          systemsLoading={systemsLoading}
          systemsError={systemsError}
          logsLoading={logsLoading}
          logsError={logsError}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appliances Grid - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <MaintainablesGrid
            systems={systems ? systems : []}
            isLoading={systemsLoading}
            error={systemsError}
          />
        </div>

        {/* Maintenance Logs - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
          <MaintenanceLogs logs={logs ? logs : []} isLoading={logsLoading} error={logsError} />
        </div>
      </div>

      {/* Warning Alerts */}
      <div className="mt-8">
        <WarningAlerts
          systems={systems ? systems : []}
          logs={logs ? logs : []}
          systemsLoading={systemsLoading}
          logsLoading={logsLoading}
          systemsError={systemsError}
          logsError={logsError}
        />
      </div>
    </div>
  );
}

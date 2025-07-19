'use client';

import { PropertyOverview } from '@/components/dashboard/PropertyOverview';
import { MaintainablesGrid } from '@/components/dashboard/MaintainablesGrid';
import { MaintenanceLogs } from '@/components/dashboard/MaintenanceLogs';
import { WarningAlerts } from '@/components/dashboard/WarningAlerts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useProperty } from '@/hooks/api/properties';
import { useMaintainables } from '@/hooks/api/maintainables';
import { useLogs } from '@/hooks/api/logs';

interface PropertyPageProps {
  params: { id: string };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = params;

  // TODO combine into super query
  const { data: property, isLoading: propertyLoading, error: propertyError } = useProperty(id);
  const {
    data: maintainables,
    isLoading: maintainablesLoading,
    error: maintainablesError,
  } = useMaintainables(id);
  const { data: logs, isLoading: logsLoading, error: logsError } = useLogs(id);

  // TODO make proper 404 page
  if (!property) {
    return <div className="text-center text-2xl font-bold">Property not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            {property ? (
              <h1 className="text-3xl font-bold text-gray-900">{property.data?.address.line1}</h1>
            ) : (
              <div className="max-w-md mx-auto rounded-lg">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                </div>
              </div>
            )}
            <p className="mt-2 text-gray-600">
              Monitor your systems & appliances maintenance schedules
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/property/${id}/maintainables`}>
              <Button variant="outline">View All Maintainables</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Property Overview */}
      <div className="mb-8">
        <PropertyOverview
          property={property ? property : undefined}
          maintainables={maintainables ? maintainables : undefined}
          logs={logs ? logs : undefined}
          propertyLoading={propertyLoading}
          propertyError={propertyError}
          maintainablesLoading={maintainablesLoading}
          maintainablesError={maintainablesError}
          logsLoading={logsLoading}
          logsError={logsError}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appliances Grid - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <MaintainablesGrid
            maintainables={maintainables ? maintainables : []}
            isLoading={maintainablesLoading}
            error={maintainablesError}
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
          maintainables={maintainables ? maintainables : []}
          logs={logs ? logs : []}
          maintainablesLoading={maintainablesLoading}
          logsLoading={logsLoading}
          maintainablesError={maintainablesError}
          logsError={logsError}
        />
      </div>
    </div>
  );
}

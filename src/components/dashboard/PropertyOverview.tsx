'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateAge } from '@/lib/utils';
import { Property } from '@/types/property.types';
import { Maintainable } from '@/types/maintainables.types';
import { MaintenanceLogEntry } from '@/types/maintenance.types';

interface PropertyOverviewProps {
  property: Property | undefined;
  systems: Maintainable[] | undefined;
  logs: MaintenanceLogEntry[] | undefined;
  propertyLoading: boolean;
  propertyError: Error | null;
  systemsLoading: boolean;
  systemsError: Error | null;
  logsLoading: boolean;
  logsError: Error | null;
}

export function PropertyOverview({
  property,
  systems,
  logs,
  propertyLoading,
  propertyError,
  systemsLoading,
  systemsError,
  logsLoading,
  logsError,
}: PropertyOverviewProps) {
  if (propertyLoading || systemsLoading || logsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (propertyError || systemsError || logsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-gray-600">Unable to load property data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maintainables = systems || [];
  const maintenanceLogs = logs || [];

  if (!property || !systems || !logs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Property Found</h3>
            <p className="text-gray-600">Please add your property information to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const homeAge = calculateAge(new Date(property.data.yearBuilt, 0, 1));

  // Calculate stats from real data
  const maintainablesNeedingMaintenance = maintainables.filter(
    maintainable =>
      maintainable.data.status === 'needs-maintenance' ||
      maintainable.data.status === 'needs-repair'
  ).length;

  const criticalIssues = maintainables.filter(
    maintainable =>
      maintainable.data.status === 'needs-replacement' ||
      maintainable.data.status === 'needs-repair'
  ).length;

  const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + log.data.cost, 0);

  const avgAge =
    maintainables.length > 0
      ? maintainables.reduce((sum, maintainable) => {
          const age = maintainable.data.dateInstalled
            ? calculateAge(new Date(maintainable.data.dateInstalled))
            : 0;
          return sum + age;
        }, 0) / maintainables.length
      : 0;

  const thisYearLogs = maintenanceLogs.filter(
    log => new Date(log.data.dateCompleted).getFullYear() === new Date().getFullYear()
  );
  const thisYearCost = thisYearLogs.reduce((sum, log) => sum + log.data.cost, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Property Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium">{property.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium">{property.data.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Age:</span>
                  <Badge variant="info">{homeAge} years</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Footage:</span>
                  <span className="font-medium">{property.data.squareFootage} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{property.data.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{property.data.bathrooms}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appliance Stats */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Appliance Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Appliances:</span>
                  <span className="font-medium">{maintainables.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Need Maintenance:</span>
                  <Badge variant="warning">{maintainablesNeedingMaintenance}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical Issues:</span>
                  <Badge variant="error">{criticalIssues}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming Tasks:</span>
                  <Badge variant="info">
                    {
                      maintainables.filter(
                        m =>
                          m.data.status === 'needs-maintenance' || m.data.status === 'operational'
                      ).length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Age:</span>
                  <span className="font-medium">{Math.round(avgAge)} years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Stats */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Maintenance Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Costs:</span>
                  <span className="font-medium">{formatCurrency(totalMaintenanceCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Year:</span>
                  <span className="font-medium">{formatCurrency(thisYearCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Logs:</span>
                  <Badge variant="info">{maintenanceLogs.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Year:</span>
                  <Badge variant="info">{thisYearLogs.length}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium capitalize">
                    {property.data.homeType.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stories:</span>
                  <span className="font-medium">{property.data.stories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Garages:</span>
                  <span className="font-medium">{property.data.garages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size:</span>
                  <span className="font-medium">{property.data.lotSize} acres</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

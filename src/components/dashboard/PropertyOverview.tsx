'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateAge } from '@/lib/utils';
import { useProperties } from '@/hooks/api/properties';
import { useSystems } from '@/hooks/api/systems';
import { useLogs } from '@/hooks/api/logs';

export function PropertyOverview() {
  const {
    data: properties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperties();
  const { data: systems, isLoading: systemsLoading, error: systemsError } = useSystems();
  const { data: logs, isLoading: logsLoading, error: logsError } = useLogs();

  if (propertiesLoading || systemsLoading || logsLoading) {
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

  if (propertiesError || systemsError || logsError) {
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

  const property = properties?.[0]; // Assuming single property for now
  const maintainables = systems || [];
  const maintenanceLogs = logs || [];

  if (!property) {
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

  const homeAge = calculateAge(new Date(property.yearBuilt, 0, 1));

  // Calculate stats from real data
  const maintainablesNeedingMaintenance = maintainables.filter(maintainable =>
    maintainable.statuses.some(status => ['needs-maintenance', 'needs-repair'].includes(status))
  ).length;

  const criticalIssues = maintainables.filter(maintainable =>
    maintainable.statuses.some(status => ['needs-replacement', 'needs-repair'].includes(status))
  ).length;

  const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);

  const avgAge =
    maintainables.length > 0
      ? maintainables.reduce((sum, maintainable) => {
          const age = maintainable.dateInstalled
            ? calculateAge(new Date(maintainable.dateInstalled))
            : 0;
          return sum + age;
        }, 0) / maintainables.length
      : 0;

  const thisYearLogs = maintenanceLogs.filter(
    log => new Date(log.dateCompleted).getFullYear() === new Date().getFullYear()
  );
  const thisYearCost = thisYearLogs.reduce((sum, log) => sum + log.cost, 0);

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
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Age:</span>
                  <Badge variant="info">{homeAge} years</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Footage:</span>
                  <span className="font-medium">
                    {property.squareFootage.toLocaleString()} sq ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{property.bathrooms}</span>
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
                          m.statuses.includes('needs-maintenance') ||
                          m.statuses.includes('operational')
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
                    {property.homeType.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stories:</span>
                  <span className="font-medium">{property.stories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Garages:</span>
                  <span className="font-medium">{property.garages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size:</span>
                  <span className="font-medium">{property.lotSize} acres</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

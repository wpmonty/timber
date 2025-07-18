'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateAge } from '@/lib/utils';
import { Maintainable, MaintainableLifecycleData } from '@/types/maintainable.types';
import { MaintenanceLogEntry } from '@/types/maintenance.types';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

interface Alert {
  id: string;
  title: string;
  type: string;
  severity: AlertSeverity;
  timeframe: string;
  estimatedCost?: { min: number; max: number };
  actionRequired: boolean;
}

export function WarningAlerts({
  systems,
  logs,
  systemsLoading,
  logsLoading,
  systemsError,
  logsError,
}: {
  systems: Maintainable[];
  logs: MaintenanceLogEntry[];
  systemsLoading: boolean;
  logsLoading: boolean;
  systemsError: Error | null;
  logsError: Error | null;
}) {
  if (systemsLoading || logsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (systemsError || logsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-gray-600">Unable to load system alerts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maintainables = systems || [];
  const maintenanceLogs = logs || [];

  // Generate alerts from real data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    maintainables.forEach(maintainable => {
      const mockLifecycleData: MaintainableLifecycleData = {
        mId: maintainable.id,
        currentAge: 0,
        remainingLifespan: 0,
        replacementCostEstimate: {
          min: 0,
          max: 0,
        },
        nextMaintenanceDate: null,
        maintenanceFrequency: 'monthly',
        isUnderWarranty: false,
      };
      const age = maintainable.data.metadata?.installDate
        ? calculateAge(new Date(maintainable.data.metadata.installDate as string))
        : 0;

      // Check for maintenance issues
      if (maintainable.data.condition === 'poor' || maintainable.data.condition === 'critical') {
        alerts.push({
          id: `maintenance-${maintainable.id}`,
          title: `${maintainable.data.label} Needs Attention`,
          type: 'maintenance-due',
          severity: maintainable.data.condition === 'poor' ? 'high' : 'medium',
          timeframe: 'overdue',
          estimatedCost: mockLifecycleData ? { min: 150, max: 500 } : undefined,
          actionRequired: true,
        });
      }

      // Check for replacement needs
      if (maintainable.data.condition === 'poor' || maintainable.data.condition === 'critical') {
        alerts.push({
          id: `replacement-${maintainable.id}`,
          title: `${maintainable.data.label} Needs Replacement`,
          type: 'replacement-needed',
          severity: 'critical',
          timeframe: 'immediate',
          estimatedCost: mockLifecycleData?.replacementCostEstimate,
          actionRequired: true,
        });
      }

      // Check for near end of life
      if (mockLifecycleData && mockLifecycleData.remainingLifespan <= 3) {
        alerts.push({
          id: `eol-${maintainable.id}`,
          title: `${maintainable.data.label} Approaching End of Life`,
          type: 'replacement-needed',
          severity: mockLifecycleData.remainingLifespan <= 1 ? 'high' : 'medium',
          timeframe: `within ${mockLifecycleData.remainingLifespan} year${mockLifecycleData.remainingLifespan !== 1 ? 's' : ''}`,
          estimatedCost: mockLifecycleData.replacementCostEstimate,
          actionRequired: mockLifecycleData.remainingLifespan <= 1,
        });
      }

      // Check for warranty expiration
      if (maintainable.data.metadata?.warrantyExpiration) {
        const warrantyDate = new Date(maintainable.data.metadata.warrantyExpiration as string);
        const monthsToExpiry = Math.floor(
          (warrantyDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
        );

        if (monthsToExpiry <= 6 && monthsToExpiry > 0) {
          alerts.push({
            id: `warranty-${maintainable.id}`,
            title: `${maintainable.data.label} Warranty Expiring Soon`,
            type: 'warranty-expiring',
            severity: 'medium',
            timeframe: `in ${monthsToExpiry} month${monthsToExpiry !== 1 ? 's' : ''}`,
            estimatedCost: { min: 150, max: 300 },
            actionRequired: false,
          });
        }
      }

      // Check for no recent maintenance
      const recentLogs = maintenanceLogs.filter(
        log =>
          new Date(log.data.dateCompleted).getTime() >
          new Date().getTime() - 365 * 24 * 60 * 60 * 1000
      );

      if (recentLogs.length === 0 && age > 2) {
        alerts.push({
          id: `no-maintenance-${maintainable.id}`,
          title: `${maintainable.data.label} No Recent Maintenance`,
          type: 'no-maintenance-history',
          severity: 'high',
          timeframe: 'overdue',
          estimatedCost: { min: 150, max: 250 },
          actionRequired: true,
        });
      }
    });

    return alerts;
  };

  const allAlerts = generateAlerts();

  // Sort by severity (critical first)
  const sortedAlerts = allAlerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const criticalAlerts = sortedAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = sortedAlerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = sortedAlerts.filter(alert => alert.severity === 'medium');

  return (
    <div className="space-y-4">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Critical Issues ({criticalAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAlerts.map(alert => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 bg-white rounded-lg border border-red-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-red-900 mb-1">{alert.title}</p>
                  <div className="flex items-center gap-2 text-sm text-red-700">
                    <Badge variant="error" size="sm">
                      {alert.severity}
                    </Badge>
                    <span>{alert.timeframe}</span>
                    {alert.estimatedCost && (
                      <span className="font-medium">
                        {formatCurrency(alert.estimatedCost.min)} -{' '}
                        {formatCurrency(alert.estimatedCost.max)}
                      </span>
                    )}
                  </div>
                </div>
                {alert.actionRequired && (
                  <Badge variant="error" size="sm">
                    Action Required
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* High Priority Alerts */}
      {highAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              High Priority ({highAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {highAlerts.map(alert => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 bg-white rounded-lg border border-orange-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-orange-900 mb-1">{alert.title}</p>
                  <div className="flex items-center gap-2 text-sm text-orange-700">
                    <Badge variant="warning" size="sm">
                      {alert.severity}
                    </Badge>
                    <span>{alert.timeframe}</span>
                    {alert.estimatedCost && (
                      <span className="font-medium">
                        {formatCurrency(alert.estimatedCost.min)} -{' '}
                        {formatCurrency(alert.estimatedCost.max)}
                      </span>
                    )}
                  </div>
                </div>
                {alert.actionRequired && (
                  <Badge variant="warning" size="sm">
                    Action Required
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Medium Priority Alerts */}
      {mediumAlerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
              Medium Priority ({mediumAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mediumAlerts.map(alert => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 bg-white rounded-lg border border-yellow-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-yellow-900 mb-1">{alert.title}</p>
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <Badge variant="warning" size="sm">
                      {alert.severity}
                    </Badge>
                    <span>{alert.timeframe}</span>
                    {alert.estimatedCost && (
                      <span className="font-medium">
                        {formatCurrency(alert.estimatedCost.min)} -{' '}
                        {formatCurrency(alert.estimatedCost.max)}
                      </span>
                    )}
                  </div>
                </div>
                {alert.actionRequired && (
                  <Badge variant="warning" size="sm">
                    Action Required
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Alerts */}
      {sortedAlerts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="text-green-600 mb-2">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No urgent alerts at this time</p>
            <p className="text-sm text-gray-500 mt-1">All systems operating normally</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getSeverityColor } from '@/lib/utils';
import { mockWarnings, mockMaintenanceAlerts } from '@/data/mock-property-data';

export function WarningAlerts() {
  // Combine warnings and maintenance alerts
  const allAlerts = [
    ...mockWarnings.map(warning => ({
      id: warning.id,
      title: warning.message,
      type: warning.type,
      severity: warning.severity,
      timeframe: warning.timeframe,
      estimatedCost: warning.estimatedCost,
      actionRequired: warning.actionRequired,
    })),
    ...mockMaintenanceAlerts.map(alert => ({
      id: alert.id,
      title: alert.message,
      type: alert.type,
      severity: alert.severity,
      timeframe: alert.dueDate ? `Due: ${alert.dueDate.toLocaleDateString()}` : 'Overdue',
      estimatedCost: alert.estimatedCost,
      actionRequired: alert.actionRequired,
    })),
  ];

  // Sort by severity (critical first)
  const sortedAlerts = allAlerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (
      severityOrder[a.severity as keyof typeof severityOrder] -
      severityOrder[b.severity as keyof typeof severityOrder]
    );
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

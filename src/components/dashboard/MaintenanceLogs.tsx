'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useLogs } from '@/hooks/api/logs';
import { MaintenanceLogEntry } from '@/types/maintenance';

const getServiceTypeIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'repair':
      return '🔧';
    case 'routine-maintenance':
      return '📋';
    case 'replacement':
      return '🔄';
    case 'inspection':
      return '🔍';
    case 'cleaning':
      return '🧹';
    case 'emergency':
      return '🚨';
    default:
      return '⚙️';
  }
};

const getServiceTypeColor = (serviceType: string) => {
  switch (serviceType) {
    case 'repair':
      return 'warning';
    case 'routine-maintenance':
      return 'success';
    case 'replacement':
      return 'error';
    case 'inspection':
      return 'info';
    case 'cleaning':
      return 'info';
    case 'emergency':
      return 'error';
    default:
      return 'default';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'hvac':
      return '🌡️';
    case 'plumbing':
      return '🚿';
    case 'electrical':
      return '⚡';
    case 'roofing':
      return '🏠';
    case 'kitchen':
      return '🍴';
    case 'safety':
      return '🔒';
    case 'exterior':
      return '🌿';
    case 'flooring':
      return '🔨';
    default:
      return '🔧';
  }
};

interface MaintenanceLogItemProps {
  log: MaintenanceLogEntry;
}

function MaintenanceLogItem({ log }: MaintenanceLogItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-sm">{getCategoryIcon(log.category)}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900 truncate">{log.maintainableName}</h4>
          <Badge variant={getServiceTypeColor(log.serviceType) as any} size="sm">
            {log.serviceType.replace('-', ' ')}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-2">{log.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{formatRelativeTime(new Date(log.dateCompleted))}</span>
            <span>•</span>
            <span>{log.serviceProvider}</span>
          </div>
          <div className="font-medium text-gray-900">{formatCurrency(log.cost)}</div>
        </div>

        {log.notes && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Notes:</strong> {log.notes}
          </div>
        )}
      </div>
    </div>
  );
}

export function MaintenanceLogs() {
  const { data: logs, isLoading, error } = useLogs();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Maintenance</CardTitle>
            <Badge variant="outline">Loading...</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !logs) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Maintenance</CardTitle>
            <Badge variant="outline">Error</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-gray-600">Unable to load maintenance logs</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maintenanceLogs = logs || [];

  // Sort logs by date (most recent first)
  const sortedLogs = [...maintenanceLogs].sort(
    (a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime()
  );

  // Calculate total cost
  const totalCost = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);

  // Calculate recent logs (last 90 days)
  const recentLogs = maintenanceLogs.filter(
    log => new Date(log.dateCompleted).getTime() > new Date().getTime() - 90 * 24 * 60 * 60 * 1000
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Maintenance</CardTitle>
          <Badge variant="outline">{maintenanceLogs.length} records</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(totalCost)}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{recentLogs.length}</div>
              <div className="text-sm text-gray-600">Last 90 Days</div>
            </div>
          </div>

          {/* Maintenance Log Entries */}
          <div className="space-y-3">
            {sortedLogs.length > 0 ? (
              sortedLogs.map(log => <MaintenanceLogItem key={log.id} log={log} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p className="font-medium">No maintenance records yet</p>
                <p className="text-sm">Service records will appear here</p>
              </div>
            )}
          </div>

          {/* Recent Highlights */}
          {sortedLogs.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Recent Highlights</h4>
              <div className="space-y-2">
                {sortedLogs.slice(0, 3).map((log, index) => (
                  <div key={log.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        index === 0 ? 'bg-red-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                    ></span>
                    <span className="text-gray-600">{log.description}</span>
                    <span className="font-medium text-gray-900 ml-auto">
                      {formatCurrency(log.cost)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Maintenance - Static for now */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Upcoming Maintenance</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                <span className="text-gray-600">Furnace annual service</span>
                <Badge variant="error" size="sm">
                  Overdue
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                <span className="text-gray-600">AC pre-warranty inspection</span>
                <Badge variant="warning" size="sm">
                  Due in 6 months
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span className="text-gray-600">Refrigerator maintenance</span>
                <Badge variant="info" size="sm">
                  Due in 8 months
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

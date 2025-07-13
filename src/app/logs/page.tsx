'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLogs } from '@/hooks/api/logs';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { MaintenanceServiceType } from '@/types/maintenance';

const getServiceTypeIcon = (serviceType: MaintenanceServiceType) => {
  switch (serviceType) {
    case 'routine-maintenance':
      return '🔧';
    case 'repair':
      return '🛠️';
    case 'replacement':
      return '🔄';
    case 'inspection':
      return '🔍';
    case 'cleaning':
      return '🧹';
    case 'emergency':
      return '🚨';
    default:
      return '📋';
  }
};

const getServiceTypeBadgeVariant = (serviceType: MaintenanceServiceType) => {
  switch (serviceType) {
    case 'routine-maintenance':
      return 'info';
    case 'repair':
      return 'warning';
    case 'replacement':
      return 'error';
    case 'inspection':
      return 'success';
    case 'cleaning':
      return 'info';
    case 'emergency':
      return 'error';
    default:
      return 'default';
  }
};

export default function LogsPage() {
  const { data: logs, isLoading, error } = useLogs();
  const [sortField, setSortField] = useState<'dateCompleted' | 'cost' | 'maintainableName'>(
    'dateCompleted'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterServiceType, setFilterServiceType] = useState<MaintenanceServiceType | 'all'>('all');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Logs</h1>
          <p className="text-gray-600 mt-2">Track all maintenance activities</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading logs...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !logs) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Logs</h1>
          <p className="text-gray-600 mt-2">Track all maintenance activities</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Logs</h3>
              <p className="text-gray-600">{error?.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSort = (field: 'dateCompleted' | 'cost' | 'maintainableName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredLogs = logs.filter(
    log => filterServiceType === 'all' || log.serviceType === filterServiceType
  );

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'dateCompleted':
        aValue = new Date(a.dateCompleted).getTime();
        bValue = new Date(b.dateCompleted).getTime();
        break;
      case 'cost':
        aValue = a.cost;
        bValue = b.cost;
        break;
      case 'maintainableName':
        aValue = a.maintainableName.toLowerCase();
        bValue = b.maintainableName.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Logs</h1>
            <p className="text-gray-600 mt-2">Track all maintenance activities</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={filterServiceType}
                onChange={e =>
                  setFilterServiceType(e.target.value as MaintenanceServiceType | 'all')
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="routine-maintenance">Routine Maintenance</option>
                <option value="repair">Repair</option>
                <option value="replacement">Replacement</option>
                <option value="inspection">Inspection</option>
                <option value="cleaning">Cleaning</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {sortedLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Logs Found</h3>
              <p className="text-gray-600">No maintenance logs match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('dateCompleted')}
                    >
                      <div className="flex items-center gap-1">
                        Date Completed
                        {sortField === 'dateCompleted' && (
                          <span className="text-blue-500">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('maintainableName')}
                    >
                      <div className="flex items-center gap-1">
                        System/Appliance
                        {sortField === 'maintainableName' && (
                          <span className="text-blue-500">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('cost')}
                    >
                      <div className="flex items-center gap-1">
                        Cost
                        {sortField === 'cost' && (
                          <span className="text-blue-500">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(new Date(log.dateCompleted))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatRelativeTime(new Date(log.dateCompleted))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.maintainableName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {log.category.replace('-', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getServiceTypeIcon(log.serviceType)}</span>
                          <Badge variant={getServiceTypeBadgeVariant(log.serviceType) as any}>
                            {log.serviceType.replace('-', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {log.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(log.cost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.serviceProvider}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {log.notes || '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

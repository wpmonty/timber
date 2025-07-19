'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useSystems } from '@/hooks/api/systems';
import { useLogs } from '@/hooks/api/logs';
import { Maintainable, MaintainableLifecycleData } from '@/types/maintainable.types';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

import { listMaintainableTypeNames } from '@/lib/maintainable-registry';

interface MaintainableTableRowProps {
  maintainable: Maintainable;
}

function MaintainableTableRow({ maintainable }: MaintainableTableRowProps) {
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
  const age = 0;
  const isNearEndOfLife = mockLifecycleData.remainingLifespan <= 3;
  const needsMaintenance =
    maintainable.data.condition === 'poor' || maintainable.data.condition === 'critical';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'needs-maintenance':
        return 'warning';
      case 'needs-repair':
        return 'error';
      case 'needs-replacement':
        return 'error';
      case 'under-warranty':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card
      className={`mb-4 ${needsMaintenance ? 'border-yellow-200 bg-yellow-50' : ''} ${isNearEndOfLife ? 'border-orange-200 bg-orange-50' : ''}`}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Maintainable Info */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getCategoryIcon(maintainable.data.type ?? '')}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{maintainable.data.label}</h3>
                <p className="text-sm text-gray-600">
                  {maintainable.data.metadata?.manufacturer} {maintainable.data.metadata?.model}
                </p>
                <p className="text-xs text-gray-500 capitalize">{maintainable.data.type}</p>
              </div>
            </div>
          </div>

          {/* Status & Condition */}
          <div className="lg:col-span-2">
            <div className="space-y-1">
              <div className="text-sm flex flex-row justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium ml-1">
                  <Badge
                    variant={getStatusColor(maintainable.data.condition ?? '') as any}
                    size="sm"
                  >
                    {maintainable.data.condition?.replace('-', ' ')}
                  </Badge>
                </span>
              </div>
              <div className="text-sm flex flex-row justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium ml-1">
                  <Badge
                    variant={
                      maintainable.data.condition === 'good'
                        ? 'success'
                        : maintainable.data.condition === 'fair'
                          ? 'info'
                          : maintainable.data.condition === 'poor'
                            ? 'warning'
                            : 'error'
                    }
                    size="sm"
                  >
                    {maintainable.data.condition}
                  </Badge>
                </span>
              </div>
              <div className="text-sm flex flex-row justify-between">
                <span className="text-gray-600">Advice</span>
                <span className="font-medium ml-1">
                  {isNearEndOfLife ? (
                    <Badge variant="warning" size="sm">
                      Replace Soon
                    </Badge>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Age & Location */}
          <div className="lg:col-span-2">
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium ml-1">{age} years</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium ml-1">{maintainable.data.location}</span>
              </div>
            </div>
          </div>

          {/* Lifespan Progress */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium ml-1">
                  {mockLifecycleData.remainingLifespan} years
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 float-right ${
                    mockLifecycleData.remainingLifespan <= 1
                      ? 'bg-red-500'
                      : mockLifecycleData.remainingLifespan <= 3
                        ? 'bg-orange-500'
                        : mockLifecycleData.remainingLifespan <= 5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.max(5, (mockLifecycleData.remainingLifespan / 10) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Replacement Cost */}
          <div className="lg:col-span-2">
            <div className="text-sm">
              <span className="text-gray-600">Replacement:</span>
              <p className="font-medium text-gray-900">
                {formatCurrency(mockLifecycleData.replacementCostEstimate.min)} -{' '}
                {formatCurrency(mockLifecycleData.replacementCostEstimate.max)}
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="lg:col-span-1">
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notes */}
        {maintainable.data.tags && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm p-3 bg-gray-50 rounded">
              <span className="text-gray-600 font-medium">Notes:</span>
              <p className="text-gray-700 mt-1">{maintainable.data.tags?.join(', ')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MaintainablesPageProps {
  params: { id: string };
}

export default function MaintainablesPage({ params }: MaintainablesPageProps) {
  const { id } = params;
  const { data: systems, isLoading: systemsLoading, error: systemsError } = useSystems(id);
  const { data: logs, isLoading: logsLoading, error: logsError } = useLogs(id);

  const registeredTypes = listMaintainableTypeNames();

  if (systemsLoading || logsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading systems...</p>
          </div>
        </div>
      </div>
    );
  }

  if (systemsError || logsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">{systemsError?.message || logsError?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const maintainables = systems || [];
  const maintenanceLogs = logs || [];

  // Sort maintainables by category and name
  const sortedMaintainables = [...maintainables].sort((a, b) => {
    if (a.data.type !== b.data.type) {
      return a.data.type.localeCompare(b.data.type);
    }
    return a.data.label?.localeCompare(b.data.label ?? '') ?? 0;
  });

  // Group maintainables by category for stats
  const maintainablesByCategory = maintainables.reduce(
    (acc, maintainable) => {
      if (!acc[maintainable.data.type]) {
        acc[maintainable.data.type] = [];
      }
      acc[maintainable.data.type].push(maintainable);
      return acc;
    },
    {} as Record<string, Maintainable[]>
  );

  const needMaintenanceCount = maintainables.filter(
    maintainable =>
      maintainable.data.condition === 'poor' || maintainable.data.condition === 'critical'
  ).length;

  const underWarrantyCount = 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appliances & Systems</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive view of all your maintainable home appliances and systems
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
            <Button>Add</Button>
            <Button>Log</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registeredTypes.map(type => (
          <div key={type} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900">{type}</h2>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{maintainables.length}</div>
              <div className="text-sm text-gray-600">Total Systems</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{needMaintenanceCount}</div>
              <div className="text-sm text-gray-600">Need Maintenance</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{maintenanceLogs.length}</div>
              <div className="text-sm text-gray-600">Recent Logs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{underWarrantyCount}</div>
              <div className="text-sm text-gray-600">Under Warranty</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Header */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Maintainables ({maintainables.length})</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Sort: Category</Badge>
              <Badge variant="outline">View: Table</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Maintainables Table */}
      <div className="space-y-4">
        {sortedMaintainables.length > 0 ? (
          sortedMaintainables.map(maintainable => {
            return <MaintainableTableRow key={maintainable.id} maintainable={maintainable} />;
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Systems Found</h3>
            <p className="text-gray-600">Start by adding your first appliance or system.</p>
          </div>
        )}
      </div>

      {/* Category Summary */}
      {maintainables.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(maintainablesByCategory).map(([category, maintainables]) => (
              <Card key={category}>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 capitalize mb-2">
                    {category.replace('-', ' ')}
                  </h3>
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {maintainables.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {
                      maintainables.filter(
                        app => app.data.condition === 'poor' || app.data.condition === 'critical'
                      ).length
                    }{' '}
                    need attention
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

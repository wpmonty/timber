'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, calculateAge } from '@/lib/utils';
import { mockMaintainables, mockLifecycleData } from '@/data/mock-property-data';
import { MaintainableData, MaintainableLifecycleData } from '@/types/maintainables.types';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

interface MaintainableTableRowProps {
  maintainableData: MaintainableData;
  lifecycleData: MaintainableLifecycleData;
}

function MaintainableTableRow({ maintainableData, lifecycleData }: MaintainableTableRowProps) {
  const age = maintainableData.dateInstalled ? calculateAge(maintainableData.dateInstalled) : 0;
  const isNearEndOfLife = lifecycleData.remainingLifespan <= 3;
  const needsMaintenance =
    maintainableData.statuses.includes('needs-maintenance') ||
    maintainableData.statuses.includes('needs-repair');

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
              <span className="text-2xl">{getCategoryIcon(maintainableData.category)}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{maintainableData.name}</h3>
                <p className="text-sm text-gray-600">
                  {maintainableData.brand} {maintainableData.model}
                </p>
                <p className="text-xs text-gray-500 capitalize">{maintainableData.category}</p>
              </div>
            </div>
          </div>

          {/* Status & Condition */}
          <div className="lg:col-span-2">
            <div className="space-y-1">
              <div className="text-sm flex flex-row justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium ml-1">
                  <Badge variant={getStatusColor(maintainableData.statuses[0]) as any} size="sm">
                    {maintainableData.statuses[0].replace('-', ' ')}
                  </Badge>
                </span>
              </div>
              <div className="text-sm flex flex-row justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium ml-1">
                  <Badge
                    variant={
                      maintainableData.condition === 'excellent'
                        ? 'success'
                        : maintainableData.condition === 'good'
                          ? 'info'
                          : maintainableData.condition === 'fair'
                            ? 'warning'
                            : 'error'
                    }
                    size="sm"
                  >
                    {maintainableData.condition}
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
                <span className="font-medium ml-1">{maintainableData.location}</span>
              </div>
            </div>
          </div>

          {/* Lifespan Progress */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium ml-1">{lifecycleData.remainingLifespan} years</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 float-right ${
                    lifecycleData.remainingLifespan <= 1
                      ? 'bg-red-500'
                      : lifecycleData.remainingLifespan <= 3
                        ? 'bg-orange-500'
                        : lifecycleData.remainingLifespan <= 5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.max(5, (lifecycleData.remainingLifespan / maintainableData.expectedLifespan) * 100)}%`,
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
                {formatCurrency(lifecycleData.replacementCostEstimate.min)} -{' '}
                {formatCurrency(lifecycleData.replacementCostEstimate.max)}
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
        {maintainableData.notes && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm p-3 bg-gray-50 rounded">
              <span className="text-gray-600 font-medium">Notes:</span>
              <p className="text-gray-700 mt-1">{maintainableData.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MaintainablesPage() {
  // Sort maintainables by category and name
  const sortedMaintainables = [...mockMaintainables].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  // Group maintainables by category for stats
  const maintainablesByCategory = mockMaintainables.reduce(
    (acc, maintainable) => {
      if (!acc[maintainable.category]) {
        acc[maintainable.category] = [];
      }
      acc[maintainable.category].push(maintainable);
      return acc;
    },
    {} as Record<string, MaintainableData[]>
  );

  const needMaintenanceCount = mockMaintainables.filter(maintainable =>
    maintainable.statuses.some(status => ['needs-maintenance', 'needs-repair'].includes(status))
  ).length;

  const underWarrantyCount = mockMaintainables.filter(
    maintainable =>
      maintainable.warrantyExpiration && new Date(maintainable.warrantyExpiration) > new Date()
  ).length;

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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{mockMaintainables.length}</div>
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
              <div className="text-2xl font-bold text-green-600">13</div>
              <div className="text-sm text-gray-600">Recent Logs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Upcoming Maintenance</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Header */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Maintainables ({mockMaintainables.length})</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Sort: Category</Badge>
              <Badge variant="outline">View: Table</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Maintainables Table */}
      <div className="space-y-4">
        {sortedMaintainables.map(maintainable => {
          const lifecycleData = mockLifecycleData.find(data => data.mId === maintainable.id);
          if (!lifecycleData) return null;

          return (
            <MaintainableTableRow
              key={maintainable.id}
              maintainableData={maintainable}
              lifecycleData={lifecycleData}
            />
          );
        })}
      </div>

      {/* Category Summary */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(maintainablesByCategory).map(([category, maintainables]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 capitalize mb-2">
                  {category.replace('-', ' ')}
                </h3>
                <div className="text-2xl font-bold text-gray-700 mb-1">{maintainables.length}</div>
                <div className="text-sm text-gray-600">
                  {
                    maintainables.filter(app =>
                      app.statuses.some(status =>
                        ['needs-maintenance', 'needs-repair'].includes(status)
                      )
                    ).length
                  }{' '}
                  need attention
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

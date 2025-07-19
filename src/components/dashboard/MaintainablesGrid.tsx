'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateAge } from '@/lib/utils';
import { Maintainable, MaintainableLifecycleData } from '@/types/maintainable.types';

const mockLifecycleData: MaintainableLifecycleData[] = [
  {
    mId: '1',
    currentAge: 0,
    remainingLifespan: 0,
    replacementCostEstimate: {
      min: 0,
      max: 0,
    },
    nextMaintenanceDate: null,
    maintenanceFrequency: 'monthly',
    isUnderWarranty: false,
  },
];

interface ApplianceCardProps {
  maintainable: Maintainable;
  lifecycleData: MaintainableLifecycleData;
}

function ApplianceCard({ maintainable, lifecycleData }: ApplianceCardProps) {
  const maintainableData = maintainable.data;
  const age = maintainableData.metadata?.installDate
    ? calculateAge(new Date(maintainableData.metadata.installDate as string))
    : 0;
  const isNearEndOfLife = lifecycleData.remainingLifespan <= 3;
  const needsMaintenance =
    maintainableData.condition === 'poor' || maintainableData.condition === 'critical';

  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hvac':
        return '🌡️';
      case 'plumbing':
        return '🚿';
      case 'electrical':
        return '⚡';
      case 'exterior':
        return '🏠';
      case 'kitchen':
        return '🍴';
      case 'safety':
        return '🔒';
      case 'property':
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
      className={`relative ${needsMaintenance ? 'border-yellow-200 bg-yellow-50' : ''} ${isNearEndOfLife ? 'border-orange-200 bg-orange-50' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCategoryIcon(maintainableData.type)}</span>
            <div>
              <CardTitle className="text-base">{maintainableData.label}</CardTitle>
              <p className="text-sm text-gray-600">
                {maintainableData.metadata?.manufacturer} {maintainableData.metadata?.model}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={getStatusColor(maintainableData.condition ?? '')} size="sm">
              {maintainableData.condition?.replace('-', ' ')}
            </Badge>
            {maintainableData.metadata?.installDate &&
              new Date(maintainableData.metadata.installDate as string) > new Date() && (
                <Badge variant="info" size="sm">
                  Under Warranty
                </Badge>
              )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Age:</span>
            <p className="font-medium">{age} years</p>
          </div>
          <div>
            <span className="text-gray-600">Condition:</span>
            <div className="flex items-center gap-1">
              <Badge
                variant={
                  maintainableData.condition === 'good'
                    ? 'success'
                    : maintainableData.condition === 'fair'
                      ? 'info'
                      : maintainableData.condition === 'poor'
                        ? 'warning'
                        : 'error'
                }
                size="sm"
              >
                {maintainableData.condition}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-gray-600">Location:</span>
            <p className="font-medium">{maintainableData.location}</p>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <p className="font-medium capitalize">{maintainableData.type}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Lifespan Progress</span>
            <span className="text-sm text-gray-600">
              {lifecycleData.remainingLifespan} years remaining
            </span>
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
                width: `${Math.max(5, (lifecycleData.remainingLifespan / 10) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-sm">
            <span className="text-gray-600">Replacement Cost:</span>
            <p className="font-medium text-gray-900">
              {formatCurrency(lifecycleData.replacementCostEstimate.min)} -{' '}
              {formatCurrency(lifecycleData.replacementCostEstimate.max)}
            </p>
          </div>
          {isNearEndOfLife && (
            <Badge variant="warning" size="sm">
              Replace Soon
            </Badge>
          )}
        </div>

        {maintainableData.tags && (
          <div className="text-sm p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Notes:</span>
            <p className="text-gray-700 mt-1">{maintainableData.tags.join(', ')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MaintainablesGrid({
  maintainables,
  isLoading,
  error,
}: {
  maintainables: Maintainable[];
  isLoading: boolean;
  error: Error | null;
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Appliances & Systems</h2>
          <Badge variant="outline">Loading...</Badge>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !maintainables) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Appliances & Systems</h2>
          <Badge variant="outline">Error</Badge>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Systems</h3>
          <p className="text-gray-600">{error?.message}</p>
        </div>
      </div>
    );
  }

  if (maintainables.length === 0 || maintainables === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Appliances & Systems</h2>
          <Badge variant="outline">0 total</Badge>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Systems Found</h3>
          <p className="text-gray-600">Start by adding your first appliance or system.</p>
        </div>
      </div>
    );
  }

  // Group systems by category
  const appliancesByCategory = maintainables.reduce(
    (acc, maintainable) => {
      const maintainableData = maintainable.data;
      if (!acc[maintainableData.type]) {
        acc[maintainableData.type] = [];
      }
      acc[maintainableData.type].push(maintainable);
      return acc;
    },
    {} as Record<string, Maintainable[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Appliances & Systems</h2>
        <Badge variant="outline">{maintainables.length} total</Badge>
      </div>

      {Object.entries(appliancesByCategory).map(([category, maintainablesForCategory]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 capitalize border-b pb-2">
            {category.replace('-', ' ')} ({maintainablesForCategory.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maintainablesForCategory.map(maintainable => {
              const lifecycleData = mockLifecycleData.find(data => data.mId === maintainable.id);
              if (!lifecycleData) return null;

              return (
                <ApplianceCard
                  key={maintainable.id}
                  maintainable={maintainable}
                  lifecycleData={lifecycleData}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

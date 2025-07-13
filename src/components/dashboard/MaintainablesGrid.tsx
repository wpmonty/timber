'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateAge, getConditionColor } from '@/lib/utils';
import { mockMaintainables, mockLifecycleData } from '@/data/mock-property-data';
import { MaintainableData, MaintainableLifecycleData } from '@/types/maintainables.types';

interface ApplianceCardProps {
  appliance: MaintainableData;
  lifecycleData: MaintainableLifecycleData;
}

function ApplianceCard({ appliance, lifecycleData }: ApplianceCardProps) {
  const age = appliance.dateInstalled ? calculateAge(appliance.dateInstalled) : 0;
  const isNearEndOfLife = lifecycleData.remainingLifespan <= 3;
  const needsMaintenance =
    appliance.statuses.includes('needs-maintenance') || appliance.statuses.includes('needs-repair');

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
            <span className="text-xl">{getCategoryIcon(appliance.category)}</span>
            <div>
              <CardTitle className="text-base">{appliance.name}</CardTitle>
              <p className="text-sm text-gray-600">
                {appliance.brand} {appliance.model}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={getStatusColor(appliance.statuses[0]) as any} size="sm">
              {appliance.statuses[0].replace('-', ' ')}
            </Badge>
            {appliance.warrantyExpiration &&
              new Date(appliance.warrantyExpiration) > new Date() && (
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
                  appliance.condition === 'excellent'
                    ? 'success'
                    : appliance.condition === 'good'
                      ? 'info'
                      : appliance.condition === 'fair'
                        ? 'warning'
                        : 'error'
                }
                size="sm"
              >
                {appliance.condition}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-gray-600">Location:</span>
            <p className="font-medium">{appliance.location}</p>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <p className="font-medium capitalize">{appliance.category}</p>
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
                width: `${Math.max(5, (lifecycleData.remainingLifespan / appliance.expectedLifespan) * 100)}%`,
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

        {appliance.notes && (
          <div className="text-sm p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Notes:</span>
            <p className="text-gray-700 mt-1">{appliance.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MaintainablesGrid() {
  // Group appliances by category
  const appliancesByCategory = mockMaintainables.reduce(
    (acc, appliance) => {
      if (!acc[appliance.category]) {
        acc[appliance.category] = [];
      }
      acc[appliance.category].push(appliance);
      return acc;
    },
    {} as Record<string, MaintainableData[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Appliances & Systems</h2>
        <Badge variant="outline">{mockMaintainables.length} total</Badge>
      </div>

      {Object.entries(appliancesByCategory).map(([category, appliances]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 capitalize border-b pb-2">
            {category.replace('-', ' ')} ({appliances.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appliances.map(appliance => {
              const lifecycleData = mockLifecycleData.find(data => data.mId === appliance.id);
              if (!lifecycleData) return null;

              return (
                <ApplianceCard
                  key={appliance.id}
                  appliance={appliance}
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

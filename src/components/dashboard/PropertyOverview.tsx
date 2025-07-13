'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateAge } from '@/lib/utils';
import { mockPropertyData, mockPropertyStats } from '@/data/mock-property-data';

export function PropertyOverview() {
  const homeAge = calculateAge(new Date(mockPropertyData.yearBuilt, 0, 1));

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
                  <span className="font-medium">{mockPropertyData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium">{mockPropertyData.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Age:</span>
                  <Badge variant="info">{homeAge} years</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Footage:</span>
                  <span className="font-medium">
                    {mockPropertyData.squareFootage.toLocaleString()} sq ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{mockPropertyData.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{mockPropertyData.bathrooms}</span>
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
                  <span className="font-medium">{mockPropertyStats.totalMaintainables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Need Maintenance:</span>
                  <Badge variant="warning">
                    {mockPropertyStats.maintainablesNeedingMaintenance}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical Issues:</span>
                  <Badge variant="error">{mockPropertyStats.criticalIssues}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming Tasks:</span>
                  <Badge variant="info">{mockPropertyStats.upcomingMaintenance}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Age:</span>
                  <span className="font-medium">{mockPropertyStats.avgMaintainableAge} years</span>
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
                  <span className="text-gray-600">Recent Costs:</span>
                  <span className="font-medium">
                    {formatCurrency(mockPropertyStats.totalMaintenanceCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Year:</span>
                  <span className="font-medium">{formatCurrency(1100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <Badge variant="info">2 tasks</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overdue:</span>
                  <Badge variant="error">1 task</Badge>
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
                    {mockPropertyData.homeType.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stories:</span>
                  <span className="font-medium">{mockPropertyData.stories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Garages:</span>
                  <span className="font-medium">{mockPropertyData.garages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size:</span>
                  <span className="font-medium">{mockPropertyData.lotSize} acres</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

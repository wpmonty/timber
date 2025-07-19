'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMaintainables } from '@/hooks/api/maintainables';
import { Maintainable } from '@/types/maintainable.types';
import Link from 'next/link';

import { listMaintainableTypeNames } from '@/lib/maintainable-registry';

interface SystemCardProps {
  system: Maintainable;
}

function SystemCard({ system }: SystemCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getCategoryIcon(system.data.type ?? '')}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{system.data.label}</h3>
            <p className="text-sm text-gray-600 capitalize mb-2">{system.data.subtype}</p>
            {system.data.location && (
              <p className="text-xs text-gray-500">{system.data.location}</p>
            )}
            {system.data.condition && (
              <Badge variant="outline" size="sm" className="mt-2">
                {system.data.condition}
              </Badge>
            )}
          </div>
          <Link href={`/system/${system.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface SystemsPageProps {
  params: { id: string };
}

export default function SystemsPage({ params }: SystemsPageProps) {
  const { id } = params;
  const { data: systems, isLoading, error } = useMaintainables(id);
  const registeredTypes = listMaintainableTypeNames();

  if (isLoading) {
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Systems</h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const maintainables = systems || [];

  // Group systems by type
  const systemsByType = maintainables.reduce(
    (acc, system) => {
      const type = system.data.type || 'other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(system);
      return acc;
    },
    {} as Record<string, Maintainable[]>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Systems & Appliances</h1>
            <p className="mt-2 text-gray-600">
              All your home systems and appliances organized by type
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/property/${id}`}>
              <Button variant="outline">← Back to Property</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Systems grouped by type */}
      {Object.keys(systemsByType).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(systemsByType).map(([type, systems]) => (
            <div key={type}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {type.replace('-', ' ')}
                </h2>
                <Badge variant="outline">{systems.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systems.map(system => (
                  <SystemCard key={system.id} system={system} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Systems Found</h3>
          <p className="text-gray-600">Start by adding your first appliance or system.</p>
        </div>
      )}
    </div>
  );
}

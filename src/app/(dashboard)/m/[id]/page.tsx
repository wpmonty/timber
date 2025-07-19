'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMaintainable } from '@/hooks/api/maintainables';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface MaintainablePageProps {
  params: { id: string };
}

export default function MaintainablePage({ params }: MaintainablePageProps) {
  const { id } = params;
  const { data: maintainable, isLoading, error } = useMaintainable(id);

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading maintainable...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !maintainable) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">System Not Found</h2>
            <p className="text-gray-600">
              {error?.message || 'The requested maintainable could not be found.'}
            </p>
            <Link
              href={`/property/${maintainable?.property_id}/maintainables`}
              className="mt-4 inline-block"
            >
              <Button variant="outline">← Back to Maintainables</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/property/${maintainable.property_id}/maintainables`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Maintainables
            </Button>
          </Link>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-4xl">{getCategoryIcon(maintainable.data.type ?? '')}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{maintainable.data.label}</h1>
            <p className="text-lg text-gray-600 capitalize mt-1">{maintainable.data.subtype}</p>
            <p className="text-sm text-gray-500 mt-1">
              {maintainable.data.type?.replace('-', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Maintainable Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Maintainable Type</label>
              <p className="text-gray-900 capitalize">
                {maintainable.data.type?.replace('-', ' ')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Subtype</label>
              <p className="text-gray-900 capitalize">{maintainable.data.subtype}</p>
            </div>
            {maintainable.data.location && (
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{maintainable.data.location}</p>
              </div>
            )}
            {maintainable.data.condition && (
              <div>
                <label className="text-sm font-medium text-gray-500">Condition</label>
                <div className="mt-1">
                  <Badge variant="outline">{maintainable.data.condition}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Maintainable Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Maintainable ID</label>
              <p className="text-gray-900 font-mono text-sm">{maintainable.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">
                {new Date(maintainable.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">
                {new Date(maintainable.updated_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {maintainable.data.tags && maintainable.data.tags.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {maintainable.data.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

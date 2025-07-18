'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSystem } from '@/hooks/api/systems';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface SystemPageProps {
  params: { id: string };
}

export default function SystemPage({ params }: SystemPageProps) {
  const { id } = params;
  const { data: system, isLoading, error } = useSystem(id);

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
            <p className="mt-4 text-gray-600">Loading system...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">System Not Found</h2>
            <p className="text-gray-600">{error?.message || 'The requested system could not be found.'}</p>
            <Link href={`/property/${system?.property_id}/systems`} className="mt-4 inline-block">
              <Button variant="outline">← Back to Systems</Button>
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
          <Link href={`/property/${system.property_id}/systems`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Systems
            </Button>
          </Link>
        </div>
        
        <div className="flex items-start gap-4">
          <span className="text-4xl">{getCategoryIcon(system.data.type ?? '')}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{system.data.label}</h1>
            <p className="text-lg text-gray-600 capitalize mt-1">{system.data.subtype}</p>
            <p className="text-sm text-gray-500 mt-1">{system.data.type?.replace('-', ' ')}</p>
          </div>
        </div>
      </div>

      {/* System Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">System Type</label>
              <p className="text-gray-900 capitalize">{system.data.type?.replace('-', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Subtype</label>
              <p className="text-gray-900 capitalize">{system.data.subtype}</p>
            </div>
            {system.data.location && (
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{system.data.location}</p>
              </div>
            )}
            {system.data.condition && (
              <div>
                <label className="text-sm font-medium text-gray-500">Condition</label>
                <div className="mt-1">
                  <Badge variant="outline">{system.data.condition}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>System Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">System ID</label>
              <p className="text-gray-900 font-mono text-sm">{system.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">
                {new Date(system.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">
                {new Date(system.updated_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {system.data.tags && system.data.tags.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {system.data.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
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
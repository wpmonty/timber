'use client';

import { useProperties, useCreateProperty, useDeleteProperty } from '@/hooks/api/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { PropertyInsert } from '@/types/property.types';

// Default property data for the spoofed create button
const DEFAULT_PROPERTY: PropertyInsert = {
  address: '123 Sample Street, Sample City, ST 12345',
  data: {
    label: 'Sample Property',
    address: {
      line1: '123 Sample Street',
      city: 'Sample City',
      state: 'ST',
      zip: '12345',
    },
    property_type: 'SFH',
    sqft: 2000,
    year_built: 2005,
    stories: 2,
    areas: [
      { type: 'bedroom', quantity: 3 },
      { type: 'bathroom', quantity: 2 },
      { type: 'kitchen', quantity: 1 },
      { type: 'living_room', quantity: 1 },
    ],
    notes: 'Sample property created for demonstration',
  },
};

export default function PropertiesPage() {
  const { data: properties, isLoading, error } = useProperties();
  const createProperty = useCreateProperty();
  const deleteProperty = useDeleteProperty();

  const handleCreateProperty = async () => {
    try {
      await createProperty.mutateAsync(DEFAULT_PROPERTY);
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Properties</h1>
          <p className="text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            There was an error loading your properties. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Timber!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Let&apos;s get started by adding your first property.
          </p>

          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Your First Property</h2>
            <p className="text-gray-600 mb-6">
              Create a property to start tracking your home maintenance and appliances.
            </p>

            <Button
              onClick={handleCreateProperty}
              isLoading={createProperty.isPending}
              className="w-full"
            >
              Add Property
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <Button onClick={handleCreateProperty} isLoading={createProperty.isPending}>
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="truncate">
                {property.data?.label || 'Unnamed Property'}
              </CardTitle>
              <p className="text-sm text-gray-600 truncate">{property.address}</p>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                {property.data?.property_type && <p>Type: {property.data.property_type}</p>}
                {property.data?.sqft && <p>Size: {property.data.sqft.toLocaleString()} sq ft</p>}
                {property.data?.year_built && <p>Built: {property.data.year_built}</p>}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href={`/property/${property.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProperty(property.id)}
                isLoading={deleteProperty.isPending}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

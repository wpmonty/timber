'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Home,
  Car,
  Wrench,
  Shirt,
  Monitor,
  TreePine,
  Music,
  Settings,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import {
  listMaintainableTypeNames,
  getMaintainableSubtypeNames,
} from '@/lib/maintainable-registry';
import { MaintainableTypeType } from '@/types/maintainable.types';

interface TypeCardProps {
  type: MaintainableTypeType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
  onSelect: (type: MaintainableTypeType) => void;
}

function TypeCard({ type, title, description, icon: Icon, examples, onSelect }: TypeCardProps) {
  const subtypes = getMaintainableSubtypeNames(type);

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onSelect(type)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium">Examples:</p>
          <div className="flex flex-wrap gap-1">
            {examples.slice(0, 4).map((example, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
              >
                {example}
              </span>
            ))}
            {examples.length > 4 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
                +{examples.length - 4} more
              </span>
            )}
          </div>
          {subtypes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Available types:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {subtypes.slice(0, 3).map((subtype, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
                  >
                    {subtype}
                  </span>
                ))}
                {subtypes.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                    +{subtypes.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const typeConfigs: Record<
  MaintainableTypeType,
  {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    examples: string[];
  }
> = {
  appliance: {
    title: 'Appliances',
    description: 'Kitchen, laundry, and home appliances',
    icon: Home,
    examples: ['Refrigerator', 'Dishwasher', 'Washing Machine', 'Dryer', 'Microwave', 'Oven'],
  },
  structure: {
    title: 'Structures',
    description: 'Building components and structural elements',
    icon: Home,
    examples: ['Roof', 'Foundation', 'Walls', 'Windows', 'Doors', 'Deck'],
  },
  utility: {
    title: 'Utilities',
    description: 'Essential home systems and services',
    icon: Settings,
    examples: ['Electrical Panel', 'Plumbing', 'HVAC', 'Water Heater', 'Sump Pump'],
  },
  system: {
    title: 'Systems',
    description: 'Complex integrated systems',
    icon: Settings,
    examples: ['Security System', 'Smart Home', 'Irrigation', 'Solar Panels'],
  },
  vehicle: {
    title: 'Vehicles',
    description: 'Cars, trucks, motorcycles, and other vehicles',
    icon: Car,
    examples: ['Sedan', 'SUV', 'Truck', 'Motorcycle', 'RV', 'Boat'],
  },
  instrument: {
    title: 'Instruments & Tools',
    description: 'Musical instruments and professional tools',
    icon: Music,
    examples: ['Guitar', 'Piano', 'Drill', 'Saw', 'Microscope', 'Camera'],
  },
  landscape: {
    title: 'Landscape & Garden',
    description: 'Outdoor spaces and gardening equipment',
    icon: TreePine,
    examples: ['Lawn Mower', 'Garden Tools', 'Sprinkler System', 'Outdoor Furniture'],
  },
  other: {
    title: 'Other',
    description: 'Miscellaneous maintainable items',
    icon: Wrench,
    examples: ['Furniture', 'Electronics', 'Clothing', 'Sports Equipment'],
  },
};

export default function CreatePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<MaintainableTypeType | null>(null);

  const availableTypes = listMaintainableTypeNames();

  const handleTypeSelect = (type: MaintainableTypeType) => {
    setSelectedType(type);
    // For now, we'll navigate to a generic create form
    // Later this can be enhanced to show subtype selection
    router.push(`/create/${type}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Maintainable</h1>
              <p className="text-gray-600">What would you like to maintain?</p>
            </div>
          </div>
        </div>

        {/* Type Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableTypes.map(type => {
            const config = typeConfigs[type];
            if (!config) return null;

            return (
              <TypeCard
                key={type}
                type={type}
                title={config.title}
                description={config.description}
                icon={config.icon}
                examples={config.examples}
                onSelect={handleTypeSelect}
              />
            );
          })}
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600">
              Start with the closest category and we'll help you customize the details. You can
              always add custom fields and tags to make it fit your specific needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

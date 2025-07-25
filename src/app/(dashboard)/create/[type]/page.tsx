'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { getMaintainableSubtypeNames } from '@/lib/maintainable-registry';
import { MaintainableTypeType, MaintainableData } from '@/types/maintainable.types';
import { ProgressiveForm } from '@/components/forms/ProgressiveForm';
import { MaintainableForm } from '@/components/forms/MaintainableForm';

interface SubtypeCardProps {
  subtype: string;
  onSelect: (subtype: string) => void;
  isSelected: boolean;
}

function SubtypeCard({ subtype, onSelect, isSelected }: SubtypeCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md hover:bg-gray-50'
      }`}
      onClick={() => onSelect(subtype)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 capitalize">{subtype.replace(/-/g, ' ')}</h3>
            <p className="text-sm text-gray-600">
              {subtype === 'custom'
                ? 'Create a custom maintainable'
                : `Standard ${subtype} configuration`}
            </p>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const typeDisplayNames: Record<MaintainableTypeType, string> = {
  appliance: 'Appliance',
  structure: 'Structure',
  utility: 'Utility',
  system: 'System',
  vehicle: 'Vehicle',
  instrument: 'Instrument',
  landscape: 'Landscape',
  other: 'Other',
};

export default function CreateTypePage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as MaintainableTypeType;

  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [step, setStep] = useState<'subtype' | 'form'>('subtype');

  const subtypes = getMaintainableSubtypeNames(type);
  const displayName = typeDisplayNames[type] || type;
  const capitalizedSubtype = selectedSubtype
    ? selectedSubtype.replace(/-/g, ' ').charAt(0).toUpperCase() +
      selectedSubtype.replace(/-/g, ' ').slice(1)
    : '';

  useEffect(() => {
    // Validate that the type is valid
    if (!type || !typeDisplayNames[type]) {
      router.push('/create');
      return;
    }
  }, [type, router]);

  const handleSubtypeSelect = (subtype: string) => {
    setSelectedSubtype(subtype);
    // For now, we'll just show a placeholder for the form step
    // Later this will navigate to the actual form
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('subtype');
      setSelectedSubtype(null);
    } else {
      router.push('/create');
    }
  };

  const handleFormSubmit = async (data: MaintainableData) => {
    try {
      // TODO: Implement actual API call to create maintainable
      console.log('Creating maintainable:', data);
      // For now, just redirect back to the main page
      // router.push('/all');
    } catch (error) {
      console.error('Error creating maintainable:', error);
    }
  };

  const handleCancel = () => {
    setStep('subtype');
    setSelectedSubtype(null);
  };

  const shouldShowMaintainableForm = selectedSubtype === 'custom';

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Add {displayName} - {capitalizedSubtype}
                </h1>
                <p className="text-gray-600">Fill in the details for your new maintainable</p>
              </div>
            </div>
          </div>

          {/* Progressive Form or maintainable form */}
          {shouldShowMaintainableForm ? (
            <MaintainableForm
              type={type}
              subtype={selectedSubtype}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <ProgressiveForm
              type={type}
              subtype={selectedSubtype || 'custom'}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
              <h1 className="text-2xl font-bold text-gray-900">Create {displayName}</h1>
              <p className="text-gray-600">
                What specific type of {displayName.toLowerCase()} are you adding?
              </p>
            </div>
          </div>
        </div>

        {/* Subtype Selection */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subtypes.map(subtype => (
              <SubtypeCard
                key={subtype}
                subtype={subtype}
                onSelect={handleSubtypeSelect}
                isSelected={selectedSubtype === subtype}
              />
            ))}
          </div>

          {/* Custom Option */}
          {subtypes.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <SubtypeCard
                subtype="custom"
                onSelect={handleSubtypeSelect}
                isSelected={selectedSubtype === 'custom'}
              />
            </div>
          )}

          {/* Help Text */}
          <div className="text-center pt-8">
            <p className="text-gray-600">
              Don't see what you're looking for? Choose "Custom" to create a maintainable with your
              own specifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { PartialPropertyDataSchema } from '@/lib/schemas/property.schema';

// Step 1: Address validation schema
const addressSchema = z.object({
  address: z.string().min(1, 'Please enter your home address'),
});

// Step 2: Property type schema
const propertyTypeSchema = z.object({
  property_type: z.enum(['SFH', 'TH', 'CONDO', 'APARTMENT', 'OTHER'], {
    message: 'Please select a property type',
  }),
});

// Step 3: Basic details schema
const basicDetailsSchema = z.object({
  sqft: z.string().optional(),
  year_built: z.string().optional(),
});

// Step 4: Additional details schema
const additionalDetailsSchema = z.object({
  stories: z.string().optional(),
  lot_size_sqft: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;
type PropertyTypeFormData = z.infer<typeof propertyTypeSchema>;
type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>;
type AdditionalDetailsFormData = z.infer<typeof additionalDetailsSchema>;

type OnboardingStep = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const addressParam = searchParams.get('address');

  // Step 1: Address form
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: addressParam ? decodeURIComponent(addressParam) : '',
    },
  });

  // Step 2: Property type form
  const propertyTypeForm = useForm<PropertyTypeFormData>({
    resolver: zodResolver(propertyTypeSchema),
  });

  // Step 3: Basic details form
  const basicDetailsForm = useForm<BasicDetailsFormData>({
    resolver: zodResolver(basicDetailsSchema),
  });

  // Step 4: Additional details form
  const additionalDetailsForm = useForm<AdditionalDetailsFormData>({
    resolver: zodResolver(additionalDetailsSchema),
  });

  // Set the address value when the component mounts if address parameter exists
  useEffect(() => {
    if (addressParam) {
      addressForm.setValue('address', decodeURIComponent(addressParam));
    }
  }, [addressParam, addressForm]);

  // Function to create initial property
  const createProperty = async (address: string): Promise<string> => {
    // Parse the address string (basic parsing - could be improved with a proper address parsing library)
    const addressParts = address.split(',').map(part => part.trim());
    
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address, // Store the full address in the address field
        data: {
          address: {
            line1: addressParts[0] || address,
            city: addressParts[1] || '',
            state: addressParts[2] || '',
            zip: addressParts[3] || '',
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create property');
    }

    const property = await response.json();
    return property[0]?.id || property.id;
  };

  // Function to update property with partial data
  const updateProperty = async (partialData: any) => {
    if (!propertyId) return;

    // First, get the current property data
    const currentResponse = await fetch(`/api/property/${propertyId}`);
    if (!currentResponse.ok) {
      throw new Error('Failed to fetch current property');
    }
    const currentProperty = await currentResponse.json();
    
    // Merge the current data with the new partial data
    const mergedData = {
      ...currentProperty.data,
      ...partialData,
    };

    const response = await fetch(`/api/property/${propertyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: mergedData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update property');
    }

    return response.json();
  };

  // Step 1: Handle address submission
  const onAddressSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      const id = await createProperty(data.address);
      setPropertyId(id);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating property:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle property type submission
  const onPropertyTypeSubmit = async (data: PropertyTypeFormData) => {
    setIsLoading(true);
    try {
      const partial = PartialPropertyDataSchema.parse({ property_type: data.property_type });
      await updateProperty(partial);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error updating property type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Handle basic details submission
  const onBasicDetailsSubmit = async (data: BasicDetailsFormData) => {
    setIsLoading(true);
    try {
      const cleanData: any = {};
      if (data.sqft && data.sqft.trim() !== '') {
        const sqftNum = Number(data.sqft);
        if (!isNaN(sqftNum) && sqftNum > 0) {
          cleanData.sqft = sqftNum;
        }
      }
      if (data.year_built && data.year_built.trim() !== '') {
        const yearNum = Number(data.year_built);
        if (!isNaN(yearNum) && yearNum >= 800 && yearNum <= new Date().getFullYear()) {
          cleanData.year_built = yearNum;
        }
      }
      
      if (Object.keys(cleanData).length > 0) {
        const partial = PartialPropertyDataSchema.parse(cleanData);
        await updateProperty(partial);
      }
      setCurrentStep(4);
    } catch (error) {
      console.error('Error updating basic details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Handle additional details submission and finish
  const onAdditionalDetailsSubmit = async (data: AdditionalDetailsFormData) => {
    setIsLoading(true);
    try {
      const cleanData: any = {};
      if (data.stories && data.stories.trim() !== '') {
        const storiesNum = Number(data.stories);
        if (!isNaN(storiesNum) && storiesNum >= 1 && storiesNum <= 10) {
          cleanData.stories = storiesNum;
        }
      }
      if (data.lot_size_sqft && data.lot_size_sqft.trim() !== '') {
        const lotSizeNum = Number(data.lot_size_sqft);
        if (!isNaN(lotSizeNum) && lotSizeNum > 0) {
          cleanData.lot_size_sqft = lotSizeNum;
        }
      }
      
      if (Object.keys(cleanData).length > 0) {
        const partial = PartialPropertyDataSchema.parse(cleanData);
        await updateProperty(partial);
      }
      router.push('/properties');
    } catch (error) {
      console.error('Error updating additional details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Skip handlers
  const handleSkipStep = async () => {
    if (currentStep === 4) {
      router.push('/properties');
    } else {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    }
  };

  const handleSkipOnboarding = () => {
    router.push('/dashboard');
  };

  // Progress calculation
  const progress = (currentStep / 4) * 100;

  const stepTitles = {
    1: 'Confirm Your Address',
    2: 'Property Type',
    3: 'Basic Details',
    4: 'Additional Details',
  };

  const stepDescriptions = {
    1: 'Please enter your home address to get started.',
    2: 'What type of property is this?',
    3: 'Tell us about the size and age of your property.',
    4: 'A few more details to complete your property profile.',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Timber!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Let&apos;s set up your home so you can start tracking maintenance and managing your
            property.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {stepTitles[currentStep]}
            </h2>
            <p className="text-gray-600">{stepDescriptions[currentStep]}</p>
          </div>

          {/* Step 1: Address */}
          {currentStep === 1 && (
            <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Home Address *
                </label>
                <input
                  {...addressForm.register('address')}
                  type="text"
                  id="address"
                  placeholder="123 Main Street, City, State, ZIP"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {addressForm.formState.errors.address && (
                  <p className="mt-2 text-sm text-red-600">
                    {addressForm.formState.errors.address.message}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  This will be used to help identify local service providers and maintenance
                  schedules.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipOnboarding}
                  className="flex-1 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Save & Continue'}
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Property Type */}
          {currentStep === 2 && (
            <form onSubmit={propertyTypeForm.handleSubmit(onPropertyTypeSubmit)} className="space-y-6">
              <div>
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 mb-4">
                    Property Type *
                  </legend>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'SFH', label: 'Single Family Home', description: 'Detached house' },
                      { value: 'TH', label: 'Townhouse', description: 'Attached row house' },
                      { value: 'CONDO', label: 'Condominium', description: 'Unit in a building' },
                      { value: 'APARTMENT', label: 'Apartment', description: 'Rental unit' },
                      { value: 'OTHER', label: 'Other', description: 'Different property type' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="relative flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
                      >
                        <input
                          {...propertyTypeForm.register('property_type')}
                          type="radio"
                          value={option.value}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {propertyTypeForm.formState.errors.property_type && (
                    <p className="mt-2 text-sm text-red-600">
                      {propertyTypeForm.formState.errors.property_type.message}
                    </p>
                  )}
                </fieldset>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipStep}
                  className="flex-1 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save & Continue'}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Basic Details */}
          {currentStep === 3 && (
            <form onSubmit={basicDetailsForm.handleSubmit(onBasicDetailsSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="sqft" className="block text-sm font-medium text-gray-700 mb-2">
                    Square Footage
                  </label>
                  <input
                    {...basicDetailsForm.register('sqft')}
                    type="number"
                    id="sqft"
                    placeholder="2000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {basicDetailsForm.formState.errors.sqft && (
                    <p className="mt-2 text-sm text-red-600">
                      {basicDetailsForm.formState.errors.sqft.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="year_built" className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    {...basicDetailsForm.register('year_built')}
                    type="number"
                    id="year_built"
                    placeholder="1990"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {basicDetailsForm.formState.errors.year_built && (
                    <p className="mt-2 text-sm text-red-600">
                      {basicDetailsForm.formState.errors.year_built.message}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                These details help us provide more accurate maintenance recommendations and cost estimates.
              </p>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipStep}
                  className="flex-1 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save & Continue'}
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 4 && (
            <form onSubmit={additionalDetailsForm.handleSubmit(onAdditionalDetailsSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="stories" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Stories
                  </label>
                  <input
                    {...additionalDetailsForm.register('stories')}
                    type="number"
                    id="stories"
                    placeholder="2"
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {additionalDetailsForm.formState.errors.stories && (
                    <p className="mt-2 text-sm text-red-600">
                      {additionalDetailsForm.formState.errors.stories.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lot_size_sqft" className="block text-sm font-medium text-gray-700 mb-2">
                    Lot Size (sq ft)
                  </label>
                  <input
                    {...additionalDetailsForm.register('lot_size_sqft')}
                    type="number"
                    id="lot_size_sqft"
                    placeholder="8000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {additionalDetailsForm.formState.errors.lot_size_sqft && (
                    <p className="mt-2 text-sm text-red-600">
                      {additionalDetailsForm.formState.errors.lot_size_sqft.message}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Almost done! These final details help us understand your property&apos;s maintenance needs.
              </p>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipStep}
                  className="flex-1 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Finishing...' : 'Save & Finish'}
                </Button>
              </div>
            </form>
          )}

          {/* Progress indicator */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Step {currentStep} of 4 • This will only take a few minutes
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

// Address validation schema
const addressSchema = z.object({
  address: z.string().min(1, 'Please enter your home address'),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const addressParam = searchParams.get('address');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: addressParam ? decodeURIComponent(addressParam) : '',
    },
  });

  // Set the address value when the component mounts if address parameter exists
  useEffect(() => {
    if (addressParam) {
      setValue('address', decodeURIComponent(addressParam));
    }
  }, [addressParam, setValue]);

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);

    // TODO: Save address to user profile/property in database
    console.log('Saving address:', data.address);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);

    // For now, just show an alert - this would normally proceed to the next step
    alert('Address saved! This would normally continue to property details setup.');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Timber!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Let's set up your home so you can start tracking maintenance and managing your property.
          </p>
        </div>

        {/* Onboarding Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Address</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">Property Details</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        {/* Address Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Confirm Your Home Address</h2>
            <p className="text-gray-600">
              {addressParam
                ? "We've pre-filled your address. Please confirm or update it below."
                : 'Please enter your home address to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Home Address *
              </label>
              <input
                {...register('address')}
                type="text"
                id="address"
                placeholder="123 Main Street, City, State, ZIP"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
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
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Skip for Now
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>

          {/* Progress indicator */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Step 1 of 3 • This will only take a few minutes</p>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

// Address validation schema
const addressSchema = z.object({
  address: z.string().min(1, 'Please enter your home address'),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(data.address);
    
    // Redirect to signup with address parameter
    router.push(`/signup?address=${encodedAddress}`);
    
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Timber
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-8">
            Your Home Manager
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your home's maintenance, manage appliances, and never miss an important repair again.
          </p>
        </div>

        {/* Address Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Get started with your home
              </h3>
              <p className="text-gray-600">
                Enter your home address to begin managing your property
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label 
                  htmlFor="address" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Home Address
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
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 px-6 text-lg rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Get Started'}
              </Button>
            </form>
          </div>

          {/* Features Preview */}
          <div className="mt-16 text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-8">
              Manage everything about your home
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <h5 className="font-medium text-gray-900 mb-2">Track Appliances</h5>
                <p className="text-sm text-gray-600">Monitor all your home appliances and their maintenance needs</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h5 className="font-medium text-gray-900 mb-2">Schedule Maintenance</h5>
                <p className="text-sm text-gray-600">Get reminders for regular maintenance and repairs</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h5 className="font-medium text-gray-900 mb-2">Cost Planning</h5>
                <p className="text-sm text-gray-600">Budget for upcoming expenses and track costs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

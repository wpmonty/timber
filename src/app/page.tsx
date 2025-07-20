'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

    if (data.address.length < 1) {
      setIsLoading(false);
      return;
    }

    // Encode the address for URL
    const encodedAddress = encodeURIComponent(data.address);

    // Redirect to signup with address parameter
    router.push(`/signup?address=${encodedAddress}`);

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Maintainable</h1>
        <div className="flex gap-4 text-blue-500 font-semibold">
          <Link href="/signup">Signup</Link>
          <Link href="/login">Login</Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Maintainable</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-8">
            Your Personal Inventory Manager
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your home&apos;s maintenance, manage appliances, and never miss an important
            repair again. Track any maintainable item you can think of.
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
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
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
        </div>
      </div>
    </main>
  );
}

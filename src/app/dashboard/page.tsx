'use client';

import { useUser } from '@/hooks/useUser';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You must be logged in to access this page.</p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome to Timber!</h2>
              <p className="text-blue-700">
                Authentication has been successfully implemented. You are now logged in as:
              </p>
              <div className="mt-3 space-y-1">
                <p className="text-sm">
                  <strong>Name:</strong> {user?.name || 'Not provided'}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-sm">
                  <strong>User ID:</strong> {user?.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-900 mb-2">Property Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage your properties and home systems
                </p>
                <Link
                  href="/property"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View Properties →
                </Link>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-900 mb-2">Maintenance Tracking</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Keep track of maintenance schedules and logs
                </p>
                <Link
                  href="/maintenance"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View Maintenance →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

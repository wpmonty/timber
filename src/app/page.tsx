import { FormExample } from '@/components/examples/form-example';
import { QueryExample } from '@/components/examples/query-example';
import Link from 'next/link';

export default async function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Timber - House Manager</h1>
          <p className="text-xl text-gray-600 mb-8">
            Framework Setup Complete: Next.js + TypeScript + Tailwind + React Hook Form + React
            Query
          </p>

          {/* Auth Links */}
          <div className="mb-8 space-y-4">
            <div className="flex justify-center space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Sign in to access your home management dashboard
            </p>
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">TypeScript</h3>
            <p className="text-gray-600 text-sm">Type-safe development with strict configuration</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
            <p className="text-gray-600 text-sm">Utility-first styling with responsive design</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">React Hook Form</h3>
            <p className="text-gray-600 text-sm">Form management with Zod validation</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">React Query</h3>
            <p className="text-gray-600 text-sm">Server state management and caching</p>
          </div>
        </div>

        {/* Framework Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <FormExample />
          </div>

          <div>
            <QueryExample />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Framework setup complete. Ready to build the house manager features!</p>
        </div>
      </div>
    </main>
  );
}

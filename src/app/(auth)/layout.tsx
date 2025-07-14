import { redirectIfAuthenticated } from '@/lib/auth';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Redirect if already authenticated
  await redirectIfAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Timber</h1>
          <p className="text-gray-600 mt-2">House Manager</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">{children}</div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Manage your home maintenance with confidence</p>
        </div>
      </div>
    </div>
  );
}

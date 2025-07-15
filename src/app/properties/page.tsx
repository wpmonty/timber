import { createSupabaseServerClient } from '@/lib/supabase.server';

export default async function PropertiesPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('properties').select('*');

  if (error) {
    console.error('Error fetching properties:', error);
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

          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
}

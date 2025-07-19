'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MaintainablesLanding() {
  const examples = [
    'house plants',
    'motorcycles',
    'vintage cars',
    'aquariums',
    '3D printers',
    'collectible sneakers',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [examples.length]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-sky-50 to-white px-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">Maintainables</h1>
        <p className="text-2xl md:text-3xl text-gray-700 mb-4">
          Manage any maintainable item with the help of AI.
        </p>
        <p className="text-lg md:text-xl text-gray-600">
          Keep your{' '}
          <span className="font-semibold text-blue-600 transition-colors" key={currentIndex}>
            {examples[currentIndex]}
          </span>{' '}
          in top shape — and everything else, too.
        </p>
      </section>

      {/* Advanced Search Box */}
      <section className="w-full max-w-3xl mt-12">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-lg p-6"
        >
          <input
            type="text"
            placeholder="Item (e.g., lawn mower)"
            className="col-span-1 md:col-span-1 w-full h-12 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location (e.g., garage)"
            className="col-span-1 md:col-span-1 w-full h-12 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            className="col-span-1 md:col-span-1 w-full h-12 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="Priority"
          >
            <option disabled>Priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <Button type="submit" className="col-span-1 w-full h-12" variant="primary">
            Search
          </Button>
        </form>
      </section>
    </main>
  );
}
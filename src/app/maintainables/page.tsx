'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MaintainablesLanding() {
  const examples = [
    'house plants',
    'motorcycle',
    'vintage car',
    'aquarium',
    '3D printer',
    'collectible sneakers',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKind, setSelectedKind] = useState<string | null>(null);
  const [showKindSelect, setShowKindSelect] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const kindOptions = ['Appliance', 'Vehicle', 'Tool', 'Electronics', 'Furniture', 'Outdoor'];

  // Faux autocomplete suggestions
  const autocompleteOptions = [
    'lawn mower',
    'refrigerator',
    'washing machine',
    'dishwasher',
    'microwave',
    'coffee maker',
    'blender',
    'toaster',
    'air conditioner',
    'heater',
    'vacuum cleaner',
    'garden tools',
    'bicycle',
    'car',
    'motorcycle',
    'boat',
    'generator',
    'power tools',
    'hand tools',
    'electronics',
    'computer',
    'television',
    'speakers',
    'furniture',
    'couch',
    'bed',
    'table',
    'chair',
    'outdoor furniture',
    'grill',
    'patio furniture',
    'pool equipment',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [examples.length]);

  const handleKindSelect = (kind: string) => {
    setSelectedKind(kind);
    setShowKindSelect(false);
  };

  const handleDismissKind = () => {
    setSelectedKind(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    //setInputValue(suggestion);
  };

  // Filter and prepare autocomplete suggestions
  const getFilteredSuggestions = () => {
    if (!inputValue.trim()) return [];

    const filtered = autocompleteOptions
      .filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 8); // Limit to 8 suggestions

    return filtered;
  };

  const suggestions = getFilteredSuggestions();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-sky-50 to-blue-100 px-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
          <span className="text-blue-700">Maintain</span>
          <span className="text-gray-900">ables</span>
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 mb-4">
          Manage any maintainable item with the help of AI.
        </p>
        <p className="text-lg md:text-xl text-gray-600">
          Keep your{' '}
          <span className="font-semibold text-purple-600 transition-colors" key={currentIndex}>
            {examples[currentIndex]}
          </span>{' '}
          in top shape — and everything else, too.
        </p>
      </section>

      {/* Advanced Search Box */}
      <section className="w-full max-w-xl mt-12">
        <form
          onSubmit={e => e.preventDefault()}
          className="relative bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-lg p-6"
        >
          {/* Kind Filter Badge */}
          <div className="absolute top-4 left-6 z-20">
            {!selectedKind ? (
              <button
                type="button"
                onClick={() => setShowKindSelect(!showKindSelect)}
                className="text-base px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
              >
                kind
              </button>
            ) : (
              <div className="flex items-center gap-1 text-base px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                <span>kind: {selectedKind}</span>
                <button
                  type="button"
                  onClick={handleDismissKind}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            )}

            {/* Kind Select Dropdown */}
            {showKindSelect && (
              <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-32">
                {kindOptions.map(kind => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => handleKindSelect(kind)}
                    className="block w-full text-left px-3 py-2 text-base hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                  >
                    {kind}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Input and Search */}
          <div className="flex gap-4 pt-8">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search for any maintainable item..."
              className="flex-1 h-12 text-xl px-2 border-none outline-none"
            />
          </div>
        </form>

        {/* Autocomplete Tray - Positioned absolutely underneath */}
        {inputValue.trim() && suggestions.length > 0 && (
          <div className="absolute w-full max-w-xl mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-base text-gray-700 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                {selectedKind && (
                  <small className="text-gray-500 bg-slate-100 rounded-md p-1 mr-2">
                    {selectedKind?.toUpperCase()}
                  </small>
                )}
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

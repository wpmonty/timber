'use client';

import { Card, CardContent } from '@/components/ui/card';

interface CardSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface CardSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CardSelectOption[];
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export function CardSelect({
  value,
  onChange,
  options,
  placeholder,
  error = false,
  className = '',
}: CardSelectProps) {
  const handleCardClick = (optionValue: string) => {
    onChange(optionValue);
  };

  if (!options || options.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No options available</p>
      </div>
    );
  }

  // Determine grid layout based on number of options
  const gridCols = options.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';

  return (
    <div className={`space-y-4 ${className}`}>
      {placeholder && <p className="text-sm text-gray-600 mb-2">{placeholder}</p>}

      <div className={`grid ${gridCols} gap-3`}>
        {options.map(option => {
          const isSelected = value === option.value;

          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-gray-200'
              } ${error ? 'ring-2 ring-red-500' : ''}`}
              onClick={() => handleCardClick(option.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {option.label}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600 mt-2">Please select an option</p>}
    </div>
  );
}

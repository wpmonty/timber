import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  description?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  className,
  htmlFor,
  description,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

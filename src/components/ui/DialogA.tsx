import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

export interface DialogHeaderProps {
  className?: string;
  children: ReactNode;
}

export interface DialogTitleProps {
  className?: string;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      {/* Dialog Content */}
      <div className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">{children}</div>
    </div>
  );
}

export function DialogContent({ className, children }: DialogContentProps) {
  return (
    <div className={cn('relative bg-white rounded-lg shadow-lg p-6 mx-4', className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>;
}

export function DialogTitle({ className, children }: DialogTitleProps) {
  return <h2 className={cn('text-lg font-semibold text-gray-900', className)}>{children}</h2>;
}

export function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}

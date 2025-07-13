import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { LeftNavigation } from '@/components/layout/LeftNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Timber - House Manager',
  description:
    'A comprehensive house manager web app for tracking major appliances and home maintenance items.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex min-h-screen bg-gray-50">
            <LeftNavigation />
            <main className="flex-1 overflow-auto ml-32">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

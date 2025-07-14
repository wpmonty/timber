import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AppLayoutContent } from '@/components/layout/AppLayoutContent';

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
          <AuthProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AppLayoutContent } from '@/components/layout/AppLayoutContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maintainable - Personal Inventory Manager',
  description:
    'A comprehensive personal inventory manager web app for tracking any maintainable items.',
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

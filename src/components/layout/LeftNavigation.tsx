'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, AlertTriangle, Bell, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const getNavigationItems = (slug: string): NavigationItem[] => [
  {
    title: 'Dashboard',
    href: `/property/${slug}`,
    icon: Home,
  },
  {
    title: 'Systems & Appliances',
    href: `/property/${slug}/systems`,
    icon: Settings,
  },
  {
    title: 'Maintenance Logs',
    href: `/property/${slug}/logs`,
    icon: List,
    badge: '4',
  },
  {
    title: 'Alerts',
    href: `/property/${slug}/alerts`,
    icon: AlertTriangle,
    badge: '2',
  },
];

export function LeftNavigation({ slug }: { slug: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === `/property/${slug}`) {
      return pathname === `/property/${slug}`;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col w-72 bg-white border-r border-gray-200 min-h-screen fixed">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Timber</h1>
            <p className="text-xs text-gray-600">House Manager</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {getNavigationItems(slug).map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? 'primary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 text-left font-normal',
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </div>
      </div>
    </div>
  );
}

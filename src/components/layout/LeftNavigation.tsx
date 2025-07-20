'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Settings, AlertTriangle, Bell, List, LogOut, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property.types';
import { useProperties } from '@/hooks/api/properties';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useEffect, useState } from 'react';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const getGlobalNavigationItems = (): NavigationItem[] => [
  {
    title: 'Properties',
    href: '/properties',
    icon: Home,
  },
];

const getPropertyNavigationItems = (propertyId: string): NavigationItem[] => [
  {
    title: 'Dashboard',
    href: `/property/${propertyId}`,
    icon: Home,
  },
  {
    title: 'Systems & Appliances',
    href: `/property/${propertyId}/maintainables`,
    icon: Settings,
  },
  {
    title: 'Maintenance Logs',
    href: `/property/${propertyId}/logs`,
    icon: List,
    badge: '4',
  },
  {
    title: 'Alerts',
    href: `/property/${propertyId}/alerts`,
    icon: AlertTriangle,
    badge: '2',
  },
];

export function LeftNavigation() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const {
    data: properties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperties();
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const { context, currentPropertyId, pathname } = useNavigation();

  const router = useRouter();

  useEffect(() => {
    if (properties && properties.length > 0) {
      if (context === 'property' && currentPropertyId) {
        // Find the current property based on the URL
        const property = properties.find(p => p.id === currentPropertyId);
        setCurrentProperty(property || properties[0]);
      } else {
        setCurrentProperty(properties[0]);
      }
    }
  }, [properties, context, currentPropertyId]);

  if (propertiesError) {
    return <div>Error: {propertiesError.message}</div>;
  }

  const isActive = (href: string) => {
    if (context === 'property' && currentProperty) {
      if (href === `/property/${currentProperty.id}`) {
        return pathname === `/property/${currentProperty.id}`;
      }
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreate = () => {
    // Stub for now - will be implemented later
    console.log('Create button clicked');
  };

  const navigationItems =
    context === 'property' && currentProperty
      ? getPropertyNavigationItems(currentProperty.id)
      : getGlobalNavigationItems();

  return (
    <div className="flex flex-col w-72 bg-white border-r border-gray-200 min-h-screen fixed">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/properties" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Maintainable</h1>
            <p className="text-xs text-gray-600">Personal Inventory Manager</p>
          </div>
        </Link>
      </div>

      {/* Global Create Button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={handleCreate}
          className="w-full flex items-center gap-2"
          variant="secondary"
        >
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </div>

      {/* Navigation Items */}
      {!propertiesLoading ? (
        <nav className="flex-1 p-4">
          {/* Property Selector - only show when on property pages */}
          {context === 'property' && currentProperty && properties && properties.length > 1 && (
            <select
              className="w-full mb-4 bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-2 px-3"
              value={currentProperty.id}
              onChange={e => {
                const propertyId = e.target.value;
                router.push(`/property/${propertyId}`);
              }}
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.address}
                </option>
              ))}
            </select>
          )}

          <div className="space-y-2">
            {navigationItems.map(item => {
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
      ) : (
        <div className="flex-1 p-4"></div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </div>

        {/* Logout */}
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 text-left font-normal text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

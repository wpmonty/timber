'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Settings,
  AlertTriangle,
  Bell,
  List,
  LogOut,
  User,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Property } from '@/types/property.types';
import { useProperties } from '@/hooks/api/properties';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useEffect, useState, useRef } from 'react';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const getGlobalNavigationItems = (): NavigationItem[] => [
  {
    title: 'Home',
    href: '/all',
    icon: Home,
  },
  {
    title: 'Properties',
    href: '/properties',
    icon: Home,
  },
  {
    title: 'Vehicles',
    href: '/inventory',
    icon: Settings,
  },
  {
    title: 'Tools',
    href: '/inventory',
    icon: Settings,
  },
  {
    title: 'Clothing',
    href: '/inventory',
    icon: Settings,
  },
  {
    title: 'Electronics',
    href: '/settings',
    icon: Settings,
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

export function TopNavigation() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const {
    data: properties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperties();
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { context, currentPropertyId, pathname } = useNavigation();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="bg-white border-b border-gray-200">
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link href="/properties" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Maintainable</h1>
              <p className="text-xs text-gray-600">Personal Inventory Manager</p>
            </div>
          </Link>

          {/* Global Navigation */}
          <nav className="flex items-center gap-1">
            {getGlobalNavigationItems().map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? 'primary' : 'ghost'}
                    className={cn('flex items-center gap-2')}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="md" className="relative">
            <Bell className="w-5 h-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <Button
              variant="outline"
              size="md"
              className="flex items-center gap-2 px-2"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:block font-medium text-gray-900">{user?.email}</span>
              <ChevronDown
                className={cn('w-4 h-4 transition-transform', isUserDropdownOpen && 'rotate-180')}
              />
            </Button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Subnavigation */}
      {context === 'property' && currentProperty && !propertiesLoading && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Property Navigation */}
              <nav className="flex items-center gap-1">
                {getPropertyNavigationItems(currentProperty.id).map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={active ? 'primary' : 'ghost'}
                        size="sm"
                        className={cn(
                          'flex items-center gap-2',
                          active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.title}
                        {item.badge && (
                          <span
                            className={cn(
                              'px-2 py-0.5 text-xs rounded-full',
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
              </nav>

              {/* Property Address/Selector - aligned to the right */}
              <div className="flex items-center gap-2">
                {properties && properties.length > 1 ? (
                  <select
                    className="bg-white text-gray-700 border border-gray-300 rounded-md py-1 px-3 text-sm"
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
                ) : (
                  <span className="text-sm text-gray-600">{currentProperty.address}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

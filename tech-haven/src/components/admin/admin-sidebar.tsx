'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  Settings,
  Users,
  ShoppingCart,
  PercentSquare,
  PackageOpen
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Tags,
  },
  {
    title: 'PC Builds',
    href: '/admin/pc-builds',
    icon: Layers,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Promotions',
    href: '/admin/promotions',
    icon: PercentSquare,
  },
  {
    title: 'Bundles',
    href: '/admin/bundles',
    icon: PackageOpen,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-background lg:block w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">
            Admin Portal
          </h2>
        </div>
        <div className="flex-1">
          <nav className="grid gap-1 px-2 group">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
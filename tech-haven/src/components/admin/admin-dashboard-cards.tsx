'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Tags, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboardCards() {
  // In a real implementation, these would be loaded from Supabase
  const metrics = [
    {
      title: 'Total Products',
      value: '0',
      icon: Package,
      description: 'Products in inventory',
    },
    {
      title: 'Categories',
      value: '0',
      icon: Tags,
      description: 'Product categories',
    },
    {
      title: 'Orders',
      value: '0',
      icon: ShoppingCart,
      description: 'Total orders placed',
    },
    {
      title: 'Customers',
      value: '0',
      icon: Users,
      description: 'Registered users',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
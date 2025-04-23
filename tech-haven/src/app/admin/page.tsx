import AdminDashboardCards from '@/components/admin/admin-dashboard-cards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Tech Haven admin dashboard.
        </p>
      </div>
      
      <AdminDashboardCards />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Recent products will be loaded here */}
            <p className="text-sm text-muted-foreground">
              Loading recent products...
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Product statistics will appear here */}
            <p className="text-sm text-muted-foreground">
              Loading product statistics...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
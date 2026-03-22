import { AdminStatsGrid } from './AdminStatsGrid'
import { AdminRevenueChart } from './AdminRevenueChart'
import { AdminRecentActivity } from './AdminRecentActivity'
import { AdminTopMerchants } from './AdminTopMerchants'
import { AdminSystemHealth } from './AdminSystemHealth'

export function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage your Nexus PAY platform performance.
        </p>
      </div>

      {/* Stats Grid */}
      <AdminStatsGrid />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminRevenueChart />
        </div>
        <AdminSystemHealth />
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentActivity />
        <AdminTopMerchants />
      </div>
    </div>
  )
}
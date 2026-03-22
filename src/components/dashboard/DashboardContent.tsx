import { StatsGrid } from './StatsGrid'
import { RevenueChart } from './RevenueChart'
import { RecentTransactions } from './RecentTransactions'
import { TopMerchants } from './TopMerchants'

export function DashboardContent() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back, Admin
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your Nexus PAY platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopMerchants />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  )
}
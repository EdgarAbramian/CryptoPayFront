import { MerchantStatsGrid } from './MerchantStatsGrid'
import { MerchantRevenueChart } from './MerchantRevenueChart'
import { MerchantRecentTransactions } from './MerchantRecentTransactions'
import { MerchantQuickActions } from './MerchantQuickActions'

export function MerchantDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back, Merchant!
        </h1>
        <p className="text-muted-foreground">
          Here's your Nexus PAY account overview and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <MerchantStatsGrid />

      {/* Quick Actions */}
      <MerchantQuickActions />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 gap-6">
        <MerchantRevenueChart />
      </div>

      {/* Recent Transactions */}
      <MerchantRecentTransactions />
    </div>
  )
}
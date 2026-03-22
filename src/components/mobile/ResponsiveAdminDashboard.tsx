import { AdminStatsGrid } from '../admin/AdminStatsGrid'
import { AdminRevenueChart } from '../admin/AdminRevenueChart'
import { AdminRecentActivity } from '../admin/AdminRecentActivity'
import { AdminTopMerchants } from '../admin/AdminTopMerchants'
import { AdminSystemHealth } from '../admin/AdminSystemHealth'
import { MobileAdminStatsGrid } from './MobileStatsGrid'
import { MobileRevenueChart, MobileSystemHealth, MobileRecentActivity } from './MobileCharts'
import { useMobile } from '@/hooks/useMobile'

export function ResponsiveAdminDashboard() {
  const { isMobile } = useMobile()

  if (isMobile) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Mobile Stats Grid */}
        <MobileAdminStatsGrid />

        {/* Mobile Charts Row 1 */}
        <div className="grid grid-cols-1 gap-4">
          <MobileRevenueChart />
        </div>

        {/* Mobile Charts Row 2 */}
        <div className="grid grid-cols-1 gap-4">
          <MobileSystemHealth />
        </div>

        {/* Mobile Activity */}
        <div className="grid grid-cols-1 gap-4">
          <MobileRecentActivity />
        </div>

        {/* Mobile Top Merchants - компактная версия */}
        <div className="glass-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold gradient-text mb-4">Top Merchants</h3>
          <div className="space-y-3">
            {[
              { name: 'TechCorp Solutions', revenue: '$45,231', growth: '+23%' },
              { name: 'Digital Dynamics', revenue: '$38,492', growth: '+18%' },
              { name: 'Innovation Labs', revenue: '$32,847', growth: '+15%' },
            ].map((merchant, index) => (
              <div key={merchant.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{merchant.name}</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold gradient-text">{merchant.revenue}</p>
                  <p className="text-xs text-green-400">{merchant.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Desktop версия - оригинальная
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
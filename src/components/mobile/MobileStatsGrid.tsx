import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, Shield, Server, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useMerchantDashboard } from '@/hooks/useMerchantDashboard'

interface StatItem {
  title: string
  value: number
  currency?: boolean
  suffix?: string
  change: number
  icon: React.ComponentType<any>
  gradient: string
}

interface MobileStatsGridProps {
  stats: StatItem[]
  layout?: 'admin' | 'merchant'
}

export function MobileStatsGrid({ stats, layout = 'admin' }: MobileStatsGridProps) {
  // Мобильная версия с оптимизированным layout
  return (
    <div className="space-y-4">
      {/* Главная статистика - крупные карточки */}
      <div className="grid grid-cols-2 gap-3">
        {stats.slice(0, 2).map((stat, index) => {
          const isPositive = stat.change > 0
          const IconComponent = stat.icon

          return (
            <Card key={stat.title} className="hover-glow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${stat.gradient} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    {stat.change !== 0 && (
                      <div className="flex items-center space-x-1">
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.abs(stat.change)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xl font-bold gradient-text">
                      {stat.currency
                        ? formatCurrency(stat.value)
                        : formatNumber(stat.value) + (stat.suffix || '')
                      }
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Вторичная статистика - компактные карточки */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.slice(2).map((stat, index) => {
          const isPositive = stat.change > 0
          const IconComponent = stat.icon

          return (
            <Card key={stat.title} className="hover-glow">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className={`w-8 h-8 rounded-lg ${stat.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-bold gradient-text">
                      {stat.currency
                        ? formatCurrency(stat.value)
                        : formatNumber(stat.value) + (stat.suffix || '')
                      }
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {stat.title}
                    </p>
                    {stat.change !== 0 && (
                      <div className="flex items-center space-x-1">
                        {isPositive ? (
                          <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 text-red-500" />
                        )}
                        <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.abs(stat.change)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Специализированные версии для Admin и Merchant
export function MobileAdminStatsGrid() {
  const stats = [
    {
      title: 'Total Platform Revenue',
      value: 12847293,
      currency: true,
      change: 15.3,
      icon: DollarSign,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Active Merchants',
      value: 847,
      change: 12.1,
      icon: Users,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Total Transactions',
      value: 234567,
      change: 8.7,
      icon: CreditCard,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Success Rate',
      value: 98.9,
      suffix: '%',
      change: 0.3,
      icon: Shield,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Pending Approvals',
      value: 23,
      change: -15.2,
      icon: AlertTriangle,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Active Nodes',
      value: 12,
      change: 0,
      icon: Server,
      gradient: 'gateway-dark-gradient',
    },
  ]

  return <MobileStatsGrid stats={stats} layout="admin" />
}

export function MobileMerchantStatsGrid() {
  // Use real API data via shared hook instead of hardcoded fake values
  const { stats: merchantStats, revenue, isLoading } = useMerchantDashboard()

  const stats = [
    {
      title: 'Available Balance',
      value: merchantStats?.balance_available_usd || 0,
      currency: true,
      change: 0,
      icon: DollarSign,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: "Today's Revenue",
      value: revenue?.total_revenue_usd || 0,
      currency: true,
      change: revenue?.change_percentage || 0,
      icon: TrendingUp,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Total Transactions',
      value: merchantStats?.total_transactions || 0,
      change: 0,
      icon: CreditCard,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Success Rate',
      value: merchantStats?.success_rate || 0,
      suffix: '%',
      change: 0,
      icon: Shield,
      gradient: 'gateway-dark-gradient',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return <MobileStatsGrid stats={stats} layout="merchant" />
}
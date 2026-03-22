import { TrendingUp, TrendingDown, DollarSign, Activity, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface Metric {
  title: string
  value: number
  change: number
  icon: any
  gradient: string
  currency?: boolean
  suffix?: string
}

export function AnalyticsOverview() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      title: 'Total Volume',
      value: 0,
      currency: true,
      change: 0,
      icon: DollarSign,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Avg Transaction Value',
      value: 0,
      currency: true,
      change: 0,
      icon: Activity,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: 'Success Rate',
      value: 0,
      suffix: '%',
      change: 0,
      icon: TrendingUp,
      gradient: 'gateway-dark-gradient',
    },
    {
      title: user?.role === 'merchant' ? 'Total Transactions' : 'Active Merchants',
      value: 0,
      change: 0,
      icon: user?.role === 'merchant' ? Activity : Users,
      gradient: 'gateway-dark-gradient',
    },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'merchant') {
          const stats = await api.getMerchantReportSummary()
          
          setMetrics(prev => [
            { ...prev[0], value: stats.total_volume_usd, change: 0, currency: true, suffix: undefined },
            { ...prev[1], value: stats.average_order_value, change: 0, currency: true, suffix: undefined },
            { ...prev[2], title: 'Success Rate', value: 100 - stats.abandonment_rate, change: 0, suffix: '%', currency: false },
            { ...prev[3], title: 'Successful Transactions', value: stats.successful_transactions, change: 0, icon: Activity, currency: false, suffix: undefined },
          ])
          return
        }

        const stats = await api.getStats()
        try {
          const detailed = await api.getAnalyticsOverview()
          setMetrics([
            { ...metrics[0], value: detailed.total_volume.current, change: detailed.total_volume.change_pcent, currency: true, suffix: undefined },
            { ...metrics[1], value: detailed.avg_transaction_value.current, change: detailed.avg_transaction_value.change_pcent, currency: true, suffix: undefined },
            { ...metrics[2], value: detailed.conversion_rate.current, change: detailed.conversion_rate.change_pcent, suffix: '%', currency: false },
            { ...metrics[3], value: detailed.active_merchants.current, change: detailed.active_merchants.change_pcent, currency: false, suffix: undefined },
          ])
        } catch (e) {
          const avgValue = stats.total_transactions > 0 
            ? parseFloat(stats.transaction_volume) / stats.total_transactions 
            : 0

          setMetrics([
            { ...metrics[0], value: parseFloat(stats.transaction_volume), change: 0 },
            { ...metrics[1], value: avgValue, change: 0 },
            { ...metrics[2], value: stats.success_rate, change: 0 },
            { ...metrics[3], value: stats.active_merchants, change: 0 },
          ])
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
      }
    }

    fetchData()
  }, [user])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const isPositive = metric.change >= 0
        const IconComponent = metric.icon
        
        return (
          <Card key={metric.title} className="hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold gradient-text">
                      {metric.currency 
                        ? formatCurrency(metric.value)
                        : formatNumber(metric.value) + (metric.suffix || '')
                      }
                    </p>
                    <div className="flex items-center space-x-1 text-xs">
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(metric.change)}%
                      </span>
                      <span className="text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${metric.gradient} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, Shield, Server, AlertTriangle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { api } from '@/lib/api'

export function AdminStatsGrid() {
  const [stats, setStats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminStats()
        const mappedStats = [
          {
            title: 'Total Platform Revenue',
            value: parseFloat(data.total_revenue),
            currency: true,
            change: 12.5,
            icon: DollarSign,
            gradient: 'gateway-dark-gradient',
          },
          {
            title: 'Active Merchants',
            value: data.active_merchants,
            change: 5.2,
            icon: Users,
            gradient: 'gateway-dark-gradient',
          },
          {
            title: 'Total Transactions',
            value: data.total_transactions || 0,
            change: 0,
            icon: CreditCard,
            gradient: 'gateway-dark-gradient',
          },
          {
            title: 'Success Rate',
            value: data.success_rate,
            suffix: '%',
            change: 0,
            icon: Shield,
            gradient: 'gateway-dark-gradient',
          },
          {
            title: 'Pending Approvals',
            value: data.pending_merchants,
            change: 0,
            icon: AlertTriangle,
            gradient: 'gateway-dark-gradient',
          },
          {
            title: 'Active Nodes',
            value: data.active_nodes || 0,
            change: 0,
            icon: Server,
            gradient: 'gateway-dark-gradient',
          },
        ]
        setStats(mappedStats)
      } catch (err) {
        setError('Failed to load stats')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="hover-glow animate-pulse">
            <CardContent className="p-6 h-32 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground transition-all duration-300" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 glass-card border-red-500/50 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const isPositive = stat.change > 0
        const IconComponent = stat.icon
        
        return (
          <Card key={stat.title} className="hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold gradient-text">
                      {stat.currency 
                        ? formatCurrency(stat.value)
                        : formatNumber(stat.value) + (stat.suffix || '')
                      }
                    </p>
                    <div className="flex items-center space-x-1 text-xs">
                      {stat.change !== 0 && (
                        <>
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                            {Math.abs(stat.change)}%
                          </span>
                          <span className="text-muted-foreground">vs last month</span>
                        </>
                      )}
                      {stat.change === 0 && (
                        <span className="text-muted-foreground">No change</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.gradient} flex items-center justify-center`}>
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
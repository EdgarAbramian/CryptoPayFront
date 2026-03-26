import { DollarSign, Wallet, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useMerchantDashboard } from '@/hooks/useMerchantDashboard'

export function MerchantStatsGrid() {
  const { stats, isLoading } = useMerchantDashboard()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="hover-glow animate-pulse">
            <CardContent className="h-32 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Available Balance',
      value: stats?.balance_available_usd || 0,
      currency: true,
      icon: Wallet,
      gradient: 'gateway-dark-gradient',
      description: 'Ready to withdraw (USD)'
    },
    {
      title: 'Pending / Locked',
      value: stats?.balance_pending_usd || 0,
      currency: true,
      icon: Clock,
      gradient: 'gateway-dark-gradient',
      description: 'Confirmed on-chain, waiting for threshold'
    },
    {
      title: 'Total Volume',
      value: stats?.total_volume_usd || 0,
      currency: true,
      icon: DollarSign,
      gradient: 'gateway-dark-gradient',
      description: 'Lifetime revenue'
    },
    {
      title: 'Success Rate',
      value: stats?.success_rate || 0,
      suffix: '%',
      icon: CheckCircle,
      gradient: 'gateway-dark-gradient',
      description: 'Paid vs Total invoices'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat) => {
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
                    {stat.description && (
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {stat.description}
                      </p>
                    )}
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
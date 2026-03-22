import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'

const stats = [
  {
    title: 'Total Revenue',
    value: 2847293,
    currency: true,
    change: 12.5,
    icon: DollarSign,
    gradient: 'gateway-dark-gradient',
  },
  {
    title: 'Active Merchants',
    value: 1247,
    change: 8.2,
    icon: Users,
    gradient: 'gateway-dark-gradient',
  },
  {
    title: 'Transactions',
    value: 89234,
    change: -2.1,
    icon: CreditCard,
    gradient: 'gateway-dark-gradient',
  },
  {
    title: 'Success Rate',
    value: 98.7,
    suffix: '%',
    change: 0.3,
    icon: BarChart3,
    gradient: 'gateway-dark-gradient',
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
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
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="text-muted-foreground">vs last month</span>
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
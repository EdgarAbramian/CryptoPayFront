import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign
} from 'lucide-react'
import { useState } from 'react'
import { MerchantBalanceFAB } from './MobileFAB'

export function MobileBalance() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  const balanceData = {
    available: 15247.82,
    pending: 892.34,
    total: 16140.16,
    todayChange: 12.5,
    todayRevenue: 1892.34
  }

  const quickActions = [
    { icon: Plus, label: 'Deposit', color: 'bg-green-500', action: 'deposit' },
    { icon: Minus, label: 'Withdraw', color: 'bg-red-500', action: 'withdraw' },
    { icon: ArrowUpRight, label: 'Send', color: 'bg-blue-500', action: 'send' },
    { icon: Clock, label: 'History', color: 'bg-purple-500', action: 'history' },
  ]

  const recentActivity = [
    { 
      type: 'deposit', 
      amount: 500.00, 
      description: 'Bank Transfer', 
      time: '2 hours ago',
      status: 'completed'
    },
    { 
      type: 'payment', 
      amount: 1234.56, 
      description: 'Payment Received', 
      time: '5 hours ago',
      status: 'completed'
    },
    { 
      type: 'withdrawal', 
      amount: 250.00, 
      description: 'ATM Withdrawal', 
      time: '1 day ago',
      status: 'pending'
    },
  ]

  const formatBalance = (amount: number) => {
    if (!balanceVisible) return '••••••'
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Balance Card */}
      <Card className="hover-glow bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header with visibility toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-6 h-6 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Available Balance</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="w-8 h-8"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>

            {/* Main Balance */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold gradient-text">
                {formatBalance(balanceData.available)}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className={`flex items-center space-x-1 ${
                  balanceData.todayChange > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {balanceData.todayChange > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(balanceData.todayChange)}% today
                  </span>
                </div>
              </div>
            </div>

            {/* Balance Breakdown */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-lg font-semibold text-yellow-400">
                  {formatBalance(balanceData.pending)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Today's Revenue</div>
                <div className="text-lg font-semibold text-green-400">
                  {formatBalance(balanceData.todayRevenue)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="glass"
                className="h-20 flex-col space-y-2 p-4 group hover:scale-105 transition-all"
              >
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Period Selector */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Balance History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Period Chips */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['today', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'gateway-dark-gradient text-white shadow-lg'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Mini Chart Placeholder */}
          <div className="h-32 glass-card rounded-lg p-4 flex items-center justify-center">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-sm text-muted-foreground">
                Balance chart for {selectedPeriod}
              </div>
              <div className="text-lg font-semibold gradient-text">+12.5%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 glass-card rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'deposit' ? 'bg-green-500/20' :
                  activity.type === 'payment' ? 'bg-blue-500/20' : 'bg-red-500/20'
                }`}>
                  {activity.type === 'deposit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  ) : activity.type === 'payment' ? (
                    <DollarSign className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  activity.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {activity.type === 'withdrawal' ? '-' : '+'}${activity.amount.toFixed(2)}
                </div>
                <Badge className={`text-xs ${
                  activity.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>
                  {activity.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Balance Insights */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">Best performing day</p>
                  <p className="text-xs text-muted-foreground">Friday, +$2,400</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-green-400">+23%</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Average daily revenue</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-white">$1,450</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white">Monthly growth</p>
                  <p className="text-xs text-muted-foreground">Compared to last month</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-purple-400">+15.3%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <MerchantBalanceFAB />
    </div>
  )
}
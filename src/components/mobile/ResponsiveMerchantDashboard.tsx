import { MerchantStatsGrid } from '../merchant/MerchantStatsGrid'
import { MerchantRevenueChart } from '../merchant/MerchantRevenueChart'
import { MerchantRecentTransactions } from '../merchant/MerchantRecentTransactions'
import { MerchantQuickActions } from '../merchant/MerchantQuickActions'
import { MobileMerchantStatsGrid } from './MobileStatsGrid'
import { MobileChart } from './MobileCharts'
import { useMobile } from '@/hooks/useMobile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CreditCard, 
  Download, 
  Key, 
  BarChart3
} from 'lucide-react'

export function ResponsiveMerchantDashboard() {
  const { isMobile } = useMobile()

  if (isMobile) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Mobile Stats Grid */}
        <MobileMerchantStatsGrid />

        {/* Mobile Quick Actions */}
        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: CreditCard, label: 'New Payment', color: 'bg-purple-500' },
                { icon: Download, label: 'Withdraw', color: 'bg-green-500' },
                { icon: Key, label: 'API Keys', color: 'bg-blue-500' },
                { icon: BarChart3, label: 'Reports', color: 'bg-orange-500' },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="glass"
                  className="h-16 flex-col space-y-1 p-3"
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Revenue Chart */}
        <MobileChart
          data={[
            { name: 'Mon', value: 1200 },
            { name: 'Tue', value: 1800 },
            { name: 'Wed', value: 1600 },
            { name: 'Thu', value: 2200 },
            { name: 'Fri', value: 1900 },
            { name: 'Sat', value: 2400 },
            { name: 'Sun', value: 2100 },
          ]}
          title="Weekly Revenue"
          value="$12.4K"
          change={15.3}
          type="area"
        />

        {/* Mobile Integration Status */}
        {/*
        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Integration Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'API Connection', status: 'connected', description: 'All endpoints active' },
              { name: 'Webhooks', status: 'connected', description: '3 active endpoints' },
              { name: 'Payment Gateway', status: 'connected', description: 'BTC, ETH, USDT' },
              { name: 'KYC Verification', status: 'pending', description: 'Documents under review' },
            ].map((item) => (
              <div key={item.name} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-shrink-0">
                  {item.status === 'connected' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : item.status === 'pending' ? (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        */}

        {/* Mobile Recent Transactions */}
        <Card className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: '#TXN001', amount: '+$1,234.56', type: 'Payment Received', time: '2m ago', status: 'completed' },
              { id: '#TXN002', amount: '-$45.00', type: 'Transaction Fee', time: '5m ago', status: 'completed' },
              { id: '#TXN003', amount: '+$892.30', type: 'Payment Received', time: '1h ago', status: 'completed' },
              { id: '#TXN004', amount: '+$2,156.78', type: 'Payment Received', time: '2h ago', status: 'pending' },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 glass-card rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{transaction.type}</p>
                    <p className={`text-sm font-bold ${
                      transaction.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.amount}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{transaction.id}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <p className="text-xs text-muted-foreground">{transaction.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Desktop версия - оригинальная
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
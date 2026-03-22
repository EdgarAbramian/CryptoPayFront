import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter,
  PieChart,
  Activity,
  DollarSign,
  Users,
  CreditCard,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Target
} from 'lucide-react'
import { useState } from 'react'

export function MobileReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('overview')

  const reportData = {
    overview: {
      totalRevenue: 45231.56,
      totalTransactions: 1247,
      successRate: 98.9,
      avgTicket: 36.28,
      growth: {
        revenue: 15.3,
        transactions: 8.7,
        successRate: 0.3,
        avgTicket: 12.1
      }
    },
    byPaymentMethod: [
      { method: 'Bitcoin', amount: 18500.23, percentage: 41, transactions: 512, color: 'bg-orange-500' },
      { method: 'Ethereum', amount: 13200.45, percentage: 29, transactions: 364, color: 'bg-blue-500' },
      { method: 'USDT', amount: 8900.12, percentage: 20, transactions: 245, color: 'bg-green-500' },
      { method: 'Others', amount: 4630.76, percentage: 10, transactions: 126, color: 'bg-purple-500' },
    ],
    timeSeriesData: [
      { period: 'Week 1', revenue: 8500, transactions: 245 },
      { period: 'Week 2', revenue: 12300, transactions: 342 },
      { period: 'Week 3', revenue: 9800, transactions: 298 },
      { period: 'Week 4', revenue: 14631, transactions: 362 },
    ]
  }

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'customers', label: 'Customers', icon: Users },
  ]

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ]

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Export */}
      <Card className="hover-glow bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
              <p className="text-sm text-muted-foreground">Business insights and performance metrics</p>
            </div>
            <Button variant="glass" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Period Selector */}
      <Card className="hover-glow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">Time Period</span>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Custom
            </Button>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === period.id
                    ? 'gateway-dark-gradient text-white shadow-lg'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Type Selector */}
      <Card className="hover-glow">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedReport === type.id
                    ? 'gateway-dark-gradient border-purple-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                }`}
              >
                <type.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {formatPercentage(reportData.overview.growth.revenue)}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold gradient-text">
              {formatCurrency(reportData.overview.totalRevenue)}
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {formatPercentage(reportData.overview.growth.transactions)}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold text-white">
              {reportData.overview.totalTransactions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Transactions</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-purple-400" />
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {formatPercentage(reportData.overview.growth.successRate)}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold text-white">
              {reportData.overview.successRate}%
            </div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6 text-orange-400" />
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {formatPercentage(reportData.overview.growth.avgTicket)}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold text-white">
              {formatCurrency(reportData.overview.avgTicket)}
            </div>
            <div className="text-xs text-muted-foreground">Avg. Ticket</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            <span>Revenue Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Simple Chart Representation */}
            <div className="h-32 flex items-end space-x-2">
              {reportData.timeSeriesData.map((data, index) => {
                const height = (data.revenue / Math.max(...reportData.timeSeriesData.map(d => d.revenue))) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full gateway-dark-gradient rounded-t-lg transition-all hover:scale-105"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                      {data.period}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 gateway-dark-gradient rounded"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Transactions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Breakdown */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <PieChart className="w-5 h-5" />
            <span>Payment Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportData.byPaymentMethod.map((method, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${method.color}`}></div>
                  <span className="text-sm font-medium text-white">{method.method}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(method.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {method.transactions} txns
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${method.color}`}
                  style={{ width: `${method.percentage}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {method.percentage}% of total
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-white">Revenue Growth</p>
              <p className="text-xs text-muted-foreground">15.3% increase from last month</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Customer Retention</p>
              <p className="text-xs text-muted-foreground">89% returning customers this month</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <Clock className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Processing Time</p>
              <p className="text-xs text-muted-foreground">Average 2.3s per transaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <Download className="w-5 h-5" />
              <span className="text-xs">PDF Report</span>
            </Button>
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <Download className="w-5 h-5" />
              <span className="text-xs">CSV Data</span>
            </Button>
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Schedule</span>
            </Button>
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
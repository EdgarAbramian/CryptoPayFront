import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Activity, Users, Zap } from 'lucide-react'

// Мобильные оптимизированные диаграммы
interface MobileChartProps {
  data: any[]
  title: string
  value: string
  change: number
  type: 'line' | 'area' | 'pie'
}

export function MobileChart({ data, title, value, change, type }: MobileChartProps) {
  const isPositive = change > 0

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#gradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#a855f7"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card className="hover-glow">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold gradient-text">{value}</p>
            </div>
            <div className="flex items-center space-x-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-30">
            {renderChart()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Мобильная версия Revenue Chart
export function MobileRevenueChart() {
  const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ]

  return (
    <MobileChart
      data={data}
      title="Revenue Trend"
      value="$456.2K"
      change={12.5}
      type="area"
    />
  )
}

// Мобильная версия System Health
export function MobileSystemHealth() {
  return (
    <Card className="hover-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Activity className="w-4 h-4" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="space-y-3">
          {[
            { label: 'API Status', status: 'operational', value: '99.9%' },
            { label: 'Database', status: 'operational', value: '100%' },
            { label: 'Payment Processing', status: 'operational', value: '99.8%' },
            { label: 'Node Network', status: 'warning', value: '95.2%' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${item.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                  } animate-pulse`}></div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-white">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Overall Health */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Overall Health</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-400">Excellent</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact Activities для мобильных
export function MobileRecentActivity() {
  const activities = [
    { type: 'payment', message: 'Payment processed', amount: '$1,234.56', time: '2m ago' },
    { type: 'user', message: 'New merchant registered', amount: 'ABC Corp', time: '5m ago' },
    { type: 'system', message: 'System backup completed', amount: '98.2GB', time: '1h ago' },
    { type: 'alert', message: 'High volume detected', amount: '+45%', time: '2h ago' },
  ]

  return (
    <Card className="hover-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Zap className="w-4 h-4" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-2 glass-card rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium gradient-text">{activity.amount}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
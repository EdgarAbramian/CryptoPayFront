import { useState, useEffect } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api, RevenueDataPoint } from '@/lib/api'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

export function MerchantRevenueChart() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [data, setData] = useState<RevenueDataPoint[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [change, setChange] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await api.getMerchantRevenueAnalytics({ period })
        setData(result.data_points)
        setTotalRevenue(result.total_revenue_usd)
        setChange(result.change_percentage)
      } catch (error) {
        console.error('Failed to fetch revenue analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [period])

  const formatValue = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <Card className="hover-glow overflow-hidden border-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Revenue Overview</CardTitle>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold tracking-tight">{formatValue(totalRevenue)}</span>
            <span className={`text-[10px] flex items-center px-1.5 py-0.5 rounded-full ${change >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(change)}%
            </span>
          </div>
        </div>
        <div className="flex bg-muted/20 p-1 rounded-lg border border-white/5">
          {(['day', 'week', 'month', 'year'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-7 px-3 text-[10px] capitalize transition-all ${period === p ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'text-muted-foreground'}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[320px] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px] z-10 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          )}
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10 }}
                minTickGap={40}
                tickFormatter={(val) => {
                  if (period === 'day') return val.split(' ')[1] // show only time
                  return val
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.98)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
                }}
                formatter={(val: number) => [formatValue(val), 'Revenue']}
                labelStyle={{ color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                animationDuration={1500}
                activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
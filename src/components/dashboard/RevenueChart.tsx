import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export function RevenueChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadChartData() {
      try {
        const response = await api.getRevenueChart('month')
        const formatted = response.data.map((point: any) => ({
          name: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          revenue: parseFloat(point.revenue),
        }))
        setChartData(formatted)
      } catch (err) {
        console.error('Failed to load chart data', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadChartData()
  }, [])
  if (isLoading) {
    return (
      <Card className="hover-glow">
        <CardContent className="p-6 h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-glow">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly revenue and transaction volume
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2a2a2a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
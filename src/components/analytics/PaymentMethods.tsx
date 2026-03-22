import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const COLORS = ['#2a2a2a', '#3a3a3a', '#1a1a1a', '#4a4a4a', '#2d2d2d', '#5a5a5a']

export function PaymentMethods() {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([])

  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('nexus-user') || '{}')
        let chartData: any[] = []
        
        if (user.role === 'merchant') {
          const res = await api.getMerchantCoinDistribution()
          chartData = res.map(item => ({
            name: item.symbol,
            percentage: item.percentage
          }))
        } else {
          chartData = await api.getPaymentMethodsAnalytics()
        }
        
        if (!chartData || chartData.length === 0) {
          setData([
            { name: 'No Data', value: 100, color: '#1a1a1a' }
          ])
        } else {
          const withColors = chartData.map((item, index) => ({
            name: item.name,
            value: item.percentage,
            color: COLORS[index % COLORS.length]
          }))
          setData(withColors)
        }
      } catch (e) {
        console.error("Failed to fetch payment methods analytics:", e)
      }
    }

    fetchBreakdown()
  }, [])

  return (
    <Card className="hover-glow">
      <CardHeader>
        <CardTitle>Payment Methods Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown by cryptocurrency used (volume share)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 10, 10, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-1/2 space-y-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-white">{item.name}</span>
                </div>
                <Badge variant="glass" className="text-xs">
                  {item.value}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
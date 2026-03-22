import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { api, HourlyVolumeData } from '@/lib/api'

const DEMO_DATA = [
  { hour: '00:00', volume: 45000, transactions: 120 },
  { hour: '04:00', volume: 32000, transactions: 89 },
  { hour: '08:00', volume: 78000, transactions: 245 },
  { hour: '12:00', volume: 125000, transactions: 387 },
  { hour: '16:00', volume: 98000, transactions: 298 },
  { hour: '20:00', volume: 87000, transactions: 234 },
  { hour: '24:00', volume: 54000, transactions: 156 },
]

export function VolumeChart() {
  const [data, setData] = useState<HourlyVolumeData[]>(DEMO_DATA)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('nexus-user') || '{}')
        if (user.role === 'merchant') {
          const res = await api.getMerchantRevenueAnalytics({ period: 'day' })
          if (res.data_points && res.data_points.length > 0) {
            const mappedData = res.data_points.map(dp => ({
              hour: dp.date.split(' ')[1], // Get HH:mm
              volume: dp.revenue,
              transactions: dp.count
            }))
            setData(mappedData as any)
            setIsLive(true)
          }
          return
        }

        const res = await api.getHourlyVolume()
        if (res && res.length > 0) {
          setData(res)
          setIsLive(true)
        }
      } catch (e) {
        console.warn("Using demo data for VolumeChart (real endpoint not reachable)")
      }
    }

    fetchChart()
  }, [])

  return (
    <Card className="hover-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>24h Volume Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">
            Transaction volume and count over the last 24 hours
          </p>
        </div>
        {isLive && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-green-500 font-medium uppercase tracking-wider">Live</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="hour" 
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
              <Line
                type="monotone"
                dataKey="volume"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={3}
                dot={{ fill: 'rgba(255, 255, 255, 0.8)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'rgba(255, 255, 255, 0.9)' }}
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={2}
                dot={{ fill: 'rgba(255, 255, 255, 0.6)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: 'rgba(255, 255, 255, 0.7)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
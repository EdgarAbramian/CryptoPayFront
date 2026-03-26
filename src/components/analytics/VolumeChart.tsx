import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { api, HourlyVolumeData } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Activity } from 'lucide-react'

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
  const { user } = useAuth()
  const [data, setData] = useState<HourlyVolumeData[]>([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true)
      try {
        if (user?.role === 'merchant') {
          const res = await api.getMerchantRevenueAnalytics({ period: 'day' })
          if (res.data_points && res.data_points.length > 0) {
            const mappedData = res.data_points.map(dp => {
              // Robust time parsing: handle "2023-10-27 12:00" or "2023-10-27T12:00:00Z"
              const timeStr = dp.date.includes(' ') 
                ? dp.date.split(' ')[1] 
                : dp.date.includes('T') 
                  ? dp.date.split('T')[1].substring(0, 5)
                  : dp.date
              
              return {
                hour: timeStr,
                volume: dp.revenue,
                transactions: dp.count
              }
            })
            setData(mappedData as any)
            setIsLive(true)
          } else {
            setData([])
          }
          return
        }

        const res = await api.getHourlyVolume()
        if (res && res.length > 0) {
          setData(res)
          setIsLive(true)
        } else {
          setData([])
        }
      } catch (e) {
        console.error("Failed to fetch VolumeChart data:", e)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchChart()
    }
  }, [user])

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
        <div className="h-80 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading analytics...</p>
            </div>
          ) : data.length > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center space-y-2 opacity-50">
              <Activity className="w-12 h-12 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No transaction data for the last 24h</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
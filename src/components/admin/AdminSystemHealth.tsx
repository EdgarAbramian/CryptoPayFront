import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Server, Database, ServerCrash, CheckCircle, AlertTriangle } from 'lucide-react'
import { api, SystemHealth } from '@/lib/api'

export function AdminSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null)

  const fetchHealth = async () => {
    try {
      const data = await api.getSystemHealth()
      setHealth(data)
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 15000) // Poll every 15s
    return () => clearInterval(interval)
  }, [])

  if (!health) return null;

  const services = [
    {
      name: 'Server Status',
      value: `CPU: ${health.cpu_load.toFixed(1)}% | RAM: ${health.ram_usage.toFixed(1)}%`,
      status: health.cpu_load < 90 ? 'operational' : 'warning',
      icon: Server,
    },
    {
      name: 'Database',
      value: health.db_connected ? 'Connected' : 'Offline',
      status: health.db_connected ? 'operational' : 'degraded',
      icon: Database,
    },
    {
      name: 'Redis Cache',
      value: health.redis_connected ? 'Connected' : 'Offline',
      status: health.redis_connected ? 'operational' : 'degraded',
      icon: Activity,
    },
    {
      name: 'Disk Usage',
      value: `${health.disk_usage.toFixed(1)}% Used`,
      status: health.disk_usage < 85 ? 'operational' : 'warning',
      icon: ServerCrash,
    }
  ]

  const totalHealthy = health.status === 'healthy'

  return (
    <Card className="hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className={`w-5 h-5 ${totalHealthy ? 'text-green-400' : 'text-yellow-400'}`} />
          <span>System Health</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time platform monitoring (Uptime: {(health.uptime_seconds / 3600).toFixed(1)}h)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => {
            const IconComponent = service.icon
            const isOperational = service.status === 'operational'
            
            return (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 glass-card rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg gateway-dark-gradient flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{service.name}</div>
                    <div className="text-xs text-muted-foreground">{service.value}</div>
                  </div>
                </div>
                
                <Badge
                  variant={isOperational ? 'success' : 'warning'}
                  className="flex items-center space-x-1"
                >
                  {isOperational ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  <span className="capitalize">{service.status}</span>
                </Badge>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Status</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${totalHealthy ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className={`font-medium ${totalHealthy ? 'text-green-400' : 'text-yellow-400'}`}>
                {totalHealthy ? 'All Systems Operational' : 'System Degraded'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
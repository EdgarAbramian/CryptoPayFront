import { useState, useEffect } from 'react'
import {
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Loader2,
  Shield,
  User as UserIcon,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
// No static audit events needed anymore - using real data

// No static audit events needed anymore - using real data

const statusConfig = {
  success: {
    color: 'success',
    icon: CheckCircle,
    bgColor: 'bg-green-500/10 border-green-500/20'
  },
  warning: {
    color: 'warning',
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10 border-yellow-500/20'
  },
  error: {
    color: 'destructive',
    icon: AlertTriangle,
    bgColor: 'bg-red-500/10 border-red-500/20'
  },
}

export function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const data = await api.getAuditLogs()
      setEvents(data)
    } catch (err) {
      console.error('Failed to fetch audit logs', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const filteredEvents = events.filter(event => {
    // Basic search filtering
    const searchStr = (event.action || '').toLowerCase() + (event.user_id || '').toLowerCase() + (event.target_type || '').toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());

    // Status filtering (simulated since backend might not send status yet)
    const matchesStatus = statusFilter === 'all' || (event.status || 'success') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Audit Log</h1>
        <p className="text-muted-foreground">
          Track all system activities and security events.
        </p>
      </div>

      {/* Filters */}
      <Card className="hover-glow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search audit events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'success' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('success')}
                >
                  Success
                </Button>
                <Button
                  variant={statusFilter === 'warning' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('warning')}
                >
                  Warning
                </Button>
                <Button
                  variant={statusFilter === 'error' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('error')}
                >
                  Error
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="glass" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
              <Button variant="glass" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events */}
      <Card className="hover-glow">
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const status = event.status || 'success'
                const StatusIcon = (statusConfig as any)[status]?.icon || CheckCircle

                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:bg-white/5 ${(statusConfig as any)[status]?.bgColor || 'bg-white/5'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-white">{event.action}</h4>
                            <Badge variant="glass" className="text-xs">
                              {event.target_type || 'System'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.details || `ID: ${event.target_id || 'N/A'}`}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <UserIcon className="w-3 h-3" />
                              <span>{event.user_id}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(event.created_at).toLocaleString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={(statusConfig as any)[status]?.color || 'outline'}
                        className="flex items-center space-x-1"
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{status}</span>
                      </Badge>
                    </div>
                  </div>
                )
              })}
              {filteredEvents.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">No events found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'
import { api } from '@/lib/api'
import { 
  Server, 
  MoreVertical, 
  Activity,
  Zap,
  HardDrive,
  Cpu,
  Wifi,
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface Node {
  id: string
  name: string
  type: 'bitcoin' | 'ethereum' | 'usdc' | 'litecoin'
  status: 'online' | 'offline' | 'syncing' | 'error'
  location: string
  uptime: string
  blockHeight: number
  peers: number
  version: string
  lastSync: string
}

const statusConfig = {
  online: { color: 'success', bgColor: 'bg-green-500/10 border-green-500/20', icon: Activity },
  offline: { color: 'destructive', bgColor: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
  syncing: { color: 'warning', bgColor: 'bg-yellow-500/10 border-yellow-500/20', icon: Zap },
  error: { color: 'destructive', bgColor: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
}

const typeMap: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDC': 'usdc',
  'LTC': 'litecoin',
}

const typeColors = {
  bitcoin: 'from-orange-600 to-yellow-600',
  ethereum: 'from-blue-600 to-indigo-600',
  usdc: 'from-green-600 to-emerald-600',
  litecoin: 'from-gray-600 to-slate-600',
}

export function AdminNodes() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadNodes() {
      try {
        const data = await api.getNodes()
        const mappedNodes = data.map((n: any) => ({
          id: n.id,
          name: `${n.coin} Node ${n.id}`,
          type: (typeMap[n.coin] || n.coin.toLowerCase()) as any,
          status: (n.status === 'synced' ? 'online' : (n.status === 'syncing' ? 'syncing' : 'error')) as Node['status'],
          location: 'Mainnet Node',
          uptime: n.uptime || '99.9%',
          blockHeight: n.block_height,
          peers: n.peers,
          version: '1.0.0',
          lastSync: 'Just now',
        }))
        setNodes(mappedNodes)
      } catch (err) {
        console.error('Failed to load nodes', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadNodes()
  }, [])

  const stats = {
    total: nodes.length,
    online: nodes.filter(n => n.status === 'online').length,
    syncing: nodes.filter(n => n.status === 'syncing').length,
    offline: nodes.filter(n => n.status === 'offline' || n.status === 'error').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Node Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage blockchain nodes across different networks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Nodes</p>
                <p className="text-2xl font-bold gradient-text">{stats.total}</p>
              </div>
              <Server className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-green-400">{stats.online}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Syncing</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.syncing}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-400">{stats.offline}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 
      <div className="flex justify-end">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Node
        </Button>
      </div>
      */}

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nodes.map((node) => {
            const statusInfo = statusConfig[node.status] || statusConfig.error
            const StatusIcon = statusInfo.icon
            
            return (
              <Card
                key={node.id}
                className={`hover-glow border transition-all duration-300 ${
                  statusInfo.bgColor
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${(typeColors as any)[node.type]} flex items-center justify-center`}>
                        <Server className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{node.name}</h3>
                        <p className="text-sm text-muted-foreground">{node.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {node.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={statusInfo.color as any}
                        className="flex items-center space-x-1"
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{node.status}</span>
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Block Height</p>
                      <p className="font-semibold text-white">{formatNumber(node.blockHeight)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Peers</p>
                      <p className="font-semibold text-white">{node.peers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                      <p className="font-semibold text-white">{node.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Version</p>
                      <p className="font-semibold text-white">{node.version}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                       <Badge className={`bg-gradient-to-r ${(typeColors as any)[node.type]} text-white capitalize`}>
                        {node.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last sync: {node.lastSync}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Cpu className="w-4 h-4 text-muted-foreground" />
                      <HardDrive className="w-4 h-4 text-muted-foreground" />
                      <Wifi className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
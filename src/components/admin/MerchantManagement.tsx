import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { formatCurrency } from '@/lib/utils'
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Building2, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from 'lucide-react'

interface Merchant {
  id: string
  name: string
  email: string
  status: 'active' | 'pending' | 'suspended'
  tier: 'bronze' | 'silver' | 'gold' | 'premium'
  volume: number
  transactions: number
  created: string
  lastActive: string
  commission: number
}

const merchants: Merchant[] = [
  {
    id: 'MER_001',
    name: 'TechStore Inc',
    email: 'admin@techstore.com',
    status: 'active',
    tier: 'premium',
    volume: 2847293,
    transactions: 12847,
    created: '2023-08-15',
    lastActive: '2 hours ago',
    commission: 1.2,
  },
  {
    id: 'MER_002',
    name: 'GameHub Pro',
    email: 'contact@gamehub.pro',
    status: 'active',
    tier: 'gold',
    volume: 1894732,
    transactions: 8923,
    created: '2023-09-22',
    lastActive: '5 minutes ago',
    commission: 1.5,
  },
  {
    id: 'MER_003',
    name: 'Digital Assets Ltd',
    email: 'support@digitalassets.ltd',
    status: 'pending',
    tier: 'silver',
    volume: 567849,
    transactions: 3456,
    created: '2024-01-10',
    lastActive: '1 day ago',
    commission: 2.0,
  },
  {
    id: 'MER_004',
    name: 'Crypto Marketplace',
    email: 'hello@cryptomarket.io',
    status: 'suspended',
    tier: 'bronze',
    volume: 234567,
    transactions: 1234,
    created: '2023-12-03',
    lastActive: '1 week ago',
    commission: 2.5,
  },
]

const statusConfig = {
  active: { color: 'success', bgColor: 'bg-green-500/10 border-green-500/20' },
  pending: { color: 'warning', bgColor: 'bg-yellow-500/10 border-yellow-500/20' },
  suspended: { color: 'destructive', bgColor: 'bg-red-500/10 border-red-500/20' },
}

const tierColors = {
  premium: 'gateway-dark-gradient',
  gold: 'gateway-dark-gradient',
  silver: 'gateway-dark-gradient',
  bronze: 'gateway-dark-gradient',
}

export function MerchantManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: merchants.length,
    active: merchants.filter(m => m.status === 'active').length,
    pending: merchants.filter(m => m.status === 'pending').length,
    suspended: merchants.filter(m => m.status === 'suspended').length,
    totalVolume: merchants.reduce((sum, m) => sum + m.volume, 0),
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Merchant Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor all registered merchants on your platform.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Merchants</p>
                <p className="text-2xl font-bold gradient-text">{stats.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold gradient-text">{formatCurrency(stats.totalVolume / 1000000)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="hover-glow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search merchants..."
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
                  All ({stats.total})
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  Active ({stats.active})
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending ({stats.pending})
                </Button>
              </div>
            </div>
            
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Merchant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Merchants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMerchants.map((merchant) => (
          <Card
            key={merchant.id}
            className={`hover-glow border transition-all duration-300 ${
              statusConfig[merchant.status].bgColor
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg gateway-dark-gradient flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{merchant.name}</h3>
                    <p className="text-sm text-muted-foreground">{merchant.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {merchant.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${
                      tierColors[merchant.tier]
                    } text-white capitalize border border-white/20`}
                  >
                    {merchant.tier}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="font-semibold text-white">{formatCurrency(merchant.volume)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                  <p className="font-semibold text-white">{merchant.transactions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="font-semibold text-white">{merchant.commission}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Active</p>
                  <p className="font-semibold text-white">{merchant.lastActive}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Badge variant={statusConfig[merchant.status].color as any}>
                    {merchant.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Since {merchant.created}
                  </span>
                </div>
                
                <Switch checked={merchant.status === 'active'} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
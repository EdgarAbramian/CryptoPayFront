import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Ban
} from 'lucide-react'
import { useState } from 'react'
import { AdminMerchantsFAB } from './MobileFAB'

interface Merchant {
  id: string
  name: string
  email: string
  status: 'active' | 'pending' | 'suspended' | 'inactive'
  verificationStatus: 'verified' | 'pending' | 'rejected'
  revenue: number
  transactions: number
  joinDate: string
  lastActive: string
  country: string
  tier: 'starter' | 'pro' | 'enterprise'
}

export function MobileMerchants() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')

  const merchants: Merchant[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      email: 'admin@techcorp.com',
      status: 'active',
      verificationStatus: 'verified',
      revenue: 145230.56,
      transactions: 1247,
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      country: 'United States',
      tier: 'enterprise'
    },
    {
      id: '2',
      name: 'Digital Dynamics',
      email: 'contact@digitaldynamics.io',
      status: 'active',
      verificationStatus: 'verified',
      revenue: 89456.23,
      transactions: 892,
      joinDate: '2024-02-01',
      lastActive: '1 day ago',
      country: 'Canada',
      tier: 'pro'
    },
    {
      id: '3',
      name: 'Innovation Labs',
      email: 'hello@innovationlabs.tech',
      status: 'pending',
      verificationStatus: 'pending',
      revenue: 12456.78,
      transactions: 156,
      joinDate: '2024-03-10',
      lastActive: '3 days ago',
      country: 'United Kingdom',
      tier: 'starter'
    },
    {
      id: '4',
      name: 'Global Commerce Inc',
      email: 'support@globalcommerce.com',
      status: 'suspended',
      verificationStatus: 'rejected',
      revenue: 234567.89,
      transactions: 2341,
      joinDate: '2023-11-20',
      lastActive: '1 week ago',
      country: 'Germany',
      tier: 'enterprise'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'suspended':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'pro':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'starter':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = searchTerm === '' || 
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter
    const matchesTier = tierFilter === 'all' || merchant.tier === tierFilter
    
    return matchesSearch && matchesStatus && matchesTier
  })

  const totalStats = {
    total: merchants.length,
    active: merchants.filter(m => m.status === 'active').length,
    pending: merchants.filter(m => m.status === 'pending').length,
    totalRevenue: merchants.reduce((sum, m) => sum + m.revenue, 0)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="hover-glow bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Merchant Management</h2>
              <p className="text-sm text-muted-foreground">Monitor and manage all merchants</p>
            </div>
            <Button variant="glass" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Merchant</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg gateway-dark-gradient flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold gradient-text">{totalStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Merchants</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{totalStats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{totalStats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold gradient-text">
              ${(totalStats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="hover-glow">
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Chips */}
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Status</div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'active', 'pending', 'suspended', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      statusFilter === status
                        ? 'gateway-dark-gradient text-white'
                        : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Tier</div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'starter', 'pro', 'enterprise'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      tierFilter === tier
                        ? 'gateway-dark-gradient text-white'
                        : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                    }`}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merchants List */}
      <div className="space-y-4">
        {filteredMerchants.map((merchant) => (
          <Card key={merchant.id} className="hover-glow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full gateway-dark-gradient flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {merchant.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{merchant.name}</h3>
                      <p className="text-sm text-muted-foreground">{merchant.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Status and Verification */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(merchant.status)}>
                      {merchant.status}
                    </Badge>
                    <Badge className={getTierColor(merchant.tier)}>
                      {merchant.tier}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getVerificationIcon(merchant.verificationStatus)}
                    <span className="text-sm text-muted-foreground">
                      {merchant.verificationStatus}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold gradient-text">
                      ${merchant.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {merchant.transactions.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Transactions</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Country</span>
                    <span className="text-white">{merchant.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="text-white">{merchant.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="text-white">{merchant.lastActive}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-white/10">
                  <Button variant="glass" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="glass" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={merchant.status === 'suspended' ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}
                  >
                    <Ban className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMerchants.length === 0 && (
        <Card className="hover-glow">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No merchants found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || tierFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No merchants have been added yet'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <AdminMerchantsFAB />
    </div>
  )
}
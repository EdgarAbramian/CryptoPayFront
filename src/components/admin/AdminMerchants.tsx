import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { formatCurrency } from '@/lib/utils'
import { api } from '@/lib/api'
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Building2, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Shield,
  Ban,
  Loader2
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
  apiKeys: number
  apiKey: string
  webhookUrl?: string
  note?: string
}

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

export function AdminMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [merchantStats, setMerchantStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchStats = async () => {
    try {
      const data = await api.getAdminMerchantStats()
      setMerchantStats(data)
    } catch (err) {
      console.error('Failed to fetch merchant stats', err)
    }
  }

  const fetchMerchants = async () => {
    setIsLoading(true)
    try {
      const data = await api.getMerchants({ 
        search: searchTerm, 
        status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined 
      })
      const mappedMerchants = data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        status: m.status.toLowerCase() as any,
        tier: (m.tier?.toLowerCase() || 'bronze') as any,
        volume: parseFloat(m.volume_usd),
        transactions: m.transaction_count,
        created: m.created_at.split('T')[0],
        lastActive: 'Just now',
        commission: parseFloat(m.commission_pcent),
        apiKeys: 1,
        apiKey: m.api_key,
        webhookUrl: m.webhook_url,
        note: m.note,
      }))
      setMerchants(mappedMerchants)
    } catch (err) {
      console.error('Failed to fetch merchants', err)
    } finally {
      setIsLoading(false)
    }
  }

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newMerchant, setNewMerchant] = useState({
    name: '',
    email: '',
    commission_pcent: 1.0,
    webhook_url: '',
    note: '',
  })

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.createMerchant(newMerchant)
      setIsAddModalOpen(false)
      setNewMerchant({ name: '', email: '', commission_pcent: 1.0, webhook_url: '', note: '' })
      fetchMerchants()
      fetchStats()
    } catch (err) {
      console.error('Failed to create merchant', err)
      alert('Failed to create merchant. Please check the logs.')
    }
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)

  const handleEditClick = (merchant: Merchant) => {
    setEditingMerchant(merchant)
    setIsEditModalOpen(true)
  }

  const handleUpdateMerchant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMerchant) return
    try {
      await api.updateMerchant(editingMerchant.id, {
        name: editingMerchant.name,
        email: editingMerchant.email,
        commission_pcent: editingMerchant.commission,
        webhook_url: editingMerchant.webhookUrl,
        note: editingMerchant.note,
        tier: editingMerchant.tier.toUpperCase(),
        status: editingMerchant.status.toUpperCase() as any,
      })
      setIsEditModalOpen(false)
      fetchMerchants()
      fetchStats()
    } catch (err) {
      console.error('Failed to update merchant', err)
      alert('Failed to update merchant.')
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateMerchant(id, { status: newStatus.toUpperCase() as any })
      fetchMerchants()
      fetchStats()
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const handleRotateKey = async (id: string) => {
    if (!confirm('Are you sure you want to rotate the API key? The old one will be invalidated immediately.')) return
    try {
      await api.rotateMerchantKey(id)
      fetchMerchants()
      alert('API Key rotated successfully.')
    } catch (err) {
      console.error('Failed to rotate key', err)
      alert('Failed to rotate API Key.')
    }
  }

  useEffect(() => {
    fetchStats()
    fetchMerchants()
  }, [statusFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Merchant Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor all registered merchants on your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Merchants</p>
                <p className="text-2xl font-bold gradient-text">{merchantStats?.total || 0}</p>
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
                <p className="text-2xl font-bold text-green-400">{merchantStats?.active || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-400">{merchantStats?.pending || 0}</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold gradient-text">{formatCurrency(parseFloat(merchantStats?.total_volume_usd || '0'))}</p>
              </div>
              <DollarSign className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                  onKeyDown={(e) => e.key === 'Enter' && fetchMerchants()}
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
                  variant={statusFilter === 'active' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'glass'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </Button>
              </div>
            </div>
            
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Merchant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Merchant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg glass-card border-white/20 animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Register New Merchant</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMerchant} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Store / Business Name</label>
                  <Input 
                    required 
                    placeholder="e.g. Acme Corp" 
                    value={newMerchant.name}
                    onChange={(e) => setNewMerchant({ ...newMerchant, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Business Email</label>
                  <Input 
                    required 
                    type="email" 
                    placeholder="contact@acme.com" 
                    value={newMerchant.email}
                    onChange={(e) => setNewMerchant({ ...newMerchant, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Commission (%)</label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={newMerchant.commission_pcent}
                      onChange={(e) => setNewMerchant({ ...newMerchant, commission_pcent: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Tier (Automatic)</label>
                    <Input disabled placeholder="BRONZE" className="opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Webhook URL (Optional)</label>
                  <Input 
                    placeholder="https://your-api.com/webhook" 
                    value={newMerchant.webhook_url}
                    onChange={(e) => setNewMerchant({ ...newMerchant, webhook_url: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gateway-dark-gradient">
                    Create Merchant
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Merchant Modal */}
      {isEditModalOpen && editingMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg glass-card border-white/20 animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Edit Merchant: {editingMerchant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateMerchant} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Store / Business Name</label>
                  <Input 
                    required 
                    value={editingMerchant.name}
                    onChange={(e) => setEditingMerchant({ ...editingMerchant, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Business Email</label>
                  <Input 
                    required 
                    type="email" 
                    value={editingMerchant.email}
                    onChange={(e) => setEditingMerchant({ ...editingMerchant, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Commission (%)</label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={editingMerchant.commission}
                      onChange={(e) => setEditingMerchant({ ...editingMerchant, commission: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Tier</label>
                    <select 
                      className="w-full h-10 px-3 py-2 bg-black/50 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      value={editingMerchant.tier}
                      onChange={(e) => setEditingMerchant({ ...editingMerchant, tier: e.target.value as any })}
                    >
                      <option value="bronze">BRONZE</option>
                      <option value="silver">SILVER</option>
                      <option value="gold">GOLD</option>
                      <option value="premium">PREMIUM</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Webhook URL</label>
                  <Input 
                    placeholder="https://your-api.com/webhook" 
                    value={editingMerchant.webhookUrl || ''}
                    onChange={(e) => setEditingMerchant({ ...editingMerchant, webhookUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Internal Note</label>
                  <Input 
                    placeholder="Internal notes..." 
                    value={editingMerchant.note || ''}
                    onChange={(e) => setEditingMerchant({ ...editingMerchant, note: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gateway-dark-gradient">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="hover-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Merchant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">API Key</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Volume</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Txns</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Commission</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tier</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {merchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    className={`group transition-colors hover:bg-white/5 ${merchant.status === 'suspended' ? 'opacity-70' : ''}`}
                  >
                    {/* Merchant info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg gateway-dark-gradient flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate max-w-[160px]">{merchant.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[160px]">{merchant.email}</div>
                          <div className="text-[10px] text-muted-foreground/60">#{merchant.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* API Key */}
                    <td className="px-4 py-3">
                      <code className="text-xs text-white/60 font-mono bg-black/30 px-2 py-1 rounded block max-w-[140px] truncate">
                        {merchant.apiKey}
                      </code>
                    </td>

                    {/* Volume */}
                    <td className="px-4 py-3 text-right font-semibold text-white">{formatCurrency(merchant.volume)}</td>

                    {/* Transactions */}
                    <td className="px-4 py-3 text-right font-semibold text-white">{merchant.transactions.toLocaleString()}</td>

                    {/* Commission */}
                    <td className="px-4 py-3 text-right font-semibold text-white">{merchant.commission}%</td>

                    {/* Tier */}
                    <td className="px-4 py-3 text-center">
                      <Badge className="gateway-dark-gradient text-white capitalize border border-white/20 text-xs">
                        {merchant.tier}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <Badge variant={statusConfig[merchant.status]?.color as any || 'outline'} className="text-xs">
                          {merchant.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center">
                          <Calendar className="w-2.5 h-2.5 mr-0.5" />{merchant.created}
                        </span>
                      </div>
                    </td>

                    {/* Toggle */}
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={merchant.status === 'active'}
                        onCheckedChange={(checked) => handleUpdateStatus(merchant.id, checked ? 'active' : 'suspended')}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end space-x-1">
                        {merchant.status === 'pending' && (
                          <Button size="sm" variant="default" className="h-7 px-2 text-xs" onClick={() => handleUpdateStatus(merchant.id, 'active')}>
                            <Shield className="w-3 h-3 mr-1" />Approve
                          </Button>
                        )}
                        {merchant.status === 'active' && (
                          <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => handleUpdateStatus(merchant.id, 'suspended')}>
                            <Ban className="w-3 h-3 mr-1" />Suspend
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white" onClick={() => handleRotateKey(merchant.id)}>
                          Rotate Key
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(merchant)}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {merchants.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No merchants found.</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
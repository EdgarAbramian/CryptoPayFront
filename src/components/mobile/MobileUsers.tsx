import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

interface SystemUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'merchant' | 'support' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  created: string
  permissions: string[]
}

export function MobileUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const users: SystemUser[] = [
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@nexuspay.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2 hours ago',
      created: '2024-01-01',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Sarah Merchant',
      email: 'sarah@business.com',
      role: 'merchant',
      status: 'active',
      lastLogin: '1 day ago',
      created: '2024-02-15',
      permissions: ['dashboard', 'transactions', 'reports']
    },
    {
      id: '3',
      name: 'Mike Support',
      email: 'support@nexuspay.com',
      role: 'support',
      status: 'active',
      lastLogin: '3 hours ago',
      created: '2024-01-20',
      permissions: ['support', 'users', 'transactions']
    },
    {
      id: '4',
      name: 'Lisa Viewer',
      email: 'lisa@nexuspay.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '1 week ago',
      created: '2024-03-01',
      permissions: ['dashboard', 'reports']
    }
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'merchant':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'support':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'viewer':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'suspended':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'inactive':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    merchants: users.filter(u => u.role === 'merchant').length
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="hover-glow bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <p className="text-sm text-muted-foreground">Manage system users and permissions</p>
            </div>
            <Button variant="glass" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg gateway-dark-gradient flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold gradient-text">{userStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{userStats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">{userStats.admins}</div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">{userStats.merchants}</div>
            <div className="text-sm text-muted-foreground">Merchants</div>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Chips */}
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Role</div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'admin', 'merchant', 'support', 'viewer'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      roleFilter === role
                        ? 'gateway-dark-gradient text-white'
                        : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Status</div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'active', 'inactive', 'suspended'].map((status) => (
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
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover-glow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full gateway-dark-gradient flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Role and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {getStatusIcon(user.status)}
                      <span className="ml-1">{user.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Permissions</span>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        {permission}
                      </Badge>
                    ))}
                    {user.permissions.length > 3 && (
                      <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                        +{user.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Login</span>
                    <span className="text-white">{user.lastLogin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-white">{user.created}</span>
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
                  <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="hover-glow">
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
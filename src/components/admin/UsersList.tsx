import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { api } from '@/lib/api'

interface UserItem {
  id: string
  email: string
  role: 'ADMIN' | 'MERCHANT'
  is_active: boolean
  created_at: string
}

export function UsersList() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">User Management</h1>
        <p className="text-muted-foreground">
          Manage system administrators and merchant accounts.
        </p>
      </div>

      <Card className="hover-glow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button disabled>
              <Plus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-glow">
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} total
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((u) => (
                <Card key={u.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full gateway-dark-gradient flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white truncate max-w-[150px]">{u.email.split('@')[0]}</h3>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{u.email}</p>
                        </div>
                      </div>
                      <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {u.role}
                      </Badge>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Shield className="w-3 h-3 mr-2" />
                        <span>Status: </span>
                        <span className={`ml-1 font-medium ${u.is_active ? 'text-green-400' : 'text-red-400'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-2" />
                        <span>Joined: {new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button variant="glass" size="sm" className="h-8">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredUsers.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No users found matching your search.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Bell, Search, User, ChevronDown, Activity, Users, CreditCard, CheckCircle, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { api, GlobalSearchResponse, AdminNotification } from '@/lib/api'

export function AdminTopBar() {
  const { user, logout } = useAuth()
  
  // States
  const [stats, setStats] = useState({ active_merchants: 0, today_transactions: 0 })
  const [healthStatus, setHealthStatus] = useState('healthy')
  
  // Notifications
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<AdminNotification[]>([])

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GlobalSearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchQuickStats()
    fetchHealth()
    fetchUnreadCount()

    const interval = setInterval(() => {
      fetchQuickStats()
      fetchHealth()
      fetchUnreadCount()
    }, 30000)

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      clearInterval(interval)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      setShowSearch(false)
      return
    }

    const delay = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await api.globalSearch(searchQuery)
        setSearchResults(res)
        setShowSearch(true)
      } catch (e) {
        console.error(e)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [searchQuery])

  const fetchQuickStats = async () => {
    try {
      const res = await api.getAdminStats()
      setStats({ active_merchants: res.active_merchants, today_transactions: res.today_transactions })
    } catch (e) {}
  }

  const fetchHealth = async () => {
    try {
      const res = await api.getSystemHealth()
      setHealthStatus(res.status)
    } catch (e) {}
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await api.getUnreadNotificationsCount()
      setUnreadCount(res.count)
    } catch (e) {}
  }

  const handleOpenNotifications = async () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      try {
        const res = await api.getNotifications()
        setNotifications(res)
      } catch (e) {}
    }
  }

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.markNotificationAsRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
      fetchUnreadCount()
    } catch (e) {}
  }

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead()
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (e) {}
  }

  return (
    <header className="h-16 glass-card border-b border-amber-500/10 px-6 flex items-center justify-between relative z-[100] !overflow-visible">
      {/* Left side - Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search merchants, transactions, invoices..."
            className="pl-10 bg-white/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults) setShowSearch(true) }}
          />
        </div>

        {/* Search Dropdown */}
        {showSearch && searchResults && (
          <div className="absolute top-12 left-0 w-full max-h-96 overflow-y-auto glass-card border border-white/10 rounded-lg shadow-xl p-2 z-[110] animate-in fade-in slide-in-from-top-2">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Searching...</div>
            ) : (
              <>
                {searchResults.merchants.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Merchants</div>
                    {searchResults.merchants.map(m => (
                      <div key={m.id} className="p-2 hover:bg-white/10 rounded cursor-pointer transition-colors">
                        <div className="text-sm font-medium text-white">{m.name || 'Unnamed'}</div>
                        <div className="text-xs text-muted-foreground">{m.email} • {m.status}</div>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.transactions.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Transactions</div>
                    {searchResults.transactions.map(t => (
                      <div key={t.id} className="p-2 hover:bg-white/10 rounded cursor-pointer transition-colors flex justify-between items-center">
                        <div className="text-sm text-white truncate max-w-[150px]">{t.txid}</div>
                        <div className="text-xs font-medium text-green-400">${t.amount_usd.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.invoices.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Invoices</div>
                    {searchResults.invoices.map(i => (
                      <div key={i.id} className="p-2 hover:bg-white/10 rounded cursor-pointer transition-colors flex justify-between items-center">
                        <div className="text-sm text-white truncate max-w-[150px]">{i.address}</div>
                        <div className="text-xs font-medium text-white">{i.status}</div>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.merchants.length === 0 && searchResults.transactions.length === 0 && searchResults.invoices.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">No results found</div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side - Stats & User */}
      <div className="flex items-center space-x-4">
        {/* System Status */}
        <div className="flex items-center space-x-2 px-3 py-1 glass-card rounded-full">
          <div className={`w-2 h-2 rounded-full animate-pulse ${healthStatus === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className={`text-xs font-medium ${healthStatus === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`}>
            System {healthStatus === 'healthy' ? 'Online' : 'Degraded'}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-4 px-4 py-2 glass-card rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-white/80" />
            <div>
              <div className="text-xs text-muted-foreground">Active Merchants</div>
              <div className="text-sm font-semibold text-white">{stats.active_merchants}</div>
            </div>
          </div>
          <div className="w-px h-8 bg-amber-500/10"></div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-white/80" />
            <div>
              <div className="text-xs text-muted-foreground">Today's Transactions</div>
              <div className="text-sm font-semibold text-white">{stats.today_transactions}</div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <Button variant="ghost" size="icon" className="relative hover:bg-white/10" onClick={handleOpenNotifications}>
            <Bell className="w-5 h-5 text-white/80" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs shadow-lg shadow-red-500/50">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 max-h-96 flex flex-col glass-card border border-white/10 rounded-lg shadow-xl z-[110] animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <span className="font-semibold text-sm text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-lg text-sm flex items-start space-x-3 transition-colors ${n.is_read ? 'opacity-70 hover:bg-white/5' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="mt-0.5">
                        {n.is_read ? <CheckCircle className="w-4 h-4 text-green-500/50" /> : <Activity className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${n.is_read ? 'text-white/80' : 'text-white'}`}>{n.type}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</div>
                        <div className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                      {!n.is_read && (
                        <button onClick={(e) => markAsRead(n.id, e)} className="w-2 h-2 rounded-full bg-amber-500 group-hover:bg-amber-400 flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 px-3 py-2 glass-card rounded-lg cursor-pointer hover:bg-white/10 transition-colors outline-none border-none">
              <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white leading-tight">{user?.name}</div>
                <div className="text-xs text-muted-foreground leading-tight">Administrator</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role Switch (Hidden) */}
        {/* <Button 
          variant="glass" 
          size="sm"
          onClick={() => switchRole('merchant')}
        >
          Switch to Merchant
        </Button> */}
      </div>
    </header>
  )
}
import { Bell, Search, User, ChevronDown, Wallet, TrendingUp, Menu, X, CreditCard, Key, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { MobileUserMenu } from './MobileUserMenu'
import { useAuth } from '@/contexts/AuthContext'
import { useMerchantDashboard } from '@/hooks/useMerchantDashboard'
import { formatCurrency } from '@/lib/utils'

interface ResponsiveMerchantTopBarProps {
  onMenuClick?: () => void
  isMobile: boolean
}

export function ResponsiveMerchantTopBar({ onMenuClick, isMobile }: ResponsiveMerchantTopBarProps) {
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Shared data from singleton hook (no duplicate fetching)
  const { stats, revenue, isLoading } = useMerchantDashboard()

  // Desktop версия - оригинальная без изменений
  if (!isMobile) {
    return (
      <header className="h-16 glass-card border-b border-white/10 px-6 flex items-center justify-between z-[100] !overflow-visible">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 bg-white/5"
            />
          </div>
        </div>

        {/* Right side - Balance & User */}
        <div className="flex items-center space-x-4">
          {/* Account Status */}
          <div className="flex items-center space-x-2 px-3 py-1 glass-card rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Account Active</span>
          </div>

          {/* Quick Balance */}
          <div className="hidden md:flex items-center space-x-4 px-4 py-2 glass-card rounded-lg">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-white/80" />
              <div>
                <div className="text-xs text-muted-foreground">Available</div>
                <div className="text-sm font-semibold text-white">
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : formatCurrency(stats?.balance_available_usd || 0)}
                </div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-muted-foreground">Today's Revenue</div>
                <div className="text-sm font-semibold text-green-400">
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : formatCurrency(revenue?.total_revenue_usd || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3 px-3 py-2 glass-card rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-muted-foreground">Merchant</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </header>
    )
  }

  // Mobile версия - полностью адаптированная
  return (
    <>
      {/* Mobile TopBar */}
      <header className="h-14 glass-card border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-40">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="w-9 h-9 p-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">Merchant</h1>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 p-0"
          >
            <Search className="w-4 h-4" />
          </Button>

          <button 
            className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center"
            onClick={() => setUserMenuOpen(true)}
          >
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {/* Mobile Balance Bar */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold gradient-text">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : formatCurrency(stats?.balance_available_usd || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : formatCurrency(revenue?.total_revenue_usd || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              {revenue && revenue.change_percentage !== 0
                ? `${revenue.change_percentage > 0 ? '+' : ''}${revenue.change_percentage.toFixed(1)}%`
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchOpen(false)}
                className="w-9 h-9 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-white">Search</h2>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions, payments..."
                className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>

            {/* Quick Search Categories */}
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Quick search</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Transactions', icon: CreditCard, count: '1.2K' },
                  { label: 'Payments', icon: Wallet, count: '847' },
                  { label: 'Reports', icon: TrendingUp, count: '24' },
                  { label: 'API Keys', icon: Key, count: '3' },
                ].map((item) => (
                  <div key={item.label} className="p-4 glass-card rounded-lg cursor-pointer hover:bg-white/10 active:scale-95 transition-all">
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-white/80" />
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.count} items</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile User Menu */}
      <MobileUserMenu 
        isOpen={userMenuOpen}
        onClose={() => setUserMenuOpen(false)}
        type="merchant"
      />
    </>
  )
}
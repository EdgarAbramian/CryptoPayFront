import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  Key, 
  BarChart3, 
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import type { MerchantPage } from './MerchantApp'

interface MerchantSidebarProps {
  currentPage: MerchantPage
  onPageChange: (page: MerchantPage) => void
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as MerchantPage },
// { name: 'Balance', icon: Wallet, page: 'balance' as MerchantPage },
  { name: 'Transactions', icon: CreditCard, page: 'transactions' as MerchantPage },
  { name: 'API Keys', icon: Key, page: 'api-keys' as MerchantPage },
  { name: 'Reports', icon: BarChart3, page: 'reports' as MerchantPage },
  // { name: 'Settings', icon: Settings, page: 'settings' as MerchantPage },
]

export function MerchantSidebar({ currentPage, onPageChange }: MerchantSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <div className="w-64 glass-card m-4 rounded-xl border-r border-amber-500/10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-amber-500/10">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo3.png" 
              alt="Nexus PAY" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold gradient-text">Nexus PAY</h1>
              <p className="text-sm text-muted-foreground">Merchant Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-amber-500/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gateway-dark-gradient flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Merchant Account</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = currentPage === item.page
              return (
                <button
                  key={item.name}
                  onClick={() => onPageChange(item.page)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-out",
                    isActive
                      ? "gateway-dark-gradient text-white shadow-lg ring-1 ring-amber-500/30"
                      : "text-muted-foreground hover:text-white hover:bg-amber-500/5 hover:scale-[1.02]"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-white" : ""
                  )} />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Quick Balance */}
        {/*
        <div className="p-4 border-t border-amber-500/10">
          <div className="glass-card p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">$15,247.82</div>
              <div className="text-xs text-muted-foreground">Available Balance</div>
              <div className="mt-2 h-1 gateway-dark-gradient rounded-full"></div>
            </div>
          </div>
        </div>
        */}

        {/* Logout */}
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full justify-start text-muted-foreground hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
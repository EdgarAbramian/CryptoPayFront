import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  Wallet,
  Key,
  User,
  Shield,
  Server
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileBottomNavbarProps {
  currentPage: string
  onPageChange: (page: string) => void
  type: 'admin' | 'merchant'
}

export function MobileBottomNavbar({ currentPage, onPageChange, type }: MobileBottomNavbarProps) {
  const adminNavItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      color: 'text-purple-400'
    },
    { 
      id: 'merchants', 
      label: 'Merchants', 
      icon: Users,
      color: 'text-blue-400'
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: CreditCard,
      color: 'text-green-400'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3,
      color: 'text-orange-400'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      color: 'text-gray-400'
    }
  ]

  const merchantNavItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      color: 'text-purple-400'
    },
    { 
      id: 'balance', 
      label: 'Balance', 
      icon: Wallet,
      color: 'text-green-400'
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: CreditCard,
      color: 'text-blue-400'
    },
    { 
      id: 'api-keys', 
      label: 'API Keys', 
      icon: Key,
      color: 'text-orange-400'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      color: 'text-gray-400'
    }
  ]

  const navItems = type === 'admin' ? adminNavItems : merchantNavItems

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Compact background */}
      <div className="glass-card border-t border-purple-500/30 backdrop-blur-xl bg-black/90 px-1 py-2 safe-area-bottom">
        
        {/* Navigation Items */}
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            const IconComponent = item.icon
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 flex-1 max-w-[80px]",
                  isActive
                    ? ""
                    : "hover:bg-white/5"
                )}
              >
                {/* Compact Icon Container */}
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                  isActive
                    ? "gateway-dark-gradient shadow-md"
                    : "bg-white/5"
                )}>
                  <IconComponent 
                    className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive 
                        ? "text-white" 
                        : "text-white/70"
                    )} 
                  />
                </div>
                
                {/* Compact Label */}
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200 text-center truncate w-full",
                  isActive 
                    ? "text-white" 
                    : "text-white/60"
                )}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Extended version with more nav items (for when screen is wide enough)
export function MobileBottomNavbarExtended({ currentPage, onPageChange, type }: MobileBottomNavbarProps) {
  const adminExtendedItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, color: 'text-purple-400' },
    { id: 'merchants', label: 'Merchants', icon: Users, color: 'text-blue-400' },
    { id: 'transactions', label: 'Payments', icon: CreditCard, color: 'text-green-400' },
    { id: 'users', label: 'Users', icon: User, color: 'text-pink-400' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'text-orange-400' },
    { id: 'nodes', label: 'Nodes', icon: Server, color: 'text-cyan-400' },
  ]

  const merchantExtendedItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, color: 'text-purple-400' },
    { id: 'balance', label: 'Wallet', icon: Wallet, color: 'text-green-400' },
    { id: 'transactions', label: 'Payments', icon: CreditCard, color: 'text-blue-400' },
    { id: 'api-keys', label: 'API', icon: Key, color: 'text-orange-400' },
    { id: 'reports', label: 'Analytics', icon: BarChart3, color: 'text-pink-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
  ]

  const navItems = type === 'admin' ? adminExtendedItems : merchantExtendedItems

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background with enhanced blur */}
      <div className="absolute inset-0 glass-card border-t border-white/10 backdrop-blur-xl bg-black/20"></div>
      
      {/* Navigation Items - Scrollable for many items */}
      <div className="relative overflow-x-auto">
        <div className="flex items-center h-16 px-2 min-w-max">
          {navItems.map((item, index) => {
            const isActive = currentPage === item.id
            const IconComponent = item.icon
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-150 mx-1",
                  "min-w-[60px] max-w-[70px]",
                  isActive
                    ? "transform scale-110"
                    : "hover:bg-white/5 active:scale-95"
                )}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon Container with Enhanced Effects */}
                <div className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150",
                  isActive
                    ? "gateway-dark-gradient shadow-lg shadow-purple-500/25 scale-110"
                    : "bg-white/5 hover:bg-white/10"
                )}>
                  <IconComponent 
                    className={cn(
                      "w-4 h-4 transition-all duration-200",
                      isActive 
                        ? "text-white scale-110" 
                        : `${item.color} opacity-70 hover:opacity-100`
                    )} 
                  />
                  
                  {/* Active Pulse Effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl gateway-dark-gradient opacity-30 animate-ping"></div>
                  )}
                  
                  {/* Notification Badge (example for some items) */}
                  {(item.id === 'transactions' || item.id === 'merchants') && !isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {/* Label with Better Typography */}
                <span className={cn(
                  "text-xs font-medium transition-all duration-200 truncate leading-tight",
                  isActive 
                    ? "text-white font-semibold" 
                    : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                
                {/* Enhanced Active Indicator */}
                {isActive && (
                  <>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 gateway-dark-gradient rounded-t-full"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-white rounded-t-full animate-pulse"></div>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Safe Area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-transparent"></div>
    </div>
  )
}
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Shield,
  Server,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import type { AdminPage } from '../admin/AdminApp'

interface ResponsiveAdminSidebarProps {
  currentPage: AdminPage
  onPageChange: (page: AdminPage) => void
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as AdminPage },
  { name: 'Merchants', icon: Users, page: 'merchants' as AdminPage },
  { name: 'Transactions', icon: CreditCard, page: 'transactions' as AdminPage },
  { name: 'Reports', icon: BarChart3, page: 'reports' as AdminPage },
//  { name: 'Users', icon: Shield, page: 'users' as AdminPage },
  { name: 'Nodes', icon: Server, page: 'nodes' as AdminPage },
  { name: 'Settings', icon: Settings, page: 'settings' as AdminPage },
]

export function ResponsiveAdminSidebar({ 
  currentPage, 
  onPageChange, 
  isOpen, 
  onClose, 
  isMobile 
}: ResponsiveAdminSidebarProps) {
  const { user, logout, switchRole } = useAuth()

  const handlePageChange = (page: AdminPage) => {
    onPageChange(page)
    if (isMobile) {
      onClose()
    }
  }

  // Desktop версия - без изменений
  if (!isMobile) {
    return (
      <div className="w-64 glass-card m-4 rounded-xl border-r border-white/10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo3.png" 
                alt="Nexus PAY" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold gradient-text">Nexus PAY</h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full gateway-dark-gradient flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
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
                        ? "gateway-dark-gradient text-white shadow-lg"
                        : "text-muted-foreground hover:text-white hover:bg-white/5 hover:scale-[1.02]"
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

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
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

  // Mobile версия - идеальная адаптация
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[55] w-80 max-w-[85vw] glass-card border-r border-white/10 transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo3.png" 
                alt="Nexus PAY" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold gradient-text">Nexus PAY</h1>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full gateway-dark-gradient flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = currentPage === item.page
                return (
                  <button
                    key={item.name}
                    onClick={() => handlePageChange(item.page)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-200",
                      isActive
                        ? "gateway-dark-gradient text-white shadow-lg scale-[1.02]"
                        : "text-muted-foreground hover:text-white hover:bg-white/5 active:scale-[0.98]"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon className={cn(
                        "w-6 h-6 transition-colors",
                        isActive ? "text-white" : ""
                      )} />
                      <span className="text-base font-medium">{item.name}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white/80" : "text-muted-foreground"
                    )} />
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Mobile Role Switch */}
          <div className="p-4 border-t border-white/10">
            {/* <Button 
              variant="glass" 
              onClick={() => {
                switchRole('merchant')
                onClose()
              }}
              className="w-full justify-center mb-3"
            >
              Switch to Merchant
            </Button> */}
            
            <Button 
              variant="ghost" 
              onClick={() => {
                logout()
                onClose()
              }}
              className="w-full justify-start text-muted-foreground hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
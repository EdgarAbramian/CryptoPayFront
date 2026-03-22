import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Users, 
  Key, 
  Settings, 
  FileText,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Page } from '@/App'

interface SidebarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as Page },
  { name: 'Transactions', icon: CreditCard, page: 'transactions' as Page },
  { name: 'Analytics', icon: BarChart3, page: 'analytics' as Page },
  { name: 'Merchants', icon: Users, page: 'merchants' as Page },
  { name: 'API Keys', icon: Key, page: 'api-keys' as Page },
  { name: 'Settings', icon: Settings, page: 'settings' as Page },
  { name: 'Audit Log', icon: FileText, page: 'audit' as Page },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
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

        {/* Bottom Stats */}
        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">$2.4M</div>
              <div className="text-xs text-muted-foreground">Today's Volume</div>
              <div className="mt-2 h-1 gateway-dark-gradient rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
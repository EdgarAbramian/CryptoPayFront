import { Menu, Bell, Search, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

interface MobileTopBarProps {
  onMenuClick: () => void
  title: string
}

export function MobileTopBar({ onMenuClick, title }: MobileTopBarProps) {
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      {/* Main Mobile TopBar */}
      <header className="md:hidden h-14 glass-card border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-40">
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
          <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
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
          
          <Button variant="ghost" size="icon" className="relative w-9 h-9 p-0">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-xs">
              3
            </Badge>
          </Button>

          <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
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
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions, merchants..."
                className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>

            {/* Quick Search Results */}
            <div className="mt-6 space-y-3">
              <div className="text-sm text-muted-foreground">Recent searches</div>
              <div className="space-y-2">
                {['Transaction #12345', 'Merchant ABC Corp', 'API Keys'].map((item) => (
                  <div key={item} className="p-3 glass-card rounded-lg cursor-pointer hover:bg-white/10">
                    <div className="text-white">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
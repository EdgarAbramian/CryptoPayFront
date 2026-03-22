import { Bell, Search, User, ChevronDown, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function TopBar() {
  return (
    <header className="h-16 glass-card border-b border-white/10 px-6 flex items-center justify-between">
      {/* Left side - Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search transactions, merchants..."
            className="pl-10 bg-white/5"
          />
        </div>
      </div>

      {/* Right side - Status & User */}
      <div className="flex items-center space-x-4">
        {/* Live Status */}
        <div className="flex items-center space-x-2 px-3 py-1 glass-card rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>

        {/* Activity Stats */}
        <div className="hidden md:flex items-center space-x-4 px-4 py-2 glass-card rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-white/80" />
            <div>
              <div className="text-xs text-muted-foreground">TPS</div>
              <div className="text-sm font-semibold text-white">1,247</div>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div>
            <div className="text-xs text-muted-foreground">Active</div>
            <div className="text-sm font-semibold text-white">94.2%</div>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <div className="flex items-center space-x-3 px-3 py-2 glass-card rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-white">Admin User</div>
            <div className="text-xs text-muted-foreground">Super Admin</div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
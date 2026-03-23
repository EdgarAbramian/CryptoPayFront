import { useState, useEffect } from 'react'
import { 
  X, 
  User, 
  Settings, 
  Shield, 
  Key, 
  Bell, 
  Moon, 
  LogOut, 
  ChevronRight,
  Edit,
  HelpCircle,
  Star
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'

interface MobileUserMenuProps {
  isOpen: boolean
  onClose: () => void
  type: 'admin' | 'merchant'
}

export function MobileUserMenu({ isOpen, onClose, type }: MobileUserMenuProps) {
  const { user, logout, switchRole } = useAuth()
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const userInfo = {
    admin: {
      name: 'John Administrator',
      email: 'admin@nexuspay.com',
      role: 'System Administrator',
      badge: 'Admin',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    merchant: {
      name: 'Sarah Business',
      email: 'sarah@business.com',
      role: 'Merchant Account',
      badge: 'Pro',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const menuItems = [
    {
      icon: Edit,
      label: 'Edit Profile',
      description: 'Update your personal information',
      action: () => console.log('Edit Profile')
    },
    {
      icon: Key,
      label: 'Security',
      description: 'Password and 2FA settings',
      action: () => console.log('Security')
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage notification preferences',
      action: () => console.log('Notifications')
    },
    {
      icon: Settings,
      label: 'Preferences',
      description: 'App settings and customization',
      action: () => console.log('Preferences')
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      action: () => console.log('Help')
    }
  ]

  const currentUser = userInfo[type]

  // Блокируем скролл body при открытии
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-black/95 backdrop-blur-xl border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full gateway-dark-gradient flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{currentUser.name}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={currentUser.badgeColor}>
                  {currentUser.badge}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Online
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="text-center p-3 glass-card rounded-lg">
              <div className="text-lg font-bold gradient-text">
                {type === 'admin' ? '847' : '1,247'}
              </div>
              <div className="text-xs text-muted-foreground">
                {type === 'admin' ? 'Merchants' : 'Transactions'}
              </div>
            </div>
            <div className="text-center p-3 glass-card rounded-lg">
              <div className="text-lg font-bold gradient-text">99.2%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Card key={index} className="hover-glow cursor-pointer" onClick={item.action}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{item.label}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Settings Toggles */}
          <Card className="hover-glow">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-white/80" />
                  <div>
                    <span className="text-sm font-medium text-white">Dark Mode</span>
                    <p className="text-xs text-muted-foreground">Use dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-white/80" />
                  <div>
                    <span className="text-sm font-medium text-white">Push Notifications</span>
                    <p className="text-xs text-muted-foreground">Receive notifications</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Role Switch (Hidden) */}
          {/* <Button 
            variant="glass" 
            className="w-full justify-between"
            onClick={() => {
              switchRole(type === 'admin' ? 'merchant' : 'admin')
              onClose()
            }}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Switch to {type === 'admin' ? 'Merchant' : 'Admin'}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button> */}

          {/* Logout */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:bg-red-500/10"
            onClick={() => {
              logout()
              onClose()
            }}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
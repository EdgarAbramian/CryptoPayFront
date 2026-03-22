import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun,
  Smartphone,
  Mail,
  Key,
  Eye,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useState } from 'react'

export function MobileSettings() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false
  })
  
  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: false,
    sessionTimeout: true
  })

  const [preferences, setPreferences] = useState({
    darkMode: true,
    language: 'English',
    currency: 'USD',
    timezone: 'UTC-5'
  })

  const settingsCategories = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', icon: User, badge: null, action: 'profile' },
        { label: 'KYC Verification', icon: Shield, badge: 'Verified', action: 'kyc' },
        { label: 'Business Details', icon: CreditCard, badge: null, action: 'business' },
        { label: 'API Keys', icon: Key, badge: '3 Active', action: 'api' },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Password', icon: Lock, badge: null, action: 'password' },
        { label: 'Two-Factor Auth', icon: Smartphone, badge: 'Enabled', action: '2fa' },
        { label: 'Login History', icon: Eye, badge: null, action: 'history' },
        { label: 'Device Management', icon: Smartphone, badge: '3 Devices', action: 'devices' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', icon: Bell, toggle: 'push' },
        { label: 'Email Alerts', icon: Mail, toggle: 'email' },
        { label: 'SMS Notifications', icon: Smartphone, toggle: 'sms' },
        { label: 'Marketing Updates', icon: Globe, toggle: 'marketing' },
      ]
    },
    {
      title: 'Preferences',
      icon: Settings,
      items: [
        { label: 'Dark Mode', icon: Moon, toggle: 'darkMode' },
        { label: 'Language', icon: Globe, value: preferences.language, action: 'language' },
        { label: 'Currency', icon: CreditCard, value: preferences.currency, action: 'currency' },
        { label: 'Timezone', icon: Settings, value: preferences.timezone, action: 'timezone' },
      ]
    }
  ]

  const handleToggle = (category: string, key: string) => {
    if (category === 'notifications') {
      setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
    } else if (category === 'security') {
      setSecurity(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
    } else if (category === 'preferences') {
      setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
    }
  }

  const getToggleValue = (category: string, key: string) => {
    if (category === 'notifications') {
      return notifications[key as keyof typeof notifications]
    } else if (category === 'security') {
      return security[key as keyof typeof security]
    } else if (category === 'preferences') {
      return preferences[key as keyof typeof preferences]
    }
    return false
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* User Profile Card */}
      <Card className="hover-glow bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full gateway-dark-gradient flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">John Merchant</h2>
              <p className="text-sm text-muted-foreground">john@business.com</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Pro Account
                </Badge>
              </div>
            </div>
            <Button variant="glass" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Security Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">Account Secure</p>
                <p className="text-xs text-muted-foreground">All security features enabled</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-green-400">100%</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 glass-card rounded-lg">
              <Lock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Password</div>
              <div className="text-xs text-green-400">Strong</div>
            </div>
            <div className="text-center p-3 glass-card rounded-lg">
              <Smartphone className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">2FA</div>
              <div className="text-xs text-green-400">Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      {settingsCategories.map((category, categoryIndex) => (
        <Card key={category.title} className="hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <category.icon className="w-5 h-5" />
              <span>{category.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between p-3 glass-card rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    {item.value && (
                      <p className="text-xs text-muted-foreground">{item.value}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge className={`text-xs ${
                      item.badge === 'Verified' || item.badge === 'Enabled' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {item.badge}
                    </Badge>
                  )}
                  
                  {item.toggle ? (
                    <Switch
                      checked={getToggleValue(category.title.toLowerCase(), item.toggle)}
                      onCheckedChange={() => handleToggle(category.title.toLowerCase(), item.toggle!)}
                    />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Quick Actions */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <Lock className="w-5 h-5" />
              <span className="text-xs">Change Password</span>
            </Button>
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <Key className="w-5 h-5" />
              <span className="text-xs">Generate API Key</span>
            </Button>
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <Globe className="w-5 h-5" />
              <span className="text-xs">Language</span>
            </Button>
            <Button variant="glass" className="h-16 flex-col space-y-1">
              <Bell className="w-5 h-5" />
              <span className="text-xs">Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="hover-glow border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10">
            <Lock className="w-4 h-4 mr-3" />
            Deactivate Account
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10">
            <AlertTriangle className="w-4 h-4 mr-3" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  Shield, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit,
  Globe,
  Lock
} from 'lucide-react'
import { useState } from 'react'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  status: 'active' | 'inactive' | 'expired'
  created: string
  lastUsed: string
  usage: number
  limit: number
}

export function MobileApiKeys() {
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({})
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production API',
      key: 'npay_live_sk_1234567890abcdef',
      permissions: ['read', 'write', 'payments'],
      status: 'active',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      usage: 1247,
      limit: 10000
    },
    {
      id: '2',
      name: 'Development API',
      key: 'npay_test_sk_9876543210fedcba',
      permissions: ['read', 'write'],
      status: 'active',
      created: '2024-02-01',
      lastUsed: '1 day ago',
      usage: 456,
      limit: 5000
    },
    {
      id: '3',
      name: 'Webhook Handler',
      key: 'npay_live_wh_abcdef1234567890',
      permissions: ['webhooks'],
      status: 'inactive',
      created: '2024-01-10',
      lastUsed: '1 week ago',
      usage: 89,
      limit: 1000
    }
  ]

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Здесь можно добавить toast уведомление
  }

  const formatKey = (key: string, visible: boolean) => {
    if (!visible) {
      return '••••••••••••••••••••••••••••••••'
    }
    return key
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getUsagePercentage = (usage: number, limit: number) => {
    return Math.min((usage / limit) * 100, 100)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Create Button */}
      <Card className="hover-glow bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">API Keys</h2>
              <p className="text-sm text-muted-foreground">Manage your API access credentials</p>
            </div>
            <Button 
              variant="glass" 
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Key</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg gateway-dark-gradient flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold gradient-text">{apiKeys.length}</div>
            <div className="text-sm text-muted-foreground">Total Keys</div>
          </CardContent>
        </Card>

        <Card className="hover-glow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              {apiKeys.filter(k => k.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Keys</div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="hover-glow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      apiKey.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'
                    }`}>
                      <Key className={`w-5 h-5 ${
                        apiKey.status === 'active' ? 'text-green-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{apiKey.name}</h3>
                      <p className="text-xs text-muted-foreground">Created {apiKey.created}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(apiKey.status)}>
                      {apiKey.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* API Key Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Key</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="w-8 h-8"
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="w-8 h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                    <code className="text-sm text-green-400 font-mono break-all">
                      {formatKey(apiKey.key, showKeys[apiKey.id])}
                    </code>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Permissions</span>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Usage</span>
                    <span className="text-sm text-white">
                      {apiKey.usage.toLocaleString()} / {apiKey.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        getUsagePercentage(apiKey.usage, apiKey.limit) > 80 
                          ? 'bg-red-500' 
                          : getUsagePercentage(apiKey.usage, apiKey.limit) > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${getUsagePercentage(apiKey.usage, apiKey.limit)}%` }}
                    />
                  </div>
                </div>

                {/* Last Used */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last used</span>
                  <span className="text-white">{apiKey.lastUsed}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-white/10">
                  <Button variant="glass" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="glass" size="sm" className="flex-1">
                    <Shield className="w-4 h-4 mr-2" />
                    Permissions
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Notice */}
      <Card className="hover-glow border-yellow-500/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-yellow-400">Security Best Practices</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Never share your API keys publicly</li>
                <li>• Rotate keys regularly for better security</li>
                <li>• Use different keys for different environments</li>
                <li>• Monitor usage patterns for anomalies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate New Key FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          className="w-14 h-14 rounded-full gateway-dark-gradient shadow-2xl hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
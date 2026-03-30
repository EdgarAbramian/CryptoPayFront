import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { copyToClipboard } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  MoreVertical, 
  Calendar,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Check,
  Globe, 
  ExternalLink
} from 'lucide-react'

export function ApiKeys() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  // Admin state (mock)
  const [newKeyName, setNewKeyName] = useState('')
  const [keys, setKeys] = useState<any[]>([
    {
      id: '1',
      name: 'Main Production Key',
      key: 'pk_live_51H7d...',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      status: 'active',
      permissions: ['read', 'write', 'admin'],
    }
  ])

  const handleRotateMerchantKey = async () => {
    if (!confirm('Are you sure? Your old API key will stop working immediately.')) return
    
    setIsRotating(true)
    try {
      const res = await api.rotateMyApiKey()
      setNewApiKey(res.api_key)
      setVisible(true)
      toast({
        title: "API Key Rotated",
        description: "New key generated successfully",
      })
    } catch (error) {
      toast({
        title: "Rotation Failed",
        variant: "destructive"
      })
    } finally {
      setIsRotating(false)
    }
  }

  const handleCopy = (text: string) => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "API Key copied to clipboard",
    })
  }

  if (user?.role === 'merchant') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">API Integration</h1>
          <p className="text-muted-foreground">
            Manage your merchant API key for server-to-server integration.
          </p>
        </div>

        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Integration Key</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This key grants full access to your merchant account via the API.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 glass-card rounded-xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Secret API Key</div>
                    <div className="text-xs text-muted-foreground">Expires: Never (until rotated)</div>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-2 p-4 bg-black/40 border border-white/10 rounded-lg">
                  <code className="flex-1 text-sm font-mono text-purple-300 break-all">
                    {visible && newApiKey ? newApiKey : (newApiKey ? '••••••••••••••••••••' : 'sk_live_••••••••••••••••••••••••••••••••')}
                  </code>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setVisible(!visible)}>
                      {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {newApiKey && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(newApiKey)}>
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-amber-500 font-medium">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Never share this key in client-side code
                </div>
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={handleRotateMerchantKey}
                  disabled={isRotating}
                >
                  {isRotating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Rotate Key
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Documentation</h4>
              <a
                href="https://cryptantus.com/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 glass-card rounded-lg hover:bg-white/5 border border-white/5 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">API Reference</span>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin View (Previous)
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">System API Keys (Admin)</h1>
        <p className="text-muted-foreground">
          Manage system-level API keys for Nexus PAY infrastructure.
        </p>
      </div>

      <Card className="hover-glow">
        <CardHeader>
          <CardTitle>Keys List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">Admin-level key management is restricted. Use the backend configuration for production keys.</p>
        </CardContent>
      </Card>
    </div>
  )
}
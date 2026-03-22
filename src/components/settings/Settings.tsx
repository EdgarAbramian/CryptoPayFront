import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  Save,
  RefreshCw,
  Key,
  Globe,
  Loader2,
  Copy,
  Check
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

export function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Local state for merchant form
  const [merchantName, setMerchantName] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    if (user?.role === 'merchant') {
      fetchMerchantProfile()
    }
  }, [user])

  async function fetchMerchantProfile() {
    setIsLoading(true)
    try {
      const data = await api.getMerchantProfile()
      setProfile(data)
      setMerchantName(data.name || '')
      setWebhookUrl(data.webhook_url || '')
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMerchant = async () => {
    setIsSaving(true)
    try {
      await api.updateMerchantProfile({
        name: merchantName,
        webhook_url: webhookUrl
      })
      toast({
        title: "Profile Updated",
        description: "Your merchant settings have been saved",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRotateKey = async () => {
    if (!confirm('Are you sure? Your old API key will stop working immediately.')) return
    
    try {
      const res = await api.rotateMyApiKey()
      setApiKey(res.api_key)
      toast({
        title: "New API Key Generated",
        description: "Please copy it now, it won't be shown again.",
      })
    } catch (error) {
      toast({
        title: "Rotation Failed",
        variant: "destructive"
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "API Key copied to clipboard",
    })
  }

  if (user?.role === 'merchant') {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
        </div>
      )
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Merchant Settings</h1>
          <p className="text-muted-foreground">
            Manage your merchant profile, webhooks, and API keys.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>Basic Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-white">Merchant Name</label>
                <Input 
                  value={merchantName} 
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="mt-2" 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-white">Contact Email</label>
                <Input value={profile?.email || ''} disabled className="mt-2 opacity-50" />
                <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed manually. Contact support.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-white">Current Tier</label>
                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-amber-400 font-bold">{profile?.tier || 'BRONZE'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-white">Webhook URL</label>
                <Input 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-api.com/webhooks/nexus"
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  We'll send POST requests to this URL for invoice updates.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-white">API Key (Dash Integration)</label>
                <div className="mt-2 space-y-3">
                  {apiKey ? (
                    <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                      <code className="flex-1 text-xs text-green-400 break-all">{apiKey}</code>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyToClipboard(apiKey)}>
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-muted-foreground italic">
                      API key is hidden for security. Use rotate to generate a new one.
                    </div>
                  )}
                  <Button variant="glass" className="w-full" onClick={handleRotateKey}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Rotate API Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={handleSaveMerchant} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Profile Settings
          </Button>
        </div>
      </div>
    )
  }

  // Admin View (Previous)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const handleSaveAdmin = () => {
    toast({
      title: "Settings Saved",
      description: "Admin settings updated",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">System Settings (Admin)</h1>
        <p className="text-muted-foreground">
          Configure global Nexus PAY system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white">Platform Name</label>
              <Input defaultValue="Nexus PAY" className="mt-2" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-white">Support Email</label>
              <Input defaultValue="support@nexuspay.com" className="mt-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Temporarily disable the platform</p>
              </div>
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button onClick={handleSaveAdmin}>
          <Save className="w-4 h-4 mr-2" />
          Save Global Settings
        </Button>
      </div>
    </div>
  )
}
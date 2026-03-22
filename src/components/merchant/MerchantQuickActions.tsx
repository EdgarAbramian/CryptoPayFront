import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Download, FileText, CreditCard, Webhook, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { TestPaymentModal } from './TestPaymentModal'
import { WebhookModal } from './WebhookModal'
import { ApiKeyModal } from './ApiKeyModal'

export function MerchantQuickActions() {
  const { toast } = useToast()
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleGenerateKey = async () => {
    if (!confirm('This will invalidate your current API Key. Continue?')) return
    
    setIsLoading('key')
    try {
      const { api_key } = await api.rotateMyApiKey()
      
      // Update local storage for immediate use in future requests
      localStorage.setItem('merchant-api-key', api_key)
      
      const storedUser = localStorage.getItem('nexus-user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        user.apiKey = api_key
        localStorage.setItem('nexus-user', JSON.stringify(user))
      }

      setNewApiKey(api_key)
      setIsApiKeyModalOpen(true)
      toast({
        title: 'New API Key Generated',
        description: 'Successfully rotated your API keys.',
      })
    } catch (error: any) {
      toast({
        title: 'Action Failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleDownloadReport = async () => {
    setIsLoading('report')
    try {
      const blob = await api.exportMerchantTransactions({}, 'xlsx')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast({ title: 'Report Downloaded' })
    } catch (error: any) {
      toast({
        title: 'Download Failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleWebhookSetup = () => {
    setIsWebhookModalOpen(true)
  }

  return (
    <Card className="hover-glow">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Common tasks and shortcuts for your account
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Button 
            variant="glass" 
            className="flex flex-col h-20 space-y-2"
            onClick={handleGenerateKey}
            disabled={isLoading === 'key'}
          >
            {isLoading === 'key' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
            <span className="text-xs">Generate API Key</span>
          </Button>
          
          <Button 
            variant="glass" 
            className="flex flex-col h-20 space-y-2"
            onClick={handleDownloadReport}
            disabled={isLoading === 'report'}
          >
            {isLoading === 'report' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            <span className="text-xs">Download Report</span>
          </Button>
          
          <Button variant="glass" className="flex flex-col h-20 space-y-2">
            <FileText className="w-5 h-5" />
            <span className="text-xs">View Documentation</span>
          </Button>
          
          <Button 
            variant="glass" 
            className="flex flex-col h-20 space-y-2"
            onClick={() => setIsTestModalOpen(true)}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">Test Payment</span>
          </Button>
          
          <Button 
            variant="glass" 
            className="flex flex-col h-20 space-y-2"
            onClick={handleWebhookSetup}
          >
            <Webhook className="w-5 h-5" />
            <span className="text-xs">Setup Webhook</span>
          </Button>
          
          {/* 
          <Button variant="glass" className="flex flex-col h-20 space-y-2">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Account Settings</span>
          </Button> 
          */}
        </div>
      </CardContent>

      <TestPaymentModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
      />

      <WebhookModal 
        isOpen={isWebhookModalOpen} 
        onClose={() => setIsWebhookModalOpen(false)} 
      />

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        apiKey={newApiKey}
        onClose={() => {
          setIsApiKeyModalOpen(false)
          setNewApiKey(null)
        }} 
      />
    </Card>
  )
}
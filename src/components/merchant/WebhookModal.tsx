import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Globe } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

interface WebhookModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WebhookModal({ isOpen, onClose }: WebhookModalProps) {
  const { toast } = useToast()
  const [url, setUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCurrentWebhook()
    }
  }, [isOpen])

  const fetchCurrentWebhook = async () => {
    setIsLoading(true)
    try {
      const profile = await api.getMerchantProfile()
      setUrl(profile.webhook_url || '')
    } catch (error) {
      console.error('Failed to fetch webhook:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (url && !url.startsWith('http')) {
      toast({
        title: 'Invalid URL',
        description: 'Webhook URL must start with http:// or https://',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      await api.updateMerchantProfile({ webhook_url: url || null })
      toast({
        title: 'Webhook Updated',
        description: 'Your webhook settings have been saved successfully.',
      })
      onClose()
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-amber-500" />
            <span>Setup Webhook</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook Endpoint URL</Label>
            <div className="relative">
              <Input
                id="webhook-url"
                placeholder="https://your-api.com/webhook"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-background/50"
                disabled={isLoading || isSaving}
              />
              {isLoading && (
                <div className="absolute right-3 top-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              We will send POST requests to this URL for all transaction status updates.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            className="gateway-dark-gradient" 
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

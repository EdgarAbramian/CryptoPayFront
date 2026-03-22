import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Key, Copy, Check, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ApiKeyModalProps {
  apiKey: string | null
  isOpen: boolean
  onClose: () => void
}

export function ApiKeyModal({ apiKey, isOpen, onClose }: ApiKeyModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    toast({ title: 'Copied to clipboard' })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-amber-500" />
            <span>New API Key Generated</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">
              Please copy and save this key now. For security reasons, <strong>we will not show it to you again.</strong>
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="relative group">
              <div className="p-3 bg-muted/50 rounded-md font-mono text-sm break-all pr-12 min-h-[3rem] border border-white/5 group-hover:border-amber-500/30 transition-colors">
                {apiKey || 'Generating...'}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-10 w-10 hover:bg-amber-500/20"
                onClick={handleCopy}
                disabled={!apiKey}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full gateway-dark-gradient" onClick={onClose}>
            I have saved the key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

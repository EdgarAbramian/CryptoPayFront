import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react'

const integrations = [
  {
    name: 'API Integration',
    status: 'active',
    description: 'REST API endpoints configured',
    lastChecked: '2 minutes ago',
  },
  {
    name: 'Webhook Endpoint',
    status: 'active',
    description: 'Receiving transaction notifications',
    lastChecked: '5 minutes ago',
  },
  {
    name: 'Payment Widget',
    status: 'pending',
    description: 'JavaScript widget not implemented',
    lastChecked: '1 hour ago',
  },
  {
    name: 'Test Environment',
    status: 'error',
    description: 'Connection timeout',
    lastChecked: '15 minutes ago',
  },
]

const statusConfig = {
  active: { color: 'success', icon: CheckCircle, bgColor: 'bg-green-500/10' },
  pending: { color: 'warning', icon: Clock, bgColor: 'bg-yellow-500/10' },
  error: { color: 'destructive', icon: AlertCircle, bgColor: 'bg-red-500/10' },
}

export function MerchantIntegrationStatus() {
  return (
    <Card className="hover-glow">
      <CardHeader>
        <CardTitle>Integration Status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monitor your payment integration health
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => {
            const StatusIcon = statusConfig[integration.status as keyof typeof statusConfig].icon
            
            return (
              <div
                key={integration.name}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  statusConfig[integration.status as keyof typeof statusConfig].bgColor
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-5 h-5 ${
                      integration.status === 'active' ? 'text-green-500' :
                      integration.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-white">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last checked: {integration.lastChecked}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={statusConfig[integration.status as keyof typeof statusConfig].color as any}
                      className="capitalize"
                    >
                      {integration.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <Button className="w-full">
            View Integration Documentation
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
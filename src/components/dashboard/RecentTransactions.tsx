import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react'
import { api, RecentTransaction } from '@/lib/api'

const statusConfig = {
  CONFIRMED: { color: 'success', icon: CheckCircle },
  PENDING: { color: 'warning', icon: Clock },
  FAILED: { color: 'destructive', icon: XCircle }
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<RecentTransaction[]>([])

  const fetchRecent = async () => {
    try {
      const data = await api.getRecentTransactions(5)
      setTransactions(data)
    } catch(err) {
      console.error('Failed to fetch recent transactions', err)
    }
  }

  useEffect(() => {
    fetchRecent()
    const intv = setInterval(fetchRecent, 20000)
    return () => clearInterval(intv)
  }, [])

  return (
    <Card className="hover-glow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest payment gateway activity
          </p>
        </div>
        <Button variant="glass" size="sm">
          View All
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => {
            const config = statusConfig[tx.status as keyof typeof statusConfig] || { color: 'default', icon: Clock }
            const StatusIcon = config.icon
            
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      TX
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{tx.merchant_name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">
                      {tx.txid.substring(0, 8)}... • {tx.confirmed_at ? new Date(tx.confirmed_at).toLocaleTimeString() : 'Pending'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {formatCurrency(tx.amount_usd)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      USD
                    </div>
                  </div>
                  
                  <Badge
                    variant={config.color as any}
                    className="flex items-center space-x-1"
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span className="capitalize">{tx.status}</span>
                  </Badge>
                </div>
              </div>
            )
          })}
          {transactions.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No recent transactions.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
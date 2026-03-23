import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ExternalLink, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

const statusConfig = {
  completed: { color: 'success', icon: CheckCircle },
  pending: { color: 'warning', icon: Clock },
  failed: { color: 'destructive', icon: XCircle },
}

export function MerchantRecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await api.getMerchantTransactions({ limit: 5 })
        setTransactions(data)
      } catch (error) {
        console.error('Failed to fetch merchant transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  return (
    <Card className="hover-glow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest payment activity
          </p>
        </div>
        <Button variant="glass" size="sm">
          View All
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => {
              const status = (tx.status?.toLowerCase() || 'pending') as keyof typeof statusConfig
              const config = statusConfig[status] || statusConfig.pending
              const StatusIcon = config.icon
              
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                      <span className="text-xs font-bold text-white uppercase">
                        {tx.coin_symbol}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white truncate max-w-[150px]" title={tx.txid}>
                        {tx.txid.slice(0, 8)}...{tx.txid.slice(-8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {formatCurrency(parseFloat(String(tx.amount_usd || tx.amount || tx.amount_received || '0')))}
                      </div>
                      <div className="text-sm text-muted-foreground uppercase">
                        via {tx.coin_symbol}
                      </div>
                    </div>
                    
                    <Badge
                      variant={config.color as any}
                      className="flex items-center space-x-1"
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{status}</span>
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
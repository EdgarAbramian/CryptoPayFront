import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Crown } from 'lucide-react'
import { api, TopMerchant } from '@/lib/api'

export function TopMerchants() {
  const [merchants, setMerchants] = useState<TopMerchant[]>([])

  const fetchMerchants = async () => {
    try {
      const data = await api.getTopMerchants('month', 5)
      setMerchants(data)
    } catch(err) {
      console.error('Failed to fetch top merchants', err)
    }
  }

  useEffect(() => {
    fetchMerchants()
  }, [])

  return (
    <Card className="hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span>Top Merchants</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Highest performing merchants this month
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {merchants.map((merchant, index) => (
            <div
              key={merchant.id}
              className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center text-sm font-bold text-white">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{merchant.name || 'Unnamed'}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(merchant.transaction_count)} transactions
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-white">
                    {formatCurrency(merchant.total_volume_usd)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {merchants.length === 0 && (
             <div className="p-4 text-center text-muted-foreground">No merchants found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
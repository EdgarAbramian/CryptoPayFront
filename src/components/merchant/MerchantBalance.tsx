import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Wallet, ArrowUpRight, ArrowDownLeft, Download, Eye, Coins, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

interface MerchantBalanceProps {
  onNavigate?: (page: string) => void;
}

export function MerchantBalance({ onNavigate }: MerchantBalanceProps = {}) {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.getMerchantProfile()
        setProfile(data)
      } catch (error) {
        console.error('Failed to fetch merchant profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleCryptoWalletsClick = () => {
    if (onNavigate) {
      onNavigate('crypto-wallets');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const balances = profile?.balances || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Balance & Wallet</h1>
        <p className="text-muted-foreground">
          Monitor your account balances and transaction history.
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {balances.map((balance: any) => (
          <Card key={balance.coin_symbol} className="hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <Badge variant="glass">{balance.coin_symbol}</Badge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold gradient-text">
                    {formatNumber(balance.amount_available)}
                  </p>
                </div>
                
                {parseFloat(balance.amount_locked) > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Locked / Pending</p>
                    <p className="text-sm text-yellow-400">
                      {formatNumber(balance.amount_locked)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {balances.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground glass-card rounded-xl">
            No active balances found.
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="hover-glow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Button 
              variant="default" 
              className="h-16 flex flex-col space-y-2"
              onClick={handleCryptoWalletsClick}
            >
              <Coins className="w-5 h-5" />
              <span>Crypto Wallets</span>
            </Button>
            <Button variant="glass" className="h-16 flex flex-col space-y-2">
              <ArrowDownLeft className="w-5 h-5" />
              <span>Withdraw</span>
            </Button>
            <Button variant="glass" className="h-16 flex flex-col space-y-2">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </Button>
            <Button variant="glass" className="h-16 flex flex-col space-y-2">
              <Eye className="w-5 h-5" />
              <span>View History</span>
            </Button>
            <Button 
              variant="glass" 
              className="h-16 flex flex-col space-y-2"
              onClick={() => onNavigate?.('settings')}
            >
              <Wallet className="w-5 h-5" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
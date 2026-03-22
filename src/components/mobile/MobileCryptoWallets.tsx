import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CryptoWallet } from '@/types/crypto'
import { formatCryptoAmount } from '@/lib/crypto-utils'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy,
  RefreshCw,
  ChevronRight
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// Mock данные для примера
const mockWallets: CryptoWallet[] = [
  {
    currency: 'BTC',
    symbol: 'Bitcoin',
    balance: 0.45234567,
    pendingBalance: 0.00123456,
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin',
  },
  {
    currency: 'ETH',
    symbol: 'Ethereum',
    balance: 3.85671234,
    pendingBalance: 0.12345678,
    address: '0x742d35Cc6634C0532925a3b8D2482fC0C8d8c',
    network: 'Ethereum',
  },
  {
    currency: 'USDT',
    symbol: 'Tether',
    balance: 2847.92345678,
    pendingBalance: 150.0,
    address: '0x742d35Cc6634C0532925a3b8D2482fC0C8d8c',
    network: 'ERC-20',
  }
]

export function MobileCryptoWallets() {
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet>(mockWallets[0])
  const { toast } = useToast()

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy address",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Crypto Wallets</h1>
        <p className="text-sm text-muted-foreground">
          Manage your cryptocurrency deposits and withdrawals
        </p>
      </div>

      {/* Wallet Cards */}
      <div className="space-y-3">
        {mockWallets.map((wallet) => (
          <Card 
            key={wallet.currency}
            className={`cursor-pointer transition-all ${
              selectedWallet.currency === wallet.currency 
                ? 'ring-2 ring-blue-500 bg-blue-500/10' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => setSelectedWallet(wallet)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg crypto-wallet-icon">
                    <span className="text-sm font-bold">
                      {wallet.currency.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{wallet.currency}</p>
                    <p className="text-xs text-muted-foreground">{wallet.symbol}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {wallet.network}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-white">
                    {formatCryptoAmount(wallet.balance, wallet.currency)}
                  </p>
                  {wallet.pendingBalance > 0 && (
                    <p className="text-xs text-yellow-400">
                      +{formatCryptoAmount(wallet.pendingBalance, wallet.currency)} pending
                    </p>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Wallet Details */}
      <Card className="crypto-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg crypto-wallet-icon">
                <span className="text-sm font-bold">
                  {selectedWallet.currency.slice(0, 2)}
                </span>
              </div>
              <span>{selectedWallet.currency} Wallet</span>
            </CardTitle>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Balance Display */}
          <div className="crypto-balance-card">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-xl font-bold gradient-text">
                {formatCryptoAmount(selectedWallet.balance, selectedWallet.currency)}
              </p>
              
              {selectedWallet.pendingBalance > 0 && (
                <div className="pt-2 border-t border-slate-600">
                  <p className="text-xs text-muted-foreground">Pending Balance</p>
                  <p className="text-sm font-semibold text-yellow-400">
                    {formatCryptoAmount(selectedWallet.pendingBalance, selectedWallet.currency)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">
              Wallet Address ({selectedWallet.network})
            </p>
            <div className="flex items-center space-x-2 p-3 crypto-address rounded-lg">
              <code className="flex-1 text-xs break-all">
                {selectedWallet.address}
              </code>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyAddress(selectedWallet.address)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit" className="flex items-center space-x-2">
                <ArrowDownLeft className="w-4 h-4" />
                <span>Deposit</span>
              </TabsTrigger>
              <TabsTrigger value="withdrawal" className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deposit" className="mt-4">
              <Card className="crypto-deposit-form">
                <CardContent className="p-4 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-xl crypto-wallet-icon">
                    <ArrowDownLeft className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-white">Receive {selectedWallet.currency}</h3>
                  <p className="text-sm text-muted-foreground">
                    Send {selectedWallet.currency} to your wallet address above
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      • Minimum deposit: 0.001 {selectedWallet.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      • Requires 3-12 confirmations
                    </p>
                    <p className="text-xs text-muted-foreground">
                      • Processing time: 15-30 minutes
                    </p>
                  </div>
                  <Button className="w-full">
                    View Full Deposit Form
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="withdrawal" className="mt-4">
              <Card className="crypto-withdrawal-form">
                <CardContent className="p-4 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-xl crypto-wallet-icon bg-gradient-to-r from-red-500 to-orange-500">
                    <ArrowUpRight className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-white">Send {selectedWallet.currency}</h3>
                  <p className="text-sm text-muted-foreground">
                    Available: {formatCryptoAmount(selectedWallet.balance, selectedWallet.currency)}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      • Minimum withdrawal: 0.01 {selectedWallet.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      • Network fee applies
                    </p>
                    <p className="text-xs text-muted-foreground">
                      • Processing time: 30-60 minutes
                    </p>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Full Withdrawal Form
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Security Notice */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-400 font-medium mb-1">Security Notice</p>
            <p className="text-xs text-muted-foreground">
              Always verify addresses before sending. Cryptocurrency transactions are irreversible.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
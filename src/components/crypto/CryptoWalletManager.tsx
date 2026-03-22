import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DepositForm } from './DepositForm'
import { WithdrawalForm } from './WithdrawalForm'
import { TransactionStatus } from './TransactionStatus'
import { CryptoWallet, CryptoTransaction } from '@/types/crypto'
import { formatCurrency } from '@/lib/utils'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  QrCode,
  RefreshCw,
  TrendingUp,
  TrendingDown
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
    iconUrl: '/crypto-icons/btc.svg'
  },
  {
    currency: 'ETH',
    symbol: 'Ethereum',
    balance: 3.85671234,
    pendingBalance: 0.12345678,
    address: '0x742d35Cc6634C0532925a3b8D2482fC0C8d8c',
    network: 'Ethereum',
    iconUrl: '/crypto-icons/eth.svg'
  },
  {
    currency: 'USDT',
    symbol: 'Tether',
    balance: 2847.92345678,
    pendingBalance: 150.0,
    address: '0x742d35Cc6634C0532925a3b8D2482fC0C8d8c',
    network: 'ERC-20',
    iconUrl: '/crypto-icons/usdt.svg'
  },
  {
    currency: 'USDC',
    symbol: 'USD Coin',
    balance: 1234.56789012,
    pendingBalance: 0.0,
    address: '0x742d35Cc6634C0532925a3b8D2482fC0C8d8c',
    network: 'ERC-20',
    iconUrl: '/crypto-icons/usdc.svg'
  }
]

const mockTransactions: CryptoTransaction[] = [
  {
    id: 'tx_001',
    type: 'deposit',
    currency: 'BTC',
    amount: 0.00123456,
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    txHash: '5f8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3e2d1c0b9a8f7e6d5c4b3a2e1d0c9b8a7',
    status: 'confirming',
    confirmations: 2,
    requiredConfirmations: 3,
    fee: 0.00001,
    timestamp: '2024-01-20T14:30:00Z',
    estimatedTime: 15
  },
  {
    id: 'tx_002',
    type: 'withdrawal',
    currency: 'ETH',
    amount: 0.5,
    address: '0x742d35Cc6634C0532925a3b8D2482fC0C8d8c',
    txHash: '0x9a8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6',
    status: 'PENDING',
    confirmations: 0,
    requiredConfirmations: 12,
    fee: 0.002,
    timestamp: '2024-01-20T13:45:00Z',
    estimatedTime: 25
  }
]

export function CryptoWalletManager() {
  const [activeWallet, setActiveWallet] = useState<CryptoWallet>(mockWallets[0])
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal'>('deposit')
  const [showTransactionStatus, setShowTransactionStatus] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<CryptoTransaction | null>(null)
  const { toast } = useToast()

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Address copied!",
        description: "Wallet address has been copied to clipboard",
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleTransactionSubmit = (transaction: CryptoTransaction) => {
    setCurrentTransaction(transaction)
    setShowTransactionStatus(true)
  }

  const calculateTotalBalance = (wallet: CryptoWallet) => {
    return wallet.balance + wallet.pendingBalance
  }

  const formatCryptoAmount = (amount: number, currency: string) => {
    if (currency === 'USDT' || currency === 'USDC') {
      return `$${amount.toFixed(2)}`
    }
    return `${amount.toFixed(8)} ${currency}`
  }

  if (showTransactionStatus && currentTransaction) {
    return (
      <TransactionStatus
        transaction={currentTransaction}
        onClose={() => {
          setShowTransactionStatus(false)
          setCurrentTransaction(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Crypto Wallets</h1>
        <p className="text-muted-foreground">
          Manage your cryptocurrency deposits and withdrawals
        </p>
      </div>

      {/* Wallet Selection */}
      <Card className="hover-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Select Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockWallets.map((wallet) => (
              <Card
                key={wallet.currency}
                className={`cursor-pointer transition-all hover:scale-105 ${activeWallet.currency === wallet.currency
                    ? 'ring-2 ring-blue-500 bg-blue-500/10'
                    : 'hover:bg-muted/50'
                  }`}
                onClick={() => setActiveWallet(wallet)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full gateway-dark-gradient flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {wallet.currency.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{wallet.currency}</p>
                        <p className="text-xs text-muted-foreground">{wallet.symbol}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {wallet.network}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="font-semibold text-sm">
                        {formatCryptoAmount(wallet.balance, wallet.currency)}
                      </p>
                    </div>

                    {wallet.pendingBalance > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                        <p className="text-xs text-yellow-400">
                          {formatCryptoAmount(wallet.pendingBalance, wallet.currency)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Wallet Details */}
      <Card className="hover-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg gateway-dark-gradient flex items-center justify-center">
                <span className="text-white font-bold">
                  {activeWallet.currency.slice(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">
                  {activeWallet.currency} Wallet
                </h3>
                <p className="text-muted-foreground">{activeWallet.symbol}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Balance Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold gradient-text">
                {formatCryptoAmount(activeWallet.balance, activeWallet.currency)}
              </p>
            </div>

            {activeWallet.pendingBalance > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending Balance</p>
                <p className="text-xl font-semibold text-yellow-400">
                  {formatCryptoAmount(activeWallet.pendingBalance, activeWallet.currency)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-xl font-semibold text-white">
                {formatCryptoAmount(calculateTotalBalance(activeWallet), activeWallet.currency)}
              </p>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Wallet Address ({activeWallet.network})</p>
            <div className="flex items-center space-x-2 p-3 glass-card rounded-lg">
              <code className="flex-1 text-sm font-mono text-white break-all">
                {activeWallet.address}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyAddress(activeWallet.address)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit/Withdrawal Forms */}
      <Card className="hover-glow">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'deposit' | 'withdrawal')}>
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit" className="flex items-center space-x-2">
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Deposit</span>
                </TabsTrigger>
                <TabsTrigger value="withdrawal" className="flex items-center space-x-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Withdrawal</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="deposit" className="p-6 pt-4">
              <DepositForm
                wallet={activeWallet}
                onSubmit={handleTransactionSubmit}
              />
            </TabsContent>

            <TabsContent value="withdrawal" className="p-6 pt-4">
              <WithdrawalForm
                wallet={activeWallet}
                onSubmit={handleTransactionSubmit}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="hover-glow">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest deposits and withdrawals
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.filter(tx => tx.currency === activeWallet.currency).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 glass-card rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                    {transaction.type === 'deposit' ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white capitalize">
                      {transaction.type}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.txHash ?
                        `${transaction.txHash.slice(0, 10)}...${transaction.txHash.slice(-10)}` :
                        'Processing...'
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}
                    {formatCryptoAmount(transaction.amount, transaction.currency)}
                  </div>
                  <Badge
                    variant={
                      transaction.status === 'completed' ? 'success' :
                        transaction.status === 'failed' ? 'destructive' :
                          'warning'
                    }
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {transaction.confirmations}/{transaction.requiredConfirmations} confirmations
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
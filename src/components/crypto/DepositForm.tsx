import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CryptoWallet, CryptoTransaction, CryptoCurrency, CryptoNetwork } from '@/types/crypto'
import { Copy, QrCode, AlertCircle, Info, Wallet } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatCryptoAmount } from '@/lib/crypto-utils'

// Mock данные для поддерживаемых криптовалют
const supportedCurrencies: CryptoCurrency[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    iconUrl: '/crypto-icons/btc.svg',
    minDeposit: 0.0001,
    minWithdrawal: 0.001,
    networks: [
      {
        network: 'Bitcoin',
        name: 'Bitcoin Network',
        withdrawalFee: 0.0005,
        minConfirmations: 3,
        isEnabled: true
      }
    ]
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    iconUrl: '/crypto-icons/eth.svg',
    minDeposit: 0.001,
    minWithdrawal: 0.01,
    networks: [
      {
        network: 'Ethereum',
        name: 'Ethereum Network',
        withdrawalFee: 0.002,
        minConfirmations: 12,
        isEnabled: true
      }
    ]
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    iconUrl: '/crypto-icons/usdt.svg',
    minDeposit: 1,
    minWithdrawal: 10,
    networks: [
      {
        network: 'ERC-20',
        name: 'Ethereum (ERC-20)',
        withdrawalFee: 5,
        minConfirmations: 12,
        isEnabled: true
      },
      {
        network: 'TRC-20',
        name: 'TRON (TRC-20)',
        withdrawalFee: 1,
        minConfirmations: 6,
        isEnabled: true
      },
      {
        network: 'BEP-20',
        name: 'BSC (BEP-20)',
        withdrawalFee: 0.5,
        minConfirmations: 15,
        isEnabled: true
      }
    ]
  }
]

interface DepositFormProps {
  wallet: CryptoWallet
  onSubmit: (transaction: CryptoTransaction) => void
}

export function DepositForm({ wallet, onSubmit }: DepositFormProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(wallet.network)
  const [amount, setAmount] = useState('')
  const [isGeneratingAddress, setIsGeneratingAddress] = useState(false)
  const [depositAddress, setDepositAddress] = useState(wallet.address)
  const { toast } = useToast()

  const currentCurrency = supportedCurrencies.find(c => c.symbol === wallet.currency)
  const availableNetworks = currentCurrency?.networks || []
  const selectedNetworkInfo = availableNetworks.find(n => n.network === selectedNetwork)

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Address copied!",
        description: "Deposit address has been copied to clipboard",
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

  const generateNewAddress = async () => {
    setIsGeneratingAddress(true)
    try {
      // Simulate API call to generate new address
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate mock address based on network
      let newAddress = ''
      if (selectedNetwork === 'Bitcoin') {
        newAddress = 'bc1q' + Math.random().toString(36).substring(2, 42)
      } else if (selectedNetwork.includes('Ethereum') || selectedNetwork.includes('ERC') || selectedNetwork.includes('BEP')) {
        newAddress = '0x' + Math.random().toString(16).substring(2, 42)
      } else if (selectedNetwork.includes('TRC')) {
        newAddress = 'T' + Math.random().toString(36).substring(2, 35).toUpperCase()
      }
      
      setDepositAddress(newAddress)
      toast({
        title: "New address generated",
        description: "A new deposit address has been generated",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate new address",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAddress(false)
    }
  }

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network)
    // Generate new address for the selected network
    generateNewAddress()
  }

  const handleDepositConfirm = () => {
    const depositAmount = parseFloat(amount)
    
    if (!amount || depositAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      })
      return
    }

    if (currentCurrency && depositAmount < currentCurrency.minDeposit) {
      toast({
        title: "Amount too small",
        description: `Minimum deposit amount is ${currentCurrency.minDeposit} ${wallet.currency}`,
        variant: "destructive",
      })
      return
    }

    // Create transaction object
    const transaction: CryptoTransaction = {
      id: `dep_${Date.now()}`,
      type: 'deposit',
      currency: wallet.currency,
      amount: depositAmount,
      address: depositAddress,
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: selectedNetworkInfo?.minConfirmations || 6,
      fee: 0,
      timestamp: new Date().toISOString(),
      estimatedTime: 30
    }

    onSubmit(transaction)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Currency Info */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {wallet.currency.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{wallet.currency}</h3>
                  <p className="text-sm text-muted-foreground">{currentCurrency?.name}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Balance:</span>
                  <span className="text-white font-medium">
                    {formatCryptoAmount(wallet.balance, wallet.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Min Deposit:</span>
                  <span className="text-white font-medium">
                    {currentCurrency ? formatCryptoAmount(currentCurrency.minDeposit, wallet.currency) : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Selection */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label htmlFor="network">Select Network</Label>
                <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNetworks.map((network) => (
                      <SelectItem key={network.network} value={network.network} disabled={!network.isEnabled}>
                        <div className="flex flex-col">
                          <span>{network.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {network.minConfirmations} confirmations
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedNetworkInfo && (
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmations:</span>
                      <span className="text-white">{selectedNetworkInfo.minConfirmations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network Fee:</span>
                      <span className="text-white">Paid by sender</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expected Amount Input */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label htmlFor="amount">Expected Deposit Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  placeholder={`Enter amount (min: ${currentCurrency?.minDeposit || 0})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Badge variant="outline" className="text-xs">
                    {wallet.currency}
                  </Badge>
                </div>
              </div>
              {amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-muted-foreground">
                  You will receive: {formatCryptoAmount(parseFloat(amount), wallet.currency)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deposit Address */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Deposit Address</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateNewAddress}
                disabled={isGeneratingAddress}
              >
                {isGeneratingAddress ? 'Generating...' : 'Generate New'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label>Send {wallet.currency} to this address:</Label>
                <Badge variant="outline">{selectedNetwork}</Badge>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg">
                <code className="flex-1 text-sm font-mono text-white break-all">
                  {depositAddress}
                </code>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyAddress(depositAddress)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Important Notices */}
            <div className="space-y-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold">Important Notice</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Send only {wallet.currency} to this address</li>
                <li>• Minimum deposit: {currentCurrency ? formatCryptoAmount(currentCurrency.minDeposit, wallet.currency) : 'N/A'}</li>
                <li>• Requires {selectedNetworkInfo?.minConfirmations || 6} network confirmations</li>
                <li>• Do not send from exchanges that don't support smart contracts</li>
                <li>• Make sure you select the correct network ({selectedNetwork})</li>
              </ul>
            </div>

            {/* Processing Info */}
            <div className="space-y-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-400">
                <Info className="w-4 h-4" />
                <span className="font-semibold">Processing Information</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Funds will be credited after {selectedNetworkInfo?.minConfirmations || 6} confirmations</p>
                <p>• Processing time: ~15-30 minutes depending on network congestion</p>
                <p>• You can track your transaction status in the transactions tab</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" className="px-6">
            Cancel
          </Button>
          <Button 
            onClick={handleDepositConfirm} 
            className="px-6"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <Wallet className="w-4 h-4 mr-2" />
            I've Sent the Funds
          </Button>
        </div>
      </div>
    </div>
  )
}
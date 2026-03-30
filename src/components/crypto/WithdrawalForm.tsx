import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { CryptoWallet, CryptoTransaction, CryptoCurrency, CryptoNetwork } from '@/types/crypto'
import { AlertCircle, Info, Send, Calculator, Wallet } from 'lucide-react'
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

interface WithdrawalFormProps {
  wallet: CryptoWallet
  onSubmit: (transaction: CryptoTransaction) => void
}

export function WithdrawalForm({ wallet, onSubmit }: WithdrawalFormProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(wallet.network)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [memo, setMemo] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [addressValid, setAddressValid] = useState<boolean | null>(null)
  const { toast } = useToast()

  const currentCurrency = supportedCurrencies.find(c => c.symbol === wallet.currency)
  const availableNetworks = currentCurrency?.networks || []
  const selectedNetworkInfo = availableNetworks.find(n => n.network === selectedNetwork)
  
  const withdrawalFee = selectedNetworkInfo?.withdrawalFee || 0
  const amountAfterFee = parseFloat(amount) ? Math.max(0, parseFloat(amount) - withdrawalFee) : 0
  const maxWithdrawable = Math.max(0, wallet.balance - withdrawalFee)

  const validateAddress = (addressToValidate: string) => {
    if (!addressToValidate) {
      setAddressValid(null)
      return
    }

    setIsValidating(true)
    let isValid = false
    
    // Basic validation based on network
    if (selectedNetwork === 'Bitcoin') {
      isValid = addressToValidate.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/) !== null
    } else if (selectedNetwork.includes('Ethereum') || selectedNetwork.includes('ERC') || selectedNetwork.includes('BEP')) {
      isValid = addressToValidate.match(/^0x[a-fA-F0-9]{40}$/) !== null
    } else if (selectedNetwork.includes('TRC')) {
      isValid = addressToValidate.match(/^T[a-zA-Z0-9]{33}$/) !== null
    }
    
    setAddressValid(isValid)
    setIsValidating(false)
    
    if (!isValid) {
      toast({
        title: "Invalid address",
        description: `Please enter a valid ${selectedNetwork} address`,
        variant: "destructive",
      })
    }
  }

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress)
    setAddressValid(null)
    
    // Debounce validation — 300ms is enough for smooth UX
    const timeoutId = setTimeout(() => {
      validateAddress(newAddress)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount)
  }

  const setAmountPercentage = (percentage: number) => {
    const calculatedAmount = (maxWithdrawable * percentage / 100)
    setAmount(calculatedAmount.toString())
  }

  const handleWithdrawalSubmit = () => {
    const withdrawalAmount = parseFloat(amount)
    
    // Validations
    if (!amount || withdrawalAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      })
      return
    }

    if (!address) {
      toast({
        title: "Address required",
        description: "Please enter a withdrawal address",
        variant: "destructive",
      })
      return
    }

    if (addressValid === false) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid withdrawal address",
        variant: "destructive",
      })
      return
    }

    if (currentCurrency && withdrawalAmount < currentCurrency.minWithdrawal) {
      toast({
        title: "Amount too small",
        description: `Minimum withdrawal amount is ${formatCryptoAmount(currentCurrency.minWithdrawal, wallet.currency)}`,
        variant: "destructive",
      })
      return
    }

    if (withdrawalAmount > wallet.balance) {
      toast({
        title: "Insufficient balance",
        description: "Withdrawal amount exceeds available balance",
        variant: "destructive",
      })
      return
    }

    if (amountAfterFee <= 0) {
      toast({
        title: "Amount too small",
        description: "Amount after fees would be zero or negative",
        variant: "destructive",
      })
      return
    }

    // Create transaction object
    const transaction: CryptoTransaction = {
      id: `wd_${Date.now()}`,
      type: 'withdrawal',
      currency: wallet.currency,
      amount: withdrawalAmount,
      address: address,
      status: 'PENDING',
      confirmations: 0,
      requiredConfirmations: selectedNetworkInfo?.minConfirmations || 6,
      fee: withdrawalFee,
      timestamp: new Date().toISOString(),
      estimatedTime: 45
    }

    onSubmit(transaction)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Balance Info */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Available Balance</h3>
                  <p className="text-lg font-bold gradient-text">
                    {formatCryptoAmount(wallet.balance, wallet.currency)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Min Withdrawal:</span>
                  <span className="text-white font-medium">
                    {currentCurrency ? formatCryptoAmount(currentCurrency.minWithdrawal, wallet.currency) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Withdrawable:</span>
                  <span className="text-white font-medium">
                    {formatCryptoAmount(maxWithdrawable, wallet.currency)}
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
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNetworks.map((network) => (
                      <SelectItem key={network.network} value={network.network} disabled={!network.isEnabled}>
                        <div className="flex flex-col">
                          <span>{network.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Fee: {formatCryptoAmount(network.withdrawalFee, wallet.currency)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedNetworkInfo && (
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network Fee:</span>
                      <span className="text-white font-medium">
                        {formatCryptoAmount(selectedNetworkInfo.withdrawalFee, wallet.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span className="text-white">~30-60 min</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Address */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label htmlFor="address">Withdrawal Address</Label>
              <div className="relative">
                <Input
                  id="address"
                  placeholder={`Enter ${selectedNetwork} address`}
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className={`${
                    addressValid === true ? 'border-green-500' : 
                    addressValid === false ? 'border-red-500' : ''
                  }`}
                />
                {isValidating && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              {memo && (selectedNetwork.includes('TRC') || selectedNetwork.includes('BEP')) && (
                <div className="space-y-2">
                  <Label htmlFor="memo">Memo/Tag (Optional)</Label>
                  <Input
                    id="memo"
                    placeholder="Enter memo or destination tag if required"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Make sure the address is correct. Transactions cannot be reversed.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="amount">Withdrawal Amount</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    step="any"
                    placeholder={`Enter amount (min: ${currentCurrency?.minWithdrawal || 0})`}
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Badge variant="outline" className="text-xs">
                      {wallet.currency}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Amount Selection */}
              <div className="space-y-3">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((percentage) => (
                    <Button
                      key={percentage}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmountPercentage(percentage)}
                      className="text-xs"
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Fee Calculation */}
              {amount && parseFloat(amount) > 0 && (
                <Card className="bg-muted/20 border-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calculator className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-blue-400">Fee Calculation</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Withdrawal Amount:</span>
                        <span className="text-white">
                          {formatCryptoAmount(parseFloat(amount), wallet.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network Fee:</span>
                        <span className="text-red-400">
                          -{formatCryptoAmount(withdrawalFee, wallet.currency)}
                        </span>
                      </div>
                      <div className="border-t border-muted pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">You will receive:</span>
                          <span className="text-green-400">
                            {formatCryptoAmount(amountAfterFee, wallet.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="space-y-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">Security Warning</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Double-check the withdrawal address and network</li>
            <li>• Cryptocurrency transactions are irreversible</li>
            <li>• We are not responsible for funds sent to incorrect addresses</li>
            <li>• Make sure the receiving wallet supports the selected network</li>
            <li>• Start with a small test transaction for new addresses</li>
          </ul>
        </div>

        {/* Processing Info */}
        <div className="space-y-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-400">
            <Info className="w-4 h-4" />
            <span className="font-semibold">Processing Information</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Withdrawals are processed within 30-60 minutes during business hours</p>
            <p>• Large withdrawals may require additional verification</p>
            <p>• You will receive email notifications about the status</p>
            <p>• Network congestion may affect processing times</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" className="px-6">
            Cancel
          </Button>
          <Button 
            onClick={handleWithdrawalSubmit} 
            className="px-6"
            disabled={
              !amount || 
              !address || 
              parseFloat(amount) <= 0 || 
              addressValid === false ||
              isValidating ||
              amountAfterFee <= 0
            }
          >
            <Send className="w-4 h-4 mr-2" />
            Withdraw {wallet.currency}
          </Button>
        </div>
      </div>
    </div>
  )
}
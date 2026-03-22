import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CryptoTransaction } from '@/types/crypto'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  ArrowLeft,
  Loader2,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatCryptoAmount } from '@/lib/crypto-utils'

interface TransactionStatusProps {
  transaction: CryptoTransaction
  onClose: () => void
}

export function TransactionStatus({ transaction, onClose }: TransactionStatusProps) {
  const [currentTransaction, setCurrentTransaction] = useState<CryptoTransaction>(transaction)
  const [timeRemaining, setTimeRemaining] = useState<number>(transaction.estimatedTime! * 60 * 1000) // Convert to milliseconds
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const { toast } = useToast()

  // Simulate transaction progress
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1000)
      setTimeRemaining(prev => Math.max(0, prev - 1000))
      
      // Simulate transaction updates
      setCurrentTransaction(prev => {
        const newTransaction = { ...prev }
        
        // Simulate progress through NEW -> PENDING -> PAID
        if (prev.status === 'NEW' && elapsedTime > 10000) { // After 10 seconds
          newTransaction.status = 'PENDING'
          newTransaction.txHash = generateMockTxHash(prev.currency)
        }
        
        if (prev.status === 'PENDING' && elapsedTime > 30000) { // After 30 seconds
          newTransaction.confirmations = Math.min(
            prev.requiredConfirmations,
            Math.floor((elapsedTime - 30000) / 10000) + 1
          )
          
          if (newTransaction.confirmations >= prev.requiredConfirmations) {
            newTransaction.status = 'PAID'
          }
        }
        
        return newTransaction
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [elapsedTime])

  const generateMockTxHash = (currency: string): string => {
    if (currency === 'BTC') {
      return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    } else {
      return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: `${label} copied!`,
        description: `${label} has been copied to clipboard`,
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: `Failed to copy ${label.toLowerCase()}`,
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = () => {
    switch (currentTransaction.status) {
      case 'NEW':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      case 'PENDING':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'PARTIAL':
        return <Activity className="w-6 h-6 text-orange-500" />
      case 'PAID':
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'EXPIRED':
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (currentTransaction.status) {
      case 'NEW':
        return 'text-blue-500'
      case 'PENDING':
        return 'text-yellow-500'
      case 'PARTIAL':
        return 'text-orange-500'
      case 'PAID':
      case 'completed':
        return 'text-green-500'
      case 'EXPIRED':
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getProgressPercentage = () => {
    if (currentTransaction.status === 'completed') return 100
    if (currentTransaction.status === 'failed') return 0
    if (currentTransaction.status === 'pending') return 20
    
    // For confirming status, calculate based on confirmations
    return 20 + (currentTransaction.confirmations / currentTransaction.requiredConfirmations) * 80
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getExplorerUrl = () => {
    if (!currentTransaction.txHash) return null
    
    // Mock explorer URLs
    switch (currentTransaction.currency) {
      case 'BTC':
        return `https://blockstream.info/tx/${currentTransaction.txHash}`
      case 'ETH':
      case 'USDT':
      case 'USDC':
        return `https://etherscan.io/tx/${currentTransaction.txHash}`
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wallet
        </Button>
        <div>
          <h1 className="text-2xl font-bold gradient-text">Transaction Status</h1>
          <p className="text-muted-foreground">Track your {currentTransaction.type} progress</p>
        </div>
      </div>

      {/* Main Status Card */}
      <Card className="hover-glow">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl ${getStatusColor()}`}>
            {currentTransaction.status === 'NEW' && 'Awaiting Payment'}
            {currentTransaction.status === 'PENDING' && 'Confirming Transaction'}
            {currentTransaction.status === 'PARTIAL' && 'Partially Paid'}
            {(currentTransaction.status === 'PAID' || currentTransaction.status === 'completed') && 'Transaction Completed'}
            {(currentTransaction.status === 'EXPIRED' || currentTransaction.status === 'failed') && 'Transaction Expired'}
          </CardTitle>
          <div className="space-y-2">
            <Badge variant={
              (currentTransaction.status === 'PAID' || currentTransaction.status === 'completed') ? 'success' :
              (currentTransaction.status === 'EXPIRED' || currentTransaction.status === 'failed') ? 'destructive' : 'warning'
            }>
              {currentTransaction.status.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Transaction ID: {currentTransaction.id}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-white">{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                    {currentTransaction.type === 'deposit' ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white capitalize">
                      {currentTransaction.type}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentTransaction.currency} Transaction
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="text-sm font-medium text-white">
                      {formatCryptoAmount(currentTransaction.amount, currentTransaction.currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fee:</span>
                    <span className="text-sm font-medium text-white">
                      {formatCryptoAmount(currentTransaction.fee, currentTransaction.currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Net Amount:</span>
                    <span className="text-sm font-medium text-green-400">
                      {formatCryptoAmount(
                        currentTransaction.type === 'deposit' 
                          ? currentTransaction.amount 
                          : currentTransaction.amount - currentTransaction.fee, 
                        currentTransaction.currency
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg gateway-dark-gradient flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Timing</h3>
                    <p className="text-sm text-muted-foreground">Progress Timeline</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Elapsed Time:</span>
                    <span className="text-sm font-medium text-white">
                      {formatTime(elapsedTime)}
                    </span>
                  </div>
                  
                  {timeRemaining > 0 && currentTransaction.status !== 'completed' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Est. Remaining:</span>
                      <span className="text-sm font-medium text-yellow-400">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Started:</span>
                    <span className="text-sm font-medium text-white">
                      {new Date(currentTransaction.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address Information */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-white">
                  {currentTransaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} Address
                </h3>
                <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg">
                  <code className="flex-1 text-sm font-mono text-white break-all">
                    {currentTransaction.address}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(currentTransaction.address, 'Address')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Hash */}
          {currentTransaction.txHash && (
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Transaction Hash</h3>
                  <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg">
                    <code className="flex-1 text-sm font-mono text-white break-all">
                      {currentTransaction.txHash}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(currentTransaction.txHash!, 'Transaction Hash')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {getExplorerUrl() && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(getExplorerUrl()!, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Confirmations */}
          {currentTransaction.status === 'confirming' && (
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Network Confirmations</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress:</span>
                    <span className="text-sm font-medium text-white">
                      {currentTransaction.confirmations} / {currentTransaction.requiredConfirmations}
                    </span>
                  </div>
                  <Progress 
                    value={(currentTransaction.confirmations / currentTransaction.requiredConfirmations) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Each confirmation makes your transaction more secure. 
                    Current network requires {currentTransaction.requiredConfirmations} confirmations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Messages */}
          <div className="space-y-3">
            {currentTransaction.status === 'NEW' && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">Awaiting Network Confirmation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your transaction has been submitted and is waiting to be picked up by the network. 
                  This usually takes a few minutes.
                </p>
              </div>
            )}
            
            {(currentTransaction.status === 'PENDING' || (currentTransaction.status as any) === 'confirming') && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-semibold">Confirming on Blockchain</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your transaction is being confirmed by the network. 
                  {currentTransaction.confirmations > 0 && ` Already received ${currentTransaction.confirmations} confirmation${currentTransaction.confirmations > 1 ? 's' : ''}.`}
                </p>
              </div>
            )}

            {currentTransaction.status === 'PARTIAL' && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-orange-400 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="font-semibold">Partially Paid</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  We have received a partial payment. Please send the remaining amount to complete the transaction.
                </p>
              </div>
            )}
            
            {(currentTransaction.status === 'PAID' || (currentTransaction.status as any) === 'completed') && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Transaction Completed</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your {currentTransaction.type} has been successfully processed and confirmed by the network. 
                  The funds are now available in your wallet.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center pt-4">
            <Button onClick={onClose} className="px-8">
              Return to Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Copy, Loader2, Beer } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

interface TestPaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Coin {
  id: number
  symbol: string
  name: string
  rate_usd: string
}

export function TestPaymentModal({ isOpen, onClose }: TestPaymentModalProps) {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('10.00')
  const [coins, setCoins] = useState<Coin[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC')
  const [isLoading, setIsLoading] = useState(false)
  const [invoice, setInvoice] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchCoins()
    }
  }, [isOpen])

  const fetchCoins = async () => {
    try {
      const data = await api.getAvailableCoins()
      setCoins(data)
      if (data.length > 0 && !data.find(c => c.symbol === selectedSymbol)) {
        setSelectedSymbol(data[0].symbol)
      }
    } catch (err: any) {
      console.error('Failed to fetch coins:', err)
    }
  }

  const handleCreateInvoice = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const selectedCoin = coins.find(c => c.symbol === selectedSymbol)
      if (!selectedCoin) throw new Error('Please select a coin')

      const usdAmount = parseFloat(amount)
      const rate = parseFloat(selectedCoin.rate_usd)
      const tokenAmount = usdAmount / rate

      // Step 1: Create Invoice
      const data = await api.createInvoice({
        amount: tokenAmount,
        amount_usd: usdAmount,
        coin_symbol: selectedSymbol, 
        description: 'Dashboard Test Payment'
      })
      setInvoice({ ...data, amount_usd: usdAmount })
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSimulatePayment = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Step 2: Simulate Payment
      await api.simulatePayment({
        invoice_id: invoice.id,
        amount_received: invoice.amount_expected
      })
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Simulation failed')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setStep(1)
    setAmount('10.00')
    setInvoice(null)
    setError(null)
    onClose()
  }

  const copyAddress = () => {
    if (invoice?.address) {
      navigator.clipboard.writeText(invoice.address)
    }
  }

  const currentRate = coins.find(c => c.symbol === selectedSymbol)?.rate_usd

  return (
    <Dialog open={isOpen} onOpenChange={reset}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Beer className="w-5 h-5 text-amber-500" />
            Test Payment Simulation
          </DialogTitle>
          <DialogDescription>
            Experience the payment flow in the Bitcoin Testnet environment.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200 flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>
                  This is a <strong>Simulation</strong>. No real funds will be spent. 
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                    <Input 
                      id="amount" 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coin" />
                    </SelectTrigger>
                    <SelectContent>
                      {coins.map(coin => (
                        <SelectItem key={coin.symbol} value={coin.symbol}>
                          {coin.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentRate && (
                <div className="text-[10px] text-muted-foreground bg-muted/30 p-2 rounded text-center">
                  Current Exchange Rate: 1 {selectedSymbol} = {formatCurrency(parseFloat(currentRate))}
                </div>
              )}
            </div>
          )}

          {step === 2 && invoice && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Address to Pay</Label>
                <div className="flex gap-2">
                  <Input value={invoice.address} readOnly className="font-mono text-xs" />
                  <Button size="icon" variant="outline" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Expected {selectedSymbol}</p>
                  <p className="font-bold text-sm">{invoice.amount_expected} {selectedSymbol}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Equivalent USD</p>
                  <p className="font-bold text-sm">{formatCurrency(invoice.amount_usd)}</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-center">
                Click "Simulate Payment" to fake an on-chain transfer to this address.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg font-bold">Payment Simulated!</h3>
                <p className="text-sm text-muted-foreground">
                  The transaction will appear in your history shortly.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-xs flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 1 && (
            <Button className="w-full" onClick={handleCreateInvoice} disabled={isLoading || coins.length === 0}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Generate Test Invoice
            </Button>
          )}
          {step === 2 && (
            <div className="flex gap-2 w-full">
              <Button variant="ghost" onClick={() => setStep(1)} disabled={isLoading}>Back</Button>
              <Button className="flex-1 gateway-primary-gradient" onClick={handleSimulatePayment} disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Simulate Payment
              </Button>
            </div>
          )}
          {step === 3 && (
            <Button className="w-full" onClick={reset}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

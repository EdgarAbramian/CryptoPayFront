import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { X } from 'lucide-react'

interface FilterProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
  currentFilters: any
}

export function TransactionFilterModal({ isOpen, onClose, onApply, currentFilters }: FilterProps) {
  const [filters, setFilters] = useState(currentFilters)
  const [merchants, setMerchants] = useState<{ id: string; name: string }[]>([])
  const [coins, setCoins] = useState<{ id: number; symbol: string }[]>([])

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [merchantsRes, coinsRes] = await Promise.all([
            api.getMerchants({ limit: 100 }),
            api.getNodes().then(nodes => 
              Array.from(new Set(nodes.map((n: any) => JSON.stringify({ id: n.id, symbol: n.coin }))))
                .map(s => JSON.parse(s))
            )
          ])
          setMerchants(merchantsRes)
          setCoins(coinsRes)
        } catch (err) {
          console.error('Failed to fetch filter options', err)
        }
      }
      fetchData()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg glass-card border-white/20 animate-in fade-in zoom-in duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-white">Filter Transactions</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date From</label>
                <Input 
                  type="date" 
                  value={filters.date_from || ''}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date To</label>
                <Input 
                  type="date" 
                  value={filters.date_to || ''}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Merchant</label>
              <Select 
                value={filters.merchant_id || 'all'} 
                onValueChange={(val) => setFilters({ ...filters, merchant_id: val === 'all' ? undefined : val })}
              >
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="All Merchants" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all">All Merchants</SelectItem>
                  {merchants.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Currency (Crypto)</label>
              <Select 
                value={filters.coin_id?.toString() || 'all'} 
                onValueChange={(val) => setFilters({ ...filters, coin_id: val === 'all' ? undefined : parseInt(val) })}
              >
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="All Currencies" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all">All Currencies</SelectItem>
                  {coins.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select 
                value={filters.status || 'all'} 
                onValueChange={(val) => setFilters({ ...filters, status: val === 'all' ? undefined : val })}
              >
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="PARTIAL">PARTIAL</SelectItem>
                  <SelectItem value="PAID">PAID</SelectItem>
                  <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Min Amount (USD)</label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  value={filters.min_amount_usd || ''}
                  onChange={(e) => setFilters({ ...filters, min_amount_usd: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Max Amount (USD)</label>
                <Input 
                  type="number" 
                  placeholder="1000.00"
                  value={filters.max_amount_usd || ''}
                  onChange={(e) => setFilters({ ...filters, max_amount_usd: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="flex justify-between space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => {
                setFilters({})
                onApply({})
              }}>
                Reset All
              </Button>
              <div className="flex space-x-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="gateway-dark-gradient"
                  onClick={() => onApply(filters)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

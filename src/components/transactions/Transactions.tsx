import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { api } from '@/lib/api'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Calendar,
  Loader2,
  X,
  PlusCircle,
  Activity
} from 'lucide-react'
import { TransactionFilterModal } from './TransactionFilterModal'

import { useAuth } from '@/contexts/AuthContext'

interface Transaction {
  id: string
  merchant: string
  amount: number
  currency: string
  crypto: string
  status: 'NEW' | 'PENDING' | 'PARTIAL' | 'PAID' | 'EXPIRED' | 'completed' | 'pending' | 'failed'
  timestamp: string
  fee: number
  hash: string
}

const statusConfig = {
  NEW: { 
    color: 'warning', 
    icon: PlusCircle,
    bgColor: 'bg-blue-500/10 border-blue-500/20'
  },
  PENDING: { 
    color: 'warning', 
    icon: Clock,
    bgColor: 'bg-yellow-500/10 border-yellow-500/20'
  },
  PARTIAL: { 
    color: 'warning', 
    icon: Activity,
    bgColor: 'bg-orange-500/10 border-orange-500/20'
  },
  PAID: { 
    color: 'success', 
    icon: CheckCircle,
    bgColor: 'bg-green-500/10 border-green-500/20'
  },
  EXPIRED: { 
    color: 'destructive', 
    icon: XCircle,
    bgColor: 'bg-red-500/10 border-red-500/20'
  },
  // Legacy mappings
  completed: { 
    color: 'success', 
    icon: CheckCircle,
    bgColor: 'bg-green-500/10 border-green-500/20'
  },
  pending: { 
    color: 'warning', 
    icon: Clock,
    bgColor: 'bg-yellow-500/10 border-yellow-500/20'
  },
  failed: { 
    color: 'destructive', 
    icon: XCircle,
    bgColor: 'bg-red-500/10 border-red-500/20'
  },
}

export function Transactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({})

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter.toUpperCase(),
        ...activeFilters
      }
      
      const isMerchant = user?.role === 'merchant'
      const data = isMerchant 
        ? await api.getMerchantTransactions(filters)
        : await api.getTransactions(filters)
      
      const mappedTransactions = data.map((tx: any) => {
        // Normalizing status to uppercase one of requested statuses if possible
        let status: any = tx.status?.toUpperCase() || 'NEW';
        
        // Handle variations from legacy backend or different endpoints
        if (status === 'CONFIRMED' || status === 'SUCCESS') status = 'PAID';
        if (status === 'FAILED' || status === 'ERROR') status = 'EXPIRED';
        
        // Fallback for UI if not in our new set but in legacy lowercase set
        if (!['NEW', 'PENDING', 'PARTIAL', 'PAID', 'EXPIRED'].includes(status)) {
          if (tx.status === 'completed' || tx.status === 'success') status = 'PAID';
          else if (tx.status === 'failed' || tx.status === 'error') status = 'EXPIRED';
          else if (tx.status === 'pending' || tx.status === 'confirming') status = 'PENDING';
          else status = 'NEW';
        }
        
        return {
          id: tx.id,
          merchant: tx.merchant_name || (isMerchant ? (user?.name || 'My Business') : `Merchant ${tx.merchant_id?.slice(0, 4) || 'Unknown'}`),
          amount: parseFloat(tx.amount_usd || tx.amount_received),
          currency: 'USD',
          crypto: tx.coin_symbol || (tx.coin?.symbol) || 'BTC',
          status,
          timestamp: (tx.confirmed_at || tx.created_at || new Date().toISOString())
            .replace('T', ' ')
            .split('.')[0],
          fee: parseFloat(tx.fee_amount_usd || '0'),
          hash: tx.txid,
        }
      })
      setTransactions(mappedTransactions)
    } catch (err) {
      console.error('Failed to fetch transactions', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'xlsx' = 'csv') => {
    setIsExporting(true)
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter.toUpperCase(),
        ...activeFilters
      }

      const isMerchant = user?.role === 'merchant'
      const blob = isMerchant
        ? await api.exportMerchantTransactions(filters, format)
        : await api.exportTransactions(filters, format)
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${isMerchant ? 'merchant_' : ''}transactions_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed', err)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [statusFilter, activeFilters, user])

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Transactions</h1>
        <p className="text-muted-foreground">
          Monitor and manage all Nexus PAY transactions with advanced filtering and export.
        </p>
      </div>

      <Card className="hover-glow">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search TXID, email or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchTransactions()}
                    className="pl-10 h-10"
                  />
                </div>
                
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                  {['all', 'PAID', 'PENDING', 'PARTIAL', 'NEW', 'EXPIRED'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${
                        statusFilter === s 
                          ? 'bg-white/10 text-white shadow-lg' 
                          : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant={hasActiveFilters ? "default" : "glass"} 
                  size="sm" 
                  className="h-10"
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  <Filter className={`w-4 h-4 mr-2 ${hasActiveFilters ? 'animate-pulse' : ''}`} />
                  Filter {hasActiveFilters && `(${Object.keys(activeFilters).length})`}
                </Button>
                <Button 
                  variant="glass" 
                  size="sm" 
                  className="h-10" 
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Export
                </Button>
                <Button variant="glass" size="sm" className="h-10" onClick={fetchTransactions} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {Object.entries(activeFilters).map(([key, value]: [string, any]) => {
                  if (!value) return null;
                  return (
                    <Badge key={key} variant="secondary" className="bg-white/5 border-white/10 text-xs py-1 px-2 flex items-center gap-1">
                      <span className="text-muted-foreground">{key}:</span> {value.toString()}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-white" 
                        onClick={() => {
                          const newFilters = { ...activeFilters };
                          delete newFilters[key];
                          setActiveFilters(newFilters);
                        }} 
                      />
                    </Badge>
                  )
                })}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[10px] uppercase tracking-wider"
                  onClick={() => setActiveFilters({})}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TransactionFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={activeFilters}
        onApply={(filters) => {
          setActiveFilters(filters)
          setIsFilterModalOpen(false)
        }}
      />

      <Card className="hover-glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? 'Updating records...' : `Showing last ${transactions.length} transactions`}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
              <p className="text-muted-foreground animate-pulse font-medium">Fetching transaction ledger...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => {
                const statusInfo = statusConfig[tx.status] || statusConfig.failed
                const StatusIcon = statusInfo.icon
                
                return (
                  <div
                    key={tx.id}
                    className={`p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01] hover:bg-white/5 ${
                      statusInfo.bgColor
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-xl gateway-dark-gradient border border-white/10 flex items-center justify-center shadow-lg">
                          <span className="text-xs font-black text-white/90 tracking-tighter">
                            {tx.crypto}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-white tracking-tight flex items-center gap-2">
                            {tx.id.slice(0, 18)}...
                            <Badge variant="glass" className="text-[10px] h-4 leading-none py-0">ID</Badge>
                          </div>
                          <div className="text-sm font-medium text-slate-300 uppercase tracking-wide">{tx.merchant}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center space-x-1.5 font-medium">
                            <Calendar className="w-3 h-3" />
                            <span>{tx.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <div className="font-black text-white text-xl tracking-tight">
                            {formatCurrency(tx.amount)}
                          </div>
                          <div className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                            Fee: {formatCurrency(tx.fee)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <Badge
                            variant={statusInfo.color as any}
                            className="flex items-center space-x-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm"
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{tx.status}</span>
                          </Badge>
                          
                          <Button variant="glass" size="icon" className="h-8 w-8 rounded-full border-white/5 bg-white/5 hover:bg-white/10">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-2">
                        <span className="uppercase tracking-widest opacity-50">TX Hash:</span>{' '}
                        <code className="text-champagne-gold/70 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                          {tx.hash}
                        </code>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono opacity-50">
                        {tx.id}
                      </div>
                    </div>
                  </div>
                )
              })}
              {transactions.length === 0 && !isLoading && (
                <div className="text-center p-20 glass-card rounded-xl border-dashed border-white/10">
                  <p className="text-muted-foreground italic font-medium">No transactions match your criteria.</p>
                  <Button variant="link" size="sm" onClick={() => { setActiveFilters({}); setStatusFilter('all'); setSearchTerm(''); }}>
                    Clear all search parameters
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
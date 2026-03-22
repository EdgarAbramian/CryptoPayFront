import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  MoreVertical,
  Key,
  Wallet,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

interface Transaction {
  id: string
  type: 'payment' | 'withdrawal' | 'fee'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  merchant?: string
  customer?: string
  method: string
  timestamp: string
  description: string
}

interface MobileTransactionsListProps {
  transactions: Transaction[]
  showMerchant?: boolean
  title?: string
}

export function MobileTransactionsList({ 
  transactions, 
  showMerchant = false, 
  title = "Transactions" 
}: MobileTransactionsListProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.status === filter
    const matchesSearch = searchTerm === '' || 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.merchant && tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesFilter && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case 'fee':
        return <CreditCard className="w-4 h-4 text-blue-500" />
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />
    }
  }

  const formatAmount = (amount: number, currency: string, type: string) => {
    const sign = type === 'withdrawal' || type === 'fee' ? '-' : '+'
    const color = type === 'withdrawal' || type === 'fee' ? 'text-red-400' : 'text-green-400'
    return (
      <span className={`font-bold ${color}`}>
        {sign}${amount.toLocaleString()} {currency}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Header with Search and Filter */}
      <Card className="hover-glow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Button variant="glass" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['all', 'completed', 'pending', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === status
                    ? 'gateway-dark-gradient text-white'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="hover-glow">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.id}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Amount and Status Row */}
                <div className="flex items-center justify-between">
                  <div className="text-lg">
                    {formatAmount(transaction.amount, transaction.currency, transaction.type)}
                  </div>
                  <Badge className={`${getStatusColor(transaction.status)} border`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span className="text-xs">{transaction.status}</span>
                    </div>
                  </Badge>
                </div>

                {/* Details Row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>{transaction.method}</span>
                    {showMerchant && transaction.merchant && (
                      <>
                        <span>•</span>
                        <span>{transaction.merchant}</span>
                      </>
                    )}
                  </div>
                  <span>{transaction.timestamp}</span>
                </div>

                {/* Progress Bar for Pending */}
                {transaction.status === 'pending' && (
                  <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full animate-pulse w-2/3"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {filteredTransactions.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="glass" className="w-full">
            Load More Transactions
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <Card className="hover-glow">
          <CardContent className="text-center py-12">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Your transactions will appear here when you start processing payments'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Предустановленные данные для демонстрации
export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    type: 'payment',
    amount: 1234.56,
    currency: 'USD',
    status: 'completed',
    merchant: 'TechCorp Solutions',
    customer: 'john@example.com',
    method: 'Bitcoin',
    timestamp: '2 minutes ago',
    description: 'Payment Received'
  },
  {
    id: 'TXN-002',
    type: 'fee',
    amount: 12.34,
    currency: 'USD',
    status: 'completed',
    method: 'Platform Fee',
    timestamp: '5 minutes ago',
    description: 'Transaction Fee'
  },
  {
    id: 'TXN-003',
    type: 'payment',
    amount: 892.30,
    currency: 'USD',
    status: 'pending',
    merchant: 'Digital Dynamics',
    customer: 'sarah@example.com',
    method: 'Ethereum',
    timestamp: '1 hour ago',
    description: 'Payment Processing'
  },
  {
    id: 'TXN-004',
    type: 'withdrawal',
    amount: 500.00,
    currency: 'USD',
    status: 'failed',
    method: 'Bank Transfer',
    timestamp: '2 hours ago',
    description: 'Withdrawal Failed'
  },
  {
    id: 'TXN-005',
    type: 'payment',
    amount: 2156.78,
    currency: 'USD',
    status: 'completed',
    merchant: 'Innovation Labs',
    customer: 'mike@example.com',
    method: 'USDT',
    timestamp: '3 hours ago',
    description: 'Payment Received'
  },
]
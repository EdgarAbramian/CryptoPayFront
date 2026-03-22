import { useMobile } from '@/hooks/useMobile'
import { AdminTransactions } from '../admin/AdminTransactions'
import { MerchantTransactions } from '../merchant/MerchantTransactions'
import { MobileTransactionsList, mockTransactions } from './MobileTransactionsList'

interface ResponsiveTransactionsProps {
  type: 'admin' | 'merchant'
}

export function ResponsiveTransactions({ type }: ResponsiveTransactionsProps) {
  const { isMobile } = useMobile()

  if (isMobile) {
    return (
      <div className="space-y-4">
        <MobileTransactionsList 
          transactions={mockTransactions}
          showMerchant={type === 'admin'}
          title={type === 'admin' ? 'All Transactions' : 'My Transactions'}
        />
      </div>
    )
  }

  // Desktop версия
  if (type === 'admin') {
    return <AdminTransactions />
  } else {
    return <MerchantTransactions />
  }
}
import { useState, lazy, Suspense } from 'react'
import { ResponsiveMerchantDashboard } from '../mobile/ResponsiveMerchantDashboard'
import { MobileLayoutWrapper } from '../mobile/MobileLayoutWrapper'
import { ResponsiveTransactions } from '../mobile/ResponsiveTransactions'
import { Toaster } from '@/components/ui/toaster'

// Lazy-load heavy pages — only downloaded when first visited
const MerchantBalance = lazy(() => import('./MerchantBalance').then(m => ({ default: m.MerchantBalance })))
const MerchantApiKeys = lazy(() => import('./MerchantApiKeys').then(m => ({ default: m.MerchantApiKeys })))
const MerchantReports = lazy(() => import('./MerchantReports').then(m => ({ default: m.MerchantReports })))
const MerchantSettings = lazy(() => import('./MerchantSettings').then(m => ({ default: m.MerchantSettings })))
const CryptoWalletManager = lazy(() => import('../crypto/CryptoWalletManager').then(m => ({ default: m.CryptoWalletManager })))
const ResponsivePageWrapper = lazy(() => import('../mobile/ResponsivePageWrapper').then(m => ({ default: m.ResponsivePageWrapper })))

export type MerchantPage = 'dashboard' | 'balance' | 'crypto-wallets' | 'transactions' | 'api-keys' | 'reports' | 'settings'

const pageNames: Record<MerchantPage, string> = {
  dashboard: 'Dashboard',
  balance: 'Balance',
  'crypto-wallets': 'Crypto Wallets',
  transactions: 'Transactions',
  'api-keys': 'API Keys',
  reports: 'Reports',
  settings: 'Settings'
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  )
}

export function MerchantApp() {
  const [currentPage, setCurrentPage] = useState<MerchantPage>('dashboard')

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ResponsiveMerchantDashboard />
      case 'balance':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="balance" 
              type="merchant" 
              desktopComponent={<MerchantBalance onNavigate={(page) => setCurrentPage(page as MerchantPage)} />} 
            />
          </Suspense>
        )
      case 'crypto-wallets':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="crypto-wallets" 
              type="merchant" 
              desktopComponent={<CryptoWalletManager />} 
            />
          </Suspense>
        )
      case 'transactions':
        return <ResponsiveTransactions type="merchant" />
      case 'api-keys':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="api-keys" 
              type="merchant" 
              desktopComponent={<MerchantApiKeys />} 
            />
          </Suspense>
        )
      case 'reports':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="reports" 
              type="merchant" 
              desktopComponent={<MerchantReports />} 
            />
          </Suspense>
        )
      case 'settings':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="settings" 
              type="merchant" 
              desktopComponent={<MerchantSettings />} 
            />
          </Suspense>
        )
      default:
        return <ResponsiveMerchantDashboard />
    }
  }

  return (
    <>
      <MobileLayoutWrapper
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page as MerchantPage)}
        type="merchant"
        pageNames={pageNames}
      >
        {renderContent()}
      </MobileLayoutWrapper>
      <Toaster />
    </>
  )
}
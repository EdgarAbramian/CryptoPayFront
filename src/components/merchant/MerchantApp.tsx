import { useState } from 'react'
import { ResponsiveMerchantSidebar } from '../mobile/ResponsiveMerchantSidebar'
import { ResponsiveMerchantTopBar } from '../mobile/ResponsiveMerchantTopBar'
import { ResponsiveMerchantDashboard } from '../mobile/ResponsiveMerchantDashboard'
import { MobileLayoutWrapper } from '../mobile/MobileLayoutWrapper'
import { ResponsiveTransactions } from '../mobile/ResponsiveTransactions'
import { ResponsivePageWrapper } from '../mobile/ResponsivePageWrapper'
import { MerchantApiKeys } from './MerchantApiKeys'
import { MerchantReports } from './MerchantReports'
import { MerchantSettings } from './MerchantSettings'
import { MerchantBalance } from './MerchantBalance'
import { CryptoWalletManager } from '../crypto/CryptoWalletManager'
import { Toaster } from '@/components/ui/toaster'
import { useMobile } from '@/hooks/useMobile'

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

export function MerchantApp() {
  const [currentPage, setCurrentPage] = useState<MerchantPage>('dashboard')

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ResponsiveMerchantDashboard />
      case 'balance':
        return (
          <ResponsivePageWrapper 
            page="balance" 
            type="merchant" 
            desktopComponent={<MerchantBalance onNavigate={setCurrentPage} />} 
          />
        )
      case 'crypto-wallets':
        return (
          <ResponsivePageWrapper 
            page="crypto-wallets" 
            type="merchant" 
            desktopComponent={<CryptoWalletManager />} 
          />
        )
      case 'transactions':
        return <ResponsiveTransactions type="merchant" />
      case 'api-keys':
        return (
          <ResponsivePageWrapper 
            page="api-keys" 
            type="merchant" 
            desktopComponent={<MerchantApiKeys />} 
          />
        )
      case 'reports':
        return (
          <ResponsivePageWrapper 
            page="reports" 
            type="merchant" 
            desktopComponent={<MerchantReports />} 
          />
        )
      case 'settings':
        return (
          <ResponsivePageWrapper 
            page="settings" 
            type="merchant" 
            desktopComponent={<MerchantSettings />} 
          />
        )
      default:
        return <ResponsiveMerchantDashboard />
    }
  }

  return (
    <>
      <MobileLayoutWrapper
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        type="merchant"
        pageNames={pageNames}
      >
        {renderContent()}
      </MobileLayoutWrapper>
      <Toaster />
    </>
  )
}
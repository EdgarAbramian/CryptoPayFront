import { useState, lazy, Suspense } from 'react'
import { MobileLayoutWrapper } from '../mobile/MobileLayoutWrapper'
import { ResponsiveAdminDashboard } from '../mobile/ResponsiveAdminDashboard'
import { ResponsiveTransactions } from '../mobile/ResponsiveTransactions'
import { Toaster } from '@/components/ui/toaster'

// Lazy-load heavy pages — only downloaded when first visited
const AdminMerchants = lazy(() => import('./AdminMerchants').then(m => ({ default: m.AdminMerchants })))
const AdminNodes = lazy(() => import('./AdminNodes').then(m => ({ default: m.AdminNodes })))
const AdminReports = lazy(() => import('./AdminReports').then(m => ({ default: m.AdminReports })))
const AdminSettings = lazy(() => import('./AdminSettings').then(m => ({ default: m.AdminSettings })))
const AdminUsers = lazy(() => import('./AdminUsers').then(m => ({ default: m.AdminUsers })))
const ResponsivePageWrapper = lazy(() => import('../mobile/ResponsivePageWrapper').then(m => ({ default: m.ResponsivePageWrapper })))

export type AdminPage = 'dashboard' | 'merchants' | 'transactions' | 'reports' | 'settings' | 'users' | 'nodes'

const pageNames: Record<AdminPage, string> = {
  dashboard: 'Dashboard',
  merchants: 'Merchants',
  transactions: 'Transactions',
  reports: 'Reports',
  settings: 'Settings',
  users: 'Users',
  nodes: 'Nodes'
}

// Minimal fallback while lazy chunk loads
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  )
}

export function AdminApp() {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard')

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ResponsiveAdminDashboard />
      case 'merchants':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="merchants" 
              type="admin" 
              desktopComponent={<AdminMerchants />} 
            />
          </Suspense>
        )
      case 'transactions':
        return <ResponsiveTransactions type="admin" />
      case 'reports':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="reports" 
              type="admin" 
              desktopComponent={<AdminReports />} 
            />
          </Suspense>
        )
      case 'settings':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="settings" 
              type="admin" 
              desktopComponent={<AdminSettings />} 
            />
          </Suspense>
        )
      case 'users':
        return (
          <Suspense fallback={<PageLoader />}>
            <ResponsivePageWrapper 
              page="users" 
              type="admin" 
              desktopComponent={<AdminUsers />} 
            />
          </Suspense>
        )
      case 'nodes':
        return (
          <Suspense fallback={<PageLoader />}>
            <AdminNodes />
          </Suspense>
        )
      default:
        return <ResponsiveAdminDashboard />
    }
  }

  return (
    <>
      <MobileLayoutWrapper
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page as AdminPage)}
        type="admin"
        pageNames={pageNames}
      >
        {renderContent()}
      </MobileLayoutWrapper>
      <Toaster />
    </>
  )
}
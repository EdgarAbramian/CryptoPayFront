import { useState } from 'react'
import { ResponsiveAdminSidebar } from '../mobile/ResponsiveAdminSidebar'
import { ResponsiveAdminTopBar } from '../mobile/ResponsiveAdminTopBar'
import { ResponsiveAdminDashboard } from '../mobile/ResponsiveAdminDashboard'
import { MobileLayoutWrapper } from '../mobile/MobileLayoutWrapper'
import { AdminMerchants } from './AdminMerchants'
import { ResponsiveTransactions } from '../mobile/ResponsiveTransactions'
import { ResponsivePageWrapper } from '../mobile/ResponsivePageWrapper'
import { AdminReports } from './AdminReports'
import { AdminSettings } from './AdminSettings'
import { AdminUsers } from './AdminUsers'
import { AdminNodes } from './AdminNodes'
import { Toaster } from '@/components/ui/toaster'
import { useMobile } from '@/hooks/useMobile'

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

export function AdminApp() {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard')

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ResponsiveAdminDashboard />
      case 'merchants':
        return (
          <ResponsivePageWrapper 
            page="merchants" 
            type="admin" 
            desktopComponent={<AdminMerchants />} 
          />
        )
      case 'transactions':
        return <ResponsiveTransactions type="admin" />
      case 'reports':
        return (
          <ResponsivePageWrapper 
            page="reports" 
            type="admin" 
            desktopComponent={<AdminReports />} 
          />
        )
      case 'settings':
        return (
          <ResponsivePageWrapper 
            page="settings" 
            type="admin" 
            desktopComponent={<AdminSettings />} 
          />
        )
      case 'users':
        return (
          <ResponsivePageWrapper 
            page="users" 
            type="admin" 
            desktopComponent={<AdminUsers />} 
          />
        )
      case 'nodes':
        return <AdminNodes />
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
import { useMobile } from '@/hooks/useMobile'
import { MobileBottomNavbar, MobileBottomNavbarExtended } from './MobileBottomNavbar'
import { ResponsiveAdminTopBar } from './ResponsiveAdminTopBar'
import { ResponsiveMerchantTopBar } from './ResponsiveMerchantTopBar'
import { ResponsiveAdminSidebar } from './ResponsiveAdminSidebar'
import { ResponsiveMerchantSidebar } from './ResponsiveMerchantSidebar'

interface MobileLayoutWrapperProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
  type: 'admin' | 'merchant'
  pageNames: Record<string, string>
}

export function MobileLayoutWrapper({ 
  children, 
  currentPage, 
  onPageChange, 
  type, 
  pageNames 
}: MobileLayoutWrapperProps) {
  const { isMobile, sidebarOpen, toggleSidebar, closeSidebar } = useMobile()

  if (!isMobile) {
    // Desktop layout - original structure
    return (
      <div className="cosmic-bg min-h-screen flex">
        {type === 'admin' ? (
          <ResponsiveAdminSidebar 
            currentPage={currentPage as any} 
            onPageChange={onPageChange as any}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            isMobile={isMobile}
          />
        ) : (
          <ResponsiveMerchantSidebar 
            currentPage={currentPage as any} 
            onPageChange={onPageChange as any}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            isMobile={isMobile}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          {type === 'admin' ? (
            <ResponsiveAdminTopBar 
              onMenuClick={toggleSidebar}
              isMobile={isMobile}
            />
          ) : (
            <ResponsiveMerchantTopBar 
              onMenuClick={toggleSidebar}
              isMobile={isMobile}
            />
          )}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // Mobile layout with bottom navigation
  return (
    <div className="cosmic-bg min-h-screen flex flex-col">
      {/* Mobile Sidebar */}
      {type === 'admin' ? (
        <ResponsiveAdminSidebar 
          currentPage={currentPage as any} 
          onPageChange={onPageChange as any}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          isMobile={isMobile}
        />
      ) : (
        <ResponsiveMerchantSidebar 
          currentPage={currentPage as any} 
          onPageChange={onPageChange as any}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          isMobile={isMobile}
        />
      )}
      
      {/* Top Bar */}
      {type === 'admin' ? (
        <ResponsiveAdminTopBar 
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
        />
      ) : (
        <ResponsiveMerchantTopBar 
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
        />
      )}

      {/* Main Content with Bottom Padding */}
      <main className="flex-1 overflow-auto pb-20">
        {/* Mobile Page Header */}
        <div className="p-4 pb-2">
          <h1 className="text-2xl font-bold gradient-text">{pageNames[currentPage]}</h1>
          <p className="text-sm text-muted-foreground">
            Nexus PAY {type === 'admin' ? 'Admin Panel' : 'Merchant Portal'}
          </p>
        </div>
        
        {/* Page Content */}
        <div className="px-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNavbar 
        currentPage={currentPage}
        onPageChange={onPageChange}
        type={type}
      />
    </div>
  )
}
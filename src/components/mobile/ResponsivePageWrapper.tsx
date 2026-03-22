import { useMobile } from '@/hooks/useMobile'
import { MobileBalance } from './MobileBalance'
import { MobileSettings } from './MobileSettings'
import { MobileApiKeys } from './MobileApiKeys'
import { MobileReports } from './MobileReports'
import { MobileMerchants } from './MobileMerchants'
import { MobileUsers } from './MobileUsers'
import { MobileCryptoWallets } from './MobileCryptoWallets'

interface ResponsivePageWrapperProps {
  page: string
  type: 'admin' | 'merchant'
  desktopComponent: React.ReactNode
}

export function ResponsivePageWrapper({ page, type, desktopComponent }: ResponsivePageWrapperProps) {
  const { isMobile } = useMobile()

  if (!isMobile) {
    return <>{desktopComponent}</>
  }

  // Мобильные версии для Merchant страниц
  if (type === 'merchant') {
    switch (page) {
      case 'balance':
        return <MobileBalance />
      case 'crypto-wallets':
        return <MobileCryptoWallets />
      case 'api-keys':
        return <MobileApiKeys />
      case 'reports':
        return <MobileReports />
      case 'settings':
        return <MobileSettings />
      default:
        return <>{desktopComponent}</>
    }
  }

  // Мобильные версии для Admin страниц
  if (type === 'admin') {
    switch (page) {
      case 'merchants':
        return <MobileMerchants />
      case 'users':
        return <MobileUsers />
      case 'reports':
        return <MobileReports />
      case 'settings':
        return <MobileSettings />
      default:
        return <>{desktopComponent}</>
    }
  }

  return <>{desktopComponent}</>
}
import { useAuth } from '@/contexts/AuthContext'
import { AdminApp } from './admin/AdminApp'
import { MerchantApp } from './merchant/MerchantApp'

export function RoleBasedApp() {
  const { user } = useAuth()

  if (!user) {
    return null // This should not happen as auth is handled in App.tsx
  }

  if (user.role === 'admin') {
    return <AdminApp />
  }

  return <MerchantApp />
}
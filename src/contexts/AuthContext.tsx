import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  switchRole: (role: 'admin' | 'merchant') => void
}

import { api } from '@/lib/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('nexus-user')
    const token = localStorage.getItem('nexus-token')
    
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser)
        if (user.apiKey) {
          localStorage.setItem('merchant-api-key', user.apiKey)
        }
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch {
        localStorage.removeItem('nexus-user')
        localStorage.removeItem('nexus-token')
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await api.login(credentials)
    
    const user: User = {
      id: response.merchant_id || 'admin-session',
      email: credentials.email,
      name: response.role === 'ADMIN' ? 'Administrator' : 'Merchant',
      role: response.role.toLowerCase() as 'admin' | 'merchant',
      status: 'active',
      merchantId: response.merchant_id,
      apiKey: response.api_key,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem('nexus-token', response.access_token)
    localStorage.setItem('nexus-user', JSON.stringify(user))
    if (response.api_key) {
      localStorage.setItem('merchant-api-key', response.api_key)
    }
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const register = async (data: RegisterData) => {
    await api.register({
      email: data.email,
      password: data.password,
      name: data.name,
      // Backend expects 'name' for the merchant name, we'll use 'name' instead of 'companyName' for now
      // since the RegisterData and Backend schemas should align.
    })
    
    // After registration, we usually want to redirect to login or show a message
    // but the current RegisterPage.tsx expects the user to be "logged in" as pending?
    // Let's follow the existing logic but with a real API call.
    
    const user: User = {
      id: 'pending-' + Date.now(),
      email: data.email,
      name: data.name,
      role: 'merchant',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // We don't set the token here because the merchant is PENDING and doesn't have a session yet
    localStorage.setItem('nexus-user', JSON.stringify(user))
    setAuthState({
      user,
      isAuthenticated: false, // Stay on login/register if pending
      isLoading: false,
    })
  }

  const logout = () => {
    localStorage.removeItem('nexus-user')
    localStorage.removeItem('nexus-token')
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const switchRole = (role: 'admin' | 'merchant') => {
    if (authState.user) {
      const updatedUser = { ...authState.user, role }
      localStorage.setItem('nexus-user', JSON.stringify(updatedUser))
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
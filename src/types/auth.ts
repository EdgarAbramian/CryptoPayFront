export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'merchant'
  status: 'active' | 'inactive' | 'pending'
  merchantId?: string
  apiKey?: string
  createdAt: string
  lastLogin?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  companyName: string
  website?: string
}
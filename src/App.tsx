import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { RoleBasedApp } from './components/RoleBasedApp'

function AuthWrapper() {
  const { isAuthenticated, isLoading } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)

  if (isLoading) {
    return (
      <div className="premium-bg min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <img
            src="./logo3.png"
            alt="Nexus PAY"
            className="w-20 h-20 mx-auto object-contain animate-pulse"
          />
          <div className="text-lg gradient-text">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return isLoginMode ? (
      <LoginPage onSwitchToRegister={() => setIsLoginMode(false)} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setIsLoginMode(true)} />
    )
  }

  return <RoleBasedApp />
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}

export default App
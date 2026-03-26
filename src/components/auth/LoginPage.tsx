import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, LogIn, Building } from 'lucide-react'

interface LoginPageProps {
  onSwitchToRegister: () => void
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password })
      toast({
        title: "Login Successful",
        description: "Welcome to Nexus PAY!",
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: 'admin' | 'merchant') => {
    if (role === 'admin') {
      setEmail('admin@nexuspay.com')
      setPassword('admin123')
    } else {
      setEmail('merchant@example.com')
      setPassword('merchant123')
    }
  }

  return (
    <div className="premium-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <img 
            src="./logo3.png" 
            alt="Nexus PAY" 
            className="w-20 h-20 mx-auto object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Nexus PAY</h1>
            <p className="text-muted-foreground">Crypto Payment Gateway</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white">Password</label>
                  <div className="relative mt-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Buttons */}
            <div className="mt-6 space-y-3">
              <div className="text-center text-sm text-muted-foreground">
                Demo Accounts
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => handleDemoLogin('admin')}
                  className="flex items-center space-x-2"
                >
                  <Building className="w-4 h-4" />
                  <span>Admin</span>
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => handleDemoLogin('merchant')}
                  className="flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Merchant</span>
                </Button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-white hover:text-amber-300 transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter, Download, Settings } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FABAction {
  icon: React.ComponentType<any>
  label: string
  onClick: () => void
  color?: string
}

interface MobileFABProps {
  actions?: FABAction[]
  primaryAction?: FABAction
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
}

export function MobileFAB({ 
  actions = [], 
  primaryAction,
  position = 'bottom-right' 
}: MobileFABProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const defaultPrimaryAction = {
    icon: Plus,
    label: 'Add',
    onClick: () => console.log('Add clicked'),
    color: 'gateway-dark-gradient'
  }

  const primary = primaryAction || defaultPrimaryAction

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  }

  const handlePrimaryClick = () => {
    if (actions.length > 0) {
      setIsExpanded(!isExpanded)
    } else {
      primary.onClick()
    }
  }

  return (
    <div className={cn('fixed z-50', positionClasses[position])}>
      {/* Action Buttons */}
      {actions.length > 0 && isExpanded && (
        <div className="flex flex-col space-y-3 mb-3">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center space-x-3">
              {position === 'bottom-right' && (
                <div className="px-3 py-2 bg-black/80 rounded-lg backdrop-blur-sm">
                  <span className="text-sm text-white font-medium">{action.label}</span>
                </div>
              )}
              <Button
                onClick={() => {
                  action.onClick()
                  setIsExpanded(false)
                }}
                className={cn(
                  'w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-all',
                  action.color || 'bg-white/20 hover:bg-white/30'
                )}
                style={{
                  animation: `slideUp 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <action.icon className="w-5 h-5" />
              </Button>
              {position === 'bottom-left' && (
                <div className="px-3 py-2 bg-black/80 rounded-lg backdrop-blur-sm">
                  <span className="text-sm text-white font-medium">{action.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Primary FAB */}
      <Button
        onClick={handlePrimaryClick}
        className={cn(
          'w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-all',
          primary.color || 'gateway-dark-gradient'
        )}
        style={{
          transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <primary.icon className="w-6 h-6" />
      </Button>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

// Предустановленные FAB для разных страниц
export function MerchantBalanceFAB() {
  const actions = [
    {
      icon: Plus,
      label: 'Deposit',
      onClick: () => console.log('Deposit'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Download,
      label: 'Withdraw',
      onClick: () => console.log('Withdraw'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => console.log('Settings'),
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ]

  return <MobileFAB actions={actions} />
}

export function AdminMerchantsFAB() {
  const actions = [
    {
      icon: Plus,
      label: 'Add Merchant',
      onClick: () => console.log('Add Merchant'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: Filter,
      label: 'Advanced Filter',
      onClick: () => console.log('Filter'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Download,
      label: 'Export Data',
      onClick: () => console.log('Export'),
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  return <MobileFAB actions={actions} />
}

export function TransactionsFAB() {
  const actions = [
    {
      icon: Search,
      label: 'Advanced Search',
      onClick: () => console.log('Search'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Filter,
      label: 'Filter',
      onClick: () => console.log('Filter'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: Download,
      label: 'Export',
      onClick: () => console.log('Export'),
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  return <MobileFAB actions={actions} />
}
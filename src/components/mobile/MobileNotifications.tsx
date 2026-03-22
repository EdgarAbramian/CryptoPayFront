import { useState, useEffect } from 'react'
import { X, Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
  time: string
  read: boolean
}

interface MobileNotificationsProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNotifications({ isOpen, onClose }: MobileNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Payment Received',
      message: 'New payment of $1,234.56 from TechCorp Solutions',
      type: 'success',
      time: '2 min ago',
      read: false
    },
    {
      id: '2',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 2:00 AM UTC',
      type: 'warning',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'API Key Expires Soon',
      message: 'Your production API key expires in 7 days',
      type: 'warning',
      time: '3 hours ago',
      read: true
    },
    {
      id: '4',
      title: 'New Feature Available',
      message: 'Check out our new analytics dashboard',
      type: 'info',
      time: '1 day ago',
      read: true
    },
    {
      id: '5',
      title: 'Transaction Failed',
      message: 'Payment #12345 could not be processed',
      type: 'error',
      time: '2 days ago',
      read: false
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      default:
        return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-500/5'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5'
      case 'error':
        return 'border-l-red-500 bg-red-500/5'
      case 'info':
        return 'border-l-blue-500 bg-blue-500/5'
      default:
        return 'border-l-gray-500 bg-gray-500/5'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Блокируем скролл body при открытии
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-black/95 backdrop-blur-xl border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-white/10">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="flex-1 text-xs">
              Mark All Read
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-xs">
              Clear All
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover-glow cursor-pointer border-l-4 ${getNotificationColor(notification.type)} ${!notification.read ? 'border-r-2 border-r-blue-500' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-white/80'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
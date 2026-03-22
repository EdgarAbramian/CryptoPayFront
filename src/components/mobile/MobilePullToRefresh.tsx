import { useState, useRef, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  disabled?: boolean
}

export function MobilePullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80, 
  disabled = false 
}: MobilePullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    
    const container = containerRef.current
    if (!container || container.scrollTop > 0) return
    
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || startY === 0) return
    
    const container = containerRef.current
    if (!container || container.scrollTop > 0) return
    
    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || startY === 0) return
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    
    setStartY(0)
    setPullDistance(0)
  }

  const progress = Math.min(pullDistance / threshold, 1)
  const shouldTrigger = pullDistance >= threshold

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 transition-all"
          style={{
            height: `${Math.max(pullDistance, isRefreshing ? threshold : 0)}px`,
            transform: `translateY(-${isRefreshing ? 0 : threshold - pullDistance}px)`
          }}
        >
          <div className="flex flex-col items-center space-y-2 p-4">
            <div 
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                shouldTrigger || isRefreshing 
                  ? 'border-purple-500 bg-purple-500/20' 
                  : 'border-white/30 bg-white/10'
              }`}
              style={{
                transform: `rotate(${progress * 360}deg)`,
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
              }}
            >
              <RefreshCw 
                className={`w-4 h-4 ${
                  shouldTrigger || isRefreshing ? 'text-purple-400' : 'text-white/60'
                }`} 
              />
            </div>
            <div className={`text-xs font-medium transition-colors ${
              shouldTrigger || isRefreshing ? 'text-purple-400' : 'text-white/60'
            }`}>
              {isRefreshing 
                ? 'Refreshing...' 
                : shouldTrigger 
                  ? 'Release to refresh' 
                  : 'Pull to refresh'
              }
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${pullDistance > 0 ? pullDistance : 0}px)`
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
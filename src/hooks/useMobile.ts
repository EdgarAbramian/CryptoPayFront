import { useState, useEffect, useRef } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Автоматически закрываем сайдбар при переходе на десктоп
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    // Debounced version — prevents rapid-fire re-renders during resize
    const handleResize = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(checkMobile, 150)
    }

    checkMobile() // Run immediately on mount (no debounce needed here)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  // Блокируем скролл body когда мобильное меню открыто
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, sidebarOpen])

  return {
    isMobile,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar: () => setSidebarOpen(!sidebarOpen),
    closeSidebar: () => setSidebarOpen(false)
  }
}
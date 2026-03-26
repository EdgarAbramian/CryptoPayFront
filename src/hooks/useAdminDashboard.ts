/**
 * useAdminDashboard — shared singleton hook for admin dashboard data.
 *
 * Solves: Previously, ResponsiveAdminTopBar, AdminSystemHealth, and AdminStatsGrid
 * each made their own independent API calls to the same endpoints on mount and on
 * separate intervals (15s and 30s). This resulted in 2-3 duplicate requests firing
 * simultaneously.
 *
 * Now: a single module-level state + interval drives all of them.
 * All components read from the same cache — one call per poll cycle.
 */

import { useState, useEffect } from 'react'
import { api, AdminStats, SystemHealth, AdminNotification } from '@/lib/api'

interface AdminDashboardState {
  stats: AdminStats | null
  health: SystemHealth | null
  unreadCount: number
  notifications: AdminNotification[]
  isLoading: boolean
}

// Module-level singleton state — shared across all hook instances
let _state: AdminDashboardState = {
  stats: null,
  health: null,
  unreadCount: 0,
  notifications: [],
  isLoading: true,
}

let _listeners: Array<(state: AdminDashboardState) => void> = []
let _interval: ReturnType<typeof setInterval> | null = null
let _fetchCount = 0

function notify() {
  _listeners.forEach((fn) => fn({ ..._state }))
}

function setState(partial: Partial<AdminDashboardState>) {
  _state = { ..._state, ...partial }
  notify()
}

async function fetchAll() {
  try {
    const [stats, health, unread] = await Promise.all([
      api.getAdminStats(),
      api.getSystemHealth(),
      api.getUnreadNotificationsCount(),
    ])
    setState({ stats, health, unreadCount: unread.count, isLoading: false })
  } catch {
    setState({ isLoading: false })
  }
}

function startPolling() {
  if (_interval !== null) return
  fetchAll()
  // Single shared interval at 60s — was 15s+30s before across multiple components
  _interval = setInterval(fetchAll, 60_000)
}

function stopPolling() {
  if (_interval !== null) {
    clearInterval(_interval)
    _interval = null
  }
}

export function useAdminDashboard() {
  const [state, setLocalState] = useState<AdminDashboardState>(_state)

  useEffect(() => {
    // Subscribe
    const listener = (s: AdminDashboardState) => setLocalState(s)
    _listeners.push(listener)
    _fetchCount++

    if (_fetchCount === 1) {
      startPolling()
    } else {
      // Already have data — push current state immediately
      setLocalState({ ..._state })
    }

    return () => {
      _listeners = _listeners.filter((fn) => fn !== listener)
      _fetchCount--
      if (_fetchCount === 0) {
        stopPolling()
        // Reset state when all consumers unmount (e.g., admin logs out)
        _state = {
          stats: null,
          health: null,
          unreadCount: 0,
          notifications: [],
          isLoading: true,
        }
      }
    }
  }, [])

  const refetchNotifications = async () => {
    try {
      const res = await api.getNotifications()
      setState({ notifications: res })
    } catch {}
  }

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id)
      setState({
        notifications: _state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
      })
      const unread = await api.getUnreadNotificationsCount()
      setState({ unreadCount: unread.count })
    } catch {}
  }

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead()
      setState({
        notifications: _state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      })
    } catch {}
  }

  return {
    ...state,
    refetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}

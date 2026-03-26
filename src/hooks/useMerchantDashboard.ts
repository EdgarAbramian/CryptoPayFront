/**
 * useMerchantDashboard — shared singleton hook for merchant dashboard data.
 *
 * Solves: Previously, ResponsiveMerchantTopBar, MerchantStatsGrid, and
 * MobileMerchantStatsGrid each fetched data independently (or used hardcoded fake data).
 * This caused 2-3 redundant API calls on every merchant dashboard page load.
 *
 * Now: single fetch on mount, shared across all components.
 */

import { useState, useEffect } from 'react'
import { api, MerchantDashboardStats, RevenueOverview } from '@/lib/api'

interface MerchantDashboardState {
  stats: MerchantDashboardStats | null
  revenue: RevenueOverview | null
  isLoading: boolean
}

// Module-level singleton
let _state: MerchantDashboardState = {
  stats: null,
  revenue: null,
  isLoading: true,
}

let _listeners: Array<(state: MerchantDashboardState) => void> = []
let _subscriberCount = 0
let _fetched = false

function notify() {
  _listeners.forEach((fn) => fn({ ..._state }))
}

function setState(partial: Partial<MerchantDashboardState>) {
  _state = { ..._state, ...partial }
  notify()
}

async function fetchAll() {
  try {
    const [stats, revenue] = await Promise.all([
      api.getMerchantDashboardStats(),
      api.getMerchantRevenueAnalytics({ period: 'day' }),
    ])
    setState({ stats, revenue, isLoading: false })
  } catch {
    setState({ isLoading: false })
  }
}

export function useMerchantDashboard() {
  const [state, setLocalState] = useState<MerchantDashboardState>(_state)

  useEffect(() => {
    const listener = (s: MerchantDashboardState) => setLocalState(s)
    _listeners.push(listener)
    _subscriberCount++

    if (!_fetched) {
      _fetched = true
      fetchAll()
    } else {
      // Already fetched — push current state immediately
      setLocalState({ ..._state })
    }

    return () => {
      _listeners = _listeners.filter((fn) => fn !== listener)
      _subscriberCount--
      if (_subscriberCount === 0) {
        // Reset when merchant logs out
        _state = { stats: null, revenue: null, isLoading: true }
        _fetched = false
      }
    }
  }, [])

  const refetch = () => {
    setState({ isLoading: true })
    fetchAll()
  }

  return { ...state, refetch }
}

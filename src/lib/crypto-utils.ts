/**
 * Utility functions for cryptocurrency operations
 */

export const formatCryptoAmount = (amount: number, currency: string): string => {
  if (currency === 'USDT' || currency === 'USDC') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  if (amount < 0.001) {
    return `${amount.toFixed(8)} ${currency}`
  } else if (amount < 1) {
    return `${amount.toFixed(6)} ${currency}`
  } else {
    return `${amount.toFixed(4)} ${currency}`
  }
}

export const validateCryptoAddress = (address: string, network: string): boolean => {
  if (!address) return false
  
  switch (network.toLowerCase()) {
    case 'bitcoin':
      // Bitcoin address validation (Legacy, SegWit, Bech32)
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/.test(address)
    
    case 'ethereum':
    case 'erc-20':
    case 'bep-20':
      // Ethereum address validation
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    
    case 'trc-20':
      // TRON address validation
      return /^T[a-zA-Z0-9]{33}$/.test(address)
    
    default:
      return false
  }
}

export const getNetworkExplorerUrl = (txHash: string, currency: string, network: string): string | null => {
  if (!txHash) return null
  
  switch (network.toLowerCase()) {
    case 'bitcoin':
      return `https://blockstream.info/tx/${txHash}`
    
    case 'ethereum':
    case 'erc-20':
      return `https://etherscan.io/tx/${txHash}`
    
    case 'bep-20':
      return `https://bscscan.com/tx/${txHash}`
    
    case 'trc-20':
      return `https://tronscan.org/#/transaction/${txHash}`
    
    default:
      return null
  }
}

export const generateMockAddress = (network: string): string => {
  switch (network.toLowerCase()) {
    case 'bitcoin':
      return 'bc1q' + Math.random().toString(36).substring(2, 42)
    
    case 'ethereum':
    case 'erc-20':
    case 'bep-20':
      return '0x' + Math.random().toString(16).substring(2, 42)
    
    case 'trc-20':
      return 'T' + Math.random().toString(36).substring(2, 35).toUpperCase()
    
    default:
      return ''
  }
}

export const generateMockTxHash = (network: string): string => {
  switch (network.toLowerCase()) {
    case 'bitcoin':
      return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    case 'ethereum':
    case 'erc-20':
    case 'bep-20':
    case 'trc-20':
      return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    default:
      return ''
  }
}

export const getEstimatedConfirmationTime = (network: string, confirmations: number): number => {
  // Returns estimated time in minutes
  const timePerConfirmation = {
    'bitcoin': 10,     // ~10 minutes per confirmation
    'ethereum': 2,     // ~2 minutes per confirmation
    'erc-20': 2,
    'bep-20': 0.5,     // ~30 seconds per confirmation
    'trc-20': 0.5      // ~30 seconds per confirmation
  }
  
  const baseTime = timePerConfirmation[network.toLowerCase() as keyof typeof timePerConfirmation] || 5
  return baseTime * confirmations
}

export const formatTimeRemaining = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  }
  
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  if (minutes < 60) {
    return `${minutes}m ${seconds}s`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  return `${hours}h ${remainingMinutes}m`
}

export const getCryptocurrencyIcon = (symbol: string): string => {
  const iconMap: Record<string, string> = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'USDT': '₮',
    'USDC': '$',
    'BNB': 'B',
    'ADA': '₳',
    'DOT': '●',
    'LINK': '🔗',
    'LTC': 'Ł',
    'BCH': 'Ƀ'
  }
  
  return iconMap[symbol.toUpperCase()] || symbol.slice(0, 2).toUpperCase()
}

export const getNetworkColor = (network: string): string => {
  const colorMap: Record<string, string> = {
    'bitcoin': 'text-orange-500',
    'ethereum': 'text-blue-500',
    'erc-20': 'text-blue-500',
    'bep-20': 'text-yellow-500',
    'trc-20': 'text-red-500'
  }
  
  return colorMap[network.toLowerCase()] || 'text-gray-500'
}

export const getFeeEstimate = (network: string, priority: 'low' | 'medium' | 'high' = 'medium'): number => {
  // Mock fee estimates in respective currencies
  const feeEstimates = {
    'bitcoin': { low: 0.00005, medium: 0.0001, high: 0.0002 },
    'ethereum': { low: 0.001, medium: 0.002, high: 0.005 },
    'erc-20': { low: 2, medium: 5, high: 10 }, // USDT fees
    'bep-20': { low: 0.1, medium: 0.5, high: 1 },
    'trc-20': { low: 0.1, medium: 1, high: 2 }
  }
  
  const networkFees = feeEstimates[network.toLowerCase() as keyof typeof feeEstimates]
  return networkFees ? networkFees[priority] : 0
}
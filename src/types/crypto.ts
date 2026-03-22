export interface CryptoWallet {
  currency: string
  symbol: string
  balance: number
  pendingBalance: number
  address: string
  network: string
  iconUrl?: string
}

export interface CryptoTransaction {
  id: string
  type: 'deposit' | 'withdrawal'
  currency: string
  amount: number
  address: string
  txHash?: string
  status: 'NEW' | 'PENDING' | 'PARTIAL' | 'PAID' | 'EXPIRED' | 'confirming' | 'completed' | 'failed'
  confirmations: number
  requiredConfirmations: number
  fee: number
  timestamp: string
  estimatedTime?: number // в минутах
}

export interface DepositRequest {
  currency: string
  amount: number
  network: string
}

export interface WithdrawalRequest {
  currency: string
  amount: number
  address: string
  network: string
  memo?: string
}

export interface CryptoCurrency {
  symbol: string
  name: string
  networks: CryptoNetwork[]
  minDeposit: number
  minWithdrawal: number
  iconUrl: string
}

export interface CryptoNetwork {
  network: string
  name: string
  withdrawalFee: number
  minConfirmations: number
  contractAddress?: string
  isEnabled: boolean
}

export interface TransactionTimer {
  transactionId: string
  startTime: number
  estimatedTime: number // в миллисекундах
  status: 'running' | 'completed' | 'expired'
}
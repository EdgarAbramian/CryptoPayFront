const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8001/api';
const ADMIN_SECRET = (import.meta as any).env?.VITE_ADMIN_SECRET || '';

async function fetchApi(
  path: string,
  options: any = {},
  version: 'admin' | 'v1' = 'admin'
) {
  const url = `${API_URL}/${version}${path}`;
  const { responseType = 'json', ...restOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('nexus-token') ? { 'Authorization': `Bearer ${localStorage.getItem('nexus-token')}` } : {}),
  };

  // Add Merchant API Key if available and requested for v1
  if (version === 'v1') {
    const apiKey = localStorage.getItem('merchant-api-key');
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
  }

  if (restOptions.headers) {
    Object.assign(headers, restOptions.headers);
  }

  // Only send Admin Secret if explicitly requested for admin endpoints
  if (version === 'admin' && ADMIN_SECRET) {
    headers['X-Admin-Secret'] = ADMIN_SECRET;
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  return response.json();
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: string;
  merchant_id?: string;
  api_key?: string;
}

export interface AdminStats {
  total_revenue: string;
  transaction_volume: string;
  active_merchants: number;
  success_rate: number;
  pending_merchants: number;
  total_transactions: number;
  today_transactions: number;
  active_nodes: number;
  breakdown: Record<string, { revenue: string; volume: string }>;
}

export interface SystemHealth {
  status: string;
  cpu_load: number;
  ram_usage: number;
  disk_usage: number;
  db_connected: boolean;
  redis_connected: boolean;
  uptime_seconds: number;
  celery_workers: number;
}

export interface RecentTransaction {
  id: string;
  txid: string;
  merchant_name: string | null;
  amount_usd: number | string;
  amount_fiat?: number | string;
  amount?: number | string;
  amount_received?: number | string;
  coin_symbol?: string;
  fiat_currency?: string;
  status: string;
  confirmed_at: string | null;
}

export interface TopMerchant {
  id: string;
  name: string | null;
  total_volume_usd: number;
  transaction_count: number;
}

export interface SearchMerchantItem {
  id: string;
  name?: string | null;
  email?: string | null;
  status: string;
}

export interface SearchTransactionItem {
  id: string;
  txid: string;
  amount_usd: number;
  status: string;
}

export interface SearchInvoiceItem {
  id: string;
  address: string;
  amount: string;
  status: string;
}

export interface GlobalSearchResponse {
  merchants: SearchMerchantItem[];
  transactions: SearchTransactionItem[];
  invoices: SearchInvoiceItem[];
}

export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MerchantStats {
  total: number;
  active: number;
  pending: number;
  total_volume_usd: string;
}

export interface MerchantListItem {
  id: string;
  api_key: string;
  name: string;
  email: string;
  commission_pcent: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  tier: string;
  volume_usd: string;
  transaction_count: number;
  created_at: string;
}

export interface MerchantCreateRequest {
  name: string;
  email: string;
  commission_pcent?: number;
  webhook_url?: string;
  note?: string;
}

export interface MerchantUpdateRequest {
  name?: string;
  email?: string;
  commission_pcent?: number;
  webhook_url?: string;
  note?: string;
  status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  tier?: string;
}

export interface MerchantDashboardStats {
  total_volume_usd: number;
  total_transactions: number;
  success_rate: number;
  balance_available_usd: number;
  balance_pending_usd: number;
}

export interface AnalyticsOverviewData {
  total_volume: { current: number; previous: number; change_pcent: number };
  avg_transaction_value: { current: number; previous: number; change_pcent: number };
  conversion_rate: { current: number; previous: number; change_pcent: number };
  active_merchants: { current: number; previous: number; change_pcent: number };
}

export interface HourlyVolumeData {
  hour: string;
  volume: number;
  transactions: number;
}

export interface PaymentMethodData {
  name: string;
  value_usd: number;
  percentage: number;
}

export interface GeographicData {
  name: string;
  code: string;
  volume: number;
  percentage: number;
  growth: number;
}

export interface ReportSummary {
  total_volume_usd: number;
  successful_transactions: number;
  average_order_value: number;
  abandonment_rate: number;
}

export interface CoinDistribution {
  symbol: string;
  volume_usd: number;
  percentage: number;
}

export interface GeoStat {
  country_code: string;
  volume_usd: number;
  success_rate: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  count: number;
}

export interface RevenueOverview {
  total_revenue_usd: number;
  change_percentage: number;
  data_points: RevenueDataPoint[];
}

export const api = {
  // Authentication
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, 'v1'),

  register: (data: any) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, 'v1'),

  // --- ADMIN APIs ---
  getAdminStats: (): Promise<AdminStats> => fetchApi('/stats'),
  getRevenueChart: (period = 'day') => fetchApi(`/charts/revenue?period=${period}`),
  getSystemHealth: (): Promise<SystemHealth> => fetchApi('/system/health'),
  getNodes: (): Promise<any[]> => fetchApi('/nodes'),
  getAuditLogs: () => fetchApi('/system/audit-logs'),
  globalSearch: (q: string, limit = 5): Promise<GlobalSearchResponse> => 
    fetchApi(`/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  getRecentTransactions: (limit = 5): Promise<RecentTransaction[]> => fetchApi(`/transactions/recent?limit=${limit}`),
  
  getTopMerchants: (period = 'all', limit = 5): Promise<TopMerchant[]> => 
    fetchApi(`/merchants/top?period=${period}&limit=${limit}`),

  getAdminMerchantStats: (): Promise<MerchantStats> => fetchApi('/merchants/stats'),

  getMerchants: (params: { search?: string; status?: string; limit?: number; offset?: number } = {}): Promise<MerchantListItem[]> => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.offset) query.append('offset', params.offset.toString());
    return fetchApi(`/merchants${query.toString() ? `?${query.toString()}` : ''}`);
  },

  createMerchant: (data: MerchantCreateRequest) =>
    fetchApi('/merchants', { method: 'POST', body: JSON.stringify(data) }),

  updateMerchant: (id: string, data: MerchantUpdateRequest) =>
    fetchApi(`/merchants/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  rotateMerchantKey: (id: string) => fetchApi(`/merchants/${id}/rotate-key`, { method: 'POST' }),

  getTransactions: (params: any = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v.toString());
    });
    return fetchApi(`/transactions${query.toString() ? `?${query.toString()}` : ''}`);
  },

  getTransactionDetails: (txId: string): Promise<any> => fetchApi(`/transactions/${txId}`),

  exportTransactions: (params: any, format: 'csv' | 'xlsx' = 'csv') => {
    const query = new URLSearchParams(params);
    query.append('format', format);
    return fetchApi(`/transactions/export?${query.toString()}`, { responseType: 'blob' }, 'admin');
  },

  getNotifications: (limit=10, offset=0): Promise<AdminNotification[]> => fetchApi(`/notifications?limit=${limit}&offset=${offset}`),
  getUnreadNotificationsCount: (): Promise<{ count: number }> => fetchApi('/notifications/unread-count'),
  markNotificationAsRead: (id: string) => fetchApi(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsAsRead: () => fetchApi('/notifications/read-all', { method: 'POST' }),

  getUsers: () => fetchApi('/users'),

  // --- ADMIN APIs (Legacy/Compatibility) ---
  getStats: (): Promise<any> => fetchApi('/stats'),
  getHourlyVolume: (): Promise<any[]> => fetchApi('/charts/volume?period=hour'),
  getPaymentMethodsAnalytics: (): Promise<any[]> => fetchApi('/charts/payment-methods'),
  getGeographicAnalytics: (): Promise<any[]> => fetchApi('/charts/geographic'),

  // --- MERCHANT APIs (V1) ---
  getMerchantProfile: () => fetchApi('/merchant/me', {}, 'v1'),
  updateMerchantProfile: (data: any) => fetchApi('/merchant/me', { method: 'PATCH', body: JSON.stringify(data) }, 'v1'),
  rotateMyApiKey: (): Promise<{ api_key: string }> => fetchApi('/merchant/me/rotate-key', { method: 'POST' }, 'v1'),
  getMerchantDashboardStats: (): Promise<MerchantDashboardStats> => fetchApi('/merchant/stats', {}, 'v1'),
  
  createInvoice: (data: { amount: number, coin_symbol: string, amount_usd?: number, description?: string, customer_email?: string, country_code?: string }): Promise<any> => 
    fetchApi('/invoices/create', { method: 'POST', body: JSON.stringify(data) }, 'v1'),
  
  simulatePayment: (data: { invoice_id: string, amount_received: number }): Promise<any> => 
    fetchApi('/dev/simulate-payment', { method: 'POST', body: JSON.stringify(data) }, 'v1'),

  getMerchantTransactions: (params: any = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v.toString());
    });
    return fetchApi(`/merchant/transactions?${query.toString()}`, {}, 'v1');
  },

  exportMerchantTransactions: (filters: any, format: 'csv' | 'xlsx' = 'csv') => {
    const params = new URLSearchParams(filters);
    params.append('format', format);
    
    return fetchApi(`/merchant/transactions/export?${params.toString()}`, { 
      responseType: 'blob' 
    }, 'v1')
  },

  getMerchantInvoices: (limit = 50, offset = 0) => fetchApi(`/merchant/invoices?limit=${limit}&offset=${offset}`, {}, 'v1'),
  getAvailableCoins: (): Promise<any[]> => fetchApi('/merchant/coins', {}, 'v1'),
  getMerchantReportSummary: (params: { start_date?: string; end_date?: string } = {}): Promise<ReportSummary> => {
    const query = new URLSearchParams();
    if (params.start_date) query.append('start_date', params.start_date);
    if (params.end_date) query.append('end_date', params.end_date);
    return fetchApi(`/merchant/reports/summary${query.toString() ? `?${query.toString()}` : ''}`, {}, 'v1');
  },
  getMerchantCoinDistribution: (): Promise<CoinDistribution[]> => 
    fetchApi('/merchant/reports/coin-distribution', {}, 'v1'),
  getMerchantGeoStats: (): Promise<GeoStat[]> => 
    fetchApi('/merchant/reports/geo-stats', {}, 'v1'),
  getMerchantRevenueAnalytics: (params: { period?: string; coin_id?: number } = {}): Promise<RevenueOverview> => {
    const query = new URLSearchParams();
    if (params.period) query.append('period', params.period);
    if (params.coin_id) query.append('coin_id', params.coin_id.toString());
    return fetchApi(`/merchant/analytics/revenue${query.toString() ? `?${query.toString()}` : ''}`, {}, 'v1');
  },
  getAnalyticsOverview: (): Promise<AnalyticsOverviewData> => fetchApi('/analytics/overview'),
};

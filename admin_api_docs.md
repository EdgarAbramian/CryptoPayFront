# Admin API Documentation

**Base URL**: `http://127.0.0.1:8001/api/admin`  
**Authentication**: All requests MUST include the header `Authorization: Bearer <JWT_TOKEN>`.

---

## 🔐 Authentication (Аутентификация)

### `POST /auth/login`
Получение JWT токена для доступа к админ-панели.

**Request Body**:
```json
{
  "email": "admin@nexuspay.com",
  "password": "admin123"
}
```

**Response Body**:
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "role": "ADMIN"
}
```

---

## 1. Global Analytics (Dashboard)

### `GET /stats`
Provides high-level KPI metrics for the platform summary grid.

**Response Body**:
```json
{
  "total_revenue": "12500.50",
  "transaction_volume": "850000.00",
  "active_merchants": 42,
  "success_rate": 98.5,
  "pending_merchants": 3,
  "total_transactions": 1250,
  "today_transactions": 10,
  "active_nodes": 1,
  "breakdown": {
    "BTC": { "revenue": "0.0012", "volume": "0.1500" },
    "USDT": { "revenue": "150.00", "volume": "15000.00" }
  }
}
```

### `GET /charts/revenue`
Data for revenue line charts over time (calculated from `fee_amount_usd`).

**Query Parameters**:
- `period`: Filter grouping (`day`, `week`, `month`). Default: `month`.

**Response Body**:
```json
{
  "data": [
    { "date": "2024-03-01T00:00:00", "revenue": 120.00 },
    { "date": "2024-03-02T00:00:00", "revenue": 150.00 }
  ]
}
```

### `GET /transactions/recent`
Виджет для главной страницы (последние 5-10 штук).

**Query Parameters**:
- `limit`: Default 5.

**Response Body**:
```json
[
  {
    "id": "uuid",
    "txid": "...",
    "merchant_name": "Premium Store",
    "amount_usd": "150.00",
    "status": "CONFIRMED",
    "confirmed_at": "ISO-DATE"
  }
]
```

---

## 2. Merchant Management

### `GET /merchants/top`
Рейтинг лучших мерчантов по обороту.

**Query Parameters**:
- `period`: `day`, `week`, `month`, [all](file:///d:/PycharmProject/crypto_payment/providers/registry.py#47-49). Default: [all](file:///d:/PycharmProject/crypto_payment/providers/registry.py#47-49).
- `limit`: Default 5.

**Response Body**:
```json
[
  {
    "id": "uuid",
    "name": "Premium Store",
    "total_volume_usd": "50000.00",
    "transaction_count": 120
  }
]
```

### `GET /merchants/stats`
Агрегированная статистика для верхних карточек в разделе мерчантов.

**Response Body**:
```json
{
  "total": 120,
  "active": 115,
  "pending": 5,
  "total_volume_usd": "1500600.00"
}
```

### `GET /merchants`
Paginated list of merchants with search and status filtering.

**Query Parameters**:
- [search](file:///d:/PycharmProject/crypto_payment/services/api/routers/admin_routes/admin_search.py#55-112): Search by Name, Email, ID or API Key.
- [status](file:///d:/PycharmProject/crypto_payment/services/api/routers/admin_routes/admin_transactions.py#15-19): Filter by status (`ACTIVE`, `PENDING`, `SUSPENDED`).
- `limit`/`offset`: Pagination.

**Response Body**:
```json
[
  {
    "id": "uuid",
    "api_key": "m_key_...",
    "name": "Amazon Store",
    "email": "shop@amazon.com",
    "commission_pcent": 1.0,
    "status": "ACTIVE",
    "tier": "GOLD",
    "volume_usd": "5000.00",
    "transaction_count": 142,
    "created_at": "ISO-DATE"
  }
]
```

### `POST /merchants`
Регистрация нового мерчанта.

**Request Body**:
```json
{
  "name": "New Store",
  "email": "owner@store.com",
  "commission_pcent": 1.5,
  "webhook_url": "https://callback.url",
  "note": "Internal info"
}
```

**Response Body**:
```json
{
  "id": "uuid",
  "api_key": "GENERATED_KEY",
  "name": "New Store",
  "email": "owner@store.com",
  "status": "PENDING",
  "balances": [
    { "coin_symbol": "BTC", "amount_available": "0", "amount_locked": "0" }
  ]
}
```

---

## 3. Transaction Monitoring

### `GET /transactions`
Global log of all payment transactions. Includes normalization to USD, filtering by status, and fee tracking.

**Query Parameters**:
- [search](file:///d:/PycharmProject/crypto_payment/services/api/routers/admin_routes/admin_search.py#55-112): Search by `TXID`, `deposit address`, `customer_email`, or `merchant_name`.
- [status](file:///d:/PycharmProject/crypto_payment/services/api/routers/admin_routes/admin_transactions.py#15-19): Filter by status ([all](file:///d:/PycharmProject/crypto_payment/providers/registry.py#47-49), `completed`, `pending`, `failed`).
- `limit`/`offset`: Pagination.

**Response Body**:
```json
[
  {
    "id": "uuid",
    "txid": "aba31e4f...",
    "merchant_id": "uuid",
    "merchant_name": "Premium Store",
    "amount_received": "0.150000",
    "amount_usd": "6500.00",
    "coin_symbol": "BTC",
    "fiat_currency": "USD",
    "fee": "0.0001",
    "status": "completed",
    "confirmations": 6,
    "created_at": "2024-03-21T14:30:00Z",
    "confirmed_at": "2024-03-21T14:45:00Z"
  }
]
```

### `GET /transactions/{tx_id}`
Detailed information for a specific transaction.

**Response Body**:
```json
{
  "id": "uuid",
  "txid": "aba31e4f...",
  "status": "completed",
  "merchant": {
    "id": "uuid",
    "name": "Premium Store"
  },
  "customer_email": "user@example.com",
  "deposit_address": "bc1q...",
  "amount_expected": "0.150000",
  "amount_received": "0.150000",
  "amount_usd": "6500.00",
  "coin_symbol": "BTC",
  "fee": "0.0001",
  "confirmations": 6,
  "created_at": "2024-03-21T14:30:00Z",
  "confirmed_at": "2024-03-21T14:45:00Z",
  "webhook_logs": [],
  "network_info": {}
}
```

### `GET /transactions/export`
Export filtered transactions to CSV. Accepts the same [search](file:///d:/PycharmProject/crypto_payment/services/api/routers/admin_routes/admin_search.py#55-112) and [status](file:///d:/PycharmProject/crypto_payment/services/api/routers/admin_routes/admin_transactions.py#15-19) filters as the list endpoint.

**Response**:
- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename=transactions.csv`

---

## 4. User & System Management

### `GET /users`
Управление списком пользователей (админы, мерчанты).

**Response Body**:
```json
[
  {
    "id": "uuid",
    "email": "admin@nexuspay.com",
    "role": "ADMIN",
    "is_active": true,
    "created_at": "ISO-DATE"
  }
]
```

### `GET /system/audit-logs`
Security trail of administrative actions.

**Response Body**:
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "action": "UPDATE_MERCHANT_STATUS",
    "target_type": "merchants",
    "target_id": "uuid",
    "created_at": "ISO-DATE"
  }
]
```

---

## 5. Nodes & Infrastructure

### `GET /nodes`
Real-time status of connected blockchain nodes.

**Response Body**:
```json
[
  {
    "id": "btc-01",
    "coin": "BTC",
    "block_height": 835201,
    "status": "synced",
    "uptime": "99.9%",
    "peers": 12
  }
]
```

### `GET /system/health`
Monitoring of server resources and database connectivity.

**Response Body**:
```json
{
  "status": "healthy",
  "cpu_load": 12.5,
  "ram_usage": 42.1,
  "disk_usage": 15.0,
  "db_connected": true,
  "redis_connected": true,
  "uptime_seconds": 3600,
  "celery_workers": 0
}
```

---

## 5. Admin Header Components

### `GET /search`
Глобальный поиск по мерчантам, транзакциям и инвойсам.

**Query Parameters**:
- `q`: Search string (e.g. TXID, email).
- `limit`: Default 5.

**Response Body**:
```json
{
  "merchants": [
    { "id": "uuid", "name": "Store", "email": "a@a.com", "status": "ACTIVE" }
  ],
  "transactions": [
    { "id": "uuid", "txid": "hash", "amount_usd": 100.5, "status": "CONFIRMED" }
  ],
  "invoices": [
    { "id": "uuid", "address": "bc1q...", "amount": "0.05", "status": "PAID" }
  ]
}
```

### `GET /notifications/unread-count`
Количество непрочитанных уведомлений (счетчик для бейджа).

**Response Body**:
```json
{
  "count": 5
}
```

### `GET /notifications`
Список уведомлений (выпадающее окно).

**Query Parameters**:
- `limit`: Default 10.
- `offset`: Default 0.

**Response Body**:
```json
[
  {
    "id": "uuid",
    "type": "MERCHANT_REGISTERED",
    "message": "New merchant Premium Store registered.",
    "is_read": false,
    "created_at": "ISO-DATE"
  }
]
```

### `PATCH /notifications/{notification_id}/read`
Отметить конкретное уведомление как прочитанное.

**Response Body**:
```json
{
  "status": "ok"
}
```

### `POST /notifications/read-all`
Отметить все уведомления как прочитанные (сбросить счетчик).

**Response Body**:
```json
{
  "status": "ok"
}
```

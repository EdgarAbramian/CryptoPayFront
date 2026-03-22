# Merchant API Service: Reports & Analytics

This document describes the newly implemented endpoints for the Merchant Portal's Reports and Revenue sections.

## 1. Summary Statistics
**Endpoint:** `GET /api/v1/merchant/reports/summary`  
**Description:** Provides high-level KPIs for a specified period (volume, transactions, avg value, abandonment rate).

### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `start_date` | ISO Date | No | Filter from this date (inclusive) |
| `end_date` | ISO Date | No | Filter to this date (inclusive) |

### Response ([ReportSummaryOut](file:///d:/PycharmProject/crypto_payment/services/api/routers/merchant.py#90-95))
```json
{
  "total_volume_usd": 12500.50,
  "successful_transactions": 150,
  "average_order_value": 83.34,
  "abandonment_rate": 12.5
}
```

---

## 2. Coin Distribution
**Endpoint:** `GET /api/v1/merchant/reports/coin-distribution`  
**Description:** Used for pie/donut charts to show asset popularity.

### Response (`list[CoinDistributionOut]`)
```json
[
  {
    "symbol": "BTC",
    "volume_usd": 8000.00,
    "percentage": 64.0
  },
  {
    "symbol": "ETH",
    "volume_usd": 4500.50,
    "percentage": 36.0
  }
]
```

---

## 3. Geographic Performance
**Endpoint:** `GET /api/v1/merchant/reports/geo-stats`  
**Description:** Aggregated data by country.

### Response (`list[GeoStatOut]`)
```json
[
  {
    "country_code": "US",
    "volume_usd": 5000.00,
    "success_rate": 95.5
  },
  {
    "country_code": "UK",
    "volume_usd": 3000.00,
    "success_rate": 88.2
  }
]
```

---

## 4. Revenue Analytics (Chart Data)
**Endpoint:** `GET /api/v1/merchant/analytics/revenue`  
**Description:** Historical revenue data for time-series charts.

### Query Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| [period](file:///d:/PycharmProject/crypto_payment/services/api/routers/admin_routes/admin_analytics.py#76-119) | String | `month` | One of: `day`, `week`, `month`, `year` |
| `coin_id` | Integer | null | Filter by specific asset ID |

### Response ([RevenueOverviewOut](file:///d:/PycharmProject/crypto_payment/services/api/routers/merchant.py#115-119))
```json
{
  "total_revenue_usd": 12500.50,
  "change_percentage": 5.2,
  "data_points": [
    { "date": "2026-03-01", "revenue": 1200.00, "count": 15 },
    { "date": "2026-03-02", "revenue": 850.50, "count": 10 }
  ]
}
```
*Note: If `period=day`, the [date](file:///d:/PycharmProject/crypto_payment/services/api/routers/merchant.py#158-177) format will be `YYYY-MM-DD HH:mm`.*

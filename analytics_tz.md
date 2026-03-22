# Technical Task: Admin Analytics Endpoints (Reports Section)

## Objective
Implement specialized analytics endpoints to power the "Reports" section of the Admin Panel. These endpoints should provide aggregated data with period-over-period comparisons.

## 1. Analytics Overview
**Endpoint**: `GET /api/admin/analytics/overview`

**Description**: Provides KPIs for the last 30 days compared to the preceding 30 days.

**Response Schema**:
```json
{
  "total_volume": {
    "current": 12847293.00,
    "previous": 10411096.00,
    "change_pcent": 23.4
  },
  "avg_transaction_value": {
    "current": 847.32,
    "previous": 751.17,
    "change_pcent": 12.8
  },
  "conversion_rate": {
    "current": 94.7,
    "previous": 92.7,
    "change_pcent": 2.1
  },
  "active_merchants": {
    "current": 8934,
    "previous": 9042,
    "change_pcent": -1.2
  }
}
```

## 2. 24h Volume Distribution
**Endpoint**: `GET /api/admin/analytics/volume-hourly`

**Description**: Returns transaction volume and count for each of the last 24 hours.

**Response Schema**:
```json
[
  { "hour": "00:00", "volume": 45000.0, "transactions": 120 },
  { "hour": "01:00", "volume": 32000.0, "transactions": 89 },
  ... (24 points total)
]
```

## 3. Payment Methods Distribution
**Endpoint**: `GET /api/admin/analytics/payment-methods`

**Description**: Breakdown of total volume by cryptocurrency.

**Response Schema**:
```json
[
  { "name": "Bitcoin", "value_usd": 450000.0, "percentage": 35.4 },
  { "name": "Ethereum", "value_usd": 360000.0, "percentage": 28.7 },
  { "name": "USDC", "value_usd": 240000.0, "percentage": 18.9 },
  ...
]
```

## 4. Geographic Distribution (Placeholder/Draft)
**Endpoint**: `GET /api/admin/analytics/geographic`

**Requirement**: While full GeoIP detection isn't implemented, provide top "Global Regions" based on volume.
*Optional*: If possible, derive country from `customer_email` TLD or use a temporary mock structure.

**Response Schema**:
```json
[
  { "name": "United States", "code": "US", "volume": 8947293, "percentage": 34.2, "growth": 12.4 },
  { "name": "Germany", "code": "DE", "volume": 3829472, "percentage": 14.6, "growth": 15.2 },
  ...
]
```

## Technical Notes:
- Use `SystemFeeLog.gross_amount_usd` for volume calculations.
- Use `Invoice.status == 'PAID'` for conversion rate.
- Grouping should be performed at the database level where possible using `date_trunc`.

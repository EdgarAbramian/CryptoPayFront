# Technical Task: Transactions Filtering & Export

## Objective
Enhance the transaction management system by providing advanced filtering capabilities and the ability to export transaction logs in CSV/XLSX formats.

## 1. Advanced Filtering
**Endpoint**: `GET /api/admin/transactions`

**New Query Parameters**:
- `merchant_id` (UUID): Filter by a specific merchant.
- `coin_id` (int): Filter by cryptocurrency type.
- `status` (string): `NEW`, `PENDING`, `PARTIAL`, `PAID`, `EXPIRED`.
- `date_from` (ISO 8601): Start of the time range.
- `date_to` (ISO 8601): End of the time range.
- `min_amount_usd` (float): Minimum transaction volume in USD.
- `max_amount_usd` (float): Maximum transaction volume in USD.
- `search` (string): Existing search by TXID, deposit address, or customer email.

**Implementation Note**:
Use a unified filtering logic in the repository/service layer that can be reused for both listing and exporting.

## 2. Data Export
**Endpoint**: `GET /api/admin/transactions/export`

**Description**: Generates and returns a downloadable file containing the filtered list of transactions.

**Query Parameters**:
- Same as above for filtering.
- `format` (string): `csv` or `xlsx`. Default: `csv`.

**Response**:
- `Content-Type`: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
- `Content-Disposition`: `attachment; filename="transactions_YYYY-MM-DD.csv"`.

## 3. Support Endpoints
To populate filter dropdowns:
- `GET /api/admin/merchants/list-compact`: Returns a list of all merchants (id, name) for selection in the filter.
- `GET /api/admin/coins`: Already exists, will be used to list cryptocurrencies.

## Design Requirements
- Export should be asynchronous for large datasets (optional for MVP, synchronous is fine for < 1000 rows).
- Ensure USD amounts are included in the export for financial reconciliation.

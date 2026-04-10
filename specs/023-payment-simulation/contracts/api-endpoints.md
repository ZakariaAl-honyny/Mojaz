# API Contracts: Multi-Point Payment Simulation

All endpoints follow the `ApiResponse<T>` wrapper model.

### 1. Initiate Payment
**POST** `/api/v1/payments/initiate`
**Body**:
```json
{
  "applicationId": "guid",
  "feeType": "ApplicationFee | MedicalExamFee | TheoryTestFee | PracticalTestFee | RetakeFee | IssuanceFee"
}
```
**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "transactionId": "guid",
    "amount": 150.00,
    "transactionReference": "MOJ-PAY-2025-12345678",
    "status": "Pending"
  }
}
```

### 2. Confirm Payment
**POST** `/api/v1/payments/{transactionId}/confirm`
**Body**:
```json
{
  "isSuccessful": true
}
```
**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Payment confirmed",
  "data": {
    "transactionId": "guid",
    "status": "Paid"
  }
}
```

### 3. Get Application Payments
**GET** `/api/v1/payments/application/{appId}`
**Response** `200 OK`:
```json
{
  "success": true,
  "message": "",
  "data": [
    {
      "transactionId": "guid",
      "feeType": "ApplicationFee",
      "amount": 150.00,
      "status": "Paid",
      "transactionReference": "MOJ-PAY-2025-12345678",
      "createdAt": "2026-04-10T00:00:00Z"
    }
  ]
}
```

### 4. Download Receipt
**GET** `/api/v1/payments/{transactionId}/receipt`
**Response**: `application/pdf` (binary file stream).

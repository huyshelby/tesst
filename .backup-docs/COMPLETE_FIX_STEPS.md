# 🚀 HƯỚNG DẪN FIX HOÀN CHỈNH - BACKEND KHÔNG DETECT EVENT

**Vấn đề:** Payment thành công nhưng order status không update tự động

---

## [object Object]ÓM TẮT VẤN ĐỀ

### ✅ Đã hoạt động:
- ✅ Smart contract deployed: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
- ✅ Frontend payment execution
- ✅ MetaMask connection
- ✅ Transaction thành công: 0xfc8aca90...
- ✅ Event được emit trong transaction

### ❌ Chưa hoạt động:
- ❌ Backend không detect event
- ❌ Order status không tự động update
- ❌ Không có log "🔔 New payment detected!"

### 🔍 Nguyên nhân:
**Backend chưa restart sau khi update contract address!**

---

## ✅ GIẢI PHÁP - 5 BƯỚC

### BƯỚC 1: Verify Config Files

**Check backend/.env:**
```bash
cd backend
type .env | findstr CONTRACT

# Phải thấy:
PAYMENT_CONTRACT_ADDRESS=0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
```

**Check phone-app/.env.local:**
```bash
cd phone-app
type .env.local | findstr CONTRACT

# Phải thấy:
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
```

**Nếu SAI → Update và restart!**

---

### BƯỚC 2: Restart Backend (QUAN TRỌNG!)

```bash
# Mở terminal backend
cd backend

# Stop nếu đang chạy (Ctrl+C)

# Start lại
npm run dev
```

**Phải thấy logs:**
```
API listening on http://localhost:4000
🌐 Blockchain Environment: local
📡 RPC URL: http://127.0.0.1:8545
🔗 WSS URL: ws://127.0.0.1:8545
🔗 Blockchain Service initialized
📍 Contract Address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707  ← PHẢI LÀ ĐỊA CHỈ MỚI!
🌐 Network: Hardhat Local
👂 Starting to listen for OrderPaid events...
✅ Blockchain event listener started successfully
💱 Exchange rate service running
```

**Nếu contract address VẪN LÀ CŨ (0xe7f172...):**
→ Backend chưa load config mới!
→ Xóa file .env và tạo lại, hoặc restart terminal

---

### BƯỚC 3: Test WebSocket Connection

```bash
# Terminal mới
cd backend
node test-websocket.js
```

**Expected:**
```
=== Testing WebSocket Connection ===

WSS URL: ws://127.0.0.1:8545
Contract: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

1. Connecting to WebSocket...
✅ WebSocket connected

2. Getting current block...
📦 Current block: 1

3. Listening for new blocks...

4. Setting up contract listener...
✅ Contract listener setup complete

👂 Now listening for events...
💡 Try making a payment to test
```

**Để lại terminal này chạy!**

---

### BƯỚC 4: Trigger Event Test

**Mở terminal mới:**
```bash
cd blockchain
npx hardhat run scripts/trigger-event.ts --network localhost
```

**Expected:**
```
=== Triggering Payment Event ===

Contract: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Signer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

Sending payment...
Order ID: EVENT-TEST-1766327500000
Amount: 0.01 ETH

TX Hash: 0x...
Waiting for confirmation...

✅ Transaction confirmed!
Block: 2
Logs count: 1

🎉 Events emitted:
📋 Parsed Event:
  Name: OrderPaid
  Order ID: EVENT-TEST-1766327500000
  Payer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  Amount: 0.01 ETH
  Token: 0x0000000000000000000000000000000000000000
  Method: NATIVE_COIN

💡 Check backend logs now!
```

**ĐỒNG THỜI check terminal backend:**
```
🔔 New payment detected!
📦 Order ID: EVENT-TEST-1766327500000
👤 Payer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰: 0.01 ETH
🪙 Token: ETH
🔗 TxHash: 0x...
⚙️ Processing payment for order: EVENT-TEST-1766327500000
✅ Payment processed successfully!
```

**Nếu THẤY logs này → Backend listener hoạt động! ✅**

---

### BƯỚC 5: Test End-to-End

```bash
# 1. Tạo đơn hàng mới qua UI
http://localhost:3000/thanh-toan

# 2. Thanh toán
→ Connect MetaMask
→ Chọn ETH
→ Click "Thanh toán bằng Blockchain"
→ Confirm

# 3. Check backend logs
→ Phải thấy "🔔 New payment detected!"

# 4. Check admin dashboard
http://localhost:3001/orders
→ Order status: CONFIRMED ✅
→ Payment: COMPLETED ✅
```

---

## 🔧 NẾU VẪN KHÔNG HOẠT ĐỘNG

### Debug Level 1: Check Hardhat Node
```bash
# Hardhat node phải đang chạy
cd blockchain
npm run node

# Phải thấy:
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Debug Level 2: Check Backend Connection
```bash
# Backend phải connect được Hardhat
cd backend
node test-websocket.js

# Phải thấy:
✅ WebSocket connected
```

### Debug Level 3: Check Event Emission
```bash
# Event phải được emit
cd blockchain
npx hardhat run scripts/trigger-event.ts --network localhost

# Phải thấy:
Logs count: 1 (hoặc nhiều hơn)
```

### Debug Level 4: Check Backend Listener
```bash
# Backend phải listen đúng contract
cd backend
npm run dev

# Logs phải có:
📍 Contract Address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
✅ Blockchain event listener started successfully
```

---

## [object Object]ẾT LUẬN

**Root cause:** Backend chưa restart hoặc config chưa load đúng

**Solution:**
1. ✅ Update contract address trong .env
2. ✅ **RESTART BACKEND** (quan trọng nhất!)
3. ✅ Verify logs có contract address MỚI
4. ✅ Test với trigger-event.ts
5. ✅ Nếu detect được → Test qua UI

**Hãy làm theo 5 bước trên và báo kết quả!** 🚀

---

**Created:** 2025-12-21  
**Files:** 
- DEBUG_BACKEND_LISTENER.md
- backend/test-websocket.js
- blockchain/scripts/trigger-event.ts
- FIX_EVENT_DETECTION_GUIDE.md
- COMPLETE_FIX_STEPS.md


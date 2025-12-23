# 🔧 HƯỚNG DẪN FIX BACKEND KHÔNG DETECT EVENT

**Vấn đề:** Payment thành công nhưng backend không có log "🔔 New payment detected!"

---

## [object Object]ẮT NHANH - 3 BƯỚC

### Bước 1: Test WebSocket Connection
```bash
cd backend
node test-websocket.js

# Expected:
✅ WebSocket connected
📦 Current block: 1
👂 Listening for blocks...
```

**Nếu lỗi:** Hardhat node chưa chạy hoặc không expose WebSocket.

### Bước 2: Trigger Event Manually
```bash
cd blockchain
npx hardhat run scripts/trigger-event.ts --network localhost

# Expected:
✅ Transaction confirmed!
🎉 Events emitted
📋 Parsed Event: OrderPaid
```

### Bước 3: Check Backend Logs
**Trong terminal backend, phải thấy:**
```
🔔 New payment detected!
📦 Order ID: EVENT-TEST-...
👤 Payer: 0xf39...
💰: 0.01 ETH
✅ Payment processed successfully!
```

**Nếu THẤY → Backend listener hoạt động ✅**  
**Nếu KHÔNG THẤY → Backend listener có vấn đề ❌**

---

## 🔍 DEBUG CHI TIẾT

### Scenario 1: Backend listener chưa start

**Triệu chứng:**
```
Backend logs KHÔNG có:
✅ Blockchain event listener started successfully
```

**Nguyên nhân:** Code có lỗi hoặc WebSocket không connect

**Fix:**
```bash
cd backend
npm run dev

# Check logs có error không
```

### Scenario 2: Contract address sai

**Triệu chứng:**
```
Backend logs có:
📍 Contract Address: 0xe7f172... (CŨ)
```

**Fix:**
```bash
# Update .env
cd backend
echo "PAYMENT_CONTRACT_ADDRESS=0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" >> .env

# Restart
npm run dev
```

### Scenario 3: WebSocket không connect

**Triệu chứng:**
```
test-websocket.js lỗi:
❌ WebSocket error: connect ECONNREFUSED
```

**Fix:**
```bash
# Check Hardhat node
cd blockchain
npm run node

# Phải thấy:
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Scenario 4: Event không được emit

**Triệu chứng:**
```
trigger-event.ts:
Logs count: 0
⚠️  No events emitted!
```

**Fix:** Smart contract có vấn đề, cần check code

---

## 🧪 TEST SCRIPT ĐẦY ĐỦ

### Script 1: test-websocket.js (Đã tạo)
```bash
cd backend
node test-websocket.js
```

### Script 2: trigger-event.ts (Đã tạo)
```bash
cd blockchain
npx hardhat run scripts/trigger-event.ts --network localhost
```

### Script 3: Check event từ transaction
```bash
cd blockchain
npx hardhat console --network localhost
```

```javascript
const receipt = await ethers.provider.getTransactionReceipt("0xfc8aca90972f12276262728792fbbf1f13095e0d5d083a8f18eaab86f9a18782");
console.log("Logs:", receipt.logs.length);
```

---

## ✅ EXPECTED RESULTS

### Khi backend listener hoạt động đúng:

**1. Backend startup logs:**
```
🔗 Blockchain Service initialized
📍 Contract Address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
🌐 Network: Hardhat Local
👂 Starting to listen for OrderPaid events...
✅ Blockchain event listener started successfully
```

**2. Khi có payment:**
```
🔔 New payment detected!
📦 Order ID: xxx
👤 Payer: 0x...
💰: 0.01 ETH
🔗 TxHash: 0x...
⚙️ Processing payment...
✅ Payment processed successfully!
```

**3. Database updated:**
```
paymentStatus: COMPLETED
status: CONFIRMED
cryptoTxHash: 0x...
```

---

## [object Object]ẾT LUẬN

**Để fix backend không detect event:**

### Checklist:
1. ✅ Hardhat node đang chạy
2. ✅ Contract đã deploy (0x5FC8d32...)
3. ✅ Backend .env có contract address đúng
4. ⏳ **RESTART BACKEND** (quan trọng nhất!)
5. ⏳ Test WebSocket connection
6. ⏳ Trigger event manually
7. ⏳ Verify backend logs

### Commands:
```bash
# Test WebSocket
cd backend
node test-websocket.js

# Trigger event
cd blockchain
npx hardhat run scripts/trigger-event.ts --network localhost

# Check backend logs
# Phải thấy: 🔔 New payment detected!
```

**Nếu vẫn không hoạt động, hãy share backend logs để tôi debug tiếp!** 🔍

Đã tạo 3 files:
- `DEBUG_BACKEND_LISTENER.md` - Hướng dẫn debug
- `backend/test-websocket.js` - Test WebSocket
- `blockchain/scripts/trigger-event.ts` - Trigger event manually

# [object Object] BACKEND KHÔNG DETECT EVENT

**Vấn đề:** Payment thành công nhưng backend không có log "🔔 New payment detected!"

---

## 📊 KIỂM TRA TỪNG BƯỚC

### Bước 1: Check Backend Logs Khi Start

**Mở terminal backend, phải thấy:**
```
API listening on http://localhost:4000
🔗 Blockchain services initialized
💱 Exchange rate service running
🔗 Blockchain Service initialized
📍 Contract Address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
🌐 Network: Hardhat Local
👂 Starting to listen for OrderPaid events...
✅ Blockchain event listener started successfully
```

**Nếu KHÔNG thấy "✅ Blockchain event listener started successfully":**
→ Backend listener CHƯA CHẠY!

---

### Bước 2: Check Contract Address

**Backend logs phải có[object Object] Address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
```

**Nếu là address CŨ (0xe7f172...):**
→ Backend chưa load config mới!

**Fix:**
```bash
cd backend
cat .env | grep CONTRACT
# Phải thấy: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

# Restart:
npm run dev
```

---

### Bước 3: Check WebSocket Connection

**Vấn đề:** Backend dùng WebSocket để listen events

**File:** `backend/src/services/blockchain/blockchain.service.ts`
```typescript
const BSC_TESTNET_WSS = process.env.BSC_TESTNET_WSS || "wss://bsc-testnet.publicnode.com";
const LOCAL_WSS = "ws://127.0.0.1:8545";
const WSS_URL = BLOCKCHAIN_ENV === "local" ? LOCAL_WSS : BSC_TESTNET_WSS;

this.provider = new ethers.providers.WebSocketProvider(WSS_URL);
```

**Check backend/.env:**
```env
BLOCKCHAIN_ENV=local
```

**Hardhat node có hỗ trợ WebSocket?**
→ CÓ! Hardhat node tự động expose WebSocket tại `ws://127.0.0.1:8545`

---

### Bước 4: Test WebSocket Connection

**Tạo script test:** `backend/test-websocket.js`

```javascript
const { ethers } = require("ethers");

async function testWebSocket() {
  console.log("Testing WebSocket connection...");
  
  try {
    const provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545");
    
    console.log("✅ WebSocket connected");
    
    const blockNumber = await provider.getBlockNumber();
    console.log("📦 Current block:", blockNumber);
    
    // Listen for new blocks
    provider.on("block", (blockNumber) => {
      console.log("🆕 New block:", blockNumber);
    });
    
    console.log("👂 Listening for blocks...");
    
  } catch (error) {
    console.error("❌ WebSocket error:", error.message);
  }
}

testWebSocket();
```

**Chạy test:**
```bash
cd backend
node test-websocket.js

# Expected:
✅ WebSocket connected
📦 Current block: 1
👂 Listening for blocks...
```

**Nếu lỗi:**
→ Hardhat node không chạy hoặc không expose WebSocket!

---

### Bước 5: Check Event Được Emit

**Vấn đề:** Smart contract có emit event không?

**Check transaction receipt:**

```bash
cd blockchain
npx hardhat console --network localhost
```

```javascript
const receipt = await ethers.provider.getTransactionReceipt("0xfc8aca90972f12276262728792fbbf1f13095e0d5d083a8f18eaab86f9a18782");

console.log("Logs:", receipt.logs);
// Phải có ít nhất 1 log (OrderPaid event)

// Parse log
const iface = new ethers.utils.Interface([
  "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)"
]);

receipt.logs.forEach(log => {
  try {
    const parsed = iface.parseLog(log);
    console.log("Event:", parsed.name);
    console.log("OrderId:", parsed.args.orderId);
    console.log("Payer:", parsed.args.payer);
  } catch (e) {
    // Not OrderPaid event
  }
});
```

**Nếu KHÔNG có logs:**
→ Smart contract KHÔNG emit event!

---

### Bước 6: Manual Trigger Event (Test)

**Tạo script test event:** `blockchain/scripts/test-event.ts`

```typescript
import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const [signer] = await ethers.getSigners();

  const PaymentContract = await ethers.getContractFactory("PaymentContract");
  const contract = PaymentContract.attach(contractAddress);

  console.log("Sending test payment...");

  const tx = await contract.payOrderWithNative(`TEST-${Date.now()}`, {
    value: ethers.parseEther("0.01")
  });

  console.log("TX sent:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("TX confirmed in block:", receipt.blockNumber);
  console.log("Logs count:", receipt.logs.length);
}

main();
```

**Chạy:**
```bash
npx hardhat run scripts/test-event.ts --network localhost
```

**Đồng thời check backend logs:**
→ Phải thấy "🔔 New payment detected!" trong vòng 1-2 giây

---

## 🔧 CÁC NGUYÊN NHÂN THƯỜNG GẶP

### 1. Backend chưa restart ❌
```bash
# Fix:
cd backend
# Ctrl+C
npm run dev
```

### 2. Contract address sai ❌
```bash
# Check:
cat backend/.env | grep CONTRACT

# Fix:
# Update .env với address mới
# Restart backend
```

### 3. WebSocket không connect ❌
```bash
# Check Hardhat node đang chạy:
curl http://localhost:8545

# Restart Hardhat:
cd blockchain
npm run node
```

### 4. Event listener chưa start ❌
```bash
# Check backend logs phải thấy:
✅ Blockchain event listener started successfully

# Nếu không thấy → Check code có lỗi
```

### 5. Smart contract không emit event ❌
```bash
# Check transaction receipt có logs không
# Nếu không → Contract code có vấn đề
```

---

## ✅ GIẢI PHÁP TOÀN DIỆN

### Option 1: Restart Tất Cả (Khuyến nghị)

```bash
# Terminal 1: Stop và restart Hardhat
cd blockchain
# Ctrl+C
npm run node

# Terminal 2: Re-deploy contract
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
# Lưu contract address mới

# Terminal 3: Update backend config
cd backend
# Update .env với contract address mới
# Ctrl+C để stop backend
npm run dev

# Terminal 4: Restart frontend
cd phone-app
# Ctrl+C
npm run dev
```

### Option 2: Debug Chi Tiết

```bash
# 1. Test WebSocket
cd backend
node test-websocket.js

# 2. Test event emission
cd blockchain
npx hardhat run scripts/test-event.ts --network localhost

# 3. Check backend logs real-time
cd backend
npm run dev | grep "[object Object]
```

### Option 3: Add Debug Logs

**File:** `backend/src/services/blockchain/blockchain.service.ts`

```typescript
async startListening(): Promise<void> {
  console.log("👂 Starting to listen for OrderPaid events...");
  console.log("📍 Contract:", PAYMENT_CONTRACT_ADDRESS);
  console.log("🌐 WSS URL:", WSS_URL);
  
  // Test connection
  const blockNumber = await this.provider.getBlockNumber();
  console.log[object Object]Number);
  
  // Listen for all events (debug)
  this.provider.on("block", (block) => {
    console.log[object Object] block);
  });
  
  this.contract.on("OrderPaid", async (...args) => {
    console.log("\n🔔 New payment detected!");
    console.log("📦 Raw args:", args);
    // ... rest of code
  });
}
```

---

## 🎯 CHECKLIST DEBUG

- [ ] Backend đang chạy
- [ ] Backend logs thấy "Blockchain event listener started"
- [ ] Contract address đúng (0x5FC8d32...)
- [ ] Hardhat node đang chạy
- [ ] WebSocket test thành công
- [ ] Transaction có emit event (check receipt.logs)
- [ ] Test event manual → Backend detect được

---

## 📝 TEMPORARY FIX

Nếu cần update order ngay:

```sql
-- Connect to database
cd backend
npx prisma studio

-- Update order manually:
UPDATE "Order"
SET 
  "paymentStatus" = 'COMPLETED',
  "status" = 'CONFIRMED',
  "cryptoTxHash" = '0xfc8aca90972f12276262728792fbbf1f13095e0d5d083a8f18eaab86f9a18782'
WHERE "orderNumber" = 'ORD-MJFTH7C8-X7JKU';
```

**Nhưng phải fix backend listener để tự động!**

---

**Hãy thử các bước debug trên và báo kết quả!** [object Object]

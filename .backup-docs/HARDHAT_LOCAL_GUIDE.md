# 🏠 HƯỚNG DẪN LOCAL DEVELOPMENT - HARDHAT NETWORK

## [object Object]ỤC LỤC
1. [Tại sao dùng Hardhat Local](#1-tại-sao-dùng-hardhat-local)
2. [Setup môi trường](#2-setup-môi-trường)
3. [Deploy contract](#3-deploy-contract)
4. [Kết nối MetaMask](#4-kết-nối-metamask)
5. [Test end-to-end](#5-test-end-to-end)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. TẠI SAO DÙNG HARDHAT LOCAL?

### ✅ **Ưu điểm:**
- **Không cần tBNB** - 10 accounts với 10,000 ETH mỗi account
- **Instant mining** - Transaction confirm ngay lập tức (0s)
- **Reset dễ dàng** - Restart node = reset toàn bộ state
- **Không cần internet** - Chạy hoàn toàn offline
- **Console.log** - Debug Solidity code với console.log()
- **Free gas** - Không giới hạn transactions

### ❌ **Hạn chế:**
- Chỉ chạy local (không public)
- Phải restart node khi thay đổi contract
- Không có block explorer

---

## 2. SETUP MÔI TRƯỜNG

### **2.1. Cấu hình Backend**

File: `backend/.env`
```env
# Blockchain Environment (local, testnet, mainnet)
BLOCKCHAIN_ENV=local

# Contract address (sẽ update sau khi deploy)
PAYMENT_CONTRACT_ADDRESS=

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
```

### **2.2. Cấu hình Frontend**

File: `phone-app/.env.local`
```env
# Blockchain Environment
NEXT_PUBLIC_BLOCKCHAIN_ENV=local

# Contract address (sẽ update sau khi deploy)
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=

# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 3. DEPLOY CONTRACT

### **Terminal 1: Start Hardhat Node**

```bash
cd blockchain
npm run node
```

**Kết quả:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

... (8 more accounts)
```

**⚠️ LƯU Ý:** Giữ terminal này chạy! Đây là blockchain node.

### **Terminal 2: Deploy Contract**

```bash
# Terminal mới
cd blockchain
npm run deploy:local
```

**Kết quả:**
```
🚀 Starting Payment Contract deployment...
👤 Deployer/Recipient: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
📦 Deploying PaymentContract...
✅ PaymentContract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
🔗 Network: hardhat
🔗 Chain ID: 31337
```

**📝 LƯU CONTRACT ADDRESS:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### **3.1. Update Environment Variables**

**Backend `.env`:**
```env
PAYMENT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## 4. KẾT NỐI METAMASK

### **4.1. Thêm Hardhat Network vào MetaMask**

1. Mở MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Điền thông tin:

```
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

4. Click "Save"

### **4.2. Import Test Account**

1. MetaMask → "Import Account"
2. Paste private key từ Hardhat node (Account #0):
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
3. Account sẽ có **10,000 ETH**

**⚠️ LƯU Ý:** Private key này là public, CHỈ dùng cho local development!

---

## 5. TEST END-TO-END

### **Terminal 3: Start Backend**

```bash
cd backend

# Run migration nếu chưa chạy
npx prisma migrate dev --name add_crypto_fields
npx prisma generate

# Start backend
npm run dev
```

**Kiểm tra logs:**
```
API listening on http://localhost:4000
🌐 Blockchain Environment: local
📡 RPC URL: http://127.0.0.1:8545
🔗 WSS URL: ws://127.0.0.1:8545
🔗 Blockchain Service initialized
📍 Contract Address: 0x5FbDB...
🌐 Network: Hardhat Local
👂 Starting to listen for OrderPaid events...
✅ Blockchain event listener started successfully
```

### **Terminal 4: Start Frontend**

```bash
cd phone-app
npm run dev
```

Frontend: http://localhost:3000

### **5.1. Test Flow Hoàn Chỉnh**

**Bước 1: Tạo đơn hàng**
1. Truy cập http://localhost:3000
2. Thêm sản phẩm vào giỏ hàng
3. Đăng nhập (hoặc đăng ký)
4. Vào trang thanh toán

**Bước 2: Kết nối MetaMask**
1. Chọn "Thanh toán Blockchain"
2. Click "Kết nối ví"
3. MetaMask popup → Chọn account đã import → Connect
4. Check network → Nếu sai, click "Switch to Hardhat Local"

**Bước 3: Thanh toán**
1. Chọn token (USDT/USDC) hoặc native coin (ETH)
2. Xem số tiền cần thanh toán
3. Click "Thanh toán bằng Blockchain"
4. MetaMask popup:
   - **Approve token** (nếu dùng USDT/USDC) → Confirm
   - **Payment transaction** → Confirm
5. Transaction confirm **NGAY LẬP TỨC** (instant mining)

**Bước 4: Verify**
1. Backend logs:
   ```
   🔔 New payment detected!
   📦 Order ID: uuid-123
   [object Object]ayer: 0xf39Fd...
   [object Object].16 USDT
   🔗 TxHash: 0x...
   ✅ Payment processed successfully!
   ```

2. Frontend hiển thị "Payment Successful"
3. Check database: Order status = CONFIRMED, paymentStatus = COMPLETED

---

## 6. TROUBLESHOOTING

### ❌ "Cannot connect to http://127.0.0.1:8545"
**Giải pháp:** Hardhat node chưa chạy. Start lại Terminal 1.

### ❌ "Nonce too high"
**Nguyên nhân:** MetaMask cache nonce cũ  
**Giải pháp:** 
1. MetaMask → Settings → Advanced → "Clear activity tab data"
2. Hoặc reset Hardhat node (Ctrl+C → `npm run node`)

### ❌ "Contract not deployed"
**Giải pháp:** 
1. Restart Hardhat node (Terminal 1)
2. Re-deploy contract (Terminal 2)
3. Update contract address trong .env

### ❌ Backend không detect event
**Kiểm tra:**
1. Hardhat node có đang chạy?
2. Backend có connect đúng WSS URL?
3. Contract address đúng chưa?
4. Restart backend

### ❌ "Insufficient funds"
**Không thể xảy ra** - Mỗi account có 10,000 ETH!  
Nếu vẫn lỗi → Import sai account hoặc sai network.

---

## 7. RESET & RESTART

### **Reset toàn bộ:**

```bash
# Terminal 1: Stop Hardhat node (Ctrl+C)
# Restart
cd blockchain
npm run node

# Terminal 2: Re-deploy
npm run deploy:local
# → Lưu contract address mới

# Update .env files với contract address mới

# Terminal 3: Restart backend
cd backend
npm run dev

# Terminal 4: Restart frontend
cd phone-app
npm run dev

# MetaMask: Clear activity data
```

---

## 8. SO SÁNH LOCAL VS TESTNET

| Feature | Hardhat Local | BSC Testnet |
|---------|---------------|-------------|
| **Setup** | 1 command | Cần faucet |
| **Gas** | Free (unlimited) | Cần tBNB |
| **Speed** | Instant (0s) | ~3 seconds |
| **Reset** | Restart node | Không thể |
| **Internet** | Không cần | Cần |
| **Debug** | console.log() | Không có |
| **Public** | Chỉ local | Public testnet |

---

## 9. BEST PRACTICES

### **Development Workflow:**

```
1. Develop & test trên Hardhat Local (nhanh, free)
   ↓
2. Test trên BSC Testnet (giống production)
   ↓
3. Audit & security review
   ↓
4. Deploy lên BSC Mainnet (production)
```

### **Khi nào dùng Local:**
- ✅ Develop smart contract
- ✅ Test backend integration
- ✅ Test frontend UI/UX
- ✅ Debug issues
- ✅ Demo cho team

### **Khi nào dùng Testnet:**
- ✅ Final testing trước production
- ✅ Test với external services
- ✅ Public demo
- ✅ Verify contract trên explorer

---

## 10. ACCOUNTS HARDHAT MẶC ĐỊNH

```javascript
// Account #0 (Deployer & Recipient)
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

// Account #1 (Test User)
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

// Account #2 (Test User)
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

... (7 more accounts)
```

**⚠️ CẢNH BÁO:** Những private keys này là PUBLIC. KHÔNG BAO GIỜ dùng trên mainnet!

---

## ✅ CHECKLIST DEPLOYMENT LOCAL

- [ ] Terminal 1: Hardhat node running
- [ ] Terminal 2: Contract deployed, address saved
- [ ] Backend .env updated with contract address
- [ ] Frontend .env.local updated with contract address
- [ ] Terminal 3: Backend running, listening events
- [ ] Terminal 4: Frontend running
- [ ] MetaMask: Hardhat network added
- [ ] MetaMask: Test account imported (10,000 ETH)
- [ ] Test: Create order → Pay → Verify success

---

**🎉 HOÀN TẤT! Bạn đã có môi trường local development hoàn chỉnh, không cần faucet hay tiền thật!**

# [object Object]ƯỚNG DẪN TRIỂN KHAI BLOCKCHAIN PAYMENT - BSC TESTNET

## [object Object]ỤC LỤC
1. [Chuẩn bị môi trường](#1-chuẩn-bị-môi-trường)
2. [Deploy Smart Contract](#2-deploy-smart-contract)
3. [Cấu hình Backend](#3-cấu-hình-backend)
4. [Cấu hình Frontend](#4-cấu-hình-frontend)
5. [Testing](#5-testing)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. CHUẨN BỊ MÔI TRƯỜNG

### 1.1. Cài đặt MetaMask
1. Tải MetaMask extension: https://metamask.io/download/
2. Tạo ví mới hoặc import ví có sẵn
3. **LƯU Ý:** Backup seed phrase an toàn!

### 1.2. Thêm BSC Testnet vào MetaMask
1. Mở MetaMask → Settings → Networks → Add Network
2. Điền thông tin:
   - **Network Name:** BSC Testnet
   - **RPC URL:** https://data-seed-prebsc-1-s1.binance.org:8545/
   - **Chain ID:** 97
   - **Currency Symbol:** BNB
   - **Block Explorer:** https://testnet.bscscan.com/

### 1.3. Lấy BNB Testnet (Free)
1. Copy địa chỉ ví từ MetaMask
2. Truy cập: https://testnet.binance.org/faucet-smart
3. Paste địa chỉ ví và request BNB
4. Đợi 1-2 phút, check balance trong MetaMask

### 1.4. Lấy USDT Testnet (Optional)
```bash
# Deploy mock USDT contract hoặc dùng contract có sẵn
# BSC Testnet USDT: 0x337610d27c682E347C9cD60BD4b3b107C9d34dDd
```

---

## 2. DEPLOY SMART CONTRACT

### 2.1. Cài đặt dependencies
```bash
cd blockchain
npm install
```

### 2.2. Cấu hình environment
```bash
cp .env.example .env
```

Sửa file `.env`:
```env
PRIVATE_KEY=your_metamask_private_key_here
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
BSCSCAN_API_KEY=your_bscscan_api_key  # Optional, for verification
```

**⚠️ LẤY PRIVATE KEY:**
1. MetaMask → Account Details → Export Private Key
2. Nhập password
3. Copy private key (BẮT ĐẦU BẰNG 0x)
4. **KHÔNG BAO GIỜ** share private key!

### 2.3. Compile contract
```bash
npm run compile
```

### 2.4. Deploy lên BSC Testnet
```bash
npm run deploy:testnet
```

**Kết quả mong đợi:**
```
🚀 Starting Payment Contract deployment...
👤 Deployer/Recipient: 0xYourAddress...
📦 Deploying PaymentContract...
✅ PaymentContract deployed to: 0x1234567890abcdef...
🔗 Network: bscTestnet
🔗 Chain ID: 97
👤 Deployer address: 0xYourAddress...
💰 Deployer balance: 0.5 BNB
```

**LƯU Ý:** Contract sẽ sử dụng deployer address làm recipient wallet (ví nhận tiền).

**LƯU LẠI CONTRACT ADDRESS!** Bạn sẽ cần nó cho bước tiếp theo.

### 2.5. Verify contract (Optional)
```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS>
```

---

## 3. CẤU HÌNH BACKEND

### 3.1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 3.2. Cập nhật .env
Thêm vào file `backend/.env`:
```env
# Blockchain Configuration
PAYMENT_CONTRACT_ADDRESS=0xYourContractAddress
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
BSC_TESTNET_WSS=wss://bsc-testnet.publicnode.com
```

### 3.3. Khởi động backend
```bash
npm run dev
```

**Kiểm tra logs:**
```
API listening on http://localhost:4000
🔗 Blockchain Service initialized
📍 Contract Address: 0x...
🌐 Network: BSC Testnet
👂 Starting to listen for OrderPaid events...
✅ Blockchain event listener started successfully
💱 Exchange rate service running
```

---

## 4. CẤU HÌNH FRONTEND

### 4.1. Cập nhật .env
Tạo file `phone-app/.env.local`:
```env
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4.2. Khởi động frontend
```bash
cd phone-app
npm run dev
```

Frontend chạy tại: http://localhost:3000

---

## 5. TESTING

### 5.1. Test Flow Hoàn Chỉnh

**Bước 1: Tạo đơn hàng**
1. Truy cập http://localhost:3000
2. Thêm sản phẩm vào giỏ hàng
3. Đăng nhập
4. Vào trang thanh toán

**Bước 2: Chọn thanh toán Blockchain**
1. Chọn "Thanh toán Blockchain"
2. Click "Kết nối ví"
3. MetaMask popup → Approve connection
4. Check network → Nếu sai, click "Switch to BSC Testnet"

**Bước 3: Thanh toán**
1. Chọn token (USDT/USDC/BNB)
2. Xem số tiền cần thanh toán
3. Click "Thanh toán bằng Blockchain"
4. MetaMask popup → Review transaction → Confirm

**Bước 4: Chờ xác nhận**
1. Transaction vào mempool (pending)
2. Đợi 3 confirmations (~9 giây trên BSC)
3. Backend detect event → Verify → Update order
4. Frontend hiển thị "Payment Successful"

### 5.2. Test API Endpoints

```bash
# Get exchange rates
curl http://localhost:4000/api/blockchain/rates

# Get supported tokens
curl http://localhost:4000/api/blockchain/tokens

# Convert VND to Crypto
curl -X POST http://localhost:4000/api/blockchain/convert \
  -H "Content-Type: application/json" \
  -d '{"vndAmount": 10000000, "token": "USDT"}'

# Verify transaction
curl -X POST http://localhost:4000/api/blockchain/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"txHash": "0x..."}'
```

### 5.3. Check Logs

**Backend logs:**
```
🔔 New payment detected!
📦 Order ID: uuid-123
👤 Payer: 0x...
💰 Amount: 408.16 USDT
🔗 TxHash: 0x...
⚙️ Processing payment for order: uuid-123
🔍 Verifying transaction: 0x...
📊 Confirmations: 3
✅ Payment processed successfully!
```

**Frontend console:**
```
Approving token spend...
Token approved
Sending payment transaction...
Transaction sent: 0x...
Waiting for confirmation...
Transaction confirmed: 0x...
```

---

## 6. TROUBLESHOOTING

### ❌ "MetaMask not installed"
**Giải pháp:** Cài đặt MetaMask extension

### ❌ "Wrong network"
**Giải pháp:** Switch sang BSC Testnet trong MetaMask

### ❌ "Insufficient balance"
**Giải pháp:** Request BNB từ faucet

### ❌ "Transaction failed"
**Nguyên nhân:**
- Gas quá thấp → Tăng gas price
- Contract revert → Check logs
- Nonce conflict → Reset MetaMask account

### ❌ "Not enough confirmations"
**Giải pháp:** Đợi thêm vài block (~3-6 giây)

### ❌ Backend không detect event
**Kiểm tra:**
1. WebSocket connection: `BSC_TESTNET_WSS` đúng chưa?
2. Contract address đúng chưa?
3. Backend logs có lỗi không?

### ❌ "Order already processed"
**Nguyên nhân:** OrderId đã được dùng
**Giải pháp:** Tạo order mới

---

## 7. NEXT STEPS

### 7.1. Security Audit
- [ ] Review smart contract code
- [ ] Test edge cases
- [ ] Check reentrancy vulnerabilities
- [ ] Validate input sanitization

### 7.2. Performance Optimization
- [ ] Implement caching for exchange rates
- [ ] Add retry logic for failed transactions
- [ ] Optimize gas usage

### 7.3. User Experience
- [ ] Add loading states
- [ ] Improve error messages
- [ ] Add transaction history
- [ ] Email notifications

### 7.4. Production Deployment
- [ ] Deploy to BSC Mainnet
- [ ] Use production RPC provider (Alchemy/QuickNode)
- [ ] Implement monitoring & alerts
- [ ] Setup backup systems

---

## 📚 RESOURCES

- **BSC Testnet Explorer:** https://testnet.bscscan.com/
- **BSC Testnet Faucet:** https://testnet.binance.org/faucet-smart
- **MetaMask Docs:** https://docs.metamask.io/
- **Hardhat Docs:** https://hardhat.org/docs
- **Ethers.js Docs:** https://docs.ethers.org/v5/

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] Smart contract deployed
- [x] Backend blockchain service running
- [x] Frontend MetaMask integration
- [x] WebSocket event listener active
- [x] Exchange rate service running
- [ ] End-to-end test passed
- [ ] Documentation complete

---

**🎉 CHÚC MỪNG! Bạn đã triển khai thành công hệ thống thanh toán blockchain!**

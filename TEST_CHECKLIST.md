# ✅ **QUICK TEST CHECKLIST - BLOCKCHAIN PAYMENT**

## [object Object] PRE-TEST (5 phút)**

```bash
# 1. Check Hardhat Node
curl http://127.0.0.1:8545
# ✅ Should return JSON-RPC response

# 2. Check Backend
curl http://localhost:4000/health
# ✅ Should return {"status":"ok"}

# 3. Check Frontend
# Open http://localhost:3000
# ✅ Should load homepage

# 4. Check MetaMask
# ✅ Network: Hardhat Local (31337)
# ✅ Account: 0xf39Fd... 
# ✅ Balance: 10,000 ETH
```

---

## [object Object] BASIC FLOW (10 phút)**

### **Test 1: Create Order (Traditional Payment)**
1. [ ] Go to http://localhost:3000
2. [ ] Add product to cart
3. [ ] Go to checkout
4. [ ] Login if needed
5. [ ] Fill shipping info
6. [ ] Select "Thẻ ATM"
7. [ ] Click "Hoàn tất đặt hàng"
8. [ ] ✅ Order created, status = PENDING

### **Test 2: Connect MetaMask**
1. [ ] Create new order
2. [ ] Select "Thanh toán Blockchain"
3. [ ] Click "Kết nối ví"
4. [ ] Approve in MetaMask
5. [ ] ✅ Address shown: 0xf39Fd...
6. [ ] ✅ Balance shown: 10,000 ETH

### **Test 3: Pay with ETH**
1. [ ] Select token: ETH
2. [ ] See amount (e.g., 0.000667 ETH)
3. [ ] Click "Thanh toán bằng Blockchain"
4. [ ] Confirm in MetaMask
5. [ ] ✅ Transaction confirms INSTANTLY
6. [ ] ✅ Backend logs: "🔔 New payment detected!"
7. [ ] ✅ Backend logs: "✅ Payment processed successfully!"
8. [ ] ✅ Frontend shows success

**Check Database:**
```sql
SELECT orderNumber, status, paymentStatus, cryptoTxHash 
FROM Order 
ORDER BY createdAt DESC 
LIMIT 1;
```
- [ ] ✅ status = CONFIRMED
- [ ] ✅ paymentStatus = COMPLETED
- [ ] ✅ cryptoTxHash = 0x...

---

## [object Object] ADVANCED FLOW (15 phút)**

### **Test 4: Pay with USDT**
1. [ ] Create new order
2. [ ] Select "Thanh toán Blockchain"
3. [ ] Connect wallet
4. [ ] Select token: USDT
5. [ ] See amount (e.g., 400 USDT)
6. [ ] Click "Thanh toán"
7. [ ] **Transaction 1:** Approve USDT
   - [ ] Confirm in MetaMask
   - [ ] ✅ Approve confirms
8. [ ] **Transaction 2:** Payment
   - [ ] Confirm in MetaMask
   - [ ] ✅ Payment confirms
9. [ ] ✅ Backend processes payment
10. [ ] ✅ Order status = PAID

### **Test 5: Network Guard**
1. [ ] Switch MetaMask to "Ethereum Mainnet"
2. [ ] Try to pay
3. [ ] ✅ Warning shown: "Wrong network"
4. [ ] Click "Switch to Hardhat Local"
5. [ ] ✅ MetaMask prompts switch
6. [ ] Approve switch
7. [ ] ✅ Can proceed with payment

### **Test 6: User Rejects**
1. [ ] Create order
2. [ ] Start payment
3. [ ] Click "Reject" in MetaMask
4. [ ] ✅ Error shown
5. [ ] ✅ Order remains PENDING
6. [ ] ✅ Can try again

---

## [object Object] BACKEND LOGS (Continuous)**

**Terminal 2 (Backend) should show:**

```
🌐 Blockchain Environment: local
📡 RPC URL: http://127.0.0.1:8545
🔗 WSS URL: ws://127.0.0.1:8545
🔗 Blockchain Service initialized
📍 Contract Address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
🌐 Network: Hardhat Local
👂 Starting to listen for OrderPaid events...
✅ Blockchain event listener started successfully
API listening on http://localhost:4000
💱 Exchange rate service running
```

**When payment happens:**
```
🔔 New payment detected!
📦 Order ID: xxx-xxx-xxx
👤 Payer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92[object Object]0.000667 (or 400 USDT)
🪙 Token: ETH (or USDT)
🔗 TxHash: 0x...
⚙️ Processing payment for order: xxx-xxx-xxx
🔍 Verifying transaction: 0x...
📊 Confirmations: 1
✅ Payment processed successfully!
```

---

## [object Object] QUICK VERIFICATION**

### **Database Check:**
```bash
cd backend
npx prisma studio
# Open http://localhost:5555
```

**Check Order table:**
- [ ] ✅ Latest order has status = CONFIRMED
- [ ] ✅ paymentStatus = COMPLETED
- [ ] ✅ cryptoTxHash filled
- [ ] ✅ cryptoAmount filled
- [ ] ✅ cryptoToken filled (ETH or USDT)
- [ ] ✅ cryptoVerifiedAt filled

### **MetaMask Check:**
- [ ] ✅ Balance decreased (e.g., 9,999.999 ETH)
- [ ] ✅ Transaction history shows payment
- [ ] ✅ Transaction status: Success

---

## [object Object] TROUBLESHOOTING**

### **❌ Backend không detect event**
```bash
# Check WebSocket connection
# Backend logs should show: "✅ Blockchain event listener started"

# If not, restart backend:
cd backend
npm run dev
```

### **❌ Transaction pending forever**
```bash
# Check Hardhat node is running
curl http://127.0.0.1:8545

# If not running:
cd blockchain
npm run node
```

### **❌ MetaMask shows "Nonce too high"**
```
MetaMask → Settings → Advanced → Clear activity tab data
```

### **❌ "Insufficient funds"**
```
# Check account balance in MetaMask
# Should be 10,000 ETH

# If 0, re-import account with correct private key:
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---

## [object Object] TEST SUMMARY**

| Test | Status | Time | Notes |
|------|--------|------|-------|
| Pre-test checks | ⏳ | 5m | |
| Create order (traditional) | ⏳ | 2m | |
| Connect MetaMask | ⏳ | 2m | |
| Pay with ETH | ⏳ | 3m | |
| Pay with USDT | ⏳ | 5m | |
| Network guard | ⏳ | 3m | |
| User rejects | ⏳ | 2m | |
| **TOTAL** | **0/7** | **22m** | |

**Legend:**
- ⏳ Not tested
- ✅ Passed
- ❌ Failed
- ⚠️ Passed with issues

---

## [object Object] PASS CRITERIA**

**Minimum to pass:**
- ✅ All pre-test checks pass
- ✅ Can create order
- ✅ Can connect MetaMask
- ✅ Can pay with ETH OR USDT
- ✅ Backend detects payment
- ✅ Order status updates to PAID
- ✅ Database records crypto info

**Nice to have:**
- ✅ Network guard works
- ✅ Error handling works
- ✅ Both ETH and USDT work

---

## [object Object]EXT STEPS AFTER TEST**

### **If all tests pass:**
1. ✅ Document results
2. ✅ Create demo video
3. ✅ Prepare for testnet deployment

### **If tests fail:**
1. ❌ Document bugs
2. ❌ Fix issues
3. ❌ Re-test

---

**[object Object]ẮT ĐẦU TEST NGAY!** 🧪

**Estimated time: 20-30 minutes**

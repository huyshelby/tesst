# [object Object] TEST PLAN - BLOCKCHAIN PAYMENT FLOW**

## [object Object]ỤC TIÊU TEST**

Kiểm tra toàn bộ quy trình thanh toán blockchain từ đầu đến cuối, đảm bảo:
1. ✅ User có thể kết nối MetaMask
2. ✅ User có thể tạo đơn hàng
3. ✅ User có thể thanh toán bằng blockchain
4. ✅ Backend detect event và update order
5. ✅ Order status chuyển sang PAID

---

## [object Object]HUẨN BỊ (PRE-TEST)**

### **1. Services phải đang chạy:**

```bash
# Terminal 1: Hardhat Node
cd blockchain
npm run node
# ✅ Check: http://127.0.0.1:8545 accessible

# Terminal 2: Backend
cd backend
npm run dev
# ✅ Check: http://localhost:4000/health returns {"status":"ok"}

# Terminal 3: Frontend
cd phone-app
npm run dev
# ✅ Check: http://localhost:3000 loads
```

### **2. MetaMask Setup:**

```
✅ Network: Hardhat Local
   - RPC: http://127.0.0.1:8545
   - Chain ID: 31337
   - Symbol: ETH

✅ Account imported:
   - Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   - Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   - Balance: 10,000 ETH
```

### **3. Database:**

```bash
# Check database connection
cd backend
npx prisma studio
# ✅ Open http://localhost:5555
# ✅ Check Order table exists
# ✅ Check crypto fields exist
```

### **4. Contract:**

```
✅ Deployed: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✅ Network: Hardhat Local (31337)
✅ Recipient: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

## [object Object] TEST CASES**

### **TEST CASE 1: HEALTH CHECK**

**Objective:** Verify all services are running

**Steps:**
1. Check Hardhat node: `curl http://127.0.0.1:8545`
2. Check Backend: `curl http://localhost:4000/health`
3. Check Frontend: Open http://localhost:3000
4. Check MetaMask: Network = Hardhat Local, Balance = 10,000 ETH

**Expected Result:**
- ✅ All services respond
- ✅ MetaMask shows correct network
- ✅ Account has 10,000 ETH

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 2: CREATE ORDER (NO PAYMENT)**

**Objective:** Verify order creation flow

**Steps:**
1. Go to http://localhost:3000
2. Browse products
3. Add product to cart
4. Go to `/gio-hang`
5. Click "Thanh toán"
6. Login if needed
7. Fill shipping info:
   - Name: Test User
   - Phone: 0912345678
   - Address: 123 Test Street
   - City: Ho Chi Minh
8. Select payment method: "Thanh toán truyền thống" → "Thẻ ATM"
9. Click "Hoàn tất đặt hàng"

**Expected Result:**
- ✅ Order created successfully
- ✅ Redirect to success page
- ✅ Order status: PENDING
- ✅ Payment status: PENDING
- ✅ Order visible in `/account/orders`

**Database Check:**
```sql
SELECT 
  orderNumber,
  status,
  paymentStatus,
  paymentMethod,
  total
FROM Order
ORDER BY createdAt DESC
LIMIT 1;
```

**Expected:**
- status: PENDING
- paymentStatus: PENDING
- paymentMethod: CARD

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 3: CONNECT METAMASK**

**Objective:** Verify MetaMask connection

**Steps:**
1. Go to http://localhost:3000
2. Add product to cart
3. Go to checkout `/thanh-toan`
4. Select "Thanh toán Blockchain"
5. Click "Kết nối ví"
6. MetaMask popup appears
7. Click "Connect"

**Expected Result:**
- ✅ MetaMask popup shows
- ✅ Connection successful
- ✅ Address displayed: 0xf39Fd...
- ✅ Balance shown: 10,000 ETH

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 4: NETWORK GUARD**

**Objective:** Verify chain switching

**Steps:**
1. In MetaMask, switch to "Ethereum Mainnet"
2. Refresh checkout page
3. Try to connect wallet
4. Observe warning message
5. Click "Switch to Hardhat Local"
6. MetaMask popup appears
7. Approve network switch

**Expected Result:**
- ✅ Warning shown: "Wrong network"
- ✅ Switch button appears
- ✅ MetaMask prompts network switch
- ✅ After switch: Network = Hardhat Local
- ✅ Can proceed with payment

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 5: PAY WITH NATIVE COIN (ETH)**

**Objective:** Test payment with native coin

**Pre-condition:**
- MetaMask connected
- Correct network (Hardhat Local)
- Order created

**Steps:**
1. On checkout page
2. Select "Thanh toán Blockchain"
3. Wallet connected
4. Select token: **ETH (Native Coin)**
5. See amount: e.g., "0.000667 ETH" for 10,000,000 VND
6. Click "Thanh toán bằng Blockchain"
7. MetaMask popup shows:
   - To: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
   - Amount: 0.000667 ETH
   - Gas: ~50,000
8. Click "Confirm"
9. Wait for confirmation

**Expected Result:**
- ✅ Transaction submitted
- ✅ TxHash received
- ✅ Transaction confirms INSTANTLY (0s)
- ✅ Backend logs show:
   ```
   🔔 New payment detected!
   📦 Order ID: xxx
   👤 Payer: 0xf39Fd...
   💰 Amount: 0.000667 ETH
   ✅ Payment processed successfully!
   ```
- ✅ Frontend shows success message
- ✅ Order status: CONFIRMED
- ✅ Payment status: COMPLETED

**Database Check:**
```sql
SELECT 
  orderNumber,
  status,
  paymentStatus,
  cryptoTxHash,
  cryptoAmount,
  cryptoToken,
  cryptoVerifiedAt
FROM Order
WHERE id = '<order-id>';
```

**Expected:**
- status: CONFIRMED
- paymentStatus: COMPLETED
- cryptoTxHash: 0x...
- cryptoAmount: 0.000667
- cryptoToken: ETH
- cryptoVerifiedAt: NOT NULL

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 6: PAY WITH ERC20 TOKEN (USDT)**

**Objective:** Test payment with ERC20 token

**Pre-condition:**
- MetaMask connected
- Correct network
- New order created

**Steps:**
1. On checkout page
2. Select "Thanh toán Blockchain"
3. Wallet connected
4. Select token: **USDT**
5. See amount: e.g., "400 USDT" for 10,000,000 VND
6. Click "Thanh toán bằng Blockchain"

**Transaction 1: Approve**
7. MetaMask popup shows:
   - Function: approve
   - Spender: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
   - Amount: 400 USDT
8. Click "Confirm"
9. Wait for approval confirmation

**Transaction 2: Payment**
10. MetaMask popup shows again:
    - Function: payOrderWithToken
    - Amount: 400 USDT
11. Click "Confirm"
12. Wait for payment confirmation

**Expected Result:**
- ✅ Approve transaction confirms
- ✅ Payment transaction confirms
- ✅ Both transactions INSTANT (0s)
- ✅ Backend detects payment event
- ✅ Order updated to PAID

**Database Check:**
```sql
SELECT 
  orderNumber,
  status,
  paymentStatus,
  cryptoTxHash,
  cryptoAmount,
  cryptoToken
FROM Order
WHERE id = '<order-id>';
```

**Expected:**
- status: CONFIRMED
- paymentStatus: COMPLETED
- cryptoTxHash: 0x... (payment tx, not approve tx)
- cryptoAmount: 400
- cryptoToken: USDT

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 7: DOUBLE-SPENDING PREVENTION**

**Objective:** Verify backend prevents double-spending

**Steps:**
1. Create Order A
2. Pay Order A with txHash X
3. Order A status → PAID
4. Create Order B
5. Try to manually call backend API:
   ```bash
   curl -X PUT http://localhost:4000/api/orders/admin/<order-b-id>/payment \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <admin-token>" \
     -d '{"paymentStatus":"COMPLETED","cryptoTxHash":"<txHash-X>"}'
   ```

**Expected Result:**
- ✅ Order B should NOT be marked as PAID
- ✅ Backend logs show: "Transaction already used"
- ✅ Order B remains PENDING

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 8: INSUFFICIENT BALANCE**

**Objective:** Test behavior when user has insufficient balance

**Steps:**
1. In MetaMask, switch to a different account (Account #2)
2. This account has 0 ETH
3. Try to pay with ETH
4. MetaMask should show error

**Expected Result:**
- ✅ MetaMask shows "Insufficient funds"
- ✅ Transaction cannot be submitted
- ✅ Order remains PENDING

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 9: USER REJECTS TRANSACTION**

**Objective:** Test behavior when user rejects in MetaMask

**Steps:**
1. Create order
2. Connect wallet
3. Click "Pay"
4. MetaMask popup appears
5. Click "Reject"

**Expected Result:**
- ✅ Transaction not submitted
- ✅ Frontend shows error: "User rejected transaction"
- ✅ Order remains PENDING
- ✅ User can try again

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 10: BACKEND RESTART DURING PAYMENT**

**Objective:** Test system resilience

**Steps:**
1. Create order
2. Start payment process
3. While transaction is pending, restart backend
4. Transaction confirms on blockchain
5. Restart backend
6. Check if order is updated

**Expected Result:**
- ⚠️ Event might be missed (no persistent queue)
- ✅ User can manually verify via API
- ✅ Admin can manually update order

**Note:** This is a known limitation. Production should use:
- Message queue (RabbitMQ, Redis)
- Event replay mechanism
- Persistent event storage

**Actual Result:** _[Điền sau khi test]_

---

## [object Object] PERFORMANCE TEST**

### **TEST CASE 11: CONCURRENT PAYMENTS**

**Objective:** Test multiple payments simultaneously

**Steps:**
1. Open 3 browser tabs
2. Create 3 different orders
3. Pay all 3 orders at the same time
4. Check if all are processed correctly

**Expected Result:**
- ✅ All 3 transactions confirm
- ✅ Backend processes all 3 events
- ✅ All 3 orders updated to PAID
- ✅ No race conditions
- ✅ No duplicate processing

**Actual Result:** _[Điền sau khi test]_

---

## [object Object] INTEGRATION TEST**

### **TEST CASE 12: FULL USER JOURNEY**

**Objective:** Complete end-to-end user flow

**Steps:**
1. **Browse:** Visit homepage
2. **Search:** Find iPhone 15 Pro Max
3. **View:** Click product details
4. **Add to cart:** Select color, storage, add to cart
5. **View cart:** Go to `/gio-hang`
6. **Update quantity:** Change quantity to 2
7. **Checkout:** Click "Thanh toán"
8. **Login:** Login with test account
9. **Shipping:** Fill shipping information
10. **Payment method:** Select "Thanh toán Blockchain"
11. **Connect wallet:** Connect MetaMask
12. **Select token:** Choose USDT
13. **Approve:** Approve token spending
14. **Pay:** Complete payment
15. **Success:** See success page
16. **View order:** Go to `/account/orders`
17. **Order details:** Click on order to see details

**Expected Result:**
- ✅ Smooth flow, no errors
- ✅ All steps work correctly
- ✅ Order visible in account
- ✅ Order details show crypto payment info
- ✅ Transaction hash is clickable (if explorer configured)

**Actual Result:** _[Điền sau khi test]_

---

## [object Object] NEGATIVE TEST**

### **TEST CASE 13: WRONG AMOUNT**

**Objective:** Verify backend rejects wrong amount

**Steps:**
1. Create order for 10,000,000 VND (400 USDT)
2. Manually send only 100 USDT to contract
3. Check if backend accepts it

**Expected Result:**
- ✅ Backend logs: "Insufficient payment amount"
- ✅ Order remains PENDING
- ✅ Payment not accepted

**Actual Result:** _[Điền sau khi test]_

---

### **TEST CASE 14: WRONG TOKEN**

**Objective:** Verify backend rejects wrong token

**Steps:**
1. Create order, select USDT
2. Pay with ETH instead
3. Check if backend accepts it

**Expected Result:**
- ✅ Backend logs: "Wrong token"
- ✅ Order remains PENDING
- ✅ Payment not accepted

**Actual Result:** _[Điền sau khi test]_

---

## [object Object] TEST SUMMARY**

### **Test Results:**

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC1: Health Check | ⏳ | |
| TC2: Create Order | ⏳ | |
| TC3: Connect MetaMask | ⏳ | |
| TC4: Network Guard | ⏳ | |
| TC5: Pay with ETH | ⏳ | |
| TC6: Pay with USDT | ⏳ | |
| TC7: Double-spending | ⏳ | |
| TC8: Insufficient Balance | ⏳ | |
| TC9: User Rejects | ⏳ | |
| TC10: Backend Restart | ⏳ | |
| TC11: Concurrent Payments | ⏳ | |
| TC12: Full Journey | ⏳ | |
| TC13: Wrong Amount | ⏳ | |
| TC14: Wrong Token | ⏳ | |

**Legend:**
- ⏳ Not tested yet
- ✅ Passed
- ❌ Failed
- ⚠️ Passed with issues

---

## [object Object]UGS FOUND**

| Bug ID | Severity | Description | Status |
|--------|----------|-------------|--------|
| - | - | - | - |

---

## [object Object]ECOMMENDATIONS**

_[Điền sau khi test]_

---

## [object Object]EST ENVIRONMENT**

```
Date: 2025-12-21
Tester: [Your Name]
Environment: Local Development

Services:
- Hardhat Node: http://127.0.0.1:8545
- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- Contract: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

MetaMask:
- Network: Hardhat Local (31337)
- Account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- Balance: 10,000 ETH
```

---

**[object Object]ẮT ĐẦU TEST!** 🧪

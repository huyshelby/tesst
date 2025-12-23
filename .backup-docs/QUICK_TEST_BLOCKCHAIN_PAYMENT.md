# 🚀 TEST NHANH BLOCKCHAIN PAYMENT - 5 PHÚT

**Mục tiêu:** Test blockchain payment từ frontend → smart contract → backend trong 5 phút

---

## ⚡ CHUẨN BỊ (1 phút)

### 1. Khởi động hệ thống:

```bash
# Terminal 1: Hardhat (đã chạy)
cd blockchain
npm run node

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd phone-app
npm run dev
```

### 2. Cấu hình MetaMask:

```
Network: Hardhat Local
RPC: http://127.0.0.1:8545
Chain ID: 31337

Import account:
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Balance: 10,000 ETH
```

---

## 🧪 TEST FLOW (3 phút)

### Bước 1: Tạo đơn hàng (30 giây)
1. Mở http://localhost:3000
2. Đăng nhập (hoặc đăng ký)
3. Thêm 1 sản phẩm vào giỏ
4. Click "Thanh toán"

### Bước 2: Chọn blockchain payment (30 giây)
1. Chọn tab "Thanh toán Blockchain"
2. Chọn token: **ETH** (native coin - nhanh nhất)
3. Điền thông tin giao hàng
4. Click "Thanh toán bằng Blockchain"

### Bước 3: Thực hiện payment (1 phút)
1. **Modal hiện lên** → "Thanh toán Blockchain"
2. Click "Kết nối MetaMask" (nếu chưa connect)
3. MetaMask popup → Click "Connect"
4. Nếu sai network → Click "Chuyển sang Hardhat Local"
5. Xem thông tin payment → Click "Xác nhận thanh toán"
6. **MetaMask popup** → Click "Confirm"
7. Chờ ~1 giây → **"Thanh toán thành công!"**
8. Click "Hoàn tất"

### Bước 4: Verify (1 phút)
1. **Frontend:** Redirect đến trang success ✅
2. **Backend logs:** Thấy "🔔 New payment detected!" ✅
3. **Database:** Order status = COMPLETED ✅

---

## ✅ KẾT QUẢ MONG ĐỢI

### Frontend:
```
✅ Modal hiển thị đúng
✅ MetaMask connect thành công
✅ Transaction confirm trong ~1 giây
✅ Success page hiển thị
✅ Cart đã được clear
```

### Backend logs[object Object]New payment detected!
📦 Order ID: ...
👤 Payer: 0xf39...
💰: 0.01 ETH
🔗 TxHash: 0x...
✅ Payment processed successfully!
```

### Database:
```sql
SELECT orderNumber, paymentStatus, status, cryptoTxHash
FROM "Order"
WHERE orderNumber = 'ORD-...';

-- Result:
-- paymentStatus: COMPLETED
-- status: CONFIRMED
-- cryptoTxHash: 0x...
```

---

## [object Object]ESHOOTING

### ❌ "MetaMask not installed"
→ Cài MetaMask extension

### ❌ "Wrong network"
→ Click "Chuyển sang Hardhat Local" trong modal

### ❌ "Insufficient balance"
→ Import test account với 10,000 ETH

### ❌ Modal không hiện
→ Check console logs, có thể lỗi import

### ❌ Backend không detect event
→ Check backend đang chạy và WebSocket connected

### ❌ Transaction pending mãi
→ Hardhat node có thể bị crash, restart lại

---

## 🎯 TEST SCENARIOS

### Scenario 1: Native Coin (ETH) - NHANH NHẤT ⚡
```
Token: ETH
Amount: 0.01 ETH
Steps: Connect → Confirm → Done
Time: ~1 giây
```

### Scenario 2: ERC20 Token (USDT) - CẦN APPROVE
```
Token: USDT
Amount: 10 USDT
Steps: Connect → Approve → Confirm → Done
Time: ~2 giây (2 transactions)
```

### Scenario 3: Error Handling
```
Test: User rejects transaction
Expected: Error message + Retry button
```

---

## 📊 CHECKLIST

- [ ] Hardhat node running
- [ ] Backend running
- [ ] Frontend running
- [ ] MetaMask configured
- [ ] Test account imported
- [ ] Can create order
- [ ] Modal opens
- [ ] MetaMask connects
- [ ] Transaction confirms
- [ ] Backend detects event
- [ ] Order status updates
- [ ] Success page shows

---

## 🎉 SUCCESS CRITERIA

✅ **PASS nếu:**
1. Modal hiển thị và hoạt động
2. MetaMask connect thành công
3. Transaction confirm trong < 5 giây
4. Backend logs "Payment processed successfully"
5. Order status = COMPLETED
6. Redirect đến success page

❌ **FAIL nếu:**
- Modal không hiện
- MetaMask không connect
- Transaction fail
- Backend không detect
- Order status không update

---

**Thời gian test: < 5 phút**  
**Độ khó: Dễ**  
**Yêu cầu: MetaMask + Hardhat node**

🚀 **Sẵn sàng test? Bắt đầu ngay!**


# ✅ TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI ĐỐN HÀNG SAU THANH TOÁN

**Mục tiêu:** Khi thanh toán blockchain thành công → Tự động cập nhật order status

---

## 📊 FLOW HOÀN CHỈNH

```
User thanh toán blockchain
    ↓
Transaction confirm trên blockchain
    ↓
Smart contract emit OrderPaid event
    ↓
Backend WebSocket listener detect event
    ↓
Backend verify transaction
    ↓
Backend update database:
  - paymentStatus: PENDING → COMPLETED ✅
  - status: PENDING → CONFIRMED ✅
  - cryptoTxHash: 0x...
  - cryptoAmount: 0.01
  - cryptoVerifiedAt: timestamp
    ↓
Frontend poll/refresh
    ↓
Hiển thị "Đơn hàng đã được xác nhận" ✅
```

---

## ✅ BACKEND ĐÃ CÓ LOGIC

### File: `backend/src/services/blockchain/blockchain.service.ts`

```typescript
private async processPayment(orderId: string, txHash: string): Promise<void> {
  try {
    // 1. Verify transaction
    const verification = await this.verifyTransaction(txHash);
    if (!verification.isValid) return;

    // 2. Find order
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return;

    // 3. Update order status ✅
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "COMPLETED",    // ✅ Thanh toán hoàn tất
        status: "CONFIRMED",            // ✅ Đơn hàng xác nhận
        cryptoTxHash: txHash,
        cryptoAmount: parseFloat(verification.amount!),
        cryptoVerifiedAt: new Date(),
        cryptoConfirmations: verification.confirmations
      }
    });

    console.log("✅ Payment processed successfully!");
  } catch (error) {
    console.error("❌ Failed to process payment:", error);
  }
}
```

### Event Listener:

```typescript
async startListening(): Promise<void> {
  console.log("👂 Starting to listen for OrderPaid events...");

  this.contract.on("OrderPaid", async (orderId, payer, amount, token, paymentMethod, timestamp, event) => {
    console.log("\n🔔 New payment detected!");
    console.log("📦 Order ID:", orderId);
    console.log("🔗 TxHash:", event.transactionHash);

    // Tự động process payment
    await this.processPayment(orderId, event.transactionHash);
  });

  console.log("✅ Blockchain event listener started successfully");
}
```

---

## 🚀 CÁCH KIỂM TRA

### Bước 1: Đảm bảo Backend đang chạy

```bash
cd backend
npm run dev
```

**Kiểm tra logs phải thấy:**
```
API listening on http://localhost:4000
🔗 Blockchain Service initialized
📍 Contract Address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
👂 Starting to listen for OrderPaid events...
✅ Blockchain event listener started successfully
```

### Bước 2: Test thanh toán

```bash
# Terminal 1: Hardhat node (đã chạy)
cd blockchain
npm run node

# Terminal 2: Backend (đã chạy)
cd backend
npm run dev

# Terminal 3: Frontend
cd phone-app
npm run dev
```

### Bước 3: Thực hiện thanh toán

1. Mở http://localhost:3000/thanh-toan
2. Tạo đơn hàng
3. Chọn "Thanh toán Blockchain"
4. Connect MetaMask
5. Chọn ETH
6. Click "Thanh toán bằng Blockchain"
7. Confirm trong MetaMask
8. Đợi transaction confirm

### Bước 4: Kiểm tra Backend Logs

**Expected logs:**
```
🔔 New payment detected!
📦 Order ID: abc-123-xyz
👤 Payer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰: 0.01 ETH
🔗 TxHash: 0x21e52162...
⚙️ Processing payment for order: abc-123-xyz
🔍 Verifying transaction: 0x21e52162...
📊 Confirmations: 1
✅ Payment processed successfully!
```

### Bước 5: Verify trong Database

```bash
cd backend
npx prisma studio
```

**Mở Order table, tìm order vừa thanh toán:**
```
✅ paymentStatus: "COMPLETED"
✅ status: "CONFIRMED"
✅ cryptoTxHash: "0x21e52162..."
✅ cryptoAmount: 0.01
✅ cryptoVerifiedAt: "2025-12-21 20:30:00"
✅ cryptoConfirmations: 1
```

---

## 🔧 NẾU KHÔNG TỰ ĐỘNG CẬP NHẬT

### Vấn đề 1: Backend không chạy
**Giải pháp:**
```bash
cd backend
npm run dev
```

### Vấn đề 2: WebSocket không connect
**Check logs:**
```
❌ Failed to start blockchain listener
```

**Giải pháp:**
```bash
# Check Hardhat node đang chạy
curl http://localhost:8545

# Restart backend
cd backend
npm run dev
```

### Vấn đề 3: Contract address sai
**Check file:** `backend/.env`
```env
PAYMENT_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**Phải khớp với contract đã deploy!**

### Vấn đề 4: Event không được emit
**Check smart contract logs:**
```bash
# Trong Hardhat node terminal
# Phải thấy transaction logs
```

---

## 📱 FRONTEND HIỂN THỊ STATUS

### Option 1: Polling (Đơn giản)

**File:** `phone-app/src/app/dat-hang-thanh-cong/page.tsx`

```typescript
"use client";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);
  const orderNumber = new URLSearchParams(window.location.search).get("orderNumber");

  // Poll order status mỗi 3 giây
  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders/${orderNumber}`);
      const data = await res.json();
      setOrder(data);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);

    return () => clearInterval(interval);
  }, [orderNumber]);

  return (
    <div>
      <h1>Đơn hàng: {orderNumber}</h1>
      
      {order?.paymentStatus === "COMPLETED" && (
        <div className="bg-green-50 p-4 rounded">
          ✅ Thanh toán thành công!
        </div>
      )}

      {order?.status === "CONFIRMED" && (
        <div className="bg-blue-50 p-4 rounded">
          ✅ Đơn hàng đã được xác nhận!
        </div>
      )}

      <div>
        <p>Trạng thái thanh toán: {order?.paymentStatus}</p>
        <p>Trạng thái đơn hàng: {order?.status}</p>
      </div>
    </div>
  );
}
```

### Option 2: WebSocket (Real-time)

**Backend emit event:**
```typescript
// backend/src/services/blockchain/blockchain.service.ts
import { io } from "../server"; // Socket.io instance

private async processPayment(orderId: string, txHash: string) {
  // ... update database ...

  // Emit WebSocket event
  io.emit(`order:${orderId}:updated`, {
    orderId,
    paymentStatus: "COMPLETED",
    status: "CONFIRMED",
    txHash
  });
}
```

**Frontend listen:**
```typescript
import { io } from "socket.io-client";

useEffect(() => {
  const socket = io("http://localhost:4000");

  socket.on(`order:${orderId}:updated`, (data) => {
    setOrder(data);
    // Show notification
    toast.success("Đơn hàng đã được xác nhận!");
  });

  return () => socket.disconnect();
}, [orderId]);
```

---

## ✅ CHECKLIST

### Backend:
- [ ] Hardhat node đang chạy
- [ ] Backend đang chạy
- [ ] Logs thấy "Blockchain event listener started"
- [ ] Contract address đúng trong .env

### Smart Contract:
- [ ] Contract đã deploy
- [ ] Contract address đúng
- [ ] Event OrderPaid được emit

### Database:
- [ ] Order được tạo với status="PENDING"
- [ ] Sau payment: status="CONFIRMED"
- [ ] paymentStatus="COMPLETED"
- [ ] cryptoTxHash được lưu

### Frontend:
- [ ] Redirect đến success page
- [ ] Hiển thị order status
- [ ] Poll hoặc WebSocket update status

---

## 🎯 KẾT LUẬN

**Hệ thống ĐÃ CÓ tự động cập nhật trạng thái!**

### Khi thanh toán thành công:
```
✅ paymentStatus: PENDING → COMPLETED
✅ status: PENDING → CONFIRMED
✅ cryptoTxHash: Được lưu
✅ cryptoAmount: Được lưu
✅ cryptoVerifiedAt: Timestamp
```

### Cần làm:
1. ✅ Đảm bảo backend đang chạy
2. ✅ Đảm bảo WebSocket listener active
3. ✅ Frontend poll/subscribe để hiển thị

**Tất cả đã sẵn sàng! Chỉ cần chạy đầy đủ 3 services!** 🚀



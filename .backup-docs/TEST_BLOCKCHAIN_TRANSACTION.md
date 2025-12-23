# 🧪 HƯỚNG DẪN TEST GIAO DỊCH BLOCKCHAIN

**Mục tiêu:** Test một giao dịch thanh toán blockchain hoàn chỉnh từ frontend → smart contract → backend

---

## 📋 CHUẨN BỊ

### Trạng thái hiện tại:
- ✅ Hardhat node: **ĐANG CHẠY** (port 8545)
- ❌ Backend: **CHƯA CHẠY** (port 4000)
- ❓ Frontend: **CHƯA KIỂM TRA** (port 3000)

### Contract đã deploy:
```
Address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Network: Hardhat Local (Chain ID: 31337)
Recipient: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

## [object Object]ƯỚC 1: KHỞI ĐỘNG HỆ THỐNG

### Terminal 1: Hardhat Node (Đã chạy ✅)
```bash
# Đã chạy, không cần làm gì
```

### Terminal 2: Backend
```bash
cd backend
npm run dev

# Chờ thấy logs:
# ✅ API listening on http://localhost:4000
# ✅ Blockchain event listener started successfully
```

### Terminal 3: Frontend
```bash
cd phone-app
npm run dev

# Chờ thấy:
# ✅ Ready on http://localhost:3000
```

---

## 🦊 BƯỚC 2: CẤU HÌNH METAMASK

### 2.1. Thêm Hardhat Network
```
MetaMask → Settings → Networks → Add Network

Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

### 2.2. Import Test Account
```
MetaMask → Import Account → Private Key

Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

✅ Kết quả:
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Balance: 10,000 ETH
```

### 2.3. Switch sang Hardhat Network
```
MetaMask → Network dropdown → Chọn "Hardhat Local"
```

---

## 🧪 BƯỚC 3: TEST GIAO DỊCH

### Option A: Test bằng Script (Nhanh)

Tạo file `blockchain/scripts/test-payment.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const [signer] = await ethers.getSigners();

  console.log("🧪 Testing payment transaction...");
  console.log("[object Object]ayer:", signer.address);
  console.log("📍 Contract:", contractAddress);

  // Get contract instance
  const PaymentContract = await ethers.getContractFactory("PaymentContract");
  const contract = PaymentContract.attach(contractAddress);

  // Test payment với native ETH
  const orderId = `TEST-${Date.now()}`;
  const amount = ethers.parseEther("0.01"); // 0.01 ETH

  console.log("\n💰 Sending payment...");
  console.log("📦 Order ID:", orderId);
  console.log("💵 Amount:", ethers.formatEther(amount), "ETH");

  const tx = await contract.payOrderWithNative(orderId, {
    value: amount,
    gasLimit: 200000
  });

  console.log("📤 Transaction sent:", tx.hash);
  console.log("⏳ Waiting for confirmation...");

  const receipt = await tx.wait();

  console.log("✅ Transaction confirmed!");
  console.log("🔗 Block:", receipt.blockNumber);
  console.log("⛽ Gas used:", receipt.gasUsed.toString());

  // Parse event
  const event = receipt.logs[0];
  const iface = contract.interface;
  const parsedEvent = iface.parseLog(event);

  console.log("\n🎉 Event emitted:");
  console.log("📦 Order ID:", parsedEvent.args.orderId);
  console.log("[object Object]dEvent.args.payer);
  console.log("💰 Amount:", ethers.formatEther(parsedEvent.args.amount), "ETH");
  console.log("🪙 Token:", parsedEvent.args.token);
  console.log("💳 Method:", parsedEvent.args.paymentMethod);

  console.log("\n✅ Test completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
```

Chạy test:
```bash
cd blockchain
npx hardhat run scripts/test-payment.ts --network localhost
```

### Option B: Test qua Frontend (Đầy đủ)

**⚠️ LƯU Ý:** Frontend hiện tại CHƯA CÓ code thực thi payment. Cần implement trước.

#### B.1. Tạo hook payment (nếu chưa có)

File: `phone-app/src/lib/blockchain/use-payment.ts`

```typescript
"use client";

import { ethers } from "ethers";
import { useState } from "react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS!;
const CONTRACT_ABI = [
  "function payOrderWithNative(string orderId) external payable",
  "function payOrderWithToken(string orderId, address token, uint256 amount) external",
  "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)"
];

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payWithNative = async (orderId: string, amount: string) => {
    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.payOrderWithNative(orderId, {
        value: ethers.utils.parseEther(amount)
      });

      const receipt = await tx.wait();
      return { success: true, txHash: receipt.transactionHash };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { payWithNative, loading, error };
}
```

#### B.2. Test qua UI

1. Mở http://localhost:3000
2. Đăng nhập (hoặc đăng ký)
3. Thêm sản phẩm vào giỏ hàng
4. Vào trang thanh toán
5. Chọn "Thanh toán Blockchain"
6. Click "Kết nối ví" → Approve trong MetaMask
7. Chọn token: ETH
8. Click "Thanh toán" → Confirm trong MetaMask
9. Chờ transaction confirm
10. Kiểm tra order status → PAID

---

## 📊 BƯỚC 4: KIỂM TRA KẾT QUẢ

### 4.1. Kiểm tra Backend Logs
```
Backend terminal sẽ hiển thị:

🔔 New payment detected!
📦 Order ID: TEST-1234567890
👤 Payer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰: 0.01 ETH
🔗 TxHash: 0x...
✅ Payment processed successfully!
```

### 4.2. Kiểm tra Database
```bash
cd backend
npx prisma studio

# Mở Order table
# Tìm order với ID = TEST-1234567890
# Kiểm tra:
# - paymentStatus = "COMPLETED"
# - status = "CONFIRMED"
# - cryptoTxHash = "0x..."
# - cryptoAmount = 0.01
# - cryptoVerifiedAt = timestamp
```

### 4.3. Kiểm tra Blockchain
```bash
cd blockchain
npx hardhat console --network localhost
```

```javascript
const contract = await ethers.getContractAt(
  "PaymentContract", 
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
);

// Check if order processed
await contract.isOrderProcessed("TEST-1234567890");
// → true

// Check recipient balance
const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const balance = await ethers.provider.getBalance(recipient);
console.log("Balance:", ethers.formatEther(balance), "ETH");
```

---

## ✅ KẾT QUẢ MONG ĐỢI

### Transaction thành công:
- ✅ MetaMask hiển thị transaction confirmed
- ✅ Backend logs "Payment processed successfully"
- ✅ Database: order.paymentStatus = "COMPLETED"
- ✅ Smart contract: isOrderProcessed = true
- ✅ Recipient wallet nhận được tiền

### Thời gian:
- ⚡ Hardhat local: **INSTANT** (< 1 giây)
- 🌐 BSC Testnet: ~3-5 giây
- 🌍 Ethereum Mainnet: ~15-30 giây

---

## [object Object]ESHOOTING

### ❌ "Cannot connect to MetaMask"
→ Cài đặt MetaMask extension

### ❌ "Wrong network"
→ Switch sang Hardhat Local trong MetaMask

### ❌ "Insufficient funds"
→ Import test account với 10,000 ETH

### ❌ "Transaction reverted"
→ Kiểm tra logs, có thể do:
- Order ID đã được xử lý
- Amount = 0
- Contract paused

### ❌ Backend không detect event
→ Kiểm tra:
- WebSocket connection (ws://127.0.0.1:8545)
- Contract address đúng
- Backend đang chạy

---

## 🎯 KHUYẾN NGHỊ

**Để test nhanh nhất:**
1. Dùng script test (Option A) - không cần frontend
2. Chạy: `npx hardhat run scripts/test-payment.ts --network localhost`
3. Kiểm tra backend logs
4. Verify trong database

**Thời gian:** < 5 phút

---

**Sẵn sàng test? Chạy lệnh sau để bắt đầu!** 🚀


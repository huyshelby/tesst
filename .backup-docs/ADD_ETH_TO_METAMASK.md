# [object Object]ƯỚNG DẪN THÊM 10,000 ETH VÀO VÍ METAMASK

**Mục tiêu:** Thêm ETH testnet vào ví MetaMask để test blockchain payment

---

## [object Object]ÓM TẮT NHANH

### Hardhat Local (Khuyến nghị - Dễ nhất):
```
✅ Import test account có sẵn 10,000 ETH
✅ Không cần faucet
✅ Không giới hạn
✅ Instant
```

### BSC Testnet:
```
⏳ Xin từ faucet (0.5 BNB/lần)
⏳ Giới hạn theo thời gian
⏳ Cần Twitter/GitHub
```

---

## 🚀 PHƯƠNG PHÁP 1: IMPORT TEST ACCOUNT (HARDHAT LOCAL)

### Bước 1: Cấu hình Hardhat Network trong MetaMask

1. Mở MetaMask
2. Click dropdown network (góc trên bên trái)
3. Click "Add Network" hoặc "Add a network manually"
4. Điền thông tin:

```
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Block Explorer URL: (để trống)
```

5. Click "Save"

### Bước 2: Import Test Account

**Account #0 (Recommended - 10,000 ETH):**
```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Balance: 10,000 ETH
```

**Cách import:**
1. MetaMask → Click icon account (góc trên phải)
2. Click "Import Account"
3. Chọn "Private Key"
4. Paste private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
5. Click "Import"

**✅ Kết quả:** Balance hiển thị 10,000 ETH!

### Bước 3: Verify

1. Switch sang network "Hardhat Local"
2. Check balance → Thấy 10,000 ETH
3. Thử gửi transaction test → Success!

---

## 💎 DANH SÁCH TEST ACCOUNTS (HARDHAT)

Hardhat cung cấp 20 test accounts, mỗi account có 10,000 ETH:

### Account #0 (Recommended):
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Balance: 10,000 ETH
```

### Account #1:
```
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Balance: 10,000 ETH
```

### Account #2:
```
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Balance: 10,000 ETH
```

**Lưu ý:** Tất cả accounts này chỉ hoạt động trên Hardhat Local network!

---

## 🌐 PHƯƠNG PHÁP 2: FAUCET (BSC TESTNET)

### Bước 1: Cấu hình BSC Testnet

```
Network Name: BSC Testnet
RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
Chain ID: 97
Currency Symbol: BNB
Block Explorer: https://testnet.bscscan.com/
```

### Bước 2: Lấy BNB từ Faucet

**Option 1: Binance Faucet (Khuyến nghị)**
```
URL: https://testnet.binance.org/faucet-smart
Số lượng: 0.5 BNB/lần
Giới hạn: 1 lần/24h
Yêu cầu: Không
```

**Cách dùng:**
1. Mở https://testnet.binance.org/faucet-smart
2. Copy địa chỉ ví MetaMask
3. Paste vào ô "Address"
4. Click "Give me BNB"
5. Đợi 1-2 phút
6. Check balance trong MetaMask

**Option 2: Testnet Faucet List**
```
1. https://testnet.bnbchain.org/faucet-smart
2. https://www.bnbchain.org/en/testnet-faucet
3. https://faucet.quicknode.com/binance-smart-chain/bnb-testnet
```

### Bước 3: Verify
```
MetaMask → BSC Testnet → Check balance
Expected: 0.5 BNB (hoặc nhiều hơn)
```

---

## 🔧 PHƯƠNG PHÁP 3: SCRIPT TỰ ĐỘNG (HARDHAT)

### Tạo script transfer ETH:

**File:** `blockchain/scripts/fund-wallet.ts`

```typescript
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Địa chỉ ví cần fund
  const targetAddress = "0xYOUR_METAMASK_ADDRESS_HERE";
  const amount = ethers.parseEther("10000"); // 10,000 ETH

  console.log("Funding wallet:", targetAddress);
  console.log("Amount:", ethers.formatEther(amount), "ETH");

  // Send ETH
  const tx = await deployer.sendTransaction({
    to: targetAddress,
    value: amount
  });

  await tx.wait();
  console.log("✅ Funded successfully!");
  console.log("TX Hash:", tx.hash);

  // Check balance
  const balance = await ethers.provider.getBalance(targetAddress);
  console.log("New balance:", ethers.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Chạy script:
```bash
cd blockchain
npx hardhat run scripts/fund-wallet.ts --network localhost
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Về Hardhat Local:
- ✅ **10,000 ETH FREE** - Không giới hạn
- ✅ **Instant mining** - Transaction confirm ngay lập tức
- ✅ **No gas fee** - Không tốn phí thật
- ⚠️ **Chỉ local** - Không thể dùng trên mainnet
- ⚠️ **Reset khi restart** - Mất balance khi tắt Hardhat node

### Về Private Keys:
- ⚠️ **KHÔNG BAO GIỜ** dùng private key test trên mainnet
- ⚠️ **KHÔNG BAO GIỜ** gửi tiền thật vào test accounts
- ⚠️ **KHÔNG BAO GIỜ** share private key có tiền thật
- ✅ Test accounts chỉ dùng cho development

### Về BSC Testnet:
- ✅ Real testnet - Giống mainnet nhưng không có giá trị
- ✅ Có block explorer - Verify transactions
- ⚠️ Giới hạn faucet - Chỉ 0.5 BNB/24h
- ⚠️ Cần Twitter/GitHub - Một số faucet yêu cầu

---

## 🧪 TEST SAU KHI THÊM ETH

### Test 1: Check Balance
```
MetaMask → Hardhat Local → Balance: 10,000 ETH ✅
```

### Test 2: Send Transaction
```
1. Mở http://localhost:3000/thanh-toan
2. Chọn "Thanh toán Blockchain"
3. Chọn token: ETH
4. Click "Kết nối ví MetaMask"
5. Click "Thanh toán"
6. Confirm trong MetaMask
7. ✅ Transaction success!
```

### Test 3: Check Transaction
```
Backend logs:
🔔 New payment detected!
💰: 0.01 ETH
✅ Payment processed successfully!
```

---

## 📊 SO SÁNH PHƯƠNG PHÁP

| Phương pháp | Số lượng | Thời gian | Độ khó | Khuyến nghị |
|-------------|----------|-----------|--------|-------------|
| Import Test Account | 10,000 ETH | < 1 phút | ⭐ Dễ | ✅ Best |
| Hardhat Script | Unlimited | < 1 phút | ⭐⭐ Trung bình | ✅ Good |
| BSC Faucet | 0.5 BNB | 1-2 phút | ⭐⭐ Trung bình | ⏳ OK |

---

## ✅ CHECKLIST

- [ ] Hardhat node đang chạy (`npm run node`)
- [ ] MetaMask đã cài đặt
- [ ] Đã add Hardhat Local network
- [ ] Đã import test account
- [ ] Balance hiển thị 10,000 ETH
- [ ] Có thể send transaction
- [ ] Backend detect được payment

---

## 🎉 KẾT LUẬN

**Khuyến nghị: Import Test Account #0**

### Lý do:
- ✅ Nhanh nhất (< 1 phút)
- ✅ Dễ nhất (chỉ copy/paste)
- ✅ 10,000 ETH (không giới hạn)
- ✅ Không cần faucet
- ✅ Instant mining
- ✅ Perfect cho development

### Quick start:
```
1. Add network: Hardhat Local (Chain ID: 31337)
2. Import account: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
3. Check balance: 10,000 ETH ✅
4. Start testing! 🚀
```

**Bây giờ bạn có 10,000 ETH để test blockchain payment!** 💰

---

**Guide by:** AI Assistant  
**Date:** 2025-12-21  
**For:** Development & Testing Only


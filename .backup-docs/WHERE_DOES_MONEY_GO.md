# 💰 TIỀN ĐI ĐÂU SAU KHI THANH TOÁN?

**Câu hỏi:** Sau khi thanh toán blockchain, tiền coin đi đâu?  
**Trả lời:** Tiền đi **TRỰC TIẾP** vào ví shop (recipient wallet)

---

## [object Object]ÓM TẮT NHANH

```
User thanh toán
    ↓
Smart Contract nhận tiền
    ↓
Smart Contract NGAY LẬP TỨC chuyển tiền
    ↓
Recipient Wallet (Ví shop) nhận tiền ✅
```

**Không có bước trung gian, không cần withdraw!**

---

## 📊 LUỒNG TIỀN CHI TIẾT

### Case 1: Thanh toán bằng ETH (Native Coin)

```
User: 0xUser123...
  |
  | Gửi 0.01 ETH
  ↓
Smart Contract: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  |
  | Thực thi: recipientWallet.call{value: msg.value}("")
  ↓
Recipient Wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  |
  ✅ Nhận 0.01 ETH ngay lập tức
```

**Code trong smart contract:**
```solidity
function payOrderWithNative(string memory orderId) external payable {
    require(msg.value > 0, "Amount must be greater than 0");

    // Transfer native coin to recipient wallet
    (bool success, ) = recipientWallet.call{value: msg.value}("");
    require(success, "Native coin transfer failed");

    // Emit event
    emit OrderPaid(orderId, msg.sender, msg.value, NATIVE_TOKEN, "NATIVE_COIN", block.timestamp);
}
```

### Case 2: Thanh toán bằng USDT/USDC (ERC20 Token)

```
User: 0xUser123...
  |
  | Approve 10 USDT cho contract
  ↓
Smart Contract: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  |
  | Thực thi: IERC20(token).transferFrom(msg.sender, recipientWallet, amount)
  ↓
Recipient Wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  |
  ✅ Nhận 10 USDT ngay lập tức
```

**Code trong smart contract:**
```solidity
function payOrderWithToken(string memory orderId, address token, uint256 amount) external {
    require(amount > 0, "Amount must be greater than 0");

    // Transfer token from payer to recipient wallet
    bool success = IERC20(token).transferFrom(msg.sender, recipientWallet, amount);
    require(success, "Token transfer failed");

    // Emit event
    emit OrderPaid(orderId, msg.sender, amount, token, "ERC20_TOKEN", block.timestamp);
}
```

---

## 🔍 RECIPIENT WALLET LÀ GÌ?

### Định nghĩa:
**Recipient Wallet** = Ví nhận tiền của shop (người bán)

### Được set khi deploy contract:
```typescript
// blockchain/scripts/deploy.ts
const [deployer] = await ethers.getSigners();
const recipientWallet = deployer.address; // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

const paymentContract = await PaymentContract.deploy(recipientWallet);
```

### Trong smart contract:
```solidity
address public recipientWallet;

constructor(address _recipientWallet) {
    require(_recipientWallet != address(0), "Invalid recipient wallet");
    recipientWallet = _recipientWallet;
}
```

### Hiện tại (Hardhat Local):
```
Recipient Wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Balance: 10,000 ETH (test account)
```

---

## ✅ XÁC MINH TIỀN ĐÃ CHUYỂN

### Cách 1: Check balance trong MetaMask

1. Import recipient wallet vào MetaMask:
   ```
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   ```

2. Switch sang Hardhat Local network

3. Check balance:
   ```
   Before payment: 10,000 ETH
   After payment:  10,000.01 ETH (hoặc 9,999.99 nếu cùng ví)
   ```

### Cách 2: Check qua script

**File:** `blockchain/scripts/check-balance.ts`

```typescript
import { ethers } from "hardhat";

async function main() {
  const recipientAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  // Check ETH balance
  const balance = await ethers.provider.getBalance(recipientAddress);
  console.log("ETH Balance:", ethers.formatEther(balance), "ETH");
  
  // Check USDT balance (if on testnet)
  const USDT_ADDRESS = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
  const usdtContract = await ethers.getContractAt("IERC20", USDT_ADDRESS);
  const usdtBalance = await usdtContract.balanceOf(recipientAddress);
  console.log("USDT Balance:", ethers.formatUnits(usdtBalance, 6), "USDT");
}

main();
```

### Cách 3: Check transaction trên explorer

**Hardhat Local:** Không có explorer

**BSC Testnet:**
```
https://testnet.bscscan.com/address/0xYOUR_RECIPIENT_ADDRESS
→ Xem tất cả transactions
→ Xem balance
```

---

## 🔄 SO SÁNH VỚI MÔ HÌNH KHÁC

### Mô hình CŨ (Không tốt):
```
User thanh toán
    ↓
Tiền vào Smart Contract ❌
    ↓
Shop phải gọi withdraw() để rút tiền ❌
    ↓
Tiền mới vào ví shop
```

**Nhược điểm:**
- ❌ Tiền bị "kẹt" trong contract
- ❌ Cần thêm bước withdraw (tốn gas)
- ❌ Rủi ro security (contract bị hack)
- ❌ Phức tạp cho shop owner

### Mô hình MỚI (Đang dùng - Tốt):
```
User thanh toán
    ↓
Smart Contract chuyển TRỰC TIẾP
    ↓
Tiền vào ví shop NGAY LẬP TỨC ✅
```

**Ưu điểm:**
- ✅ Tiền đến shop ngay lập tức
- ✅ Không cần withdraw
- ✅ Không có tiền trong contract (an toàn hơn)
- ✅ Đơn giản cho shop owner

---

## [object Object]ƯU Ý QUAN TRỌNG

### 1. Recipient Wallet là ai?
**Hiện tại:** Test account #0 (0xf39Fd...)
- Dùng cho development/testing
- Có 10,000 ETH ban đầu

**Production:** Nên là:
- Multi-signature wallet (Gnosis Safe)
- Hardware wallet (Ledger, Trezor)
- Hoặc ví cold wallet an toàn

### 2. Có thể thay đổi recipient wallet?
**Có!** Contract có function:
```solidity
function setRecipientWallet(address _recipientWallet) external onlyOwner {
    require(_recipientWallet != address(0), "Invalid recipient wallet");
    recipientWallet = _recipientWallet;
}
```

**Chỉ owner mới gọi được!**

### 3. Tiền có thể bị mất không?
**Không!** Vì:
- ✅ Transfer trực tiếp, không qua trung gian
- ✅ Transaction atomic (hoặc thành công hoàn toàn, hoặc fail hoàn toàn)
- ✅ Nếu transfer fail → Transaction revert, user không mất tiền
- ✅ Smart contract không giữ tiền

### 4. Phí gas ai trả?
**User trả!** Khi confirm transaction trong MetaMask:
```
Amount: 0.01 ETH
Gas Fee: ~0.0001 ETH
Total: 0.0101 ETH
```

Shop nhận: 0.01 ETH (đúng như giá)
Gas fee: Đi vào túi validator/miner

---

## 📊 EXAMPLE TRANSACTION

### Transaction details:
```
From: 0xUser123... (Customer)
To: 0xe7f172... (Smart Contract)
Value: 0.01 ETH
Gas: 60,278
Status: Success ✅

Internal Transaction:
From: 0xe7f172... (Smart Contract)
To: 0xf39Fd6... (Recipient Wallet)
Value: 0.01 ETH
```

### Balance changes:
```
Customer:
  Before: 10.00 ETH
  After:   9.99 ETH (paid 0.01 + gas)

Shop (Recipient):
  Before: 10,000.00 ETH
  After:  10,000.01 ETH (received 0.01)
```

---

## [object Object]ẾT LUẬN

**Tiền đi đâu?**
→ **Trực tiếp vào ví shop (recipient wallet)**

**Khi nào nhận được?**
→ **Ngay lập tức** khi transaction confirm

**Cần làm gì để nhận tiền?**
→ **Không cần làm gì!** Tự động nhận

**An toàn không?**
→ **Rất an toàn!** Transfer trực tiếp, không qua trung gian

**Recipient wallet hiện tại:**
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Network: Hardhat Local
Balance: Check trong MetaMask
```

---

**Tóm lại: Tiền từ customer → Smart contract → Shop wallet (INSTANT!)** 💰✨



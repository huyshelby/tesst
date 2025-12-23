# Blockchain Payment Troubleshooting Guide

## ❌ Common Error: "Transaction has no logs"

### Nguyên nhân

Lỗi này xảy ra khi người dùng **gửi ETH/BNB trực tiếp** đến contract address thay vì **gọi hàm contract** `payOrderWithNative()` hoặc `payOrderWithToken()`.

**Ví dụ về giao dịch SAI:**
```javascript
// ❌ SAI - Gửi ETH trực tiếp (simple transfer)
await signer.sendTransaction({
  to: PAYMENT_CONTRACT_ADDRESS,
  value: ethers.utils.parseEther("0.1")
});
```

**Ví dụ về giao dịch ĐÚNG:**
```javascript
// ✅ ĐÚNG - Gọi hàm contract
const contract = new ethers.Contract(
  PAYMENT_CONTRACT_ADDRESS, 
  PAYMENT_ABI, 
  signer
);

await contract.payOrderWithNative(orderId, {
  value: ethers.utils.parseEther("0.1")
});
```

### Tại sao cần gọi hàm contract?

1. **Event Logging**: Chỉ khi gọi `payOrderWithNative()` hoặc `payOrderWithToken()`, contract mới emit event `OrderPaid` với thông tin:
   - Order ID
   - Người thanh toán
   - Số tiền
   - Loại token
   - Timestamp

2. **Order Tracking**: Event này cho phép backend:
   - Xác minh orderId từ blockchain
   - Tự động cập nhật trạng thái order
   - Đảm bảo không thanh toán trùng lặp

3. **Audit Trail**: Có log đầy đủ cho mục đích kiểm toán và tra cứu

### Cách xử lý khi đã gửi nhầm

**Nếu đã gửi ETH/BNB trực tiếp (qua receive function):**

1. **Không thể tự động verify**: Giao dịch không có orderId trong blockchain
2. **Cần xử lý thủ công**: Admin phải:
   - Xác minh transaction hash
   - Kiểm tra số tiền
   - Manually update order trong database
3. **Tiền đã vào contract**: Cần rút về hoặc gửi lại đúng cách

**Script kiểm tra transaction:**
```bash
cd backend
npm run check-transaction -- <txHash>
```

### Fix hiện tại trong code

Backend đã được cập nhật để:

1. **Detect direct transfer**: Nhận diện giao dịch gửi trực tiếp
2. **Warning rõ ràng**: Báo lỗi cụ thể hướng dẫn người dùng
3. **Fallback option**: Cho phép manual processing cho direct transfer (với cảnh báo)

## ✅ Hướng dẫn thanh toán đúng cách

### 1. Thanh toán bằng Native Coin (ETH/BNB)

```javascript
import { ethers } from "ethers";

const PAYMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS;
const PAYMENT_ABI = [
  "function payOrderWithNative(string orderId) external payable",
  "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)"
];

async function payWithNative(orderId: string, amountInEth: string) {
  // 1. Kết nối wallet
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  // 2. Tạo contract instance
  const contract = new ethers.Contract(
    PAYMENT_CONTRACT_ADDRESS,
    PAYMENT_ABI,
    signer
  );

  // 3. Gọi hàm payOrderWithNative
  const tx = await contract.payOrderWithNative(orderId, {
    value: ethers.utils.parseEther(amountInEth),
    gasLimit: 300000 // Tùy chọn
  });

  console.log("Transaction hash:", tx.hash);

  // 4. Đợi confirm
  const receipt = await tx.wait();
  console.log("Transaction confirmed:", receipt);

  return tx.hash;
}
```

### 2. Thanh toán bằng ERC20 Token (USDT/USDC)

```javascript
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

async function payWithToken(orderId: string, tokenAddress: string, amount: string) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  // 1. Approve token
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const decimals = 6; // USDT/USDC có 6 decimals
  const amountWei = ethers.utils.parseUnits(amount, decimals);

  const approveTx = await tokenContract.approve(
    PAYMENT_CONTRACT_ADDRESS,
    amountWei
  );
  await approveTx.wait();
  console.log("Token approved");

  // 2. Pay with token
  const paymentContract = new ethers.Contract(
    PAYMENT_CONTRACT_ADDRESS,
    PAYMENT_ABI,
    signer
  );

  const tx = await paymentContract.payOrderWithToken(
    orderId,
    tokenAddress,
    amountWei
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Payment confirmed:", receipt);

  return tx.hash;
}
```

## 🔍 Kiểm tra transaction

### Xem logs của transaction

```bash
# Sử dụng script check-transaction
cd backend
npm run check-transaction -- 0x7849554b0d6f50ad536a13697137fc445453f6589a62d28af3bc6c27070817c2
```

### Hoặc kiểm tra thủ công

```javascript
const receipt = await provider.getTransactionReceipt(txHash);
console.log("Logs:", receipt.logs);
console.log("Status:", receipt.status); // 1 = success, 0 = failed

// Decode logs
const iface = new ethers.utils.Interface(PAYMENT_ABI);
receipt.logs.forEach(log => {
  try {
    const parsed = iface.parseLog(log);
    console.log("Event:", parsed.name);
    console.log("Args:", parsed.args);
  } catch (e) {
    console.log("Cannot decode log");
  }
});
```

## 📋 Checklist trước khi thanh toán

- [ ] Đã kết nối đúng network (Hardhat Local / BSC Testnet)
- [ ] Đã có đủ ETH/BNB hoặc token trong wallet
- [ ] Đang sử dụng đúng contract address
- [ ] Đang GỌI HÀM CONTRACT, không phải gửi trực tiếp
- [ ] Đã approve token (nếu dùng USDT/USDC)
- [ ] Order ID hợp lệ và chưa được thanh toán

## 🛠️ Debug Tips

### 1. Kiểm tra contract address

```javascript
console.log("Payment contract:", PAYMENT_CONTRACT_ADDRESS);
// Phải khớp với contract đã deploy
```

### 2. Kiểm tra network

```javascript
const network = await provider.getNetwork();
console.log("Connected to:", network.chainId);
// 31337 = Hardhat Local
// 97 = BSC Testnet
```

### 3. Kiểm tra balance

```javascript
const balance = await signer.getBalance();
console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
```

### 4. Estimate gas

```javascript
const gasEstimate = await contract.estimateGas.payOrderWithNative(orderId, {
  value: ethers.utils.parseEther("0.1")
});
console.log("Estimated gas:", gasEstimate.toString());
```

## 🚨 Common Errors & Solutions

| Error | Nguyên nhân | Giải pháp |
|-------|-------------|-----------|
| "Transaction has no logs" | Gửi ETH trực tiếp thay vì gọi hàm | Sử dụng `payOrderWithNative()` |
| "Order already processed" | Order đã được thanh toán | Kiểm tra lại order status |
| "Insufficient funds" | Không đủ ETH/token | Nạp thêm vào wallet |
| "Transaction reverted" | Contract reject (nhiều lý do) | Kiểm tra logs, ensure đúng params |
| "Wrong contract address" | Gửi đến sai contract | Verify contract address |

## 📞 Support

Nếu vẫn gặp vấn đề:

1. Kiểm tra backend logs: `npm run dev` (trong folder backend)
2. Kiểm tra transaction trên block explorer
3. Chạy script check-transaction với txHash
4. Liên hệ admin với đầy đủ thông tin: orderId, txHash, error message

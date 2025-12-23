# 📘 QUY TRÌNH THANH TOÁN BLOCKCHAIN - WEB2 + WEB3 HYBRID

> **Tài liệu kỹ thuật**: Mô tả chi tiết quy trình tích hợp thanh toán blockchain vào hệ thống e-commerce truyền thống

---

## 🎯 TÓM TẮT 1 DÒNG

```
User kết nối MetaMask → Tạo đơn hàng Web2 → Ký transaction trên blockchain → Smart contract emit event → Backend listen & verify → Update order status PAID
```

---

## 📊 KIẾN TRÚC TỔNG QUAN

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
│  Frontend   │─────▶│   Backend    │      │   Blockchain    │◀─────│   Backend    │
│  (Next.js)  │      │  (Express)   │      │   (Testnet)     │      │  (Listener)  │
│             │      │              │      │                 │      │              │
│  MetaMask   │─────▶│  PostgreSQL  │      │ Smart Contract  │      │  WebSocket   │
└─────────────┘      └──────────────┘      └─────────────────┘      └──────────────┘
     │                      │                       │                       │
     │                      │                       │                       │
     └──────────────────────┴───────────────────────┴───────────────────────┘
                                 Payment Verification Loop
```

---

## 🔍 GIẢI THÍCH HỆ THỐNG

### **Web2 (Traditional Web)**
Hệ thống web truyền thống với backend xử lý logic nghiệp vụ, database lưu trữ, server-side rendering. Backend là **source of truth** (nguồn chân lý duy nhất) cho trạng thái đơn hàng.

### **Web3 (Blockchain Web)**
Hệ thống phi tập trung dựa trên blockchain, sử dụng ví điện tử (wallet) để xác thực người dùng và thực hiện giao dịch. Blockchain là **immutable ledger** (sổ cái bất biến) cho lịch sử thanh toán.

### **Hybrid Architecture**
Kết hợp Web2 (quản lý đơn hàng, sản phẩm, user) với Web3 (thanh toán). Backend Web2 vẫn là **source of truth** cho trạng thái order, nhưng **verify thanh toán từ blockchain** trước khi cập nhật.

---

## 📋 QUY TRÌNH CHI TIẾT - 15 BƯỚC

---

### **BƯỚC 1: User Click "Connect Wallet"**

**👤 Người thực hiện:** User  
**💻 Nơi thực hiện:** Frontend (Browser)

**Chuyện gì xảy ra:**
- User nhấn nút "Connect Wallet" trên giao diện thanh toán
- Frontend detect xem browser có extension MetaMask không
- Nếu không có → hiện popup yêu cầu cài đặt
- Nếu có → trigger popup MetaMask xin phép kết nối

**Thuật ngữ:**

**Wallet (Ví điện tử):**  
Phần mềm quản lý **private key** (khóa bí mật) để ký giao dịch blockchain. Không lưu coin/token bên trong, chỉ lưu private key để truy cập địa chỉ blockchain chứa tài sản.

**MetaMask:**  
Wallet dạng browser extension phổ biến nhất cho Ethereum và các EVM chains (Ethereum Virtual Machine compatible chains như BSC, Polygon). Cho phép user tương tác với dApp (decentralized application) mà không cần chạy full node.

**Private Key (Khóa bí mật):**  
Chuỗi 256-bit random dùng để ký transaction. Ai có private key = kiểm soát 100% tài sản tại địa chỉ tương ứng. **KHÔNG BAO GIỜ** để lộ private key.

**Address (Địa chỉ):**  
Public identifier dạng `0x742d35Cc...` được sinh ra từ private key qua thuật toán mã hóa 1 chiều. Dùng để nhận tiền, giống số tài khoản ngân hàng nhưng public và có thể tạo vô hạn.

**EOA (Externally Owned Account):**  
Tài khoản blockchain do người dùng kiểm soát bằng private key, khác với Contract Account (do smart contract code kiểm soát).

**Code liên quan:**
```javascript
// Frontend detect MetaMask
if (typeof window.ethereum !== 'undefined') {
  // MetaMask is installed
}
```

---

### **BƯỚC 2: MetaMask Popup Hiện Lên, User Approve**

**👤 Người thực hiện:** User  
**💻 Nơi thực hiện:** MetaMask Extension

**Chuyện gì xảy ra:**
- MetaMask hiện popup xác nhận kết nối
- Hiển thị: domain của website, địa chỉ ví sẽ kết nối
- User nhấn "Connect" → Frontend nhận được address của user
- Lưu ý: **KHÔNG** cần nhập password hay private key vào website
- Frontend chỉ nhận được **address** (public), không bao giờ nhận private key

**Bản chất kỹ thuật:**
Đây là cơ chế **permission grant**. User cho phép website:
- Đọc địa chỉ ví (read-only)
- Request ký transaction (cần confirm mỗi lần)
- **KHÔNG** cho phép website tự động rút tiền

**Code liên quan:**
```javascript
// Frontend request accounts
const accounts = await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
});
const userAddress = accounts[0]; // 0x123abc...
```

---

### **BƯỚC 3: Frontend Kiểm Tra ChainId (Chain Guard)**

**👤 Người thực hiện:** Frontend  
**💻 Nơi thực hiện:** Browser (JavaScript)

**Chuyện gì xảy ra:**
- Frontend đọc chainId hiện tại của ví
- So sánh với chainId mà hệ thống hỗ trợ (ví dụ: BSC Testnet = 97)
- Nếu sai chain → hiện popup yêu cầu switch network
- Nếu đúng chain → tiếp tục quy trình

**Thuật ngữ:**

**Chain (Blockchain Network):**  
Mạng lưới blockchain độc lập, có hệ thống node, validator, consensus riêng. Ví dụ: Ethereum Mainnet, BSC, Polygon. Các chain khác nhau = các "vũ trụ" riêng biệt, không tương tác trực tiếp.

**ChainId:**  
Số định danh duy nhất cho mỗi blockchain network. Ví dụ:
- Ethereum Mainnet: 1
- BSC Mainnet: 56
- BSC Testnet: 97
- Polygon: 137
- Sepolia (ETH Testnet): 11155111

**Network:**  
Synonym với Chain trong context này. Mỗi network có RPC endpoint riêng để giao tiếp.

**Testnet:**  
Blockchain giả lập để developer test code mà không tốn tiền thật. Coin trên testnet không có giá trị, có thể xin free từ faucet. Cấu trúc giống hệt mainnet nhưng consensus yếu hơn, block time nhanh hơn.

**Tại sao cần kiểm tra chainId?**
- Smart contract chỉ deploy trên 1 chain cụ thể
- Nếu user ở sai chain → transaction sẽ fail hoặc gửi đến contract không tồn tại
- Security: tránh user nhầm lẫn gửi tiền lên mainnet (tốn tiền thật)

**Code liên quan:**
```javascript
// Frontend check chainId
const chainId = await window.ethereum.request({ 
  method: 'eth_chainId' 
});

const EXPECTED_CHAIN_ID = '0x61'; // 97 in hex = BSC Testnet

if (chainId !== EXPECTED_CHAIN_ID) {
  // Request switch network
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: EXPECTED_CHAIN_ID }],
  });
}
```

---

### **BƯỚC 4: User Tạo Đơn Hàng Trên Frontend**

**👤 Người thực hiện:** User  
**💻 Nơi thực hiện:** Frontend

**Chuyện gì xảy ra:**
- User chọn sản phẩm, điền thông tin giao hàng
- Chọn phương thức thanh toán: "Crypto Payment"
- Chọn token: USDT / USDC / Native Coin (BNB/ETH)
- Frontend tính tổng tiền VND, cần convert sang crypto amount

**Lưu ý:**
- Chưa có giao dịch blockchain nào xảy ra tại bước này
- Chỉ mới chuẩn bị dữ liệu trong frontend

---

### **BƯỚC 5: Frontend Gửi Request Tạo Order Đến Backend**

**👤 Người thực hiện:** Frontend  
**💻 Nơi thực hiện:** HTTP Request → Backend API

**Chuyện gì xảy ra:**
```javascript
POST /api/orders
{
  "customerName": "Nguyen Van A",
  "shippingAddress": "123 ABC",
  "paymentMethod": "CRYPTO",
  "cryptoNetwork": "BSC",
  "cryptoToken": "USDT",
  "total": 10000000  // VND
}
```

- Frontend call API tạo đơn hàng
- Payload bao gồm: thông tin khách hàng, địa chỉ giao hàng, phương thức thanh toán
- **Lưu ý:** Chưa có txHash vì chưa thanh toán

---

### **BƯỚC 6: Backend Tạo Order Record Trong Database**

**👤 Người thực hiện:** Backend  
**💻 Nơi thực hiện:** Express.js + PostgreSQL

**Chuyện gì xảy ra:**

1. **Backend tính toán crypto amount:**
   - Lấy tỷ giá USD/VND từ Exchange API (ví dụ: 1 USD = 24,500 VND)
   - Convert: 10,000,000 VND / 24,500 = 408.16 USD
   - Vì USDT/USDC ≈ 1:1 với USD → Amount = 408.16 USDT

2. **Backend insert record vào database:**
```sql
INSERT INTO Order (
  id, 
  orderNumber, 
  userId,
  total,
  paymentMethod,
  paymentStatus,
  cryptoNetwork,
  cryptoToken,
  cryptoAmount,
  cryptoExchangeRate,
  cryptoWallet,
  cryptoExpiresAt
) VALUES (
  'uuid-123',
  'ORD-ABC123',
  'user-456',
  10000000,
  'CRYPTO',
  'PENDING',  -- ← TRẠNG THÁI KHỞI TẠO
  'BSC',
  'USDT',
  408.16,
  24500,
  '0xSHOP_WALLET_ADDRESS',  -- Ví nhận tiền của shop
  NOW() + INTERVAL '15 minutes'  -- Hết hạn sau 15 phút
)
```

3. **Backend trả về response cho frontend:**
```json
{
  "orderId": "uuid-123",
  "orderNumber": "ORD-ABC123",
  "recipientAddress": "0xSHOP_WALLET_ADDRESS",
  "network": "BSC",
  "token": "USDT",
  "amount": "408.16",
  "vndAmount": 10000000,
  "expiresAt": "2025-12-21T15:30:00Z"
}
```

**Thuật ngữ:**

**Source of Truth (Nguồn chân lý):**  
Hệ thống duy nhất quyết định trạng thái cuối cùng của dữ liệu. Trong kiến trúc này, **backend database** là source of truth cho order status. Blockchain chỉ là **proof of payment** (bằng chứng thanh toán), không phải source of truth cho business logic.

**Tại sao backend tạo order trước khi có payment?**
- Để có orderId làm reference trong transaction
- Để track timeout (15 phút không thanh toán → cancel order)
- Để đảm bảo amount không thay đổi giữa chừng (race condition)

---

### **BƯỚC 7: Frontend Hiển Thị Payment UI**

**👤 Người thực hiện:** Frontend  
**💻 Nơi thực hiện:** Browser (React Component)

**Chuyện gì xảy ra:**
- Frontend nhận response từ backend
- Render payment interface:
  - QR code chứa address + amount
  - Recipient address (copy button)
  - Amount: 408.16 USDT
  - Network: BSC Testnet
  - Countdown timer: 15:00
  - Button: "Pay with MetaMask"

**Lưu ý:**
- User có thể:
  - Pay bằng MetaMask (tự động điền sẵn data)
  - Hoặc scan QR bằng mobile wallet
  - Hoặc copy địa chỉ và gửi manual

---

### **BƯỚC 8: User Click "Pay with MetaMask"**

**👤 Người thực hiện:** User  
**💻 Nơi thực hiện:** Frontend → Blockchain Interaction

**Chuyện gì xảy ra:**

Frontend gọi smart contract hoặc send transaction:

**Case 1: Payment bằng Native Coin (BNB/ETH)**
```javascript
// Send native coin trực tiếp
const tx = await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: userAddress,
    to: SHOP_WALLET_ADDRESS,
    value: ethers.parseEther('0.05'), // 0.05 BNB
    data: ethers.toUtf8Bytes('OrderID:uuid-123'), // Metadata
  }],
});
```

**Case 2: Payment bằng ERC20 Token (USDT/USDC)**
```javascript
// Gọi smart contract payment
const contract = new ethers.Contract(
  PAYMENT_CONTRACT_ADDRESS,
  PAYMENT_ABI,
  signer
);

const tx = await contract.payOrder(
  'uuid-123',  // orderId
  ethers.parseUnits('408.16', 6)  // amount (USDT has 6 decimals)
);
```

**Thuật ngữ:**

**Smart Contract:**  
Chương trình chạy trên blockchain, tự động thực thi khi có trigger. Code được deploy lên blockchain, immutable (không thể sửa), deterministic (input giống nhau → output giống nhau). 

**Cấu trúc cơ bản:**
- State variables: Lưu data on-chain
- Functions: Logic xử lý
- Events: Emit logs để off-chain listen

**Ví dụ Smart Contract thanh toán:**
```solidity
contract PaymentContract {
  event OrderPaid(
    string orderId,
    address payer,
    uint256 amount,
    address token
  );
  
  function payOrder(string memory orderId, uint256 amount) public {
    // Transfer USDT from user to shop
    IERC20(USDT_ADDRESS).transferFrom(
      msg.sender,  // User
      SHOP_WALLET,
      amount
    );
    
    // Emit event
    emit OrderPaid(orderId, msg.sender, amount, USDT_ADDRESS);
  }
}
```

**ABI (Application Binary Interface):**  
"Hợp đồng giao tiếp" giữa frontend và smart contract. Định nghĩa:
- Function names
- Parameter types
- Return types

Frontend cần ABI để encode/decode data khi gọi contract. Giống như API documentation cho smart contract.

**Native Coin vs ERC20 Token:**

**Native Coin:**  
- Coin gốc của blockchain (ETH trên Ethereum, BNB trên BSC)
- Dùng để trả gas fee
- Transfer trực tiếp không cần smart contract
- Balance lưu ở blockchain protocol level

**ERC20/BEP20 Token:**  
- Token chạy trên smart contract
- Tuân theo standard interface (transfer, approve, balanceOf...)
- Cần gọi contract để transfer
- Balance lưu trong contract mapping
- Ví dụ: USDT, USDC, DAI

**Transaction (tx):**  
Đơn vị thay đổi state trên blockchain. Mỗi transaction bao gồm:
- From: địa chỉ người gửi
- To: địa chỉ người nhận / contract
- Value: số lượng native coin gửi
- Data: input data cho smart contract
- Gas: phí xử lý
- Nonce: số thứ tự transaction của account
- Signature: chữ ký từ private key

**txHash (Transaction Hash):**  
ID duy nhất của transaction, dạng `0x1a2b3c...` (32 bytes). Tính bằng hash(tx data). Dùng để track transaction trên explorer (bscscan.com, etherscan.io).

---

### **BƯỚC 9: MetaMask Popup Xác Nhận Transaction**

**👤 Người thực hiện:** User  
**💻 Nơi thực hiện:** MetaMask Extension

**Chuyện gì xảy ra:**

MetaMask hiện popup với thông tin:

```
┌───────────────────────────────────┐
│  Confirm Transaction              │
├───────────────────────────────────┤
│  From:    0xUser123...            │
│  To:      0xShopWallet...         │
│  Amount:  408.16 USDT             │
│                                   │
│  Gas (estimated):                 │
│  ├─ Gas Limit:   100,000          │
│  ├─ Gas Price:   5 Gwei           │
│  └─ Max Fee:     0.0005 BNB       │
│                                   │
│  Total:   408.16 USDT + 0.0005 BNB│
│                                   │
│  [ Reject ]     [ Confirm ]       │
└───────────────────────────────────┘
```

**User actions:**
- Review thông tin
- Có thể adjust gas price (priority fee)
- Click "Confirm" → Ký transaction bằng private key
- Click "Reject" → Cancel

**Thuật ngữ:**

**Gas:**  
Đơn vị đo "công sức tính toán" cần để xử lý transaction. Mỗi operation (cộng, trừ, lưu storage) tốn một lượng gas cố định.

**GasLimit:**  
Số lượng gas tối đa user sẵn sàng bỏ ra. Nếu transaction cần > gasLimit → fail và vẫn mất gas. Set quá cao → tốn phí, set quá thấp → revert.

**GasPrice:**  
Giá mỗi đơn vị gas, tính bằng Gwei (1 Gwei = 10^-9 ETH/BNB). GasPrice cao → transaction xử lý nhanh hơn vì validator ưu tiên tx có phí cao.

**GasUsed:**  
Số gas thực tế tiêu hao sau khi transaction complete. Luôn ≤ gasLimit. Phí cuối cùng = gasUsed × gasPrice.

**Total Fee:**  
```
Fee = gasUsed × gasPrice
Ví dụ: 100,000 gas × 5 Gwei = 500,000 Gwei = 0.0005 BNB
```

**Lưu ý:**  
- Gas fee trả bằng native coin (BNB/ETH), không phải token
- Nếu ví không đủ BNB để trả gas → transaction fail
- Gas fee không vào túi shop, mà vào túi validator/miner

---

### **BƯỚC 10: Transaction Vào Mempool**

**👤 Người thực hiện:** MetaMask  
**💻 Nơi thực hiện:** Blockchain Network (P2P Layer)

**Chuyện gì xảy ra:**

1. **User confirm trong MetaMask:**
   - MetaMask dùng private key ký transaction (ECDSA signature)
   - Tạo raw transaction data (RLP encoded)
   - Gửi đến RPC node

2. **RPC Node broadcast transaction:**
   - Node nhận tx, validate signature và nonce
   - Nếu hợp lệ → broadcast đến các node khác trong network
   - Transaction vào **mempool** (memory pool) chờ được đào

3. **Transaction status:**
   - Frontend nhận txHash ngay lập tức
   - Nhưng transaction chưa confirm, vẫn đang pending

**Thuật ngữ:**

**Mempool (Memory Pool):**  
Khu vực lưu trữ tạm thời các transaction chưa được đưa vào block. Mỗi node có mempool riêng. Validator/Miner chọn tx từ mempool (ưu tiên gas price cao) để đưa vào block tiếp theo.

**Đặc điểm:**
- Transaction ở mempool **chưa final**, có thể bị drop nếu:
  - Gas price quá thấp
  - Network congestion
  - User gửi tx khác với nonce giống nhau (replace)
- Thời gian ở mempool: vài giây đến vài phút (tùy network load)

**RPC (Remote Procedure Call):**  
API endpoint để frontend/backend giao tiếp với blockchain node. Thay vì chạy full node, dApp kết nối tới RPC provider (Infura, Alchemy, QuickNode).

**RPC Methods phổ biến:**
- `eth_sendRawTransaction`: Gửi transaction
- `eth_getTransactionReceipt`: Lấy receipt
- `eth_blockNumber`: Lấy block hiện tại
- `eth_call`: Gọi smart contract (read-only)
- `eth_subscribe`: Subscribe WebSocket events

**WebSocket Provider:**  
RPC dạng persistent connection, cho phép:
- Real-time updates (không cần polling)
- Subscribe events từ smart contract
- Listen new blocks

Khác với HTTP RPC (request/response model).

---

### **BƯỚC 11: Transaction Được Đưa Vào Block**

**👤 Người thực hiện:** Validator/Miner  
**💻 Nơi thực hiện:** Blockchain Network (Consensus Layer)

**Chuyện gì xảy ra:**

1. **Validator chọn transactions:**
   - Lấy tx từ mempool (ưu tiên fee cao)
   - Pack vào block candidate
   - Thực thi các transaction (EVM execution)

2. **Smart Contract được trigger:**
   ```solidity
   // Contract code chạy
   function payOrder(string memory orderId, uint256 amount) public {
     // 1. Transfer USDT từ user → shop
     IERC20(USDT_ADDRESS).transferFrom(msg.sender, SHOP_WALLET, amount);
     
     // 2. Emit event
     emit OrderPaid(orderId, msg.sender, amount, USDT_ADDRESS);
   }
   ```

3. **Event được emit:**
   ```
   Event: OrderPaid
   ├─ orderId:  "uuid-123"
   ├─ payer:    0xUser123abc...
   ├─ amount:   408160000  (408.16 với 6 decimals)
   └─ token:    0xUSDT_CONTRACT_ADDRESS
   ```

4. **Block được propose:**
   - Validator propose block mới
   - Các validator khác verify và vote
   - Khi đạt consensus → block được thêm vào chain

5. **Transaction status update:**
   - TxHash có blockNumber
   - Confirmations = 1

**Thuật ngữ:**

**Block:**  
Container chứa nhiều transactions. Mỗi block có:
- Block number: số thứ tự block
- Parent hash: hash của block trước (tạo "chain")
- Timestamp: thời gian tạo
- Transactions: danh sách tx
- State root: hash của world state sau khi execute tất cả tx
- Gas used: tổng gas tiêu hao

**BlockNumber:**  
Số thứ tự block (incremental). Block mới nhất = chain tip. Dùng để track vị trí của transaction trong chain history.

**Event:**  
Log được smart contract emit, lưu trong transaction receipt. Không lưu trong contract state → tiết kiệm gas. Frontend/Backend listen events qua WebSocket để detect thay đổi.

**Cấu trúc Event Log:**
```json
{
  "address": "0xCONTRACT_ADDRESS",
  "topics": [
    "0xEVENT_SIGNATURE_HASH",  // keccak256("OrderPaid(string,address,uint256,address)")
    "indexed_param_1",
    "indexed_param_2"
  ],
  "data": "0xNON_INDEXED_PARAMS",
  "blockNumber": 12345678,
  "transactionHash": "0xTX_HASH"
}
```

**Indexed vs Non-indexed Parameters:**
- **Indexed** (max 3): Có thể filter/search, lưu trong topics
- **Non-indexed**: Lưu trong data, không filter được

---

### **BƯỚC 12: Backend Listen Event Qua WebSocket**

**👤 Người thực hiện:** Backend  
**💻 Nơi thực hiện:** Express.js Background Service

**Chuyện gì xảy ra:**

1. **Backend setup WebSocket listener:**
```javascript
// backend/src/services/blockchain-listener.service.ts

const provider = new ethers.WebSocketProvider(BSC_TESTNET_WSS);
const contract = new ethers.Contract(
  PAYMENT_CONTRACT_ADDRESS,
  PAYMENT_ABI,
  provider
);

// Subscribe to OrderPaid event
contract.on('OrderPaid', async (orderId, payer, amount, token, event) => {
  console.log('🔔 New payment detected!');
  console.log('OrderID:', orderId);
  console.log('Payer:', payer);
  console.log('Amount:', ethers.formatUnits(amount, 6)); // 408.16
  console.log('TxHash:', event.log.transactionHash);
  
  // Process payment
  await processPayment(orderId, event.log.transactionHash);
});
```

2. **Khi event được emit:**
   - WebSocket connection nhận real-time notification
   - Callback function được trigger
   - Backend extract data từ event

**Thuật ngữ:**

**Off-chain vs On-chain:**

**On-chain:**  
- Data lưu trên blockchain
- Immutable, transparent, decentralized
- Tốn gas để write
- Ví dụ: transaction history, smart contract state

**Off-chain:**  
- Data lưu ngoài blockchain (database, server)
- Mutable, private, centralized
- Không tốn gas
- Ví dụ: user profile, product catalog, order shipping address

**Trong hệ thống này:**
- **On-chain:** Payment transaction, event logs
- **Off-chain:** Order details (name, address, phone, product list)

**Tại sao không lưu tất cả trên blockchain?**
- Gas fee cao (mỗi byte data tốn gas)
- Privacy (blockchain public)
- Flexibility (không sửa được sau khi deploy)
- Performance (blockchain chậm hơn database)

---

### **BƯỚC 13: Backend Verify Transaction**

**👤 Người thực hiện:** Backend  
**💻 Nơi thực hiện:** Express.js + Ethers.js

**Chuyện gì xảy ra:**

Backend **KHÔNG TIN** event ngay lập tức, mà phải **verify** bằng cách:

**Step 1: Lấy transaction receipt từ blockchain**
```javascript
const receipt = await provider.getTransactionReceipt(txHash);

if (!receipt) {
  throw new Error('Transaction not found');
}

if (receipt.status !== 1) {
  throw new Error('Transaction failed');
}
```

**Step 2: Verify confirmations**
```javascript
const currentBlock = await provider.getBlockNumber();
const confirmations = currentBlock - receipt.blockNumber;

if (confirmations < 3) {
  throw new Error(`Not enough confirmations: ${confirmations}/3`);
}
```

**Step 3: Verify event data**
```javascript
// Parse logs để lấy event data
const iface = new ethers.Interface(PAYMENT_ABI);
const log = receipt.logs.find(log => 
  log.address.toLowerCase() === PAYMENT_CONTRACT_ADDRESS.toLowerCase()
);

const parsedLog = iface.parseLog(log);

// Verify orderId
if (parsedLog.args.orderId !== expectedOrderId) {
  throw new Error('OrderID mismatch');
}

// Verify amount
const paidAmount = ethers.formatUnits(parsedLog.args.amount, 6);
if (parseFloat(paidAmount) < expectedAmount) {
  throw new Error('Insufficient payment amount');
}

// Verify token
if (parsedLog.args.token.toLowerCase() !== USDT_ADDRESS.toLowerCase()) {
  throw new Error('Wrong token');
}
```

**Step 4: Check double-spending**
```javascript
// Kiểm tra txHash đã được xử lý chưa
const existingOrder = await prisma.order.findFirst({
  where: { cryptoTxHash: txHash }
});

if (existingOrder && existingOrder.id !== orderId) {
  throw new Error('Transaction already used for another order');
}
```

**Thuật ngữ:**

**Confirmations:**  
Số block được thêm vào chain sau block chứa transaction. Ví dụ:
- Tx ở block 100
- Current block = 103
- Confirmations = 3

**Tại sao cần confirmations?**  
Để chống **blockchain reorganization (reorg)**.

**Reorg (Blockchain Reorganization):**  
Hiện tượng blockchain "revert" vài block gần nhất và switch sang chain khác dài hơn. Xảy ra khi:
- 2 validator propose block cùng lúc
- Network latency
- 51% attack (rare)

**Ví dụ reorg:**
```
Before:
... → Block 98 → Block 99 → Block 100 (chứa tx của bạn)

After reorg:
... → Block 98 → Block 99' → Block 100' (tx của bạn bị mất)
```

**Best practice:**
- Ethereum: đợi 12+ confirmations cho giá trị cao
- BSC: 15-20 confirmations
- Polygon: 128 confirmations (do PoS unstable hơn)

**Transaction Receipt:**  
Dữ liệu kết quả sau khi transaction được execute. Bao gồm:
- Status: 1 = success, 0 = failed
- BlockNumber: block chứa tx
- GasUsed: gas thực tế tiêu hao
- Logs: event logs emit từ contract
- ContractAddress: nếu tx deploy contract

**Tại sao backend phải verify thay vì tin frontend?**
- **Frontend có thể bị hack**: User mở devtools, fake txHash
- **Frontend không đáng tin**: User có thể modify code
- **Source of truth**: Blockchain là nguồn duy nhất đáng tin cho payment data
- **Security**: Backend verify đảm bảo không ai lừa được hệ thống

---

### **BƯỚC 14: Backend Cập Nhật Order Status → PAID**

**👤 Người thực hiện:** Backend  
**💻 Nơi thực hiện:** PostgreSQL Database

**Chuyện gì xảy ra:**

Sau khi verify thành công, backend update database:

```javascript
// backend/src/services/order.service.ts

async function processPayment(orderId: string, txHash: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'COMPLETED',  // PENDING → COMPLETED
      status: 'CONFIRMED',         // Order status từ PENDING → CONFIRMED
      cryptoTxHash: txHash,
      cryptoVerifiedAt: new Date(),
      cryptoConfirmations: confirmations,
    },
  });
  
  // Trigger các hành động tiếp theo:
  // - Gửi email xác nhận
  // - Notify warehouse để chuẩn bị hàng
  // - Log vào audit trail
  // - Webhook tới shipping service
}
```

**Database record lúc này:**
```sql
SELECT 
  orderNumber,
  paymentMethod,
  paymentStatus,  -- 'COMPLETED'
  cryptoTxHash,   -- '0x1a2b3c...'
  cryptoConfirmations,  -- 3
  cryptoVerifiedAt,     -- '2025-12-21 14:23:45'
  status          -- 'CONFIRMED'
FROM Order
WHERE id = 'uuid-123';
```

**Quan trọng:**
- **Chỉ có backend mới được phép update paymentStatus**
- Frontend **KHÔNG BAO GIỜ** tự update status
- Blockchain **KHÔNG** quyết định order status, chỉ provide proof
- Database là **single source of truth** cho business logic

**Tại sao Web3 không thay thế Web2?**

| Aspect | Web2 (Backend + DB) | Web3 (Blockchain) |
|--------|---------------------|-------------------|
| **Performance** | Fast (ms) | Slow (seconds to minutes) |
| **Cost** | Cheap (server cost) | Expensive (gas fee) |
| **Privacy** | Private data | Public ledger |
| **Flexibility** | Dễ update logic | Immutable contract |
| **Scalability** | Horizontal scaling | Limited TPS |
| **Use case** | Business logic | Trustless payment proof |

**→ Hybrid model tận dụng ưu điểm cả 2:**
- Web2: Quản lý order, product, shipping, UI/UX
- Web3: Proof of payment, transparency, không cần tin intermediary

---

### **BƯỚC 15: Frontend Hiển Thị Kết Quả Cuối Cùng**

**👤 Người thực hiện:** Frontend  
**💻 Nơi thực hiện:** Browser (React Component)

**Chuyện gì xảy ra:**

**Option 1: Polling (Frontend chủ động hỏi)**
```javascript
// Frontend poll order status mỗi 3 giây
const interval = setInterval(async () => {
  const order = await fetch(`/api/orders/${orderId}`).then(r => r.json());
  
  if (order.paymentStatus === 'COMPLETED') {
    clearInterval(interval);
    showSuccessPage();
  }
}, 3000);
```

**Option 2: WebSocket (Backend push notification)**
```javascript
// Frontend subscribe WebSocket
const socket = io('ws://localhost:4000');

socket.on(`order:${orderId}:updated`, (order) => {
  if (order.paymentStatus === 'COMPLETED') {
    showSuccessPage();
  }
});
```

**Success Page hiển thị:**
```
┌──────────────────────────────────────────┐
│  ✅ Payment Successful!                  │
├──────────────────────────────────────────┤
│  Order Number:    ORD-ABC123             │
│  Amount Paid:     408.16 USDT            │
│  Transaction:     0x1a2b3c... [View ↗]   │
│  Confirmations:   3/3                    │
│  Status:          Confirmed              │
│                                          │
│  Your order is being prepared for        │
│  shipment. Estimated delivery: 3-5 days. │
│                                          │
│  [View Order Details]  [Back to Home]    │
└──────────────────────────────────────────┘
```

**Link "View Transaction":**
```
https://testnet.bscscan.com/tx/0x1a2b3c...
```
→ User có thể verify transaction trên blockchain explorer (public, transparent)

---

## 🔄 SƠ ĐỒ FLOW HOÀN CHỈNH

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BLOCKCHAIN PAYMENT FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

[1] User clicks "Connect Wallet"
     │
     ├──▶ [2] MetaMask popup → User approve
     │         └─▶ Frontend receives address
     │
     ├──▶ [3] Frontend check chainId
     │         └─▶ If wrong → Request switch network
     │
     ├──▶ [4] User fills order form (product, shipping info)
     │
     ├──▶ [5] Frontend → POST /api/orders → Backend
     │
     ├──▶ [6] Backend:
     │         ├─ Calculate crypto amount (VND → USD → USDT)
     │         ├─ INSERT order (status=PENDING, paymentStatus=PENDING)
     │         └─ Response: orderId, amount, recipient, expiresAt
     │
     ├──▶ [7] Frontend render payment UI (QR, amount, countdown)
     │
     ├──▶ [8] User clicks "Pay with MetaMask"
     │         └─▶ Frontend calls smart contract / send transaction
     │
     ├──▶ [9] MetaMask popup
     │         ├─ Show: to, amount, gas
     │         └─▶ User confirms → Sign with private key
     │
     ├──▶ [10] Transaction → Mempool
     │          ├─ RPC broadcast to network
     │          └─▶ Frontend receives txHash (but not confirmed yet)
     │
     ├──▶ [11] Validator/Miner:
     │          ├─ Pick tx from mempool
     │          ├─ Execute smart contract
     │          ├─ Contract emits OrderPaid event
     │          └─▶ Block created (confirmations = 1)
     │
     ├──▶ [12] Backend WebSocket listener:
     │          └─▶ Detects OrderPaid event
     │
     ├──▶ [13] Backend verification:
     │          ├─ Get transaction receipt
     │          ├─ Check confirmations ≥ 3
     │          ├─ Verify orderId, amount, token
     │          └─ Check double-spending
     │
     ├──▶ [14] Backend updates database:
     │          ├─ paymentStatus: PENDING → COMPLETED
     │          ├─ status: PENDING → CONFIRMED
     │          ├─ Save txHash, confirmations
     │          └─▶ Trigger next steps (email, warehouse, shipping)
     │
     └──▶ [15] Frontend:
              ├─ Poll /api/orders/{orderId} (or WebSocket)
              └─▶ Detect paymentStatus=COMPLETED → Show success page

═══════════════════════════════════════════════════════════════════════════

Key Points:
├─ Frontend CANNOT decide payment status (security)
├─ Backend MUST verify on-chain data (source of truth)
├─ Blockchain provides immutable payment proof
└─ Database remains source of truth for business logic
```

---

## 🎓 KIẾN THỨC QUAN TRỌNG

### **1. Tại sao Frontend không được quyết định "PAID"?**

**Lý do:**
- Frontend chạy trên browser của user → user có full control (devtools, modify code)
- User có thể fake txHash hoặc gửi txHash của người khác
- Không có cách nào đảm bảo frontend "honest"

**Ví dụ tấn công:**
```javascript
// Hacker mở devtools, fake API response
fetch('/api/orders/123', {
  method: 'PUT',
  body: JSON.stringify({
    paymentStatus: 'COMPLETED',
    txHash: '0xFAKE_HASH'
  })
});
```

**→ Backend PHẢI verify txHash trên blockchain trước khi tin.**

---

### **2. Blockchain không thay thế Backend**

**Blockchain ≠ Database**

| Đặc điểm | Blockchain | Traditional DB |
|----------|-----------|----------------|
| Write cost | Expensive (gas) | Cheap |
| Read cost | Free | Cheap |
| Speed | Slow (10s - 1min) | Fast (ms) |
| Privacy | Public | Private |
| Mutability | Immutable | Mutable |
| Query | Limited (events only) | SQL/NoSQL powerful |

**Vai trò đúng:**
- **Blockchain:** Proof of payment, audit trail, transparency
- **Backend:** Business logic, user data, order management, shipping

---

### **3. Smart Contract Limitations**

**Không thể làm gì trên Smart Contract?**
- ❌ Gọi HTTP API (không có network access)
- ❌ Generate random number an toàn (deterministic)
- ❌ Get current time chính xác (dùng block.timestamp)
- ❌ Tự động execute sau 1 khoảng thời gian (cần external trigger)
- ❌ Lưu file/image (quá đắt)

**→ Dùng hybrid: Smart contract xử lý payment, backend xử lý logic phức tạp**

---

### **4. Transaction Lifecycle**

```
[Created] → [Signed] → [Broadcast] → [Mempool] → [Pending] 
   → [Mined] → [Block] → [1 Confirmation] → [3 Confirmations] 
   → [Finalized]

Có thể fail ở giai đoạn:
- Broadcast: Node reject (invalid signature, nonce)
- Mempool: Drop do gas quá thấp
- Execution: Contract revert (require fail)
- Reorg: Block bị replace (cần chờ confirmations)
```

---

### **5. Gas Optimization**

**Làm sao giảm gas fee?**
- Dùng Layer 2 (Polygon, Arbitrum) thay vì Ethereum mainnet
- Optimize contract code (dùng uint256 thay vì uint8, pack storage)
- Batch transactions (gom nhiều tx thành 1)
- Chọn thời điểm gas thấp (off-peak hours)
- Dùng EIP-1559 (base fee + priority fee)

---

### **6. Security Checklist**

**Backend:**
- ✅ Verify transaction on-chain (không tin frontend)
- ✅ Check confirmations ≥ 3
- ✅ Verify amount, orderId, token
- ✅ Prevent double-spending (check txHash uniqueness)
- ✅ Validate signature (tx từ đúng user wallet)
- ✅ Rate limiting (chống spam verify requests)

**Smart Contract:**
- ✅ Reentrancy guard (prevent reentrancy attack)
- ✅ Access control (chỉ owner mới upgrade contract)
- ✅ Pause mechanism (emergency stop)
- ✅ Input validation (require statements)

**Frontend:**
- ✅ Check chainId trước khi send tx
- ✅ Validate user input (amount, address format)
- ✅ Show clear transaction preview
- ✅ Handle MetaMask rejection gracefully

---

## 🧪 TESTING WORKFLOW

### **Testnet Setup**

**1. Lấy testnet coin (faucet):**
- BSC Testnet: https://testnet.binance.org/faucet-smart
- Sepolia: https://sepoliafaucet.com
- Polygon Mumbai: https://faucet.polygon.technology

**2. Lấy testnet USDT:**
- Deploy USDT mock contract
- Hoặc dùng contract có sẵn từ testnet explorer

**3. Deploy smart contract:**
```bash
npx hardhat deploy --network bscTestnet
```

**4. Verify contract trên explorer:**
```bash
npx hardhat verify --network bscTestnet CONTRACT_ADDRESS
```

---

### **Test Cases**

**✅ Happy Path:**
1. Connect wallet → Success
2. Switch network → Correct chain
3. Create order → orderId created
4. Pay with MetaMask → tx confirmed
5. Backend verify → status=COMPLETED

**❌ Error Cases:**

| Scenario | Expected Behavior |
|----------|-------------------|
| MetaMask not installed | Show install prompt |
| Wrong network | Request switch chain |
| Insufficient balance | MetaMask show error |
| User reject tx | Show "Payment cancelled" |
| Gas too low | Tx stuck in mempool → timeout |
| Wrong amount | Backend reject (verify fail) |
| Wrong token | Backend reject |
| TxHash reused | Backend reject (double-spend) |
| Confirmations < 3 | Backend wait |
| Payment timeout (15 min) | Order auto-cancelled |

---

## 📚 APPENDIX: THUẬT NGỮ TỔNG HỢP

**Wallet & Account:**
- **Wallet:** Software quản lý private keys
- **Private Key:** 256-bit secret để ký transaction
- **Public Key:** Derived từ private key bằng ECDSA
- **Address:** Derived từ public key bằng Keccak256
- **EOA:** Externally Owned Account (do user control)
- **Contract Account:** Account của smart contract

**Network:**
- **Chain:** Blockchain network (Ethereum, BSC, Polygon)
- **ChainId:** Unique identifier (1=ETH, 56=BSC, 137=Polygon)
- **Testnet:** Fake blockchain để test
- **Mainnet:** Production blockchain với tiền thật
- **RPC:** API endpoint để giao tiếp với node
- **WebSocket:** Persistent connection cho real-time events

**Transaction:**
- **Transaction:** Đơn vị thay đổi state
- **TxHash:** Unique ID của transaction (32 bytes)
- **Nonce:** Số thứ tự tx của account (prevent replay)
- **Gas:** Đơn vị đo computation cost
- **GasLimit:** Max gas sẵn sàng bỏ ra
- **GasPrice:** Giá mỗi gas unit (Gwei)
- **GasUsed:** Gas thực tế tiêu hao
- **Fee:** gasUsed × gasPrice

**Blockchain:**
- **Block:** Container chứa transactions
- **BlockNumber:** Số thứ tự block
- **Confirmations:** Số block sau block chứa tx
- **Mempool:** Pool chứa pending transactions
- **Reorg:** Blockchain revert và switch chain
- **Finality:** Trạng thái không thể revert

**Smart Contract:**
- **Smart Contract:** Code chạy on-chain
- **ABI:** Interface definition (JSON)
- **Event:** Log emit từ contract
- **Event Log:** Lưu trong receipt, dùng để listen
- **Indexed Parameter:** Event param có thể filter
- **State Variable:** Data lưu on-chain

**Token:**
- **Native Coin:** Coin gốc (ETH, BNB)
- **ERC20:** Token standard trên Ethereum
- **BEP20:** Token standard trên BSC (fork ERC20)
- **Decimals:** Số chữ số thập phân (USDT=6, USDC=6)
- **Approve:** Cho phép contract rút token
- **Allowance:** Số token được phép rút
- **Transfer:** Gửi token trực tiếp
- **TransferFrom:** Contract rút token (cần approve trước)

**Architecture:**
- **Web2:** Traditional web (client-server)
- **Web3:** Decentralized web (blockchain-based)
- **Hybrid:** Kết hợp Web2 + Web3
- **On-chain:** Data lưu trên blockchain
- **Off-chain:** Data lưu ngoài blockchain
- **Source of Truth:** Hệ thống quyết định state cuối cùng

---

## ✅ SUMMARY

**Quy trình 15 bước:**

1. **Connect Wallet** → MetaMask extension inject `window.ethereum`
2. **User Approve** → Grant permission, frontend nhận address
3. **Check ChainId** → Verify đúng network, request switch nếu cần
4. **Create Order** → User điền form
5. **POST /api/orders** → Frontend gửi request
6. **Backend Create Order** → Calculate amount, INSERT DB (status=PENDING)
7. **Render Payment UI** → QR, amount, recipient, countdown
8. **User Click Pay** → Frontend call contract / send tx
9. **MetaMask Confirm** → User sign với private key
10. **Tx → Mempool** → Broadcast to network, chờ mining
11. **Block Mined** → Validator execute contract, emit event
12. **Backend Listen Event** → WebSocket detect OrderPaid
13. **Backend Verify** → Check receipt, confirmations, amount, orderId
14. **Update DB** → paymentStatus=COMPLETED, status=CONFIRMED
15. **Frontend Update** → Poll/WebSocket → Show success

**Key Principles:**
- 🔒 **Backend là source of truth**, không tin frontend
- 🔗 **Blockchain là proof**, không phải replacement cho database
- ✅ **Verify on-chain** trước khi update DB
- ⏱️ **Chờ confirmations** để chống reorg
- 🚫 **Frontend không quyết định PAID**, chỉ hiển thị kết quả

**Developer cần hiểu:**
- Blockchain **bổ sung** cho Web2, không thay thế
- Smart contract **giới hạn** nhiều, không phải silver bullet
- Gas fee **tốn kém**, phải optimize
- Security **quan trọng hơn convenience**
- Testnet **cần thiết** trước khi lên mainnet

---

**📌 Tài liệu này cung cấp foundation để implement hệ thống thanh toán blockchain trong môi trường production với security và reliability cao.**

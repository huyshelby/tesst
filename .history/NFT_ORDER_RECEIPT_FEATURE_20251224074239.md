# 📘 TÍNH NĂNG NFT ORDER RECEIPT (HOÁ ĐƠN ĐIỆN TỬ NFT)

> **Tài liệu kỹ thuật**: Hệ thống mint NFT chứng nhận đơn hàng trên blockchain

---

## 🎯 TỔNG QUAN

### Mô tả ngắn gọn
Tính năng cho phép khách hàng **mint NFT receipt** (hóa đơn điện tử dạng NFT) cho đơn hàng đã thanh toán thành công. NFT này:
- ✅ Là chứng nhận bất biến trên blockchain về giao dịch mua hàng
- ✅ Chứa metadata chi tiết về đơn hàng (sản phẩm, giá, thời gian, địa chỉ giao hàng)
- ✅ Có thể xem trên các NFT marketplace (OpenSea, BSCScan)
- ✅ Là collectible item độc nhất cho khách hàng

### Use Cases
1. **Proof of Purchase**: Chứng minh quyền sở hữu hợp pháp của sản phẩm
2. **Warranty Claim**: Sử dụng NFT làm bảo hành điện tử
3. **Gift/Resale**: Có thể chuyển nhượng quyền sở hữu kèm NFT receipt
4. **Collectible**: Khách hàng sưu tầm NFT của các đơn hàng đặc biệt
5. **Brand Loyalty**: Tạo trải nghiệm độc đáo, tăng engagement

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### Sơ đồ luồng dữ liệu

```
┌─────────────────┐      ┌─────────────────┐      ┌──────────────────┐
│   Frontend      │      │    Backend      │      │   Blockchain     │
│   (Next.js)     │      │   (Express)     │      │ (NFT Contract)   │
└─────────────────┘      └─────────────────┘      └──────────────────┘
        │                         │                         │
        │  1. Mint Request        │                         │
        ├────────────────────────▶│                         │
        │                         │                         │
        │                         │  2. Check if minted     │
        │                         ├─────────────────────────┤
        │                         │  (Query Order.nftTokenId)
        │                         │                         │
        │                         │  3. Generate Metadata   │
        │                         │  (JSON: name, desc,     │
        │                         │   attributes, image)    │
        │                         │                         │
        │                         │  4. Upload to IPFS      │
        │                         │  (Web3.Storage)         │
        │                         │                         │
        │                         │  5. safeMint() call     │
        │                         ├────────────────────────▶│
        │                         │  (userAddress,          │
        │                         │   orderHash,            │
        │                         │   metadataUrl)          │
        │                         │                         │
        │                         │  6. Emit Event          │
        │                         │◀────────────────────────┤
        │                         │  OrderReceiptMinted     │
        │                         │  (tokenId, txHash)      │
        │                         │                         │
        │                         │  7. Save to DB          │
        │                         │  (nftTokenId, txHash,   │
        │                         │   metadataUrl)          │
        │                         │                         │
        │  8. Return tokenId      │                         │
        │◀────────────────────────┤                         │
        │                         │                         │
        │  9. Display NFT Card    │                         │
        │  (Token ID, TxHash,     │                         │
        │   OpenSea link)         │                         │
```

### Các thành phần chính

#### 1. Smart Contract (`contracts/NFTReceipt.sol`)
- **Chuẩn**: ERC721 (NFT standard)
- **Extensions**: 
  - `ERC721Enumerable`: Track all tokens và owner's tokens
  - `ERC721URIStorage`: Lưu metadata URL cho mỗi token
  - `AccessControl`: RBAC cho minter role
  - `ReentrancyGuard`: Bảo vệ khỏi reentrancy attacks
- **Vai trò**: Mint NFT và quản lý ownership

#### 2. Backend Service (`backend/src/services/nft-receipt.service.ts`)
- **Vai trò**: Business logic mint NFT
- **Chức năng**:
  - Generate metadata từ order data
  - Upload metadata lên IPFS
  - Gọi smart contract để mint
  - Lưu thông tin NFT vào database

#### 3. Database Schema (Prisma)
- **Model `Order`**: Lưu thông tin NFT receipt
  ```prisma
  nftTokenId       String?   @unique
  nftMintTxHash    String?
  nftMetadataUrl   String?
  nftMintedAt      DateTime?
  nftMetadata      Json?
  ```

#### 4. Frontend Component (`phone-app/src/components/order/NFTReceipt.tsx`)
- **Vai trò**: UI hiển thị và mint NFT
- **Chức năng**:
  - Hiển thị trạng thái NFT (minted/not minted)
  - Button mint NFT
  - Hiển thị token ID, transaction hash
  - Links đến BSCScan và OpenSea

---

## 📋 CHI TIẾT SMART CONTRACT

### Contract: `NFTReceipt.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
```

### Cấu trúc dữ liệu

```solidity
struct Receipt {
    bytes32 orderHash;      // Hash của order number
    string metadataUrl;     // IPFS URL của metadata
    uint256 timestamp;      // Block timestamp khi mint
    address minter;         // Address của admin/system mint
    bool isActive;          // Trạng thái active (có thể revoke)
}

mapping(bytes32 => uint256) public orderHashToTokenId;  // Order hash → Token ID
mapping(uint256 => Receipt) public receipts;            // Token ID → Receipt info
mapping(address => uint256[]) public ownerTokens;       // Owner → Array of token IDs
```

### Hàm chính: `safeMint()`

```solidity
function safeMint(
    address to,              // Địa chỉ nhận NFT (user wallet)
    bytes32 orderHash,       // Hash của order number
    string memory metadataUrl // IPFS URL
) external onlyRole(MINTER_ROLE) nonReentrant returns (uint256)
```

**Logic flow:**
1. **Validate inputs**: Check address, orderHash, metadataUrl không empty
2. **Check duplicate**: Kiểm tra orderHash đã được mint chưa
3. **Increment counter**: Tăng tokenId
4. **Mint NFT**: Gọi `_safeMint(to, tokenId)`
5. **Set metadata URI**: Gọi `_setTokenURI(tokenId, metadataUrl)`
6. **Save receipt**: Lưu vào mapping `receipts[tokenId]`
7. **Map order → token**: Lưu `orderHashToTokenId[orderHash] = tokenId`
8. **Track owner**: Push tokenId vào `ownerTokens[to]`
9. **Emit event**: `OrderReceiptMinted(orderHash, tokenId, to, msg.sender, metadataUrl)`
10. **Return tokenId**

### Events

```solidity
event OrderReceiptMinted(
    bytes32 indexed orderHash,
    uint256 indexed tokenId,
    address indexed owner,
    address minter,
    string metadataUrl
);

event ReceiptMetadataUpdated(
    uint256 indexed tokenId,
    string oldMetadataUrl,
    string newMetadataUrl
);

event ReceiptRevoked(
    uint256 indexed tokenId,
    address indexed owner,
    string reason
);
```

### Roles

```solidity
bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
```

- **MINTER_ROLE**: Backend service có quyền này để mint NFT
- **ADMIN_ROLE**: Có thể grant/revoke roles, update metadata, revoke receipts

---

## 💾 DATABASE SCHEMA

### Model: `Order`

```prisma
model Order {
  // ... existing fields ...
  
  // NFT Receipt details
  nftTokenId       String?   @unique       // Token ID của NFT (unique globally)
  nftMintTxHash    String?                 // Transaction hash của mint transaction
  nftMetadataUrl   String?                 // IPFS URL của metadata
  nftMintedAt      DateTime?               // Timestamp khi mint
  nftMetadata      Json?                   // Cache của metadata JSON
  
  // ... other fields ...
  
  @@index([nftTokenId])
}
```

**Lưu ý:**
- `nftTokenId` là `String` vì Solidity `uint256` quá lớn cho JS Number
- `@unique` đảm bảo 1 tokenId chỉ map với 1 order
- `nftMetadata` cache metadata để không cần query IPFS mỗi lần

---

## 🔧 BACKEND SERVICE

### Service: `NFTReceiptService`

**File**: `backend/src/services/nft-receipt.service.ts`

#### Constructor

```typescript
constructor() {
  const blockchainService = getBlockchainService();
  this.provider = blockchainService.provider;
  
  const contractAddress = process.env.NFT_RECEIPT_CONTRACT_ADDRESS || "";
  const abi = [
    "function safeMint(address to, bytes32 orderHash, string memory metadataUrl) external returns (uint256)",
    "function tokenURI(uint256 tokenId) external view returns (string memory)",
    "function ownerOf(uint256 tokenId) external view returns (address)"
  ];
  
  this.nftContract = new ethers.Contract(contractAddress, abi, this.provider);
}
```

#### Method: `createReceiptMetadata()`

**Mục đích**: Generate NFT metadata JSON từ order data

**Input**: Order object (include items)

**Output**: Metadata object theo chuẩn OpenSea

```typescript
{
  name: "Order Receipt #ORD-20241224-ABC123",
  description: "Digital receipt for order ORD-20241224-ABC123",
  image: "ipfs://Qm...",  // Logo hoặc generated receipt image
  external_url: "https://your-store.com/orders/uuid",
  attributes: [
    { trait_type: "Order Number", value: "ORD-20241224-ABC123" },
    { trait_type: "Order Date", value: "2024-12-24T10:30:00Z" },
    { trait_type: "Total Amount", value: 25000000, display_type: "number" },
    { trait_type: "Status", value: "DELIVERED" }
  ],
  properties: {
    order_id: "uuid",
    customer_name: "Nguyen Van A",
    items: [
      {
        name: "iPhone 15 Pro Max 256GB",
        quantity: 1,
        price: 29990000,
        total: 29990000,
        image: "https://cdn.example.com/iphone15promax.jpg"
      }
    ],
    shipping: {
      address: "123 Nguyen Trai",
      city: "Ho Chi Minh",
      district: "Quan 1",
      ward: "Phuong Ben Nghe"
    }
  }
}
```

#### Method: `uploadToIPFS()`

**Mục đích**: Upload metadata JSON lên IPFS

**Service**: Web3.Storage API

```typescript
async uploadToIPFS(metadata: any): Promise<string> {
  const response = await axios.post('https://api.web3.storage/upload', metadata, {
    headers: {
      'Authorization': `Bearer ${process.env.WEB3_STORAGE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  return `ipfs://${response.data.cid}`;  // ipfs://Qm...
}
```

**Giải thích IPFS:**
- **IPFS** (InterPlanetary File System): Hệ thống file phi tập trung
- **CID** (Content Identifier): Hash của nội dung, đảm bảo immutability
- **ipfs://** protocol: Được NFT marketplaces tự động convert sang HTTP gateway

#### Method: `mintReceipt()`

**Mục đích**: Mint NFT receipt cho order

**Flow:**

```typescript
async mintReceipt(orderId: string): Promise<{ tokenId: string; txHash: string }> {
  // 1. Get order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
  
  if (!order) throw new Error('Order not found');
  
  // 2. Check if already minted
  if (order.nftTokenId) {
    return { 
      tokenId: order.nftTokenId, 
      txHash: order.nftMintTxHash || 'unknown' 
    };
  }
  
  // 3. Generate metadata
  const metadataUrl = await this.createReceiptMetadata(order);
  
  // 4. Generate order hash
  const orderHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'address', 'uint256'],
      [order.orderNumber, order.userId, Math.floor(order.createdAt.getTime() / 1000)]
    )
  );
  
  // 5. Get admin wallet (has MINTER_ROLE)
  const adminWallet = new ethers.Wallet(
    process.env.ADMIN_PRIVATE_KEY || '',
    this.provider
  );
  
  // 6. Connect contract with signer
  const contractWithSigner = this.nftContract.connect(adminWallet);
  
  // 7. Call safeMint
  const tx = await contractWithSigner.safeMint(
    order.userId,      // User wallet address
    orderHash,
    metadataUrl
  );
  
  // 8. Wait for transaction confirmation
  const receipt = await tx.wait();
  
  // 9. Extract tokenId from event
  const event = receipt.events?.find((e: any) => e.event === 'OrderReceiptMinted');
  const tokenId = event?.args?.tokenId.toString();
  
  if (!tokenId) throw new Error('Failed to get token ID from transaction');
  
  // 10. Save to database
  await prisma.order.update({
    where: { id: orderId },
    data: {
      nftTokenId: tokenId,
      nftMintTxHash: tx.hash,
      nftMetadataUrl: metadataUrl
    }
  });
  
  return { tokenId, txHash: tx.hash };
}
```

#### Method: `getReceiptInfo()`

**Mục đích**: Lấy thông tin NFT receipt của order

```typescript
async getReceiptInfo(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      nftTokenId: true,
      nftMetadataUrl: true,
      nftMintTxHash: true,
      status: true
    }
  });
  
  if (!order || !order.nftTokenId) return null;
  
  // Fetch metadata from IPFS
  const metadataUrl = order.nftMetadataUrl?.replace('ipfs://', '');
  let metadata = null;
  
  if (metadataUrl) {
    const response = await axios.get(`${IPFS_GATEWAY}${metadataUrl}`);
    metadata = response.data;
  }
  
  return {
    tokenId: order.nftTokenId,
    txHash: order.nftMintTxHash,
    status: order.status,
    metadata
  };
}
```

---

## 🎨 FRONTEND IMPLEMENTATION

### Component: `NFTReceipt.tsx`

**File**: `phone-app/src/components/order/NFTReceipt.tsx`

#### Props

```typescript
interface NFTReceiptProps {
  orderId: string;
  initialReceipt?: ReceiptResponse;  // Preloaded receipt data
  onMint: () => Promise<void>;       // Callback để mint
  isMinting: boolean;                // Loading state
}
```

#### States

```typescript
const [receipt, setReceipt] = useState<ReceiptResponse | null>(initialReceipt || null);
const [isLoading, setIsLoading] = useState(false);
```

#### UI States

**1. Loading State**
```tsx
<Card>
  <CardHeader><CardTitle>Digital Receipt (NFT)</CardTitle></CardHeader>
  <CardContent className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin" />
  </CardContent>
</Card>
```

**2. Not Minted State**
```tsx
<Card>
  <CardHeader><CardTitle>Digital Receipt (NFT)</CardTitle></CardHeader>
  <CardContent>
    <p className="text-muted-foreground mb-4">
      Claim a unique, collectible NFT of your order receipt on the blockchain.
    </p>
    <Button onClick={handleMint} disabled={isMinting}>
      {isMinting ? 'Minting...' : 'Mint Your NFT Receipt'}
    </Button>
    <p className="text-xs text-muted-foreground mt-2">
      A small network fee (gas) will be required.
    </p>
  </CardContent>
</Card>
```

**3. Minted State**
```tsx
<Card>
  <CardHeader><CardTitle>Digital Receipt (NFT)</CardTitle></CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Status:</span>
        <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
          Minted
        </span>
      </div>
      
      {/* Token Info */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Token ID:</span>
          <span className="font-mono font-bold">#{receipt.tokenId}</span>
        </div>
        
        {/* Transaction Link */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction:</span>
          <a href={getTransactionUrl(receipt.txHash, 'bsc')} 
             target="_blank" rel="noopener noreferrer"
             className="flex items-center text-blue-600 hover:underline">
            View on BscScan <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
        
        {/* OpenSea Link */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">View on Market:</span>
          <a href={getOpenSeaUrl(contractAddress, receipt.tokenId, 'bsc')}
             target="_blank" rel="noopener noreferrer"
             className="flex items-center text-blue-600 hover:underline">
            View on OpenSea <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
      
      {/* NFT Preview Image */}
      {receipt.metadata?.image && (
        <div className="mt-4 border-t pt-4">
          <img src={receipt.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
               alt="NFT Preview" 
               className="rounded-lg w-full max-w-xs mx-auto shadow-lg" />
        </div>
      )}
    </div>
  </CardContent>
</Card>
```

### API Functions

**File**: `phone-app/src/lib/order-api.ts`

```typescript
export interface ReceiptResponse {
  exists: boolean;
  tokenId?: string;
  txHash?: string;
  status?: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{ trait_type: string; value: any }>;
    properties: any;
  };
}

// Mint NFT receipt
export async function mintOrderReceipt(orderId: string): Promise<{
  tokenId: string;
  txHash: string;
  alreadyMinted: boolean;
}> {
  const response = await fetchApi(`/orders/${orderId}/nft-receipt`, {
    method: 'POST'
  });
  return response.data;
}

// Get NFT receipt info
export async function getOrderReceipt(orderId: string): Promise<ReceiptResponse> {
  const response = await fetchApi(`/orders/${orderId}/nft-receipt`);
  return response.data;
}

// Helper: Get transaction URL on block explorer
export function getTransactionUrl(txHash: string, network: 'bsc' | 'eth'): string {
  const explorers = {
    bsc: 'https://bscscan.com/tx/',
    eth: 'https://etherscan.io/tx/'
  };
  return `${explorers[network]}${txHash}`;
}

// Helper: Get OpenSea URL for NFT
export function getOpenSeaUrl(
  contractAddress: string, 
  tokenId: string, 
  network: 'bsc' | 'eth'
): string {
  const chains = {
    bsc: 'bsc',
    eth: 'ethereum'
  };
  return `https://opensea.io/assets/${chains[network]}/${contractAddress}/${tokenId}`;
}
```

---

## 🔌 API ENDPOINTS

### 1. Mint NFT Receipt

**POST** `/api/orders/:orderId/nft-receipt`

**Authentication**: Required (JWT)

**Authorization**: Order owner hoặc Admin

**Request:**
```http
POST /api/orders/uuid-here/nft-receipt
Authorization: Bearer <jwt_token>
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "NFT receipt minted successfully.",
  "data": {
    "tokenId": "123",
    "txHash": "0x1234567890abcdef...",
    "alreadyMinted": false
  }
}
```

**Response (Already Minted - 200):**
```json
{
  "success": true,
  "message": "NFT receipt already exists.",
  "data": {
    "tokenId": "123",
    "txHash": "0x1234567890abcdef...",
    "alreadyMinted": true
  }
}
```

**Error Responses:**

```json
// 400 - Order not paid
{
  "success": false,
  "error": "Minting failed",
  "message": "Cannot mint receipt for unpaid order"
}

// 404 - Order not found
{
  "success": false,
  "error": "Minting failed",
  "message": "Order not found"
}

// 403 - Unauthorized
{
  "success": false,
  "error": "Minting failed",
  "message": "Unauthorized to mint receipt for this order"
}
```

### 2. Get NFT Receipt Info

**GET** `/api/orders/:orderId/nft-receipt`

**Authentication**: Required (JWT)

**Authorization**: Order owner hoặc Admin

**Request:**
```http
GET /api/orders/uuid-here/nft-receipt
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "tokenId": "123",
    "txHash": "0x1234567890abcdef...",
    "status": "DELIVERED",
    "metadata": {
      "name": "Order Receipt #ORD-20241224-ABC123",
      "description": "Digital receipt for order ORD-20241224-ABC123",
      "image": "ipfs://Qm...",
      "external_url": "https://store.com/orders/uuid",
      "attributes": [
        { "trait_type": "Order Number", "value": "ORD-20241224-ABC123" },
        { "trait_type": "Total Amount", "value": 25000000 }
      ],
      "properties": {
        "order_id": "uuid",
        "customer_name": "Nguyen Van A",
        "items": [...]
      }
    }
  }
}
```

**Response (Not Minted - 404):**
```json
{
  "success": false,
  "message": "NFT receipt not found for this order."
}
```

---

## 🔐 SECURITY & AUTHORIZATION

### 1. Authorization Checks

```typescript
// OrderService.mintOrderReceipt()
if (order.userId !== userId) {
  throw new Error('Unauthorized to mint receipt for this order');
}
```

**Rule**: Chỉ owner của order mới có thể mint NFT receipt

### 2. Payment Status Validation

```typescript
if (order.paymentStatus !== 'COMPLETED') {
  throw new Error('Cannot mint receipt for unpaid order');
}
```

**Rule**: Chỉ mint NFT cho đơn hàng đã thanh toán thành công

### 3. Duplicate Prevention

```typescript
if (order.nftTokenId) {
  return {
    tokenId: order.nftTokenId,
    txHash: order.nftMintTxHash || 'unknown',
    alreadyMinted: true
  };
}
```

**Rule**: 1 order chỉ mint 1 NFT duy nhất (idempotent operation)

### 4. Smart Contract Access Control

```solidity
function safeMint(...) external onlyRole(MINTER_ROLE) nonReentrant {
  // Only addresses with MINTER_ROLE can call
}
```

**Rule**: Backend service account phải có MINTER_ROLE trong contract

### 5. Private Key Security

```typescript
const adminWallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY || '',
  this.provider
);
```

**Best Practices:**
- ✅ Private key lưu trong `.env`, KHÔNG commit lên git
- ✅ Production: Dùng AWS Secrets Manager hoặc HashiCorp Vault
- ✅ Rotate key định kỳ
- ✅ Sử dụng separate wallet cho mỗi environment (dev, staging, prod)

---

## ⚙️ ENVIRONMENT VARIABLES

### Backend (`.env`)

```env
# NFT Receipt Contract
NFT_RECEIPT_CONTRACT_ADDRESS=0x1234567890abcdef...

# Blockchain Provider
BLOCKCHAIN_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545

# Admin Wallet (has MINTER_ROLE)
ADMIN_PRIVATE_KEY=0xabcdef1234567890...

# IPFS Storage
WEB3_STORAGE_API_KEY=your_web3_storage_token
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Frontend URL (for metadata external_url)
FRONTEND_URL=https://your-store.com
```

### Frontend (`.env.local`)

```env
# NFT Contract Address (for OpenSea links)
NEXT_PUBLIC_NFT_RECEIPT_CONTRACT_ADDRESS=0x1234567890abcdef...

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🚀 DEPLOYMENT CHECKLIST

### 1. Deploy Smart Contract

```bash
cd blockchain
npx hardhat run scripts/deploy-nft-receipt.ts --network bsc_testnet
```

**Output:**
```
✅ NFTReceipt deployed to: 0x1234567890abcdef...
📝 Save this address to backend/.env as NFT_RECEIPT_CONTRACT_ADDRESS
```

### 2. Grant MINTER_ROLE to Backend Wallet

```bash
# In Hardhat console or write a script
const contract = await ethers.getContractAt("NFTReceipt", "0x...");
const MINTER_ROLE = await contract.MINTER_ROLE();
await contract.grantRole(MINTER_ROLE, "0xBackendWalletAddress");
```

### 3. Update Backend Environment

```bash
# backend/.env
NFT_RECEIPT_CONTRACT_ADDRESS=0x1234567890abcdef...
ADMIN_PRIVATE_KEY=0xYourBackendWalletPrivateKey...
```

### 4. Update Frontend Environment

```bash
# phone-app/.env.local
NEXT_PUBLIC_NFT_RECEIPT_CONTRACT_ADDRESS=0x1234567890abcdef...
```

### 5. Test Minting

```bash
# 1. Create order và thanh toán
# 2. Call POST /api/orders/:orderId/nft-receipt
# 3. Verify on BSCScan: https://testnet.bscscan.com/tx/0x...
# 4. Check OpenSea: https://testnets.opensea.io/assets/bsc-testnet/0x.../123
```

---

## 📊 MONITORING & ANALYTICS

### Metrics to Track

1. **Mint Success Rate**
   ```sql
   SELECT 
     COUNT(*) FILTER (WHERE nftTokenId IS NOT NULL) AS minted,
     COUNT(*) FILTER (WHERE paymentStatus = 'COMPLETED') AS paid,
     ROUND(COUNT(*) FILTER (WHERE nftTokenId IS NOT NULL) * 100.0 / 
           NULLIF(COUNT(*) FILTER (WHERE paymentStatus = 'COMPLETED'), 0), 2) AS mint_rate_percent
   FROM "Order";
   ```

2. **Average Mint Time**
   ```sql
   SELECT AVG(EXTRACT(EPOCH FROM (nftMintedAt - createdAt))) AS avg_mint_seconds
   FROM "Order"
   WHERE nftMintedAt IS NOT NULL;
   ```

3. **Gas Cost per Mint**
   - Track transaction gas used từ `receipt.gasUsed`
   - Monitor gas price fluctuations
   - Estimate monthly gas costs

4. **IPFS Upload Success Rate**
   - Track Web3.Storage API success/failure
   - Monitor upload latency

### Logs to Monitor

```typescript
// Backend logs
console.log(`[NFT] Minting receipt for order ${order.orderNumber}`);
console.log(`[NFT] Metadata uploaded to IPFS: ${metadataUrl}`);
console.log(`[NFT] Transaction sent: ${tx.hash}`);
console.log(`[NFT] Receipt minted successfully. Token ID: ${tokenId}`);

// Error logs
console.error(`[NFT] Failed to mint receipt for order ${orderId}:`, error);
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: Transaction Failed - Gas Too Low

**Error:**
```
Error: transaction failed (reason="execution reverted: gas too low", ...)
```

**Solution:**
```typescript
const tx = await contractWithSigner.safeMint(
  order.userId,
  orderHash,
  metadataUrl,
  {
    gasLimit: 300000  // Tăng gas limit
  }
);
```

### Issue 2: IPFS Upload Timeout

**Error:**
```
Error: Timeout uploading to IPFS
```

**Solution:**
- Retry logic với exponential backoff
- Fallback to alternative IPFS gateway (Pinata, Infura)
- Cache metadata locally trước khi upload

```typescript
async uploadToIPFS(metadata: any, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      return await this._uploadToWeb3Storage(metadata);
    } catch (error) {
      if (i === retries - 1) throw error;
      await this.delay(Math.pow(2, i) * 1000);  // Exponential backoff
    }
  }
}
```

### Issue 3: NFT Not Showing on OpenSea

**Possible Reasons:**
1. Metadata chưa được indexed (chờ 5-10 phút)
2. Contract chưa được verify trên BSCScan
3. Network không supported (OpenSea chỉ support mainnet)

**Solution:**
- BSC Testnet: Dùng https://testnets.opensea.io
- Verify contract trên BSCScan để hiện metadata
- Force refresh metadata trên OpenSea

### Issue 4: User Wallet Address Not Saved

**Error:**
```
Error: Cannot mint NFT - user wallet address is null
```

**Root Cause**: User chưa connect wallet hoặc không lưu address khi tạo order

**Solution:**
```typescript
// Ensure userId in Order is actually wallet address for crypto payments
if (paymentMethod === 'CRYPTO') {
  // userId should be wallet address (0x...)
  if (!userId.startsWith('0x')) {
    throw new Error('Invalid wallet address for crypto payment');
  }
}
```

---

## 🎯 BEST PRACTICES

### 1. Metadata Design

✅ **DO:**
- Include order number, date, total trong `attributes`
- Use `display_type: "number"` cho numeric values
- Provide high-quality `image` (logo hoặc generated receipt)
- Set meaningful `external_url` linking back to order page

❌ **DON'T:**
- Không include sensitive data (credit card, password)
- Không lưu PII (Personally Identifiable Information) quá chi tiết
- Không hardcode URLs, dùng environment variables

### 2. Gas Optimization

✅ **DO:**
- Batch mint nếu có nhiều orders (giảm gas cost)
- Monitor gas price, mint khi gas thấp
- Use `gasLimit` estimates từ `estimateGas()`

❌ **DON'T:**
- Không mint real-time khi user click (có thể chậm)
- Không retry mint nếu đã có `nftTokenId`

### 3. Error Handling

✅ **DO:**
- Return meaningful error messages
- Log all errors với context (orderId, userId, txHash)
- Implement retry logic cho transient errors

❌ **DON'T:**
- Không throw generic errors
- Không expose private keys trong error messages

### 4. Testing

✅ **DO:**
- Test trên testnet trước khi deploy mainnet
- Verify metadata rendering trên OpenSea testnets
- Test với multiple user wallets

❌ **DON'T:**
- Không skip contract verification
- Không mint test NFTs trên mainnet

---

## 📈 FUTURE ENHANCEMENTS

### 1. Dynamic NFT

**Concept**: NFT metadata updates khi order status changes

**Implementation:**
```solidity
function updateMetadata(uint256 tokenId, string memory newMetadataUrl) 
    external onlyRole(ADMIN_ROLE) {
    _setTokenURI(tokenId, newMetadataUrl);
    emit ReceiptMetadataUpdated(tokenId, tokenURI(tokenId), newMetadataUrl);
}
```

**Use Case**: Update image khi order = DELIVERED

### 2. Tiered NFT Rarity

**Concept**: Khách hàng VIP nhận NFT "Gold Edition", thường nhận "Standard"

**Implementation:**
- Attributes: `{ trait_type: "Edition", value: "Gold" }`
- Khác nhau về image (gold border, special badge)

### 3. NFT Marketplace Integration

**Concept**: Cho phép resale NFT receipt (transfer ownership)

**Considerations:**
- Transfer NFT ≠ Transfer order ownership (cần logic riêng)
- Warranty tied to NFT, not original buyer

### 4. Composable NFTs

**Concept**: Multiple orders từ cùng campaign tạo thành 1 "collection set"

**Example**: Mua đủ 5 sản phẩm Apple → claim 1 "Super Fan" NFT

### 5. Gamification

**Concept**: Mint NFT receipt để earn points/badges

**Implementation:**
- On-chain badge system
- Redeemable rewards cho collectors

---

## 📚 RELATED DOCUMENTATION

- [BLOCKCHAIN_PAYMENT_FLOW.md](./BLOCKCHAIN_PAYMENT_FLOW.md) - Blockchain payment integration
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Overall system architecture
- [ORDER_FLOW_GUIDE.md](./ORDER_FLOW_GUIDE.md) - Order processing workflow

---

## 🆘 SUPPORT & CONTACT

**Issues**: [GitHub Issues](https://github.com/your-repo/issues)  
**Documentation**: [Wiki](https://github.com/your-repo/wiki)  
**Team**: E-Commerce Blockchain Team

---

**Phiên bản tài liệu**: v1.0  
**Cập nhật lần cuối**: 2024-12-24  
**Tác giả**: E-Commerce Development Team

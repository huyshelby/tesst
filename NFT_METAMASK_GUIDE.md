# Cách Mint NFT Receipt vào Ví MetaMask

## 🎯 Tổng quan

Bây giờ user có thể **tự mint NFT receipt trực tiếp vào ví MetaMask** của mình thay vì backend mint hộ. Điều này đảm bảo user **sở hữu NFT thực sự** trong ví cá nhân.

---

## 🔧 Setup MetaMask

### 1. Cài đặt MetaMask
- Tải extension: https://metamask.io
- Tạo ví mới hoặc import existing wallet

### 2. Thêm Hardhat Local Network

**Option A: Thêm thủ công**
```
Network Name: Hardhat Local
RPC URL: http://localhost:8545
Chain ID: 31337
Currency Symbol: ETH
```

**Option B: Tự động** (khi click "Mint NFT Receipt", app sẽ tự động thêm)

### 3. Import Test Account (để có ETH test)

Vào MetaMask → Import Account → paste private key:
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**⚠️ CHÚ Ý:** Đây là private key của Hardhat account #0 (chỉ dùng local dev)
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Balance: 10,000 ETH (test)

---

## 🚀 Cách Mint NFT

### Flow mới:

1. **User đặt hàng và thanh toán** → Order status = COMPLETED
2. **Vào order detail page** → Thấy section "NFT Digital Receipt"
3. **Click "Mint NFT Receipt"** → MetaMask popup xuất hiện
4. **Connect wallet** (nếu chưa kết nối)
5. **Approve transaction** trong MetaMask
6. **NFT được mint** vào ví MetaMask của user!

---

## 📝 Backend Changes (nếu muốn)

### Option 1: Backend prepare metadata (recommended)

Backend tạo API endpoint để lấy `orderHash` và `metadataUrl`:

```typescript
// GET /api/orders/:id/mint-data
export async function getMintData(req: Request, res: Response) {
  const { id } = req.params;
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order || order.paymentStatus !== 'COMPLETED') {
    return res.status(400).json({ error: 'Order not eligible for minting' });
  }

  // Create metadata
  const metadataUrl = await NFTReceiptService.createReceiptMetadata(order);

  // Create order hash
  const orderHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'address', 'uint256'],
      [order.orderNumber, order.userId, Math.floor(order.createdAt.getTime() / 1000)]
    )
  );

  res.json({
    orderHash,
    metadataUrl,
    contractAddress: process.env.NFT_RECEIPT_CONTRACT_ADDRESS
  });
}
```

### Option 2: Frontend tự tạo orderHash

Frontend tính toán orderHash từ order data (đơn giản hơn):

```typescript
import { ethers } from 'ethers';

function createOrderHash(orderNumber: string, userId: string, createdAt: Date) {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'address', 'uint256'],
      [orderNumber, userId, Math.floor(createdAt.getTime() / 1000)]
    )
  );
}
```

---

## 🎨 Frontend Integration

### 1. Update Order Detail Page

```tsx
// phone-app/src/app/account/orders/[orderId]/page.tsx

import { mintNFTWithWallet, addNFTToWallet } from '@/lib/web3-wallet';

const handleMintNFT = async () => {
  if (!order) return;
  
  setIsMintingNFT(true);
  try {
    // Get mint data from backend
    const response = await fetch(`/api/orders/${order.id}/mint-data`);
    const { orderHash, metadataUrl } = await response.json();

    // User mint NFT với MetaMask
    const { txHash, tokenId } = await mintNFTWithWallet(orderHash, metadataUrl);

    // Save NFT info to database
    await fetch(`/api/orders/${order.id}/nft-receipt`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId, txHash })
    });

    // Optionally add NFT to MetaMask
    await addNFTToWallet(tokenId);

    // Refresh order
    const updated = await getOrderById(order.id);
    setOrder(updated);

    alert('NFT đã được mint thành công vào ví MetaMask của bạn! 🎉');
  } catch (err: any) {
    alert(err.message || 'Không thể mint NFT');
  } finally {
    setIsMintingNFT(false);
  }
};
```

### 2. Update NFTReceipt Component (optional)

Thêm wallet connection status:

```tsx
import { useState, useEffect } from 'react';
import { getCurrentWallet, formatAddress } from '@/lib/web3-wallet';

export function NFTReceipt({ ... }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    getCurrentWallet().then(setWalletAddress);
  }, []);

  return (
    <div>
      {walletAddress && (
        <div className="text-sm text-gray-600 mb-4">
          Connected: {formatAddress(walletAddress)}
        </div>
      )}
      {/* ... rest of component */}
    </div>
  );
}
```

---

## 🔍 Xem NFT trong MetaMask

Sau khi mint thành công:

### Option 1: Tự động thêm
```typescript
await addNFTToWallet(tokenId);
```

### Option 2: Thêm thủ công
1. Mở MetaMask
2. Click tab "NFTs"
3. Click "Import NFT"
4. Nhập:
   - **Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
   - **Token ID**: (lấy từ response)
5. Click "Add"

---

## 🧪 Testing Checklist

- [ ] MetaMask installed and connected to Hardhat network
- [ ] Test account có ETH (import private key)
- [ ] Blockchain local đang chạy (`cd blockchain && npx hardhat node`)
- [ ] Backend running (`cd backend && npm run dev`)
- [ ] Frontend running (`cd phone-app && npm run dev`)
- [ ] Order có status COMPLETED
- [ ] Click "Mint NFT Receipt" → MetaMask popup xuất hiện
- [ ] Approve transaction → NFT mint thành công
- [ ] NFT hiển thị trong MetaMask NFTs tab
- [ ] OpenSea link works (nếu deploy testnet)

---

## ⚠️ Common Issues

### MetaMask không kết nối được

**Solution:**
```typescript
await switchToLocalNetwork(); // App tự thêm network
```

### Transaction bị reject

**Lỗi:** "User denied transaction"
**Solution:** User cần approve transaction trong MetaMask popup

### Insufficient funds

**Lỗi:** "Insufficient funds for gas"
**Solution:** Import test account với 10,000 ETH

### NFT không hiển thị trong MetaMask

**Solution:** Manually import NFT với contract address và token ID

---

## 🌐 Deploy to Testnet (Optional)

Để user thực sự sở hữu NFT trên blockchain:

### 1. Deploy to Sepolia Testnet

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network sepolia
```

### 2. Update Frontend Config

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=<deployed_contract_address>
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/<your_key>
```

### 3. Get Test ETH

- Sepolia Faucet: https://sepoliafaucet.com
- User cần ETH để mint NFT

---

## 📚 API Reference

### `connectWallet()`
Kết nối MetaMask và lấy địa chỉ ví

**Returns:** `Promise<string>` - Wallet address

### `mintNFTWithWallet(orderHash, metadataUrl)`
Mint NFT vào ví user với MetaMask

**Parameters:**
- `orderHash`: bytes32 - Unique order identifier
- `metadataUrl`: string - IPFS metadata URL

**Returns:** `Promise<{ txHash, tokenId }>`

### `addNFTToWallet(tokenId)`
Thêm NFT vào MetaMask để hiển thị

**Parameters:**
- `tokenId`: string - NFT token ID

### `switchToLocalNetwork()`
Thêm/chuyển sang Hardhat local network

---

## 🎉 Benefits

✅ **User ownership**: NFT được mint vào ví riêng của user
✅ **Transparent**: User thấy transaction trong MetaMask
✅ **Self-custody**: User kiểm soát NFT 100%
✅ **Compatible**: Hoạt động với mọi ERC721-compatible wallet
✅ **OpenSea ready**: NFT có thể hiển thị trên OpenSea

---

## 🔐 Security Notes

- **Local development**: Chỉ dùng test private key
- **Production**: User dùng ví riêng (không bao giờ share private key)
- **Gas fees**: User tự trả gas (có thể implement gasless mint nếu muốn)
- **Contract ownership**: Admin wallet vẫn có thể mint nếu cần support

---

## 📞 Support

Nếu có vấn đề:
1. Check MetaMask network = Hardhat Local (Chain ID 31337)
2. Check account có ETH
3. Check blockchain node đang chạy
4. Check contract đã deploy đúng address
5. Check browser console logs

# 🚀 NFT Receipt - Quickstart Guide

> **5 phút để hiểu và sử dụng NFT Receipt UI**

---

## 🎯 Tính năng mới

✅ **Đã thêm:**
1. NFT Receipt section trong Order Detail page
2. NFT Receipts Gallery page (`/account/nft-receipts`)
3. Link "NFT Receipts" trong Account menu
4. API integration cho mint và get NFT receipt

---

## 📱 Truy cập giao diện

### 1. Xem NFT Receipt của đơn hàng cụ thể

```
Đường dẫn: /account/orders/[orderId]

Flow:
1. Login → Account → Đơn hàng của tôi
2. Click vào đơn hàng đã thanh toán
3. Scroll xuống cuối → Thấy "Digital Receipt (NFT)" section
```

**Nếu chưa mint:**
- Hiển thị nút "Mint NFT Receipt của bạn"
- Click để mint → Chờ 10-30s → Tự động refresh

**Nếu đã mint:**
- Hiển thị Token ID, links BscScan/OpenSea
- Hiển thị NFT image preview

---

### 2. Xem tất cả NFT Receipts

```
Đường dẫn: /account/nft-receipts

Flow:
1. Login → Account
2. Click "NFT Receipts" trong menu
3. Xem grid gallery của tất cả NFT receipts
```

**Features:**
- Grid responsive (3 cols desktop, 1 col mobile)
- Click card → Xem order detail
- Links trực tiếp đến BscScan/OpenSea

---

## 🔧 Code Changes

### Files Created

1. **`phone-app/src/app/account/nft-receipts/page.tsx`**
   - NFT Receipts Gallery page
   - Fetches all orders + receipts
   - Grid layout với cards

### Files Modified

1. **`phone-app/src/lib/order-api.ts`**
   ```typescript
   + mintOrderReceipt(orderId: string)
   + getOrderReceipt(orderId: string)
   + getTransactionUrl(txHash, network)
   + getOpenSeaUrl(contractAddress, tokenId, network)
   + Types: NFTMetadata, ReceiptResponse
   ```

2. **`phone-app/src/components/order/NFTReceipt.tsx`**
   - Redesigned UI với gradient backgrounds
   - Mint button state
   - Minted state với preview

3. **`phone-app/src/app/account/orders/[orderId]/page.tsx`**
   ```tsx
   + import NFTReceipt component
   + handleMintNFT function
   + Render NFTReceipt if paymentStatus === "COMPLETED"
   ```

4. **`phone-app/src/app/account/page.tsx`**
   ```tsx
   + import Award icon
   + Add "NFT Receipts" menu item
   ```

---

## 🎨 UI Preview

### Mint Button (chưa mint)
```
┌──────────────────────────────────────┐
│ 🏆 Digital Receipt (NFT)             │
│ ┌────────────────────────────────┐   │
│ │ 🏆 Mint NFT Receipt của bạn    │   │
│ └────────────────────────────────┘   │
│ ⚠️ Phí gas: 0.001 - 0.01 BNB        │
└──────────────────────────────────────┘
```

### Minted State
```
┌──────────────────────────────────────┐
│ 🏆 Digital Receipt (NFT)             │
│ [✓ Đã Mint]                         │
│ Token ID: #12345                    │
│ [Xem trên BscScan →]                │
│ [Xem trên OpenSea →]                │
│ [NFT Image Preview]                 │
└──────────────────────────────────────┘
```

---

## ✅ Testing Steps

1. **Start servers:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Phone App
   cd phone-app && npm run dev
   ```

2. **Test mint NFT:**
   - Login → Account → Đơn hàng
   - Find đơn hàng đã thanh toán (COMPLETED)
   - Scroll down → Click "Mint NFT Receipt"
   - Verify: Loading → Success → Hiển thị Token ID

3. **Test gallery:**
   - Account → NFT Receipts
   - Verify: Grid hiển thị tất cả NFT receipts
   - Click card → Verify: Navigate đến order detail

4. **Test external links:**
   - Click "Xem trên BscScan" → Mở new tab với BscScan URL
   - Click "Xem trên OpenSea" → Mở new tab với OpenSea URL

---

## 🚨 Requirements

### Environment Variables
```env
# phone-app/.env.local
NEXT_PUBLIC_NFT_RECEIPT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

### Backend APIs
- ✅ `POST /api/orders/:orderId/nft-receipt` - Mint NFT
- ✅ `GET /api/orders/:orderId/nft-receipt` - Get receipt info
- ✅ NFT Receipt Service đã implement

---

## 📚 Documentation

- **Full UI Guide:** [NFT_RECEIPT_UI_GUIDE.md](NFT_RECEIPT_UI_GUIDE.md)
- **Feature Spec:** [NFT_ORDER_RECEIPT_FEATURE.md](NFT_ORDER_RECEIPT_FEATURE.md)
- **User Guide:** [NFT_RECEIPT_USER_GUIDE.md](NFT_RECEIPT_USER_GUIDE.md)

---

## 🎉 Done!

Bây giờ user có thể:
- ✅ Mint NFT receipt cho đơn hàng đã thanh toán
- ✅ Xem NFT receipt trong order detail
- ✅ Xem bộ sưu tập NFT receipts trong gallery
- ✅ Truy cập NFT trên BscScan và OpenSea

**Next steps:**
- [ ] Add notification khi mint thành công
- [ ] Add share NFT feature
- [ ] Add filtering/sorting trong gallery

---

**Version:** 1.0  
**Date:** 24/12/2024

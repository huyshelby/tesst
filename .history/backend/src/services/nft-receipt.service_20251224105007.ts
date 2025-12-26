import { prisma } from "../utils/prisma";
import { ethers } from "ethers";
import { getBlockchainService } from "./blockchain/blockchain.service";
import axios from "axios";

const IPFS_GATEWAY = process.env.IPFS_GATEWAY || "https://ipfs.io/ipfs/";

export class NFTReceiptService {
  private nftContract: ethers.Contract;
  private provider: ethers.providers.Provider;

  constructor() {
    const blockchainService = getBlockchainService();
    this.provider = (blockchainService as any).provider;
    
    const contractAddress = process.env.NFT_RECEIPT_CONTRACT_ADDRESS || "";
    const abi = [
      "function safeMint(address to, bytes32 orderHash, string memory metadataUrl) external returns (uint256)",
      "function tokenURI(uint256 tokenId) external view returns (string memory)",
      "function ownerOf(uint256 tokenId) external view returns (address)",
      "function hasRole(bytes32 role, address account) external view returns (bool)",
      "function grantRole(bytes32 role, address account) external",
      "function MINTER_ROLE() external view returns (bytes32)"
    ];
    
    this.nftContract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  async createReceiptMetadata(order: any) {
    const items = order.items.map((item: any) => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.subtotal,
      image: item.productImage ? `https://your-cdn.com${item.productImage}` : null
    }));

    // Create a beautiful receipt image URL (can be replaced with actual generated image)
    // For now, using a placeholder that represents a digital receipt
    const receiptImageUrl = process.env.NFT_RECEIPT_IMAGE_URL || 
      "https://via.placeholder.com/512x512.png?text=Digital+Receipt";

    const metadata = {
      name: `Order Receipt #${order.orderNumber}`,
      description: `Digital receipt for order ${order.orderNumber}. Total: ${order.total.toLocaleString('vi-VN')}₫. Items: ${items.length}. Customer: ${order.customerName}`,
      image: receiptImageUrl,
      external_url: `${process.env.FRONTEND_URL || 'https://your-store.com'}/account/orders/${order.id}`,
      attributes: [
        {
          trait_type: "Order Number",
          value: order.orderNumber
        },
        {
          trait_type: "Order Date",
          value: order.createdAt.toISOString()
        },
        {
          trait_type: "Total Amount (VND)",
          value: order.total,
          display_type: "number"
        },
        {
          trait_type: "Items Count",
          value: items.length,
          display_type: "number"
        },
        {
          trait_type: "Status",
          value: order.status
        },
        {
          trait_type: "Payment Status",
          value: order.paymentStatus
        },
        {
          trait_type: "Customer Name",
          value: order.customerName
        }
      ],
      properties: {
        order_id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        items: items,
        shipping: {
          address: order.shippingAddress,
          city: order.shippingCity,
          district: order.shippingDistrict,
          ward: order.shippingWard
        },
        totals: {
          subtotal: order.subtotal,
          shipping: order.shippingFee,
          discount: order.discount,
          total: order.total
        }
      }
    };

    return this.uploadToIPFS(metadata);
  }

  async uploadToIPFS(metadata: any): Promise<string> {
    // Check if Web3.Storage API key is configured
    const apiKey = process.env.WEB3_STORAGE_API_KEY;
    
    // Fallback to mock IPFS for development/testing
    if (!apiKey || process.env.BLOCKCHAIN_ENV === 'local') {
      console.log('⚠️ Web3.Storage API key not configured or running in local mode. Using mock IPFS.');
      
      // Generate mock CID based on metadata hash
      const mockCid = `Qm${Buffer.from(JSON.stringify(metadata)).toString('base64').substring(0, 44)}`;
      
      // Store metadata in memory for development (in production, this would be on IPFS)
      // You can retrieve it later if needed
      console.log('📦 Mock IPFS metadata:', JSON.stringify(metadata, null, 2));
      
      return `ipfs://${mockCid}`;
    }

    try {
      const response = await axios.post('https://api.web3.storage/upload', metadata, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      return `ipfs://${response.data.cid}`;
    } catch (error: any) {
      console.error('❌ Error uploading to IPFS:', error.message);
      
      // If Web3.Storage is down, fallback to mock for development
      if (error.response?.status === 503 || error.code === 'ECONNREFUSED') {
        console.warn('⚠️ Web3.Storage unavailable. Using mock IPFS as fallback.');
        const mockCid = `Qm${Buffer.from(JSON.stringify(metadata)).toString('base64').substring(0, 44)}`;
        return `ipfs://${mockCid}`;
      }
      
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }

  async mintReceipt(orderId: string): Promise<{ tokenId: string; txHash: string }> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.nftTokenId) {
      return { 
        tokenId: order.nftTokenId.toString(), 
        txHash: order.nftMintTxHash || 'unknown' 
      };
    }

    // Validate: Order must be COMPLETED and have crypto wallet
    if (order.paymentStatus !== 'COMPLETED') {
      throw new Error('Order must be completed before minting NFT');
    }

    if (!order.cryptoWallet) {
      throw new Error('No crypto wallet found for this order. Please ensure payment was made via blockchain.');
    }

    const metadataUrl = await this.createReceiptMetadata(order);
    
    const orderHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['string', 'address', 'uint256'],
        [order.orderNumber, order.cryptoWallet, Math.floor(order.createdAt.getTime() / 1000)]
      )
    );

    const adminWallet = new ethers.Wallet(
      process.env.ADMIN_PRIVATE_KEY || '',
      this.provider
    );

    const contractWithSigner = this.nftContract.connect(adminWallet);
    
    try {
      // Mint NFT to the wallet that paid for the order (not userId)
      const tx = await contractWithSigner.safeMint(
        order.cryptoWallet, // ✅ Mint to wallet address, not userId
        orderHash,
        metadataUrl
      );

      const receipt = await tx.wait();
      const event = receipt.events?.find((e: any) => e.event === 'OrderReceiptMinted');
      const tokenId = event?.args?.tokenId.toString();

      if (!tokenId) {
        throw new Error('Failed to get token ID from transaction');
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          nftTokenId: tokenId,
          nftMintTxHash: tx.hash,
          nftMetadataUrl: metadataUrl
        }
      });

      return {
        tokenId,
        txHash: tx.hash
      };

    } catch (error) {
      console.error('Error minting NFT receipt:', error);
      throw new Error('Failed to mint NFT receipt');
    }
  }

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

    if (!order || !order.nftTokenId) {
      return null;
    }

    const metadataUrl = order.nftMetadataUrl?.replace('ipfs://', '');
    let metadata = null;

    if (metadataUrl) {
      try {
        const response = await axios.get(`${IPFS_GATEWAY}${metadataUrl}`);
        metadata = response.data;
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    }

    return {
      tokenId: order.nftTokenId,
      txHash: order.nftMintTxHash,
      status: order.status,
      metadata
    };
  }
}

let nftReceiptService: NFTReceiptService | null = null;

export function getNFTReceiptService(): NFTReceiptService {
  if (!nftReceiptService) {
    nftReceiptService = new NFTReceiptService();
  }
  return nftReceiptService;
}


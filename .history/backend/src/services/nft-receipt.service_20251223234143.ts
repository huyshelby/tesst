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
      "function ownerOf(uint256 tokenId) external view returns (address)"
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

    const metadata = {
      name: `Order Receipt #${order.orderNumber}`,
      description: `Digital receipt for order ${order.orderNumber}`,
      image: "ipfs://Qm...", // Placeholder image or logo
      external_url: `https://your-store.com/orders/${order.id}`,
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
          trait_type: "Total Amount",
          value: order.total,
          display_type: "number"
        },
        {
          trait_type: "Status",
          value: order.status
        }
      ],
      properties: {
        order_id: order.id,
        customer_name: order.customerName,
        items: items,
        shipping: {
          address: order.shippingAddress,
          city: order.shippingCity,
          district: order.shippingDistrict,
          ward: order.shippingWard
        }
      }
    };

    return this.uploadToIPFS(metadata);
  }

  async uploadToIPFS(metadata: any): Promise<string> {
    try {
      const response = await axios.post('https://api.web3.storage/upload', metadata, {
        headers: {
          'Authorization': `Bearer ${process.env.WEB3_STORAGE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      return `ipfs://${response.data.cid}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload metadata to IPFS');
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

    const metadataUrl = await this.createReceiptMetadata(order);
    
    const orderHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['string', 'address', 'uint256'],
        [order.orderNumber, order.userId, Math.floor(order.createdAt.getTime() / 1000)]
      )
    );

    const adminWallet = new ethers.Wallet(
      process.env.ADMIN_PRIVATE_KEY || '',
      this.provider
    );

    const contractWithSigner = this.nftContract.connect(adminWallet);
    
    try {
      const tx = await contractWithSigner.safeMint(
        order.userId,
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


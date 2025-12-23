import { ethers } from 'ethers';
import { NFTReceipt__factory } from '../typechain-types';
import { prisma } from '../utils/prisma';
import { Web3Storage } from 'web3.storage';
import { v4 as uuidv4 } from 'uuid';

type MintNFTParams = {
  orderId: string;
  orderNumber: string;
  totalAmount: string;
  paymentMethod: 'CRYPTO';
  transactionHash: string;
  chainId: number;
  userWallet: string;
};

export class BlockchainService {
  private web3Storage: Web3Storage;
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private nftContract: any; // Type from typechain

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL!);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    this.web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN! });
    
    if (process.env.NFT_CONTRACT_ADDRESS) {
      this.nftContract = NFTReceipt__factory.connect(
        process.env.NFT_CONTRACT_ADDRESS,
        this.signer
      );
    }
  }

  async mintOrderReceipt(params: MintNFTParams): Promise<{ tokenId: string; metadataUrl: string }> {
    // 1. Check if NFT already exists for this order
    const existingReceipt = await prisma.nFTReceipt.findUnique({
      where: { orderId: params.orderId },
    });

    if (existingReceipt) {
      return {
        tokenId: existingReceipt.tokenId.toString(),
        metadataUrl: existingReceipt.metadataUrl,
      };
    }

    // 2. Generate metadata
    const metadata = this.generateMetadata({
      orderNumber: params.orderNumber,
      totalAmount: params.totalAmount,
      paymentMethod: params.paymentMethod,
      chainId: params.chainId,
      transactionHash: params.transactionHash,
    });

    // 3. Upload to IPFS
    const metadataUrl = await this.uploadToIPFS(metadata);

    // 4. Generate order hash
    const orderHash = ethers.keccak256(ethers.toUtf8Bytes(params.orderNumber));

    // 5. Mint NFT
    const tx = await this.nftContract.safeMint(
      params.userWallet,
      orderHash,
      metadataUrl
    );

    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'OrderReceiptMinted');
    const tokenId = event?.args?.tokenId.toString();

    if (!tokenId) {
      throw new Error('Failed to get token ID from mint transaction');
    }

    // 6. Store in database
    await prisma.nFTReceipt.create({
      data: {
        tokenId: BigInt(tokenId),
        orderId: params.orderId,
        orderHash: orderHash,
        ownerAddress: params.userWallet,
        contractAddress: this.nftContract.address,
        metadataUrl,
        txHash: params.transactionHash,
        chainId: params.chainId,
      },
    });

    return { tokenId, metadataUrl };
  }

  private generateMetadata(params: {
    orderNumber: string;
    totalAmount: string;
    paymentMethod: string;
    chainId: number;
    transactionHash: string;
  }) {
    return {
      name: `Order Receipt #${params.orderNumber}`,
      description: `NFT Proof of Purchase for Order ${params.orderNumber}`,
      attributes: [
        { trait_type: 'Order Number', value: params.orderNumber },
        { trait_type: 'Total Amount', value: params.totalAmount },
        { trait_type: 'Payment Method', value: params.paymentMethod },
        { trait_type: 'Chain ID', value: params.chainId },
        { trait_type: 'Transaction Hash', value: params.transactionHash },
        { trait_type: 'Timestamp', value: Date.now() },
      ],
      image: 'ipfs://bafybeifx2q2m4q5qj4q5qj4q5qj4q5qj4q5qj4q5qj4q5qj4q5qj4q5qj4/order.png',
      external_url: `${process.env.FRONTEND_URL}/orders/${params.orderNumber}`,
    };
  }

  private async uploadToIPFS(metadata: any): Promise<string> {
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const file = new File([blob], `${uuidv4()}.json`, { type: 'application/json' });
    const cid = await this.web3Storage.put([file]);
    return `ipfs://${cid}/${file.name}`;
  }
}

export const blockchainService = new BlockchainService();

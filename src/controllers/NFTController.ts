import { Request, Response } from 'express';
import { blockchainService } from '../services/BlockchainService';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export class NFTController {
  async mintReceipt(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user!.id;

      // 1. Verify order exists and belongs to user
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
          paymentStatus: 'COMPLETED',
        },
        include: {
          user: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found or not completed' });
      }

      // 2. Check if NFT already exists
      const existingNFT = await prisma.nFTReceipt.findUnique({
        where: { orderId },
      });

      if (existingNFT) {
        return res.json({
          success: true,
          tokenId: existingNFT.tokenId.toString(),
          metadataUrl: existingNFT.metadataUrl,
          alreadyMinted: true,
        });
      }

      // 3. Verify user has wallet address
      if (!order.user.walletAddress) {
        return res.status(400).json({ error: 'User wallet address not set' });
      }

      // 4. Mint NFT
      const result = await blockchainService.mintOrderReceipt({
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount.toString(),
        paymentMethod: 'CRYPTO',
        transactionHash: order.transactionHash!,
        chainId: order.chainId!,
        userWallet: order.user.walletAddress,
      });

      logger.info(`NFT minted for order ${orderId}`, {
        orderId,
        tokenId: result.tokenId,
        userId,
      });

      res.json({
        success: true,
        tokenId: result.tokenId,
        metadataUrl: result.metadataUrl,
        alreadyMinted: false,
      });
    } catch (error) {
      logger.error('Failed to mint NFT receipt', { error, orderId: req.params.orderId });
      res.status(500).json({ error: 'Failed to mint NFT receipt' });
    }
  }

  async getReceipt(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user!.id;

      const receipt = await prisma.nFTReceipt.findFirst({
        where: {
          orderId,
          order: { userId },
        },
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
              createdAt: true,
            },
          },
        },
      });

      if (!receipt) {
        return res.status(404).json({ error: 'NFT receipt not found' });
      }

      res.json({
        success: true,
        receipt: {
          tokenId: receipt.tokenId.toString(),
          metadataUrl: receipt.metadataUrl,
          txHash: receipt.txHash,
          chainId: receipt.chainId,
          mintedAt: receipt.mintedAt,
          contractAddress: receipt.contractAddress,
          order: receipt.order,
        },
      });
    } catch (error) {
      logger.error('Failed to get NFT receipt', { error, orderId: req.params.orderId });
      res.status(500).json({ error: 'Failed to get NFT receipt' });
    }
  }

  async getUserReceipts(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { page = 1, limit = 10 } = req.query;

      const receipts = await prisma.nFTReceipt.findMany({
        where: {
          user: { id: userId },
        },
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
              createdAt: true,
            },
          },
        },
        orderBy: { mintedAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.nFTReceipt.count({
        where: { user: { id: userId } },
      });

      res.json({
        success: true,
        receipts: receipts.map(r => ({
          ...r,
          tokenId: r.tokenId.toString(),
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      logger.error('Failed to get user NFT receipts', { error, userId: req.user!.id });
      res.status(500).json({ error: 'Failed to get NFT receipts' });
    }
  }
}

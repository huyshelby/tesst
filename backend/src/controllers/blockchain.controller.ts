import { Request, Response } from "express";
import { getBlockchainService, getExchangeRateService } from "../services/blockchain";

export class BlockchainController {
  /**
   * Verify blockchain transaction
   * POST /api/blockchain/verify
   */
  static async verifyTransaction(req: Request, res: Response) {
    const { txHash } = req.body;

    if (!txHash) {
      return res.status(400).json({ message: "Transaction hash is required" });
    }

    const blockchainService = getBlockchainService();
    const verification = await blockchainService.verifyTransaction(txHash);

    if (!verification.isValid) {
      return res.status(400).json({
        message: "Transaction verification failed",
        error: verification.error
      });
    }

    res.json({
      message: "Transaction verified successfully",
      data: verification
    });
  }

  /**
   * Get exchange rates
   * GET /api/blockchain/rates
   */
  static async getExchangeRates(req: Request, res: Response) {
    const exchangeRateService = getExchangeRateService();
    const rates = exchangeRateService.getRates();
    const lastUpdate = exchangeRateService.getLastUpdate();

    res.json({
      rates,
      lastUpdate,
      message: "Exchange rates retrieved successfully"
    });
  }

  /**
   * Convert VND to Crypto
   * POST /api/blockchain/convert
   */
  static async convertCurrency(req: Request, res: Response) {
    const { vndAmount, token } = req.body;

    if (!vndAmount || !token) {
      return res.status(400).json({
        message: "VND amount and token are required"
      });
    }

    const exchangeRateService = getExchangeRateService();
    const cryptoAmount = exchangeRateService.convertVNDToCrypto(
      parseFloat(vndAmount),
      token
    );
    const rate = exchangeRateService.getRate(token);

    res.json({
      vndAmount: parseFloat(vndAmount),
      cryptoAmount,
      token,
      rate,
      message: "Conversion successful"
    });
  }

  /**
   * Check if order is processed on blockchain
   * GET /api/blockchain/order/:orderId/status
   */
  static async checkOrderStatus(req: Request, res: Response) {
    const { orderId } = req.params;

    const blockchainService = getBlockchainService();
    const isProcessed = await blockchainService.isOrderProcessed(orderId);

    res.json({
      orderId,
      isProcessed,
      message: isProcessed ? "Order has been processed" : "Order not yet processed"
    });
  }

  /**
   * Get supported tokens
   * GET /api/blockchain/tokens
   */
  static async getSupportedTokens(req: Request, res: Response) {
    const blockchainService = getBlockchainService();
    const tokens = await blockchainService.getSupportedTokens();

    res.json({
      tokens,
      message: "Supported tokens retrieved successfully"
    });
  }

  /**
   * Get current block number
   * GET /api/blockchain/block
   */
  static async getCurrentBlock(req: Request, res: Response) {
    const blockchainService = getBlockchainService();
    const blockNumber = await blockchainService.getCurrentBlock();

    res.json({
      blockNumber,
      network: "BSC Testnet",
      message: "Current block number retrieved successfully"
    });
  }
}

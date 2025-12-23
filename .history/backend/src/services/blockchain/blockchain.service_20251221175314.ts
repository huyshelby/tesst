import { ethers } from "ethers";
import { prisma } from "../../utils/prisma";

// Contract ABI (Application Binary Interface)
const PAYMENT_CONTRACT_ABI = [
  "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)",
  "function payOrderWithToken(string orderId, address token, uint256 amount) external",
  "function payOrderWithNative(string orderId) external payable",
  "function isOrderProcessed(string orderId) external view returns (bool)",
  "function getBalance(address token) external view returns (uint256)",
  "function getSupportedTokens() external view returns (address[])",
  "function getExchangeRate(address token) external view returns (uint256)"
];

// Configuration
const BLOCKCHAIN_ENV = process.env.BLOCKCHAIN_ENV || "local"; // local, testnet, mainnet
const LOCAL_RPC = "http://127.0.0.1:8545";
const LOCAL_WSS = "ws://127.0.0.1:8545";
const BSC_TESTNET_RPC = process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/";
const BSC_TESTNET_WSS = process.env.BSC_TESTNET_WSS || "wss://bsc-testnet.publicnode.com";
const PAYMENT_CONTRACT_ADDRESS = process.env.PAYMENT_CONTRACT_ADDRESS || "";

// Select RPC based on environment
const RPC_URL = BLOCKCHAIN_ENV === "local" ? LOCAL_RPC : BSC_TESTNET_RPC;
const WSS_URL = BLOCKCHAIN_ENV === "local" ? LOCAL_WSS : BSC_TESTNET_WSS;

// Token addresses (BSC Testnet)
const TOKENS = {
  USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  NATIVE: "0x0000000000000000000000000000000000000000" // BNB
};

export class BlockchainService {
  private provider: ethers.providers.WebSocketProvider;
  private contract: ethers.Contract;
  private isListening: boolean = false;

  constructor() {
    // Validate configuration
    if (!PAYMENT_CONTRACT_ADDRESS || PAYMENT_CONTRACT_ADDRESS === "") {
      console.warn("⚠️ PAYMENT_CONTRACT_ADDRESS not configured. Blockchain service will not work.");
      console.warn("⚠️ Please set PAYMENT_CONTRACT_ADDRESS in .env file");
    }

    // Initialize WebSocket provider for real-time events
    this.provider = new ethers.providers.WebSocketProvider(BSC_TESTNET_WSS);

    // Initialize contract instance
    this.contract = new ethers.Contract(
      PAYMENT_CONTRACT_ADDRESS,
      PAYMENT_CONTRACT_ABI,
      this.provider
    );

    console.log("🔗 Blockchain Service initialized");
    console.log[object Object] PAYMENT_CONTRACT_ADDRESS || "NOT CONFIGURED");
    console.log[object Object]C Testnet");
  }

  /**
   * Start listening to blockchain events
   */
  async startListening(): Promise<void> {
    if (this.isListening) {
      console.log("⚠️ Already listening to blockchain events");
      return;
    }

    try {
      console.log("👂 Starting to listen for OrderPaid events...");

      // Listen to OrderPaid events
      this.contract.on(
        "OrderPaid",
        async (orderId, payer, amount, token, paymentMethod, timestamp, event) => {
          console.log("\n🔔 New payment detected!");
          console.log("📦 Order ID:", orderId);
          console.log("👤 Payer:", payer);
          console.log("💰 Amount:", ethers.utils.formatUnits(amount, this.getTokenDecimals(token)));
          console.log("🪙 Token:", this.getTokenSymbol(token));
          console.log("[object Object]xHash:", event.transactionHash);

          // Process payment
          await this.processPayment(orderId, event.transactionHash);
        }
      );

      this.isListening = true;
      console.log("✅ Blockchain event listener started successfully");
    } catch (error) {
      console.error("❌ Failed to start blockchain listener:", error);
      throw error;
    }
  }

  /**
   * Stop listening to blockchain events
   */
  stopListening(): void {
    if (!this.isListening) {
      console.log("⚠️ Not currently listening");
      return;
    }

    this.contract.removeAllListeners("OrderPaid");
    this.isListening = false;
    console.log("🛑 Blockchain event listener stopped");
  }

  /**
   * Verify transaction on blockchain
   */
  async verifyTransaction(txHash: string): Promise<{
    isValid: boolean;
    orderId?: string;
    amount?: string;
    token?: string;
    payer?: string;
    confirmations?: number;
    error?: string;
  }> {
    try {
      console.log("🔍 Verifying transaction:", txHash);

      // Get transaction receipt
      const receipt = await this.provider.getTransactionReceipt(txHash);

      if (!receipt) {
        return { isValid: false, error: "Transaction not found" };
      }

      // Check if transaction succeeded
      if (receipt.status !== 1) {
        return { isValid: false, error: "Transaction failed" };
      }

      // Get confirmations
      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      console.log("📊 Confirmations:", confirmations);

      // Require minimum confirmations (3 for testnet, 12+ for mainnet)
      const MIN_CONFIRMATIONS = 3;
      if (confirmations < MIN_CONFIRMATIONS) {
        return {
          isValid: false,
          confirmations,
          error: `Not enough confirmations: ${confirmations}/${MIN_CONFIRMATIONS}`
        };
      }

      // Parse event logs
      const iface = new ethers.utils.Interface(PAYMENT_CONTRACT_ABI);
      const log = receipt.logs.find(
        (log) => log.address.toLowerCase() === PAYMENT_CONTRACT_ADDRESS.toLowerCase()
      );

      if (!log) {
        return { isValid: false, error: "OrderPaid event not found in transaction" };
      }

      const parsedLog = iface.parseLog(log);

      return {
        isValid: true,
        orderId: parsedLog.args.orderId,
        amount: ethers.utils.formatUnits(
          parsedLog.args.amount,
          this.getTokenDecimals(parsedLog.args.token)
        ),
        token: this.getTokenSymbol(parsedLog.args.token),
        payer: parsedLog.args.payer,
        confirmations
      };
    } catch (error: any) {
      console.error("❌ Transaction verification failed:", error);
      return { isValid: false, error: error.message };
    }
  }

  /**
   * Process payment after verification
   */
  private async processPayment(orderId: string, txHash: string): Promise<void> {
    try {
      console.log("⚙️ Processing payment for order:", orderId);

      // Verify transaction
      const verification = await this.verifyTransaction(txHash);

      if (!verification.isValid) {
        console.error("❌ Payment verification failed:", verification.error);
        return;
      }

      // Check if transaction already processed (prevent double-spending)
      const existingOrder = await prisma.order.findFirst({
        where: { cryptoTxHash: txHash }
      });

      if (existingOrder && existingOrder.id !== orderId) {
        console.error("❌ Transaction already used for another order");
        return;
      }

      // Get order from database
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        console.error("❌ Order not found:", orderId);
        return;
      }

      // Verify amount matches
      const expectedAmount = this.calculateCryptoAmount(order.total, verification.token!);
      const paidAmount = parseFloat(verification.amount!);

      if (paidAmount < expectedAmount * 0.99) { // Allow 1% tolerance
        console.error("❌ Insufficient payment amount");
        console.error("Expected:", expectedAmount, verification.token);
        console.error("Received:", paidAmount, verification.token);
        return;
      }

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "COMPLETED",
          status: "CONFIRMED",
          cryptoTxHash: txHash,
          cryptoAmount: parseFloat(verification.amount!),
          cryptoVerifiedAt: new Date(),
          cryptoConfirmations: verification.confirmations
        }
      });

      console.log("✅ Payment processed successfully!");
      console.log("📦 Order:", orderId);
      console.log("💰 Amount:", verification.amount, verification.token);
      console.log("🔗 TxHash:", txHash);
      console.log("✅ Confirmations:", verification.confirmations);

      // TODO: Trigger next steps
      // - Send email confirmation
      // - Notify warehouse
      // - Update inventory
      // - Send webhook to shipping service
    } catch (error) {
      console.error("❌ Failed to process payment:", error);
    }
  }

  /**
   * Calculate crypto amount from VND
   */
  private calculateCryptoAmount(vndAmount: number, token: string): number {
    const rates: { [key: string]: number } = {
      USDT: 25000, // 1 USDT = 25,000 VND
      USDC: 25000, // 1 USDC = 25,000 VND
      BNB: 15000000, // 1 BNB = 15,000,000 VND
      ETH: 85000000 // 1 ETH = 85,000,000 VND
    };

    const rate = rates[token] || 25000;
    return vndAmount / rate;
  }

  /**
   * Get token decimals
   */
  private getTokenDecimals(tokenAddress: string): number {
    const decimals: { [key: string]: number } = {
      [TOKENS.USDT.toLowerCase()]: 6,
      [TOKENS.USDC.toLowerCase()]: 6,
      [TOKENS.NATIVE.toLowerCase()]: 18
    };

    return decimals[tokenAddress.toLowerCase()] || 18;
  }

  /**
   * Get token symbol
   */
  private getTokenSymbol(tokenAddress: string): string {
    const symbols: { [key: string]: string } = {
      [TOKENS.USDT.toLowerCase()]: "USDT",
      [TOKENS.USDC.toLowerCase()]: "USDC",
      [TOKENS.NATIVE.toLowerCase()]: "BNB"
    };

    return symbols[tokenAddress.toLowerCase()] || "UNKNOWN";
  }

  /**
   * Get current block number
   */
  async getCurrentBlock(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Check if order is processed on blockchain
   */
  async isOrderProcessed(orderId: string): Promise<boolean> {
    try {
      return await this.contract.isOrderProcessed(orderId);
    } catch (error) {
      console.error("Failed to check order status:", error);
      return false;
    }
  }

  /**
   * Get supported tokens
   */
  async getSupportedTokens(): Promise<string[]> {
    try {
      return await this.contract.getSupportedTokens();
    } catch (error) {
      console.error("Failed to get supported tokens:", error);
      return [];
    }
  }

  /**
   * Cleanup on shutdown
   */
  async cleanup(): Promise<void> {
    this.stopListening();
    await this.provider.destroy();
    console.log("🧹 Blockchain service cleaned up");
  }
}

// Singleton instance
let blockchainService: BlockchainService | null = null;

export function getBlockchainService(): BlockchainService {
  if (!blockchainService) {
    blockchainService = new BlockchainService();
  }
  return blockchainService;
}

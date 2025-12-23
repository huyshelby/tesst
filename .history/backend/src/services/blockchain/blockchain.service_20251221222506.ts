import { ethers } from "ethers";
import { prisma } from "../../utils/prisma";

// Contract ABI
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
const BLOCKCHAIN_ENV = process.env.BLOCKCHAIN_ENV || "local";
const LOCAL_RPC = "http://127.0.0.1:8545";
const LOCAL_WSS = "ws://127.0.0.1:8545";
const BSC_TESTNET_RPC = process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/";
const BSC_TESTNET_WSS = process.env.BSC_TESTNET_WSS || "wss://bsc-testnet.publicnode.com";
const PAYMENT_CONTRACT_ADDRESS = process.env.PAYMENT_CONTRACT_ADDRESS || "";

const RPC_URL = BLOCKCHAIN_ENV === "local" ? LOCAL_RPC : BSC_TESTNET_RPC;
const WSS_URL = BLOCKCHAIN_ENV === "local" ? LOCAL_WSS : BSC_TESTNET_WSS;

const TOKENS = {
  USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  NATIVE: "0x0000000000000000000000000000000000000000"
};

export class BlockchainService {
  private provider: ethers.providers.WebSocketProvider;
  private contract: ethers.Contract;
  private isListening: boolean = false;
  private networkName = "";

  constructor() {
    if (!PAYMENT_CONTRACT_ADDRESS) {
      console.warn("⚠️ PAYMENT_CONTRACT_ADDRESS not configured");
    }

    console.log(`🌐 Blockchain Environment: ${BLOCKCHAIN_ENV}`);
    console.log(`📡 RPC URL: ${RPC_URL}`);
    console.log(`🔗 WSS URL: ${WSS_URL}`);

    this.provider = new ethers.providers.WebSocketProvider(WSS_URL);
    this.contract = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ABI, this.provider);
    this.setNetworkName();

    console.log("🔗 Blockchain Service initialized");
    console.log("📍 Contract Address:", PAYMENT_CONTRACT_ADDRESS || "NOT CONFIGURED");
    console.log(`🌐 Network: ${BLOCKCHAIN_ENV === "local" ? "Hardhat Local" : "BSC Testnet"}`);
  }

  async startListening(): Promise<void> {
    if (this.isListening) return;

    try {
      console.log("👂 Starting to listen for OrderPaid events...");

      this.contract.on("OrderPaid", async (orderId: string, payer: string, amount: any, token: string, paymentMethod: string, timestamp: any, event: any) => {
        console.log("\n🔔 New payment detected!");
        console.log("📦 Order ID:", orderId);
        console.log("👤 Payer:", payer);
        console.log("[object Object]:", ethers.utils.formatUnits(amount, this.getTokenDecimals(token)));
        console.log("🪙 Token:", this.getTokenSymbol(token));
        console.log("🔗 TxHash:", event.transactionHash);

        await this.processPayment(orderId, event.transactionHash);
      });

      this.isListening = true;
      console.log("✅ Blockchain event listener started successfully");
    } catch (error) {
      console.error("❌ Failed to start blockchain listener:", error);
      throw error;
    }
  }

  stopListening(): void {
    this.contract.removeAllListeners("OrderPaid");
    this.isListening = false;
  }

  private async setNetworkName() {
    const network = await this.provider.getNetwork();
    switch (network.chainId) {
      case 31337:
        this.networkName = "Hardhat Local";
        break;
      case 97:
        this.networkName = "BSC Testnet";
        break;
      case 56:
        this.networkName = "BSC Mainnet";
        break;
      default:
        this.networkName = `Unknown (${network.chainId})`;
    }
    console.log(`🌐 Network: ${this.networkName}`);
  }

  async verifyTransaction(txHash: string, retries = 5, delay = 1000): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const receipt = await this.provider.getTransactionReceipt(txHash);

        if (receipt && receipt.status === 1) {
          const currentBlock = await this.provider.getBlockNumber();
          const confirmations = currentBlock - receipt.blockNumber;
          const requiredConfirmations = this.networkName === "Hardhat Local" ? 0 : 1;

          if (confirmations < requiredConfirmations) {
            console.log(`[VerifyTX] Not enough confirmations (${confirmations}/${requiredConfirmations}). Retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          const iface = new ethers.utils.Interface(PAYMENT_CONTRACT_ABI);
          const log = receipt.logs.find((log: any) => log.address.toLowerCase() === PAYMENT_CONTRACT_ADDRESS.toLowerCase());

          if (!log) {
            return { isValid: false, error: "OrderPaid event not found" };
          }

          const parsedLog = iface.parseLog(log);

          return {
            isValid: true,
            orderId: parsedLog.args.orderId,
            amount: ethers.utils.formatUnits(parsedLog.args.amount, this.getTokenDecimals(parsedLog.args.token)),
            token: this.getTokenSymbol(parsedLog.args.token),
            payer: parsedLog.args.payer,
            confirmations
          };
        }

        console.log(`[VerifyTX] Attempt ${i + 1}/${retries} failed (receipt not found or status != 1). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));

      } catch (error: any) {
        console.error(`[VerifyTX] Error on attempt ${i + 1}:`, error.message);
        if (i === retries - 1) {
          return { isValid: false, error: "Verification failed after multiple retries" };
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return { isValid: false, error: "Transaction not found or failed after multiple retries" };
  }

  public async processPayment(orderId: string, txHash: string): Promise<any> {
    try {
      const verification = await this.verifyTransaction(txHash);
      if (!verification.isValid) {
        throw new Error("Transaction verification failed");
      }

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) {
        throw new Error("Order not found");
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "COMPLETED",
          status: "CONFIRMED",
          cryptoTxHash: txHash,
          cryptoAmount: parseFloat(verification.amount!),
          cryptoVerifiedAt: new Date(),
          cryptoConfirmations: verification.confirmations,
        },
      });

      console.log("✅ Payment processed successfully!");
      return updatedOrder;
    } catch (error) {
      console.error("❌ Failed to process payment:", error);
      throw error;
    }
  }

  private getTokenDecimals(tokenAddress: string): number {
    const decimals: any = {
      [TOKENS.USDT.toLowerCase()]: 6,
      [TOKENS.USDC.toLowerCase()]: 6,
      [TOKENS.NATIVE.toLowerCase()]: 18
    };
    return decimals[tokenAddress.toLowerCase()] || 18;
  }

  private getTokenSymbol(tokenAddress: string): string {
    const symbols: any = {
      [TOKENS.USDT.toLowerCase()]: "USDT",
      [TOKENS.USDC.toLowerCase()]: "USDC",
      [TOKENS.NATIVE.toLowerCase()]: "ETH"
    };
    return symbols[tokenAddress.toLowerCase()] || "UNKNOWN";
  }

  async getCurrentBlock(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async isOrderProcessed(orderId: string): Promise<boolean> {
    try {
      return await this.contract.isOrderProcessed(orderId);
    } catch (error) {
      return false;
    }
  }

  async getSupportedTokens(): Promise<string[]> {
    try {
      return await this.contract.getSupportedTokens();
    } catch (error) {
      return [];
    }
  }

  async cleanup(): Promise<void> {
    this.stopListening();
    await this.provider.destroy();
  }
}

let blockchainService: BlockchainService | null = null;

export function getBlockchainService(): BlockchainService {
  if (!blockchainService) {
    blockchainService = new BlockchainService();
  }
  return blockchainService;
}
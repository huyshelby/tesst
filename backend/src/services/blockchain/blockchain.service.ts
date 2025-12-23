import { ethers } from "ethers";
import { prisma } from "../../utils/prisma";

// Contract ABI


// Configuration
const BLOCKCHAIN_ENV = process.env.BLOCKCHAIN_ENV || "local";
const LOCAL_RPC = "http://127.0.0.1:8545";
const LOCAL_WSS = "ws://127.0.0.1:8545";
const BSC_TESTNET_RPC = process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/";
const BSC_TESTNET_WSS = process.env.BSC_TESTNET_WSS || "wss://bsc-testnet.publicnode.com";


const RPC_URL = BLOCKCHAIN_ENV === "local" ? LOCAL_RPC : BSC_TESTNET_RPC;
const WSS_URL = BLOCKCHAIN_ENV === "local" ? LOCAL_WSS : BSC_TESTNET_WSS;

const TOKENS = {
  USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  NATIVE: "0x0000000000000000000000000000000000000000"
};

export class BlockchainService {
  private readonly PAYMENT_CONTRACT_ADDRESS: string;
  private readonly PAYMENT_CONTRACT_ABI: string[];

  private provider: ethers.providers.WebSocketProvider;
  private contract: ethers.Contract;
  private isListening: boolean = false;
  private networkName = "";

  constructor() {
    this.PAYMENT_CONTRACT_ADDRESS = process.env.PAYMENT_CONTRACT_ADDRESS || "";
    this.PAYMENT_CONTRACT_ABI = [
      "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)",
      "function payOrderWithToken(string orderId, address token, uint256 amount) external",
      "function payOrderWithNative(string orderId) external payable",
      "function isOrderProcessed(string orderId) external view returns (bool)",
      "function getBalance(address token) external view returns (uint256)",
      "function getSupportedTokens() external view returns (address[])",
      "function getExchangeRate(address token) external view returns (uint256)"
    ];

    if (!this.PAYMENT_CONTRACT_ADDRESS) {
      console.warn("⚠️ PAYMENT_CONTRACT_ADDRESS not configured");
    }

    console.log(`🌐 Blockchain Environment: ${BLOCKCHAIN_ENV}`);
    console.log(`📡 RPC URL: ${RPC_URL}`);
    console.log(`🔗 WSS URL: ${WSS_URL}`);

    this.provider = new ethers.providers.WebSocketProvider(WSS_URL);
    this.contract = new ethers.Contract(this.PAYMENT_CONTRACT_ADDRESS, this.PAYMENT_CONTRACT_ABI, this.provider);
    this.setNetworkName();

    console.log("🔗 Blockchain Service initialized");
    console.log("📍 Contract Address:", this.PAYMENT_CONTRACT_ADDRESS || "NOT CONFIGURED");
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

        // Extract orderId from transaction input (because indexed string is hashed in event)
        try {
          const tx = await this.provider.getTransaction(event.transactionHash);
          const iface = new ethers.utils.Interface(this.PAYMENT_CONTRACT_ABI);
          const decoded = iface.parseTransaction({ data: tx.data, value: tx.value });
          const actualOrderId = decoded.args[0]; // Get orderId string from function call

          await this.processPayment(actualOrderId, event.transactionHash);
        } catch (error: any) {
          console.error("❌ Failed to extract orderId from transaction:", error.message);
        }
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
    console.log(`[VerifyTX] Starting verification for txHash: ${txHash}`);

    for (let i = 0; i < retries; i++) {
      try {
        // Get both receipt and transaction
        const receipt = await this.provider.getTransactionReceipt(txHash);
        const tx = await this.provider.getTransaction(txHash);

        if (receipt) {
          const currentBlock = await this.provider.getBlockNumber();
          const confirmations = currentBlock - receipt.blockNumber;
          const requiredConfirmations = this.networkName === "Hardhat Local" ? 0 : 1;

          console.log(`[VerifyTX] Receipt found. Block: ${receipt.blockNumber}, Current: ${currentBlock}, Confirmations: ${confirmations}/${requiredConfirmations}, Status: ${receipt.status}`);

          // Check if transaction failed
          if (receipt.status === 0) {
            console.error(`[VerifyTX] ❌ Transaction failed (reverted)`);
            return {
              isValid: false,
              error: "Transaction failed (reverted). The payment was not processed. Please check your wallet balance and try again."
            };
          }

          if (confirmations < requiredConfirmations) {
            console.log(`[VerifyTX] Not enough confirmations (${confirmations}/${requiredConfirmations}). Retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          const iface = new ethers.utils.Interface(this.PAYMENT_CONTRACT_ABI);
          console.log(`[VerifyTX] Looking for OrderPaid event from contract: ${this.PAYMENT_CONTRACT_ADDRESS}`);
          console.log(`[VerifyTX] Transaction logs count: ${receipt.logs.length}`);
          console.log(`[VerifyTX] Transaction to: ${tx.to}`);
          console.log(`[VerifyTX] Transaction value: ${ethers.utils.formatEther(tx.value)} ETH/BNB`);

          // Check if transaction has any logs
          if (receipt.logs.length === 0) {
            console.warn(`[VerifyTX] ⚠️ Transaction has no logs. Checking if it's a direct transfer to payment contract...`);
            
            // Check if this is a simple transfer to the payment contract
            if (tx.to?.toLowerCase() === this.PAYMENT_CONTRACT_ADDRESS.toLowerCase() && tx.value.gt(0)) {
              console.log(`[VerifyTX] ✅ Detected direct native transfer to payment contract`);
              console.log(`[VerifyTX] ⚠️ WARNING: This transaction didn't emit OrderPaid event. Order ID cannot be verified from blockchain.`);
              
              // Return validation with warning - allow manual processing
              return {
                isValid: true,
                isDirectTransfer: true,
                orderId: undefined, // Cannot extract orderId from simple transfer
                amount: ethers.utils.formatEther(tx.value),
                token: 'ETH/BNB',
                payer: tx.from,
                confirmations,
                warning: "This is a direct transfer without OrderPaid event. Please manually verify the order ID matches."
              };
            }
            
            console.error(`[VerifyTX] ❌ Transaction has no logs and is not a valid payment.`);
            return {
              isValid: false,
              error: `Invalid payment transaction. Expected: Contract call to ${this.PAYMENT_CONTRACT_ADDRESS} (payOrderWithNative/payOrderWithToken). Received: ${tx.to ? `Transfer to ${tx.to}` : 'Contract creation'}. Please use the payment contract functions, not simple transfers.`
            };
          }

          const log = receipt.logs.find((log: any) => log.address.toLowerCase() === this.PAYMENT_CONTRACT_ADDRESS.toLowerCase());

          if (!log) {
            console.error(`[VerifyTX] OrderPaid event not found. Expected contract: ${this.PAYMENT_CONTRACT_ADDRESS}`);
            console.error(`[VerifyTX] Available log addresses:`, receipt.logs.map((l: any) => l.address));
            console.error(`[VerifyTX] Transaction recipient: ${tx.to}`);

            // More detailed error message
            const wrongContract = receipt.logs.length > 0 ? receipt.logs[0].address : tx.to || "unknown";
            return {
              isValid: false,
              error: `OrderPaid event not found. Your transaction interacted with ${wrongContract}, but the payment contract is ${this.PAYMENT_CONTRACT_ADDRESS}. Please ensure you're calling the correct contract address.`
            };
          }

          const parsedLog = iface.parseLog(log);
          console.log(`[VerifyTX] Event parsed. Raw args:`, parsedLog.args);

          // Extract orderId from transaction input data
          let orderId: string | undefined;
          try {
            const contractInterface = new ethers.utils.Interface(this.PAYMENT_CONTRACT_ABI);
            const decodedInput = contractInterface.parseTransaction({ data: tx.data, value: tx.value });
            orderId = decodedInput.args[0];
            console.log(`[VerifyTX] Extracted orderId from tx input: ${orderId}`);
          } catch (decodeError: any) {
            console.error(`[VerifyTX] Failed to decode transaction input:`, decodeError.message);
          }

          // Extract indexed arguments from topics
          // topics[0] is the event signature hash
          // topics[1] is the first indexed arg (orderId hash)
          // topics[2] is the second indexed arg (payer)
          // topics[3] is the third indexed arg (token)
          const payer = ethers.utils.getAddress(ethers.utils.hexDataSlice(log.topics[2], 12));
          const token = ethers.utils.getAddress(ethers.utils.hexDataSlice(log.topics[3], 12));
          console.log(`[VerifyTX] Extracted from topics - Payer: ${payer}, Token: ${token}`);

          // Extract non-indexed arguments from parsedLog.args
          // parsedLog.args is an array where indexed args are replaced with Indexed objects
          // Non-indexed args come after indexed ones
          // Event: OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)
          // Indexed: orderId (0), payer (1), token (3) - these are in topics
          // Non-indexed: amount (2), paymentMethod (4), timestamp (5) - these are in data

          // Find amount in args - it should be the first BigNumber after indexed args
          let amount;
          for (const arg of parsedLog.args) {
            if (arg && arg._isBigNumber) {
              amount = arg;
              break;
            }
          }

          console.log(`[VerifyTX] Extracted amount:`, amount?.toString());

          // Validate all extracted data
          if (!orderId) {
            return { isValid: false, error: "OrderId could not be extracted from transaction." };
          }
          if (!token) {
            return { isValid: false, error: "Token address is missing in the OrderPaid event." };
          }
          if (!amount || !amount._isBigNumber) {
            return { isValid: false, error: "Amount is missing in the OrderPaid event." };
          }

          console.log(`[VerifyTX] ✅ Event validated. OrderId: ${orderId}`);

          return {
            isValid: true,
            orderId: orderId,
            amount: ethers.utils.formatUnits(amount, this.getTokenDecimals(token)),
            token: this.getTokenSymbol(token),
            payer: payer,
            confirmations
          };
        }

        console.log(`[VerifyTX] Attempt ${i + 1}/${retries} failed (receipt not found). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));

      } catch (error: any) {
        console.error(`[VerifyTX] Error on attempt ${i + 1}:`, error.message);
        if (i === retries - 1) {
          return { isValid: false, error: `Verification failed after ${retries} retries: ${error.message}` };
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return { isValid: false, error: `Transaction not found after ${retries} retries. Please ensure the transaction was mined.` };
  }

  public async processPayment(orderId: string, txHash: string): Promise<any> {
    try {
      console.log(`[ProcessPayment] Starting verification for order ${orderId}, txHash: ${txHash}`);

      const verification = await this.verifyTransaction(txHash);

      if (!verification.isValid) {
        const errorMsg = verification.error || "Unknown verification error";
        console.error(`[ProcessPayment] Verification failed: ${errorMsg}`);
        throw new Error(`Transaction verification failed: ${errorMsg}`);
      }

      // Handle direct transfer warning
      if (verification.isDirectTransfer) {
        console.warn(`[ProcessPayment] ⚠️ Direct transfer detected: ${verification.warning}`);
        console.warn(`[ProcessPayment] Provided orderId: ${orderId}`);
        console.warn(`[ProcessPayment] Transaction cannot verify orderId from blockchain - manual verification required`);
      }

      // If verification extracted an orderId from event, validate it matches
      if (verification.orderId && verification.orderId !== orderId) {
        console.error(`[ProcessPayment] Order ID mismatch! Provided: ${orderId}, From blockchain: ${verification.orderId}`);
        throw new Error(`Order ID mismatch. The transaction was for order ${verification.orderId}, but you're trying to apply it to ${orderId}`);
      }

      console.log(`[ProcessPayment] Verification successful. Looking up order ${orderId}...`);

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) {
        console.error(`[ProcessPayment] Order ${orderId} not found in database`);
        throw new Error("Order not found");
      }

      console.log(`[ProcessPayment] Updating order ${orderId} with payment details...`);

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

      console.log(`✅ Payment processed successfully for order ${orderId}!`);
      if (verification.isDirectTransfer) {
        console.warn(`⚠️ Note: This was a direct transfer. Please verify the amount matches the order total.`);
      }
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
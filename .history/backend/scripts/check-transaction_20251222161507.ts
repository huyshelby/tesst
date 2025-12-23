import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const PAYMENT_ABI = [
  "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)",
  "function payOrderWithToken(string orderId, address token, uint256 amount) external",
  "function payOrderWithNative(string orderId) external payable",
];

async function checkTransaction(txHash: string) {
  console.log("🔍 Checking transaction:", txHash);
  console.log("━".repeat(80));

  const BLOCKCHAIN_ENV = process.env.BLOCKCHAIN_ENV || "local";
  const RPC_URL = BLOCKCHAIN_ENV === "local" 
    ? "http://127.0.0.1:8545" 
    : process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/";
  
  const PAYMENT_CONTRACT_ADDRESS = process.env.PAYMENT_CONTRACT_ADDRESS || "";

  if (!PAYMENT_CONTRACT_ADDRESS) {
    console.error("❌ PAYMENT_CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  console.log("📡 Connected to:", RPC_URL);
  console.log("📍 Payment Contract:", PAYMENT_CONTRACT_ADDRESS);
  console.log();

  try {
    // Get transaction
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      console.error("❌ Transaction not found");
      process.exit(1);
    }

    console.log("📤 Transaction Details:");
    console.log("  From:", tx.from);
    console.log("  To:", tx.to || "(Contract Creation)");
    console.log("  Value:", ethers.utils.formatEther(tx.value), "ETH/BNB");
    console.log("  Gas Price:", ethers.utils.formatUnits(tx.gasPrice || 0, "gwei"), "gwei");
    console.log("  Nonce:", tx.nonce);
    console.log("  Block:", tx.blockNumber || "Pending");
    console.log();

    // Get receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      console.warn("⚠️ Transaction not mined yet");
      process.exit(0);
    }

    console.log("📥 Transaction Receipt:");
    console.log("  Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
    console.log("  Block:", receipt.blockNumber);
    console.log("  Gas Used:", receipt.gasUsed.toString());
    console.log("  Logs:", receipt.logs.length);
    console.log();

    if (receipt.status === 0) {
      console.error("❌ Transaction FAILED (reverted)");
      console.error("The transaction was mined but execution failed.");
      console.error("This could be due to:");
      console.error("  - Insufficient token balance");
      console.error("  - Token not approved");
      console.error("  - Order already processed");
      console.error("  - Contract paused");
      process.exit(1);
    }

    // Check if this is a contract call or simple transfer
    if (receipt.logs.length === 0) {
      console.log("⚠️ NO LOGS DETECTED");
      console.log();
      
      if (tx.to?.toLowerCase() === PAYMENT_CONTRACT_ADDRESS.toLowerCase()) {
        console.log("🔍 Analysis: DIRECT TRANSFER to Payment Contract");
        console.log();
        console.log("❌ This is a SIMPLE TRANSFER, not a contract function call!");
        console.log();
        console.log("What happened:");
        console.log("  - You sent", ethers.utils.formatEther(tx.value), "ETH/BNB directly to the contract");
        console.log("  - The contract's receive() function accepted the funds");
        console.log("  - BUT: No OrderPaid event was emitted");
        console.log("  - Result: Funds received but NOT linked to any order");
        console.log();
        console.log("✅ Correct way to pay:");
        console.log("  const contract = new ethers.Contract(address, abi, signer);");
        console.log("  await contract.payOrderWithNative(orderId, { value: amount });");
        console.log();
        console.log("⚠️ What to do now:");
        console.log("  1. The funds are in the contract");
        console.log("  2. Backend cannot auto-process this payment");
        console.log("  3. Admin needs to manually verify and update order");
        console.log("  4. Or: Owner can withdraw and user pays again correctly");
      } else {
        console.log("🔍 Analysis: SIMPLE TRANSFER to another address");
        console.log();
        console.log("❌ This transaction is NOT related to the payment contract!");
        console.log("  - Sent to:", tx.to);
        console.log("  - Payment Contract:", PAYMENT_CONTRACT_ADDRESS);
        console.log();
        console.log("You sent funds to the WRONG address.");
      }
      
      process.exit(1);
    }

    // Decode logs
    console.log("📋 Transaction Logs:");
    const iface = new ethers.utils.Interface(PAYMENT_ABI);
    let foundOrderPaidEvent = false;

    for (let i = 0; i < receipt.logs.length; i++) {
      const log = receipt.logs[i];
      console.log(`\nLog #${i}:`);
      console.log("  Address:", log.address);
      console.log("  Topics:", log.topics.length);

      if (log.address.toLowerCase() === PAYMENT_CONTRACT_ADDRESS.toLowerCase()) {
        try {
          const parsed = iface.parseLog(log);
          console.log("  Event:", parsed.name);
          
          if (parsed.name === "OrderPaid") {
            foundOrderPaidEvent = true;
            console.log();
            console.log("🎉 OrderPaid Event Found!");
            console.log("━".repeat(80));
            
            // Extract payer and token from topics
            const payer = ethers.utils.getAddress(ethers.utils.hexDataSlice(log.topics[2], 12));
            const token = ethers.utils.getAddress(ethers.utils.hexDataSlice(log.topics[3], 12));
            
            // Find amount in args
            let amount;
            for (const arg of parsed.args) {
              if (arg && arg._isBigNumber) {
                amount = arg;
                break;
              }
            }

            // Decode transaction input to get orderId
            let orderId = "N/A";
            try {
              const decodedInput = iface.parseTransaction({ data: tx.data, value: tx.value });
              orderId = decodedInput.args[0];
            } catch (e) {
              console.log("  ⚠️ Could not decode orderId from input");
            }

            console.log("📦 Order ID:", orderId);
            console.log("👤 Payer:", payer);
            console.log("💰 Amount:", amount ? ethers.utils.formatUnits(amount, token === "0x0000000000000000000000000000000000000000" ? 18 : 6) : "N/A");
            console.log("🪙 Token:", token);
            console.log("📅 Timestamp:", parsed.args.timestamp?.toString());
            console.log();
            console.log("✅ This is a VALID payment transaction!");
            console.log("✅ Backend should be able to process this automatically.");
          }
        } catch (e) {
          console.log("  ⚠️ Could not decode log (might be from different contract)");
        }
      } else {
        console.log("  ℹ️ Log from different contract (skipped)");
      }
    }

    console.log();
    console.log("━".repeat(80));
    
    if (foundOrderPaidEvent) {
      console.log("✅ SUMMARY: Valid payment transaction with OrderPaid event");
      console.log("Backend can process this using the transaction hash.");
    } else {
      console.log("❌ SUMMARY: No OrderPaid event found");
      console.log("This transaction cannot be automatically processed by backend.");
      console.log("Please ensure you called payOrderWithNative() or payOrderWithToken().");
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Get txHash from command line
const txHash = process.argv[2];

if (!txHash) {
  console.error("Usage: npm run check-transaction -- <txHash>");
  console.error("Example: npm run check-transaction -- 0x123...");
  process.exit(1);
}

checkTransaction(txHash);
        console.log("   But no events were emitted. Check contract logic.");
      }
    } else {
      console.log("📋 Logs:");
      receipt.logs.forEach((log, i) => {
        console.log(`  Log ${i + 1}:`);
        console.log(`    Address: ${log.address}`);
        console.log(`    Topics: ${log.topics.length}`);
        log.topics.forEach((topic, j) => {
          console.log(`      Topic ${j}: ${topic}`);
        });
        console.log(`    Data: ${log.data}`);
      });
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

checkTransaction();


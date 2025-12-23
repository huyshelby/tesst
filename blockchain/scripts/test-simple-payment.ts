import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const [signer] = await ethers.getSigners();

  console.log("=== Testing Payment Transaction ===");
  console.log("Payer:", signer.address);
  console.log("Contract:", contractAddress);

  const PaymentContract = await ethers.getContractFactory("PaymentContract");
  const contract = PaymentContract.attach(contractAddress);

  const timestamp = Date.now();
  const orderId = "TEST-" + timestamp.toString();
  const amount = ethers.parseEther("0.01");

  console.log("\n=== Payment Details ===");
  console.log("Order ID:", orderId);
  console.log("Amount:", ethers.formatEther(amount), "ETH");

  const isProcessed = await contract.isOrderProcessed(orderId);
  console.log("Already processed?", isProcessed);

  if (isProcessed) {
    console.log("ERROR: Order already processed");
    return;
  }

  const recipientWallet = await contract.recipientWallet();
  const recipientBefore = await ethers.provider.getBalance(recipientWallet);
  console.log("Recipient wallet:", recipientWallet);
  console.log("Balance before:", ethers.formatEther(recipientBefore), "ETH");

  console.log("\n=== Sending Transaction ===");
  const tx = await contract.payOrderWithNative(orderId, {
    value: amount,
    gasLimit: 200000
  });

  console.log("TX Hash:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();

  console.log("\n=== Transaction Confirmed ===");
  console.log("Block Number:", receipt.blockNumber);
  console.log("Gas Used:", receipt.gasUsed.toString());
  console.log("Status:", receipt.status === 1 ? "SUCCESS" : "FAILED");

  const recipientAfter = await ethers.provider.getBalance(recipientWallet);
  const difference = recipientAfter - recipientBefore;
  
  console.log("\n=== Balance Changes ===");
  console.log("Balance after:", ethers.formatEther(recipientAfter), "ETH");
  console.log("Difference:", ethers.formatEther(difference), "ETH");

  const iface = contract.interface;
  const logs = receipt.logs.filter(
    (log: any) => log.address.toLowerCase() === contractAddress.toLowerCase()
  );
  
  if (logs.length > 0) {
    const parsedEvent = iface.parseLog(logs[0]);
    console.log("\n=== Event Emitted ===");
    console.log("Order ID:", parsedEvent.args.orderId);
    console.log("Payer:", parsedEvent.args.payer);
    console.log("Amount:", ethers.formatEther(parsedEvent.args.amount), "ETH");
    console.log("Token:", parsedEvent.args.token);
    console.log("Method:", parsedEvent.args.paymentMethod);
    console.log("Timestamp:", parsedEvent.args.timestamp.toString());
  } else {
    console.log("\nWARNING: No event found in logs");
  }

  const isProcessedAfter = await contract.isOrderProcessed(orderId);
  console.log("\n=== Verification ===");
  console.log("Order processed?", isProcessedAfter);

  if (isProcessedAfter && difference > 0n) {
    console.log("\n=== TEST PASSED ===");
    console.log("Payment transaction successful!");
    console.log("Order marked as processed on blockchain");
    console.log("Recipient received", ethers.formatEther(difference), "ETH");
  } else {
    console.log("\n=== TEST FAILED ===");
    console.log("Something went wrong");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n=== TEST FAILED ===");
    console.error("Error:", error.message);
    if (error.reason) console.error("Reason:", error.reason);
    process.exit(1);
  });


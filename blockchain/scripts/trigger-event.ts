import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const [signer] = await ethers.getSigners();

  console.log("=== Triggering Payment Event ===\n");
  console.log("Contract:", contractAddress);
  console.log("Signer:", signer.address);

  const PaymentContract = await ethers.getContractFactory("PaymentContract");
  const contract = PaymentContract.attach(contractAddress);

  const orderId = `EVENT-TEST-${Date.now()}`;
  const amount = ethers.parseEther("0.01");

  console.log("\nSending payment...");
  console.log("Order ID:", orderId);
  console.log("Amount:", ethers.formatEther(amount), "ETH");

  const tx = await contract.payOrderWithNative(orderId, {
    value: amount,
    gasLimit: 200000
  });

  console.log("\nTX Hash:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();

  console.log("\n✅ Transaction confirmed!");
  console.log("Block:", receipt.blockNumber);
  console.log("Logs count:", receipt.logs.length);

  if (receipt.logs.length > 0) {
    console.log("\n🎉 Events emitted:");
    receipt.logs.forEach((log, i) => {
      console.log(`\nLog ${i}:`);
      console.log("  Address:", log.address);
      console.log("  Topics:", log.topics);
      console.log("  Data:", log.data);
    });

    // Parse event
    const iface = contract.interface;
    const parsedEvent = iface.parseLog(receipt.logs[0]);
    
    console.log("\n📋 Parsed Event:");
    console.log("  Name:", parsedEvent.name);
    console.log("  Order ID:", parsedEvent.args.orderId);
    console.log("  Payer:", parsedEvent.args.payer);
    console.log("  Amount:", ethers.formatEther(parsedEvent.args.amount), "ETH");
    console.log("  Token:", parsedEvent.args.token);
    console.log("  Method:", parsedEvent.args.paymentMethod);
  } else {
    console.log("\n⚠️  No events emitted!");
  }

  console.log("\n💡 Check backend logs now!");
  console.log("Expected: 🔔 New payment detected!");
  
  // Wait a bit for backend to process
  console.log("\nWaiting 3 seconds for backend to process...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log("\n✅ Test completed!");
  console.log("If backend shows '🔔 New payment detected!' → Listener works!");
  console.log("If not → Backend listener has issues");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });


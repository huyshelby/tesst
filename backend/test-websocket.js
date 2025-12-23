const { ethers } = require("ethers");

async function testWebSocket() {
  console.log("=== Testing WebSocket Connection ===\n");
  
  const WSS_URL = "ws://127.0.0.1:8545";
  const CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  console.log("WSS URL:", WSS_URL);
  console.log("Contract:", CONTRACT_ADDRESS);
  
  try {
    console.log("\n1. Connecting to WebSocket...");
    const provider = new ethers.providers.WebSocketProvider(WSS_URL);
    
    console.log("✅ WebSocket connected");
    
    console.log("\n2. Getting current block...");
    const blockNumber = await provider.getBlockNumber();
    console.log("📦 Current block:", blockNumber);
    
    console.log("\n3. Listening for new blocks...");
    provider.on("block", (block) => {
      console.log("🆕 New block:", block);
    });
    
    console.log("\n4. Setting up contract listener...");
    const ABI = [
      "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)"
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    contract.on("OrderPaid", (...args) => {
      console.log("\n🔔 OrderPaid event detected!");
      console.log("Args:", args);
    });
    
    console.log("✅ Contract listener setup complete");
    console.log("\n👂 Now listening for events...");
    console.log("💡 Try making a payment to test");
    console.log("⏸️  Press Ctrl+C to stop\n");
    
    // Keep running
    await new Promise(() => {});
    
  } catch (error) {
    console.error("\n❌ WebSocket error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

testWebSocket();


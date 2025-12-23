import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting Payment Contract deployment...");

  // Get deployer address (will be used as recipient wallet)
  const [deployer] = await ethers.getSigners();
  const recipientWallet = deployer.address;

  console.log("👤 Deployer/Recipient:", recipientWallet);

  // Get the contract factory
  const PaymentContract = await ethers.getContractFactory("PaymentContract");

  console.log("📦 Deploying PaymentContract...");

  // Deploy the contract with recipient wallet
  const paymentContract = await PaymentContract.deploy(recipientWallet);

  // Wait for deployment to finish
  await paymentContract.deployed();
  
  console.log("✅ PaymentContract deployed to:", paymentContract.address);
  console.log("🔗 Network:", (await paymentContract.provider.getNetwork()).name);
  console.log("🔗 Chain ID:", (await paymentContract.provider.getNetwork()).chainId);
  
  // Get deployment info
  const deployer = await paymentContract.signer.getAddress();
  const deployerBalance = await paymentContract.signer.getBalance();
  
  console.log("👤 Deployer address:", deployer);
  console.log("💰 Deployer balance:", ethers.utils.formatEther(deployerBalance), "BNB");
  
  // Verify contract deployment
  console.log("\n🔍 Verifying deployment...");
  const supportedTokens = await paymentContract.getSupportedTokens();
  console.log("🎯 Supported tokens:", supportedTokens);
  
  const exchangeRates = {
    USDT: await paymentContract.getExchangeRate(supportedTokens[0]),
    USDC: await paymentContract.getExchangeRate(supportedTokens[1]),
    BNB: await paymentContract.getExchangeRate(supportedTokens[2])
  };
  
  console.log("💱 Exchange rates (VND per token):", exchangeRates);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: paymentContract.address,
    deployer: deployer,
    network: (await paymentContract.provider.getNetwork()).name,
    chainId: (await paymentContract.provider.getNetwork()).chainId,
    timestamp: new Date().toISOString(),
    supportedTokens: supportedTokens,
    exchangeRates: exchangeRates
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📝 Next steps:");
  console.log("1. Verify contract on BSCScan");
  console.log("2. Update backend config with contract address");
  console.log("3. Update frontend config with contract address");
  console.log("4. Test payment flow");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

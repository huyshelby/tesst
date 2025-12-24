import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting InvoiceNFT deployment...");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB");

  try {
    // Deploy InvoiceNFT
    console.log("📦 Deploying InvoiceNFT...");
    const InvoiceNFT = await ethers.getContractFactory("InvoiceNFT");
    const invoiceNFT = await InvoiceNFT.deploy();
    
    console.log("⏳ Waiting for deployment confirmation...");
    await invoiceNFT.waitForDeployment();
    
    const contractAddress = await invoiceNFT.getAddress();
    console.log("✅ InvoiceNFT deployed to:", contractAddress);
    
    // Get network info
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "unknown" ? "localhost" : network.name;
    
    // Prepare deployment info
    const deploymentInfo = {
      contractName: "InvoiceNFT",
      contractAddress: contractAddress,
      deployer: deployer.address,
      network: networkName,
      chainId: network.chainId.toString(),
      timestamp: new Date().toISOString(),
      abi: JSON.parse(invoiceNFT.interface.formatJson())
    };

    // Save deployment info to file
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    const deploymentFile = path.join(deploymentsDir, `deployment-${networkName}-${Date.now()}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n📋 Deployment Summary:");
    console.log(JSON.stringify({
      contract: deploymentInfo.contractName,
      address: deploymentInfo.contractAddress,
      network: deploymentInfo.network,
      chainId: deploymentInfo.chainId,
      timestamp: deploymentInfo.timestamp
    }, null, 2));
    
    console.log("\n📄 Deployment info saved to:", path.relative(process.cwd(), deploymentFile));
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Update your backend with the new contract address");
    console.log("2. Configure frontend to interact with the contract");
    console.log("3. Test minting NFTs from your application");
    
    return deploymentInfo;
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    process.exitCode = 1;
    throw error;
  }
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { main };

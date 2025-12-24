import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting NFTReceipt deployment...");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB");

  try {
    // Deploy NFTReceipt
    console.log("📦 Deploying NFTReceipt...");
    const NFTReceipt = await ethers.getContractFactory("NFTReceipt");
    
    // Set base URI for metadata
    const baseURI = "https://ipfs.io/ipfs/";
    const nftReceipt = await NFTReceipt.deploy(baseURI);
    
    console.log("⏳ Waiting for deployment confirmation...");
    await nftReceipt.waitForDeployment();
    
    const contractAddress = await nftReceipt.getAddress();
    console.log("✅ NFTReceipt deployed to:", contractAddress);
    
    // Get network info
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "unknown" ? "localhost" : network.name;
    
    // Prepare deployment info
    const deploymentInfo = {
      contractName: "NFTReceipt",
      contractAddress: contractAddress,
      deployer: deployer.address,
      network: networkName,
      chainId: network.chainId.toString(),
      baseURI: baseURI,
      timestamp: new Date().toISOString(),
      abi: JSON.parse(nftReceipt.interface.formatJson())
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
      baseURI: deploymentInfo.baseURI,
      timestamp: deploymentInfo.timestamp
    }, null, 2));
    
    console.log("\n📄 Deployment info saved to:", path.relative(process.cwd(), deploymentFile));
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Copy contract address to backend/.env");
    console.log("2. Update frontend with contract address");
    console.log("3. Grant MINTER_ROLE to backend wallet");
    console.log("4. Test minting NFTs from your application");
    
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

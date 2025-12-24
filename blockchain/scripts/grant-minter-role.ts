import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Thay bằng địa chỉ contract của bạn
  const minterAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Hardhat account #1
  
  console.log("Granting MINTER_ROLE to backend wallet...");
  console.log("Contract:", contractAddress);
  console.log("Minter:", minterAddress);
  
  const nftReceipt = await ethers.getContractAt("NFTReceipt", contractAddress);
  const MINTER_ROLE = await nftReceipt.MINTER_ROLE();
  
  console.log(`Granting MINTER_ROLE to ${minterAddress}...`);
  const tx = await nftReceipt.grantRole(MINTER_ROLE, minterAddress);
  await tx.wait();
  
  console.log(`✅ Granted MINTER_ROLE to ${minterAddress}`);
  console.log(`Transaction hash: ${tx.hash}`);
  
  // Verify the role was granted
  const hasRole = await nftReceipt.hasRole(MINTER_ROLE, minterAddress);
  console.log(`Role verification: ${hasRole ? "✅ Success" : "❌ Failed"}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
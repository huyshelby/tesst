import { ethers } from "ethers";

// Contract configuration
export const PAYMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS || "";
export const BSC_TESTNET_CHAIN_ID = "0x61"; // 97 in hex
export const BSC_TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";

// Contract ABI
export const PAYMENT_CONTRACT_ABI = [
  "event OrderPaid(string indexed orderId, address indexed payer, uint256 amount, address indexed token, string paymentMethod, uint256 timestamp)",
  "function payOrderWithToken(string orderId, address token, uint256 amount) external",
  "function payOrderWithNative(string orderId) external payable",
  "function isOrderProcessed(string orderId) external view returns (bool)",
  "function getBalance(address token) external view returns (uint256)",
  "function getSupportedTokens() external view returns (address[])",
  "function getExchangeRate(address token) external view returns (uint256)"
];

// Token addresses (BSC Testnet)
export const TOKENS = {
  USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  NATIVE: "0x0000000000000000000000000000000000000000" // BNB
};

// ERC20 ABI (minimal for approve and transfer)
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

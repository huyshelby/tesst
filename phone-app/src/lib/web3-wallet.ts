import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// NFT Receipt Contract ABI (chỉ cần hàm safeMint)
const NFT_RECEIPT_ABI = [
  "function safeMint(address to, bytes32 orderHash, string memory metadataUrl) external returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)"
];

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const BLOCKCHAIN_RPC_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

/**
 * Kết nối với MetaMask
 */
export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('Không thể kết nối ví MetaMask');
    }

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Bạn đã từ chối kết nối ví MetaMask');
    }
    throw error;
  }
}

/**
 * Lấy địa chỉ ví hiện tại (nếu đã kết nối)
 */
export async function getCurrentWallet(): Promise<string | null> {
  if (!window.ethereum) return null;

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    return accounts[0] || null;
  } catch (error) {
    console.error('Failed to get current wallet:', error);
    return null;
  }
}

/**
 * Thêm/chuyển sang Hardhat local network trong MetaMask
 */
export async function switchToLocalNetwork(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask không được cài đặt');
  }

  try {
    // Try to switch to Hardhat network (chainId: 31337 = 0x7A69)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7A69' }]
    });
  } catch (switchError: any) {
    // Network chưa được thêm, thử thêm mới
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x7A69',
            chainName: 'Hardhat Local',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: [BLOCKCHAIN_RPC_URL],
            blockExplorerUrls: null
          }]
        });
      } catch (addError) {
        throw new Error('Không thể thêm Hardhat network vào MetaMask');
      }
    } else {
      throw switchError;
    }
  }
}

/**
 * Mint NFT Receipt trực tiếp từ frontend (user tự ký transaction)
 */
export async function mintNFTWithWallet(
  orderHash: string,
  metadataUrl: string
): Promise<{ txHash: string; tokenId: string }> {
  if (!window.ethereum) {
    throw new Error('MetaMask không được cài đặt');
  }

  // Connect wallet
  const walletAddress = await connectWallet();

  // Switch to local network
  await switchToLocalNetwork();

  // Create provider and signer
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // Get contract instance
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_RECEIPT_ABI, signer);

  try {
    // Call safeMint - user sẽ ký transaction trong MetaMask
    const tx = await contract.safeMint(
      walletAddress, // Mint vào chính ví của user
      orderHash,
      metadataUrl
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    // Extract tokenId from event
    const event = receipt.events?.find((e: any) => e.event === 'OrderReceiptMinted');
    const tokenId = event?.args?.tokenId?.toString();

    if (!tokenId) {
      throw new Error('Không thể lấy token ID từ transaction');
    }

    return {
      txHash: tx.hash,
      tokenId
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Bạn đã từ chối transaction');
    }
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Không đủ ETH để thanh toán gas fee');
    }
    throw new Error(`Mint NFT thất bại: ${error.message}`);
  }
}

/**
 * Thêm NFT vào MetaMask để hiển thị
 */
export async function addNFTToWallet(tokenId: string): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask không được cài đặt');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC721',
        options: {
          address: NFT_CONTRACT_ADDRESS,
          tokenId: tokenId
        }
      }
    });
  } catch (error: any) {
    console.error('Failed to add NFT to wallet:', error);
    throw new Error('Không thể thêm NFT vào MetaMask');
  }
}

/**
 * Format địa chỉ ví (rút gọn)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

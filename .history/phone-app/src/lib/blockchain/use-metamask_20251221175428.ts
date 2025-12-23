"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CHAIN_ID, RPC_URL, NETWORK_NAME } from "./config";

interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  balance: string | null;
  error: string | null;
}

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    isInstalled: false,
    isConnected: false,
    account: null,
    chainId: null,
    balance: null,
    error: null
  });

  const [loading, setLoading] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const isInstalled = typeof window !== "undefined" && typeof window.ethereum !== "undefined";
      setState(prev => ({ ...prev, isInstalled }));
    };

    checkMetaMask();
  }, []);

  // Listen to account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          account: null,
          balance: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          account: accounts[0]
        }));
        updateBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setState(prev => ({ ...prev, chainId }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // Update balance
  const updateBalance = async (account: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      setState(prev => ({
        ...prev,
        balance: ethers.utils.formatEther(balance)
      }));
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  };

  // Connect wallet
  const connect = useCallback(async () => {
    if (!state.isInstalled) {
      setState(prev => ({
        ...prev,
        error: "MetaMask is not installed. Please install MetaMask extension."
      }));
      return false;
    }

    setLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request accounts
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const account = accounts[0];
      const network = await provider.getNetwork();
      const chainId = `0x${network.chainId.toString(16)}`;
      const balance = await provider.getBalance(account);

      setState(prev => ({
        ...prev,
        isConnected: true,
        account,
        chainId,
        balance: ethers.utils.formatEther(balance),
        error: null
      }));

      return true;
    } catch (error: any) {
      console.error("Failed to connect:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Failed to connect to MetaMask"
      }));
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.isInstalled]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      isInstalled: state.isInstalled,
      isConnected: false,
      account: null,
      chainId: null,
      balance: null,
      error: null
    });
  }, [state.isInstalled]);

  // Switch to BSC Testnet
  const switchToBSCTestnet = useCallback(async () => {
    if (!state.isInstalled) {
      setState(prev => ({
        ...prev,
        error: "MetaMask is not installed"
      }));
      return false;
    }

    setLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_TESTNET_CHAIN_ID }]
      });

      setState(prev => ({ ...prev, chainId: BSC_TESTNET_CHAIN_ID }));
      return true;
    } catch (error: any) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BSC_TESTNET_CHAIN_ID,
                chainName: "BSC Testnet",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18
                },
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                blockExplorerUrls: ["https://testnet.bscscan.com/"]
              }
            ]
          });

          setState(prev => ({ ...prev, chainId: BSC_TESTNET_CHAIN_ID }));
          return true;
        } catch (addError: any) {
          console.error("Failed to add BSC Testnet:", addError);
          setState(prev => ({
            ...prev,
            error: "Failed to add BSC Testnet"
          }));
          return false;
        }
      } else {
        console.error("Failed to switch network:", error);
        setState(prev => ({
          ...prev,
          error: error.message || "Failed to switch network"
        }));
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [state.isInstalled]);

  // Check if on correct network
  const isCorrectNetwork = state.chainId === BSC_TESTNET_CHAIN_ID;

  return {
    ...state,
    loading,
    isCorrectNetwork,
    connect,
    disconnect,
    switchToBSCTestnet
  };
}

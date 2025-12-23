"use client";

import { useState } from "react";
import { ethers } from "ethers";
import {
  PAYMENT_CONTRACT_ADDRESS,
  PAYMENT_CONTRACT_ABI,
  TOKENS,
  ERC20_ABI
} from "./config";

interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Pay with ERC20 token (USDT/USDC)
   */
  const payWithToken = async (
    orderId: string,
    tokenAddress: string,
    amount: string
  ): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // Get token decimals
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);

      // Check balance
      const balance = await tokenContract.balanceOf(userAddress);
      if (balance.lt(amountInWei)) {
        throw new Error("Insufficient token balance");
      }

      // Check allowance
      const allowance = await tokenContract.allowance(userAddress, PAYMENT_CONTRACT_ADDRESS);
      
      // Approve if needed
      if (allowance.lt(amountInWei)) {
        console.log("Approving token spend...");
        const approveTx = await tokenContract.approve(
          PAYMENT_CONTRACT_ADDRESS,
          amountInWei
        );
        await approveTx.wait();
        console.log("Token approved");
      }

      // Pay order
      const paymentContract = new ethers.Contract(
        PAYMENT_CONTRACT_ADDRESS,
        PAYMENT_CONTRACT_ABI,
        signer
      );

      console.log("Sending payment transaction...");
      const tx = await paymentContract.payOrderWithToken(
        orderId,
        tokenAddress,
        amountInWei
      );

      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for confirmation...");

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt.transactionHash);

      return {
        success: true,
        txHash: receipt.transactionHash
      };
    } catch (err: any) {
      console.error("Payment failed:", err);
      const errorMessage = err.message || "Payment failed";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Pay with native coin (BNB)
   */
  const payWithNative = async (
    orderId: string,
    amount: string
  ): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const amountInWei = ethers.utils.parseEther(amount);

      // Check balance
      const balance = await provider.getBalance(userAddress);
      if (balance.lt(amountInWei)) {
        throw new Error("Insufficient BNB balance");
      }

      // Pay order
      const paymentContract = new ethers.Contract(
        PAYMENT_CONTRACT_ADDRESS,
        PAYMENT_CONTRACT_ABI,
        signer
      );

      console.log("Sending payment transaction...");
      const tx = await paymentContract.payOrderWithNative(orderId, {
        value: amountInWei
      });

      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for confirmation...");

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt.transactionHash);

      return {
        success: true,
        txHash: receipt.transactionHash
      };
    } catch (err: any) {
      console.error("Payment failed:", err);
      const errorMessage = err.message || "Payment failed";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if order is processed on blockchain
   */
  const checkOrderStatus = async (orderId: string): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        PAYMENT_CONTRACT_ADDRESS,
        PAYMENT_CONTRACT_ABI,
        provider
      );

      return await contract.isOrderProcessed(orderId);
    } catch (err) {
      console.error("Failed to check order status:", err);
      return false;
    }
  };

  return {
    loading,
    error,
    payWithToken,
    payWithNative,
    checkOrderStatus,
    TOKENS
  };
}

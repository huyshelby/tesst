import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ExternalLink, Loader2 } from 'lucide-react';
import { getTransactionUrl, getOpenSeaUrl, getOrderReceipt } from '@/lib/order-api';
import type { ReceiptResponse } from '@/lib/order-api';

interface NFTReceiptProps {
  orderId: string;
  initialReceipt?: ReceiptResponse;
  onMint: () => Promise<void>;
  isMinting: boolean;
}

export function NFTReceipt({ orderId, initialReceipt, onMint, isMinting }: NFTReceiptProps) {
  const [receipt, setReceipt] = useState<ReceiptResponse | null>(initialReceipt || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!initialReceipt) {
      loadReceipt();
    }
  }, [orderId]);

  const loadReceipt = async () => {
    setIsLoading(true);
    try {
      const data = await getOrderReceipt(orderId);
      setReceipt(data);
    } catch (error) {
      console.error('Failed to load NFT receipt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    await onMint();
    // Refresh after minting
    await loadReceipt();
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Digital Receipt (NFT)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!receipt?.exists) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Digital Receipt (NFT)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Claim a unique, collectible NFT of your order receipt on the blockchain.
          </p>
          <Button onClick={handleMint} disabled={isMinting} className="w-full">
            {isMinting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Minting...</>
            ) : (
              'Mint Your NFT Receipt'
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            A small network fee (gas) will be required.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Digital Receipt (NFT)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full font-semibold">
              Minted
            </span>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token ID:</span>
              <span className="font-mono font-bold">#{receipt.tokenId}</span>
            </div>
            {receipt.txHash && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction:</span>
                <a
                  href={getTransactionUrl(receipt.txHash, 'bsc')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  View on BscScan <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
            {receipt.tokenId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">View on Market:</span>
                <a
                  href={getOpenSeaUrl(process.env.NEXT_PUBLIC_NFT_RECEIPT_CONTRACT_ADDRESS || '', receipt.tokenId, 'bsc')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  View on OpenSea <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          {receipt.metadata?.image && (
            <div className="mt-4 border-t pt-4">
              <img 
                src={receipt.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                alt="NFT Preview" 
                className="rounded-lg w-full max-w-xs mx-auto shadow-lg"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


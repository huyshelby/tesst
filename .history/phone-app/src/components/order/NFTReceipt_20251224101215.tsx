import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ExternalLink, Loader2, Award, CheckCircle2 } from 'lucide-react';
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
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!receipt?.exists) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Digital Receipt (NFT)</h2>
            <p className="text-sm text-gray-600">Hoá đơn điện tử trên Blockchain</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="bg-white rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Chứng minh quyền sở hữu</p>
              <p className="text-xs text-gray-600">Bằng chứng hợp pháp về giao dịch mua hàng</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Bảo hành điện tử</p>
              <p className="text-xs text-gray-600">Sử dụng NFT làm bảo hành sản phẩm</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Xem trên OpenSea</p>
              <p className="text-xs text-gray-600">Hiển thị trên các NFT marketplace</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleMint} 
          disabled={isMinting} 
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12"
        >
          {isMinting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
              Đang mint NFT...
            </>
          ) : (
            <>
              <Award className="mr-2 h-5 w-5" />
              Mint NFT Receipt của bạn
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 mt-3 text-center">
          ⚠️ Phí gas blockchain sẽ được tính (khoảng 0.001 - 0.01 BNB)
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">Digital Receipt (NFT)</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Đã Mint
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Token ID</span>
            <span className="font-mono font-bold text-blue-600">#{receipt.tokenId}</span>
          </div>

          {receipt.txHash && (
            <div className="pt-3 border-t">
              <a
                href={getTransactionUrl(receipt.txHash, 'bsc')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span className="text-sm text-gray-700 group-hover:text-blue-600">
                  Xem trên BscScan
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </a>
            </div>
          )}

          {receipt.tokenId && (
            <div className="border-t">
              <a
                href={getOpenSeaUrl(process.env.NEXT_PUBLIC_NFT_RECEIPT_CONTRACT_ADDRESS || '', receipt.tokenId, 'bsc')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span className="text-sm text-gray-700 group-hover:text-blue-600">
                  Xem trên OpenSea
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </a>
            </div>
          )}
        </div>

        {receipt.metadata?.image && (
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-3">Preview NFT</p>
            <img 
              src={receipt.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              alt="NFT Receipt Preview" 
              className="rounded-lg w-full shadow-md border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}

import { fetchApi } from "./api";
import type { Product } from "./product-api";

// ============================================================
// TYPES
// ============================================================

export type PaymentMethod =
  | "CARD"
  | "MOMO"
  | "VNPAY"
  | "BANK_TRANSFER"
  | "INSTALLMENT"
  | "CRYPTO";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict?: string;
  shippingWard?: string;
  paymentMethod: PaymentMethod;
  cryptoWallet?: string;
  cryptoNetwork?: string;
  cryptoToken?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  selectedColor?: string | null;
  selectedStorage?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  
  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Shipping info
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict?: string | null;
  shippingWard?: string | null;
  
  // Crypto payment info (optional)
  cryptoWallet?: string | null;
  cryptoNetwork?: string | null;
  cryptoToken?: string | null;
  cryptoTxHash?: string | null;
  
  // Order details
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  notes?: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrdersQueryParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Tạo đơn hàng mới từ giỏ hàng hiện tại
 * Yêu cầu: User đã đăng nhập
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<Order> {
  const res = await fetchApi("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Không thể tạo đơn hàng");
  }

  return res.json();
}

/**
 * Lấy danh sách đơn hàng của user hiện tại
 * Yêu cầu: User đã đăng nhập
 */
export async function getUserOrders(
  params?: OrdersQueryParams
): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());

  const url = `/orders${query.toString() ? `?${query.toString()}` : ""}`;
  
  const res = await fetchApi(url, { method: "GET" });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Không thể tải đơn hàng");
  }

  return res.json();
}

/**
 * Lấy chi tiết đơn hàng theo ID
 * Yêu cầu: User đã đăng nhập và là chủ đơn hàng
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const res = await fetchApi(`/orders/${orderId}`, { method: "GET" });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 404) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (res.status === 403) {
      throw new Error("Bạn không có quyền truy cập đơn hàng này");
    }
    throw new Error(data?.message || "Không thể tải đơn hàng");
  }

  return res.json();
}

/**
 * Lấy chi tiết đơn hàng theo số đơn hàng
 * Yêu cầu: User đã đăng nhập và là chủ đơn hàng
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  const res = await fetchApi(`/orders/number/${orderNumber}`, {
    method: "GET",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 404) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (res.status === 403) {
      throw new Error("Bạn không có quyền truy cập đơn hàng này");
    }
    throw new Error(data?.message || "Không thể tải đơn hàng");
  }

  return res.json();
}

/**
 * Huỷ đơn hàng
 * Yêu cầu: User đã đăng nhập và là chủ đơn hàng
 * Chỉ có thể huỷ đơn hàng ở trạng thái PENDING hoặc CONFIRMED
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  const res = await fetchApi(`/orders/${orderId}/cancel`, {
    method: "POST",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 404) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (res.status === 403) {
      throw new Error("Bạn không có quyền huỷ đơn hàng này");
    }
    throw new Error(data?.message || "Không thể huỷ đơn hàng");
  }

  return res.json();
}

/**
 * Notify backend về blockchain payment success
 * Frontend gọi API này ngay sau khi transaction confirm
 */
export async function notifyBlockchainPayment(
  orderId: string,
  txHash: string
): Promise<Order> {
  const res = await fetchApi(`/orders/${orderId}/blockchain-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ txHash }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Không thể cập nhật trạng thái thanh toán");
  }

  return res.json();
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Lấy màu hiển thị cho trạng thái đơn hàng
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
    CONFIRMED: "text-blue-600 bg-blue-50 border-blue-200",
    PROCESSING: "text-indigo-600 bg-indigo-50 border-indigo-200",
    SHIPPING: "text-purple-600 bg-purple-50 border-purple-200",
    DELIVERED: "text-green-600 bg-green-50 border-green-200",
    CANCELLED: "text-red-600 bg-red-50 border-red-200",
  };
  return colors[status] || colors.PENDING;
}

/**
 * Lấy text hiển thị cho trạng thái đơn hàng
 */
export function getOrderStatusText(status: OrderStatus): string {
  const texts: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Đã huỷ",
  };
  return texts[status] || status;
}

/**
 * Lấy text hiển thị cho trạng thái thanh toán
 */
export function getPaymentStatusText(status: PaymentStatus): string {
  const texts: Record<PaymentStatus, string> = {
    PENDING: "Chờ thanh toán",
    COMPLETED: "Đã thanh toán",
    FAILED: "Thanh toán thất bại",
    REFUNDED: "Đã hoàn tiền",
  };
  return texts[status] || status;
}

/**
 * Lấy text hiển thị cho phương thức thanh toán
 */
export function getPaymentMethodText(method: PaymentMethod): string {
  const texts: Record<PaymentMethod, string> = {
    CARD: "Thẻ ATM/Visa/Mastercard",
    MOMO: "Ví MoMo",
    VNPAY: "VNPay",
    BANK_TRANSFER: "Chuyển khoản ngân hàng",
    INSTALLMENT: "Trả góp 0%",
    CRYPTO: "Thanh toán Blockchain",
  };
  return texts[method] || method;
}

/**
 * Kiểm tra xem đơn hàng có thể huỷ không
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return status === "PENDING" || status === "CONFIRMED";
}

/**
 * Kiểm tra xem đơn hàng đã hoàn thành chưa
 */
export function isOrderCompleted(status: OrderStatus): boolean {
  return status === "DELIVERED";
}

/**
 * Kiểm tra xem đơn hàng đã bị huỷ chưa
 */
export function isOrderCancelled(status: OrderStatus): boolean {
  return status === "CANCELLED";
}

// ============================================================
// NFT RECEIPT API
// ============================================================

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface ReceiptResponse {
  exists: boolean;
  tokenId?: string;
  txHash?: string;
  metadataUrl?: string;
  metadata?: NFTMetadata;
  mintedAt?: string;
}

/**
 * Mint NFT receipt cho đơn hàng
 * Yêu cầu: User đã đăng nhập, đơn hàng đã thanh toán thành công
 */
export async function mintOrderReceipt(orderId: string): Promise<ReceiptResponse> {
  const res = await fetchApi(`/orders/${orderId}/nft-receipt`, {
    method: "POST",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Không thể mint NFT receipt");
  }

  const result = await res.json();
  return result.data;
}

/**
 * Lấy thông tin NFT receipt của đơn hàng
 * Yêu cầu: User đã đăng nhập và là chủ đơn hàng
 */
export async function getOrderReceipt(orderId: string): Promise<ReceiptResponse> {
  const res = await fetchApi(`/orders/${orderId}/nft-receipt`, {
    method: "GET",
  });

  if (!res.ok) {
    // Nếu 404 thì trả về exists: false
    if (res.status === 404) {
      return { exists: false };
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Không thể tải NFT receipt");
  }

  const result = await res.json();
  return result.data;
}

/**
 * Lấy URL transaction trên blockchain explorer
 */
export function getTransactionUrl(txHash: string, network: 'bsc' | 'eth' = 'bsc'): string {
  const explorers = {
    bsc: 'https://bscscan.com/tx/',
    eth: 'https://etherscan.io/tx/',
  };
  return `${explorers[network]}${txHash}`;
}

/**
 * Lấy URL OpenSea cho NFT
 */
export function getOpenSeaUrl(
  contractAddress: string,
  tokenId: string,
  network: 'bsc' | 'eth' = 'bsc'
): string {
  // OpenSea testnet URLs
  const testnets = {
    bsc: 'https://testnets.opensea.io/assets/bsc-testnet',
    eth: 'https://testnets.opensea.io/assets/sepolia',
  };
  
  return `${testnets[network]}/${contractAddress}/${tokenId}`;
}

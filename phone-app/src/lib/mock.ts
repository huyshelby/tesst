export type Product = {
  id: string;
  name: string;
  price: number;
  listPrice?: number;
  rating?: number;
  reviews?: number;
  image: string;
  badges?: string[];
  installment?: boolean;
  brand?: string;
};

// Status badge pool matching the design from image
const statusBadges = [
  ["Giá dự kiến", "Còn hàng"],
  ["Trả góp 0%", "Online giá rẻ"],
  ["Mua kèm giảm thêm"],
  ["Còn hàng", "Giá tốt"],
  ["Trả góp 0%", "Mua kèm giảm"],
  ["Giá dự kiến"],
];

// In mock data generator:
export const products: Product[] = [
  // iPhone
  {
    id: "iphone-17",
    name: "iPhone 17 256GB",
    price: 24990000,
    listPrice: 27990000,
    rating: 5,
    reviews: 127,
    image: "/pictures/iphone/0049405_iphone-17-256gb_240.png",
    badges: ["Mới", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "iphone-air",
    name: "iPhone Air 256GB",
    price: 21990000,
    listPrice: 24990000,
    rating: 5,
    reviews: 89,
    image: "/pictures/iphone/0049406_iphone-air-256gb_240.png",
    badges: ["Mới", "Trả góp 0%"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max 256GB",
    price: 32990000,
    listPrice: 34990000,
    rating: 5,
    reviews: 215,
    image: "/pictures/iphone/0049662_iphone-17-pro-max-256gb_240.png",
    badges: ["Mới", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },

  // iPad
  {
    id: "ipad-pro-m5-11",
    name: "iPad Pro M5 11 inch Wi-Fi 256GB",
    price: 23990000,
    listPrice: 25990000,
    rating: 5,
    reviews: 94,
    image: "/pictures/iPad/0051666_ipad-pro-m5-11-inch-wi-fi-256gb_240.png",
    badges: ["Mới", "Trả góp 0%"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "ipad-air-m3-11",
    name: "iPad Air M3 11 inch Wi-Fi",
    price: 16990000,
    listPrice: 18990000,
    rating: 4.8,
    reviews: 76,
    image: "/pictures/iPad/0035054_ipad-air-m3-11-inch-wi-fi_240.png",
    badges: ["Trả góp 0%", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "ipad-mini-a17-pro",
    name: "iPad mini A17 Pro Wi-Fi 128GB",
    price: 13990000,
    listPrice: 14990000,
    rating: 4.9,
    reviews: 52,
    image: "/pictures/iPad/0030994_ipad-mini-a17-pro-wi-fi-128gb_240.jpeg",
    badges: ["Còn hàng"],
    installment: true,
    brand: "Apple",
  },

  // Mac
  {
    id: "macbook-pro-14-m5",
    name: "MacBook Pro 14 inch M5 2025 16GB RAM 512GB SSD",
    price: 44990000,
    listPrice: 47990000,
    rating: 5,
    reviews: 143,
    image:
      "/pictures/Mac/0051653_macbook-pro-14-inch-m5-2025-10-core-gpu-10-core-cpu-16gb-ram-512gb-ssd_240.png",
    badges: ["Mới", "Trả góp 0%"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "macbook-air-m4-13",
    name: "MacBook Air M4 13 inch 16GB RAM 256GB SSD",
    price: 29990000,
    listPrice: 32990000,
    rating: 5,
    reviews: 98,
    image:
      "/pictures/Mac/0036014_macbook-air-m4-13-inch-8-core-gpu-16gb-ram-256gb-ssd_240.jpeg",
    badges: ["Mới", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "macbook-air-m3-13",
    name: "MacBook Air M3 13 inch 8GB RAM 256GB SSD",
    price: 26990000,
    listPrice: 28990000,
    rating: 4.9,
    reviews: 167,
    image:
      "/pictures/Mac/0051655_macbook-air-m3-13-inch-8gb-ram-256gb-ssd_240.png",
    badges: ["Trả góp 0%", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },

  // Watch
  {
    id: "watch-ultra-3",
    name: "Apple Watch Ultra 3 GPS + Cellular 49mm Alpine Loop 2025",
    price: 22990000,
    listPrice: 24990000,
    rating: 5,
    reviews: 87,
    image:
      "/pictures/Watch/0048508_apple-watch-ultra-3-gps-cellular-49mm-alpine-loop-2025_240.jpeg",
    badges: ["Mới", "Trả góp 0%"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "watch-series-11",
    name: "Apple Watch Series 11 Nhôm GPS 42mm Sport Band",
    price: 10990000,
    listPrice: 11990000,
    rating: 4.8,
    reviews: 134,
    image:
      "/pictures/Watch/0049492_apple-watch-series-11-nhom-gps-42mm-sport-band-size-sm_240.jpeg",
    badges: ["Mới", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "watch-se-3",
    name: "Apple Watch SE 3 Nhôm GPS 40mm Sport Band",
    price: 6990000,
    listPrice: 7990000,
    rating: 4.7,
    reviews: 203,
    image:
      "/pictures/Watch/0048610_apple-watch-se-3-nhom-gps-40mm-sport-band-size-sm_240.jpeg",
    badges: ["Còn hàng", "Trả góp 0%"],
    installment: true,
    brand: "Apple",
  },

  // Phụ kiện
  {
    id: "magic-mouse-2",
    name: "Magic Mouse 2",
    price: 2490000,
    listPrice: 2790000,
    rating: 4.6,
    reviews: 312,
    image: "/pictures/Phụ kiện/0001421_magic-mouse-2_240.jpeg",
    badges: ["Còn hàng"],
    brand: "Apple",
  },
  {
    id: "sac-20w-usb-c",
    name: "Sạc 20W USB-C Power Adapter",
    price: 590000,
    listPrice: 690000,
    rating: 4.5,
    reviews: 456,
    image: "/pictures/Phụ kiện/0001395_sac-20w-usb-c-power-adapter_240.png",
    badges: ["Còn hàng"],
    brand: "Apple",
  },
  {
    id: "smart-keyboard-folio",
    name: "Smart Keyboard Folio cho iPad Pro 11 inch",
    price: 4990000,
    listPrice: 5490000,
    rating: 4.7,
    reviews: 89,
    image:
      "/pictures/Phụ kiện/0034293_ban-phim-smart-keyboard-folio-cho-ipad-pro-11-inch-mxnk2-dung-cho-ipad-pro-the-he-thu-1234_240.jpeg",
    badges: ["Còn hàng", "Trả góp 0%"],
    installment: true,
    brand: "Apple",
  },

  // Âm thanh
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    price: 6990000,
    listPrice: 7490000,
    rating: 5,
    reviews: 267,
    image: "/pictures/Âm thanh/0049466_airpods-pro-3_240.jpeg",
    badges: ["Mới", "Trả góp 0%"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "airpods-max-usb-c",
    name: "AirPods Max cổng USB-C 2024",
    price: 13990000,
    listPrice: 14990000,
    rating: 4.9,
    reviews: 178,
    image: "/pictures/Âm thanh/0029786_airpods-max-cong-usb-c-2024_240.jpeg",
    badges: ["Trả góp 0%", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "airpods-4",
    name: "AirPods 4",
    price: 3990000,
    listPrice: 4490000,
    rating: 4.8,
    reviews: 394,
    image: "/pictures/Âm thanh/0029778_airpods-4_240.jpeg",
    badges: ["Mới", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },
  {
    id: "airpods-pro-2-usb-c",
    name: "AirPods Pro 2 USB-C 2023",
    price: 5990000,
    listPrice: 6490000,
    rating: 4.9,
    reviews: 521,
    image: "/pictures/Âm thanh/0022022_airpods-pro-2-usb-c-2023_240.jpeg",
    badges: ["Trả góp 0%", "Còn hàng"],
    installment: true,
    brand: "Apple",
  },
];

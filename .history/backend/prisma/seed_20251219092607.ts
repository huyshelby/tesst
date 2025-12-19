import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = {
  categories: [
    {
      name: "Điện thoại",
      slug: "phone",
      description: "Smartphone và điện thoại di động",
      icon: "📱",
      displayOrder: 1,
    },
    {
      name: "Laptop",
      slug: "laptop",
      description: "Laptop và máy tính xách tay",
      icon: "💻",
      displayOrder: 2,
    },
    {
      name: "Màn hình",
      slug: "monitor",
      description: "Màn hình máy tính",
      icon: "🖥️",
      displayOrder: 3,
    },
    {
      name: "Máy tính bảng",
      slug: "tablet",
      description: "iPad và máy tính bảng",
      icon: "📱",
      displayOrder: 4,
    },
    {
      name: "Âm thanh",
      slug: "audio",
      description: "Tai nghe, loa và thiết bị âm thanh",
      icon: "🎧",
      displayOrder: 5,
    },
    {
      name: "Đồng hồ thông minh",
      slug: "watch",
      description: "Smartwatch và thiết bị đeo tay",
      icon: "⌚",
      displayOrder: 6,
    },
    {
      name: "Đồ gia dụng",
      slug: "home",
      description: "Thiết bị gia dụng thông minh",
      icon: "🏠",
      displayOrder: 7,
    },
    {
      name: "TV",
      slug: "tv",
      description: "Tivi và màn hình lớn",
      icon: "📺",
      displayOrder: 8,
    },
    {
      name: "Phụ kiện",
      slug: "accessory",
      description: "Phụ kiện và thiết bị bổ sung",
      icon: "🔌",
      displayOrder: 9,
    },
  ],
  products: [
    // iPhone - 100% từ phone-app mock
    {
      name: "iPhone 17 256GB",
      slug: "iphone-17-256gb",
      description: "iPhone thế hệ mới với chip A19 Bionic mạnh mẽ",
      price: 24990000,
      listPrice: 27990000,
      image: "/pictures/iphone/0049405_iphone-17-256gb_240.png",
      images: ["/pictures/iphone/0049405_iphone-17-256gb_240.png"],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 127,
      badges: ["Mới", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "phone",
    },
    {
      name: "iPhone Air 256GB",
      slug: "iphone-air-256gb",
      description: "iPhone siêu mỏng, siêu nhẹ với thiết kế đột phá",
      price: 21990000,
      listPrice: 24990000,
      image: "/pictures/iphone/0049406_iphone-air-256gb_240.png",
      images: ["/pictures/iphone/0049406_iphone-air-256gb_240.png"],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 89,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: {},
      categorySlug: "phone",
    },
    {
      name: "iPhone 17 Pro Max 256GB",
      slug: "iphone-17-pro-max-256gb",
      description: "iPhone 17 Pro Max cao cấp nhất với màn hình lớn",
      price: 32990000,
      listPrice: 34990000,
      image: "/pictures/iphone/0049662_iphone-17-pro-max-256gb_240.png",
      images: ["/pictures/iphone/0049662_iphone-17-pro-max-256gb_240.png"],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 215,
      badges: ["Mới", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "phone",
    },
    // iPad - 100% từ phone-app mock
    {
      name: "iPad Pro M5 11 inch Wi-Fi 256GB",
      slug: "ipad-pro-m5-11-256gb",
      description: "iPad Pro với chip M5 thế hệ mới, màn hình OLED siêu sáng",
      price: 23990000,
      listPrice: 25990000,
      image: "/pictures/iPad/0051666_ipad-pro-m5-11-inch-wi-fi-256gb_240.png",
      images: [
        "/pictures/iPad/0051666_ipad-pro-m5-11-inch-wi-fi-256gb_240.png",
      ],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 94,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: {},
      categorySlug: "tablet",
    },
    {
      name: "iPad Air M3 11 inch Wi-Fi",
      slug: "ipad-air-m3-11",
      description: "iPad Air với chip M3, cân bằng hiệu năng và giá cả",
      price: 16990000,
      listPrice: 18990000,
      image: "/pictures/iPad/0035054_ipad-air-m3-11-inch-wi-fi_240.png",
      images: ["/pictures/iPad/0035054_ipad-air-m3-11-inch-wi-fi_240.png"],
      brand: "Apple",
      stock: 50,
      rating: 4.8,
      reviews: 76,
      badges: ["Trả góp 0%", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "tablet",
    },
    {
      name: "iPad mini A17 Pro Wi-Fi 128GB",
      slug: "ipad-mini-a17-pro-128gb",
      description: "iPad mini nhỏ gọn với chip A17 Pro mạnh mẽ",
      price: 13990000,
      listPrice: 14990000,
      image: "/pictures/iPad/0030994_ipad-mini-a17-pro-wi-fi-128gb_240.jpeg",
      images: ["/pictures/iPad/0030994_ipad-mini-a17-pro-wi-fi-128gb_240.jpeg"],
      brand: "Apple",
      stock: 50,
      rating: 4.9,
      reviews: 52,
      badges: ["Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "tablet",
    },
    // Mac - 100% từ phone-app mock
    {
      name: "MacBook Pro 14 inch M5 2025 16GB RAM 512GB SSD",
      slug: "macbook-pro-14-m5-512gb",
      description:
        "MacBook Pro với chip M5 thế hệ mới nhất, hiệu năng vượt trội",
      price: 44990000,
      listPrice: 47990000,
      image:
        "/pictures/Mac/0051653_macbook-pro-14-inch-m5-2025-10-core-gpu-10-core-cpu-16gb-ram-512gb-ssd_240.png",
      images: [
        "/pictures/Mac/0051653_macbook-pro-14-inch-m5-2025-10-core-gpu-10-core-cpu-16gb-ram-512gb-ssd_240.png",
      ],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 143,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: {},
      categorySlug: "laptop",
    },
    {
      name: "MacBook Air M4 13 inch 16GB RAM 256GB SSD",
      slug: "macbook-air-m4-13-256gb",
      description: "MacBook Air với chip M4 mạnh mẽ, siêu mỏng nhẹ",
      price: 29990000,
      listPrice: 32990000,
      image:
        "/pictures/Mac/0036014_macbook-air-m4-13-inch-8-core-gpu-16gb-ram-256gb-ssd_240.jpeg",
      images: [
        "/pictures/Mac/0036014_macbook-air-m4-13-inch-8-core-gpu-16gb-ram-256gb-ssd_240.jpeg",
      ],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 98,
      badges: ["Mới", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "laptop",
    },
    {
      name: "MacBook Air M3 13 inch 8GB RAM 256GB SSD",
      slug: "macbook-air-m3-13-256gb",
      description: "MacBook Air M3 với giá tốt, phù hợp học tập và văn phòng",
      price: 26990000,
      listPrice: 28990000,
      image:
        "/pictures/Mac/0051655_macbook-air-m3-13-inch-8gb-ram-256gb-ssd_240.png",
      images: [
        "/pictures/Mac/0051655_macbook-air-m3-13-inch-8gb-ram-256gb-ssd_240.png",
      ],
      brand: "Apple",
      stock: 50,
      rating: 4.9,
      reviews: 167,
      badges: ["Trả góp 0%", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "laptop",
    },
    // Watch - 100% từ phone-app mock
    {
      name: "Apple Watch Ultra 3 GPS + Cellular 49mm Alpine Loop 2025",
      slug: "apple-watch-ultra-3-49mm",
      description:
        "Apple Watch Ultra 3 cao cấp nhất cho các hoạt động ngoài trời",
      price: 22990000,
      listPrice: 24990000,
      image:
        "/pictures/Watch/0048508_apple-watch-ultra-3-gps-cellular-49mm-alpine-loop-2025_240.jpeg",
      images: [
        "/pictures/Watch/0048508_apple-watch-ultra-3-gps-cellular-49mm-alpine-loop-2025_240.jpeg",
      ],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 87,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: {},
      categorySlug: "watch",
    },
    {
      name: "Apple Watch Series 11 Nhôm GPS 42mm Sport Band",
      slug: "apple-watch-series-11-42mm",
      description: "Apple Watch Series 11 với các tính năng sức khỏe tiên tiến",
      price: 10990000,
      listPrice: 11990000,
      image:
        "/pictures/Watch/0049492_apple-watch-series-11-nhom-gps-42mm-sport-band-size-sm_240.jpeg",
      images: [
        "/pictures/Watch/0049492_apple-watch-series-11-nhom-gps-42mm-sport-band-size-sm_240.jpeg",
      ],
      brand: "Apple",
      stock: 50,
      rating: 4.8,
      reviews: 134,
      badges: ["Mới", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "watch",
    },
    {
      name: "Apple Watch SE 3 Nhôm GPS 40mm Sport Band",
      slug: "apple-watch-se-3-40mm",
      description: "Apple Watch SE 3 giá tốt, phù hợp người mới bắt đầu",
      price: 6990000,
      listPrice: 7990000,
      image:
        "/pictures/Watch/0048610_apple-watch-se-3-nhom-gps-40mm-sport-band-size-sm_240.jpeg",
      images: [
        "/pictures/Watch/0048610_apple-watch-se-3-nhom-gps-40mm-sport-band-size-sm_240.jpeg",
      ],
      brand: "Apple",
      stock: 50,
      rating: 4.7,
      reviews: 203,
      badges: ["Còn hàng", "Trả góp 0%"],
      installment: true,
      specs: {},
      categorySlug: "watch",
    },
    // Phụ kiện - 100% từ phone-app mock
    {
      name: "Magic Mouse 2",
      slug: "magic-mouse-2",
      description: "Chuột không dây Magic Mouse 2 với bề mặt cảm ứng đa điểm",
      price: 2490000,
      listPrice: 2790000,
      image: "/pictures/Phụ kiện/0001421_magic-mouse-2_240.jpeg",
      images: ["/pictures/Phụ kiện/0001421_magic-mouse-2_240.jpeg"],
      brand: "Apple",
      stock: 50,
      rating: 4.6,
      reviews: 312,
      badges: ["Còn hàng"],
      installment: false,
      specs: {},
      categorySlug: "accessory",
    },
    {
      name: "Sạc 20W USB-C Power Adapter",
      slug: "sac-20w-usb-c",
      description: "Củ sạc nhanh 20W USB-C chính hãng Apple",
      price: 590000,
      listPrice: 690000,
      image: "/pictures/Phụ kiện/0001395_sac-20w-usb-c-power-adapter_240.png",
      images: [
        "/pictures/Phụ kiện/0001395_sac-20w-usb-c-power-adapter_240.png",
      ],
      brand: "Apple",
      stock: 50,
      rating: 4.5,
      reviews: 456,
      badges: ["Còn hàng"],
      installment: false,
      specs: {},
      categorySlug: "accessory",
    },
    {
      name: "Smart Keyboard Folio cho iPad Pro 11 inch",
      slug: "smart-keyboard-folio-ipad-pro-11",
      description:
        "Bàn phím thông minh Smart Keyboard Folio cho iPad Pro 11 inch",
      price: 4990000,
      listPrice: 5490000,
      image:
        "/pictures/Phụ kiện/0034293_ban-phim-smart-keyboard-folio-cho-ipad-pro-11-inch-mxnk2-dung-cho-ipad-pro-the-he-thu-1234_240.jpeg",
      images: [
        "/pictures/Phụ kiện/0034293_ban-phim-smart-keyboard-folio-cho-ipad-pro-11-inch-mxnk2-dung-cho-ipad-pro-the-he-thu-1234_240.jpeg",
      ],
      brand: "Apple",
      stock: 50,
      rating: 4.7,
      reviews: 89,
      badges: ["Còn hàng", "Trả góp 0%"],
      installment: true,
      specs: {},
      categorySlug: "accessory",
    },
    // Âm thanh - 100% từ phone-app mock
    {
      name: "AirPods Pro 3",
      slug: "airpods-pro-3",
      description:
        "AirPods Pro thế hệ 3 với chống ồn chủ động ANC mạnh mẽ nhất",
      price: 6990000,
      listPrice: 7490000,
      image: "/pictures/Âm thanh/0049466_airpods-pro-3_240.jpeg",
      images: ["/pictures/Âm thanh/0049466_airpods-pro-3_240.jpeg"],
      brand: "Apple",
      stock: 50,
      rating: 5,
      reviews: 267,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: {},
      categorySlug: "audio",
    },
    {
      name: "AirPods Max cổng USB-C 2024",
      slug: "airpods-max-usb-c-2024",
      description: "Tai nghe over-ear cao cấp AirPods Max với cổng USB-C mới",
      price: 13990000,
      listPrice: 14990000,
      image: "/pictures/Âm thanh/0029786_airpods-max-cong-usb-c-2024_240.jpeg",
      images: [
        "/pictures/Âm thanh/0029786_airpods-max-cong-usb-c-2024_240.jpeg",
      ],
      brand: "Apple",
      stock: 50,
      rating: 4.9,
      reviews: 178,
      badges: ["Trả góp 0%", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "audio",
    },
    {
      name: "AirPods 4",
      slug: "airpods-4",
      description:
        "AirPods 4 với thiết kế mới, chất lượng âm thanh được cải thiện",
      price: 3990000,
      listPrice: 4490000,
      image: "/pictures/Âm thanh/0029778_airpods-4_240.jpeg",
      images: ["/pictures/Âm thanh/0029778_airpods-4_240.jpeg"],
      brand: "Apple",
      stock: 50,
      rating: 4.8,
      reviews: 394,
      badges: ["Mới", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "audio",
    },
    {
      name: "AirPods Pro 2 USB-C 2023",
      slug: "airpods-pro-2-usb-c-2023",
      description: "AirPods Pro 2 với cổng USB-C, chống ồn ANC tuyệt vời",
      price: 5990000,
      listPrice: 6490000,
      image: "/pictures/Âm thanh/0022022_airpods-pro-2-usb-c-2023_240.jpeg",
      images: ["/pictures/Âm thanh/0022022_airpods-pro-2-usb-c-2023_240.jpeg"],
      brand: "Apple",
      stock: 50,
      rating: 4.9,
      reviews: 521,
      badges: ["Trả góp 0%", "Còn hàng"],
      installment: true,
      specs: {},
      categorySlug: "audio",
    },
  ],
};

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Seed categories
  console.log("Seeding categories...");
  const categories: Record<string, any> = {};

  // First create parent categories (those without parentSlug)
  for (const category of seedData.categories) {
    if (!(category as any).parentSlug) {
      const created = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          displayOrder: category.displayOrder,
        },
      });
      categories[category.slug] = created;
    }
  }

  // Then create child categories (those with parentSlug)
  for (const category of seedData.categories) {
    const categoryWithParent = category as any;
    if (categoryWithParent.parentSlug) {
      const parentCategory = categories[categoryWithParent.parentSlug];
      if (parentCategory) {
        const created = await prisma.category.create({
          data: {
            name: category.name,
            slug: category.slug,
            description: category.description,
            icon: category.icon,
            displayOrder: category.displayOrder,
            parentId: parentCategory.id,
          },
        });
        categories[category.slug] = created;
      }
    }
  }

  // Seed products
  console.log("Seeding products...");
  for (const product of seedData.products) {
    const { categorySlug, ...productData } = product as any;
    const categoryId = categories[categorySlug].id;

    await prisma.product.create({
      data: {
        ...productData,
        categoryId,
      },
    });
  }

  console.log(`✅ Seeded ${seedData.categories.length} categories`);
  console.log(`✅ Seeded ${seedData.products.length} products`);
  console.log("🎉 Database seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

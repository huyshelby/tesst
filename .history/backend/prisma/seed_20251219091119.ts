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
    // Sub-categories cho điện thoại
    {
      name: "iPhone",
      slug: "iphone",
      description: "Điện thoại iPhone của Apple",
      icon: "📱",
      parentSlug: "phone",
      displayOrder: 1,
    },
    {
      name: "Samsung",
      slug: "samsung",
      description: "Điện thoại Samsung Galaxy",
      icon: "📱",
      parentSlug: "phone",
      displayOrder: 2,
    },
    {
      name: "Xiaomi",
      slug: "xiaomi",
      description: "Điện thoại Xiaomi",
      icon: "📱",
      parentSlug: "phone",
      displayOrder: 3,
    },
    {
      name: "OPPO",
      slug: "oppo",
      description: "Điện thoại OPPO",
      icon: "📱",
      parentSlug: "phone",
      displayOrder: 4,
    },
    {
      name: "Vivo",
      slug: "vivo",
      description: "Điện thoại Vivo",
      icon: "📱",
      parentSlug: "phone",
      displayOrder: 5,
    },
    {
      name: "Realme",
      slug: "realme",
      description: "Điện thoại Realme",
      icon: "📱",
      parentSlug: "phone",
      displayOrder: 6,
    },
    {
      name: "Laptop",
      slug: "laptop",
      description: "Laptop và máy tính xách tay",
      icon: "💻",
      displayOrder: 2,
    },
    {
      name: "Máy tính bảng",
      slug: "tablet",
      description: "iPad và máy tính bảng",
      icon: "📱",
      displayOrder: 3,
    },
    {
      name: "Đồng hồ thông minh",
      slug: "watch",
      description: "Smartwatch và thiết bị đeo tay",
      icon: "⌚",
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
      name: "Phụ kiện",
      slug: "accessory",
      description: "Phụ kiện và thiết bị bổ sung",
      icon: "🔌",
      displayOrder: 6,
    },
  ],
  products: [
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
      specs: { storage: "256GB", color: "Titan tự nhiên" },
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
      stock: 30,
      rating: 5,
      reviews: 89,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: { storage: "256GB", color: "Xanh dương" },
      categorySlug: "phone",
    },
    {
      name: "MacBook Air M4 13 inch",
      slug: "macbook-air-m4-13",
      description: "MacBook Air với chip M4 mạnh mẽ, siêu mỏng nhẹ",
      price: 28990000,
      listPrice: 31990000,
      image: "/pictures/Mac/macbook-air-m4.png",
      images: ["/pictures/Mac/macbook-air-m4.png"],
      brand: "Apple",
      stock: 25,
      rating: 5,
      reviews: 203,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: { ram: "16GB", storage: "512GB SSD", color: "Bạc" },
      categorySlug: "laptop",
    },
    {
      name: "MacBook Pro M4 14 inch",
      slug: "macbook-pro-m4-14",
      description: "MacBook Pro với chip M4 Pro, màn hình Liquid Retina XDR",
      price: 44990000,
      listPrice: 49990000,
      image: "/pictures/Mac/macbook-pro-m4-14.png",
      images: ["/pictures/Mac/macbook-pro-m4-14.png"],
      brand: "Apple",
      stock: 20,
      rating: 5,
      reviews: 156,
      badges: ["Mới", "Pro"],
      installment: true,
      specs: { ram: "32GB", storage: "1TB SSD", color: "Xám" },
      categorySlug: "laptop",
    },
    {
      name: "iPad Pro M4 11 inch",
      slug: "ipad-pro-m4-11",
      description: "iPad Pro với chip M4, màn hình OLED siêu sáng",
      price: 24990000,
      listPrice: 27990000,
      image: "/pictures/iPad/ipad-pro-m4-11.png",
      images: ["/pictures/iPad/ipad-pro-m4-11.png"],
      brand: "Apple",
      stock: 35,
      rating: 5,
      reviews: 98,
      badges: ["Mới", "Pro"],
      installment: true,
      specs: { storage: "256GB", color: "Bạc" },
      categorySlug: "tablet",
    },
    {
      name: "Apple Watch Series 10",
      slug: "apple-watch-series-10",
      description: "Apple Watch thế hệ mới với màn hình lớn hơn, pin tốt hơn",
      price: 10990000,
      listPrice: 12990000,
      image: "/pictures/Watch/apple-watch-series-10.png",
      images: ["/pictures/Watch/apple-watch-series-10.png"],
      brand: "Apple",
      stock: 60,
      rating: 4.8,
      reviews: 245,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: { size: "45mm", color: "Titan" },
      categorySlug: "watch",
    },
    {
      name: "AirPods Pro 3",
      slug: "airpods-pro-3",
      description: "AirPods Pro thế hệ 3 với chống ồn chủ động ANC mạnh mẽ",
      price: 5990000,
      listPrice: 6990000,
      image: "/pictures/Âm thanh/airpods-pro-3.png",
      images: ["/pictures/Âm thanh/airpods-pro-3.png"],
      brand: "Apple",
      stock: 50,
      rating: 4.9,
      reviews: 312,
      badges: ["Mới", "Best seller"],
      installment: false,
      specs: { color: "Trắng" },
      categorySlug: "audio",
    },
    {
      name: "AirPods Max 2",
      slug: "airpods-max-2",
      description: "Tai nghe over-ear cao cấp với âm thanh Hi-Fi",
      price: 12990000,
      listPrice: 14990000,
      image: "/pictures/Âm thanh/airpods-max-2.png",
      images: ["/pictures/Âm thanh/airpods-max-2.png"],
      brand: "Apple",
      stock: 40,
      rating: 4.7,
      reviews: 87,
      badges: ["Mới", "Premium"],
      installment: true,
      specs: { color: "Bạc" },
      categorySlug: "audio",
    },
    {
      name: "Magic Keyboard cho iPad Pro",
      slug: "magic-keyboard-ipad-pro",
      description: "Bàn phím Magic Keyboard với trackpad cho iPad Pro",
      price: 7990000,
      listPrice: 8990000,
      image: "/pictures/Phụ kiện/magic-keyboard.png",
      images: ["/pictures/Phụ kiện/magic-keyboard.png"],
      brand: "Apple",
      stock: 45,
      rating: 4.6,
      reviews: 124,
      badges: ["Phụ kiện chính hãng"],
      installment: false,
      specs: { color: "Đen" },
      categorySlug: "accessory",
    },
    {
      name: "Apple Pencil Pro",
      slug: "apple-pencil-pro",
      description:
        "Bút cảm ứng Apple Pencil Pro với cảm biến squeeze và barrel roll",
      price: 2990000,
      listPrice: 3490000,
      image: "/pictures/Phụ kiện/apple-pencil-pro.png",
      images: ["/pictures/Phụ kiện/apple-pencil-pro.png"],
      brand: "Apple",
      stock: 50,
      rating: 4.8,
      reviews: 156,
      badges: ["Mới", "Pro"],
      installment: false,
      specs: { color: "Trắng" },
      categorySlug: "accessory",
    },
    // Thêm sản phẩm từ frontend mock data
    {
      name: "iPhone 15 Pro Max 256GB",
      slug: "iphone-15-pro-max-256gb",
      description:
        "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.7 inch",
      price: 29990000,
      listPrice: 34990000,
      image: "/pictures/iphone-15-pro-max.jpg",
      images: [],
      brand: "Apple",
      stock: 50,
      rating: 4.8,
      reviews: 125,
      badges: ["Mới", "Trả góp 0%"],
      installment: true,
      specs: {
        ram: "8GB",
        storage: "256GB",
        screen: '6.7" Super Retina XDR',
        camera: "48MP + 12MP + 12MP",
        cpu: "Apple A17 Pro",
        battery: "4422 mAh",
        colors: "Titan Đen, Titan Trắng, Titan Tự Nhiên, Titan Xanh",
      },
      categorySlug: "iphone",
    },
    {
      name: "Samsung Galaxy S24 Ultra 512GB",
      slug: "samsung-s24-ultra-512gb",
      description:
        "Samsung Galaxy S24 Ultra với bút S Pen, camera 200MP, hiệu năng đỉnh cao",
      price: 27990000,
      listPrice: 31990000,
      image: "/pictures/samsung-s24-ultra.jpg",
      images: [],
      brand: "Samsung",
      stock: 30,
      rating: 4.7,
      reviews: 89,
      badges: ["Bán chạy"],
      installment: true,
      specs: {
        ram: "12GB",
        storage: "512GB",
        screen: '6.8" Dynamic AMOLED 2X',
        camera: "200MP + 50MP + 12MP + 10MP",
        cpu: "Snapdragon 8 Gen 3",
        battery: "5000 mAh",
        colors: "Đen, Xám, Tím, Vàng",
      },
      categorySlug: "samsung",
    },
    {
      name: "Xiaomi 14 Ultra 16GB/512GB",
      slug: "xiaomi-14-ultra-16gb-512gb",
      description:
        "Xiaomi 14 Ultra camera Leica, Snapdragon 8 Gen 3, màn hình 2K AMOLED",
      price: 24990000,
      listPrice: 27990000,
      image: "/pictures/xiaomi-14-ultra.jpg",
      images: [],
      brand: "Xiaomi",
      stock: 5,
      rating: 4.6,
      reviews: 42,
      badges: ["Giá tốt"],
      installment: true,
      specs: {
        ram: "16GB",
        storage: "512GB",
        screen: '6.73" AMOLED 2K',
        camera: "50MP + 50MP + 50MP + 50MP Leica",
        cpu: "Snapdragon 8 Gen 3",
        battery: "5000 mAh",
        colors: "Đen, Trắng, Xanh",
      },
      categorySlug: "xiaomi",
    },
    {
      name: "OPPO Find X7 Ultra",
      slug: "oppo-find-x7-ultra",
      description:
        "OPPO Find X7 Ultra với camera Hasselblad, thiết kế cao cấp",
      price: 22990000,
      listPrice: 25990000,
      image: "/pictures/oppo-find-x7.jpg",
      images: [],
      brand: "OPPO",
      stock: 0,
      rating: 4.5,
      reviews: 28,
      badges: ["Hết hàng"],
      installment: false,
      specs: {
        ram: "12GB",
        storage: "256GB",
        screen: '6.82" AMOLED 2K',
        camera: "50MP + 50MP + 50MP Hasselblad",
        cpu: "Snapdragon 8 Gen 3",
        battery: "5000 mAh",
        colors: "Đen, Nâu, Xanh",
      },
      categorySlug: "oppo",
    },
    {
      name: "iPhone 14 Pro 128GB",
      slug: "iphone-14-pro-128gb",
      description:
        "iPhone 14 Pro với Dynamic Island, camera 48MP, hiệu năng mạnh mẽ",
      price: 23990000,
      listPrice: 27990000,
      image: "/pictures/iphone-14-pro.jpg",
      images: [],
      brand: "Apple",
      stock: 75,
      rating: 4.8,
      reviews: 203,
      badges: ["Trả góp 0%"],
      installment: true,
      specs: {
        ram: "6GB",
        storage: "128GB",
        screen: '6.1" Super Retina XDR',
        camera: "48MP + 12MP + 12MP",
        cpu: "Apple A16 Bionic",
        battery: "3200 mAh",
        colors: "Đen, Tím, Vàng, Bạc",
      },
      categorySlug: "iphone",
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
  for (const category of seedData.categories) {
    const created = await prisma.category.create({
      data: category,
    });
    categories[category.slug] = created;
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

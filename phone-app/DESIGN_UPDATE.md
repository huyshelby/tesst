# 🍎 Apple Store UI - Thiết kế hiện đại theo phong cách Apple

Đã hoàn thành thiết kế website thương mại điện tử phong cách **Apple Authorized Reseller** với giao diện clean, premium và tối giản.

## ✨ Thành phần được cập nhật

### 1. **Header (`apple-header.tsx`)**

- ✅ Cố định ở đầu trang với nền trắng
- ✅ Logo "Apple Store" bên trái
- ✅ Menu ngang ở giữa: iPhone, iPad, Mac, Watch, Phụ kiện, Âm thanh, Khuyến mãi
- ✅ Icon bên phải: Tìm kiếm, Giỏ hàng, Tài khoản (dropdown)
- ✅ Responsive: Menu di động trên mobile
- ✅ Search bar mở rộng khi click

### 2. **Hero Banner (`hero-banner.tsx`)**

- ✅ Nền xanh lá đậm gradient (emerald/green)
- ✅ Chủ đề lễ hội (🎄 Lễ hội mùa lạnh)
- ✅ Text bên trái: Tiêu đề lớn, slogan, badge "Bảo hành chính hãng 12 tháng"
- ✅ Hình sản phẩm Apple bên phải (iPhone, Camera, Gimbal, Earbuds)
- ✅ Button CTA bo tròn: "Mua ngay" với hiệu ứng hover
- ✅ Decorative blurred circles

### 3. **Product Card (`apple-product-card.tsx`)**

- ✅ Hình sản phẩm nền trắng
- ✅ Badge giảm giá màu đỏ (góc trên trái)
- ✅ Label tình trạng màu xanh (góc trên phải)
- ✅ Tên sản phẩm, rating sao
- ✅ Giá bán nổi bật màu xanh, giá gạch bỏ màu xám
- ✅ Nút "Thêm vào giỏ" + Heart icon
- ✅ Hover effect với shadow và scale animation

### 4. **Category Section (`apple-category-section.tsx`)**

- ✅ Grid layout responsive (2-5 cột)
- ✅ Header với tiêu đề, "Xem tất cả" button
- ✅ Hiển thị 10 sản phẩm mỗi category
- ✅ Mobile button "Xem tất cả"
- ✅ Border separator

### 5. **Business Section (`business-section.tsx`)**

- ✅ Nền đen gradient (từ gray-900 đến black)
- ✅ "Giải pháp doanh nghiệp" / "Apple cho Doanh Nghiệp"
- ✅ 3 features với icon: Tăng năng suất, Triển khai nhanh, Hỗ trợ 24/7
- ✅ CTA button "Liên hệ chúng tôi"
- ✅ Dashboard mockup bên phải với charts và stats

### 6. **News Section (`news-section.tsx`)**

- ✅ Grid card blog 1-3 cột
- ✅ Hình ảnh, category badge màu xanh
- ✅ Tiêu đề, excerpt, ngày đăng
- ✅ "Đọc thêm" link với arrow icon
- ✅ Hover effects

### 7. **Footer (`apple-footer.tsx`)**

- ✅ Nền đen (black)
- ✅ 4 cột link: Thông tin, Sản phẩm, Chính sách, Hỗ trợ
- ✅ Liên hệ: Điện thoại, Email, Địa chỉ
- ✅ Giờ làm việc
- ✅ Social media icons (Facebook, Twitter, Instagram, LinkedIn)
- ✅ Copyright footer

### 8. **Styling Global (`globals.css`)**

- ✅ Font Inter (Apple-like)
- ✅ Smooth scroll behavior
- ✅ Typography classes
- ✅ Link & Button transitions
- ✅ Card component styling

### 9. **Main Page (`page.tsx`)**

- ✅ Tích hợp tất cả components
- ✅ Layout: Header → Hero → Categories → Business → News → Footer
- ✅ Responsive trên tất cả devices

## 📦 Packages Được Cài Đặt

```bash
npm install @radix-ui/react-dropdown-menu
```

## 🎨 Phong Cách & Màu Sắc

| Phần tử     | Màu sắc                      |
| ----------- | ---------------------------- |
| Header      | Trắng (#FFF)                 |
| Hero Banner | Xanh lá (Emerald/Green)      |
| Text chính  | Xám đen (#1F2937)            |
| Button CTA  | Xanh dương (#2563EB)         |
| Badge       | Đỏ (#DC2626), Xanh (#2563EB) |
| Giá         | Xanh (#16A34A)               |
| Footer      | Đen (#000000)                |

## 🚀 Cách Sử Dụng

1. **Khởi động dev server:**

```bash
cd phone-app
npm run dev
```

2. **Build production:**

```bash
npm run build
```

3. **Truy cập:** `http://localhost:3000`

## 📱 Responsive Design

- **Desktop**: Full layout, menu ngang
- **Tablet**: Grid điều chỉnh, menu hoạt động
- **Mobile**: Menu di động, grid 2 cột, search bar rộng

## ✅ Tính Năng

- ✨ Clean & Premium design
- 🎯 Apple-like typography (Inter font)
- 📱 Fully responsive
- ⚡ Smooth animations & transitions
- 🎨 Modern color palette
- 🔍 Search functionality
- 🛒 Shopping cart integration ready
- 📊 Business dashboard showcase
- 📰 Blog/News section
- 🏪 Multi-category product display

## 📝 Cấu Trúc File

```
src/
├── components/
│   ├── header/
│   │   └── apple-header.tsx (NEW)
│   ├── home/
│   │   ├── hero-banner.tsx (NEW)
│   │   ├── apple-category-section.tsx (NEW)
│   │   ├── business-section.tsx (NEW)
│   │   ├── news-section.tsx (NEW)
│   │   └── apple-footer.tsx (NEW)
│   ├── product/
│   │   └── apple-product-card.tsx (NEW)
│   └── ui/
│       └── dropdown-menu.tsx (NEW)
├── app/
│   ├── layout.tsx (UPDATED)
│   ├── page.tsx (UPDATED)
│   └── globals.css (UPDATED)
└── lib/
    └── mock.ts (existing)
```

---

**Thiết kế sẵn sàng để triển khai thành website thương mại điện tử Apple chính thức!** 🍎✨

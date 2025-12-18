import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const footerLinks = {
  "Thông tin": [
    { label: "Về chúng tôi", href: "/about" },
    { label: "Tuyên bố về quyền riêng tư", href: "/privacy" },
    { label: "Điều khoản sử dụng", href: "/terms" },
    { label: "Liên hệ", href: "/contact" },
  ],
  "Sản phẩm": [
    { label: "iPhone", href: "/phone" },
    { label: "iPad", href: "/tablet" },
    { label: "Mac", href: "/laptop" },
    { label: "Watch", href: "/watch" },
    { label: "Phụ kiện", href: "/accessory" },
  ],
  "Chính sách": [
    { label: "Chính sách bảo hành", href: "/warranty" },
    { label: "Chính sách trả hàng", href: "/return" },
    { label: "Chính sách bảo mật", href: "/data-privacy" },
    { label: "Hỗ trợ khách hàng", href: "/support" },
  ],
  "Hỗ trợ": [
    { label: "FAQ", href: "/faq" },
    { label: "Tài liệu", href: "/docs" },
    { label: "Tải xuống", href: "/downloads" },
    { label: "Khắc phục sự cố", href: "/troubleshoot" },
  ],
};

export default function AppleFooter() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="content-container py-16 md:py-20">
        {/* Top Section - Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-gray-800">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4 text-sm">
                {category}
              </h4>
              <nav className="space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Middle Section - Contact & Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-gray-800">
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <a
                  href="tel:1900123456"
                  className="hover:text-white transition"
                >
                  1900 123 456
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <a
                  href="mailto:support@apple.vn"
                  className="hover:text-white transition"
                >
                  support@apple.vn
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  123 Đường Ngô Gia Tự, Phường Võ Cương, Quận Bắc Từ Liêm, Hà
                  Nội
                </p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4">Giờ làm việc</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex justify-between">
                <span>Thứ Hai - Thứ Sáu:</span>
                <span>08:00 - 20:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thứ Bảy - Chủ Nhật:</span>
                <span>09:00 - 18:00</span>
              </div>
              <p className="pt-2 text-gray-500 italic">
                Đóng cửa vào các ngày lễ quốc gia
              </p>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4">
              Theo dõi chúng tôi
            </h4>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
              ].map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-900 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2025 Apple Store Việt Nam. Tất cả các quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <Link href="/accessibility" className="hover:text-white transition">
              Khả năng truy cập
            </Link>
            <Link href="/cookies" className="hover:text-white transition">
              Chính sách Cookie
            </Link>
            <Link href="/legal" className="hover:text-white transition">
              Pháp lý
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

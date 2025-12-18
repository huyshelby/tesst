import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  href: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max: Đỉnh cao của công nghệ di động",
    excerpt:
      "Khám phá những tính năng mới nhất trên iPhone 15 Pro Max với chip A17 Pro, camera nâng cấp và pin kéo dài.",
    image:
      "https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=800&auto=format&fit=crop",
    date: "15 Tháng 12, 2024",
    category: "Công nghệ",
    href: "/blog/iphone-15-pro-max",
  },
  {
    id: "2",
    title: "Cách sử dụng Apple Intelligence hiệu quả",
    excerpt:
      "Tìm hiểu cách tận dụng tối đa các tính năng AI trên các thiết bị Apple của bạn để nâng cao năng suất.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    date: "12 Tháng 12, 2024",
    category: "Hướng dẫn",
    href: "/blog/apple-intelligence",
  },
  {
    id: "3",
    title: "MacBook Pro M4: Năng lượng cho các nhà sáng tạo",
    excerpt:
      "Hiệu suất vô đối cho video editing, graphic design và development với chip M4 mới nhất.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    date: "10 Tháng 12, 2024",
    category: "Sản phẩm",
    href: "/blog/macbook-pro-m4",
  },
];

export default function NewsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="content-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tin tức & Blog
            </h2>
            <p className="text-gray-600 mt-2">
              Cập nhật công nghệ Apple mới nhất
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="hidden md:flex gap-2 text-[color:var(--color-brand)] hover:text-[color:var(--color-brand-700)]"
          >
            <Link href="/blog">
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={post.href}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-[color:var(--color-brand-600)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[color:var(--color-brand)] transition line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-[color:var(--color-brand)] font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Đọc thêm</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Mobile */}
        <div className="md:hidden mt-8">
          <Button
            asChild
            variant="outline"
            className="w-full rounded-lg border-gray-300"
          >
            <Link href="/blog">Xem tất cả bài viết</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

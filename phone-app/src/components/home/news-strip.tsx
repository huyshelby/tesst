export default function NewsStrip({ className = "" }: { className?: string }) {
  const items = [
    {
      title: "iPhone 16 series mở bán – nhiều ưu đãi",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Top laptop mỏng nhẹ 2025 cho sinh viên",
      img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "So sánh Galaxy Buds vs AirPods – chọn gì?",
      img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop",
    },
  ];
  return (
    <section className={className}>
      <h2 className="text-xl md:text-2xl font-semibold mb-3">Tin công nghệ</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {items.map((n, i) => (
          <article
            key={i}
            className="rounded-2xl overflow-hidden bg-white shadow"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={n.img} alt="news" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold line-clamp-2">{n.title}</h3>
              <a className="text-red-600 text-sm" href="#">
                Đọc tiếp
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

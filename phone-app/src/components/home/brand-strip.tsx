import Link from "next/link";
export default function BrandStrip({ className = "" }: { className?: string }) {
  const brands = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "OPPO",
    "Asus",
    "Lenovo",
    "LG",
    "Sony",
    "JBL",
  ];
  return (
    <section className={className}>
      <div className="rounded-2xl border bg-white shadow-md p-4">
        <h3 className="text-lg font-semibold mb-3">Thương hiệu nổi bật</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {brands.map((b) => (
            <Link
              key={b}
              href={`/#brand-${b.toLowerCase()}`}
              className="rounded-xl border bg-white p-4 text-center hover:shadow"
            >
              {b}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

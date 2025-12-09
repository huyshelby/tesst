import Link from "next/link";
export default function TopBar() {
  return (
    <div className="w-full bg-red-600 text-white text-xs">
      <div className="container mx-auto px-3 py-2 flex items-center justify-between gap-3">
        <div className="hidden md:block">
          Giao nhanh 2h • Trả góp 0% • Hỗ trợ 24/7
        </div>
        <div className="flex gap-4">
          <Link href="#" className="hover:underline">
            Khuyến mãi
          </Link>
          <Link href="#" className="hover:underline">
            Hệ thống cửa hàng
          </Link>
          <Link href="#" className="hover:underline">
            Bảo hành
          </Link>
        </div>
      </div>
    </div>
  );
}

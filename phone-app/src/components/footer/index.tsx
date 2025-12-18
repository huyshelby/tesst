import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t bg-slate-50">
      <div className="content-container max-w-[1280px] mx-auto px-3 py-10 grid gap-8 md:grid-cols-4">
        {/* Cột 1 */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Về chúng tôi</h4>
          <p className="text-sm text-slate-600">
            Cellshop cung cấp sản phẩm công nghệ chính hãng, giao nhanh 2h, trả
            góp 0% và hậu mãi tận tâm.
          </p>
          <div className="text-sm text-slate-600">
            <p>
              Hotline:{" "}
              <a className="font-medium text-red-600" href="tel:19001234">
                1900 1234
              </a>
            </p>
            <p>Email: support@cellshop.vn</p>
          </div>
        </div>

        {/* Cột 2 */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Chính sách</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="#" className="hover:text-slate-900">
                Bảo hành
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-slate-900">
                Đổi trả
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-slate-900">
                Giao hàng
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-slate-900">
                Bảo mật
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="#" className="hover:text-slate-900">
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-slate-900">
                Trả góp 0%
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-slate-900">
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-slate-900">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4 */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Kết nối</h4>
          <div className="flex gap-3 text-sm text-slate-600">
            <a
              href="#"
              className="rounded-md border px-3 py-2 bg-white hover:shadow"
            >
              Facebook
            </a>
            <a
              href="#"
              className="rounded-md border px-3 py-2 bg-white hover:shadow"
            >
              YouTube
            </a>
            <a
              href="#"
              className="rounded-md border px-3 py-2 bg-white hover:shadow"
            >
              Zalo
            </a>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p className="mb-2">Phương thức thanh toán</p>
            <div className="flex flex-wrap gap-2">
              {"Visa,MOMO,ATM,VNPay".split(",").map((p) => (
                <span
                  key={p}
                  className="rounded-md bg-white border px-2 py-1 text-xs"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-white">
        <div className="content-container max-w-[1280px] mx-auto px-3 py-4 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {year} Cellshop. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-700">
              Điều khoản
            </Link>
            <Link href="#" className="hover:text-slate-700">
              Quyền riêng tư
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

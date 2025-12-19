"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/mock";

export default function ProductSpecs({ product }: { product: Product }) {
  const [openSection, setOpenSection] = React.useState<string | null>(
    "display"
  );

  const specs = [
    {
      id: "display",
      title: "Màn hình",
      items: [
        { label: "Kích thước", value: '6.7" Super Retina XDR' },
        { label: "Công nghệ", value: "OLED, ProMotion 120Hz" },
        { label: "Độ phân giải", value: "2796 x 1290 pixels" },
        { label: "Độ sáng", value: "2000 nits (ngoài trời)" },
      ],
    },
    {
      id: "camera",
      title: "Camera",
      items: [
        { label: "Camera sau", value: "48MP + 12MP + 12MP" },
        { label: "Camera trước", value: "12MP TrueDepth" },
        { label: "Quay video", value: "4K ProRes, Cinematic Mode" },
        { label: "Tính năng", value: "Night mode, Deep Fusion, Smart HDR" },
      ],
    },
    {
      id: "performance",
      title: "Hiệu năng",
      items: [
        { label: "Chip", value: "Apple A17 Pro" },
        { label: "CPU", value: "6-core" },
        { label: "GPU", value: "6-core" },
        { label: "RAM", value: "8GB" },
      ],
    },
    {
      id: "battery",
      title: "Pin & Sạc",
      items: [
        { label: "Dung lượng pin", value: "4422 mAh" },
        { label: "Sạc nhanh", value: "20W (cáp riêng)" },
        { label: "Sạc không dây", value: "MagSafe 15W" },
        { label: "Thời gian sử dụng", value: "Lên đến 29 giờ" },
      ],
    },
    {
      id: "connectivity",
      title: "Kết nối",
      items: [
        { label: "SIM", value: "Nano-SIM và eSIM" },
        { label: "5G", value: "Hỗ trợ" },
        { label: "Wi-Fi", value: "Wi-Fi 6E" },
        { label: "Bluetooth", value: "5.3" },
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <section className="bg-white py-10 md:py-12">
      <div className="content-container max-w-[1000px]">
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Thông số kỹ thuật
            </h2>
            <p className="text-gray-600">Chi tiết cấu hình sản phẩm</p>
          </div>

          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {specs.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition px-4"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openSection === section.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSection === section.id && (
                  <div className="px-4 pb-6 space-y-3">
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-start gap-4"
                      >
                        <span className="text-sm text-gray-600 min-w-[120px]">
                          {item.label}
                        </span>
                        <span className="text-sm font-medium text-gray-900 text-right flex-1">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

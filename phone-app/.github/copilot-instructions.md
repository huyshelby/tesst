# Repository Instructions for GitHub Copilot

## Tiếng Việt (vi-VN)

- Luôn trả lời bằng **tiếng Việt (vi-VN)**, kể cả khi prompt bằng tiếng Anh, trừ khi người dùng yêu cầu ngược lại.
- Khi sinh mã có UI text: mặc định tiếng Việt; ưu tiên dùng key i18n thay vì hard-code.
- Comment, docstring, mô tả PR/issue: viết **tiếng Việt**; tên biến/hàm vẫn giữ tiếng Anh chuẩn.
- Khi review code: nhận xét, gợi ý cải tiến, và tóm tắt thay đổi bằng tiếng Việt.

## Project Context

- Framework: Next.js latest (App Router) + TypeScript.
- UI: TailwindCSS + shadcn/ui. Icons: lucide-react.
- State: server components ưu tiên; client components chỉ khi có interactivity.
- Backend: Express (REST). Base URL: `https://localhost:4000`. Dữ liệu JSON.
- Mục tiêu: website bán điện thoại (danh mục, bộ lọc, chi tiết, giỏ hàng, thanh toán giả lập).

## Coding Standards

- Tuân thủ ESLint + Prettier trong repo. Ưu tiên type an toàn (no `any` trừ khi thật cần).
- Import theo alias: `@/app`, `@/components`, `@/lib`, `@/types`.
- Tên file: `kebab-case.tsx/ts`. Component là PascalCase.
- Viết server actions khi có thể; tránh API route không cần thiết.
- Fetch bằng `fetch` native; **không dùng Axios**.
- UI phải responsive, có state `loading`/`error`/`empty`.

## Folder Layout (rút gọn)

- `app/(public)/products/[slug]/page.tsx` – chi tiết sản phẩm
- `app/(public)/cart/page.tsx` – giỏ hàng
- `app/(auth)/login/page.tsx`, `register/page.tsx`
- `components/ui/*` – wrapper shadcn/ui
- `lib/api.ts` – helper fetch (retry, error mapping)

## APIs & Data

- Tất cả endpoints trả `{ data, error }`. Nếu lỗi, hiển thị message thân thiện + log ở console dev.
- Chuẩn hoá giá tiền VND, định dạng ngày giờ theo `vi-VN`.

## Security & Privacy

- **Không** ghi cứng secrets/keys vào code hoặc prompt.
- Validate mọi input bằng Zod trước khi gọi API.
- Escape nội dung từ server khi render.

## UI/UX Principles

- Dùng shadcn/ui cho form, modal, dropdown.
- Phím tắt truy cập (accessibility) và aria-label cho interactive controls.
- Hình ảnh tối ưu bằng `next/image`.

## Testing & Quality

- Unit test: Vitest + React Testing Library (ưu tiên hooks/utils).
- E2E: Playwright cho luồng mua hàng cơ bản.
- Commit message: Conventional Commits (`feat:`, `fix:`, …). Mô tả rõ ràng, có scope.

## Build & Run

- Dev: `npm dev`
- Lint: `npm lint` | Test: `npm test` | Build: `npm build`
- Trước khi mở PR: chạy `npm lint && npm test`.

## Things to avoid

- Không tạo CSS tuỳ ý nếu Tailwind làm được.
- Không dùng localStorage cho dữ liệu nhạy cảm.
- Không tạo custom hook nếu logic đơn giản chỉ dùng một nơi.

## How Copilot should act

- Khi sinh code: tuân thủ chuẩn trên, chia nhỏ component, thêm state loading/error.
- Khi review: nhắc hiệu năng (memoization nhẹ, tránh re-render), accessibility, và bảo mật input.
- Nếu thiếu ngữ cảnh: **hỏi lại** bằng 1–2 câu ngắn trước khi sinh code dài.

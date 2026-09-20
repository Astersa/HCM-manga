# Ngọn Đuốc Bình Minh — trang đọc truyện

Trang web một trang (single page) để đọc bộ truyện tranh **Ngọn Đuốc Bình Minh**, xây dựng bằng Next.js 15 + Tailwind CSS v4.

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

## Thêm / sửa trang truyện

- Ảnh đặt trong `public/manga/` với tên `<chương>-<thứ tự>.png` (ví dụ `3-2.png` = chương 3, trang 2).
- Tên chương, giai đoạn, câu dẫn chỉnh trong `src/lib/meta.ts`.
- Chương không có trong `CHAPTER_META` sẽ tự hiển thị là "Chương N".

Trang được render tĩnh khi build, nên sau khi thêm ảnh chỉ cần build lại.

## Deploy lên Vercel

**Cách 1 — qua GitHub (khuyên dùng):**

```bash
git init
git add .
git commit -m "Ngọn Đuốc Bình Minh"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Vào https://vercel.com/new → Import repo → Deploy (Vercel tự nhận Next.js, không cần cấu hình).

**Cách 2 — Vercel CLI:**

```bash
npm i -g vercel
vercel        # deploy preview
vercel --prod # deploy production
```

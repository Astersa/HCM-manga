import fs from "node:fs";
import path from "node:path";
import { CHAPTER_META } from "./meta";

export type Page = {
  /** Thứ tự trang trong chương (bắt đầu từ 1) */
  index: number;
  /** Đường dẫn public, ví dụ /manga/1-2.png */
  src: string;
  width: number;
  height: number;
};

export type Chapter = {
  number: number;
  slug: string;
  title: string;
  era?: string;
  tagline?: string;
  pages: Page[];
};

const IMAGE_DIR = path.join(process.cwd(), "public", "manga");
const FILE_RE = /^(\d+)-(\d+)\.(png|jpe?g|webp|avif)$/i;

// Ảnh gốc của bộ này đều 1024×1536; đọc header PNG để lấy đúng kích thước nếu có.
function readDimensions(file: string): { width: number; height: number } {
  try {
    const fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    if (buf.toString("ascii", 1, 4) === "PNG") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
  } catch {
    /* fall through */
  }
  return { width: 1024, height: 1536 };
}

/** Quét thư mục public/manga và gom ảnh thành các chương, sắp xếp đúng thứ tự. */
export function getChapters(): Chapter[] {
  const files = fs.readdirSync(IMAGE_DIR);
  const map = new Map<number, Page[]>();

  for (const name of files) {
    const m = FILE_RE.exec(name);
    if (!m) continue;
    const chapter = Number(m[1]);
    const index = Number(m[2]);
    const dims = readDimensions(path.join(IMAGE_DIR, name));
    const list = map.get(chapter) ?? [];
    list.push({ index, src: `/manga/${name}`, ...dims });
    map.set(chapter, list);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([number, pages]) => {
      const meta = CHAPTER_META[number];
      return {
        number,
        slug: `chuong-${number}`,
        title: meta?.title ?? `Chương ${number}`,
        era: meta?.era,
        tagline: meta?.tagline,
        pages: pages.sort((a, b) => a.index - b.index),
      };
    });
}

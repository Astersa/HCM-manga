"use client";

import { useEffect, useState } from "react";
import type { Chapter } from "@/lib/manga";
import { LAST_READ_KEY, type LastRead } from "@/lib/storage";

export default function ContinueReading({ chapters }: { chapters: Chapter[] }) {
  const [last, setLast] = useState<LastRead | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_READ_KEY);
      if (raw) setLast(JSON.parse(raw) as LastRead);
    } catch {
      /* ignore */
    }
  }, []);

  if (!last) return null;
  const chapter = chapters.find((c) => c.number === last.chapter);
  if (!chapter) return null;
  // Nếu mới chỉ ở trang đầu chương 1 thì không cần nút "đọc tiếp"
  if (chapter.number === chapters[0]?.number && last.page <= 1) return null;

  return (
    <a
      href={`#${chapter.slug}-p${last.page}`}
      className="inline-flex items-center gap-2 rounded-sm px-3 py-3 text-sm text-gold underline-offset-4 transition hover:underline"
    >
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      Đọc tiếp · Chương {chapter.number}, trang {last.page}
    </a>
  );
}

"use client";

import Image from "next/image";
import type { Chapter } from "@/lib/manga";

type Props = {
  chapters: Chapter[];
  active: number;
  onSelect?: () => void;
  compact?: boolean;
};

export default function ChapterList({ chapters, active, onSelect, compact }: Props) {
  return (
    <ol className="flex flex-col gap-1">
      {chapters.map((c) => {
        const isActive = c.number === active;
        const cover = c.pages[0];
        return (
          <li key={c.number}>
            <a
              href={`#${c.slug}`}
              onClick={onSelect}
              aria-current={isActive ? "true" : undefined}
              className={`group flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 transition ${
                isActive
                  ? "border-crimson bg-paper/[0.06] text-paper"
                  : "border-transparent text-paper-2/80 hover:border-paper-3/50 hover:bg-paper/[0.04] hover:text-paper"
              }`}
            >
              {cover && !compact && (
                <span className="relative block h-14 w-10 shrink-0 overflow-hidden rounded-[2px] bg-paper-3 ring-1 ring-paper-3/30">
                  <Image
                    src={cover.src}
                    alt=""
                    fill
                    sizes="40px"
                    className={`object-cover object-top transition ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}
                  />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span
                    className={`font-display text-lg font-semibold leading-none ${
                      isActive ? "text-crimson-2" : "text-gold/80"
                    }`}
                  >
                    {String(c.number).padStart(2, "0")}
                  </span>
                  {c.era && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      {c.era}
                    </span>
                  )}
                </span>
                <span className="mt-1 line-clamp-2 text-sm font-medium leading-snug">
                  {c.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted">
                  {c.pages.length} trang
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import type { Chapter, Page } from "@/lib/manga";

type Props = {
  chapter: Chapter;
  page: Page;
  priority?: boolean;
};

export default function MangaPage({ chapter, page, priority }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure
      id={`${chapter.slug}-p${page.index}`}
      data-chapter={chapter.number}
      data-page={page.index}
      className="relative scroll-mt-24"
    >
      <div
        className="relative overflow-hidden rounded-[3px] bg-paper-2 p-1 shadow-page sm:p-1.5"
        style={{ aspectRatio: `${page.width} / ${page.height}` }}
      >
        {!loaded && <div className="shimmer absolute inset-1 rounded-[2px] sm:inset-1.5" />}
        <Image
          src={page.src}
          alt={`${chapter.title} — trang ${page.index}`}
          width={page.width}
          height={page.height}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={85}
          sizes="(min-width: 1280px) 1000px, (min-width: 1024px) 860px, 100vw"
          onLoad={() => setLoaded(true)}
          className={`page-img h-auto w-full rounded-[2px] ${loaded ? "is-loaded" : ""}`}
        />
      </div>
      <figcaption className="mt-2 flex items-center justify-between px-1 font-display text-[11px] uppercase tracking-[0.25em] text-muted/70">
        <span>Chương {chapter.number}</span>
        <span>
          {page.index} / {chapter.pages.length}
        </span>
      </figcaption>
    </figure>
  );
}

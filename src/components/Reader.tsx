"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Chapter } from "@/lib/manga";
import { MANGA } from "@/lib/meta";
import { LAST_READ_KEY, WIDTH_KEY, type WidthMode } from "@/lib/storage";
import ChapterList from "./ChapterList";
import MangaPage from "./MangaPage";

type Props = { chapters: Chapter[] };

function Icon({ d, className = "size-4" }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export default function Reader({ chapters }: Props) {
  const totalPages = useMemo(
    () => chapters.reduce((n, c) => n + c.pages.length, 0),
    [chapters],
  );

  const [active, setActive] = useState({
    chapter: chapters[0]?.number ?? 1,
    page: 1,
  });
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [width, setWidth] = useState<WidthMode>("fit");
  const [menuOpen, setMenuOpen] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  const activeChapter = chapters.find((c) => c.number === active.chapter);
  const activeIdx = chapters.findIndex((c) => c.number === active.chapter);
  const prev = chapters[activeIdx - 1];
  const next = chapters[activeIdx + 1];

  // Khôi phục chế độ rộng
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WIDTH_KEY) as WidthMode | null;
      if (saved === "fit" || saved === "wide") setWidth(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleWidth = useCallback(() => {
    setWidth((w) => {
      const nextMode: WidthMode = w === "fit" ? "wide" : "fit";
      try {
        localStorage.setItem(WIDTH_KEY, nextMode);
      } catch {
        /* ignore */
      }
      return nextMode;
    });
  }, []);

  // Tiến độ cuộn + hiện thanh trên sau khi qua phần hero
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = readerRef.current;
        setShowBar(window.scrollY > 320);
        if (!el) return;
        const start = el.offsetTop - 80;
        const end = el.offsetTop + el.offsetHeight - window.innerHeight;
        const p = (window.scrollY - start) / Math.max(1, end - start);
        setProgress(Math.min(1, Math.max(0, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll-spy: xác định trang đang đọc bằng dải giữa màn hình
  useEffect(() => {
    const el = readerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-chapter][data-page]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const chapter = Number(e.target.getAttribute("data-chapter"));
          const page = Number(e.target.getAttribute("data-page"));
          setActive((a) => (a.chapter === chapter && a.page === page ? a : { chapter, page }));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [chapters]);

  // Lưu vị trí đọc gần nhất
  useEffect(() => {
    if (!showBar) return; // chưa bắt đầu đọc thì không lưu
    try {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(active));
    } catch {
      /* ignore */
    }
  }, [active, showBar]);

  // Phím tắt: ← → chuyển chương, Esc đóng mục lục
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "ArrowRight" && next) location.hash = `#${next.slug}`;
      if (e.key === "ArrowLeft" && prev) location.hash = `#${prev.slug}`;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Khoá cuộn khi mở mục lục
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const readSoFar = useMemo(() => {
    let n = 0;
    for (const c of chapters) {
      if (c.number < active.chapter) n += c.pages.length;
      else if (c.number === active.chapter) n += active.page;
    }
    return n;
  }, [chapters, active]);

  return (
    <>
      {/* ---------- Thanh trên ---------- */}
      <div
        className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ${
          showBar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="border-b border-paper-3/15 bg-ink/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
            <a
              href="#top"
              className="hidden shrink-0 font-display text-sm font-semibold uppercase tracking-[0.2em] text-paper sm:block"
            >
              {MANGA.title}
            </a>
            <span className="hidden h-5 w-px bg-paper-3/25 sm:block" />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-sm px-2 py-1.5 text-left transition hover:bg-paper/5"
              aria-haspopup="dialog"
            >
              <span className="shrink-0 font-display text-base font-semibold text-crimson-2">
                {String(active.chapter).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-paper-2">
                {activeChapter?.title}
              </span>
              <Icon d="m6 9 6 6 6-6" className="size-4 shrink-0 text-muted" />
            </button>

            <span className="shrink-0 font-display text-xs uppercase tracking-[0.2em] text-muted">
              Trang {active.page}/{activeChapter?.pages.length ?? 0}
            </span>

            <button
              type="button"
              onClick={toggleWidth}
              title={width === "fit" ? "Mở rộng khung đọc" : "Thu hẹp khung đọc"}
              className="hidden shrink-0 rounded-sm border border-paper-3/25 p-2 text-paper-2 transition hover:border-paper-3/60 hover:text-paper lg:block"
            >
              {width === "fit" ? (
                <Icon d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              ) : (
                <Icon d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              )}
            </button>
          </div>
        </div>
        {/* Thanh tiến độ */}
        <div className="h-0.5 w-full bg-ink-3">
          <div
            className="h-full bg-gradient-to-r from-crimson via-crimson-2 to-gold transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* ---------- Nội dung ---------- */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="lg:grid lg:grid-cols-[17rem_1fr] lg:gap-10 xl:grid-cols-[19rem_1fr]">
          {/* Mục lục cố định (desktop) */}
          <aside id="muc-luc" className="scroll-mt-24 py-10 lg:py-16">
            <div className="lg:sticky lg:top-24">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-paper">
                  Mục lục
                </h2>
                <span className="text-xs text-muted">
                  {readSoFar}/{totalPages} trang
                </span>
              </div>
              <div className="rule mb-4" />
              <ChapterList chapters={chapters} active={active.chapter} />
              <p className="mt-6 hidden text-[11px] leading-relaxed text-muted lg:block">
                Phím <kbd className="rounded border border-paper-3/30 px-1">←</kbd>{" "}
                <kbd className="rounded border border-paper-3/30 px-1">→</kbd> để chuyển chương.
              </p>
            </div>
          </aside>

          {/* Khung đọc */}
          <div ref={readerRef} className="pb-32 lg:py-16">
            <div
              className={`mx-auto transition-[max-width] duration-300 ${
                width === "wide" ? "max-w-[1000px]" : "max-w-[860px]"
              }`}
            >
              {chapters.map((chapter, ci) => (
                <section key={chapter.number} id={chapter.slug} className="scroll-mt-20">
                  {/* Tiêu đề chương */}
                  <div className={`relative ${ci === 0 ? "" : "mt-24"} mb-8`}>
                    <div className="flex items-end gap-5">
                      <span className="font-display text-7xl font-bold leading-[0.8] text-paper/10 sm:text-8xl">
                        {String(chapter.number).padStart(2, "0")}
                      </span>
                      <div className="pb-1">
                        <p className="font-display text-xs uppercase tracking-[0.35em] text-gold">
                          Chương {chapter.number}
                          {chapter.era ? ` · ${chapter.era}` : ""}
                        </p>
                        <h3 className="mt-1 font-display text-2xl font-semibold uppercase leading-tight text-paper sm:text-3xl">
                          {chapter.title}
                        </h3>
                        {chapter.tagline && (
                          <p className="mt-1 text-sm italic text-muted">“{chapter.tagline}”</p>
                        )}
                      </div>
                    </div>
                    <div className="rule mt-5" />
                  </div>

                  {/* Các trang */}
                  <div className="flex flex-col gap-5">
                    {chapter.pages.map((page, pi) => (
                      <MangaPage
                        key={page.src}
                        chapter={chapter}
                        page={page}
                        priority={ci === 0 && pi === 0}
                      />
                    ))}
                  </div>

                  {/* Kết chương */}
                  <div className="mt-10 flex items-center justify-between gap-4 rounded-sm border border-paper-3/15 bg-ink-2/60 px-4 py-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="font-display text-[11px] uppercase tracking-[0.3em] text-muted">
                        Hết chương {chapter.number}
                      </p>
                      {chapters[ci + 1] ? (
                        <p className="mt-0.5 truncate text-sm text-paper-2">
                          Tiếp theo: <span className="text-paper">{chapters[ci + 1].title}</span>
                        </p>
                      ) : (
                        <p className="mt-0.5 text-sm text-paper-2">Bạn đã đọc hết bộ truyện.</p>
                      )}
                    </div>
                    {chapters[ci + 1] ? (
                      <a
                        href={`#${chapters[ci + 1].slug}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-crimson px-4 py-2 font-display text-sm font-semibold uppercase tracking-wider text-paper transition hover:bg-crimson-2"
                      >
                        Chương sau <Icon d="M5 12h14m-6-6 6 6-6 6" />
                      </a>
                    ) : (
                      <a
                        href="#top"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-paper-3/40 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wider text-paper-2 transition hover:border-paper-3 hover:text-paper"
                      >
                        Về đầu <Icon d="M12 19V5m-7 7 7-7 7 7" />
                      </a>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Điều khiển nổi ---------- */}
      <nav
        aria-label="Điều hướng chương"
        className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-all duration-300 ${
          showBar ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 rounded-full border border-paper-3/20 bg-ink-2/90 p-1.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)] backdrop-blur-md">
          <a
            href={prev ? `#${prev.slug}` : undefined}
            aria-disabled={!prev}
            title="Chương trước"
            className={`rounded-full p-2.5 transition ${
              prev ? "text-paper-2 hover:bg-paper/10 hover:text-paper" : "pointer-events-none text-muted/40"
            }`}
          >
            <Icon d="m15 18-6-6 6-6" className="size-5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-semibold uppercase tracking-wider text-paper transition hover:bg-paper/10"
          >
            <Icon d="M4 6h16M4 12h16M4 18h10" />
            Chương {active.chapter}
          </button>
          <a
            href={next ? `#${next.slug}` : undefined}
            aria-disabled={!next}
            title="Chương sau"
            className={`rounded-full p-2.5 transition ${
              next ? "text-paper-2 hover:bg-paper/10 hover:text-paper" : "pointer-events-none text-muted/40"
            }`}
          >
            <Icon d="m9 18 6-6-6-6" className="size-5" />
          </a>
          <span className="mx-1 h-5 w-px bg-paper-3/25" />
          <a
            href="#top"
            title="Lên đầu trang"
            className="rounded-full p-2.5 text-paper-2 transition hover:bg-paper/10 hover:text-paper"
          >
            <Icon d="M12 19V5m-7 7 7-7 7 7" className="size-5" />
          </a>
        </div>
      </nav>

      {/* ---------- Hộp mục lục ---------- */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mục lục"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        >
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />
          <div className="rise relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-lg border border-paper-3/20 bg-ink-2 p-4 shadow-2xl sm:rounded-lg sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.3em] text-gold">
                  {MANGA.title}
                </p>
                <h2 className="font-display text-2xl font-semibold uppercase text-paper">
                  Mục lục
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2 text-muted transition hover:bg-paper/10 hover:text-paper"
                aria-label="Đóng mục lục"
              >
                <Icon d="M18 6 6 18M6 6l12 12" className="size-5" />
              </button>
            </div>
            <ChapterList
              chapters={chapters}
              active={active.chapter}
              onSelect={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

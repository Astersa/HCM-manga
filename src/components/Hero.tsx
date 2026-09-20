import Image from "next/image";
import type { Chapter } from "@/lib/manga";
import { MANGA } from "@/lib/meta";
import ContinueReading from "./ContinueReading";

type Props = { chapters: Chapter[] };

export default function Hero({ chapters }: Props) {
  const cover = chapters[0]?.pages[0];
  const second = chapters[1]?.pages[0] ?? chapters[0]?.pages[1];
  const totalPages = chapters.reduce((n, c) => n + c.pages.length, 0);
  const first = chapters[0];
  const last = chapters[chapters.length - 1];

  return (
    <header className="relative isolate overflow-hidden">
      {/* Nền: ảnh bìa làm mờ + phủ tối + vân giấy */}
      {cover && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={cover.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top scale-110 blur-2xl opacity-40 saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        </div>
      )}
      <div className="grain vignette absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-24 sm:px-8 lg:min-h-[92dvh] lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-8 lg:pb-16 lg:pt-20">
        {/* ---- Văn bản ---- */}
        <div className="relative z-10 max-w-2xl">
          <p className="rise rise-1 font-display text-xs font-medium uppercase tracking-[0.35em] text-gold sm:text-sm">
            Truyện tranh lịch sử · {chapters.length} chương · {totalPages} trang
          </p>

          <h1 className="rise rise-2 mt-6 font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight text-paper sm:text-7xl lg:text-8xl">
            Ngọn Đuốc
            <br />
            <span className="brush inline-block px-2 text-paper">Bình Minh</span>
          </h1>

          <p className="rise rise-3 mt-7 max-w-xl text-lg text-paper-2/90 sm:text-xl">
            {MANGA.subtitle}
          </p>
          <p className="rise rise-3 mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {MANGA.description}
          </p>

          <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`#${first?.slug ?? "doc"}`}
              className="group inline-flex items-center gap-2 rounded-sm bg-crimson px-6 py-3 font-display text-base font-semibold uppercase tracking-wider text-paper shadow-[0_10px_30px_-10px_rgb(155_44_44/0.8)] transition hover:bg-crimson-2 hover:shadow-[0_14px_36px_-10px_rgb(194_64_47/0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Đọc từ đầu
              <svg
                className="size-4 transition group-hover:translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
            <a
              href="#muc-luc"
              className="inline-flex items-center gap-2 rounded-sm border border-paper-3/40 px-6 py-3 font-display text-base font-medium uppercase tracking-wider text-paper-2 transition hover:border-paper-3 hover:bg-paper/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Mục lục
            </a>
            <ContinueReading chapters={chapters} />
          </div>

          <dl className="rise rise-4 mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-paper-3/20 pt-6">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.25em] text-muted">Chương</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-paper">
                {String(chapters.length).padStart(2, "0")}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.25em] text-muted">Trang</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-paper">
                {String(totalPages).padStart(2, "0")}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.25em] text-muted">Giai đoạn</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-paper">
                {last?.era?.split("–").pop()?.trim() ?? "1945"}
              </dd>
            </div>
          </dl>
        </div>

        {/* ---- Bìa truyện ---- */}
        {cover && (
          <div className="rise rise-3 relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="relative aspect-[2/3]">
              {second && (
                <div className="absolute inset-0 translate-x-6 -translate-y-3 rotate-6 rounded-sm bg-paper-3 p-1.5 opacity-70 shadow-page">
                  <Image
                    src={second.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 28rem, 90vw"
                    className="rounded-[2px] object-cover sepia-[.3]"
                  />
                </div>
              )}
              <div className="absolute inset-0 -rotate-2 rounded-sm bg-paper p-1.5 shadow-page transition duration-700 hover:rotate-0">
                <Image
                  src={cover.src}
                  alt={`Bìa truyện ${MANGA.title}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className="rounded-[2px] object-cover"
                />
              </div>
              <span className="absolute -bottom-4 -left-4 rounded-sm bg-crimson px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.3em] text-paper shadow-lg">
                {MANGA.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chỉ báo cuộn */}
      <a
        href={`#${first?.slug ?? "doc"}`}
        aria-label="Cuộn xuống để đọc"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition hover:text-paper lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Cuộn</span>
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-paper-3 to-transparent" />
      </a>
    </header>
  );
}

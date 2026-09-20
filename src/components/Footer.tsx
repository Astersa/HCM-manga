import { MANGA } from "@/lib/meta";

export default function Footer() {
  return (
    <footer className="relative border-t border-paper-3/15 bg-ink-2/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-paper">
            {MANGA.title}
          </p>
          <p className="mt-1 text-xs text-muted">{MANGA.subtitle}</p>
        </div>
        <p className="text-xs text-muted">
          {MANGA.genres.join(" · ")} · {MANGA.status}
        </p>
      </div>
    </footer>
  );
}

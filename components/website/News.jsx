"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "@/components/common/icons";
import { NEWS_TABS, sampleFor } from "@/lib/news";
import { cn } from "@/lib/utils";

const TABS = NEWS_TABS;

export default function News({ section }) {
  const [tab, setTab] = useState(TABS[0]);
  const [articles, setArticles] = useState(() => sampleFor(TABS[0]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/news?tab=${encodeURIComponent(tab)}`)
      .then((r) => r.json())
      .then((data) => {
        // Each tab falls back to its own category, never to another tab.
        if (!cancelled) setArticles(data.articles?.length ? data.articles : sampleFor(tab));
      })
      .catch(() => {
        if (!cancelled) setArticles(sampleFor(tab));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  return (
    <section id="news" className="relative py-24">
      <div className="text-center">
        <h3 className="text-sm uppercase tracking-widest text-[#a19c8f]">{section.eyebrow}</h3>
        <h2 className="mt-2 text-3xl font-bold text-white">
          {section.title} <span className="text-[#f5c451]">{section.subtitle}</span>
        </h2>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap justify-center gap-2 px-4 sm:px-6">
        {TABS.map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition",
              tab === k
                ? "bg-gold-gradient text-[#0a0805]"
                : "border border-[rgba(212,175,55,0.35)] text-[#c9c4b8] hover:text-[#f5c451]",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 min-h-100 max-w-7xl px-4 sm:px-6">
        {loading ? (
          <div className="flex min-h-75 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#f5c451]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((n) => (
              <article
                key={n.id}
                className="glass-panel card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(20,18,15,0.6)] backdrop-blur-md"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={n.img}
                    alt={n.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0805] via-[#0a0805]/40 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#f5c451] backdrop-blur">
                    {n.src}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#f2f0eb] backdrop-blur">
                    {n.date}
                  </span>
                </div>

                <div className="flex grow flex-col p-6">
                  <h4 className={`${n.excerpt ? "line-clamp-2" : "line-clamp-3"} font-display text-lg font-bold leading-snug text-[#f2f0eb]`}>
                    {n.title}
                  </h4>
                  {n.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-[#c9c4b8]">{n.excerpt}</p> : null}
                  <div className="mt-auto pt-4">
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#f5c451] transition hover:text-white"
                    >
                      Read <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {!loading && articles.some((n) => n.src === "Investing.com") ? (
          <p className="mt-6 text-center text-xs text-[#a19c8f]">
            Headlines from{" "}
            <a href="https://www.investing.com" target="_blank" rel="noopener noreferrer" className="text-[#f5c451] hover:text-white">
              Investing.com
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}

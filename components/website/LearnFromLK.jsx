import { getIcon } from "@/components/common/icons";
import { Reveal, CountUp, GoldButton, GhostGoldButton } from "@/components/common/Primitives";
import { BadgeCheck, Play, Youtube } from "lucide-react";
import { withBold } from "@/components/common/RichText";

const DEFAULT_CREDENTIAL = "NISM Certified · Verified Trader";

const linkProps = (href) =>
  /^https?:\/\//.test(href || "") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export default function LearnFromLK({ section, stats }) {
  const f = section.fields || {};
  const subs = stats.find((s) => s.label === "Subscribers");
  const imageUrl = f.imageUrl?.trim();
  // Upgrade earlier default photos while preserving custom admin images.
  const useMentorPortrait = !imageUrl ||
    imageUrl === "/images/lk-mentor-gold-glasses.webp" ||
    imageUrl === "/images/lk-mentor-casual-smile.webp" ||
    imageUrl.startsWith("https://images.unsplash.com/photo-1642790106117-e829e14a795f");
  const portraitAlt = "LK in a pale green patterned shirt with his arms crossed";
  // Older databases have no credential field yet; show the default until set.
  const credential = (f.credentialBadge ?? DEFAULT_CREDENTIAL).trim();

  return (
    <section id="learn" className="relative overflow-hidden bg-[#050505] py-24">
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(245,196,81,0.1),rgba(245,196,81,0.03)_45%,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <div className="eyebrow mb-4">{section.eyebrow}</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-3xl font-bold leading-tight text-[#f2f0eb] sm:text-4xl md:text-5xl">
              {section.title} <span className="text-gold-gradient">{section.subtitle}</span>
            </h2>
          </Reveal>
          {credential ? (
            <Reveal delay={0.08}>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(245,196,81,0.45)] bg-[rgba(245,196,81,0.08)] px-4 py-2">
                <BadgeCheck className="h-5 w-5 shrink-0 text-[#f5c451]" strokeWidth={2.4} />
                <span className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#f5c451]">
                  {credential}
                </span>
              </div>
            </Reveal>
          ) : null}
          {f.paragraph1 ? (
            <Reveal delay={0.12}>
              <p className="mt-6 text-[15px] leading-relaxed text-[#c9c4b8]">{withBold(f.paragraph1)}</p>
            </Reveal>
          ) : null}
          {f.paragraph2 ? (
            <Reveal delay={0.18}>
              <p className="mt-4 text-[15px] leading-relaxed text-[#c9c4b8]">{withBold(f.paragraph2)}</p>
            </Reveal>
          ) : null}

          {stats.length ? (
            <Reveal delay={0.24}>
              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                {stats.map((s) => {
                  const Icon = getIcon(s.iconKey);
                  return (
                    <div
                      key={s.label}
                      className="rounded-xl border border-[rgba(212,175,55,0.18)] bg-[#080704] px-3 py-4 text-center"
                    >
                      <Icon className="mx-auto h-4 w-4 text-[#f5c451]" />
                      <div className="mt-2 font-display text-lg font-bold text-gold-gradient sm:text-xl">
                        {s.countUp ? (
                          <CountUp end={Number(s.value)} suffix={s.suffix || ""} />
                        ) : (
                          `${s.value}${s.suffix || ""}`
                        )}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#a19c8f]">
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              {f.ctaText ? (
                <GoldButton as="a" href={f.ctaLink || "#"} {...linkProps(f.ctaLink)}>
                  <Youtube className="h-4 w-4" /> {f.ctaText}
                </GoldButton>
              ) : null}
              {f.secondaryCtaText ? (
                <GhostGoldButton as="a" href={f.secondaryCtaLink || "#"} {...linkProps(f.secondaryCtaLink)}>
                  <Play className="h-4 w-4" /> {f.secondaryCtaText}
                </GhostGoldButton>
              ) : null}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative overflow-hidden">
              <img
                src={useMentorPortrait ? "/images/lk-mentor-thumbnail.webp" : imageUrl}
                alt={useMentorPortrait ? portraitAlt : f.imageAlt || portraitAlt}
                width={1122}
                height={1402}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-contain object-top"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#050505] to-transparent" />
            </div>

            <a
              href={f.ctaLink || "#"}
              {...linkProps(f.ctaLink)}
              className="glass-panel absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:border-[rgba(245,196,81,0.6)] sm:left-auto sm:right-6 sm:max-w-xs"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ff0033] text-white">
                <Youtube className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-bold text-[#f2f0eb]">
                  {f.channelHandle}
                </span>
                {subs ? (
                  <span className="block text-xs text-[#a19c8f]">
                    {Number(subs.value) >= 1000
                      ? `${(Number(subs.value) / 1000).toFixed(1).replace(/\.0$/, "")}K`
                      : subs.value}
                    {subs.suffix} subscribers
                  </span>
                ) : null}
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

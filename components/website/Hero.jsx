import { ArrowRight, Check, Play, Youtube, Globe, getIcon } from "@/components/common/icons";
import {
  Reveal,
  CountUp,
  GoldButton,
  GhostGoldButton,
  GoldSparks,
} from "@/components/common/Primitives";
import HeroCoin from "./HeroCoin";

export default function Hero({ section, checks, stats, settings }) {
  const f = section.fields || {};
  const [line1, line2, line3] = (section.title || "").split("|");

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#050505] pt-32 pb-16 md:pt-40 md:pb-24"
    >
      <div className="dot-grid-bg absolute inset-0 opacity-20" />
      <GoldSparks />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <div className="eyebrow mb-5">{section.eyebrow}</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-5xl font-bold leading-[0.95] text-[#f2f0eb] sm:text-6xl md:text-7xl">
              {line1}
              <br />
              {line2}
              <br />
              <span className="text-gold-gradient">{line3}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#c9c4b8]">
              {section.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <ul className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
              {checks.map((c) => (
                <li key={c} className="flex items-center gap-3 text-sm text-[#e6e2d6]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-gradient text-[#0a0805]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-9 flex flex-wrap gap-4">
              <GoldButton as="a" href={f.primaryButtonLink || "#contact"}>
                {f.primaryButtonText || "Join Community"} <ArrowRight className="h-4 w-4" />
              </GoldButton>
              <GhostGoldButton as="a" href={f.secondaryButtonLink || "#videos"}>
                {f.secondaryButtonText || "Watch Videos"}{" "}
                <Play className="h-4 w-4 fill-[#f5c451]" />
              </GhostGoldButton>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={0}>
          {/* Coin on its own, no podium. Sized so it reads clearly without
              crowding the headline: ~70% of a phone width, up to 440px on desktop. */}
          <div className="relative mx-auto w-[72%] max-w-[300px] py-6 sm:max-w-[360px] lg:w-[80%] lg:max-w-[440px] lg:py-10">
            <div
              aria-hidden
              className="absolute inset-[-18%] -z-20 opacity-80"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(245,196,81,0.26), rgba(212,175,55,0.1) 35%, rgba(212,175,55,0.03) 55%, transparent 70%)",
              }}
            />
            <HeroCoin drive="auto" shadow />
          </div>
        </Reveal>
      </div>

      {/* Stat bar */}
      <div className="relative mx-auto mt-14 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="glass-panel-strong flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e6483c]/90">
                <Youtube className="h-5 w-5 text-white" />
              </span>
              <div>
                <div className="text-sm font-bold text-[#f2f0eb]">
                  {f.channelName || settings.siteName}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-[#c9c4b8]">
                  {f.channelSubtitle || "Visit our YouTube Channel"}
                </div>
              </div>
            </div>

            {stats.map((s) => {
              const Icon = getIcon(s.iconKey);
              return (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className="text-[#f5c451]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#f2f0eb]">
                      {s.countUp ? (
                        <>
                          <CountUp end={Number(s.value)} />
                          {s.suffix}
                        </>
                      ) : (
                        `${s.value}${s.suffix || ""}`
                      )}
                    </div>
                    <div className="text-[11px] uppercase tracking-widest text-[#c9c4b8]">
                      {s.meta || s.label}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-2.5">
              <span className="text-[#f5c451]">
                <Globe className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-[#f2f0eb]">youtube.com/</div>
                <div className="text-[11px] uppercase tracking-widest text-[#c9c4b8]">
                  {f.channelHandle || "@TradewithLK55"}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

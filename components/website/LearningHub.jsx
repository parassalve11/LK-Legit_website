import { ExternalLink, Play, Video, Youtube, getIcon } from "@/components/common/icons";
import {
  Reveal,
  SectionHeader,
  GoldButton,
  GhostGoldButton,
} from "@/components/common/Primitives";

export default function LearningHub({ section, categories, videos }) {
  const f = section.fields || {};
  const channel = f.channelUrl || "https://www.youtube.com/@TradewithLK55";

  return (
    <section id="videos" className="relative py-24">
      <SectionHeader
        eyebrow={section.eyebrow}
        title={section.title}
        gold={f.titleGold}
        sub={section.subtitle}
      />

      <div className="mx-auto mt-8 flex max-w-7xl justify-center px-4 sm:px-6">
        <GoldButton as="a" href={channel} target="_blank" rel="noopener noreferrer">
          <Youtube className="h-4 w-4" /> Subscribe
        </GoldButton>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((c, i) => {
          const Icon = getIcon(c.iconKey);
          return (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="glass-panel card-lift flex flex-col items-center gap-3 rounded-xl px-4 py-5 text-center">
                <Icon className="h-6 w-6 text-[#f5c451]" />
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e6e2d6]">
                  {c.title}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v, i) => (
          <Reveal key={v.youtubeId} delay={i * 0.06}>
            <a
              href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel card-lift group block overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-video overflow-hidden bg-[#0e0b06]">
                <img
                  src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-[#0a0805] shadow-[0_10px_25px_-8px_rgba(212,175,55,0.6)]">
                    <Play className="h-6 w-6 fill-[#0a0805]" />
                  </span>
                </div>
                {v.duration ? (
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-[#f2f0eb]">
                    {v.duration}
                  </div>
                ) : null}
              </div>
              <div className="p-4">
                <h4 className="line-clamp-2 text-sm font-semibold text-[#f2f0eb]">{v.title}</h4>
                {v.views || v.duration ? (
                  <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#a19c8f]">
                    {v.views ? <span>{v.views} views</span> : null}
                    {v.views && v.duration ? <span>·</span> : null}
                    {v.duration ? <span>{v.duration}</span> : null}
                  </div>
                ) : null}
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c451]">
                  Watch on YouTube <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-3 px-4 sm:px-6">
        <GoldButton as="a" href={channel} target="_blank" rel="noopener noreferrer">
          <Youtube className="h-4 w-4" /> Subscribe on YouTube
        </GoldButton>
        <GhostGoldButton as="a" href={`${channel}/videos`} target="_blank" rel="noopener noreferrer">
          <Play className="h-4 w-4 fill-[#f5c451]" /> Watch Latest Videos
        </GhostGoldButton>
        <GhostGoldButton as="a" href={`${channel}/shorts`} target="_blank" rel="noopener noreferrer">
          <Video className="h-4 w-4" /> View Shorts
        </GhostGoldButton>
        <GhostGoldButton as="a" href={`${channel}/streams`} target="_blank" rel="noopener noreferrer">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-[#e6483c]" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#e6483c]" />
          </span>
          Watch Live Streams
        </GhostGoldButton>
      </div>
    </section>
  );
}

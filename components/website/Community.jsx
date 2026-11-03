import { ArrowRight, getIcon } from "@/components/common/icons";
import { Reveal, SectionHeader, CandlestickBackdrop } from "@/components/common/Primitives";

export default function Community({ section, links }) {
  return (
    <section className="relative py-24">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} gold={section.subtitle} />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((c, i) => {
          const Icon = getIcon(c.iconKey);
          return (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href={c.href || "#"}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-panel card-lift relative block h-full overflow-hidden rounded-2xl p-6 text-center"
              >
                <div className="pointer-events-none absolute inset-0 opacity-30">
                  <CandlestickBackdrop />
                </div>
                <div className="relative">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-gradient text-[#0a0805]">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-[#f2f0eb]">{c.title}</h3>
                  <div className="mt-1 text-sm text-[#f5c451]">{c.meta} members</div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c451]">
                    {c.body} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

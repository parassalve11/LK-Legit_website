import { getIcon } from "@/components/common/icons";
import { Reveal, SectionHeader } from "@/components/common/Primitives";

export default function Master({ section, items }) {
  return (
    <section id="learn" className="relative py-24">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} gold={section.subtitle} />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m, i) => {
          const Icon = getIcon(m.iconKey);
          return (
            <Reveal key={m.title} delay={i * 0.06}>
              <div className="glass-panel card-lift h-full rounded-2xl p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-gradient text-[#0a0805]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-[#f2f0eb]">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#c9c4b8]">{m.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

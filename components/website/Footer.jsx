import { getIcon } from "@/components/common/icons";
import { FOOTER_COLUMNS } from "@/lib/defaults";
import HeroCoin from "./HeroCoin";

const SOCIAL_ICON = {
  youtube: "youtube",
  instagram: "instagram",
  telegram: "send",
  twitter: "star",
  whatsapp: "message-circle",
};

export default function Footer({ settings, socials, logoUrl = "/Logo.png" }) {
  const [first, ...rest] = settings.siteName.split(" ").reverse();
  const leading = rest.reverse().join(" ");

  return (
    <footer className="relative border-t border-[rgba(212,175,55,0.18)] pt-16 pb-8">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt=""
              className="h-12 w-12 rounded-full ring-1 ring-[rgba(212,175,55,0.4)]"
            />
            <div>
              <div className="font-display text-base font-bold tracking-[0.18em] text-[#f2f0eb]">
                {leading.toUpperCase()} {first.toUpperCase()}
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#f5c451]">
                {settings.tagline}
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#c9c4b8]">
            {settings.footerText}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => {
              const Icon = getIcon(SOCIAL_ICON[s.platform] || "globe");
              return (
                <a
                  key={s.platform}
                  href={s.url || "#"}
                  aria-label={s.platform}
                  target={s.url?.startsWith("http") ? "_blank" : undefined}
                  rel={s.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,175,55,0.35)] text-[#f5c451] hover:bg-[rgba(245,196,81,0.08)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#f5c451]">
              {col.title}
            </h4>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase().replace(/[^a-z]+/g, "")}`}
                    className="text-sm text-[#c9c4b8] transition hover:text-[#f5c451]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Brand coin — turns with the scroll as the footer comes into view. */}
      <div className="mx-auto mt-14 flex max-w-7xl justify-center px-4 sm:px-6">
        <HeroCoin src="/coin-face.png" drive="scroll" scrollSpin={540} className="w-[132px] sm:w-[156px]" />
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <div className="gold-divider" />
        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-[#a19c8f]">
          <span className="font-semibold text-[#f5c451]">Disclaimer:</span> {settings.disclaimer}
        </p>
        <p className="mt-4 text-center text-xs text-[#a19c8f]">{settings.copyright}</p>
      </div>
    </footer>
  );
}

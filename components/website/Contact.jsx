"use client";

import { MapPin, Phone, ArrowRight } from "@/components/common/icons";
import { MessageCircle } from "lucide-react";
import SocialIcon, { BRAND, brandKey } from "@/components/common/SocialIcon";
import { Reveal, SectionHeader, GoldButton } from "@/components/common/Primitives";

export default function Contact({ section, settings, socials, logoUrl = "/Logo.png" }) {
  const f = section.fields || {};
  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : null;

  return (
    <section id="contact" className="relative py-24">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} gold={section.subtitle} />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div className="glass-panel-strong flex h-full flex-col rounded-3xl p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(245,196,81,0.12)] text-[#f5c451] ring-1 ring-[rgba(245,196,81,0.35)]">
              <MessageCircle className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold text-[#f2f0eb]">Chat with the LK team</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#c9c4b8]">
              Ask about LK&apos;s trading lessons, joining the community or opening your ByteFX account.
              Get instant answers from our assistant, or leave your number and the team will call you back.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[#e6e2d6]">
              <li>• Instant answers, any time</li>
              <li>• Share your number and we&apos;ll call you back</li>
              <li>• Help with your ByteFX account</li>
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
              <GoldButton
                type="button"
                className="justify-center"
                onClick={() => window.dispatchEvent(new Event("lk:open-chat"))}
              >
                Start a chat <ArrowRight className="h-4 w-4" />
              </GoldButton>
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] px-6 py-3 text-sm font-semibold text-[#f5c451] transition hover:bg-[rgba(245,196,81,0.08)]"
                >
                  <Phone className="h-4 w-4" /> Call us
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-panel-strong flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#f2f0eb]">{f.panelTitle}</h3>
              <p className="mt-2 text-sm text-[#c9c4b8]">{f.panelSubtitle}</p>
              <ul className="mt-6 space-y-3 text-sm text-[#e6e2d6]">
                {settings.phone ? (
                  <li>
                    <a
                      href={phoneHref}
                      className="flex items-center gap-3 transition hover:text-[#f5c451]"
                    >
                      <Phone className="h-4 w-4 text-[#f5c451]" /> {settings.phone}
                    </a>
                  </li>
                ) : null}
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#f5c451]" /> {settings.address}
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url || "#"}
                    aria-label={BRAND[brandKey(s.platform)].label}
                    target={s.url?.startsWith("http") ? "_blank" : undefined}
                    rel={s.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <SocialIcon platform={s.platform} size="h-10 w-10" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center">
              <img
                src={logoUrl}
                alt={settings.siteName}
                className="h-32 w-32 rounded-full opacity-90 ring-1 ring-[rgba(212,175,55,0.4)]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

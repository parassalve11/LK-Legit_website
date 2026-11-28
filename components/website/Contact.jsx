"use client";

import { useActionState } from "react";
import { MapPin, Phone, ArrowRight, Loader2 } from "@/components/common/icons";
import { MessageCircle } from "lucide-react";
import SocialIcon, { BRAND, brandKey } from "@/components/common/SocialIcon";
import { Reveal, SectionHeader, GoldButton } from "@/components/common/Primitives";
import { submitContact } from "@/app/(website)/actions";

const inputClass =
  "w-full rounded-lg border border-[rgba(212,175,55,0.25)] bg-[rgba(10,8,5,0.6)] px-3 py-2 text-sm text-[#f2f0eb] outline-none focus:border-[#f5c451]";

function Field({ label, name, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#a19c8f]">
        {label}
      </span>
      <input name={name} aria-invalid={error ? "true" : undefined} className={inputClass} {...props} />
      {error ? <span className="mt-1 block text-xs text-[#e6483c]">{error}</span> : null}
    </label>
  );
}

export default function Contact({ section, settings, socials, logoUrl = "/Logo.png" }) {
  const f = section.fields || {};
  const [state, formAction, pending] = useActionState(submitContact, { ok: false });
  const errors = state?.errors || {};
  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : null;

  return (
    <section id="contact" className="relative py-24">
      <SectionHeader eyebrow={section.eyebrow} title={section.title} gold={section.subtitle} />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <form action={formAction} className="glass-panel-strong h-full space-y-4 rounded-3xl p-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#f2f0eb]">Send us a message</h3>
              <p className="mt-1 text-sm text-[#c9c4b8]">Fill in the form and the LK team will get back to you.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Your name" autoComplete="name" error={errors.name} />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                error={errors.email}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                error={errors.phone}
              />
              <Field label="Subject" name="subject" placeholder="How can we help?" error={errors.subject} />
            </div>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#a19c8f]">
                Message
              </span>
              <textarea name="message" rows={5} placeholder="Write your message..." className={inputClass} />
              {errors.message ? (
                <span className="mt-1 block text-xs text-[#e6483c]">{errors.message}</span>
              ) : null}
            </label>

            {/* Honeypot — hidden from people, irresistible to bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute h-0 w-0 opacity-0"
            />

            <GoldButton type="submit" disabled={pending} className="w-full justify-center">
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send Message <ArrowRight className="h-4 w-4" />
                </>
              )}
            </GoldButton>

            {state?.message ? (
              <p
                role="status"
                className={state.ok ? "text-sm font-medium text-[#3ddc84]" : "text-sm font-medium text-[#e6483c]"}
              >
                {state.message}
              </p>
            ) : null}
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col gap-8">
            <div className="glass-panel-strong rounded-3xl p-8">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[rgba(245,196,81,0.12)] text-[#f5c451] ring-1 ring-[rgba(245,196,81,0.35)]">
                  <MessageCircle className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#f2f0eb]">Prefer to chat?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#c9c4b8]">
                    Get instant answers about LK&apos;s lessons, the community or your ByteFX account, or ask for a
                    call back.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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

            <div className="glass-panel-strong flex flex-1 items-center gap-6 overflow-hidden rounded-3xl p-8">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl font-bold text-[#f2f0eb]">{f.panelTitle}</h3>
                <p className="mt-2 text-sm text-[#c9c4b8]">{f.panelSubtitle}</p>
                <ul className="mt-6 space-y-3 text-sm text-[#e6e2d6]">
                  {settings.phone ? (
                    <li>
                      <a href={phoneHref} className="flex items-center gap-3 transition hover:text-[#f5c451]">
                        <Phone className="h-4 w-4 text-[#f5c451]" /> {settings.phone}
                      </a>
                    </li>
                  ) : null}
                  <li className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-[#f5c451]" /> {settings.address}
                  </li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
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
              <img
                src={logoUrl}
                alt={settings.siteName}
                className="hidden h-28 w-28 shrink-0 rounded-full opacity-90 ring-1 ring-[rgba(212,175,55,0.4)] sm:block"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import BrokerActivationSlider from "./BrokerActivationSlider";
import styles from "./PartnershipDevices.module.css";

// ByteFX broker section, built around the device mockup.
const POINTS = [
  "Live & demo MT5 accounts from one dashboard",
  "Forex, gold, crypto & indices",
  "Guided onboarding with the LK community",
];

export default function PartnershipDevices({ section, stats = [] }) {
  const f = section.fields || {};
  const registerLink = f.ctaLink || "https://my.bytefx.com/register";
  const depositLink = f.depositLink || "https://my.bytefx.com/login";
  const activationText = !f.ctaText || f.ctaText === "Register with ByteFX"
    ? "Activate Your Trading Terminal"
    : f.ctaText;
  const disclaimers = [f.disclaimer1, f.disclaimer2, f.disclaimer3].filter(Boolean);

  return (
    <section id="partner" aria-labelledby="partner-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.copy}>
            <div className={styles.brandRow}>
              <a href={registerLink} target="_blank" rel="noopener noreferrer" aria-label="Visit ByteFX (opens in a new tab)">
                <Image src="/bytefx.png" alt="ByteFX" width={170} height={54} className={styles.logo} />
              </a>
              <span className={styles.badge}>
                <ShieldCheck size={14} aria-hidden="true" />
                {f.badgeText || "Official IB Partner"}
              </span>
            </div>

            <h2 id="partner-heading" className={styles.headline}>
              Your ByteFX terminal, on every screen.
            </h2>
            <p className={styles.description}>
              {section.subtitle || "Start your live trading journey with ByteFX and unlock the Trade with LK partner experience."}
            </p>

            <ul className={styles.points}>
              {POINTS.map((point) => (
                <li key={point}>
                  <Check size={16} strokeWidth={2.2} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>

            <div className={styles.cta}>
              <BrokerActivationSlider href={registerLink} label={activationText} />
              <div className={styles.links}>
                <a href={depositLink} target="_blank" rel="noopener noreferrer">
                  {f.depositText || "Deposit funds"}<ArrowRight size={15} aria-hidden="true" />
                </a>
                {f.secondaryCtaText ? (
                  <a href={f.secondaryCtaLink || "https://my.bytefx.com/login"} target="_blank" rel="noopener noreferrer">
                    {f.secondaryCtaText}<ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className={styles.visual}>
            <Image
              src="/images/broker-devices.webp"
              alt="The ByteFX client dashboard shown on a monitor, laptop, tablet and phone"
              width={1733}
              height={875}
              sizes="(max-width: 1023px) 92vw, 760px"
              className={styles.devices}
            />
          </div>

          {stats.length ? (
            <dl className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.id || stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {disclaimers.length ? (
          <div className={styles.disclaimers}>
            {disclaimers.map((disclaimer) => <p key={disclaimer}>{disclaimer}</p>)}
          </div>
        ) : null}
      </div>
    </section>
  );
}

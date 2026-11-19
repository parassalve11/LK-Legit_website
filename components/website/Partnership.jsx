import Image from "next/image";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { getIcon } from "@/components/common/icons";
import BrokerActivationSlider from "./BrokerActivationSlider";
import BrokerRedirectLink from "./BrokerRedirectLink";
import styles from "./Partnership.module.css";

const CARD_STEPS = [
  {
    title: "Register",
    body: "Create your trading account with guided setup.",
    imageKey: "registerImage",
    image: "/images/broker-register.webp",
    alt: "Blue account cards with a silver padlock and key",
    action: "Create your account",
  },
  {
    title: "Deposit",
    body: "Sign in to fund your trading account.",
    imageKey: "depositImage",
    image: "/images/broker-deposit.webp",
    alt: "Blue wallet with stacks of blue and silver coins",
    action: "Fund your account",
  },
  {
    title: "Unlock",
    body: "Connect with the Trade with LK community.",
    imageKey: "unlockImage",
    image: "/images/broker-unlock.webp",
    alt: "Blue globe surrounded by an orbit of silver coins",
    action: "Explore the community",
  },
];

export default function Partnership({ section, features = [], stats = [], steps = [] }) {
  const f = section.fields || {};
  const registerLink = f.ctaLink || "https://my.bytefx.com/register";
  const depositLink = f.depositLink || "https://my.bytefx.com/login";
  const stepLinks = [registerLink, depositLink, f.unlockLink || "#community"];
  const disclaimers = [f.disclaimer1, f.disclaimer2, f.disclaimer3].filter(Boolean);
  // Restore the original swipe label for databases seeded with the click CTA.
  const activationText = !f.ctaText || f.ctaText === "Register with ByteFX"
    ? "Activate Your Trading Terminal"
    : f.ctaText;

  return (
    <section id="partner" aria-labelledby="partner-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.intro}>
            <div className={styles.copy}>
              <div className={styles.brandRow}>
                <a href={registerLink} target="_blank" rel="noopener noreferrer" aria-label="Visit ByteFX (opens in a new tab)">
                  <Image src="/bytefx.png" alt="ByteFX" width={170} height={54} className={styles.logo} />
                </a>
                <span className={styles.badge}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  {f.badgeText || section.eyebrow || "Official IB Partner"}
                </span>
              </div>
              <h2 id="partner-heading" className={styles.headline}>
                {section.title || "Trade with"} {f.headlineLine2 || "ByteFX"}.
              </h2>
              {section.subtitle ? <p className={styles.description}>{section.subtitle}</p> : null}
            </div>

            <div className={styles.activation}>
              <BrokerActivationSlider href={registerLink} label={activationText} />
              <div className={styles.secondaryActions}>
                <a href={depositLink} target="_blank" rel="noopener noreferrer">
                  {f.depositText || "Deposit funds"}<ArrowRight size={16} aria-hidden="true" />
                </a>
                {f.secondaryCtaText ? (
                  <a href={f.secondaryCtaLink || "https://my.bytefx.com/login"} target="_blank" rel="noopener noreferrer">
                    {f.secondaryCtaText}<ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <nav aria-label="Get started with ByteFX" className={styles.journey}>
            <ol className={styles.cards}>
              {CARD_STEPS.map((card, i) => {
                const step = steps[i] || card;
                const image = f[card.imageKey] || card.image;
                const external = /^(https?:)?\/\//.test(stepLinks[i]);
                const CardLink = i === 0 ? BrokerRedirectLink : "a";
                return (
                  <li key={card.imageKey}>
                    <CardLink
                      href={stepLinks[i]}
                      className={styles.glassCard}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                    >
                      <div className={styles.cardHeading}>
                        <div>
                          <span className={styles.stepNumber}>STEP {String(i + 1).padStart(2, "0")}</span>
                          <h3>{step.title || card.title}</h3>
                        </div>
                        <span className={styles.cardArrow}><ArrowUpRight size={20} aria-hidden="true" /></span>
                      </div>
                      <p className={styles.cardDescription}>{step.body || card.body}</p>
                      <div className={styles.artwork}>
                        <Image
                          data-broker-art="true"
                          src={image}
                          alt={card.alt}
                          width={800}
                          height={800}
                          sizes="(max-width: 639px) 270px, (max-width: 1023px) 30vw, 310px"
                          unoptimized={!image.startsWith("/")}
                        />
                      </div>
                      <span className={styles.cardAction}>{card.action}<ArrowRight size={17} aria-hidden="true" /></span>
                    </CardLink>
                  </li>
                );
              })}
            </ol>
          </nav>

          {features.length ? (
            <ul className={styles.benefits}>
              {features.slice(0, 4).map((feature) => {
                const Icon = getIcon(feature.iconKey);
                return (
                  <li key={feature.id || feature.title}>
                    <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                    <span>{feature.title}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}

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

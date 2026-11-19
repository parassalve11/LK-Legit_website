import Image from "next/image";
import { ArrowRight, ArrowUpRight, ShieldCheck, UserRoundPlus, Wallet, Sparkles } from "lucide-react";
import { getIcon } from "@/components/common/icons";
import BrokerRedirectLink from "./BrokerRedirectLink";
import styles from "./Partnership.module.css";

const DEFAULT_STEPS = [
  { title: "Register", body: "Create your trading account" },
  { title: "Deposit", body: "Sign in to fund your account" },
  { title: "Unlock", body: "Explore the LK community" },
];
const STEP_ICONS = [UserRoundPlus, Wallet, Sparkles];

export default function Partnership({ section, features = [], stats = [], steps = [] }) {
  const f = section.fields || {};
  const registerLink = f.ctaLink || "https://my.bytefx.com/register";
  const depositLink = f.depositLink || "https://my.bytefx.com/login";
  const stepLinks = [registerLink, depositLink, f.unlockLink || "#community"];
  const journey = steps.length ? steps.slice(0, 3) : DEFAULT_STEPS;
  const disclaimers = [f.disclaimer1, f.disclaimer2, f.disclaimer3].filter(Boolean);
  // Existing databases can still contain the old full-background artwork.
  const buildingImage = !f.backgroundImage || /^\/Partnership_backgoround\.(png|webp)$/.test(f.backgroundImage)
    ? "/images/broker-building.webp"
    : f.backgroundImage;
  const traderImage = f.traderImage || "/images/broker-trader.webp";
  const registerText = !f.ctaText || f.ctaText === "Activate Your Trading Terminal"
    ? "Register with ByteFX"
    : f.ctaText;

  return (
    <section id="partner" aria-labelledby="partner-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.building} aria-hidden="true">
            <Image src={buildingImage} alt="" width={1920} height={819} sizes="(max-width: 767px) 160vw, 1200px" unoptimized={!buildingImage.startsWith("/")} />
          </div>

          <div className={styles.stage}>
            <div className={styles.copy}>
              <div className={styles.brandRow}>
                <a href={registerLink} target="_blank" rel="noopener noreferrer" aria-label="Visit ByteFX (opens in a new tab)">
                  <Image src="/bytefx.png" alt="ByteFX" width={170} height={54} className={styles.logo} />
                </a>
                <span className={styles.badge}>
                  <ShieldCheck size={14} aria-hidden="true" />
                  {f.badgeText || section.eyebrow || "Official IB Partner"}
                </span>
              </div>

              <h2 id="partner-heading" className={styles.headline}>
                {section.title || "Trade with"} {f.headlineLine2 || "ByteFX"}.
              </h2>
              {section.subtitle ? <p className={styles.description}>{section.subtitle}</p> : null}

              {features.length ? (
                <ul className={styles.features}>
                  {features.slice(0, 4).map((feature) => {
                    const Icon = getIcon(feature.iconKey);
                    return (
                      <li key={feature.id || feature.title} className={styles.feature}>
                        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                        <div>
                          <h3>{feature.title}</h3>
                          {feature.body ? <p>{feature.body}</p> : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              <nav aria-label="Get started with ByteFX" className={styles.journey}>
                <ol>
                  {journey.map((step, i) => {
                    const Icon = STEP_ICONS[i];
                    const external = !stepLinks[i].startsWith("#");
                    return (
                      <li key={step.id || step.title}>
                        <a
                          href={stepLinks[i]}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          aria-label={`${step.title}${external ? " with ByteFX (opens in a new tab)" : " in the LK community"}`}
                        >
                          <span className={styles.stepIcon}><Icon size={16} strokeWidth={1.8} aria-hidden="true" /></span>
                          <span>
                            <span className={styles.stepTitle}>{step.title}</span>
                            <span className={styles.stepDescription}>{step.body}</span>
                          </span>
                        </a>
                        {i < journey.length - 1 ? <ArrowRight className={styles.stepArrow} size={14} aria-hidden="true" /> : null}
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className={styles.actions}>
                <BrokerRedirectLink className={styles.primaryAction} href={registerLink}>
                  {registerText}<ArrowUpRight size={18} aria-hidden="true" />
                </BrokerRedirectLink>
                <a className={styles.textAction} href={depositLink} target="_blank" rel="noopener noreferrer">
                  {f.depositText || "Deposit funds"}<ArrowRight size={16} aria-hidden="true" />
                </a>
                {f.secondaryCtaText ? (
                  <a className={styles.textAction} href={f.secondaryCtaLink || "https://my.bytefx.com/login"} target="_blank" rel="noopener noreferrer">
                    {f.secondaryCtaText}<ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>

            <div className={styles.visual}>
              <Image
                src={traderImage}
                alt="Trader using a smartphone with blue market charts around him"
                width={1122}
                height={1402}
                sizes="(max-width: 1023px) 80vw, 460px"
                className={styles.trader}
                unoptimized={!traderImage.startsWith("/")}
              />
            </div>
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

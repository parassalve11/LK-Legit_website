import Image from "next/image";
import { ArrowRight } from "lucide-react";
import BrokerRedirectLink from "./BrokerRedirectLink";
import styles from "./PartnershipDevices.module.css";

const STEPS = [
  { title: "Register with ByteFX", body: "Create your broker account." },
  { title: "Connect to MetaTrader 5", body: "Sign in with your trading account." },
  { title: "Fund your account", body: "Get ready for your first trade." },
];

export default function PartnershipDevices({ section }) {
  const f = section.fields || {};
  const registerLink = f.ctaLink || "https://my.bytefx.com/register";
  const depositLink = f.depositLink || "https://my.bytefx.com/login";

  return (
    <section id="partner" aria-labelledby="partner-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <span className={styles.badge}>{f.badgeText || "Official IB Partner"}</span>
            <h2 id="partner-heading" className={styles.headline}>
              Your markets.<br />Every screen.<br />MetaTrader 5.
            </h2>
            <p className={styles.description}>
              Trade with ByteFX on your phone, tablet or laptop. One platform, wherever you are.
            </p>
            <div className={styles.actions}>
              <BrokerRedirectLink href={registerLink} className={styles.primaryLink}>
                <span>Get started with</span>
                <Image src="/bytefx.png" alt="ByteFX" width={384} height={82} className={styles.buttonLogo} />
                <ArrowRight size={17} aria-hidden="true" className={styles.buttonArrow} />
              </BrokerRedirectLink>
              <a className={styles.loginLink} href={depositLink} target="_blank" rel="noopener noreferrer">
                Already registered? Log in <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className={styles.visual}>
            <Image
              src="/images/broker-bytefx-screens-v2.webp"
              alt="ByteFX trading screens on a laptop and phone, with the ByteFX account dashboard on a tablet, floating chart panels and the MT5 emblem"
              width={1612}
              height={976}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 58vw, 620px"
              className={styles.devices}
            />
          </figure>
          <div className={styles.journey}>
            <p className={styles.stepsLabel}>Three steps to get started</p>
            <ol className={styles.steps}>
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <span className={styles.stepNumber} aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

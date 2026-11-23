import { getLandingContent, getSeo } from "@/services/content";
import Header from "@/components/website/Header";
import Hero from "@/components/website/Hero";
import WhyLK from "@/components/website/WhyLK";
import TradeSystem from "@/components/website/TradeSystem";
import LearnFromLK from "@/components/website/LearnFromLK";
import LearningHub from "@/components/website/LearningHub";
import Dashboard from "@/components/website/Dashboard";
import Tools from "@/components/website/Tools";
import News from "@/components/website/News";
import Testimonials from "@/components/website/Testimonials";
import Community from "@/components/website/Community";
import Contact from "@/components/website/Contact";
import Footer from "@/components/website/Footer";
import WelcomePoster from "@/components/website/WelcomePoster";
import SmoothScroll from "@/components/common/SmoothScroll";
import PartnershipDevices from "@/components/website/PartnershipDevices";

// SEO comes from the database (Settings → SEO), falling back to defaults.
export async function generateMetadata() {
  const seo = await getSeo();
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title: seo.title, description: seo.description, type: "website" },
  };
}

export default async function HomePage() {
  const c = await getLandingContent();
  const s = c.sections;
  const channelHref = s.videos?.fields?.channelUrl || "https://www.youtube.com/@TradewithLK55";

  // Section visibility and order are admin-controlled.
  const RENDERERS = {
    hero: () => (
      <Hero section={s.hero} checks={c.heroChecks} stats={c.heroStats} settings={c.settings} />
    ),
    roadmap: () => <WhyLK section={s.roadmap} stats={c.roadmapStats} />,
    system: () => <TradeSystem section={s.system} steps={c.systemSteps} />,
    learnlk: () => <LearnFromLK section={s.learnlk} stats={c.learnStats} />,
    videos: () => (
      <LearningHub section={s.videos} categories={c.categories} videos={c.videos} />
    ),
    partner: () => (
      <PartnershipDevices section={s.partner} />
    ),
    dashboard: () => (
      <Dashboard
        section={s.dashboard}
        marketSessions={c.marketSessions}
        weeklySessions={c.weeklySessions}
      />
    ),
    tools: () => <Tools section={s.tools} />,
    news: () => <News section={s.news} />,
    testimonials: () => <Testimonials section={s.testimonials} items={c.testimonials} />,
    community: () => <Community section={s.community} links={c.communityLinks} />,
    contact: () => (
      <Contact section={s.contact} settings={c.settings} socials={c.socials} />
    ),
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f2f0eb]" style={{ overflowX: "clip" }}>
      <SmoothScroll />
      <Header nav={c.nav} siteName={c.settings.siteName} />
      <main>
        {c.sectionOrder.map((key) => {
          const render = RENDERERS[key];
          return render ? <div key={key}>{render()}</div> : null;
        })}
      </main>
      <Footer settings={c.settings} socials={c.socials} />
      <WelcomePoster
        siteName={c.settings.siteName}
        channelHref={channelHref}
        liveHref={`${channelHref.replace(/\/+$/, "")}/live`}
      />
    </div>
  );
}

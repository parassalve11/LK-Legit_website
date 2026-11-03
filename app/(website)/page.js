import { getLandingContent, getSeo } from "@/services/content";
import Header from "@/components/website/Header";
import Hero from "@/components/website/Hero";
import Master from "@/components/website/Master";
import WhyLK from "@/components/website/WhyLK";
import LearningHub from "@/components/website/LearningHub";
import Partnership from "@/components/website/Partnership";
import Dashboard from "@/components/website/Dashboard";
import Tools from "@/components/website/Tools";
import News from "@/components/website/News";
import Testimonials from "@/components/website/Testimonials";
import Community from "@/components/website/Community";
import Contact from "@/components/website/Contact";
import Footer from "@/components/website/Footer";

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

  // Section visibility and order are admin-controlled.
  const RENDERERS = {
    hero: () => (
      <Hero section={s.hero} checks={c.heroChecks} stats={c.heroStats} settings={c.settings} />
    ),
    master: () => <Master section={s.master} items={c.masterItems} />,
    roadmap: () => <WhyLK section={s.roadmap} stats={c.roadmapStats} />,
    videos: () => (
      <LearningHub section={s.videos} categories={c.categories} videos={c.videos} />
    ),
    partner: () => (
      <Partnership
        section={s.partner}
        features={c.partnerFeatures}
        stats={c.partnerStats}
        steps={c.unlockSteps}
      />
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-[#f2f0eb]">
      <Header nav={c.nav} siteName={c.settings.siteName} />
      <main>
        {c.sectionOrder.map((key) => {
          const render = RENDERERS[key];
          return render ? <div key={key}>{render()}</div> : null;
        })}
      </main>
      <Footer settings={c.settings} socials={c.socials} />
    </div>
  );
}

import "server-only";
import { prisma } from "@/lib/db";
import * as D from "@/lib/defaults";

// Reads everything the landing page needs. If the database is empty or
// unreachable the defaults are returned instead, so the public site renders
// correctly before the first migration and never shows a blank page in
// production if the DB blips.

function toSectionMap(rows) {
  const map = {};
  for (const row of rows) {
    const fields = {};
    for (const f of row.fields || []) fields[f.key] = f.value;
    map[row.key] = {
      key: row.key,
      name: row.name,
      eyebrow: row.eyebrow || "",
      title: row.title || "",
      subtitle: row.subtitle || "",
      visible: row.visible,
      order: row.order,
      fields,
    };
  }
  return map;
}

function defaultSectionMap() {
  const map = {};
  for (const s of D.SECTIONS) {
    const fields = {};
    for (const f of s.fields) fields[f.key] = f.value;
    map[s.key] = { ...s, visible: true, fields };
  }
  return map;
}

function groupBySectionKey(rows) {
  const out = {};
  for (const r of rows) {
    (out[r.sectionKey] ||= []).push(r);
  }
  return out;
}

// Circuit breaker. Without this every request pays the full MySQL connect
// timeout (~4s) while the database is down, which makes the whole site crawl.
// After a failure we serve defaults immediately and retry occasionally.
let dbDownUntil = 0;
const DOWN_FOR_MS = 30_000;
const QUERY_TIMEOUT_MS = 3_000;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database timed out")), QUERY_TIMEOUT_MS),
    ),
  ]);
}

export async function getLandingContent() {
  if (Date.now() < dbDownUntil) return fallbackContent();

  try {
    const [settings, nav, socials, sections, features, stats, videos, testimonials, sessions] =
      await withTimeout(Promise.all([
        prisma.siteSettings.findUnique({ where: { id: 1 } }),
        prisma.navItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { order: "asc" } }),
        prisma.section.findMany({ orderBy: { order: "asc" }, include: { fields: true } }),
        prisma.featureItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        prisma.statItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        prisma.video.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        prisma.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        prisma.marketSession.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      ]));

    dbDownUntil = 0;

    // An un-seeded database should look the same as no database at all.
    if (!sections.length) return fallbackContent();

    const featuresBy = groupBySectionKey(features);
    const statsBy = groupBySectionKey(stats);

    return {
      source: "database",
      settings: settings || D.SITE_SETTINGS,
      nav: nav.length ? nav : D.NAV_ITEMS,
      socials: socials.length ? socials : D.SOCIAL_LINKS,
      sections: toSectionMap(sections),
      sectionOrder: sections.filter((s) => s.visible).map((s) => s.key),
      heroChecks: (featuresBy.heroChecks || []).map((f) => f.title),
      heroStats: statsBy.hero || [],
      roadmapStats: statsBy.roadmap || [],
      masterItems: featuresBy.master || [],
      categories: featuresBy.categories || [],
      partnerFeatures: featuresBy.partner || [],
      partnerStats: statsBy.partner || [],
      unlockSteps: featuresBy.unlock || [],
      communityLinks: featuresBy.community || [],
      videos,
      testimonials,
      marketSessions: sessions.filter((s) => s.kind === "market"),
      weeklySessions: sessions.filter((s) => s.kind === "weekly"),
    };
  } catch (error) {
    dbDownUntil = Date.now() + DOWN_FOR_MS;
    console.warn("[content] falling back to defaults:", error?.message);
    return fallbackContent();
  }
}

function fallbackContent() {
  const sections = defaultSectionMap();
  return {
    source: "defaults",
    settings: D.SITE_SETTINGS,
    nav: D.NAV_ITEMS,
    socials: D.SOCIAL_LINKS,
    sections,
    sectionOrder: D.SECTIONS.map((s) => s.key),
    heroChecks: D.HERO_CHECKS,
    heroStats: D.HERO_STATS,
    roadmapStats: D.ROADMAP_STATS,
    masterItems: D.MASTER_ITEMS,
    categories: D.CATEGORIES,
    partnerFeatures: D.PARTNER_FEATURES,
    partnerStats: D.PARTNER_STATS,
    unlockSteps: D.UNLOCK_STEPS,
    communityLinks: D.COMMUNITY_LINKS,
    videos: D.VIDEOS,
    testimonials: D.TESTIMONIALS,
    marketSessions: D.MARKET_SESSIONS,
    weeklySessions: D.WEEKLY_SESSIONS,
  };
}

export async function getSeo() {
  // Shares the breaker with getLandingContent so metadata never stalls a
  // response while MySQL is unreachable.
  if (Date.now() < dbDownUntil) return D.SEO;

  try {
    const row = await withTimeout(
      prisma.seoMeta.findUnique({
        where: { pageKey: "home" },
        include: { ogImage: true },
      }),
    );
    return row || D.SEO;
  } catch (error) {
    dbDownUntil = Date.now() + DOWN_FOR_MS;
    console.warn("[seo] falling back to defaults:", error?.message);
    return D.SEO;
  }
}

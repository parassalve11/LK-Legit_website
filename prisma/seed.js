/**
 * Loads the website's current content into MySQL and creates the admin login.
 *
 *   npm run db:seed
 *
 * Safe to re-run: everything upserts, so existing edits are preserved except
 * for rows that are keyed and intentionally refreshed.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as D from "../lib/defaults.js";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@tradewithlk55.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.log("\n  ⚠  Skipping admin user — set ADMIN_PASSWORD in .env first.");
    console.log("     Example: ADMIN_PASSWORD=\"a-long-password\" npm run db:seed\n");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Website Owner", role: "admin" },
  });
  console.log(`  ✓ Admin user ready: ${email}`);
}

async function main() {
  console.log("\nSeeding Trade with LK Legist…\n");

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...D.SITE_SETTINGS },
  });
  console.log("  ✓ Website settings");

  for (const item of D.NAV_ITEMS) {
    const existing = await prisma.navItem.findFirst({ where: { anchor: item.anchor } });
    if (!existing) await prisma.navItem.create({ data: { ...item, visible: true } });
  }
  console.log(`  ✓ Menu (${D.NAV_ITEMS.length} links)`);

  for (const s of D.SOCIAL_LINKS) {
    await prisma.socialLink.upsert({
      where: { platform: s.platform },
      update: {},
      create: { ...s, enabled: true },
    });
  }
  console.log(`  ✓ Social links (${D.SOCIAL_LINKS.length})`);

  for (const section of D.SECTIONS) {
    const row = await prisma.section.upsert({
      where: { key: section.key },
      update: {},
      create: {
        key: section.key,
        name: section.name,
        eyebrow: section.eyebrow,
        title: section.title,
        subtitle: section.subtitle,
        order: section.order,
        visible: true,
      },
    });
    for (const [i, f] of section.fields.entries()) {
      await prisma.sectionField.upsert({
        where: { sectionId_key: { sectionId: row.id, key: f.key } },
        update: {},
        create: { sectionId: row.id, key: f.key, label: f.label, value: f.value, order: i },
      });
    }
  }
  console.log(`  ✓ Page sections (${D.SECTIONS.length})`);

  // Repeatable content, grouped by the section that renders it.
  const featureGroups = [
    ["system", D.SYSTEM_STEPS],
    ["categories", D.CATEGORIES],
    ["partner", D.PARTNER_FEATURES],
    ["unlock", D.UNLOCK_STEPS],
    ["community", D.COMMUNITY_LINKS],
    ["heroChecks", D.HERO_CHECKS.map((title, order) => ({ title, iconKey: "check", order }))],
  ];

  for (const [sectionKey, items] of featureGroups) {
    for (const item of items) {
      const existing = await prisma.featureItem.findFirst({
        where: { sectionKey, title: item.title },
      });
      if (existing) continue;
      await prisma.featureItem.create({
        data: {
          sectionKey,
          iconKey: item.iconKey || "sparkles",
          title: item.title,
          body: item.body || null,
          meta: item.meta || null,
          href: item.href || null,
          order: item.order ?? 0,
          visible: true,
        },
      });
    }
  }
  console.log("  ✓ Feature cards, categories, partner features, community links");

  const statGroups = [
    ["hero", D.HERO_STATS],
    ["roadmap", D.ROADMAP_STATS],
    ["learnlk", D.LEARN_STATS],
    ["partner", D.PARTNER_STATS],
  ];

  for (const [sectionKey, items] of statGroups) {
    for (const item of items) {
      const existing = await prisma.statItem.findFirst({
        where: { sectionKey, label: item.label },
      });
      if (existing) continue;
      await prisma.statItem.create({
        data: {
          sectionKey,
          iconKey: item.iconKey || null,
          label: item.label,
          value: item.value,
          suffix: item.suffix || "",
          countUp: Boolean(item.countUp),
          order: item.order ?? 0,
          visible: true,
        },
      });
    }
  }
  console.log("  ✓ Statistics");

  // The first build shipped with stand-in videos that aren't from the channel.
  // Hide them (not delete) so the real LK55 uploads take their place.
  await prisma.video.updateMany({
    where: { youtubeId: { in: ["kJQP7kiw5Fk", "9bZkp7q19f0", "hY7m5jjJ9mM", "3JZ_D3ELwOQ"] } },
    data: { visible: false },
  });

  for (const v of D.VIDEOS) {
    const existing = await prisma.video.findFirst({ where: { youtubeId: v.youtubeId } });
    if (!existing) await prisma.video.create({ data: { ...v, visible: true } });
  }
  console.log(`  ✓ Videos (${D.VIDEOS.length})`);

  for (const t of D.TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) await prisma.testimonial.create({ data: { ...t, rating: 5, visible: true } });
  }
  console.log(`  ✓ Testimonials (${D.TESTIMONIALS.length})`);

  for (const s of [...D.MARKET_SESSIONS, ...D.WEEKLY_SESSIONS]) {
    const existing = await prisma.marketSession.findFirst({
      where: { kind: s.kind, label: s.label },
    });
    if (!existing) await prisma.marketSession.create({ data: { ...s, visible: true } });
  }
  console.log("  ✓ Trading sessions");

  await prisma.seoMeta.upsert({
    where: { pageKey: "home" },
    update: {},
    create: D.SEO,
  });
  console.log("  ✓ SEO");

  await seedAdmin();
  console.log("\nDone. Your website content is now editable from /admin\n");
}

main()
  .catch((e) => {
    console.error("\nSeed failed:", e.message, "\n");
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

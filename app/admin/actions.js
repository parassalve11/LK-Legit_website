"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import {
  SectionSchema,
  VideoSchema,
  TestimonialSchema,
  NavItemSchema,
  SocialLinkSchema,
  SiteSettingsSchema,
  SeoSchema,
  FeatureItemSchema,
  StatItemSchema,
  fieldErrors,
} from "@/lib/validations";

// Every action re-checks authorisation server-side (§39). Never trust that the
// caller reached a protected page.

function bool(v) {
  return v === "true" || v === "on" || v === true;
}

/** Wraps an action with auth + validation + consistent result shape. */
async function run(schema, formData, work) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, message: "Your session expired. Please sign in again." };
  }

  const raw = Object.fromEntries(formData);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the errors below." };
  }

  try {
    await work(parsed.data, raw);
    revalidatePath("/", "layout");
    return { ok: true, message: "Saved. Your website has been updated." };
  } catch (error) {
    console.error("[admin] save failed:", error?.message);
    return {
      ok: false,
      message: "We couldn't save that. The database may be unavailable — please try again.",
    };
  }
}

// ---------- sections ----------

export async function saveSection(prevState, formData) {
  const key = formData.get("key");
  return run(SectionSchema, formData, async (data) => {
    await prisma.section.update({
      where: { key },
      data: {
        eyebrow: data.eyebrow || null,
        title: data.title || null,
        subtitle: data.subtitle || null,
        visible: bool(formData.get("visible")),
      },
    });

    // Section copy fields arrive as field_<key>.
    const updates = [];
    for (const [name, value] of formData.entries()) {
      if (!name.startsWith("field_")) continue;
      const fieldKey = name.slice("field_".length);
      updates.push(
        prisma.sectionField.updateMany({
          where: { section: { key }, key: fieldKey },
          data: { value: String(value) },
        }),
      );
    }
    await Promise.all(updates);
  });
}

export async function setSectionVisibility(formData) {
  await requireAdmin();
  const key = formData.get("key");
  const visible = bool(formData.get("visible"));
  await prisma.section.update({ where: { key }, data: { visible } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/sections");
}

export async function moveSection(formData) {
  await requireAdmin();
  const key = formData.get("key");
  const direction = formData.get("direction");

  const all = await prisma.section.findMany({ orderBy: { order: "asc" } });
  const index = all.findIndex((s) => s.key === key);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= all.length) return;

  // Swap the two order values.
  await prisma.$transaction([
    prisma.section.update({ where: { id: all[index].id }, data: { order: all[swapWith].order } }),
    prisma.section.update({ where: { id: all[swapWith].id }, data: { order: all[index].order } }),
  ]);
  revalidatePath("/", "layout");
  revalidatePath("/admin/sections");
}

// ---------- generic list reordering ----------

async function moveRow(model, id, direction, where = {}) {
  const all = await prisma[model].findMany({ where, orderBy: { order: "asc" } });
  const index = all.findIndex((r) => r.id === Number(id));
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= all.length) return;
  await prisma.$transaction([
    prisma[model].update({ where: { id: all[index].id }, data: { order: all[swapWith].order } }),
    prisma[model].update({ where: { id: all[swapWith].id }, data: { order: all[index].order } }),
  ]);
}

// ---------- videos ----------

export async function saveVideo(prevState, formData) {
  const id = formData.get("id");
  return run(VideoSchema, formData, async (data) => {
    const payload = { ...data, visible: bool(formData.get("visible")) };
    if (id) {
      await prisma.video.update({ where: { id: Number(id) }, data: payload });
    } else {
      const count = await prisma.video.count();
      await prisma.video.create({ data: { ...payload, order: count } });
    }
  });
}

export async function deleteVideo(formData) {
  await requireAdmin();
  await prisma.video.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/content/videos");
}

export async function moveVideo(formData) {
  await requireAdmin();
  await moveRow("video", formData.get("id"), formData.get("direction"));
  revalidatePath("/", "layout");
  revalidatePath("/admin/content/videos");
}

// ---------- testimonials ----------

export async function saveTestimonial(prevState, formData) {
  const id = formData.get("id");
  return run(TestimonialSchema, formData, async (data) => {
    const payload = {
      name: data.name,
      role: data.role || "",
      quote: data.quote,
      rating: data.rating,
      visible: bool(formData.get("visible")),
    };
    if (id) {
      await prisma.testimonial.update({ where: { id: Number(id) }, data: payload });
    } else {
      const count = await prisma.testimonial.count();
      await prisma.testimonial.create({ data: { ...payload, order: count } });
    }
  });
}

export async function deleteTestimonial(formData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/content/testimonials");
}

export async function moveTestimonial(formData) {
  await requireAdmin();
  await moveRow("testimonial", formData.get("id"), formData.get("direction"));
  revalidatePath("/", "layout");
  revalidatePath("/admin/content/testimonials");
}

// ---------- feature / stat repeatables ----------

export async function saveFeature(prevState, formData) {
  const id = formData.get("id");
  return run(FeatureItemSchema, formData, async (data) => {
    const payload = { ...data, visible: bool(formData.get("visible")) };
    if (id) {
      await prisma.featureItem.update({ where: { id: Number(id) }, data: payload });
    } else {
      const count = await prisma.featureItem.count({ where: { sectionKey: data.sectionKey } });
      await prisma.featureItem.create({ data: { ...payload, order: count } });
    }
  });
}

export async function deleteFeature(formData) {
  await requireAdmin();
  await prisma.featureItem.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/", "layout");
}

export async function saveStat(prevState, formData) {
  const id = formData.get("id");
  return run(StatItemSchema, formData, async (data) => {
    const payload = {
      ...data,
      countUp: bool(formData.get("countUp")),
      visible: bool(formData.get("visible")),
    };
    if (id) {
      await prisma.statItem.update({ where: { id: Number(id) }, data: payload });
    } else {
      const count = await prisma.statItem.count({ where: { sectionKey: data.sectionKey } });
      await prisma.statItem.create({ data: { ...payload, order: count } });
    }
  });
}

// ---------- navigation ----------

export async function saveNavItem(prevState, formData) {
  const id = formData.get("id");
  return run(NavItemSchema, formData, async (data) => {
    const payload = { ...data, visible: bool(formData.get("visible")) };
    if (id) {
      await prisma.navItem.update({ where: { id: Number(id) }, data: payload });
    } else {
      const count = await prisma.navItem.count();
      await prisma.navItem.create({ data: { ...payload, order: count } });
    }
  });
}

export async function deleteNavItem(formData) {
  await requireAdmin();
  await prisma.navItem.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/navigation");
}

export async function moveNavItem(formData) {
  await requireAdmin();
  await moveRow("navItem", formData.get("id"), formData.get("direction"));
  revalidatePath("/", "layout");
  revalidatePath("/admin/navigation");
}

// ---------- settings ----------

export async function saveSettings(prevState, formData) {
  return run(SiteSettingsSchema, formData, async (data) => {
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: { ...data, maintenanceMode: bool(formData.get("maintenanceMode")) },
      create: { id: 1, ...data, maintenanceMode: bool(formData.get("maintenanceMode")) },
    });
  });
}

export async function saveSocialLink(prevState, formData) {
  return run(SocialLinkSchema, formData, async (data) => {
    await prisma.socialLink.upsert({
      where: { platform: data.platform },
      update: { url: data.url, enabled: bool(formData.get("enabled")) },
      create: { ...data, enabled: bool(formData.get("enabled")) },
    });
  });
}

export async function saveSeo(prevState, formData) {
  return run(SeoSchema, formData, async (data) => {
    await prisma.seoMeta.upsert({
      where: { pageKey: data.pageKey },
      update: {
        title: data.title,
        description: data.description,
        noIndex: bool(formData.get("noIndex")),
      },
      create: {
        pageKey: data.pageKey,
        title: data.title,
        description: data.description,
        noIndex: bool(formData.get("noIndex")),
      },
    });
  });
}

// ---------- leads ----------

export async function updateLeadStatus(formData) {
  await requireAdmin();
  await prisma.lead.update({
    where: { id: Number(formData.get("id")) },
    data: { status: formData.get("status") },
  });
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData) {
  await requireAdmin();
  await prisma.lead.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/admin/leads");
}

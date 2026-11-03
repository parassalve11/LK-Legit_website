import { z } from "zod";

// Zod 4 API: top-level z.email(), and `error` instead of `message`.

export const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Enter your password." }),
});

export const LeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Please enter your name." })
    .max(120, { error: "That name is too long." }),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  phone: z
    .string()
    .trim()
    .max(30, { error: "That phone number is too long." })
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { error: "Please write at least 10 characters." })
    .max(4000, { error: "That message is too long." }),
  // Honeypot: real people never fill this in.
  website: z.string().max(0).optional().or(z.literal("")),
});

export const SectionSchema = z.object({
  eyebrow: z.string().trim().max(120).optional().or(z.literal("")),
  title: z.string().trim().max(200).optional().or(z.literal("")),
  subtitle: z.string().trim().max(1000).optional().or(z.literal("")),
  visible: z.coerce.boolean(),
});

export const FeatureItemSchema = z.object({
  sectionKey: z.string().trim().min(1),
  iconKey: z.string().trim().min(1),
  title: z.string().trim().min(1, { error: "Title is required." }).max(200),
  body: z.string().trim().max(1000).optional().or(z.literal("")),
  meta: z.string().trim().max(120).optional().or(z.literal("")),
  href: z.union([z.url({ error: "Enter a valid link." }), z.literal("")]).optional(),
  order: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().default(true),
});

export const StatItemSchema = z.object({
  sectionKey: z.string().trim().min(1),
  label: z.string().trim().min(1, { error: "Label is required." }).max(120),
  value: z.string().trim().min(1, { error: "Value is required." }).max(60),
  suffix: z.string().trim().max(10).optional().or(z.literal("")),
  countUp: z.coerce.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().default(true),
});

export const VideoSchema = z.object({
  youtubeId: z
    .string()
    .trim()
    .min(5, { error: "Enter the YouTube video ID." })
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, { error: "That doesn't look like a YouTube video ID." }),
  title: z.string().trim().min(1, { error: "Title is required." }).max(250),
  duration: z.string().trim().max(20).optional().or(z.literal("")),
  views: z.string().trim().max(20).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().default(true),
});

export const TestimonialSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required." }).max(120),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  quote: z.string().trim().min(10, { error: "Write the testimonial." }).max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatarId: z.coerce.number().int().optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().default(true),
});

export const NavItemSchema = z.object({
  label: z.string().trim().min(1, { error: "Label is required." }).max(60),
  anchor: z
    .string()
    .trim()
    .min(1, { error: "Anchor is required." })
    .regex(/^#[a-z0-9-]+$/i, { error: "Use an in-page anchor like #contact." }),
  order: z.coerce.number().int().min(0).default(0),
  visible: z.coerce.boolean().default(true),
});

export const SocialLinkSchema = z.object({
  platform: z.string().trim().min(1).max(40),
  url: z.union([z.url({ error: "Enter a valid link." }), z.literal("")]),
  enabled: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export const SiteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, { error: "Website name is required." }).max(120),
  tagline: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(200).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  footerText: z.string().trim().max(2000).optional().or(z.literal("")),
  copyright: z.string().trim().max(300).optional().or(z.literal("")),
  disclaimer: z.string().trim().max(4000).optional().or(z.literal("")),
  maintenanceMode: z.coerce.boolean().default(false),
});

export const SeoSchema = z.object({
  pageKey: z.string().trim().min(1).default("home"),
  title: z.string().trim().min(1, { error: "Meta title is required." }).max(200),
  description: z.string().trim().min(1, { error: "Meta description is required." }).max(500),
  ogImageId: z.coerce.number().int().optional().nullable(),
  noIndex: z.coerce.boolean().default(false),
});

/** Turn a ZodError into { field: "message" } for form rendering. */
export function fieldErrors(error) {
  const out = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_";
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}

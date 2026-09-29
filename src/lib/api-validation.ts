import { EXPERIENCE_TYPES, PROJECT_CATEGORIES, SKILL_CATEGORIES, SECTION_KEYS } from "@/lib/constants";

/**
 * api-validation — the only write-side gate for the console.
 *
 * Every POST/PUT handler routes its body through one of these parsers before
 * touching Prisma. The parsers do four things the handlers used to leave to the
 * database: whitelist fields (`{ ...body }` passed whatever the client sent
 * straight into a column list), coerce types, clamp ranges, and enforce the
 * enums the product actually renders. A rejected body returns
 * `{ error, fields }` with a per-field message, so the console can point at the
 * offending input instead of showing a generic failure.
 *
 * `mode` matters: a create must carry every required field, an update only has
 * to be *legal* for the fields it does send — the reorder flow sends
 * `{ id, order }` and nothing else.
 */

export type WriteMode = "create" | "update";

export type ParseResult<T> = { data: T } | { error: string; fields?: Record<string, string> };

/** Fields a create cannot omit; the rest keep the schema defaults. */
type RequiredOnCreate<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

/** One coercion function per writable field; see the reader contract below. */
type ReaderMap<T> = { [P in keyof T]: (value: unknown) => Read<T[P]> };

export interface ProjectWrite {
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  category?: string;
  complexity?: string;
  performance?: string;
  year?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  order?: number;
}

export interface SkillWrite {
  name?: string;
  level?: number;
  category?: string;
  icon?: string;
  order?: number;
}

export interface ExperienceWrite {
  company?: string;
  role?: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
  type?: string;
  order?: number;
}

export interface TestimonialWrite {
  name?: string;
  role?: string;
  content?: string;
  avatar?: string;
  order?: number;
}

export interface SocialWrite {
  platform?: string;
  url?: string;
  icon?: string;
  order?: number;
}

export interface SectionWrite {
  title?: string;
  subtitle?: string | null;
  enabled?: boolean;
  order?: number;
}

export interface ConfigWrite {
  name?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  location?: string;
  avatar?: string;
  status?: string;
  edition?: string;
  siteName?: string;
  siteDescription?: string;
  animationsEnabled?: boolean;
}

/* ─── Field readers ─────────────────────────────────────────────────────── */
/* Contract for every reader: `undefined` = field absent (skip it), `null` =
 * present but invalid (report it), anything else = the coerced value. */

type Read<T> = T | null | undefined;

/** Minimal RFC-5322-shaped check — one regex for every email the codex stores. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** `YYYY-MM`, the shape `<input type="month">` submits. */
const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const MAX_TAGS = 12;
const MAX_TAG_LENGTH = 40;

function asRecord(input: unknown): Record<string, unknown> | null {
  return typeof input === "object" && input !== null && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : null;
}

function asText(value: unknown, max: number): Read<string> {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 || trimmed.length > max ? null : trimmed;
}

/** Optional free text: absent or blank both mean "empty", never invalid. */
function asOptionalText(value: unknown, max: number): Read<string> {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > max ? null : trimmed;
}

function asNullableUrl(value: unknown): Read<string | null> {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 2048) return null;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}

function asTags(value: unknown): Read<string[]> {
  if (value === undefined) return undefined;
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? (() => {
          try {
            const parsed: unknown = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : value.split(",");
          } catch {
            return value.split(",");
          }
        })()
      : null;
  if (raw === null || !Array.isArray(raw)) return null;
  if (raw.length > MAX_TAGS) return null;
  const tags: string[] = [];
  for (const entry of raw) {
    if (typeof entry !== "string") return null;
    const tag = entry.trim();
    if (tag.length === 0) continue;
    if (tag.length > MAX_TAG_LENGTH) return null;
    tags.push(tag);
  }
  return tags;
}

function asInt(value: unknown, min: number, max: number): Read<number> {
  if (value === undefined) return undefined;
  const numeric = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(numeric)) return null;
  return Math.min(max, Math.max(min, Math.trunc(numeric)));
}

function asBoolean(value: unknown): Read<boolean> {
  if (value === undefined) return undefined;
  return typeof value === "boolean" ? value : null;
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[]): Read<T> {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  return allowed.find((entry) => entry === value) ?? null;
}

function asEmail(value: unknown): Read<string> {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return EMAIL.test(trimmed) ? trimmed : null;
}

function asMonth(value: unknown): Read<string> {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  return YEAR_MONTH.test(value.trim()) ? value.trim() : null;
}

/** Absent or blank end date means "ongoing"; a present one must be a month. */
function asOptionalMonth(value: unknown): Read<string | null> {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return YEAR_MONTH.test(trimmed) ? trimmed : null;
}

/**
 * Shared assembly: run every reader, then report either the patch or the
 * per-field failures. `required` is only enforced in create mode — and because
 * the loop below proves each required key is present, the returned patch is
 * narrowed to `RequiredOnCreate<T, K>` for the create call sites.
 */
function assemble<T extends object, K extends keyof T>(
  input: unknown,
  readers: ReaderMap<T>,
  required: readonly K[],
  mode: WriteMode
): ParseResult<RequiredOnCreate<T, K>> {
  const body = asRecord(input);
  if (!body) return { error: "Request body must be a JSON object" };

  const data: Partial<T> = {};
  const fields: Record<string, string> = {};
  for (const key of Object.keys(readers) as (keyof T)[]) {
    const read = readers[key](body[key as string]);
    if (read === null) fields[String(key)] = `Invalid value for "${String(key)}"`;
    else if (read !== undefined) data[key] = read;
  }

  if (mode === "create") {
    for (const key of required) {
      if (data[key] === undefined) {
        fields[String(key)] ??= `"${String(key)}" is required`;
      }
    }
  }

  if (Object.keys(fields).length > 0) {
    return { error: "Validation failed", fields };
  }
  return { data: data as RequiredOnCreate<T, K> };
}

/* ─── Entity parsers ────────────────────────────────────────────────────── */

export function parseProject(
  input: unknown,
  mode: "create"
): ParseResult<RequiredOnCreate<ProjectWrite, "title" | "category">>;
export function parseProject(input: unknown, mode: "update"): ParseResult<ProjectWrite>;
export function parseProject(
  input: unknown,
  mode: WriteMode
): ParseResult<RequiredOnCreate<ProjectWrite, "title" | "category">> {
  return assemble<ProjectWrite, "title" | "category">(
    input,
    {
      title: (v) => asText(v, 120),
      description: (v) => asOptionalText(v, 2000),
      image: (v) => asOptionalText(v, 2048),
      tags: asTags,
      category: (v) => asEnum(v, PROJECT_CATEGORIES),
      complexity: (v) => asText(v, 40),
      performance: (v) => asText(v, 20),
      year: (v) => asText(v, 9),
      liveUrl: asNullableUrl,
      githubUrl: asNullableUrl,
      order: (v) => asInt(v, 0, 100_000),
    },
    ["title", "category"],
    mode
  );
}

export function parseSkill(
  input: unknown,
  mode: "create"
): ParseResult<RequiredOnCreate<SkillWrite, "name" | "category">>;
export function parseSkill(input: unknown, mode: "update"): ParseResult<SkillWrite>;
export function parseSkill(
  input: unknown,
  mode: WriteMode
): ParseResult<RequiredOnCreate<SkillWrite, "name" | "category">> {
  return assemble<SkillWrite, "name" | "category">(
    input,
    {
      name: (v) => asText(v, 80),
      level: (v) => asInt(v, 1, 100),
      category: (v) => asEnum(v, SKILL_CATEGORIES),
      icon: (v) => asText(v, 60),
      order: (v) => asInt(v, 0, 100_000),
    },
    ["name", "category"],
    mode
  );
}

export function parseExperience(
  input: unknown,
  mode: "create"
): ParseResult<RequiredOnCreate<ExperienceWrite, "company" | "role" | "startDate">>;
export function parseExperience(input: unknown, mode: "update"): ParseResult<ExperienceWrite>;
export function parseExperience(
  input: unknown,
  mode: WriteMode
): ParseResult<RequiredOnCreate<ExperienceWrite, "company" | "role" | "startDate">> {
  return assemble<ExperienceWrite, "company" | "role" | "startDate">(
    input,
    {
      company: (v) => asText(v, 120),
      role: (v) => asText(v, 120),
      description: (v) => asOptionalText(v, 2000),
      startDate: asMonth,
      endDate: asOptionalMonth,
      type: (v) => asEnum(v, EXPERIENCE_TYPES),
      order: (v) => asInt(v, 0, 100_000),
    },
    ["company", "role", "startDate"],
    mode
  );
}

export function parseTestimonial(
  input: unknown,
  mode: "create"
): ParseResult<RequiredOnCreate<TestimonialWrite, "name" | "content">>;
export function parseTestimonial(input: unknown, mode: "update"): ParseResult<TestimonialWrite>;
export function parseTestimonial(
  input: unknown,
  mode: WriteMode
): ParseResult<RequiredOnCreate<TestimonialWrite, "name" | "content">> {
  return assemble<TestimonialWrite, "name" | "content">(
    input,
    {
      name: (v) => asText(v, 120),
      role: (v) => asOptionalText(v, 120),
      content: (v) => asText(v, 2000),
      avatar: (v) => asOptionalText(v, 2048),
      order: (v) => asInt(v, 0, 100_000),
    },
    ["name", "content"],
    mode
  );
}

export function parseSocialLink(
  input: unknown,
  mode: "create"
): ParseResult<RequiredOnCreate<SocialWrite, "platform" | "url" | "icon">>;
export function parseSocialLink(input: unknown, mode: "update"): ParseResult<SocialWrite>;
export function parseSocialLink(
  input: unknown,
  mode: WriteMode
): ParseResult<RequiredOnCreate<SocialWrite, "platform" | "url" | "icon">> {
  return assemble<SocialWrite, "platform" | "url" | "icon">(
    input,
    {
      platform: (v) => asText(v, 60),
      url: (v) => asNullableUrl(v),
      icon: (v) => asText(v, 60),
      order: (v) => asInt(v, 0, 100_000),
    },
    ["platform", "url", "icon"],
    mode
  );
}

export function parseSectionCreate(
  input: unknown
): ParseResult<{ key: string } & RequiredOnCreate<SectionWrite, "title">> {
  const body = asRecord(input);
  if (!body) return { error: "Request body must be a JSON object" };

  const key = asEnum(body.key, SECTION_KEYS);
  if (key === null || key === undefined) {
    return {
      error: "Unknown section key",
      fields: { key: `Allowed keys: ${SECTION_KEYS.join(", ")}` },
    };
  }

  const parsed = assemble<SectionWrite, "title">(
    body,
    {
      title: (v) => asText(v, 120),
      subtitle: (v) => asOptionalText(v, 300),
      enabled: asBoolean,
    },
    ["title"],
    "create"
  );
  if ("error" in parsed) return parsed;
  return { data: { ...parsed.data, key } };
}

export function parseSectionPatch(input: unknown): ParseResult<SectionWrite> {
  return assemble<SectionWrite, "title">(
    input,
    {
      title: (v) => asText(v, 120),
      subtitle: (v) => asOptionalText(v, 300),
      enabled: asBoolean,
      order: (v) => asInt(v, 0, 100_000),
    },
    [],
    "update"
  );
}

export function parseConfigPatch(input: unknown): ParseResult<ConfigWrite> {
  return assemble<ConfigWrite, "name">(
    input,
    {
      name: (v) => asText(v, 120),
      tagline: (v) => asOptionalText(v, 160),
      bio: (v) => asOptionalText(v, 4000),
      email: asEmail,
      location: (v) => asOptionalText(v, 120),
      avatar: (v) => asOptionalText(v, 2048),
      status: (v) => asOptionalText(v, 40),
      edition: (v) => asOptionalText(v, 60),
      siteName: (v) => asText(v, 120),
      siteDescription: (v) => asOptionalText(v, 300),
      animationsEnabled: asBoolean,
    },
    [],
    "update"
  );
}

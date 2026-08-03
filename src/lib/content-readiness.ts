/* ════════════════════════════════════════════════════════════════════
   content-readiness.ts — what makes the site's content shippable.

   Every rule about the content in src/data/ lives here, once, instead of
   being transcribed into a test file per module. A new data module gets
   checked by adding it to `auditContent()` below — the rules come free.

   Two severities, because they answer different questions:
     · "blocking"  — broken now. The test suite fails on these.
     · "pre-launch" — deliberate work-in-progress ([placeholder] copy).
       Reported and counted, but not failing: the maintainer has these
       tracked. Run `pnpm run check:launch` to treat them as blocking.
   ════════════════════════════════════════════════════════════════════ */

import { now, type NowEntry } from "../data/now.ts";
import { projects, type ProjectEntry } from "../data/projects.ts";
import { site } from "../data/site.ts";
import { skillGroups, type SkillGroup } from "../data/skills.ts";
import { socialLinks, type SocialLink } from "../data/social.ts";

export type SiteInfo = { -readonly [K in keyof typeof site]: string };

export interface ContentBundle {
  site: SiteInfo;
  projects: readonly ProjectEntry[];
  skills: readonly SkillGroup[];
  social: readonly SocialLink[];
  now: NowEntry;
}

/** The content this site actually ships. */
export const shippedContent: ContentBundle = {
  site,
  projects,
  skills: skillGroups,
  social: socialLinks,
  now,
};

export type Severity = "blocking" | "pre-launch";

export interface ContentIssue {
  module: string;
  where: string;
  severity: Severity;
  message: string;
}

const PLACEHOLDER = "[placeholder]";
const URL_SHAPE = /^(https:\/\/|mailto:)/;
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONTH_SHAPE = /^\d{4}-\d{2}$/;

class Audit {
  readonly issues: ContentIssue[] = [];
  constructor(private module: string) {}

  add(where: string, severity: Severity, message: string) {
    this.issues.push({ module: this.module, where, severity, message });
  }

  copy(where: string, value: string) {
    if (value.trim().length === 0) {
      this.add(where, "blocking", "is empty");
      return;
    }
    if (value.includes(PLACEHOLDER)) {
      this.add(where, "pre-launch", `still contains ${PLACEHOLDER}`);
    }
  }

  url(where: string, value: string) {
    if (!URL_SHAPE.test(value)) {
      this.add(where, "blocking", `is not an https:// or mailto: URL`);
    }
  }

  httpsUrl(where: string, value: string) {
    if (!value.startsWith("https://")) {
      this.add(where, "blocking", "is not an https:// URL");
    }
  }

  oneOf<T extends string>(where: string, value: T, allowed: readonly T[]) {
    if (!allowed.includes(value)) {
      this.add(
        where,
        "blocking",
        `"${value}" is not one of ${allowed.join(", ")}`,
      );
    }
  }

  nonEmpty(where: string, list: readonly unknown[]) {
    if (list.length === 0) this.add(where, "blocking", "is empty");
  }

  unique(where: string, values: readonly string[]) {
    const seen = new Set<string>();
    for (const v of values) {
      if (seen.has(v)) this.add(where, "blocking", `has a duplicate: "${v}"`);
      seen.add(v);
    }
  }
}

export function auditContent(
  content: ContentBundle = shippedContent,
): ContentIssue[] {
  const { site, projects, skills, social, now } = content;
  const issues: ContentIssue[] = [];

  // ── site ──
  {
    const a = new Audit("site");
    for (const f of ["name", "callsign", "role", "lede", "location"] as const) {
      a.copy(f, site[f]);
    }
    if (!EMAIL_SHAPE.test(site.email)) {
      a.add("email", "blocking", "is not a plausible email address");
    }
    a.httpsUrl("url", site.url);
    a.httpsUrl("repo", site.repo);
    issues.push(...a.issues);
  }

  // ── projects ──
  {
    const a = new Audit("projects");
    a.nonEmpty("projects", projects);
    projects.forEach((p, i) => {
      const at = `entry[${i}] "${p.title || "untitled"}"`;
      for (const f of [
        "title",
        "role",
        "dates",
        "oneLine",
        "problem",
        "approach",
        "result",
      ] as const) {
        a.copy(`${at}.${f}`, p[f]);
      }
      a.oneOf(`${at}.status`, p.status, [
        "shipped",
        "ongoing",
        "archived",
      ] as const);
      a.nonEmpty(`${at}.stack`, p.stack);
      // A stack list is shown as chips; a repeat reads as a mistake.
      a.unique(`${at}.stack`, p.stack);
    });
    issues.push(...a.issues);
  }

  // ── skills ──
  {
    const a = new Audit("skills");
    a.nonEmpty("skillGroups", skills);
    a.unique(
      "skillGroups.id",
      skills.map((g) => g.id),
    );
    for (const g of skills) {
      a.copy(`${g.id}.label`, g.label);
      if (g.hint !== undefined) a.copy(`${g.id}.hint`, g.hint);
      a.nonEmpty(`${g.id}.children`, g.children);
      for (const c of g.children) {
        a.copy(`${g.id}/${c.label}`, c.label);
        a.oneOf(`${g.id}/${c.label}.status`, c.status, [
          "prod",
          "familiar",
          "learning",
        ] as const);
      }
    }
    issues.push(...a.issues);
  }

  // ── social ──
  {
    const a = new Audit("social");
    a.nonEmpty("socialLinks", social);
    a.unique(
      "socialLinks.name",
      social.map((s) => s.name),
    );
    for (const s of social) {
      a.copy(`${s.name}.name`, s.name);
      a.url(`${s.name}.url`, s.url);
    }
    issues.push(...a.issues);
  }

  // ── now ──
  {
    const a = new Audit("now");
    if (!MONTH_SHAPE.test(now.month)) {
      a.add("month", "blocking", `"${now.month}" is not YYYY-MM`);
    }
    a.copy("building", now.building);
    for (const f of ["reading", "listening", "pondering"] as const) {
      const v = now[f];
      if (v !== undefined) a.copy(f, v);
    }
    issues.push(...a.issues);
  }

  return issues;
}

/** Issues that mean the site is broken right now. */
export function blockingIssues(
  content: ContentBundle = shippedContent,
): ContentIssue[] {
  return auditContent(content).filter((i) => i.severity === "blocking");
}

/** Issues that mean the site is not finished, but is not broken either. */
export function preLaunchIssues(
  content: ContentBundle = shippedContent,
): ContentIssue[] {
  return auditContent(content).filter((i) => i.severity === "pre-launch");
}

/** Human-readable one-liner per issue, for test output and the CLI gate. */
export function formatIssue(i: ContentIssue): string {
  return `${i.severity === "blocking" ? "✗" : "·"} ${i.module}: ${i.where} ${i.message}`;
}

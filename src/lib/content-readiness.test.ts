import { describe, expect, it } from "vitest";
import {
  auditContent,
  blockingIssues,
  formatIssue,
  preLaunchIssues,
  shippedContent,
  type ContentBundle,
} from "./content-readiness.ts";

function broken(patch: Partial<ContentBundle>): ContentBundle {
  return { ...shippedContent, ...patch };
}

const messages = (c: ContentBundle) => auditContent(c).map(formatIssue);

describe("the shipped content", () => {
  it("has nothing broken", () => {
    expect(blockingIssues().map(formatIssue)).toEqual([]);
  });

  it("still carries its known pre-launch placeholders", () => {
    const pending = preLaunchIssues();
    expect(pending.length).toBeGreaterThan(0);
    expect(new Set(pending.map((i) => i.module))).toEqual(
      new Set(["projects", "skills"]),
    );
  });
});

describe("the rules", () => {
  it("flags empty copy as blocking", () => {
    const c = broken({ now: { ...shippedContent.now, building: "   " } });
    expect(messages(c)).toContain("✗ now: building is empty");
  });

  it("flags a [placeholder] marker as pre-launch, not blocking", () => {
    const c = broken({
      now: { ...shippedContent.now, building: "[placeholder] x" },
    });
    const issue = auditContent(c).find((i) => i.where === "building");
    expect(issue?.severity).toBe("pre-launch");
  });

  it("flags a url that is neither https:// nor mailto:", () => {
    const c = broken({ social: [{ name: "ftp", url: "ftp://example.com" }] });
    expect(messages(c)).toContain(
      "✗ social: ftp.url is not an https:// or mailto: URL",
    );
  });

  it("flags a status outside the allowed set", () => {
    const c = broken({
      projects: [
        { ...shippedContent.projects[0]!, title: "P", status: "wip" as never },
      ],
    });
    expect(messages(c).join("\n")).toContain(
      '"wip" is not one of shipped, ongoing, archived',
    );
  });

  it("flags a duplicate in a stack list", () => {
    const c = broken({
      projects: [
        { ...shippedContent.projects[0]!, title: "P", stack: ["Go", "Go"] },
      ],
    });
    expect(messages(c).join("\n")).toContain('stack has a duplicate: "Go"');
  });

  it("flags duplicate skill group ids and social names", () => {
    const dupGroup = { id: "x", label: "x", children: [] };
    expect(
      messages(broken({ skills: [dupGroup, dupGroup] })).join("\n"),
    ).toContain('skillGroups.id has a duplicate: "x"');
    const link = { name: "same", url: "https://a.example" };
    expect(messages(broken({ social: [link, link] })).join("\n")).toContain(
      'socialLinks.name has a duplicate: "same"',
    );
  });

  it("flags an empty list where entries are required", () => {
    expect(messages(broken({ projects: [] }))).toContain(
      "✗ projects: projects is empty",
    );
    expect(messages(broken({ social: [] }))).toContain(
      "✗ social: socialLinks is empty",
    );
  });

  it("flags a now.month that is not YYYY-MM", () => {
    const c = broken({ now: { ...shippedContent.now, month: "July 2026" } });
    expect(messages(c)).toContain('✗ now: month "July 2026" is not YYYY-MM');
  });

  it("checks every data module, so a new one cannot be added unnoticed", () => {
    const c: ContentBundle = {
      site: { ...shippedContent.site, name: "" },
      projects: [{ ...shippedContent.projects[0]!, title: "" }],
      skills: [{ id: "g", label: "", children: [] }],
      social: [{ name: "s", url: "nope" }],
      now: { ...shippedContent.now, building: "" },
    };
    expect(new Set(auditContent(c).map((i) => i.module))).toEqual(
      new Set(["site", "projects", "skills", "social", "now"]),
    );
  });
});

describe.runIf(process.env.LAUNCH_CHECK === "1")("launch gate", () => {
  it("has no [placeholder] copy left anywhere", () => {
    expect(preLaunchIssues().map(formatIssue)).toEqual([]);
  });
});

describe("formatIssue", () => {
  it("marks blocking with ✗ and pre-launch with ·", () => {
    const base = { module: "site", where: "email", message: "is empty" };
    expect(formatIssue({ ...base, severity: "blocking" })).toBe(
      "✗ site: email is empty",
    );
    expect(formatIssue({ ...base, severity: "pre-launch" })).toBe(
      "· site: email is empty",
    );
  });
});

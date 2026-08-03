import { describe, expect, it } from "vitest";
import { skillGroups } from "../data/skills.ts";
import { treeRows } from "./skill-tree.ts";

const fixture = [
  {
    id: "a",
    label: "alpha",
    hint: "first",
    children: [
      { label: "one", status: "prod" as const },
      { label: "two", status: "learning" as const },
    ],
  },
  {
    id: "b",
    label: "beta",
    children: [{ label: "three", status: "familiar" as const }],
  },
];

describe("treeRows", () => {
  it("emits a root row, then one row per group and child", () => {
    const rows = treeRows(fixture);
    expect(rows.map((r) => r.text)).toEqual([
      "skills/",
      "alpha/",
      "one",
      "two",
      "beta/",
      "three",
    ]);
  });

  it("branches the last group with └── and the rest with ├──", () => {
    const rows = treeRows(fixture);
    expect(rows[1]?.conn).toBe("├── ");
    expect(rows[4]?.conn).toBe("└── ");
  });

  it("rails children of non-last groups and drops the rail on the last", () => {
    const rows = treeRows(fixture);
    expect(rows[2]?.conn).toBe("│   ├── ");
    expect(rows[3]?.conn).toBe("│   └── ");
    expect(rows[5]?.conn).toBe("    └── ");
  });

  it("carries hints on group rows and statuses on leaf rows only", () => {
    const rows = treeRows(fixture);
    expect(rows[1]).toMatchObject({ kind: "dir", hint: "first" });
    expect(rows[1]?.status).toBeUndefined();
    expect(rows[2]).toMatchObject({ kind: "leaf", status: "prod" });
    expect(rows[2]?.hint).toBeUndefined();
  });

  it("draws every row of the real skill groups", () => {
    const expected =
      1 +
      skillGroups.length +
      skillGroups.reduce((n, g) => n + g.children.length, 0);
    expect(treeRows().length).toBe(expected);
  });

  it("gives every leaf a status and every row some text", () => {
    for (const row of treeRows()) {
      expect(row.text.trim().length).toBeGreaterThan(0);
      if (row.kind === "leaf") expect(row.status).toBeDefined();
    }
  });

  it("survives a group with no children", () => {
    const rows = treeRows([{ id: "empty", label: "nothing", children: [] }]);
    expect(rows.map((r) => r.text)).toEqual(["skills/", "nothing/"]);
  });
});

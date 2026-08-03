/* ════════════════════════════════════════════════════════════════════
   skill-tree.ts — how the skills tree is DRAWN.

   Turns the skill groups in data/skills.ts into the rows SkillsTree.astro
   renders: ASCII connectors, rails, and the branch each row sits on.

   src/data/ owns what the content is; this module owns what it looks
   like. SkillsTree.astro is then markup over the result. The reveal
   stagger belongs to the reveal observer in scripts/ui.ts, which counts
   rows from the DOM — so no delay table can fall behind the tree.
   ════════════════════════════════════════════════════════════════════ */

import {
  skillGroups,
  type SkillGroup,
  type SkillStatus,
} from "../data/skills.ts";

export type TreeRowKind = "root" | "dir" | "leaf";

export interface TreeRow {
  conn: string;
  kind: TreeRowKind;
  text: string;
  hint?: string;
  status?: SkillStatus;
}

export function treeRows(groups: SkillGroup[] = skillGroups): TreeRow[] {
  const rows: Omit<TreeRow, "delayMs">[] = [
    { conn: "", kind: "root", text: "skills/" },
  ];

  groups.forEach((group, gi) => {
    const lastGroup = gi === groups.length - 1;
    rows.push({
      conn: lastGroup ? "└── " : "├── ",
      kind: "dir",
      text: `${group.label}/`,
      hint: group.hint,
    });

    const rail = lastGroup ? "    " : "│   ";
    group.children.forEach((child, ci) => {
      const lastLeaf = ci === group.children.length - 1;
      rows.push({
        conn: rail + (lastLeaf ? "└── " : "├── "),
        kind: "leaf",
        text: child.label,
        status: child.status,
      });
    });
  });

  return rows;
}

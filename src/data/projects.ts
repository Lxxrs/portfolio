export type ProjectStatus = "shipped" | "ongoing" | "archived";

export interface ProjectEntry {
  title: string;
  role: string;
  dates: string;
  oneLine: string;
  problem: string;
  approach: string;
  result: string;
  stack: string[];
  status: ProjectStatus;
  isPrivate: boolean;
  /** Show the "Get it on Codeberg" banner inside this case. */
  codebergBanner?: boolean;
}

// ─────────────────────────────────────────────────────────────────────
// FACT-CHECK BEFORE LAUNCH: entries marked [placeholder] are written
// from titles + stack only. Correct dates, numbers, and claims.
// ─────────────────────────────────────────────────────────────────────
export const projects: ProjectEntry[] = [
  {
    title: "Provisioning of productive OpenBSD Routers",
    role: "Internship project",
    dates: "2025-09 – 2026-03",
    oneLine:
      '[placeholder] OpenBSD router fleet managed as code, no more "what did I change at 2am?"',
    problem:
      "[placeholder] Router configs lived in git with copy-paste and manual edits. Drift was the norm. A typo during a late-night reload cost an hour of debugging.",
    approach:
      "[placeholder] Rewrote everything in Pyinfra: idempotent modules for the OpenBSD bits (pf, nginx, dhcpd, unbound, pxe).",
    result:
      "[placeholder] Every device boots to a known state. Adding a node or rolling a change is one command. No more drift.",
    stack: ["OpenBSD", "Python", "pyinfra", "uv", "OpenBSD", "GitLab"],
    status: "shipped",
    isPrivate: true,
  },
  {
    title: "Containerlab Network Lab",
    role: "lab / testing",
    dates: "2026-07 – ongoing",
    oneLine:
      "[placeholder] Reproducible network topologies for testing pf failover before it hits real hardware",
    problem:
      "[placeholder] Testing routing and firewall changes on production hardware is how outages are born; a disposable, realistic lab was missing.",
    approach:
      "[placeholder] containerlab topologies spun up per experiment: OpenBSD nodes, FRR peers, the same Pyinfra modules as production — lab and prod share one source of truth.",
    result:
      "[placeholder] CARP failover, pf rules, and routing changes rehearsed in minutes, thrown away after. Production only sees rehearsed changes.",
    stack: ["Containerlab", "OpenBSD", "pyinfra", "Docker"],
    status: "ongoing",
    isPrivate: false,
    codebergBanner: true,
  },
  {
    title: "Homelab & Network Infrastructure",
    role: "personal infra",
    dates: "2023 – ongoing",
    oneLine:
      "[placeholder] Self-hosted storage, offsite backups, and a stack of services I'd otherwise rent",
    problem:
      "[placeholder] Needed storage and always-on services without a cloud subscription or closed NAS firmware. Offsite backup non-negotiable after a disk died once.",
    approach:
      "[placeholder] TrueNAS Scale, ZFS mirrors, nightly snapshots, encrypted rsync over WireGuard to a friend's attic box. Services in incus containers via the same Pyinfra modules.",
    result:
      "[placeholder] Two years of uptime, one disk replaced without drama, restores tested quarterly. No vendor lock-in, no monthly bill.",
    stack: [
      "OPNsense",
      "Mikrotik",
      "Raspberry Pi",
      "Home Assistant",
      "TrueNAS Scale",
    ],
    status: "ongoing",
    isPrivate: true,
  },
  {
    title: "This Website",
    role: "design + build",
    dates: "2025 – ongoing",
    oneLine:
      "A one-pager that boots like a terminal because I'm a sysadmin and that's the joke",
    problem:
      "Most sysadmin portfolios are matrix rain and three lines about being a hacker. I wanted real case studies with the terminal aesthetic as seasoning, not the meal.",
    approach:
      "Astro 7 static output, CSS-first animations, one tiny hashed script (theme, reveals, decrypt). Strict CSP, security headers, noindex everywhere. Built and deployed by Woodpecker CI to Codeberg Pages.",
    result:
      "Fast, private, auditable: no analytics, no cookies, no third-party requests. The commit hash in the footer is the one serving this page.",
    stack: ["Astro", "TypeScript", "Tailwind", "Woodpecker CI"],
    status: "ongoing",
    isPrivate: false,
    codebergBanner: true,
  },
];

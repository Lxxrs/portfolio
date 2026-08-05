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
  repo?: string;
}

export const projects: ProjectEntry[] = [
  {
    title: "Provisioning of productive OpenBSD Routers",
    role: "Internship & IHK project · Research Center Juelich",
    dates: "2025-09 – 2026-05",
    oneLine:
      "The OpenBSD routers in front of a 100-GPU HPC cluster, provisioned from a git repository instead of by hand — five hours down to twenty-five minutes.",
    problem:
      "Every router was configured by hand. VLANs, firewall rules, resolver, DHCP scopes and PXE all lived in files nobody diffed and in one admin's memory. Bringing up or rebuilding a machine took about five hours, and no two of them were quite alike.",
    approach:
      "I rewrote the entire configuration as pyinfra code: agentless over SSH, no state on the target. Every service — VLANs, pf, DNS, DHCP, PXE, the nginx proxy, prometheus exporters and rsync interface — became data in an inventory, applied idempotently. Changes went through merge requests and code review, so the repository is now the only place a router gets configured.",
    result:
      "Provisioning dropped from roughly five hours to twenty-five minutes and configuration drift stopped happening: a rebuild is a re-run, not an excavation. The time invested breaks even after about eight months. Submitted as my IHK final project.",
    stack: [
      "OpenBSD",
      "pyinfra",
      "Python",
      "Prometheus",
      "pf",
      "nginx",
      "GitLab",
      "uv",
    ],
    status: "shipped",
    isPrivate: true,
  },

  {
    title: "Virtualized Network Automation using Containerlab & pyinfra",
    role: "network and testing lab",
    dates: "2026-07 – ongoing",
    oneLine:
      "Internship router work rebuilt as a lab anyone can spin up on a Linux box with Docker.",
    problem:
      "The bare-metal fleet is behind an internal repository on an internal cluster — I can describe it, but I can't show it. I also wanted somewhere to break routing changes that wasn't production.",
    approach:
      "Two OpenBSD 7.8 routers as QEMU VMs inside Containerlab via vrnetlab, two Alpine clients, a /30 transit link between the routers and a LAN behind each. The same mechanism as in production: agentless SSH, no state on the target — renders the interface files, static routes and forwarding from per-host data. Interfaces are only restarted when the rendered file actually changed, so repeat runs never bounce a link.",
    result:
      "One containerlab deploy, one pyinfra run, and traceroute across both routers shows two hops. Disposable and reproducible, with the README documenting every trap I hit on the way: the 7.9 cloud-init credentials bug, the empty resolver on first boot, the terminfo warnings. pf, unbound and kea-dhcp are next.",
    stack: ["Containerlab", "OpenBSD", "vrnetlab", "pyinfra", "Docker", "uv"],
    status: "ongoing",
    isPrivate: false,
    repo: "https://codeberg.org/Lxrs/pyinfra-routers-lab",
  },

  {
    title: "Homelab & Network Infrastructure",
    role: "personal infra",
    dates: "2024-11 – ongoing",
    oneLine:
      "A segmented home network and a NAS that quietly runs services for my family.",
    problem:
      "A flat network with everything on one segment, and family photos living on exactly one disk. I also wanted to run the things I'd otherwise rent, and to have somewhere to make mistakes that isn't work.",
    approach:
      "OPNsense as the firewall with segmented VLANs behind a MikroTik L3 switch, a filtering resolver with automated Let's Encrypt certificates, and TrueNAS Scale for storage. Services run in Docker, Uptime Kuma watches them, and backups go encrypted to S3 so a fire in this flat isn't a data-loss event.",
    result:
      "Family members use it without knowing it exists, which is the highest praise home infrastructure gets. Nearly everything I've deployed at work, I broke here first — including one OPNsense box whose BIOS I bricked flashing firmware.",
    stack: [
      "OPNsense",
      "MikroTik",
      "TrueNAS Scale",
      "Docker",
      "Uptime Kuma",
      "WireGuard",
      "Raspberry Pi",
      "Home Assistant",
    ],
    status: "ongoing",
    isPrivate: true,
  },

  {
    title: "This Website",
    role: "design + build",
    dates: "2024-12 – ongoing",
    oneLine:
      "A one-pager that boots like a terminal because I'm a sysadmin and that's the joke",
    problem:
      "Most sysadmin portfolios are matrix rain and three lines about being a hacker. I wanted real case studies with the terminal aesthetic as seasoning, not the meal.",
    approach:
      "Astro static output, CSS-first animations, one tiny hashed script (theme, reveals, decrypt). Strict CSP, security headers, noindex everywhere. DNS with DNSSEC via deSEC, built and deployed by Forgejo Actions to Codeberg Pages.",
    result:
      "Fast, private, auditable: no analytics, no cookies, no third-party requests (one opt-in exception: an embedded Tor Snowflake proxy). The commit hash in the footer is the one serving this page.",
    stack: [
      "Astro",
      "TypeScript",
      "Tailwind",
      "Forgejo Actions",
      "Codeberg Pages",
      "deSEC",
    ],
    status: "ongoing",
    isPrivate: false,
    repo: "https://codeberg.org/Lxrs/portfolio",
  },
];

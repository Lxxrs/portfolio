export type SkillStatus = "prod" | "familiar" | "learning";

export interface SkillNode {
  label: string;
  status: SkillStatus;
}
export interface SkillGroup {
  id: string;
  label: string;
  hint?: string;
  children: SkillNode[];
}

const node = (label: string, status: SkillStatus): SkillNode => ({
  label,
  status,
});

export const skillGroups: SkillGroup[] = [
  {
    id: "os",
    label: "operating-systems",
    hint: "what I run and break",
    children: [
      node("Linux (Debian)", "prod"),
      node("OpenBSD", "prod"),
      node("OPNsense", "familiar"),
      node("macOS", "prod"),
      node("NixOS", "learning"),
    ],
  },

  {
    id: "net",
    label: "networking-and-services",
    hint: "what I route, resolve and filter",
    children: [
      node("TCP/IP · VLANs · Routing", "prod"),
      node("DNS / Unbound", "prod"),
      node("DNSSEC (deSEC)", "prod"),
      node("Firewall (pf / OPNsense)", "familiar"),
      node("Let's Encrypt / ACME", "familiar"),
      node("Reverse Proxy (nginx / Caddy)", "familiar"),
      node("DHCP (ISC DHCP / Kea)", "familiar"),
      node("VPN (WireGuard / Tailscale)", "familiar"),
      node("PXE / netboot", "familiar"),
    ],
  },

  {
    id: "ops",
    label: "operations-and-iac",
    hint: "automate before you forget",
    children: [
      node("pyinfra", "prod"),
      node("Git / GitLab", "prod"),
      node("Forgejo / Codeberg CI", "familiar"),
      node("Docker", "familiar"),
      node("Containerlab", "familiar"),
      node("vrnetlab", "familiar"),
      node("Proxmox VE / KVM", "familiar"),
      node("Backups (S3 / rsync)", "familiar"),
      node("Ansible", "learning"),
      node("OpenTofu / Terraform", "learning"),
      node("Kubernetes (K3s / K8s)", "learning"),
      node("NetBox", "learning"),
    ],
  },

  {
    id: "obs",
    label: "observability",
    hint: "knowing before the phone rings",
    children: [
      node("Uptime Kuma", "prod"),
      node("Prometheus Exporter (node / pf / nginx", "familiar"),
      node("Prometheus", "learning"),
      node("Grafana", "learning"),
    ],
  },

  {
    id: "code",
    label: "code-and-tooling",
    hint: "things I reach for",
    children: [
      node("Bash / POSIX sh", "prod"),
      node("Neovim", "prod"),
      node("Python", "familiar"),
      node("SQL (MySQL / MariaDB)", "familiar"),
      node("HTML / CSS", "familiar"),
      node("TypeScript / Astro", "learning"),
      node("Golang", "learning"),
    ],
  },

  {
    id: "lab",
    label: "lab-and-hardware",
    hint: "what's humming in the corner",
    children: [
      node("Raspberry Pi", "prod"),
      node("Arch / CachyOS", "prod"),
      node("ThinkPad T480", "prod"),
      node("TrueNAS Scale", "familiar"),
      node("MikroTik (RouterOS)", "learning"),
    ],
  },

  {
    id: "certs",
    label: "certifications",
    hint: "what I reached",
    children: [
      node("IHK - IT Specialist for Systems Integration (2026-07)", "prod"),
      node("LPI Linux Essentials (2025-06)", "prod"),
      node("LPI LPIC-1 (ongoing)", "learning"),
      node("Cisco CCNA (ongoing)", "learning"),
    ],
  },
];

// Skills
// OSes: Linux (Arch, Debian, Ubuntu), Unix (OpenBSD), macOS
// Networking: TCP/IP, DNS, VLANs, DHCP, Firewalling (OPNsense), Routing, VPN (WireGuard)
// Infrastructure & Tools: pyinfra, Git / GitLab, Docker, Proxmox, Containerlab, Vim (Neovim)
// Programming: Bash, Python Scripting, HTML/CSS, SQL
// Certifications: LPI Linux Essentials
// Learning / Interested to learn: Ansible, Golang, Kubernetes, OpenTofu / Terraform, Observability (Prometheus, Grafana, Victoria Metrics, etc.), Zig, NixOS

export const statusLabel: Record<SkillStatus, string> = {
  prod: "production",
  familiar: "familiar",
  learning: "learning",
};
export const statusChar: Record<SkillStatus, string> = {
  prod: "■",
  familiar: "◐",
  learning: "○",
};

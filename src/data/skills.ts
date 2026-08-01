export type SkillStatus = "prod" | "familiar" | "learning";

export interface SkillNode { label: string; status: SkillStatus; }
export interface SkillGroup { id: string; label: string; hint?: string; children: SkillNode[]; }

const node = (label: string, status: SkillStatus): SkillNode => ({ label, status });

export const skillGroups: SkillGroup[] = [
  { id: "os", label: "operating-systems", hint: "what I run and break", children: [
    node("Linux (Arch, Debian, NixOS, Alpine)", "prod"),
    node("OpenBSD", "familiar"),
    node("FreeBSD / OPNsense", "learning"),
    node("macOS (daily driver)", "prod"),
    node("NixOS", "learning"),
  ]},
  { id: "net", label: "networking-and-services", hint: "self-hosted stack", children: [
    node("DNS / BIND / Unbound / Knot", "familiar"),
    node("Nginx / Caddy / HAProxy", "familiar"),
    node("WireGuard / Tailscale", "familiar"),
  ]},
  { id: "ops", label: "operations-and-iac", hint: "automate before you forget", children: [
    node("Pyinfra", "prod"),
    node("Ansible", "learning"),
    node("Bash / POSIX sh", "prod"),
    node("Terraform", "learning"),
  ]},
  { id: "sec", label: "security-and-hardening", hint: "the reason I do the rest", children: [
    node("Threat modelling / STRIDE", "prod"),
    node("SSH host certs / FIDO2", "prod"),
    node("Sandboxing (namespaces, jails, bubblewrap)", "familiar"),
    node("Burp Suite / nmap / Wireshark", "familiar"),
  ]},
  { id: "code", label: "code-and-tooling", hint: "things I reach for", children: [
    node("Python", "familiar"),
    node("TypeScript / Astro", "learning"),
    node("Go", "learning"),
    node("Git", "prod"),
  ]},
  { id: "lab", label: "lab-and-hardware", hint: "what's humming in the corner", children: [
    node("Proxmox / KVM / incus", "familiar"),
    node("TrueNAS Scale", "prod"),
    node("MikroTik / OpenWrt", "familiar"),
    node("Raspberry Pi clusters", "prod"),
    node("Old ThinkPads (t480)", "prod"),
  ]},
];

export const statusLabel: Record<SkillStatus, string> = {
  prod: "production", familiar: "familiar", learning: "learning",
};
export const statusChar: Record<SkillStatus, string> = {
  prod: "■", familiar: "◐", learning: "○",
};

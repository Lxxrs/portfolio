import {
  Mail,
  Heart,
  RefreshCcw,
  Terminal,
  CodeXml,
  GitPullRequestArrow,
  Shield,
} from "@lucide/vue";

import IconLinkedin from "../components/IconLinkedin.vue";
import IconMastodon from "../components/IconMastodon.vue";
import IconSignal from "../components/IconSignal.vue";
import IconLiberapay from "../components/IconLiberapay.vue";
import IconCodeberg from "../components/IconCodeberg.vue";
import IconMatrix from "../components/IconMatrix.vue";

import type { SocialLink, Project, Skill } from "../types";

export const socialLinks: SocialLink[] = [
  { name: "Email", url: "mailto:lm@larmart.de", icon: Mail },
  {
    name: "Signal",
    url: "https://signal.me/#eu/ckC_oGqqyOXvnQE_GX2syStPgfip87lPFXsNvGn9Ytpe8BkapedCuKLiesQQgivm",
    icon: IconSignal,
  },
  { name: "Mastodon", url: "https://mastodon.online/@lxrs", icon: IconMastodon },
  { name: "LinkedIn", url: "https://linkedin.com/in/m-lrs", icon: IconLinkedin },
  { name: "Codeberg", url: "https://codeberg.org/lxrs", icon: IconCodeberg },
  { name: "Liberapay", url: "https://liberapay.com/lars/donate", icon: IconLiberapay },
  { name: "Matrix", url: "https://matrix.to/#/@lxrss:matrix.org", icon: IconMatrix },
];

export const skills: Skill[] = [
  { label: "Linux / Unix", icon: Heart },
  { label: "Pyinfra / IaC", icon: RefreshCcw },
  { label: "Bash Scripting", icon: Terminal },
  { label: "Python", icon: CodeXml },
  { label: "Git & CI/CD", icon: GitPullRequestArrow },
  { label: "Cyber Security", icon: Shield },
];

export const projects: Project[] = [
  {
    title: "IaC OpenBSD-Config",
    desc: "Production-grade IaC for OpenBSD router configuration using Pyinfra. Leverages Python to manage device state, reducing deployment time by 80% and eliminate configuration drift.",
    stack: ["Python", "Pyinfra", "NetOps"],
    isPrivate: true,
    // repoUrl: 'https://codeberg.org/user/pyinfra-router'
  },
  {
    title: "Homelab NAS",
    desc: "Self-hosted storage solution using TrueNAS Scale. Automated backup system with AWS S3 integration for offsite redundancy. Dockerized services for optimized deployment and management.",
    stack: ["TrueNAS", "Cloud Backups", "Docker"],
    isPrivate: true,
  },
  {
    title: "Portfolio Website",
    desc: "A SysAdmin portfolio with a custom terminal aesthetic. Built with Vue and Tailwind, prioritizing performance and accessibility in mind.",
    stack: ["Vue", "TypeScript", "Tailwind"],
    repoUrl: "https://codeberg.org/Lxrs/portfolio",
  },
];

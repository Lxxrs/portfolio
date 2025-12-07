import { 
  Mail, 
  Heart, 
  RefreshCcw, 
  Terminal, 
  CodeXml, 
  GitPullRequestArrow, 
  Shield 
} from 'lucide-vue-next';

import LinkedinIcon from '../components/LinkedinIcon.vue';
import MastodonIcon from '../components/MastodonIcon.vue';
import SignalIcon from '../components/SignalIcon.vue';
import LiberapayIcon from '../components/LiberapayIcon.vue';
import CodebergIcon from '../components/CodebergIcon.vue';

import type { SocialLink, Project, Skill } from '../types';

export const socialLinks: SocialLink[] = [
  { name: 'Email', url: 'mailto:kontakt@larmart.de', icon: Mail },
  { name: 'Signal', url: 'https://signal.me/#username', icon: SignalIcon },
  { name: 'Mastodon', url: 'https://mastodon.social/@user', icon: MastodonIcon },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/m-lrs', icon: LinkedinIcon },
  { name: 'Codeberg', url: 'https://codeberg.org/Lxrs', icon: CodebergIcon },
  { name: 'Liberapay', url: 'https://liberapay.com/user', icon: LiberapayIcon },
];

export const skills: Skill[] = [
  { label: 'Linux / BSD', icon: Heart },
  { label: 'Ansible / Pyinfra', icon: RefreshCcw },
  { label: 'Bash Scripting', icon: Terminal },
  { label: 'Python / Go', icon: CodeXml },
  { label: 'Git & CI/CD', icon: GitPullRequestArrow },
  { label: 'Cyber Security', icon: Shield },
];

export const projects: Project[] = [
  {
    title: 'Pyinfra Router',
    desc: 'Production-grade automation script for router configuration. Leverages Python and Pyinfra to manage device state, reducing deployment time by 80% and eliminate configuration drift.',
    stack: ['Python', 'Pyinfra', 'NetOps'],
    isPrivate: true,
    // repoUrl: 'https://codeberg.org/user/pyinfra-router'
  },
  {
    title: 'Homelab NAS',
    desc: 'Self-hosted storage solution using TrueNAS Scale. Features ZFS data integrity, automated snapshot policies, and secure remote access via WireGuard.',
    stack: ['TrueNAS', 'ZFS', 'WireGuard'],
    isPrivate: true
  },
  {
    title: 'Portfolio Website',
    desc: 'A SysAdmin portfolio with a custom terminal aesthetic. Built with Vue and Tailwind, prioritizing performance and accessibility in mind.',
    stack: ['Vue', 'TypeScript', 'Tailwind'],
    repoUrl: 'https://codeberg.org/Lxrs/larmart.de'
  }
];

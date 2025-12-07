import type { Component } from 'vue';

export interface SocialLink {
  name: string;
  url: string;
  icon: Component;
}

export interface Project {
  title: string;
  desc: string;
  stack: string[];
  repoUrl?: string;
  isPrivate?: boolean;
}

export interface Skill {
  label: string;
  icon: Component;
}

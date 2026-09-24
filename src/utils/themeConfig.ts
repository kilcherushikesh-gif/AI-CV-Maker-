import { ColorThemeId, FontId } from '../types/resume';

export interface ThemeColors {
  id: ColorThemeId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  lightBg: string;
  subtleBorder: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
}

export const COLOR_THEMES: Record<ColorThemeId, ThemeColors> = {
  navy: {
    id: 'navy',
    name: 'Classic Navy',
    primary: '#0f172a', // slate-900
    secondary: '#1e3a8a', // blue-900
    accent: '#2563eb', // blue-600
    lightBg: '#eff6ff', // blue-50
    subtleBorder: '#cbd5e1', // slate-300
    textColor: '#1e293b',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
  },
  emerald: {
    id: 'emerald',
    name: 'Modern Emerald',
    primary: '#064e3b',
    secondary: '#047857',
    accent: '#059669',
    lightBg: '#ecfdf5',
    subtleBorder: '#a7f3d0',
    textColor: '#064e3b',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
  },
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    primary: '#312e81',
    secondary: '#4338ca',
    accent: '#4f46e5',
    lightBg: '#eef2ff',
    subtleBorder: '#c7d2fe',
    textColor: '#1e1b4b',
    badgeBg: '#e0e7ff',
    badgeText: '#3730a3',
  },
  slate: {
    id: 'slate',
    name: 'Executive Charcoal',
    primary: '#0f172a',
    secondary: '#334155',
    accent: '#475569',
    lightBg: '#f8fafc',
    subtleBorder: '#e2e8f0',
    textColor: '#0f172a',
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
  },
  burgundy: {
    id: 'burgundy',
    name: 'Crimson Burgundy',
    primary: '#4c0519',
    secondary: '#881337',
    accent: '#be123c',
    lightBg: '#fff1f2',
    subtleBorder: '#fecdd3',
    textColor: '#4c0519',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239',
  },
  teal: {
    id: 'teal',
    name: 'Ocean Teal',
    primary: '#134e4a',
    secondary: '#0f766e',
    accent: '#0d9488',
    lightBg: '#f0fdfa',
    subtleBorder: '#99f6e4',
    textColor: '#134e4a',
    badgeBg: '#ccfbf1',
    badgeText: '#115e59',
  },
};

export const FONT_CONFIG: Record<FontId, { name: string; className: string; description: string }> = {
  inter: {
    name: 'Inter Modern',
    className: 'font-inter',
    description: 'Clean, contemporary, highly legible for ATS scans',
  },
  merriweather: {
    name: 'Merriweather Serif',
    className: 'font-merriweather',
    description: 'Sophisticated editorial look for executive & academic CVs',
  },
  jakarta: {
    name: 'Plus Jakarta',
    className: 'font-jakarta',
    description: 'Modern geometric sans with distinctive technical edge',
  },
};

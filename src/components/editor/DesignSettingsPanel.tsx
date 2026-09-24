import React from 'react';
import { ResumeDesignConfig, TemplateId, ColorThemeId, FontId, ResumeData } from '../../types/resume';
import { COLOR_THEMES, FONT_CONFIG } from '../../utils/themeConfig';
import { SAMPLE_TECH_LEAD, SAMPLE_PRODUCT_MANAGER, SAMPLE_GRADUATE, INITIAL_EMPTY_RESUME } from '../../data/sampleProfiles';
import { SectionOrderManager } from './SectionOrderManager';
import { Layout, Palette, Type, Sliders, Image, Sparkles, UserCheck, Layers } from 'lucide-react';

interface Props {
  config: ResumeDesignConfig;
  onChangeConfig: (newConfig: ResumeDesignConfig) => void;
  onLoadPreset: (resume: ResumeData) => void;
  resumeData?: ResumeData;
  onChangeResumeData?: (data: ResumeData) => void;
}

const TEMPLATES: { id: TemplateId; name: string; tag: string; description: string }[] = [
  { id: 'modern-executive', name: 'Modern Executive', tag: 'Most Popular', description: 'Dual-tone header with crisp badges and balanced two-column flow' },
  { id: 'minimal-swiss', name: 'Minimalist Swiss', tag: 'ATS Favorite', description: 'High-contrast typography and clean dividers optimized for ATS parsers' },
  { id: 'tech-clean', name: 'Tech Clean', tag: 'Developer', description: 'Monospace tags and system-focused layouts for engineers & tech leads' },
  { id: 'nordic-split', name: 'Nordic Split', tag: 'Two-Column', description: '30% sidebar for contacts, skills, and languages with prominent main column' },
  { id: 'serif-classic', name: 'Serif Classic', tag: 'Executive / Law', description: 'Refined Merriweather typography for consulting, academia, and leadership' },
  { id: 'creative-accent', name: 'Creative Accent', tag: 'Modern', description: 'Vibrant modern accent banner with stylish pill tags' },
];

export const DesignSettingsPanel: React.FC<Props> = ({
  config,
  onChangeConfig,
  onLoadPreset,
  resumeData,
  onChangeResumeData,
}) => {
  const update = (patch: Partial<ResumeDesignConfig>) => {
    onChangeConfig({ ...config, ...patch });
  };

  return (
    <div className="space-y-6">
      {/* Sample Profiles Quick Load */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
        <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Load Ready-Made Sample Profile:</span>
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => onLoadPreset(SAMPLE_TECH_LEAD)}
            className="p-2 rounded-lg bg-white hover:bg-indigo-100/50 border border-indigo-200 text-left font-medium text-slate-800 transition-colors shadow-2xs"
          >
            💻 Full-Stack Lead / Architect
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset(SAMPLE_PRODUCT_MANAGER)}
            className="p-2 rounded-lg bg-white hover:bg-indigo-100/50 border border-indigo-200 text-left font-medium text-slate-800 transition-colors shadow-2xs"
          >
            🎯 Lead Product Mgr
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset(SAMPLE_GRADUATE)}
            className="p-2 rounded-lg bg-white hover:bg-indigo-100/50 border border-indigo-200 text-left font-medium text-slate-800 transition-colors shadow-2xs"
          >
            🎓 CS Graduate
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset(INITIAL_EMPTY_RESUME)}
            className="p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-left font-medium text-slate-600 hover:text-rose-600 transition-colors shadow-2xs"
          >
            📄 Blank Template
          </button>
        </div>
      </div>

      {/* Section Vertical Order (Drag & Drop) */}
      {resumeData && onChangeResumeData && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
          <SectionOrderManager
            data={resumeData}
            onChangeOrder={(newOrder) => {
              onChangeResumeData({ ...resumeData, sectionOrder: newOrder });
            }}
          />
        </div>
      )}

      {/* Template Chooser */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-slate-400" />
          <span>Resume Template</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TEMPLATES.map((tmpl) => {
            const isSelected = config.template === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => update({ template: tmpl.id })}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {tmpl.name}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tmpl.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {tmpl.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Themes */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span>Color Theme</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(COLOR_THEMES).map(([id, theme]) => {
            const isSelected = config.colorTheme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => update({ colorTheme: id as ColorThemeId })}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                  style={{ backgroundColor: theme.accent }}
                />
                <span className="text-xs font-semibold text-slate-700 truncate">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <span>Typography</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(FONT_CONFIG).map(([id, font]) => {
            const isSelected = config.font === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => update({ font: id as FontId })}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`text-base font-bold text-slate-900 ${font.className}`}>
                  Aa
                </div>
                <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                  {font.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacing & Layout controls */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Content Density</span>
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
            {(['compact', 'standard', 'spacious'] as const).map((space) => (
              <button
                key={space}
                type="button"
                onClick={() => update({ spacing: space })}
                className={`flex-1 py-1 rounded-md capitalize font-medium transition-colors ${
                  config.spacing === space ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'
                }`}
              >
                {space}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
            <Image className="w-3.5 h-3.5 text-slate-400" />
            <span>Profile Photo</span>
          </label>
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-700 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showPhoto}
                onChange={(e) => update({ showPhoto: e.target.checked })}
                className="rounded text-indigo-600"
              />
              <span>Display Photo</span>
            </label>

            {config.showPhoto && (
              <select
                value={config.photoShape}
                onChange={(e) => update({ photoShape: e.target.value as any })}
                className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="circle">Circle</option>
                <option value="rounded">Rounded</option>
                <option value="square">Square</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

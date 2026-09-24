import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, ResumeDesignConfig, TemplateId, ColorThemeId } from '../../types/resume';
import { ModernExecutiveTemplate } from './ModernExecutiveTemplate';
import { MinimalSwissTemplate } from './MinimalSwissTemplate';
import { TechCleanTemplate } from './TechCleanTemplate';
import { NordicSplitTemplate } from './NordicSplitTemplate';
import { SerifClassicTemplate } from './SerifClassicTemplate';
import { CreativeAccentTemplate } from './CreativeAccentTemplate';
import { COLOR_THEMES } from '../../utils/themeConfig';
import { SectionOrderModal } from '../editor/SectionOrderModal';
import { DEFAULT_SECTION_ORDER, normalizeSectionId } from '../editor/SectionOrderManager';
import { 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  Layout, 
  ChevronDown, 
  Check, 
  Palette,
  Briefcase,
  Layers
} from 'lucide-react';

interface Props {
  data: ResumeData;
  config: ResumeDesignConfig;
  onChangeConfig?: (newConfig: ResumeDesignConfig) => void;
  onChangeResumeData?: (data: ResumeData) => void;
  onOpenAIGenerator: () => void;
  onOpenJobMatcher: () => void;
  onOpenCoverLetter: () => void;
  onOpenPdfATS?: () => void;
}

const TEMPLATES: { id: TemplateId; name: string; tag: string; description: string; icon: string }[] = [
  { 
    id: 'modern-executive', 
    name: 'Modern Executive', 
    tag: 'Recommended / MBA', 
    description: 'Corporate dual-tone header with crisp badges and balanced professional flow', 
    icon: '👔' 
  },
  { 
    id: 'minimal-swiss', 
    name: 'Minimalist Swiss', 
    tag: 'ATS Favorite', 
    description: 'Harvard-style single column with maximum readability and ATS score', 
    icon: '🇨🇭' 
  },
  { 
    id: 'serif-classic', 
    name: 'Serif Classic', 
    tag: 'Executive / Law', 
    description: 'Refined serif typography for consulting, management, finance & academia', 
    icon: '⚖️' 
  },
  { 
    id: 'nordic-split', 
    name: 'Nordic Split', 
    tag: 'Two-Column', 
    description: '30% structured sidebar for contacts and skills with prominent main column', 
    icon: '📋' 
  },
  { 
    id: 'creative-accent', 
    name: 'Creative Accent', 
    tag: 'Marketing / Media', 
    description: 'Vibrant modern header accent for marketing, design & product roles', 
    icon: '🎨' 
  },
  { 
    id: 'tech-clean', 
    name: 'Tech Modern', 
    tag: 'Engineering', 
    description: 'Clean modern grid for technology and analytics specialists', 
    icon: '💻' 
  },
];

export const ResumePreview: React.FC<Props> = ({
  data,
  config,
  onChangeConfig,
  onChangeResumeData,
  onOpenAIGenerator,
  onOpenJobMatcher,
  onOpenCoverLetter,
  onOpenPdfATS,
}) => {
  const [zoom, setZoom] = useState<number>(0.9);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSectionOrderOpen, setIsSectionOrderOpen] = useState(false);
  const templateMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(event.target as Node)) {
        setIsTemplateMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(0.9);

  const currentTemplate = TEMPLATES.find((t) => t.id === config.template) || TEMPLATES[0];

  const handleSelectTemplate = (templateId: TemplateId) => {
    if (onChangeConfig) {
      onChangeConfig({
        ...config,
        template: templateId,
      });
    }
    setIsTemplateMenuOpen(false);
  };

  const handleSelectTheme = (themeId: ColorThemeId) => {
    if (onChangeConfig) {
      onChangeConfig({
        ...config,
        colorTheme: themeId,
      });
    }
    setIsThemeMenuOpen(false);
  };

  // Quick move handlers for hover controls
  const handleMoveSectionUp = (sectionId: string) => {
    if (!onChangeResumeData) return;
    const rawOrder = (data.sectionOrder && data.sectionOrder.length > 0)
      ? data.sectionOrder.map(normalizeSectionId)
      : DEFAULT_SECTION_ORDER;
    const currentOrder = Array.from(new Set([...rawOrder, ...DEFAULT_SECTION_ORDER]));
    const norm = normalizeSectionId(sectionId);
    const idx = currentOrder.indexOf(norm);
    if (idx <= 0) return;

    const updated = [...currentOrder];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    onChangeResumeData({ ...data, sectionOrder: updated });
  };

  const handleMoveSectionDown = (sectionId: string) => {
    if (!onChangeResumeData) return;
    const rawOrder = (data.sectionOrder && data.sectionOrder.length > 0)
      ? data.sectionOrder.map(normalizeSectionId)
      : DEFAULT_SECTION_ORDER;
    const currentOrder = Array.from(new Set([...rawOrder, ...DEFAULT_SECTION_ORDER]));
    const norm = normalizeSectionId(sectionId);
    const idx = currentOrder.indexOf(norm);
    if (idx === -1 || idx >= currentOrder.length - 1) return;

    const updated = [...currentOrder];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    onChangeResumeData({ ...data, sectionOrder: updated });
  };

  const renderTemplate = () => {
    const commonProps = {
      data,
      config,
      onMoveSectionUp: onChangeResumeData ? handleMoveSectionUp : undefined,
      onMoveSectionDown: onChangeResumeData ? handleMoveSectionDown : undefined,
    };

    switch (config.template) {
      case 'minimal-swiss':
        return <MinimalSwissTemplate {...commonProps} />;
      case 'tech-clean':
        return <TechCleanTemplate {...commonProps} />;
      case 'nordic-split':
        return <NordicSplitTemplate {...commonProps} />;
      case 'serif-classic':
        return <SerifClassicTemplate {...commonProps} />;
      case 'creative-accent':
        return <CreativeAccentTemplate {...commonProps} />;
      case 'modern-executive':
      default:
        return <ModernExecutiveTemplate {...commonProps} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Optional helper banner if on tech-clean template for non-dev profiles */}
      {config.template === 'tech-clean' && onChangeConfig && (
        <div className="no-print bg-indigo-50 border-b border-indigo-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-indigo-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Looking for a formal corporate format?</strong> Modern Executive or Minimalist Swiss are recommended for corporate, MBA, and business profiles.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectTemplate('modern-executive')}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>👔 Switch to Modern Executive Format</span>
          </button>
        </div>
      )}

      {/* Top Action & Template Selector Bar (hidden during print) */}
      <div className="no-print h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between z-20 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Template Selector Dropdown */}
          {onChangeConfig && (
            <div className="relative" ref={templateMenuRef}>
              <button
                type="button"
                onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 transition-all shadow-2xs cursor-pointer"
                title="Change professional resume template"
              >
                <Layout className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="hidden md:inline text-slate-500 font-normal">Format:</span>
                <span className="font-bold flex items-center gap-1">
                  <span>{currentTemplate.icon}</span>
                  <span className="hidden sm:inline">{currentTemplate.name}</span>
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {isTemplateMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150 mb-1">
                    Select Professional Resume Format
                  </div>
                  {TEMPLATES.map((tmpl) => {
                    const isSelected = tmpl.id === config.template;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/70 text-indigo-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-lg leading-tight mt-0.5">{tmpl.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{tmpl.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              isSelected ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {tmpl.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                            {tmpl.description}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Reorder Sections Button */}
          {onChangeResumeData && (
            <button
              type="button"
              onClick={() => setIsSectionOrderOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all shadow-2xs cursor-pointer"
              title="Drag and drop to reorder resume sections (Experience, Education, Projects, Skills)"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold hidden sm:inline">Reorder Sections</span>
              <span className="font-bold sm:hidden">Reorder</span>
            </button>
          )}

          {/* Color Palette Quick Picker */}
          {onChangeConfig && (
            <div className="relative" ref={themeMenuRef}>
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 transition-all shadow-2xs cursor-pointer"
                title="Change Color Accent"
              >
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" 
                      style={{ backgroundColor: COLOR_THEMES[config.colorTheme]?.accent || '#2563eb' }} />
                <span className="text-slate-600 hidden lg:inline">{COLOR_THEMES[config.colorTheme]?.name || 'Color'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isThemeMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Accent Palette
                  </div>
                  {Object.values(COLOR_THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        config.colorTheme === theme.id ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: theme.accent }} />
                        <span>{theme.name}</span>
                      </div>
                      {config.colorTheme === theme.id && <Check className="w-3.5 h-3.5 text-slate-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-slate-700">
            <button 
              onClick={handleZoomOut} 
              className="p-1.5 hover:bg-white rounded text-slate-600 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleResetZoom}
              className="px-2 text-xs font-medium hover:bg-white rounded transition-colors"
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button 
              onClick={handleZoomIn} 
              className="p-1.5 hover:bg-white rounded text-slate-600 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenPdfATS && (
            <button
              onClick={onOpenPdfATS}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-2xs cursor-pointer"
              title="Upload your CV PDF to calculate ATS score"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Upload PDF &amp; ATS Score</span>
            </button>
          )}

          <button
            onClick={onOpenJobMatcher}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>ATS Matcher</span>
          </button>

          <button
            onClick={onOpenCoverLetter}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all shadow-2xs cursor-pointer"
          >
            <span>Cover Letter</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Export as PDF or Print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
        <div 
          className="transition-transform duration-150 origin-top flex justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <div 
            id="printable-resume" 
            className="resume-sheet rounded-sm transition-all bg-white shadow-xl"
          >
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Section Order Modal (Drag & Drop) */}
      {onChangeResumeData && (
        <SectionOrderModal
          isOpen={isSectionOrderOpen}
          onClose={() => setIsSectionOrderOpen(false)}
          data={data}
          onChangeOrder={(newOrder) => {
            onChangeResumeData({ ...data, sectionOrder: newOrder });
          }}
        />
      )}
    </div>
  );
};

import React from 'react';
import { ResumeData, ResumeDesignConfig } from '../../types/resume';
import { COLOR_THEMES, FONT_CONFIG } from '../../utils/themeConfig';
import { DEFAULT_SECTION_ORDER, normalizeSectionId } from '../editor/SectionOrderManager';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  data: ResumeData;
  config: ResumeDesignConfig;
  onMoveSectionUp?: (sectionId: string) => void;
  onMoveSectionDown?: (sectionId: string) => void;
}

const isValidEmail = (e?: string) => !!e && !/not provided|none|n\/a|example\.com/i.test(e) && e.includes('@');
const isValidPhone = (p?: string) => !!p && !/not provided|none|n\/a/i.test(p) && p.replace(/\D/g, '').length >= 7;
const isValidLocation = (l?: string) => !!l && !/^(android|ios|windows|mobile|iphone|none|not provided|n\/a)$/i.test(l.trim()) && !/not provided|n\/a/i.test(l);

export const CreativeAccentTemplate: React.FC<Props> = ({ 
  data, 
  config,
  onMoveSectionUp,
  onMoveSectionDown,
}) => {
  const theme = COLOR_THEMES[config.colorTheme] || COLOR_THEMES.indigo;
  const font = FONT_CONFIG[config.font] || FONT_CONFIG.inter;

  const email = isValidEmail(data.personalInfo.email) ? data.personalInfo.email : '';
  const phone = isValidPhone(data.personalInfo.phone) ? data.personalInfo.phone : '';
  const location = isValidLocation(data.personalInfo.location) ? data.personalInfo.location : '';

  const spacingClass =
    config.spacing === 'compact' ? 'space-y-4 text-xs' :
    config.spacing === 'spacious' ? 'space-y-6 text-sm' :
    'space-y-5 text-xs';

  // Section Header with quick reorder hover controls
  const renderSectionHeader = (title: string, sectionId: string) => (
    <div className="flex items-center justify-between mb-2.5">
      <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.primary }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }}></span>
        {title}
      </h2>
      {(onMoveSectionUp || onMoveSectionDown) && (
        <div className="no-print opacity-0 group-hover/sec:opacity-100 transition-opacity flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
          {onMoveSectionUp && (
            <button
              type="button"
              onClick={() => onMoveSectionUp(sectionId)}
              className="p-0.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
              title={`Move ${title} Up`}
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}
          {onMoveSectionDown && (
            <button
              type="button"
              onClick={() => onMoveSectionDown(sectionId)}
              className="p-0.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
              title={`Move ${title} Down`}
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Section Renderers
  const renderSummary = () => {
    if (!data.summary) return null;
    return (
      <section key="summary" className="resume-section group/sec relative bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.primary }}>
          About Me
        </h2>
        <p className="text-slate-700 leading-relaxed font-normal">
          {data.summary}
        </p>
      </section>
    );
  };

  const renderExperiences = () => {
    if (!data.experiences || data.experiences.length === 0) return null;
    return (
      <section key="experiences" className="resume-section group/sec relative">
        {renderSectionHeader('Experience', 'experiences')}
        <div className="space-y-4">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="font-semibold text-xs ml-1" style={{ color: theme.secondary }}>@ {exp.company}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1.5 list-disc list-outside ml-4 text-slate-700 space-y-1">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!data.skillCategories || data.skillCategories.length === 0) return null;
    return (
      <section key="skills" className="resume-section group/sec relative">
        {renderSectionHeader('Skills & Mastery', 'skills')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {data.skillCategories.map((c) => (
            <div key={c.id} className="p-2.5 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 text-xs mb-1.5">{c.category}</div>
              <div className="flex flex-wrap gap-1">
                {c.items.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ backgroundColor: theme.lightBg, color: theme.textColor }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <section key="projects" className="resume-section group/sec relative">
        {renderSectionHeader('Projects & Creations', 'projects')}
        <div className="space-y-3">
          {data.projects.map((proj) => (
            <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 font-medium hover:underline" style={{ color: theme.accent }}>
                    <span>Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-slate-600 text-xs mt-1">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5 text-[10px] text-slate-500">
                  <span className="font-medium">Tech:</span>
                  {proj.technologies.join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducations = () => {
    if (!data.educations || data.educations.length === 0) return null;
    return (
      <section key="educations" className="resume-section group/sec relative">
        {renderSectionHeader('Education', 'educations')}
        <div className="space-y-2">
          {data.educations.map((edu) => (
            <div key={edu.id}>
              <div className="font-bold text-slate-900 text-xs">{edu.degree}</div>
              <div className="text-slate-600 text-xs">{edu.school} — {edu.field}</div>
              <div className="text-[11px] text-slate-500">{edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    return (
      <section key="certifications" className="resume-section group/sec relative">
        {renderSectionHeader('Certifications', 'certifications')}
        <div className="space-y-1.5">
          {data.certifications.map((c) => (
            <div key={c.id} className="text-xs">
              <div className="font-semibold text-slate-900">{c.name}</div>
              <div className="text-slate-500 text-[11px]">{c.issuer} ({c.issueDate})</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderLanguages = () => {
    if (!data.languages || data.languages.length === 0) return null;
    return (
      <section key="languages" className="resume-section group/sec relative">
        {renderSectionHeader('Languages', 'languages')}
        <div className="flex flex-wrap gap-2 text-xs">
          {data.languages.map((l) => (
            <span key={l.id} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {l.language} ({l.proficiency})
            </span>
          ))}
        </div>
      </section>
    );
  };

  // Determine section order dynamically from data
  const rawOrder = (data.sectionOrder && data.sectionOrder.length > 0)
    ? data.sectionOrder.map(normalizeSectionId)
    : DEFAULT_SECTION_ORDER;

  const effectiveOrder = Array.from(new Set([...rawOrder, ...DEFAULT_SECTION_ORDER]));

  const renderSectionById = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return renderSummary();
      case 'experiences':
        return renderExperiences();
      case 'educations':
        return renderEducations();
      case 'projects':
        return renderProjects();
      case 'skills':
        return renderSkills();
      case 'certifications':
        return renderCertifications();
      case 'languages':
        return renderLanguages();
      default:
        return null;
    }
  };

  return (
    <div className={`p-8 md:p-10 text-slate-800 ${font.className} leading-relaxed bg-white`}>
      {/* Creative Header Banner */}
      <header className="relative p-6 rounded-2xl mb-6 overflow-hidden border border-slate-150"
              style={{ backgroundColor: theme.lightBg }}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: theme.primary }}>
              {data.personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-base font-semibold mt-1" style={{ color: theme.accent }}>
              {data.personalInfo.jobTitle || 'Creative Role'}
            </p>
          </div>

          {config.showPhoto && data.personalInfo.photoUrl && (
            <img 
              src={data.personalInfo.photoUrl} 
              alt={data.personalInfo.fullName} 
              className={`w-20 h-20 object-cover border-2 shadow-sm ${config.photoShape === 'circle' ? 'rounded-full' : 'rounded-2xl'}`}
              style={{ borderColor: theme.accent }}
            />
          )}
        </div>

        {/* Contacts */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-700 mt-4 pt-3 border-t border-slate-200/60">
          {email && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md shadow-2xs">
              <Mail className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              {email}
            </span>
          )}
          {phone && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md shadow-2xs">
              <Phone className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              {phone}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md shadow-2xs">
              <MapPin className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              {location}
            </span>
          )}
          {data.personalInfo.website && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md shadow-2xs">
              <Globe className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              {data.personalInfo.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {data.personalInfo.linkedin && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md shadow-2xs">
              <Linkedin className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              LinkedIn
            </span>
          )}
          {data.personalInfo.github && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md shadow-2xs">
              <Github className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              GitHub
            </span>
          )}
        </div>
      </header>

      {/* Dynamic Sections */}
      <div className={spacingClass}>
        {effectiveOrder.map((sectionId) => (
          <React.Fragment key={sectionId}>
            {renderSectionById(sectionId)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

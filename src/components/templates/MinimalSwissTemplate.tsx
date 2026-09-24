import React from 'react';
import { ResumeData, ResumeDesignConfig } from '../../types/resume';
import { COLOR_THEMES, FONT_CONFIG } from '../../utils/themeConfig';
import { DEFAULT_SECTION_ORDER, normalizeSectionId } from '../editor/SectionOrderManager';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  data: ResumeData;
  config: ResumeDesignConfig;
  onMoveSectionUp?: (sectionId: string) => void;
  onMoveSectionDown?: (sectionId: string) => void;
}

const isValidEmail = (e?: string) => !!e && !/not provided|none|n\/a|example\.com/i.test(e) && e.includes('@');
const isValidPhone = (p?: string) => !!p && !/not provided|none|n\/a/i.test(p) && p.replace(/\D/g, '').length >= 7;
const isValidLocation = (l?: string) => !!l && !/^(android|ios|windows|mobile|iphone|none|not provided|n\/a)$/i.test(l.trim()) && !/not provided|n\/a/i.test(l);

export const MinimalSwissTemplate: React.FC<Props> = ({ 
  data, 
  config,
  onMoveSectionUp,
  onMoveSectionDown,
}) => {
  const theme = COLOR_THEMES[config.colorTheme] || COLOR_THEMES.navy;
  const font = FONT_CONFIG[config.font] || FONT_CONFIG.inter;

  const email = isValidEmail(data.personalInfo.email) ? data.personalInfo.email : '';
  const phone = isValidPhone(data.personalInfo.phone) ? data.personalInfo.phone : '';
  const location = isValidLocation(data.personalInfo.location) ? data.personalInfo.location : '';

  const spacingClass = 
    config.spacing === 'compact' ? 'space-y-4 text-xs' :
    config.spacing === 'spacious' ? 'space-y-7 text-sm' :
    'space-y-5.5 text-xs';

  // Section Header with quick reorder hover controls
  const renderSectionHeader = (title: string, sectionId: string) => (
    <div className="flex items-center justify-between pb-1 mb-2.5 border-b-2" style={{ borderColor: theme.primary }}>
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
        {title}
      </h2>
      {(onMoveSectionUp || onMoveSectionDown) && (
        <div className="no-print opacity-0 group-hover/sec:opacity-100 transition-opacity flex items-center gap-1 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-300">
          {onMoveSectionUp && (
            <button
              type="button"
              onClick={() => onMoveSectionUp(sectionId)}
              className="p-0.5 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 rounded cursor-pointer"
              title={`Move ${title} Up`}
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}
          {onMoveSectionDown && (
            <button
              type="button"
              onClick={() => onMoveSectionDown(sectionId)}
              className="p-0.5 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 rounded cursor-pointer"
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
      <section key="summary" className="resume-section group/sec relative">
        {renderSectionHeader('Profile', 'summary')}
        <p className="text-neutral-700 leading-relaxed font-normal">
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
                  <span className="font-bold text-neutral-900 text-sm">{exp.role}</span>
                  <span className="text-neutral-500 font-normal">, {exp.company}</span>
                  {exp.location && isValidLocation(exp.location) && (
                    <span className="text-neutral-400 text-xs"> — {exp.location}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-neutral-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1.5 list-disc list-outside ml-4 text-neutral-700 space-y-1">
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

  const renderEducations = () => {
    if (!data.educations || data.educations.length === 0) return null;
    return (
      <section key="educations" className="resume-section group/sec relative">
        {renderSectionHeader('Education', 'educations')}
        <div className="space-y-2.5">
          {data.educations.map((edu) => (
            <div key={edu.id} className="resume-item flex flex-col sm:flex-row justify-between">
              <div>
                <span className="font-bold text-neutral-900">{edu.degree}</span> in {edu.field}
                <div className="text-neutral-600 text-xs">{edu.school} {edu.location ? `• ${edu.location}` : ''}</div>
                {(edu.gpa || edu.honors) && (
                  <div className="text-[11px] text-neutral-500">{[edu.gpa ? `GPA: ${edu.gpa}` : null, edu.honors].filter(Boolean).join(' • ')}</div>
                )}
              </div>
              <span className="text-xs text-neutral-500 font-medium">{edu.startDate} – {edu.endDate}</span>
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
        {renderSectionHeader('Projects', 'projects')}
        <div className="space-y-2.5">
          {data.projects.map((proj) => (
            <div key={proj.id} className="resume-item">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-neutral-900">{proj.name}</span>
                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs underline text-neutral-600">Link</a>}
              </div>
              <p className="text-neutral-700 text-xs mt-0.5">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-[11px] text-neutral-500 mt-0.5"><span className="font-medium">Tools:</span> {proj.technologies.join(', ')}</p>
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
        {renderSectionHeader('Skills & Expertise', 'skills')}
        <div className="space-y-1.5">
          {data.skillCategories.map((cat) => (
            <div key={cat.id} className="text-xs leading-snug">
              <span className="font-bold text-neutral-900">{cat.category}: </span>
              <span className="text-neutral-700">{cat.items.join(', ')}</span>
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
        <div className="space-y-1 text-xs">
          {data.certifications.map((c) => (
            <div key={c.id}>
              <span className="font-semibold text-neutral-900">{c.name}</span>
              <span className="text-neutral-500 text-[11px] block">{c.issuer} ({c.issueDate})</span>
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
        <p className="text-xs text-neutral-700">
          {data.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
        </p>
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
    <div className={`p-8 md:p-11 text-neutral-900 ${font.className} leading-relaxed bg-white`}>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: theme.primary }}>
          {data.personalInfo.fullName || 'Candidate Name'}
        </h1>
        <p className="text-sm font-semibold tracking-wide text-neutral-600 mt-1 uppercase">
          {data.personalInfo.jobTitle || 'Professional Role'}
        </p>

        {/* Contacts */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-2.5 pt-2 border-t border-neutral-300">
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
          {data.personalInfo.website && (
            <span>• <a href={data.personalInfo.website} target="_blank" rel="noreferrer" className="underline">{data.personalInfo.website.replace(/^https?:\/\//, '')}</a></span>
          )}
          {data.personalInfo.linkedin && (
            <span>• <a href={`https://${data.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="underline">LinkedIn</a></span>
          )}
          {data.personalInfo.github && (
            <span>• <a href={`https://${data.personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="underline">GitHub</a></span>
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

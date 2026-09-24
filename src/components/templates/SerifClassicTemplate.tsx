import React from 'react';
import { ResumeData, ResumeDesignConfig } from '../../types/resume';
import { COLOR_THEMES } from '../../utils/themeConfig';
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

export const SerifClassicTemplate: React.FC<Props> = ({ 
  data, 
  config,
  onMoveSectionUp,
  onMoveSectionDown,
}) => {
  const theme = COLOR_THEMES[config.colorTheme] || COLOR_THEMES.slate;

  const email = isValidEmail(data.personalInfo.email) ? data.personalInfo.email : '';
  const phone = isValidPhone(data.personalInfo.phone) ? data.personalInfo.phone : '';
  const location = isValidLocation(data.personalInfo.location) ? data.personalInfo.location : '';

  const itemSpacingClass =
    config.spacing === 'compact' ? 'space-y-1' :
    config.spacing === 'spacious' ? 'space-y-2' :
    'space-y-1.5';

  const spacingClass =
    config.spacing === 'compact' ? 'space-y-4 text-xs' :
    config.spacing === 'spacious' ? 'space-y-6 text-sm' :
    'space-y-5 text-xs';

  // Section Header with quick reorder hover controls
  const renderSectionHeader = (title: string, sectionId: string) => (
    <div className="flex items-center justify-between pb-1 mb-2 border-b border-stone-300">
      <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-sans">
        {title}
      </h2>
      {(onMoveSectionUp || onMoveSectionDown) && (
        <div className="no-print opacity-0 group-hover/sec:opacity-100 transition-opacity flex items-center gap-1 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-300">
          {onMoveSectionUp && (
            <button
              type="button"
              onClick={() => onMoveSectionUp(sectionId)}
              className="p-0.5 hover:bg-stone-200 text-stone-600 hover:text-stone-950 rounded cursor-pointer"
              title={`Move ${title} Up`}
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}
          {onMoveSectionDown && (
            <button
              type="button"
              onClick={() => onMoveSectionDown(sectionId)}
              className="p-0.5 hover:bg-stone-200 text-stone-600 hover:text-stone-950 rounded cursor-pointer"
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
        {renderSectionHeader('Summary', 'summary')}
        <p className="text-stone-800 leading-relaxed italic">
          {data.summary}
        </p>
      </section>
    );
  };

  const renderExperiences = () => {
    if (!data.experiences || data.experiences.length === 0) return null;
    return (
      <section key="experiences" className="resume-section group/sec relative">
        {renderSectionHeader('Professional Experience', 'experiences')}
        <div className="space-y-4">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-stone-950 text-sm">{exp.role}</span>
                <span className="font-sans text-xs text-stone-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-stone-700 italic text-xs mb-1">
                {exp.company}{exp.location && isValidLocation(exp.location) ? `, ${exp.location}` : ''}
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className={`list-disc list-outside ml-4 text-stone-800 ${itemSpacingClass}`}>
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
        <div className="space-y-2">
          {data.educations.map((edu) => (
            <div key={edu.id} className="resume-item flex justify-between items-baseline">
              <div>
                <span className="font-bold text-stone-900">{edu.school}</span>
                <div className="italic text-stone-700">{edu.degree}, {edu.field}</div>
                {(edu.gpa || edu.honors) && (
                  <div className="font-sans text-[11px] text-stone-500 mt-0.5">{edu.gpa ? `GPA: ${edu.gpa}` : ''} {edu.honors ? `• ${edu.honors}` : ''}</div>
                )}
              </div>
              <span className="font-sans text-xs text-stone-500">{edu.startDate} – {edu.endDate}</span>
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
        {renderSectionHeader('Notable Projects', 'projects')}
        <div className="space-y-3 font-sans">
          {data.projects.map((proj) => (
            <div key={proj.id} className="resume-item">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-stone-900 text-xs">{proj.name}</span>
                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs underline text-stone-600">Link</a>}
              </div>
              <p className="text-stone-700 text-xs mt-0.5 font-serif italic">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-[11px] text-stone-500 mt-0.5"><span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}</p>
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
        {renderSectionHeader('Skills & Qualifications', 'skills')}
        <div className="space-y-1.5 font-sans">
          {data.skillCategories.map((c) => (
            <div key={c.id}>
              <span className="font-bold text-stone-900 text-xs">{c.category}: </span>
              <span className="text-stone-700 text-xs">{c.items.join(', ')}</span>
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
        <div className="space-y-1 text-xs font-sans">
          {data.certifications.map((c) => (
            <div key={c.id}>
              <span className="font-semibold text-stone-900">{c.name}</span>
              <span className="text-stone-500 text-[11px] block">{c.issuer} ({c.issueDate})</span>
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
        <div className="text-xs text-stone-700 font-sans">
          {data.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
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
    <div className="p-8 md:p-12 text-stone-900 font-merriweather leading-relaxed bg-white">
      {/* Centered Academic / Classic Header */}
      <header className="text-center pb-5 mb-5 border-b border-stone-300">
        <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-stone-950">
          {data.personalInfo.fullName || 'Candidate Name'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-stone-600 mt-1.5 font-sans font-medium">
          {data.personalInfo.jobTitle || 'Professional Title'}
        </p>

        {/* Contacts */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-stone-600 font-sans mt-3">
          {location && <span>{location}</span>}
          {phone && <span>• {phone}</span>}
          {email && (
            <span>• <a href={`mailto:${email}`} className="hover:underline">{email}</a></span>
          )}
          {data.personalInfo.linkedin && (
            <span>• <a href={`https://${data.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a></span>
          )}
          {data.personalInfo.website && (
            <span>• <a href={data.personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">{data.personalInfo.website.replace(/^https?:\/\//, '')}</a></span>
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

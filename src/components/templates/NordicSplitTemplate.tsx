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

export const NordicSplitTemplate: React.FC<Props> = ({ 
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

  const itemSpacingClass =
    config.spacing === 'compact' ? 'space-y-1' :
    config.spacing === 'spacious' ? 'space-y-2' :
    'space-y-1.5';

  // Section Header with quick reorder hover controls
  const renderSectionHeader = (title: string, sectionId: string) => (
    <div className="flex items-center justify-between mb-2.5 pb-1 border-b" style={{ borderColor: theme.subtleBorder }}>
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
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

  // Main column section renderers
  const renderSummary = () => {
    if (!data.summary) return null;
    return (
      <section key="summary" className="resume-section group/sec relative">
        {renderSectionHeader('Professional Profile', 'summary')}
        <p className="text-slate-700 text-xs leading-relaxed font-normal">
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
                  <span className="text-slate-500 text-xs"> — {exp.company}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className={`mt-1.5 list-disc list-outside ml-4 text-slate-700 text-xs ${itemSpacingClass}`}>
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
            <div key={edu.id} className="text-xs">
              <div className="font-bold text-slate-900">{edu.degree}</div>
              <div className="text-slate-600">{edu.school} — {edu.field}</div>
              <div className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
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
        {renderSectionHeader('Key Projects', 'projects')}
        <div className="space-y-2.5">
          {data.projects.map((proj) => (
            <div key={proj.id} className="resume-item">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] underline" style={{ color: theme.accent }}>
                    <span>Project Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>
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
            <div key={c.id} className="flex justify-between">
              <span className="font-semibold text-slate-900">{c.name}</span>
              <span className="text-slate-500">{c.issuer} ({c.issueDate})</span>
            </div>
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

  const renderMainSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return renderSummary();
      case 'experiences':
        return renderExperiences();
      case 'educations':
        return renderEducations();
      case 'projects':
        return renderProjects();
      case 'certifications':
        return renderCertifications();
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-[297mm] flex flex-col md:flex-row text-slate-800 ${font.className} leading-relaxed bg-white`}>
      {/* Left Sidebar */}
      <aside className="w-full md:w-[32%] p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200"
             style={{ backgroundColor: theme.lightBg }}>
        {/* Photo */}
        {config.showPhoto && data.personalInfo.photoUrl && (
          <div className="mb-6 flex justify-center md:justify-start">
            <img 
              src={data.personalInfo.photoUrl} 
              alt={data.personalInfo.fullName} 
              className={`w-28 h-28 object-cover border-2 shadow-sm ${config.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}
              style={{ borderColor: theme.accent }}
            />
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1" style={{ borderColor: theme.subtleBorder }}>
            Contact
          </h3>
          <div className="space-y-2 text-xs text-slate-700">
            {email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span className="truncate">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span>{phone}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span>{location}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span className="truncate">{data.personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span className="truncate">{data.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accent }} />
                <span className="truncate">{data.personalInfo.github.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills in Sidebar */}
        {data.skillCategories && data.skillCategories.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1" style={{ borderColor: theme.subtleBorder }}>
              Skills &amp; Tools
            </h3>
            <div className="space-y-2">
              {data.skillCategories.map((c) => (
                <div key={c.id} className="text-xs">
                  <div className="font-semibold text-slate-900 mb-0.5">{c.category}</div>
                  <div className="text-slate-600 leading-snug">{c.items.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages in Sidebar */}
        {data.languages && data.languages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1" style={{ borderColor: theme.subtleBorder }}>
              Languages
            </h3>
            <div className="space-y-1 text-xs">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span className="font-medium text-slate-800">{l.language}</span>
                  <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Main Column with Dynamic Section Ordering */}
      <main className="w-full md:w-[68%] p-6 md:p-8 space-y-5">
        {/* Name Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: theme.primary }}>
            {data.personalInfo.fullName || 'Candidate Name'}
          </h1>
          <p className="text-sm font-semibold tracking-wide uppercase mt-1" style={{ color: theme.accent }}>
            {data.personalInfo.jobTitle || 'Target Role'}
          </p>
        </div>

        {/* Dynamic Sections in Main Area */}
        {effectiveOrder.map((sectionId) => (
          <React.Fragment key={sectionId}>
            {renderMainSection(sectionId)}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
};

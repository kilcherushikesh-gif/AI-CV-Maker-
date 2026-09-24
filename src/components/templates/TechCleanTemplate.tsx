import React from 'react';
import { ResumeData, ResumeDesignConfig } from '../../types/resume';
import { COLOR_THEMES, FONT_CONFIG } from '../../utils/themeConfig';
import { DEFAULT_SECTION_ORDER, normalizeSectionId } from '../editor/SectionOrderManager';
import { 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FolderGit2, 
  Wrench,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Props {
  data: ResumeData;
  config: ResumeDesignConfig;
  onMoveSectionUp?: (sectionId: string) => void;
  onMoveSectionDown?: (sectionId: string) => void;
}

const isValidEmail = (e?: string) => !!e && !/not provided|none|n\/a|example\.com/i.test(e) && e.includes('@');
const isValidPhone = (p?: string) => !!p && !/not provided|none|n\/a/i.test(p) && p.replace(/\D/g, '').length >= 7;
const isValidLocation = (l?: string) => !!l && !/^(android|ios|windows|mobile|iphone|none|not provided|n\/a)$/i.test(l.trim()) && !/not provided|n\/a/i.test(l);

export const TechCleanTemplate: React.FC<Props> = ({ 
  data, 
  config,
  onMoveSectionUp,
  onMoveSectionDown,
}) => {
  const theme = COLOR_THEMES[config.colorTheme] || COLOR_THEMES.slate;
  const font = FONT_CONFIG[config.font] || FONT_CONFIG.jakarta;

  const spacingClass = 
    config.spacing === 'compact' ? 'space-y-4 text-xs' :
    config.spacing === 'spacious' ? 'space-y-6 text-sm' :
    'space-y-5 text-xs';

  const email = isValidEmail(data.personalInfo.email) ? data.personalInfo.email : '';
  const phone = isValidPhone(data.personalInfo.phone) ? data.personalInfo.phone : '';
  const location = isValidLocation(data.personalInfo.location) ? data.personalInfo.location : '';

  // Section Header with quick reorder hover controls
  const renderSectionHeader = (title: string, sectionId: string, iconNode: React.ReactNode) => (
    <div className="flex items-center justify-between pb-1 mb-2 border-b" style={{ borderColor: theme.subtleBorder }}>
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2" style={{ color: theme.primary }}>
        {iconNode}
        {title}
      </h2>
      {(onMoveSectionUp || onMoveSectionDown) && (
        <div className="no-print opacity-0 group-hover/sec:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
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
      <section key="summary" className="resume-section group/sec relative">
        {renderSectionHeader('Executive Summary', 'summary', <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />)}
        <p className="text-slate-700 leading-relaxed font-normal">
          {data.summary}
        </p>
      </section>
    );
  };

  const renderSkills = () => {
    if (!data.skillCategories || data.skillCategories.length === 0) return null;
    return (
      <section key="skills" className="resume-section group/sec relative">
        {renderSectionHeader('Skills & Competencies', 'skills', <Wrench className="w-3.5 h-3.5" style={{ color: theme.accent }} />)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {data.skillCategories.map((cat) => (
            <div key={cat.id} className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-800 mb-1.5">{cat.category}</div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {cat.items.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
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

  const renderExperiences = () => {
    if (!data.experiences || data.experiences.length === 0) return null;
    return (
      <section key="experiences" className="resume-section group/sec relative">
        {renderSectionHeader('Work History & Experience', 'experiences', <Briefcase className="w-3.5 h-3.5" style={{ color: theme.accent }} />)}
        <div className="space-y-4">
          {data.experiences.map((exp) => {
            const expLoc = isValidLocation(exp.location) ? exp.location : '';
            return (
              <div key={exp.id} className="resume-item border-l-2 pl-3.5 space-y-1" style={{ borderColor: theme.accent }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    <span className="text-slate-700 font-semibold"> • {exp.company}</span>
                    {expLoc && <span className="text-slate-500 text-xs ml-1.5 font-normal">({expLoc})</span>}
                  </div>
                  <span className="text-xs text-slate-500 font-medium shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1.5 list-disc list-outside ml-4 text-slate-700 space-y-1 text-xs">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <section key="projects" className="resume-section group/sec relative">
        {renderSectionHeader('Featured Projects & Initiatives', 'projects', <FolderGit2 className="w-3.5 h-3.5" style={{ color: theme.accent }} />)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.projects.map((proj) => (
            <div key={proj.id} className="resume-item p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline" style={{ color: theme.accent }}>
                    <span>View Project</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1 text-[10px] text-slate-600 font-medium">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {t}
                    </span>
                  ))}
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
        {renderSectionHeader('Education', 'educations', <GraduationCap className="w-3.5 h-3.5" style={{ color: theme.accent }} />)}
        <div className="space-y-2">
          {data.educations.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="font-bold text-slate-900 text-xs">{edu.degree}</div>
              <div className="text-slate-700 text-xs">{edu.school}{edu.field ? ` — ${edu.field}` : ''}</div>
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
        {renderSectionHeader('Certifications', 'certifications', <Award className="w-3.5 h-3.5" style={{ color: theme.accent }} />)}
        <div className="space-y-2">
          {data.certifications.map((c) => (
            <div key={c.id} className="space-y-0.5">
              <div className="font-bold text-slate-900 text-xs">{c.name}</div>
              <div className="text-slate-600 text-[11px]">{c.issuer} {c.issueDate ? `(${c.issueDate})` : ''}</div>
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
        {renderSectionHeader('Languages', 'languages', <Globe className="w-3.5 h-3.5" style={{ color: theme.accent }} />)}
        <div className="flex flex-wrap gap-2 text-xs">
          {data.languages.map((lang) => (
            <span key={lang.id} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs">
              <span className="font-bold">{lang.language}</span>: {lang.proficiency}
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
      {/* Modern Professional Header */}
      <header className="border-b pb-5 mb-5" style={{ borderColor: theme.subtleBorder }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ color: theme.primary }}>
              {data.personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider mt-1 text-slate-600" style={{ color: theme.accent }}>
              {data.personalInfo.jobTitle || 'Professional Role'}
            </p>
          </div>

          {config.showPhoto && data.personalInfo.photoUrl && (
            <img 
              src={data.personalInfo.photoUrl} 
              alt={data.personalInfo.fullName} 
              className={`w-20 h-20 object-cover border-2 shadow-xs ${config.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
              style={{ borderColor: theme.accent }}
            />
          )}
        </div>

        {/* Contacts Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
          {email && (
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:underline">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{email}</span>
            </a>
          )}
          {phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{phone}</span>
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{location}</span>
            </span>
          )}
          {data.personalInfo.github && (
            <a href={`https://${data.personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:underline text-slate-700">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span>{data.personalInfo.github.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {data.personalInfo.linkedin && (
            <a href={`https://${data.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:underline text-slate-700">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              <span>LinkedIn</span>
            </a>
          )}
          {data.personalInfo.website && (
            <a href={data.personalInfo.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:underline text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Portfolio</span>
            </a>
          )}
        </div>
      </header>

      {/* Main Body with Dynamic Vertical Section Ordering */}
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

import React from 'react';
import { ResumeData, ResumeDesignConfig } from '../../types/resume';
import { COLOR_THEMES, FONT_CONFIG } from '../../utils/themeConfig';
import { DEFAULT_SECTION_ORDER, normalizeSectionId } from '../editor/SectionOrderManager';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Calendar, 
  ExternalLink,
  Award,
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

export const ModernExecutiveTemplate: React.FC<Props> = ({ 
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
    config.spacing === 'compact' ? 'space-y-3.5 text-xs' :
    config.spacing === 'spacious' ? 'space-y-6 text-sm' :
    'space-y-4.5 text-xs';

  const itemSpacingClass =
    config.spacing === 'compact' ? 'space-y-1' :
    config.spacing === 'spacious' ? 'space-y-2' :
    'space-y-1.5';

  const photoBorderRadius = 
    config.photoShape === 'circle' ? 'rounded-full' :
    config.photoShape === 'rounded' ? 'rounded-xl' :
    'rounded-none';

  // Section Header with quick reorder hover controls
  const renderSectionHeader = (title: string, sectionId: string) => (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.primary }}>
        <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: theme.accent }}></span>
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
        {renderSectionHeader('Executive Summary', 'summary')}
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
        {renderSectionHeader('Professional Experience', 'experiences')}
        <div className="space-y-4">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="text-slate-400 mx-1.5">|</span>
                  <span className="font-semibold" style={{ color: theme.secondary }}>{exp.company}</span>
                  {exp.location && isValidLocation(exp.location) && (
                    <span className="text-slate-500 text-xs ml-1.5">({exp.location})</span>
                  )}
                </div>
                <div className="text-xs font-medium text-slate-500 shrink-0 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
              </div>
              {exp.description && (
                <p className="text-slate-600 text-xs mt-1 italic">{exp.description}</p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className={`mt-2 list-disc list-outside ml-4 text-slate-700 ${itemSpacingClass}`}>
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="pl-0.5 leading-snug">
                      {bullet}
                    </li>
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
        {renderSectionHeader('Education & Academic Credentials', 'educations')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {data.educations.map((edu) => (
            <div key={edu.id} className="resume-item p-2.5 rounded-lg bg-slate-50/60 border border-slate-150">
              <div className="font-bold text-slate-900 text-xs">{edu.degree}</div>
              <div className="text-slate-700 text-xs font-semibold" style={{ color: theme.secondary }}>{edu.school}</div>
              <div className="flex justify-between text-xs text-slate-500 mt-0.5">
                <span>{edu.field}</span>
                <span>{edu.startDate} – {edu.endDate}</span>
              </div>
              {(edu.gpa || edu.honors) && (
                <div className="text-[11px] text-slate-600 mt-1 font-medium">
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  {edu.gpa && edu.honors && <span> • </span>}
                  {edu.honors && <span>{edu.honors}</span>}
                </div>
              )}
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
        {renderSectionHeader('Key Projects & Portfolio', 'projects')}
        <div className="space-y-3">
          {data.projects.map((proj) => (
            <div key={proj.id} className="resume-item border-l-2 pl-3 py-0.5" style={{ borderColor: theme.accent }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                  {proj.role && <span className="text-slate-500 text-xs">({proj.role})</span>}
                </div>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 font-medium hover:underline" style={{ color: theme.accent }}>
                    <span>View Project</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-500">
                  <span className="font-medium">Tech:</span>
                  {proj.technologies.join(' • ')}
                </div>
              )}
              {proj.bullets && proj.bullets.length > 0 && (
                <ul className="mt-1 list-disc list-outside ml-3.5 text-slate-700 text-xs space-y-0.5">
                  {proj.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
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
        {renderSectionHeader('Core Competencies & Skills', 'skills')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {data.skillCategories.map((cat) => (
            <div key={cat.id} className="bg-slate-50/70 p-2.5 rounded-md border border-slate-100">
              <span className="font-semibold text-xs text-slate-800 block mb-1.5" style={{ color: theme.secondary }}>
                {cat.category}:
              </span>
              <div className="flex flex-wrap gap-1">
                {cat.items.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 rounded text-[11px] font-medium border"
                    style={{ 
                      backgroundColor: theme.lightBg, 
                      color: theme.textColor, 
                      borderColor: theme.subtleBorder 
                    }}
                  >
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

  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    return (
      <section key="certifications" className="resume-section group/sec relative">
        {renderSectionHeader('Certifications & Licenses', 'certifications')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {data.certifications.map((cert) => (
            <div key={cert.id} className="p-2 rounded-lg bg-slate-50/60 border border-slate-150 flex items-start gap-2">
              <Award className="w-3.5 h-3.5 mt-0.5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900 text-xs block">{cert.name}</span>
                <span className="text-slate-500 text-[11px]">{cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ''}</span>
              </div>
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
          {data.languages.map((lang) => (
            <span key={lang.id} className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
              <span className="font-semibold">{lang.language}</span>
              <span className="text-slate-500 text-[10px]">({lang.proficiency})</span>
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
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 mb-5 border-b border-slate-200">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: theme.primary }}>
            {data.personalInfo.fullName || 'Candidate Name'}
          </h1>
          <p className="text-base font-semibold mt-1 tracking-wide uppercase" style={{ color: theme.accent }}>
            {data.personalInfo.jobTitle || 'Target Role / Professional Title'}
          </p>
          
          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
            {email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              </span>
            )}
            {phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span>{phone}</span>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span>{location}</span>
              </span>
            )}
            {data.personalInfo.website && (
              <span className="inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <a href={data.personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                  {data.personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
            {data.personalInfo.linkedin && (
              <span className="inline-flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <a href={`https://${data.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
            {data.personalInfo.github && (
              <span className="inline-flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <a href={`https://${data.personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {data.personalInfo.github.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Profile Photo if enabled */}
        {config.showPhoto && data.personalInfo.photoUrl && (
          <div className="shrink-0">
            <img 
              src={data.personalInfo.photoUrl} 
              alt={data.personalInfo.fullName} 
              className={`w-24 h-24 object-cover border-2 shadow-sm ${photoBorderRadius}`}
              style={{ borderColor: theme.accent }}
            />
          </div>
        )}
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

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  link?: string;
  technologies: string[];
  description: string;
  bullets?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  link?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
  sectionOrder: string[];
}

export type TemplateId = 
  | 'modern-executive'
  | 'minimal-swiss'
  | 'tech-clean'
  | 'nordic-split'
  | 'serif-classic'
  | 'creative-accent';

export type FontId = 'inter' | 'merriweather' | 'jakarta';

export type ColorThemeId = 
  | 'navy'
  | 'emerald'
  | 'indigo'
  | 'slate'
  | 'burgundy'
  | 'teal';

export interface ResumeDesignConfig {
  template: TemplateId;
  font: FontId;
  colorTheme: ColorThemeId;
  spacing: 'compact' | 'standard' | 'spacious';
  showPhoto: boolean;
  photoShape: 'circle' | 'rounded' | 'square';
  showBorders: boolean;
  accentColorHex?: string;
}

export interface ATSAnalysisResult {
  score: number;
  matchGrade: 'Poor' | 'Moderate' | 'Good' | 'Exceptional';
  matchingKeywords: string[];
  missingKeywords: string[];
  keyStrengths: string[];
  improvements: string[];
  recommendedSummary: string;
}

export interface BulletImprovement {
  text: string;
  category: 'metric-driven' | 'action-oriented' | 'concise-ats';
  explanation: string;
}

export interface WrongKeywordItem {
  keyword: string;
  category: 'Cliche Buzzword' | 'Role Mismatch' | 'Outdated Technology' | 'Passive Phrasing' | 'Low Impact';
  reason: string;
  recommendation: string;
}

export interface PdfATSReport {
  atsScore: number;
  matchGrade: 'Critical Issues' | 'Moderate' | 'Good' | 'Exceptional';
  detectedCandidate: {
    fullName: string;
    email: string;
    phone: string;
    targetRole: string;
    yearsOfExperience: string;
    location: string;
  };
  categoryScores: {
    formattingScore: number;
    formattingFeedback: string;
    quantificationScore: number;
    quantificationFeedback: string;
    keywordScore: number;
    keywordFeedback: string;
    completenessScore: number;
    completenessFeedback: string;
  };
  detectedKeywords: string[];
  missingKeywords: string[];
  wrongKeywords?: WrongKeywordItem[];
  strengths: string[];
  criticalIssues: string[];
  actionPlan: string[];
  parsedResume?: Partial<ResumeData>;
}


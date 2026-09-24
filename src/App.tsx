import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { ResumeData, ResumeDesignConfig } from './types/resume';
import { SAMPLE_TECH_LEAD, INITIAL_EMPTY_RESUME } from './data/sampleProfiles';
import { PersonalInfoForm } from './components/editor/PersonalInfoForm';
import { SummaryForm } from './components/editor/SummaryForm';
import { ExperienceForm } from './components/editor/ExperienceForm';
import { SkillsForm } from './components/editor/SkillsForm';
import { EducationForm } from './components/editor/EducationForm';
import { ProjectsForm } from './components/editor/ProjectsForm';
import { CertificationsForm } from './components/editor/CertificationsForm';
import { LanguagesForm } from './components/editor/LanguagesForm';
import { DesignSettingsPanel } from './components/editor/DesignSettingsPanel';
import { ResumePreview } from './components/templates/ResumePreview';

// AI Modals
import { AIGeneratorModal } from './components/ai/AIGeneratorModal';
import { AIBulletEnhancerModal } from './components/ai/AIBulletEnhancerModal';
import { AISummaryModal } from './components/ai/AISummaryModal';
import { AIJobMatcherModal } from './components/ai/AIJobMatcherModal';
import { AICoverLetterModal } from './components/ai/AICoverLetterModal';
import { AIPdfATSModal } from './components/ai/AIPdfATSModal';
import { ExportModal } from './components/modals/ExportModal';
import { ResetModal } from './components/modals/ResetModal';
import { HowItWorksModal } from './components/modals/HowItWorksModal';
import { SectionOrderManager } from './components/editor/SectionOrderManager';

import {
  Sparkles,
  FileText,
  Palette,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Globe,
  Download,
  Printer,
  Wand2,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  UploadCloud,
  Layers,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  // Load initial resume from localStorage or fallback to sample
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      // Clear all legacy storage keys with previous info
      localStorage.removeItem('resumai_data');
      localStorage.removeItem('resumai_data_v2');
      localStorage.removeItem('resumai_data_v3');

      const saved = localStorage.getItem('resumai_data_rishi_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.personalInfo?.fullName === 'Rishi') {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_TECH_LEAD;
  });

  const [designConfig, setDesignConfig] = useState<ResumeDesignConfig>(() => {
    try {
      const saved = localStorage.getItem('resumai_design');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      template: 'modern-executive',
      font: 'inter',
      colorTheme: 'navy',
      spacing: 'standard',
      showPhoto: true,
      photoShape: 'circle',
      showBorders: true,
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resumai_data_rishi_v1', JSON.stringify(resumeData));
    } catch (e) {
      console.error(e);
    }
  }, [resumeData]);

  useEffect(() => {
    try {
      localStorage.setItem('resumai_design', JSON.stringify(designConfig));
    } catch (e) {
      console.error(e);
    }
  }, [designConfig]);

  // Main UI states
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [activeSection, setActiveSection] = useState<
    'personal' | 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' | 'languages' | 'reorder'
  >('personal');

  // Mobile View Switcher: 'editor' | 'preview'
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Modals state
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isPdfATSOpen, setIsPdfATSOpen] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const [isAIJobMatcherOpen, setIsAIJobMatcherOpen] = useState(false);
  const [isAICoverLetterOpen, setIsAICoverLetterOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResetResume = (newData: ResumeData, resetDesign: boolean = true) => {
    setResumeData(newData);
    try {
      localStorage.setItem('resumai_data_rishi_v1', JSON.stringify(newData));
      localStorage.removeItem('resumai_data');
      localStorage.removeItem('resumai_data_v2');
      localStorage.removeItem('resumai_data_v3');
    } catch (e) {
      console.error(e);
    }
    if (resetDesign) {
      const defaultDesign: ResumeDesignConfig = {
        template: 'modern-executive',
        font: 'inter',
        colorTheme: 'navy',
        spacing: 'standard',
        showPhoto: true,
        photoShape: 'circle',
        showBorders: true,
      };
      setDesignConfig(defaultDesign);
      try {
        localStorage.setItem('resumai_design', JSON.stringify(defaultDesign));
      } catch (e) {
        console.error(e);
      }
    }
    setActiveSection('personal');
    setActiveTab('content');
    setToastMessage('✨ App & resume data have been reset! / ऐप रीसेट कर दिया गया है!');
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Bullet Enhancer state
  const [bulletModalState, setBulletModalState] = useState<{
    isOpen: boolean;
    bullet: string;
    role: string;
    company: string;
    expIdx: number;
    bulletIdx: number;
  }>({
    isOpen: false,
    bullet: '',
    role: '',
    company: '',
    expIdx: -1,
    bulletIdx: -1,
  });

  const handleOpenPolishBullet = (
    bullet: string,
    role: string,
    company: string,
    expIdx: number,
    bulletIdx: number
  ) => {
    setBulletModalState({
      isOpen: true,
      bullet,
      role,
      company,
      expIdx,
      bulletIdx,
    });
  };

  const handleApplyPolishedBullet = (newBullet: string) => {
    if (bulletModalState.expIdx >= 0 && bulletModalState.bulletIdx >= 0) {
      const updatedExperiences = [...resumeData.experiences];
      if (updatedExperiences[bulletModalState.expIdx]) {
        updatedExperiences[bulletModalState.expIdx].bullets[bulletModalState.bulletIdx] = newBullet;
        setResumeData({ ...resumeData, experiences: updatedExperiences });
      }
    }
  };

  const handleApplyAISummary = (newSummary: string) => {
    setResumeData((prev) => ({ ...prev, summary: newSummary }));
  };

  const handleAddSkillsFromATS = (newSkills: string[]) => {
    if (newSkills.length === 0) return;
    const cats = [...resumeData.skillCategories];
    if (cats.length === 0) {
      cats.push({ id: `cat-${Date.now()}`, category: 'Key Competencies', items: [] });
    }
    newSkills.forEach((skill) => {
      if (!cats[0].items.includes(skill)) {
        cats[0].items.push(skill);
      }
    });
    setResumeData((prev) => ({ ...prev, skillCategories: cats }));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-inter">
      {/* Top Navbar */}
      <header className="no-print h-14 bg-slate-900 text-white px-4 md:px-6 flex items-center justify-between border-b border-slate-800 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">ResumAI</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none hidden sm:block">AI-Powered ATS Resume &amp; CV Maker</p>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Upload CV PDF & Get ATS Score */}
          <button
            onClick={() => setIsPdfATSOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md active:scale-95 cursor-pointer border border-emerald-400/30"
            title="Upload CV PDF to calculate ATS score, keyword breakdown & fix formatting"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">Upload CV (PDF) &amp; ATS Score</span>
            <span className="sm:hidden">ATS Score</span>
          </button>

          {/* AI Generate CV from Scratch */}
          <button
            onClick={() => setIsAIGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Generate with AI</span>
            <span className="md:hidden">AI CV</span>
          </button>

          {/* ATS Job Matcher */}
          <button
            onClick={() => setIsAIJobMatcherOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>ATS Matcher</span>
          </button>

          {/* Cover Letter */}
          <button
            onClick={() => setIsAICoverLetterOpen(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cover Letter</span>
          </button>

          {/* How It Works Guide */}
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            title="How App Works - Step by Step Guide / ऐप कैसे काम करेगा"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Guide</span>
          </button>

          {/* Reset App Button */}
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Reset App / Start Blank Resume / Demo Profile"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset</span>
          </button>

          {/* Export / Backup */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            title="Export ATS plain text or download JSON backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Print to PDF */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Download PDF or Print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      {/* Mobile view toggle (only visible on mobile screens) */}
      <div className="no-print lg:hidden h-10 bg-white border-b border-slate-200 px-4 flex items-center justify-around shrink-0">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 text-xs font-bold text-center border-b-2 transition-colors ${
            mobileView === 'editor'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500'
          }`}
        >
          ✏️ Edit CV Details
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-1.5 text-xs font-bold text-center border-b-2 transition-colors ${
            mobileView === 'preview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500'
          }`}
        >
          👁️ Live Preview &amp; PDF
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor & Design Controls */}
        <div
          className={`w-full lg:w-[48%] xl:w-[42%] 2xl:w-[38%] h-full flex flex-col bg-white border-r border-slate-200 overflow-hidden ${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Tabs: Content vs Appearance */}
          <div className="h-12 border-b border-slate-200 flex px-4 bg-slate-50/70 shrink-0 gap-3">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 text-xs font-bold border-b-2 transition-colors px-3 ${
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume Content</span>
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 text-xs font-bold border-b-2 transition-colors px-3 ${
                activeTab === 'design'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Templates &amp; Styling</span>
            </button>
          </div>

          {/* Content Subsections Navigation (if activeTab === 'content') */}
          {activeTab === 'content' && (
            <div className="flex overflow-x-auto gap-1 p-2 bg-white border-b border-slate-200 shrink-0 no-scrollbar">
              {[
                { id: 'personal', label: 'Personal', icon: SlidersHorizontal },
                { id: 'summary', label: 'Summary', icon: Sparkles },
                { id: 'experience', label: 'Experience', icon: Briefcase, count: resumeData.experiences.length },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'education', label: 'Education', icon: GraduationCap, count: resumeData.educations.length },
                { id: 'projects', label: 'Projects', icon: FolderGit2, count: resumeData.projects.length },
                { id: 'certifications', label: 'Certs', icon: Award, count: resumeData.certifications.length },
                { id: 'languages', label: 'Languages', icon: Globe, count: resumeData.languages.length },
                { id: 'reorder', label: '⇅ Reorder', icon: Layers },
              ].map((item) => {
                const isSelected = activeSection === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className={`text-[10px] px-1 rounded-full ${isSelected ? 'bg-indigo-200 text-indigo-900 font-bold' : 'bg-slate-200 text-slate-700'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            {activeTab === 'content' && (
              <>
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    {/* Fast Track PDF ATS Upload Banner */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Upload existing CV (PDF)</p>
                          <p className="text-[11px] text-slate-500">Auto-fill all resume sections &amp; detect ATS keywords</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPdfATSOpen(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload CV →</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
                      <span className="text-[11px] text-slate-400">Step 1 of 8</span>
                    </div>
                    <PersonalInfoForm
                      data={resumeData.personalInfo}
                      onChange={(updated) => setResumeData({ ...resumeData, personalInfo: updated })}
                    />
                    <div className="flex justify-end pt-3">
                      <button
                        onClick={() => setActiveSection('summary')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Summary →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'summary' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Professional Summary</h2>
                      <span className="text-[11px] text-slate-400">Step 2 of 8</span>
                    </div>
                    <SummaryForm
                      summary={resumeData.summary}
                      onChange={(newSummary) => setResumeData({ ...resumeData, summary: newSummary })}
                      onOpenAISummary={() => setIsAISummaryOpen(true)}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('personal')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Personal
                      </button>
                      <button
                        onClick={() => setActiveSection('experience')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Work Experience →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Work Experience</h2>
                      <span className="text-[11px] text-slate-400">Step 3 of 8</span>
                    </div>
                    <ExperienceForm
                      experiences={resumeData.experiences}
                      onChange={(updated) => setResumeData({ ...resumeData, experiences: updated })}
                      onOpenPolishModal={handleOpenPolishBullet}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('summary')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Summary
                      </button>
                      <button
                        onClick={() => setActiveSection('skills')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Skills &amp; Tech →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Skills &amp; Competencies</h2>
                      <span className="text-[11px] text-slate-400">Step 4 of 8</span>
                    </div>
                    <SkillsForm
                      skillCategories={resumeData.skillCategories}
                      jobTitle={resumeData.personalInfo.jobTitle}
                      onChange={(updated) => setResumeData({ ...resumeData, skillCategories: updated })}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('experience')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Experience
                      </button>
                      <button
                        onClick={() => setActiveSection('education')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Education →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Education</h2>
                      <span className="text-[11px] text-slate-400">Step 5 of 8</span>
                    </div>
                    <EducationForm
                      educations={resumeData.educations}
                      onChange={(updated) => setResumeData({ ...resumeData, educations: updated })}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('skills')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Skills
                      </button>
                      <button
                        onClick={() => setActiveSection('projects')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Projects →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Projects &amp; Portfolio</h2>
                      <span className="text-[11px] text-slate-400">Step 6 of 8</span>
                    </div>
                    <ProjectsForm
                      projects={resumeData.projects}
                      onChange={(updated) => setResumeData({ ...resumeData, projects: updated })}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('education')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Education
                      </button>
                      <button
                        onClick={() => setActiveSection('certifications')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Certifications →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'certifications' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Certifications &amp; Licenses</h2>
                      <span className="text-[11px] text-slate-400">Step 7 of 8</span>
                    </div>
                    <CertificationsForm
                      certifications={resumeData.certifications}
                      onChange={(updated) => setResumeData({ ...resumeData, certifications: updated })}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('projects')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Projects
                      </button>
                      <button
                        onClick={() => setActiveSection('languages')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Languages →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'languages' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Languages</h2>
                      <span className="text-[11px] text-slate-400">Step 8 of 8</span>
                    </div>
                    <LanguagesForm
                      languages={resumeData.languages}
                      onChange={(updated) => setResumeData({ ...resumeData, languages: updated })}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('certifications')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Certs
                      </button>
                      <button
                        onClick={() => setActiveSection('reorder')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Next: Reorder Sections →
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'reorder' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Customize Section Vertical Order</h2>
                      <span className="text-[11px] text-slate-400">Step 8 of 8</span>
                    </div>
                    <SectionOrderManager
                      data={resumeData}
                      onChangeOrder={(newOrder) => setResumeData({ ...resumeData, sectionOrder: newOrder })}
                    />
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setActiveSection('languages')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        ← Back to Languages
                      </button>
                      <button
                        onClick={() => setActiveTab('design')}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        Customize Design &amp; Layout →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'design' && (
              <DesignSettingsPanel
                config={designConfig}
                onChangeConfig={setDesignConfig}
                onLoadPreset={(preset) => setResumeData(preset)}
                resumeData={resumeData}
                onChangeResumeData={setResumeData}
              />
            )}
          </div>
        </div>

        {/* Right Side: Live Resume Sheet Preview */}
        <div
          className={`flex-1 h-full overflow-hidden ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <ResumePreview
            data={resumeData}
            config={designConfig}
            onChangeConfig={setDesignConfig}
            onChangeResumeData={setResumeData}
            onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
            onOpenJobMatcher={() => setIsAIJobMatcherOpen(true)}
            onOpenCoverLetter={() => setIsAICoverLetterOpen(true)}
            onOpenPdfATS={() => setIsPdfATSOpen(true)}
          />
        </div>
      </div>

      {/* AI Modals */}
      <AIPdfATSModal
        isOpen={isPdfATSOpen}
        onClose={() => setIsPdfATSOpen(false)}
        onImportParsedResume={(importedCv) => {
          setResumeData(importedCv);
          setDesignConfig((prev) => ({
            ...prev,
            template: 'modern-executive',
            colorTheme: prev.colorTheme === 'slate' ? 'navy' : prev.colorTheme,
          }));
          setMobileView('preview');
          setToastMessage(`✨ Successfully imported "${importedCv.personalInfo?.fullName || 'Candidate'}" into Professional Executive format!`);
        }}
        onAddSkills={handleAddSkillsFromATS}
      />

      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onApplyResume={(newCv) => {
          setResumeData(newCv);
          setMobileView('preview');
          setToastMessage(`✨ Successfully generated CV for "${newCv.personalInfo?.jobTitle || 'Role'}"!`);
        }}
      />

      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold rounded-xl shadow-2xl border border-indigo-500/40 animate-bounce-once">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="ml-2 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <AIBulletEnhancerModal
        isOpen={bulletModalState.isOpen}
        onClose={() => setBulletModalState({ ...bulletModalState, isOpen: false })}
        originalBullet={bulletModalState.bullet}
        role={bulletModalState.role}
        company={bulletModalState.company}
        onSelectOption={handleApplyPolishedBullet}
      />

      <AISummaryModal
        isOpen={isAISummaryOpen}
        onClose={() => setIsAISummaryOpen(false)}
        cvData={resumeData}
        onSelectSummary={handleApplyAISummary}
      />

      <AIJobMatcherModal
        isOpen={isAIJobMatcherOpen}
        onClose={() => setIsAIJobMatcherOpen(false)}
        cvData={resumeData}
        onApplySummary={handleApplyAISummary}
        onAddSkills={handleAddSkillsFromATS}
        onOpenPdfUpload={() => setIsPdfATSOpen(true)}
      />

      <AICoverLetterModal
        isOpen={isAICoverLetterOpen}
        onClose={() => setIsAICoverLetterOpen(false)}
        cvData={resumeData}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={resumeData}
        onImportResume={(imported) => setResumeData(imported)}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onResetResume={handleResetResume}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartBlank={() => handleResetResume(INITIAL_EMPTY_RESUME, true)}
        onLoadDemo={() => handleResetResume(SAMPLE_TECH_LEAD, true)}
      />
    </div>
    <a 
  href="https://github.com/kilcherushikesh-gif" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="my-custom-badge"
>
  <img src="/logo.png" alt="Rishi Logo" className="badge-logo" />
  <span>Powered by Rishi</span>
</a>
  );
}

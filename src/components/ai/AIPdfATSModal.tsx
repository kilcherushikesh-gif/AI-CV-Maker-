import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, PdfATSReport } from '../../types/resume';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Plus,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  Target,
  ShieldCheck,
  Download,
  RotateCcw,
  AlertOctagon,
  Ban,
  Copy,
  XCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportParsedResume: (resume: ResumeData) => void;
  onAddSkills: (skills: string[]) => void;
}

export const AIPdfATSModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onImportParsedResume,
  onAddSkills,
}) => {
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJobInput, setShowJobInput] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [report, setReport] = useState<PdfATSReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedSkillsMap, setAddedSkillsMap] = useState<Record<string, boolean>>({});
  const [completedActionItems, setCompletedActionItems] = useState<Record<number, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [wrongKeywordFilter, setWrongKeywordFilter] = useState<string>('all');
  const [showRoleChange, setShowRoleChange] = useState(false);
  const [reTargetRole, setReTargetRole] = useState('');
  const [autoFillResume, setAutoFillResume] = useState(true);
  const [hasAutoImported, setHasAutoImported] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const SCAN_STEPS = [
    'Parsing document layers & OCR text layout...',
    'Evaluating single-column parsing & standard ATS headers...',
    'Benchmarking Google XYZ metrics & quantifiable outcomes...',
    'Matching keyword density & industry competency matrices...',
    'Generating comprehensive ATS compliance audit report...',
  ];

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Quick career roles for instant targeting across all industries
  const POPULAR_ROLES = [
    'Data Analyst',
    'Data Scientist',
    'Software Engineer',
    'Product Manager',
    'Financial Analyst',
    'Marketing Specialist',
    'UI/UX Designer',
    'DevOps Engineer',
    'Healthcare & Nursing',
    'Sales Representative',
    'HR Specialist',
    'Cybersecurity Analyst',
  ];

  const handleCopySuggestion = (text: string, kw: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2500);
  };

  const getCandidateDisplayName = (name?: string) => {
    let val = (name || '').trim();
    val = val
      .replace(/\s*\.(pdf|docx?|txt|rtf|pages)$/i, '')
      .replace(/\b(pdf|docx?|txt|rtf|resume|cv)\b/gi, '')
      .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
      .replace(/page\s*\d+(\s*of\s*\d+)?/gi, '')
      .replace(/^[#\-_*•|~:]+\s*/, '')
      .replace(/\s*[#\-_*•|~:]+$/, '')
      .replace(/\s+/g, ' ')
      .trim();

    if ((!val || /--\s*\d+\s*of|page\s*\d+|not detected|candidate|applicant/i.test(val)) && file?.name) {
      const clean = file.name
        .replace(/\s*\.(pdf|docx?|txt|rtf|pages)$/i, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b(pdf|docx?|txt|rtf|resume|cv|curriculum|vitae|updated|final|new|\d+)/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (clean.length > 2) {
        val = clean;
      }
    }
    if (val) {
      return val
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
    return 'Candidate';
  };

  if (!isOpen) return null;

  const handleFileProcess = (selectedFile: File) => {
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isPdfOrText = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.txt');
    
    if (!isPdfOrText && selectedFile.size > 20 * 1024 * 1024) {
      setError('Please upload a PDF or text file under 20MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Auto-detect target role from file name if user has not set one
    if (!targetRole) {
      const nameLower = selectedFile.name.toLowerCase();
      if (nameLower.includes('data analyst')) setTargetRole('Data Analyst');
      else if (nameLower.includes('data scientist')) setTargetRole('Data Scientist');
      else if (nameLower.includes('business analyst')) setTargetRole('Business Analyst');
      else if (nameLower.includes('product manager')) setTargetRole('Product Manager');
      else if (nameLower.includes('project manager')) setTargetRole('Project Manager');
      else if (nameLower.includes('financial') || nameLower.includes('finance')) setTargetRole('Financial Analyst');
      else if (nameLower.includes('marketing')) setTargetRole('Marketing Specialist');
      else if (nameLower.includes('designer') || nameLower.includes('ux') || nameLower.includes('ui')) setTargetRole('UI/UX Designer');
      else if (nameLower.includes('devops') || nameLower.includes('cloud')) setTargetRole('DevOps Engineer');
      else if (nameLower.includes('nurse') || nameLower.includes('clinical')) setTargetRole('Healthcare & Nursing');
      else if (nameLower.includes('sales')) setTargetRole('Sales Representative');
      else if (nameLower.includes('hr') || nameLower.includes('recruiter')) setTargetRole('HR Specialist');
      else if (nameLower.includes('security') || nameLower.includes('cyber')) setTargetRole('Cybersecurity Analyst');
      else if (nameLower.includes('software')) setTargetRole('Software Engineer');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setError('Could not read the file. Please try again.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleScan = async (e?: React.FormEvent, overrideRole?: string) => {
    if (e) e.preventDefault();
    if (inputMode === 'file' && !fileBase64) {
      setError('Please select or upload a CV PDF or text file first.');
      return;
    }
    if (inputMode === 'text' && !rawText.trim()) {
      setError('Please paste your resume or LinkedIn profile text first.');
      return;
    }

    const effectiveRole = (overrideRole !== undefined ? overrideRole : targetRole).trim();
    if (overrideRole !== undefined) {
      setTargetRole(overrideRole);
    }

    setIsScanning(true);
    setError(null);
    setShowRoleChange(false);

    try {
      const res = await fetch('/api/ai/scan-pdf-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: inputMode === 'file' ? fileBase64 : undefined,
          rawText: inputMode === 'text' ? rawText : undefined,
          mimeType: file?.type || 'application/pdf',
          fileName: file?.name || (inputMode === 'text' ? 'pasted_resume.txt' : 'resume.pdf'),
          targetRole: effectiveRole || undefined,
          jobDescription: jobDescription.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan CV');
      }

      if (data.report) {
        console.log('ATS Scan Result:', data.report);
        setReport(data.report);
        if (autoFillResume && data.report.parsedResume) {
          const fullCv = buildFullResumeFromParsed(data.report.parsedResume, data.report);
          onImportParsedResume(fullCv);
          setHasAutoImported(true);
        }
      } else {
        throw new Error('No audit report returned.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while scanning PDF. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddSingleSkill = (skill: string) => {
    onAddSkills([skill]);
    setAddedSkillsMap((prev) => ({ ...prev, [skill]: true }));
  };

  const handleAddAllMissingSkills = () => {
    if (!report?.missingKeywords) return;
    onAddSkills(report.missingKeywords);
    const newMap: Record<string, boolean> = {};
    report.missingKeywords.forEach((k) => (newMap[k] = true));
    setAddedSkillsMap(newMap);
  };

  const buildFullResumeFromParsed = (pr: any, reportData: any): ResumeData => {
    const now = Date.now();
    const cleanName = getCandidateDisplayName(pr?.fullName || reportData?.detectedCandidate?.fullName);
    const cleanRole = pr?.jobTitle || reportData?.detectedCandidate?.targetRole || 'Professional';
    const isInvalidEmail = (em?: string) => !em || /not provided|none|n\/a|null|undefined|example\.com/i.test(em) || !em.includes('@');
    const isInvalidPhone = (ph?: string) => !ph || /not provided|none|n\/a|null|undefined/i.test(ph) || ph.includes('555') || ph.replace(/\D/g, '').length < 7;
    const isInvalidLocation = (loc?: string) => !loc || /^(android|ios|windows|mobile|iphone|none|null|not provided|n\/a|united states|san francisco, ca)$/i.test(loc.trim()) || /not provided|n\/a/i.test(loc);

    const rawEmail = pr?.email || reportData?.detectedCandidate?.email || '';
    const cleanEmail = !isInvalidEmail(rawEmail) ? rawEmail : '';

    const rawPhone = pr?.phone || reportData?.detectedCandidate?.phone || '';
    const cleanPhone = !isInvalidPhone(rawPhone) ? rawPhone : '';

    const rawLocation = pr?.location || reportData?.detectedCandidate?.location || '';
    const cleanLocation = !isInvalidLocation(rawLocation) ? rawLocation : '';

    const allSkills: string[] = pr?.skills || reportData?.detectedKeywords || [];
    let skillCategories = [
      {
        id: `cat-${now}-0`,
        category: 'Core Competencies',
        items: allSkills.length > 0 ? allSkills : ['Analytical Problem Solving', 'Communication'],
      },
    ];

    if (allSkills.length > 8) {
      const mid = Math.ceil(allSkills.length * 0.6);
      skillCategories = [
        {
          id: `cat-${now}-tech`,
          category: 'Technical & Domain Tools',
          items: allSkills.slice(0, mid),
        },
        {
          id: `cat-${now}-core`,
          category: 'Core Competencies & Methodologies',
          items: allSkills.slice(mid),
        },
      ];
    }

    return {
      id: `imported-ats-${now}`,
      title: `${cleanRole} Resume`,
      personalInfo: {
        fullName: cleanName,
        jobTitle: cleanRole,
        email: cleanEmail,
        phone: cleanPhone,
        location: cleanLocation,
        website: pr?.website || '',
        linkedin: pr?.linkedin || '',
        github: pr?.github || '',
        photoUrl: '',
      },
      summary: pr?.summary || '',
      experiences: (pr?.experiences || []).map((exp: any, idx: number) => ({
        id: `exp-${now}-${idx}`,
        role: exp.role || cleanRole,
        company: exp.company || (idx === 0 ? 'Current Company / Organization' : 'Previous Company / Organization'),
        location: !isInvalidLocation(exp.location) ? exp.location : (!isInvalidLocation(cleanLocation) ? cleanLocation : ''),
        startDate: exp.startDate || '2021',
        endDate: exp.endDate || 'Present',
        current: !!exp.current,
        bullets: exp.bullets && exp.bullets.length > 0 ? exp.bullets : [`Executed core responsibilities and delivered key business deliverables as ${exp.role || cleanRole}.`],
      })),
      educations: (pr?.educations || []).map((edu: any, idx: number) => ({
        id: `edu-${now}-${idx}`,
        degree: edu.degree || 'Bachelor of Science',
        field: edu.field || '',
        school: edu.school || 'University',
        location: !isInvalidLocation(edu.location) ? edu.location : '',
        startDate: edu.startDate || '2017',
        endDate: edu.endDate || '2021',
      })),
      skillCategories,
      projects: (pr?.projects || []).map((proj: any, idx: number) => ({
        id: `proj-${now}-${idx}`,
        name: proj.name || `Project ${idx + 1}`,
        role: proj.role || cleanRole,
        link: proj.link || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        description: proj.description || '',
        bullets: Array.isArray(proj.bullets) ? proj.bullets : [],
      })),
      certifications: (pr?.certifications || []).map((cert: any, idx: number) => ({
        id: `cert-${now}-${idx}`,
        name: typeof cert === 'string' ? cert : cert.name || 'Certification',
        issuer: typeof cert === 'string' ? 'Authorized Credential' : cert.issuer || 'Issuing Organization',
        issueDate: typeof cert === 'string' ? '2023' : cert.issueDate || '2023',
      })),
      languages: (pr?.languages || ['English (Fluent)']).map((lang: any, idx: number) => ({
        id: `lang-${now}-${idx}`,
        language: typeof lang === 'string' ? lang.replace(/\s*\([^)]*\)/, '') : lang.language || 'English',
        proficiency: typeof lang === 'string' && /native|fluent|professional|intermediate|basic/i.test(lang)
          ? (lang.match(/native|fluent|professional|intermediate|basic/i)?.[0] as any) || 'Professional'
          : lang.proficiency || 'Professional',
      })),
      customSections: [],
      sectionOrder: ['summary', 'experiences', 'skills', 'educations', 'projects', 'certifications', 'languages'],
    };
  };

  const handleImportParsedCv = () => {
    if (!report?.parsedResume) return;
    const fullCv = buildFullResumeFromParsed(report.parsedResume, report);
    onImportParsedResume(fullCv);
    setHasAutoImported(true);
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-indigo-600';
    if (score >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-4 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base md:text-lg tracking-tight">Upload CV (PDF) &amp; ATS Score Audit</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                  AI Auditor
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Upload your existing resume to calculate your exact ATS score, identify missing keywords, and import to redesign.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 font-bold ml-2">
                ✕
              </button>
            </div>
          )}

          {!report && (
            <div className="space-y-4">
              {/* Input Mode Selector */}
              <div className="flex p-1 bg-slate-100 rounded-xl max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setInputMode('file')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inputMode === 'file'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload CV (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inputMode === 'text'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paste Resume Text</span>
                </button>
              </div>

              {inputMode === 'file' ? (
                /* File Upload Dropzone */
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : file
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50 hover:border-indigo-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileProcess(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-13 h-13 rounded-2xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-inner">
                      {file ? (
                        <FileCheck2 className="w-7 h-7 text-emerald-600" />
                      ) : (
                        <UploadCloud className="w-7 h-7" />
                      )}
                    </div>

                    <div>
                      {file ? (
                        <div>
                          <p className="text-sm font-bold text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(1)} KB • Click to replace file
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Click to upload your CV PDF, or drag and drop
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Supports PDF &amp; TXT documents up to 20MB
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        PDF
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        TXT
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        • Multi-layer OCR &amp; text parser enabled
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Paste Resume Text Area */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="font-bold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Paste Full Resume / LinkedIn Profile Text:</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {rawText.length > 0 ? `${rawText.split(/\s+/).filter(Boolean).length} words` : 'Zero formatting loss'}
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste your resume content here (e.g. from Word, Google Docs, LinkedIn, or text file)...&#10;&#10;Alex Vance&#10;Senior Software Engineer&#10;alex@example.com | San Francisco, CA&#10;&#10;EXPERIENCE:&#10;Lead Systems Engineer - Acme Corp (2021 - Present)&#10;• Orchestrated Kubernetes microservices reducing latency by 45%&#10;• Managed AWS cloud infrastructure and CI/CD pipelines&#10;&#10;SKILLS:&#10;React, Node.js, Python, AWS, Docker, Kubernetes, SQL"
                    className="w-full p-3.5 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
                  />
                  <p className="text-[11px] text-slate-500">
                    💡 Ideal if your PDF was exported as a flat canvas image (e.g. from Canva or Photoshop) without native text layers.
                  </p>
                </div>
              )}

              {/* Target Job Profile & Career Domain */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>Target Job Profile / Career Field:</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    ATS keywords tailored to role
                  </span>
                </div>

                {/* Popular Role Quick Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(targetRole === role ? '' : role)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        targetRole.toLowerCase() === role.toLowerCase()
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Or type any specific role (e.g. Senior Data Analyst)..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowJobInput(!showJobInput)}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="truncate">
                      {jobDescription ? '✓ Target Job Description Added' : '+ Add Job Description (Optional)'}
                    </span>
                    {showJobInput ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                </div>

                {showJobInput && (
                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste job posting text from LinkedIn or Indeed to calculate exact keyword match percentage..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Scanning Loading State */}
              {isScanning && (
                <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-950">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      <span>{SCAN_STEPS[scanStep]}</span>
                    </span>
                    <span className="text-[11px] text-indigo-600 font-bold">
                      {Math.min(95, (scanStep + 1) * 20)}%
                    </span>
                  </div>
                  <div className="w-full bg-indigo-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(95, (scanStep + 1) * 20)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    Auditing formatting, OCR parsing layers, Google XYZ metrics, and ATS database compatibility...
                  </p>
                </div>
              )}

              {/* Auto-fill Toggle & Scan Action Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoFillResume}
                    onChange={(e) => setAutoFillResume(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-fill all resume sections with extracted CV information</span>
                  </span>
                </label>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={(inputMode === 'file' ? !fileBase64 : !rawText.trim()) || isScanning}
                    onClick={() => handleScan()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Auditing &amp; Extracting CV...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Scan &amp; Auto-Fill CV</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report View */}
          {report && (
            <div className="space-y-6 animate-fadeIn">
              {hasAutoImported && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold">All information extracted and filled into your resume!</p>
                      <p className="text-emerald-100 text-[11px]">
                        Personal details, career summary, work history, skills, education, projects, certifications &amp; languages are populated in the editor.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>View in Resume Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Top Score Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-5">
                  {/* Circular Score Gauge */}
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-700"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={
                          report.atsScore >= 80
                            ? 'text-emerald-400'
                            : report.atsScore >= 65
                            ? 'text-indigo-400'
                            : 'text-amber-400'
                        }
                        strokeDasharray={`${report.atsScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-black">{report.atsScore}</span>
                      <span className="text-[9px] uppercase tracking-widest text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        ATS Compatibility Score
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreColor(
                          report.atsScore
                        )}`}
                      >
                        {report.matchGrade}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1 flex flex-wrap items-center gap-2">
                      <span>{getCandidateDisplayName(report.detectedCandidate?.fullName)}</span>
                      <span className="text-slate-400 font-normal">•</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-semibold">
                        <Target className="w-3.5 h-3.5 text-indigo-300" />
                        <span>Profile: {report.detectedCandidate?.targetRole || targetRole || 'Professional'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowRoleChange(!showRoleChange)}
                        className="text-[11px] text-indigo-300 hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
                      >
                        {showRoleChange ? 'Close profile switcher' : 'Change profile / role ✎'}
                      </button>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      {report.atsScore >= 80
                        ? 'High pass probability across Workday, Greenhouse, and Taleo algorithms.'
                        : report.atsScore >= 65
                        ? 'Likely to pass initial automated screens, but requires keyword and metric additions.'
                        : 'At risk of automated rejection due to missing metrics or formatting flags.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleImportParsedCv}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{hasAutoImported ? 'Re-Apply All Information to Editor' : 'Fill All Information into Resume Editor'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReport(null);
                      setFile(null);
                      setFileBase64(null);
                      setHasAutoImported(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Upload Another CV</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Target Role Switcher */}
              {showRoleChange && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-white space-y-3 shadow-md animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span>Re-target CV Keywords for Any Career Profile:</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Instantly refreshes missing &amp; wrong keywords for this role
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setTargetRole(role);
                          handleScan(undefined, role);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                          (report.detectedCandidate?.targetRole || targetRole).toLowerCase() === role.toLowerCase()
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={reTargetRole}
                      onChange={(e) => setReTargetRole(e.target.value)}
                      placeholder="Or enter any custom job title (e.g. Lead BI Analyst, Clinical Nurse, Product Owner)..."
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      disabled={!reTargetRole.trim() || isScanning}
                      onClick={() => {
                        if (reTargetRole.trim()) {
                          setTargetRole(reTargetRole.trim());
                          handleScan(undefined, reTargetRole.trim());
                        }
                      }}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Audit for This Role
                    </button>
                  </div>
                </div>
              )}

              {/* Informational tip if low selectable text layer or OCR scan detected */}
              {(report.categoryScores.formattingScore < 68 ||
                report.categoryScores.formattingFeedback?.toLowerCase().includes('scan') ||
                report.categoryScores.formattingFeedback?.toLowerCase().includes('text layer') ||
                report.criticalIssues?.some((i) => i.toLowerCase().includes('text layer'))) && (
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">ATS Parser Advisory: Flat Scan or Image Layer Detected</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Applicant Tracking Systems (Workday, Taleo) require digital selectable text. Click{' '}
                      <strong>"Import &amp; Redesign in ResumAI"</strong> to instantly convert your resume into a clean, 100% ATS-compliant single-column layout!
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Category Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Formatting */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Formatting &amp; Structure</span>
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {report.categoryScores.formattingScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(
                        report.categoryScores.formattingScore
                      )}`}
                      style={{ width: `${report.categoryScores.formattingScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {report.categoryScores.formattingFeedback}
                  </p>
                </div>

                {/* 2. Quantification */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Impact &amp; Metrics (Google XYZ)</span>
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {report.categoryScores.quantificationScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(
                        report.categoryScores.quantificationScore
                      )}`}
                      style={{ width: `${report.categoryScores.quantificationScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {report.categoryScores.quantificationFeedback}
                  </p>
                </div>

                {/* 3. Keywords */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Keyword &amp; Skill Density</span>
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {report.categoryScores.keywordScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(
                        report.categoryScores.keywordScore
                      )}`}
                      style={{ width: `${report.categoryScores.keywordScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {report.categoryScores.keywordFeedback}
                  </p>
                </div>

                {/* 4. Completeness */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      <span>Section Completeness</span>
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {report.categoryScores.completenessScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(
                        report.categoryScores.completenessScore
                      )}`}
                      style={{ width: `${report.categoryScores.completenessScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {report.categoryScores.completenessFeedback}
                  </p>
                </div>
              </div>

              {/* Keywords Detected & Missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Detected Keywords */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Detected Keywords ({report.detectedKeywords?.length || 0})
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(report.detectedKeywords || []).map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[11px] font-medium bg-emerald-100/70 text-emerald-800 rounded-lg border border-emerald-200"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Missing Recommended Skills ({report.missingKeywords?.length || 0})
                      </h5>
                    </div>
                    {report.missingKeywords?.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAddAllMissingSkills}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        + Add All to CV
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(report.missingKeywords || []).map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSingleSkill(kw)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer ${
                          addedSkillsMap[kw]
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-amber-100/80 text-amber-800 border-amber-200'
                        }`}
                      >
                        {addedSkillsMap[kw] ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-amber-600" />
                            <span>{kw}</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Problematic & Wrong Keywords Section */}
              <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                      <AlertOctagon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                          Wrong &amp; Problematic Keywords Detected ({report.wrongKeywords?.length || 0})
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                          Hurts ATS Score
                        </span>
                      </div>
                      <p className="text-xs text-rose-700 mt-0.5">
                        These clichés, passive buzzwords, and outdated tools hurt your ATS ranking and recruiter screening score.
                      </p>
                    </div>
                  </div>

                  {/* Filter chips for wrong keyword categories */}
                  {report.wrongKeywords && report.wrongKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {['all', 'Cliche Buzzword', 'Passive Phrasing', 'Outdated Technology', 'Role Mismatch', 'Low Impact'].map((cat) => {
                        const count =
                          cat === 'all'
                            ? report.wrongKeywords?.length
                            : report.wrongKeywords?.filter((k) => k.category === cat).length;
                        if (cat !== 'all' && (!count || count === 0)) return null;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setWrongKeywordFilter(cat)}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                              wrongKeywordFilter === cat
                                ? 'bg-rose-700 text-white shadow-xs'
                                : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {cat === 'all' ? 'All Issues' : cat} ({count})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* List of wrong keywords with reasons and suggested replacements */}
                {(!report.wrongKeywords || report.wrongKeywords.length === 0) ? (
                  <div className="p-4 rounded-xl bg-white border border-rose-100 text-center">
                    <p className="text-xs text-slate-600">
                      ✓ No severe cliché buzzwords detected. Continue quantifying achievements with specific metrics!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {(report.wrongKeywords || [])
                      .filter((item) => wrongKeywordFilter === 'all' || item.category === wrongKeywordFilter)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-rose-200/80 bg-white shadow-xs space-y-2.5 transition-all hover:border-rose-300"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded-md border border-rose-200 flex items-center gap-1.5">
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span className="line-through decoration-rose-600 decoration-2">{item.keyword}</span>
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.category === 'Cliche Buzzword'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.category === 'Passive Phrasing'
                                  ? 'bg-slate-100 text-slate-700'
                                  : item.category === 'Outdated Technology'
                                  ? 'bg-red-100 text-red-800'
                                  : item.category === 'Role Mismatch'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              <strong className="text-slate-800">Why it hurts:</strong> {item.reason}
                            </p>

                            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-emerald-600" />
                                  <span>Suggested Replacement</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopySuggestion(item.recommendation, item.keyword)}
                                  className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedKeyword === item.keyword ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-emerald-600" />
                                      <span>Copy Tip</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                                {item.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Strengths & Critical Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>ATS Strengths</span>
                  </h5>
                  <ul className="space-y-2">
                    {(report.strengths || []).map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Flags */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2.5">
                  <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Critical ATS Flags &amp; Risks</span>
                  </h5>
                  <ul className="space-y-2">
                    {(report.criticalIssues || []).map((issue, idx) => (
                      <li key={idx} className="text-xs text-rose-800 flex items-start gap-2">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Plan Checklist */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h5 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Immediate Action Plan to Gain 15+ ATS Points
                    </h5>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700">
                    {Object.values(completedActionItems).filter(Boolean).length} /{' '}
                    {report.actionPlan?.length || 0} completed
                  </span>
                </div>

                <div className="space-y-2">
                  {(report.actionPlan || []).map((action, idx) => {
                    const isDone = !!completedActionItems[idx];
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50/80 border-emerald-200 line-through text-slate-400'
                            : 'bg-white border-indigo-100 hover:border-indigo-300 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={(e) =>
                            setCompletedActionItems((prev) => ({
                              ...prev,
                              [idx]: e.target.checked,
                            }))
                          }
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-medium leading-relaxed">{action}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Audit Report</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleImportParsedCv}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Import to Editor &amp; Fix Flags</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

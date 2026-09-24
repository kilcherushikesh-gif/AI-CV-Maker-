import React, { useState, useEffect } from 'react';
import { ResumeData } from '../../types/resume';
import { Sparkles, Loader2, X, Wand2, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyResume: (newResume: ResumeData) => void;
}

export const AIGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onApplyResume }) => {
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [yearsExperience, setYearsExperience] = useState('6');
  const [currentSkills, setCurrentSkills] = useState('React, TypeScript, Node.js, AWS, PostgreSQL, System Design');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rotating steps for lively feedback
  const STEPS = [
    'Analyzing target role & industry competencies...',
    'Structuring metric-driven achievements (Google XYZ)...',
    'Curating modern skill matrices & tech stacks...',
    'Optimizing keywords for ATS compliance...',
    'Finalizing professional resume document...',
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000);

    try {
      const res = await fetch('/api/ai/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          yearsExperience,
          currentSkills,
          prompt,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate CV');
      }

      if (data.cv) {
        setIsSuccess(true);
        setTimeout(() => {
          onApplyResume(data.cv);
          setIsSuccess(false);
          setIsLoading(false);
          onClose();
        }, 600);
      } else {
        throw new Error('No CV returned from server');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      if (err.name === 'AbortError') {
        setError('Generation timed out. Please try again or use Instant Synthesis.');
      } else {
        setError(err.message || 'Something went wrong while generating the CV.');
      }
      setIsLoading(false);
    }
  };

  const handlePresetSelect = (role: string, years: string, skills: string, notes: string) => {
    setTargetRole(role);
    setYearsExperience(years);
    setCurrentSkills(skills);
    setPrompt(notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
              <Sparkles className="w-5 h-5 text-indigo-300" />
            </span>
            <h2 className="text-xl font-bold">Generate Full CV with AI</h2>
          </div>
          <p className="text-indigo-200 text-xs">
            Describe your background, role, or paste rough bullet points. Gemini will craft an ATS-optimized, metric-driven CV.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Try a role template:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handlePresetSelect('Senior Cloud & DevOps Architect', '8', 'AWS, Terraform, Kubernetes, CI/CD, Python, Docker', 'Led cloud migrations, cut cloud spend by 35%, automated deployment pipelines.')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 transition-colors disabled:opacity-50"
            >
              ☁️ DevOps Architect
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handlePresetSelect('Lead Product Manager', '6', 'Product Strategy, Mixpanel, A/B Testing, User Research, Agile', 'Scaled B2B SaaS ARR from $2M to $15M, managed cross-functional squads.')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 transition-colors disabled:opacity-50"
            >
              🎯 Lead Product Manager
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handlePresetSelect('Senior Machine Learning Engineer', '5', 'PyTorch, Python, LLMs, Vector DBs, MLOps, LangChain', 'Deployed production AI models, fine-tuned transformer models for search.')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 transition-colors disabled:opacity-50"
            >
              🤖 ML / AI Engineer
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handlePresetSelect('Growth Marketing Director', '7', 'SEO, SEM, Hubspot, Google Analytics, Lifecycle, Copywriting', 'Led 180% year-over-year inbound pipeline growth, managed $1.2M ad spend.')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 transition-colors disabled:opacity-50"
            >
              📈 Growth Marketing
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role / Job Title *
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Years of Experience
              </label>
              <input
                type="text"
                disabled={isLoading}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Key Skills &amp; Technologies
            </label>
            <input
              type="text"
              disabled={isLoading}
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, GraphQL, Node.js"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Raw Notes, Achievements, or Past Companies (Optional)
            </label>
            <textarea
              rows={3}
              disabled={isLoading}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste raw notes, summary of previous roles, or specific projects you want included..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none disabled:bg-slate-50"
            />
          </div>

          {/* Progress Indicator when generating */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                <span className="flex items-center gap-2">
                  {isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  )}
                  <span>{isSuccess ? 'CV Ready! Applying to resume...' : STEPS[loadingStep]}</span>
                </span>
                <span className="text-[11px] text-indigo-600 font-bold">
                  {isSuccess ? '100%' : `${Math.min(95, (loadingStep + 1) * 20)}%`}
                </span>
              </div>
              <div className="w-full bg-indigo-200/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: isSuccess ? '100%' : `${Math.min(95, (loadingStep + 1) * 20)}%` }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !targetRole}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isSuccess ? 'CV Created!' : 'Generating with Gemini...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Complete CV</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

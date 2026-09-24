import React, { useState } from 'react';
import { ResumeData, ATSAnalysisResult } from '../../types/resume';
import { Sparkles, Loader2, X, CheckCircle2, AlertTriangle, ArrowRight, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cvData: ResumeData;
  onApplySummary: (newSummary: string) => void;
  onAddSkills: (skills: string[]) => void;
  onOpenPdfUpload?: () => void;
}

export const AIJobMatcherModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cvData,
  onApplySummary,
  onAddSkills,
  onOpenPdfUpload,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedSummary, setAppliedSummary] = useState(false);
  const [addedSkills, setAddedSkills] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setAppliedSummary(false);
    setAddedSkills(false);

    try {
      const res = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze job match');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error running ATS analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base">ATS Resume &amp; Job Description Matcher</h3>
              <p className="text-xs text-slate-400">Scan candidate CV against any job post to optimize keywords and rank higher.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick PDF Upload Link */}
          {onOpenPdfUpload && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-indigo-100 text-indigo-700 text-xs">📄</span>
                <span className="text-xs text-indigo-950 font-medium">Have an existing CV as a PDF file?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPdfUpload();
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Upload CV PDF &amp; ATS Score →
              </button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleAnalyze} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Paste Target Job Description:
            </label>
            <textarea
              rows={4}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the requirements, responsibilities, and qualifications from LinkedIn, Indeed, or company job listing..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !jobDescription.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Auditing ATS Match...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Match Score</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-5 pt-2 border-t border-slate-100">
              {/* Score Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-black ${getScoreColor(result.score)}`}>
                    <span className="text-xl leading-none">{result.score}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold">Match</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Rating: {result.matchGrade}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {result.score >= 80 ? 'Strong alignment with ATS keyword filters!' : 'Good foundation, but several high-weight keywords are missing.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Keywords Match Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Keywords */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Matched Keywords ({result.matchingKeywords?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(result.matchingKeywords || []).map((kw, idx) => (
                      <span key={idx} className="bg-white border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Missing Keywords ({result.missingKeywords?.length || 0})</span>
                    </div>
                    {result.missingKeywords?.length > 0 && (
                      <button
                        onClick={() => {
                          onAddSkills(result.missingKeywords);
                          setAddedSkills(true);
                        }}
                        disabled={addedSkills}
                        className="text-[10px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded transition-colors"
                      >
                        {addedSkills ? '✓ Added to Skills' : '+ Add all to CV'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(result.missingKeywords || []).map((kw, idx) => (
                      <span key={idx} className="bg-white border border-amber-300 text-amber-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Tailored Summary */}
              {result.recommendedSummary && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">Recommended Tailored Summary for this Role:</span>
                    <button
                      onClick={() => {
                        onApplySummary(result.recommendedSummary);
                        setAppliedSummary(true);
                      }}
                      disabled={appliedSummary}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      {appliedSummary ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{appliedSummary ? 'Applied to CV' : 'Apply to My CV'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {result.recommendedSummary}
                  </p>
                </div>
              )}

              {/* Actionable Improvements */}
              {result.improvements && result.improvements.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Recommended Improvements:
                  </h4>
                  <ul className="space-y-1">
                    {result.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

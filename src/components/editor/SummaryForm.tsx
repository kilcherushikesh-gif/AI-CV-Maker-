import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  summary: string;
  onChange: (newSummary: string) => void;
  onOpenAISummary: () => void;
}

export const SummaryForm: React.FC<Props> = ({ summary, onChange, onOpenAISummary }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700">
          Executive Summary / Bio
        </label>
        <button
          type="button"
          onClick={onOpenAISummary}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>✨ AI Write Summary</span>
        </button>
      </div>

      <textarea
        rows={4}
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a concise 2-3 sentence overview highlighting your core strengths, years of experience, and quantifiable career milestones..."
        className="w-full px-3.5 py-2.5 text-xs text-slate-800 leading-relaxed border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
      />
      <p className="text-[11px] text-slate-400">
        Tip: ATS parsers prioritize hard keywords, exact titles, and measurable career outcomes in the summary.
      </p>
    </div>
  );
};

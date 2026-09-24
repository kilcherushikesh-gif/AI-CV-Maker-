import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { Sparkles, Loader2, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cvData: ResumeData;
  onSelectSummary: (summaryText: string) => void;
}

interface SummaryOption {
  title: string;
  summary: string;
}

export const AISummaryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cvData,
  onSelectSummary,
}) => {
  const [style, setStyle] = useState<'executive' | 'modern' | 'metrics'>('executive');
  const [options, setOptions] = useState<SummaryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (selectedStyle = style) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          style: selectedStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate summaries');
      }

      setOptions(data.options || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating summaries');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">AI Executive Summary Generator</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Choose Summary Style:</label>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => { setStyle('executive'); handleGenerate('executive'); }}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${style === 'executive' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'}`}
              >
                Executive
              </button>
              <button
                type="button"
                onClick={() => { setStyle('metrics'); handleGenerate('metrics'); }}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${style === 'metrics' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'}`}
              >
                Metric-Heavy
              </button>
              <button
                type="button"
                onClick={() => { setStyle('modern'); handleGenerate('modern'); }}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${style === 'modern' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'}`}
              >
                Technical
              </button>
            </div>
          </div>

          {options.length === 0 && !isLoading && (
            <div className="text-center py-6">
              <p className="text-xs text-slate-500 mb-3">
                Click below to have Gemini analyze your experiences and generate 3 custom executive bio options.
              </p>
              <button
                onClick={() => handleGenerate()}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
              >
                Generate 3 Summaries
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <p className="text-xs font-medium">Crafting tailored executive summaries...</p>
            </div>
          )}

          {!isLoading && options.length > 0 && (
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">{opt.title}</span>
                    <button
                      onClick={() => {
                        onSelectSummary(opt.summary);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      Use in Resume
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {opt.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { BulletImprovement } from '../../types/resume';
import { Sparkles, Loader2, X, Check, Copy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  role?: string;
  company?: string;
  onSelectOption: (newBullet: string) => void;
}

export const AIBulletEnhancerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  originalBullet,
  role,
  company,
  onSelectOption,
}) => {
  const [bulletText, setBulletText] = useState(originalBullet);
  const [options, setOptions] = useState<BulletImprovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBulletText(originalBullet);
      setOptions([]);
      setError(null);
      if (originalBullet.trim()) {
        enhanceBullet(originalBullet);
      }
    }
  }, [isOpen, originalBullet]);

  if (!isOpen) return null;

  const enhanceBullet = async (textToPolish: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: textToPolish,
          role,
          company,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to polish bullet point');
      }

      setOptions(data.options || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base">AI Bullet Point Polisher</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Bullet Point:
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={bulletText}
                onChange={(e) => setBulletText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
              />
              <button
                type="button"
                onClick={() => enhanceBullet(bulletText)}
                disabled={isLoading || !bulletText.trim()}
                className="px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition-colors shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Regenerate'}
              </button>
            </div>
            {role && <p className="text-[11px] text-slate-400 mt-1">Context: {role} {company ? `@ ${company}` : ''}</p>}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <p className="text-xs font-medium">Polishing with Google XYZ formula &amp; action verbs...</p>
            </div>
          )}

          {!isLoading && options.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select an enhanced version:
              </p>
              {options.map((opt, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {opt.category || 'Enhanced Option'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(opt.text, idx)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 text-xs"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          onSelectOption(opt.text);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                      >
                        Use in CV
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {opt.text}
                  </p>
                  {opt.explanation && (
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      💡 {opt.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ResumeData, ResumeDesignConfig } from '../../types/resume';
import { 
  SAMPLE_TECH_LEAD, 
  SAMPLE_PRODUCT_MANAGER, 
  SAMPLE_GRADUATE, 
  INITIAL_EMPTY_RESUME 
} from '../../data/sampleProfiles';
import { X, RotateCcw, Trash2, UserCheck, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onResetResume: (newData: ResumeData, resetDesign?: boolean) => void;
}

export const ResetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onResetResume,
}) => {
  const [resetDesignToo, setResetDesignToo] = useState(true);

  if (!isOpen) return null;

  const handleReset = (data: ResumeData) => {
    onResetResume(data, resetDesignToo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Reset App &amp; Resume / ऐप रीसेट करें
              </h2>
              <p className="text-xs text-slate-500">
                Choose how you want to reset your resume data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-150 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Reset Confirmation:</span>
              <p className="text-amber-800 mt-0.5">
                Reset karne se current changes replace ho jayenge. Aap blank CV ya kisi demo profile ke sath shuru kar sakte hain.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700 block">
              Select Reset Option:
            </span>

            {/* Option 1: Completely Blank */}
            <button
              type="button"
              onClick={() => handleReset(INITIAL_EMPTY_RESUME)}
              className="w-full p-3.5 rounded-xl border-2 border-dashed border-rose-300 hover:border-rose-500 hover:bg-rose-50/50 text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-rose-700">
                    Blank Resume (Fresh Start / खाली रेज़्यूमे)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700">
                    Empty Canvas
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sabhi purana data delete karega taaki aap apna naya CV step-by-step likh sakein.
                </p>
              </div>
            </button>

            {/* Option 2: Default Demo Profile */}
            <button
              type="button"
              onClick={() => handleReset(SAMPLE_TECH_LEAD)}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                    Default Demo: Lead Software Engineer &amp; Architect
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">
                    Recommended Demo
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rishi ka complete sample resume (React 19, Node.js, AWS Cloud, AI APIs) load karega.
                </p>
              </div>
            </button>

            {/* Option 3: Product Manager */}
            <button
              type="button"
              onClick={() => handleReset(SAMPLE_PRODUCT_MANAGER)}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-teal-700">
                    Demo: Lead Product Manager
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-700">
                    Product / Business
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Elena Rostova ka Product Management resume (Metrics, Strategy, Roadmaps).
                </p>
              </div>
            </button>

            {/* Option 4: Fresh Graduate */}
            <button
              type="button"
              onClick={() => handleReset(SAMPLE_GRADUATE)}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                    Demo: Recent CS Graduate
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-700">
                    Student / Entry-level
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jordan Patel ka University graduate resume (GPA, coursework, projects).
                </p>
              </div>
            </button>
          </div>

          {/* Reset Design Config Checkbox */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={resetDesignToo}
                onChange={(e) => setResetDesignToo(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Design &amp; Theme settings ko bhi default format me reset karein (Modern Executive + Navy)</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel / रद्द करें
          </button>
        </div>
      </div>
    </div>
  );
};

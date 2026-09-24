import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Layout, 
  Printer, 
  ShieldCheck, 
  Wand2, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartBlank: () => void;
  onLoadDemo: () => void;
}

export const HowItWorksModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onStartBlank,
  onLoadDemo,
}) => {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'hi' ? 'ऐप कैसे काम करेगा? (Step-by-Step Guide)' : 'How It Works (Step-by-Step Guide)'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'प्रोफेशनल और ATS-फ्रेंडली रेज़्यूमे बनाने की पूरी गाइड' : 'Complete guide to building ATS-ready resumes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="bg-slate-200/80 p-0.5 rounded-lg flex text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  lang === 'hi' ? 'bg-white shadow-2xs text-indigo-700' : 'text-slate-600'
                }`}
              >
                हिंदी / Hinglish
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  lang === 'en' ? 'bg-white shadow-2xs text-indigo-700' : 'text-slate-600'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Quick 5-Step Process */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {lang === 'hi' ? 'अपनी डिटेल्स भरें या AI से बनाएं' : 'Fill Details or Generate with AI'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'Left side editor me Personal Info, Work Experience, Education, Projects aur Skills add karein. Ya top header me "Generate with AI" button daba kar poora resume auto-generate karein.'
                  : 'Enter your personal info, experience, education, and skills in the left editor. Or click "Generate with AI" in the header to create a tailored resume in seconds.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {lang === 'hi' ? 'AI Polish & ATS Matcher' : 'AI Polish & ATS Job Matcher'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'Experience ke har bullet point par "Polish with AI" button hai jo strong action verbs aur metrics (% growth, numbers) add karta hai. "ATS Matcher" me job description paste karke match score dekhein.'
                  : 'Click "Polish with AI" on any bullet point to turn ordinary descriptions into strong STAR-method achievements. Use "ATS Matcher" to compare with real job posts.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {lang === 'hi' ? 'सेक्शन रीऑर्डर करें (Drag & Drop)' : 'Reorder Sections (Drag & Drop)'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'Top bar me "Reorder Sections" button ya resume sheet par hover karke ↑ / ↓ arrows se kisi bhi section (Experience, Education, Projects, Skills) ko upar-neeche shift karein.'
                  : 'Click "Reorder Sections" in the preview bar or hover directly over section titles on the resume sheet to move sections up or down.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {lang === 'hi' ? 'टेम्प्लेट और स्टाइल चुनें' : 'Choose Template & Styling'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'Top bar ya Design tab se 6 formats me se chunein: Modern Executive, Minimalist Swiss (ATS favorite), Serif Classic, Nordic Split, ya Tech Modern. Colors aur fonts customize karein.'
                  : 'Choose from 6 recruiter-tested templates: Modern Executive, Minimalist Swiss ATS, Serif Classic, Nordic Split, or Tech Modern, with custom colors and fonts.'}
              </p>
            </div>
          </div>

          {/* Step 5 Banner: Download & ATS Check */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-600" />
                {lang === 'hi' ? '5. Download PDF & Export' : '5. Download Clean PDF & Export'}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                ATS Optimized
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {lang === 'hi'
                ? 'Top-right corner me "Download PDF" par click karein. Ye print dialog open karega jahan se aap standard A4 size me bina kisi watermark ke crisp PDF save kar sakte hain. "Upload CV (PDF) & ATS Score" se apna pehle ka PDF check bhi kar sakte hain.'
                : 'Click "Download PDF" in the top-right corner to print or save a clean, watermark-free PDF ready for job applications. You can also upload your existing resume PDF to get an instant ATS score breakdown.'}
            </p>
          </div>

          {/* Reset App Tip */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <RotateCcw className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">
                {lang === 'hi' ? 'कभी भी रीसेट करें (Reset Feature):' : 'Reset Anytime:'}
              </span>
              <p className="text-slate-600 mt-0.5">
                {lang === 'hi'
                  ? 'Header me "Reset" button par click karke aap sabhi data ko ek click me khali (Blank) kar sakte hain ya ready-made Demo profile load kar sakte hain.'
                  : 'Click the "Reset" button in the header bar anytime to clear all data and start blank, or to switch between pre-built professional profiles.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onStartBlank();
                onClose();
              }}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              🗑️ {lang === 'hi' ? 'खाली शुरू करें (Start Blank)' : 'Start Blank Canvas'}
            </button>
            <button
              type="button"
              onClick={() => {
                onLoadDemo();
                onClose();
              }}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
            >
              📄 {lang === 'hi' ? 'डेमो प्रोफाइल लोड करें' : 'Load Demo Profile'}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            {lang === 'hi' ? 'समझ गया / Start Editing' : 'Got It, Let’s Start!'}
          </button>
        </div>
      </div>
    </div>
  );
};

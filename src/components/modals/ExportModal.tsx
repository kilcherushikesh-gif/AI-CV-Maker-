import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { X, Copy, Check, Download, Upload, FileText, FileJson } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onImportResume: (imported: ResumeData) => void;
}

export const ExportModal: React.FC<Props> = ({ isOpen, onClose, data, onImportResume }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate ATS plain text markdown format
  const generatePlainText = () => {
    let text = `${data.personalInfo.fullName.toUpperCase()}\n`;
    text += `${data.personalInfo.jobTitle}\n`;
    text += `${[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ')}\n`;
    if (data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) {
      text += `${[data.personalInfo.linkedin, data.personalInfo.github, data.personalInfo.website].filter(Boolean).join(' | ')}\n`;
    }
    text += `\n${'='.repeat(50)}\n`;

    if (data.summary) {
      text += `\nPROFESSIONAL SUMMARY\n${'-'.repeat(25)}\n${data.summary}\n`;
    }

    if (data.experiences && data.experiences.length > 0) {
      text += `\nPROFESSIONAL EXPERIENCE\n${'-'.repeat(25)}\n`;
      data.experiences.forEach((exp) => {
        text += `\n${exp.role} | ${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''}\n`;
        if (exp.bullets && exp.bullets.length > 0) {
          exp.bullets.forEach((b) => {
            text += `* ${b}\n`;
          });
        }
      });
    }

    if (data.skillCategories && data.skillCategories.length > 0) {
      text += `\nSKILLS & COMPETENCIES\n${'-'.repeat(25)}\n`;
      data.skillCategories.forEach((cat) => {
        text += `${cat.category}: ${cat.items.join(', ')}\n`;
      });
    }

    if (data.educations && data.educations.length > 0) {
      text += `\nEDUCATION\n${'-'.repeat(25)}\n`;
      data.educations.forEach((edu) => {
        text += `${edu.degree}, ${edu.field} | ${edu.school} (${edu.startDate} - ${edu.endDate})\n`;
      });
    }

    if (data.projects && data.projects.length > 0) {
      text += `\nPROJECTS\n${'-'.repeat(25)}\n`;
      data.projects.forEach((proj) => {
        text += `${proj.name} ${proj.role ? `(${proj.role})` : ''}\n`;
        text += `${proj.description}\n`;
        if (proj.technologies?.length) {
          text += `Tools: ${proj.technologies.join(', ')}\n`;
        }
      });
    }

    return text;
  };

  const plainText = generatePlainText();
  const jsonText = JSON.stringify(data, null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.personalInfo.fullName || 'Resume').toLowerCase().replace(/\s+/g, '-')}-cv.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo) {
          onImportResume(parsed);
          onClose();
        } else {
          setImportError('Invalid resume JSON format.');
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
              <Download className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base">Export &amp; Backup CV</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'text'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ATS Plain Text</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>JSON Backup &amp; Restore</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {importError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {importError}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Formatted text for online job portals (Workday, Greenhouse, Taleo) that require plain text copy-paste.
                </p>
                <button
                  onClick={() => handleCopy(plainText)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All Text'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={plainText}
                className="w-full font-mono text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:outline-hidden"
              />
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadJSON}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 text-left transition-all group"
                >
                  <Download className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-slate-900">Download .json File</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Save complete resume data locally to restore anytime</p>
                </button>

                <label className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 text-left transition-all cursor-pointer group">
                  <Upload className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-slate-900">Upload / Restore .json</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Load a previously downloaded resume JSON</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Raw JSON:</span>
                  <button
                    onClick={() => handleCopy(jsonText)}
                    className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Raw JSON</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={jsonText}
                  className="w-full font-mono text-[11px] p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

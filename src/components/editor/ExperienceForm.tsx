import React from 'react';
import { ExperienceItem } from '../../types/resume';
import { Plus, Trash2, Sparkles, ChevronUp, ChevronDown, Calendar, Building, Briefcase } from 'lucide-react';

interface Props {
  experiences: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
  onOpenPolishModal: (bullet: string, role: string, company: string, itemIdx: number, bulletIdx: number) => void;
}

export const ExperienceForm: React.FC<Props> = ({
  experiences,
  onChange,
  onOpenPolishModal,
}) => {
  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    onChange([newItem, ...experiences]);
  };

  const handleUpdateItem = (idx: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...experiences];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
    };
    onChange(updated);
  };

  const handleDeleteItem = (idx: number) => {
    onChange(experiences.filter((_, i) => i !== idx));
  };

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= experiences.length) return;
    const updated = [...experiences];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  const handleAddBullet = (expIdx: number) => {
    const updated = [...experiences];
    updated[expIdx].bullets.push('');
    onChange(updated);
  };

  const handleUpdateBullet = (expIdx: number, bulletIdx: number, val: string) => {
    const updated = [...experiences];
    updated[expIdx].bullets[bulletIdx] = val;
    onChange(updated);
  };

  const handleDeleteBullet = (expIdx: number, bulletIdx: number) => {
    const updated = [...experiences];
    updated[expIdx].bullets = updated[expIdx].bullets.filter((_, bI) => bI !== bulletIdx);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Work Experience ({experiences.length})</span>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {experiences.length === 0 && (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-xs text-slate-500 mb-2">No work experiences added yet.</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            + Add your first work experience
          </button>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((exp, expIdx) => (
          <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
            {/* Header controls */}
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <span className="font-bold text-xs text-slate-800">
                {exp.role || 'New Role'} {exp.company ? `@ ${exp.company}` : ''}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(expIdx, 'up')}
                  disabled={expIdx === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(expIdx, 'down')}
                  disabled={expIdx === experiences.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(expIdx)}
                  className="p-1 text-red-400 hover:text-red-600 ml-1"
                  title="Delete experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  <span>Job Title *</span>
                </label>
                <input
                  type="text"
                  required
                  value={exp.role}
                  onChange={(e) => handleUpdateItem(expIdx, 'role', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>Company / Organization *</span>
                </label>
                <input
                  type="text"
                  required
                  value={exp.company}
                  onChange={(e) => handleUpdateItem(expIdx, 'company', e.target.value)}
                  placeholder="e.g. Stripe, Acme Corp"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={(e) => handleUpdateItem(expIdx, 'location', e.target.value)}
                  placeholder="e.g. San Francisco, CA (Remote)"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Dates</span>
                  </label>
                  <label className="text-[11px] text-slate-600 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleUpdateItem(expIdx, 'current', e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Present role</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleUpdateItem(expIdx, 'startDate', e.target.value)}
                    placeholder="Start (e.g. 2021-03)"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    disabled={exp.current}
                    value={exp.current ? 'Present' : exp.endDate}
                    onChange={(e) => handleUpdateItem(expIdx, 'endDate', e.target.value)}
                    placeholder="End (e.g. 2023-11)"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Bullet Points &amp; Achievements:
                </span>
                <button
                  type="button"
                  onClick={() => handleAddBullet(expIdx)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Bullet</span>
                </button>
              </div>

              {exp.bullets.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="flex items-start gap-1.5">
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(expIdx, bulletIdx, e.target.value)}
                    placeholder="Quantified outcome (e.g. Reduced AWS database query latency by 45% using Redis caching...)"
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => onOpenPolishModal(bullet, exp.role, exp.company, expIdx, bulletIdx)}
                    className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs shrink-0 transition-colors shadow-2xs"
                    title="Polish with AI"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBullet(expIdx, bulletIdx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 shrink-0"
                    title="Remove bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

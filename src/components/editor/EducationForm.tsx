import React from 'react';
import { EducationItem } from '../../types/resume';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface Props {
  educations: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationForm: React.FC<Props> = ({ educations, onChange }) => {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      field: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
    };
    onChange([...educations, newItem]);
  };

  const handleUpdate = (idx: number, field: keyof EducationItem, val: string) => {
    const updated = [...educations];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const handleDelete = (idx: number) => {
    onChange(educations.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Education ({educations.length})</span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-3">
        {educations.map((edu, idx) => (
          <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                {edu.degree || 'Degree / Qualification'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree *</label>
                <input
                  type="text"
                  required
                  value={edu.degree}
                  onChange={(e) => handleUpdate(idx, 'degree', e.target.value)}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleUpdate(idx, 'field', e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">University / Institution *</label>
                <input
                  type="text"
                  required
                  value={edu.school}
                  onChange={(e) => handleUpdate(idx, 'school', e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Dates</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleUpdate(idx, 'startDate', e.target.value)}
                    placeholder="Start (2018)"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleUpdate(idx, 'endDate', e.target.value)}
                    placeholder="Graduation (2022)"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">GPA (Optional)</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => handleUpdate(idx, 'gpa', e.target.value)}
                  placeholder="e.g. 3.9 / 4.0"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Honors / Awards (Optional)</label>
                <input
                  type="text"
                  value={edu.honors || ''}
                  onChange={(e) => handleUpdate(idx, 'honors', e.target.value)}
                  placeholder="e.g. Magna Cum Laude, Dean's List"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

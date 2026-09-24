import React from 'react';
import { LanguageItem } from '../../types/resume';
import { Plus, Trash2, Globe } from 'lucide-react';

interface Props {
  languages: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

export const LanguagesForm: React.FC<Props> = ({ languages, onChange }) => {
  const handleAdd = () => {
    const newItem: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Professional',
    };
    onChange([...languages, newItem]);
  };

  const handleUpdate = (idx: number, field: keyof LanguageItem, val: any) => {
    const updated = [...languages];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const handleDelete = (idx: number) => {
    onChange(languages.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Languages ({languages.length})</span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Language</span>
        </button>
      </div>

      <div className="space-y-2">
        {languages.map((l, idx) => (
          <div key={l.id} className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <input
              type="text"
              placeholder="Language (e.g. English, Spanish, Mandarin)"
              value={l.language}
              onChange={(e) => handleUpdate(idx, 'language', e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <select
              value={l.proficiency}
              onChange={(e) => handleUpdate(idx, 'proficiency', e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Professional">Professional</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            <button
              type="button"
              onClick={() => handleDelete(idx)}
              className="text-slate-400 hover:text-red-500 p-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

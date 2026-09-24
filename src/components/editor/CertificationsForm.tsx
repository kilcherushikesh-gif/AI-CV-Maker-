import React from 'react';
import { CertificationItem } from '../../types/resume';
import { Plus, Trash2, Award } from 'lucide-react';

interface Props {
  certifications: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}

export const CertificationsForm: React.FC<Props> = ({ certifications, onChange }) => {
  const handleAdd = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      link: '',
    };
    onChange([...certifications, newItem]);
  };

  const handleUpdate = (idx: number, field: keyof CertificationItem, val: string) => {
    const updated = [...certifications];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const handleDelete = (idx: number) => {
    onChange(certifications.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Certifications ({certifications.length})</span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="space-y-3">
        {certifications.map((c, idx) => (
          <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {c.name || 'Certification Name'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Certification Name *"
                  value={c.name}
                  onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Issuing Organization *"
                  value={c.issuer}
                  onChange={(e) => handleUpdate(idx, 'issuer', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Issue Date (e.g. 2023-09)"
                  value={c.issueDate}
                  onChange={(e) => handleUpdate(idx, 'issueDate', e.target.value)}
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

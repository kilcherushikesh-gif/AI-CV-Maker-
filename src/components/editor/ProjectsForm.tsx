import React from 'react';
import { ProjectItem } from '../../types/resume';
import { Plus, Trash2, FolderGit2, ExternalLink } from 'lucide-react';

interface Props {
  projects: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsForm: React.FC<Props> = ({ projects, onChange }) => {
  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      role: '',
      link: '',
      technologies: [],
      description: '',
      bullets: [],
    };
    onChange([...projects, newItem]);
  };

  const handleUpdate = (idx: number, field: keyof ProjectItem, val: any) => {
    const updated = [...projects];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const handleDelete = (idx: number) => {
    onChange(projects.filter((_, i) => i !== idx));
  };

  const handleTechChange = (idx: number, raw: string) => {
    const techs = raw.split(',').map((s) => s.trim()).filter(Boolean);
    handleUpdate(idx, 'technologies', techs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Projects &amp; Portfolio ({projects.length})</span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                {proj.name || 'New Project'}
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
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={proj.name}
                  onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                  placeholder="e.g. Distributed Task Orchestrator"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Live Demo / Repository URL</label>
                <input
                  type="text"
                  value={proj.link || ''}
                  onChange={(e) => handleUpdate(idx, 'link', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={proj.technologies?.join(', ') || ''}
                  onChange={(e) => handleTechChange(idx, e.target.value)}
                  placeholder="e.g. React, Node.js, WebSockets, Redis"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Brief Description &amp; Impact</label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => handleUpdate(idx, 'description', e.target.value)}
                  placeholder="Engineered high-throughput queue handler with sub-millisecond task dispatching..."
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

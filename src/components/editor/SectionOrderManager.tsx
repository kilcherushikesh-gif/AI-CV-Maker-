import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Code2, 
  Award, 
  Globe, 
  FileText, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

interface Props {
  data: ResumeData;
  onChangeOrder: (newOrder: string[]) => void;
  className?: string;
}

export interface SectionMetadata {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  description: string;
}

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experiences',
  'educations',
  'projects',
  'skills',
  'certifications',
  'languages',
];

export const normalizeSectionId = (id: string): string => {
  if (id === 'experience') return 'experiences';
  if (id === 'education') return 'educations';
  if (id === 'project') return 'projects';
  if (id === 'skill' || id === 'skillCategories') return 'skills';
  if (id === 'certification') return 'certifications';
  if (id === 'language') return 'languages';
  return id;
};

export const SectionOrderManager: React.FC<Props> = ({
  data,
  onChangeOrder,
  className = '',
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Normalize current order from data, ensuring all essential sections exist
  const rawOrder = (data.sectionOrder && data.sectionOrder.length > 0)
    ? data.sectionOrder.map(normalizeSectionId)
    : DEFAULT_SECTION_ORDER;

  // Deduplicate and ensure standard sections are present
  const currentOrder = Array.from(new Set([...rawOrder, ...DEFAULT_SECTION_ORDER]));

  const getSectionMetadata = (sectionId: string): SectionMetadata => {
    switch (sectionId) {
      case 'summary':
        return {
          id: 'summary',
          label: 'Executive Summary',
          icon: FileText,
          description: data.summary ? '1 professional statement' : 'Empty',
        };
      case 'experiences':
        return {
          id: 'experiences',
          label: 'Work Experience',
          icon: Briefcase,
          count: data.experiences?.length || 0,
          description: `${data.experiences?.length || 0} position${(data.experiences?.length || 0) === 1 ? '' : 's'}`,
        };
      case 'educations':
        return {
          id: 'educations',
          label: 'Education & Degrees',
          icon: GraduationCap,
          count: data.educations?.length || 0,
          description: `${data.educations?.length || 0} credential${(data.educations?.length || 0) === 1 ? '' : 's'}`,
        };
      case 'projects':
        return {
          id: 'projects',
          label: 'Projects & Portfolio',
          icon: FolderGit2,
          count: data.projects?.length || 0,
          description: `${data.projects?.length || 0} project${(data.projects?.length || 0) === 1 ? '' : 's'}`,
        };
      case 'skills':
        return {
          id: 'skills',
          label: 'Core Skills & Competencies',
          icon: Code2,
          count: data.skillCategories?.reduce((acc, c) => acc + c.items.length, 0) || 0,
          description: `${data.skillCategories?.length || 0} categories`,
        };
      case 'certifications':
        return {
          id: 'certifications',
          label: 'Certifications & Licenses',
          icon: Award,
          count: data.certifications?.length || 0,
          description: `${data.certifications?.length || 0} certificate${(data.certifications?.length || 0) === 1 ? '' : 's'}`,
        };
      case 'languages':
        return {
          id: 'languages',
          label: 'Languages',
          icon: Globe,
          count: data.languages?.length || 0,
          description: `${data.languages?.length || 0} language${(data.languages?.length || 0) === 1 ? '' : 's'}`,
        };
      default:
        return {
          id: sectionId,
          label: sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
          icon: Layers,
          description: 'Custom Section',
        };
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...currentOrder];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    onChangeOrder(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const updated = [...currentOrder];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChangeOrder(updated);
  };

  const applyPreset = (preset: 'experience-first' | 'education-first' | 'projects-first') => {
    let newOrder: string[];
    if (preset === 'education-first') {
      newOrder = ['summary', 'educations', 'experiences', 'projects', 'skills', 'certifications', 'languages'];
    } else if (preset === 'projects-first') {
      newOrder = ['summary', 'projects', 'experiences', 'skills', 'educations', 'certifications', 'languages'];
    } else {
      // experience-first
      newOrder = ['summary', 'experiences', 'skills', 'projects', 'educations', 'certifications', 'languages'];
    }
    onChangeOrder(newOrder);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header and Quick Preset Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Customize Section Vertical Order</span>
          </div>
          <button
            type="button"
            onClick={() => onChangeOrder(DEFAULT_SECTION_ORDER)}
            className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset to default order"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Drag and drop sections to change how they appear on your resume. You can also use the up/down arrows.
        </p>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => applyPreset('experience-first')}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <Briefcase className="w-3 h-3 text-indigo-500" />
            <span>Experience First</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('education-first')}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <GraduationCap className="w-3 h-3 text-emerald-500" />
            <span>Education First (MBA / Fresh Grad)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('projects-first')}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <FolderGit2 className="w-3 h-3 text-amber-500" />
            <span>Projects First</span>
          </button>
        </div>
      </div>

      {/* Draggable List */}
      <div className="space-y-1.5 bg-slate-50/70 p-2 rounded-xl border border-slate-200/80">
        {currentOrder.map((sectionId, idx) => {
          const meta = getSectionMetadata(sectionId);
          const IconComp = meta.icon;
          const isDragging = draggedIndex === idx;
          const isOver = dragOverIndex === idx;

          return (
            <div
              key={sectionId}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`group flex items-center justify-between p-2.5 rounded-lg border transition-all select-none cursor-grab active:cursor-grabbing ${
                isDragging
                  ? 'opacity-40 bg-indigo-50 border-indigo-300 scale-98'
                  : isOver
                  ? 'border-indigo-500 ring-2 ring-indigo-200 bg-white shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              {/* Grip and Section Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0">
                  <GripVertical className="w-4 h-4" />
                </span>
                
                <span className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors">
                  <IconComp className="w-3.5 h-3.5" />
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-normal">
                    {meta.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Move Up & Move Down */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(idx, 'up');
                  }}
                  className={`p-1 rounded transition-colors ${
                    idx === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                  }`}
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={idx === currentOrder.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(idx, 'down');
                  }}
                  className={`p-1 rounded transition-colors ${
                    idx === currentOrder.length - 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                  }`}
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

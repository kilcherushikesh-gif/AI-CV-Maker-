import React, { useState } from 'react';
import { SkillCategory } from '../../types/resume';
import { Plus, Trash2, X, Sparkles, Loader2, Check } from 'lucide-react';

interface Props {
  skillCategories: SkillCategory[];
  jobTitle?: string;
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<Props> = ({ skillCategories, jobTitle, onChange }) => {
  const [newTagInput, setNewTagInput] = useState<{ [catId: string]: string }>({});
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<{ category: string; skills: string[] }[]>([]);
  const [addedSkillsMap, setAddedSkillsMap] = useState<{ [skill: string]: boolean }>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      category: 'New Category',
      items: [],
    };
    onChange([...skillCategories, newCat]);
  };

  const handleUpdateCategoryTitle = (idx: number, newTitle: string) => {
    const updated = [...skillCategories];
    updated[idx].category = newTitle;
    onChange(updated);
  };

  const handleDeleteCategory = (idx: number) => {
    onChange(skillCategories.filter((_, i) => i !== idx));
  };

  const handleAddTag = (catIdx: number, catId: string) => {
    const tag = (newTagInput[catId] || '').trim();
    if (!tag) return;
    const updated = [...skillCategories];
    if (!updated[catIdx].items.includes(tag)) {
      updated[catIdx].items.push(tag);
      onChange(updated);
    }
    setNewTagInput({ ...newTagInput, [catId]: '' });
  };

  const handleDeleteTag = (catIdx: number, tagIdx: number) => {
    const updated = [...skillCategories];
    updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== tagIdx);
    onChange(updated);
  };

  const handleSuggestSkills = async () => {
    setIsSuggesting(true);
    setSuggestedCategories([]);
    try {
      const allCurrentSkills = skillCategories.flatMap((c) => c.items);
      const res = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: jobTitle || 'Software Engineer',
          existingSkills: allCurrentSkills,
        }),
      });
      const data = await res.json();
      if (data.categories) {
        setSuggestedCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddSuggestedSkill = (skill: string) => {
    if (skillCategories.length === 0) {
      handleAddCategory();
    }
    // Add to the first category by default
    const updated = [...skillCategories];
    if (updated.length > 0) {
      if (!updated[0].items.includes(skill)) {
        updated[0].items.push(skill);
        onChange(updated);
      }
    }
    setAddedSkillsMap((prev) => ({ ...prev, [skill]: true }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Skills &amp; Competencies</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSuggestSkills}
            disabled={isSuggesting}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shadow-2xs"
          >
            {isSuggesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span>✨ AI Suggest Skills</span>
          </button>
          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      {/* Suggested Skills Tray */}
      {suggestedCategories.length > 0 && (
        <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">
              AI In-Demand Skill Recommendations for {jobTitle || 'Your Role'}:
            </span>
            <button
              onClick={() => setSuggestedCategories([])}
              className="text-[11px] text-slate-400 hover:text-slate-600"
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedCategories.flatMap((c) => c.skills).map((skill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSuggestedSkill(skill)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                  addedSkillsMap[skill]
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-white hover:bg-indigo-100 text-slate-700 border-indigo-200'
                }`}
              >
                {addedSkillsMap[skill] ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-indigo-600" />}
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {skillCategories.map((cat, catIdx) => (
          <div key={cat.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={cat.category}
                onChange={(e) => handleUpdateCategoryTitle(catIdx, e.target.value)}
                placeholder="Category Name (e.g. Programming Languages)"
                className="font-bold text-xs text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden px-1 py-0.5"
              />
              <button
                type="button"
                onClick={() => handleDeleteCategory(catIdx)}
                className="p-1 text-slate-400 hover:text-red-500"
                title="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item, tagIdx) => (
                <span
                  key={tagIdx}
                  className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-xs font-medium"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(catIdx, tagIdx)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput[cat.id] || ''}
                onChange={(e) => setNewTagInput({ ...newTagInput, [cat.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(catIdx, cat.id);
                  }
                }}
                placeholder="Type a skill and press Enter..."
                className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleAddTag(catIdx, cat.id)}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

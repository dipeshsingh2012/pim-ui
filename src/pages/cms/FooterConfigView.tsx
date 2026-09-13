import React, { useState, useEffect } from 'react';
import {
  Footprints,
  Plus,
  Trash2,
  Save,
  Coffee,
  ExternalLink,
} from 'lucide-react';
import { FooterConfig, FooterColumn, FooterLink } from '../../types/cms';
import { saveFooter as apiSaveFooter } from '../../providers/cmsDataProvider';

interface FooterConfigViewProps {
  footer: FooterConfig;
  onUpdateFooter: (updated: FooterConfig) => void;
  showToast: (msg: string) => void;
}

export function FooterConfigView({
  footer,
  onUpdateFooter,
  showToast,
}: FooterConfigViewProps) {
  const [localFooter, setLocalFooter] = useState<FooterConfig>(footer);

  useEffect(() => {
    setLocalFooter(footer);
  }, [footer]);

  const handleSaveFooter = async () => {
    await apiSaveFooter(localFooter);
    onUpdateFooter(localFooter);
    showToast('Footer configuration saved');
  };

  // Column operations
  const handleAddColumn = () => {
    const newCol: FooterColumn = {
      id: `col_${Date.now()}`,
      title: 'New Column',
      links: [{ label: 'New Link', url: '#/' }],
    };
    setLocalFooter({ ...localFooter, columns: [...localFooter.columns, newCol] });
  };

  const handleRemoveColumn = (colId: string) => {
    setLocalFooter({
      ...localFooter,
      columns: localFooter.columns.filter((c) => c.id !== colId),
    });
  };

  const handleUpdateColumnTitle = (colId: string, title: string) => {
    const updated = localFooter.columns.map((c) => (c.id === colId ? { ...c, title } : c));
    setLocalFooter({ ...localFooter, columns: updated });
  };

  const handleAddLink = (colId: string) => {
    const updated = localFooter.columns.map((c) => {
      if (c.id === colId) {
        return {
          ...c,
          links: [...c.links, { label: 'New Link', url: '#/' }],
        };
      }
      return c;
    });
    setLocalFooter({ ...localFooter, columns: updated });
  };

  const handleUpdateLink = (colId: string, linkIdx: number, field: keyof FooterLink, val: any) => {
    const updated = localFooter.columns.map((c) => {
      if (c.id === colId) {
        const newLinks = c.links.map((l, i) => (i === linkIdx ? { ...l, [field]: val } : l));
        return { ...c, links: newLinks };
      }
      return c;
    });
    setLocalFooter({ ...localFooter, columns: updated });
  };

  const handleRemoveLink = (colId: string, linkIdx: number) => {
    const updated = localFooter.columns.map((c) => {
      if (c.id === colId) {
        return { ...c, links: c.links.filter((_, i) => i !== linkIdx) };
      }
      return c;
    });
    setLocalFooter({ ...localFooter, columns: updated });
  };

  return (
    <div className="space-y-6">
      {/* Live Store Footer Preview */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live Store Footer Preview
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {localFooter.columns.length} Columns Configured
          </span>
        </div>

        <div className="p-6 bg-stone-950 text-stone-300 rounded-xl border border-stone-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-stone-800/80">
            {/* Brand column */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <div className="w-6 h-6 rounded bg-amber-800 flex items-center justify-center text-xs">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                <span>{localFooter.brand_name || 'Brand Name'}</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">{localFooter.brand_description}</p>
            </div>

            {/* Configured navigation columns */}
            {localFooter.columns.map((col) => (
              <div key={col.id} className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  {col.title}
                </div>
                <div className="space-y-1">
                  {col.links.map((link, i) => (
                    <div key={i} className="text-xs text-stone-400 hover:text-amber-400 cursor-default">
                      {link.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>{localFooter.copyright}</div>
            <div className="flex items-center gap-4">
              {localFooter.social_links.map((s, idx) => (
                <span key={idx} className="hover:text-stone-300 cursor-default">
                  {s.platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding & Basic Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Footer Identity & Copyright</h3>
            <p className="text-xs text-slate-500">Brand statement, copyright notice, and newsletter signup.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveFooter}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Footer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
            <input
              type="text"
              value={localFooter.brand_name}
              onChange={(e) => setLocalFooter({ ...localFooter, brand_name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Line</label>
            <input
              type="text"
              value={localFooter.copyright}
              onChange={(e) => setLocalFooter({ ...localFooter, copyright: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Brand Description / Mission</label>
          <textarea
            rows={2}
            value={localFooter.brand_description}
            onChange={(e) => setLocalFooter({ ...localFooter, brand_description: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={localFooter.show_newsletter}
              onChange={(e) => setLocalFooter({ ...localFooter, show_newsletter: e.target.checked })}
              className="accent-amber-700 w-4 h-4 cursor-pointer"
            />
            <span>Show Newsletter Subscription Box</span>
          </label>
        </div>
      </div>

      {/* Multi-Column Footer Links Manager */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Footer Columns & Link Stacks</h3>
            <p className="text-xs text-slate-500">
              Manage navigational groupings for shop categories, customer care, and legal policies.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddColumn}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {localFooter.columns.map((col) => (
            <div
              key={col.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={col.title}
                  onChange={(e) => handleUpdateColumnTitle(col.id, e.target.value)}
                  placeholder="Column Title"
                  className="font-bold text-xs text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex-1 focus:outline-hidden focus:border-amber-700"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColumn(col.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  title="Remove Column"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {col.links.map((link, linkIdx) => (
                  <div key={linkIdx} className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink(col.id, linkIdx, 'label', e.target.value)}
                      placeholder="Label"
                      className="text-xs text-slate-800 w-1/2 px-1.5 py-1 rounded border border-slate-100 focus:outline-hidden focus:border-amber-700"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(col.id, linkIdx, 'url', e.target.value)}
                      placeholder="URL"
                      className="text-xs font-mono text-slate-600 w-1/2 px-1.5 py-1 rounded border border-slate-100 focus:outline-hidden focus:border-amber-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(col.id, linkIdx)}
                      className="text-slate-300 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleAddLink(col.id)}
                className="w-full py-1.5 text-[11px] font-bold text-slate-600 hover:text-amber-800 bg-white hover:bg-slate-100 rounded-lg border border-dashed border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Link</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Globe,
  Sliders,
  Layers,
  Eye,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Save,
} from 'lucide-react';
import {
  getGlobalShell,
  saveGlobalShell,
  getCmsPages,
  saveCmsPage,
  createCmsPage,
  deleteCmsPage,
  resetCmsDefaults,
} from '../../providers/cmsDataProvider';
import { CMSPage, GlobalShellConfig } from '../../types/cms';
import { PagesBuilderView } from './PagesBuilderView';
import { SiteShellView } from './SiteShellView';
import { StorefrontPreviewModal } from './StorefrontPreviewModal';
import { LaneList } from '../lanes/list';

export function CmsStudio() {
  const [activeSubTab, setActiveSubTab] = useState<'pages' | 'shell' | 'lanes'>('pages');
  const [shell, setShell] = useState<GlobalShellConfig>(getGlobalShell());
  const [pages, setPages] = useState<CMSPage[]>(getCmsPages());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<CMSPage | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setShell(getGlobalShell());
    setPages(getCmsPages());
  }, []);

  const handleUpdateShell = (updated: GlobalShellConfig) => {
    saveGlobalShell(updated);
    setShell(updated);
  };

  const handleUpdatePage = (updatedPage: CMSPage) => {
    saveCmsPage(updatedPage);
    setPages(getCmsPages());
  };

  const handleCreatePage = (pageData: Omit<CMSPage, 'id' | 'updated_at'>) => {
    const created = createCmsPage(pageData);
    setPages(getCmsPages());
    return created;
  };

  const handleDeletePage = (id: string) => {
    deleteCmsPage(id);
    setPages(getCmsPages());
  };

  const handleOpenPreview = (page?: CMSPage) => {
    setPreviewPage(page || pages[0]);
    setPreviewOpen(true);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all CMS pages, section layouts, and site shell settings to showcase defaults?')) {
      const { shell: defaultShell, pages: defaultPages } = resetCmsDefaults();
      setShell(defaultShell);
      setPages(defaultPages);
      showToast('Reset all CMS layouts to showcase defaults');
    }
  };

  const handleSaveAll = () => {
    saveGlobalShell(shell);
    pages.forEach((p) => saveCmsPage(p));
    showToast('All CMS changes saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* CMS Studio Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              EXPERIENCE CMS STUDIO
            </span>
            <span className="text-xs text-slate-400 font-medium">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Page Builder & Storefront Chrome
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Storefront Experience Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Configure site-wide promo banners, multi-level navigation trees, footers, and modular page sections (hero banners, category grids, product carousels, testimonials).
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            title="Reset to showcase defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All CMS</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPreview()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Storefront</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('pages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'pages'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Pages & Section Stacks ({pages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('shell')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'shell'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Site Shell (Promo, Header, Footer)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('lanes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'lanes'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Lanes & Collections Library</span>
        </button>
      </div>

      {/* Active Sub-Tab View */}
      {activeSubTab === 'pages' && (
        <PagesBuilderView
          pages={pages}
          onUpdatePage={handleUpdatePage}
          onCreatePage={handleCreatePage}
          onDeletePage={handleDeletePage}
          onPreviewStorefront={handleOpenPreview}
          showToast={showToast}
        />
      )}

      {activeSubTab === 'shell' && (
        <SiteShellView
          shell={shell}
          onUpdateShell={handleUpdateShell}
          showToast={showToast}
        />
      )}

      {activeSubTab === 'lanes' && <LaneList />}

      {/* Live Storefront Preview Modal */}
      <StorefrontPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        page={previewPage || pages[0]}
        shell={shell}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}


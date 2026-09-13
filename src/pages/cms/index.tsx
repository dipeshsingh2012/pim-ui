import React, { useState, useEffect } from 'react';
import {
  Layout,
  PanelTop,
  Footprints,
  Menu,
  Layers,
  Palette,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  getGlobalShell,
  fetchGlobalShell,
  saveGlobalShell,
  getCmsPages,
  fetchCmsPages,
  saveCmsPage,
  createCmsPage,
  deleteCmsPage,
  syncProductPagesWithCatalog,
} from '../../providers/cmsDataProvider';
import { dataProvider } from '../../providers/dataProvider';
import { CMSPage, GlobalShellConfig } from '../../types/cms';
import { Product } from '../../types/product';
import { PagesListView } from './PagesListView';
import { HeaderConfigView } from './HeaderConfigView';
import { FooterConfigView } from './FooterConfigView';
import { NavigationConfigView } from './NavigationConfigView';
import { SectionsBuilderView } from './SectionsBuilderView';
import { ThemeConfigView } from './ThemeConfigView';
import { StorePreviewModal } from './StorePreviewModal';

export type CmsStudioTab = 'pages' | 'header' | 'footer' | 'navigation' | 'sections' | 'themes';

export function CmsStudio() {
  const [activeSubTab, setActiveSubTab] = useState<CmsStudioTab>('pages');
  const [shell, setShell] = useState<GlobalShellConfig>(getGlobalShell());
  const [pages, setPages] = useState<CMSPage[]>(() => getCmsPages());
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || '');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<CMSPage | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [loadedShell, loadedPages, productsRes] = await Promise.all([
          fetchGlobalShell(),
          fetchCmsPages(),
          dataProvider.getList({ resource: 'products', pagination: { currentPage: 1, pageSize: 100 } }).catch(() => ({ data: [] })),
        ]);
        if (mounted) {
          const catalogProducts = (productsRes.data || []) as Product[];
          const finalPages = syncProductPagesWithCatalog(loadedPages, catalogProducts);
          setShell(loadedShell);
          setPages(finalPages);
          if (finalPages.length > 0 && !selectedPageId) {
            setSelectedPageId(finalPages[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed loading CMS data from content-service:', err);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdateShell = async (updated: GlobalShellConfig) => {
    setShell(updated);
    await saveGlobalShell(updated);
  };

  const handleUpdatePage = async (updatedPage: CMSPage) => {
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
    await saveCmsPage(updatedPage);
  };

  const handleCreatePage = async (pageData: Omit<CMSPage, 'id' | 'updated_at'>) => {
    const created = await createCmsPage(pageData);
    setPages((prev) => [...prev, created]);
    setSelectedPageId(created.id);
    return created;
  };

  const handleDeletePage = async (id: string) => {
    const remaining = pages.filter((p) => p.id !== id);
    setPages(remaining);
    if (selectedPageId === id && remaining.length > 0) {
      setSelectedPageId(remaining[0].id);
    }
    await deleteCmsPage(id);
  };

  const handleOpenPreview = (page?: CMSPage) => {
    setPreviewPage(page || pages.find((p) => p.id === selectedPageId) || pages[0]);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 5 Simplified Top-Level Tabs: Pages -> Header -> Footer -> Navigation -> Sections */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Tab 1: Pages */}
          <button
            type="button"
            onClick={() => setActiveSubTab('pages')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'pages'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Pages</span>
          </button>

          {/* Tab 2: Header */}
          <button
            type="button"
            onClick={() => setActiveSubTab('header')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'header'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PanelTop className="w-4 h-4" />
            <span>Header</span>
          </button>

          {/* Tab 3: Footer */}
          <button
            type="button"
            onClick={() => setActiveSubTab('footer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'footer'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Footer</span>
          </button>

          {/* Tab 4: Navigation */}
          <button
            type="button"
            onClick={() => setActiveSubTab('navigation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'navigation'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>Navigation</span>
          </button>

          {/* Tab 5: Sections */}
          <button
            type="button"
            onClick={() => setActiveSubTab('sections')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'sections'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sections</span>
          </button>

          {/* Tab 6: Themes & Styling */}
          <button
            type="button"
            onClick={() => setActiveSubTab('themes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'themes'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Themes & Styling</span>
          </button>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenPreview()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Store</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Pages */}
      {activeSubTab === 'pages' && (
        <PagesListView
          pages={pages}
          onUpdatePage={handleUpdatePage}
          onCreatePage={handleCreatePage}
          onDeletePage={handleDeletePage}
          onSelectPageForSections={(pageId) => {
            setSelectedPageId(pageId);
            setActiveSubTab('sections');
          }}
          onPreviewStore={handleOpenPreview}
          showToast={showToast}
        />
      )}

      {/* Tab 2: Header */}
      {activeSubTab === 'header' && (
        <HeaderConfigView
          header={shell.header}
          promo={shell.promo_bar}
          onUpdateHeader={(updated) => handleUpdateShell({ ...shell, header: updated })}
          onUpdatePromo={(updated) => handleUpdateShell({ ...shell, promo_bar: updated })}
          showToast={showToast}
        />
      )}

      {/* Tab 3: Footer */}
      {activeSubTab === 'footer' && (
        <FooterConfigView
          footer={shell.footer}
          onUpdateFooter={(updated) => handleUpdateShell({ ...shell, footer: updated })}
          showToast={showToast}
        />
      )}

      {/* Tab 4: Navigation */}
      {activeSubTab === 'navigation' && (
        <NavigationConfigView
          header={shell.header}
          onUpdateHeader={(updated) => handleUpdateShell({ ...shell, header: updated })}
          showToast={showToast}
        />
      )}

      {/* Tab 5: Sections */}
      {activeSubTab === 'sections' && (
        <SectionsBuilderView
          pages={pages}
          selectedPageId={selectedPageId || pages[0]?.id || ''}
          onSelectPageId={setSelectedPageId}
          onUpdatePage={handleUpdatePage}
          onPreviewStore={handleOpenPreview}
          showToast={showToast}
        />
      )}

      {/* Tab 6: Themes & Styling */}
      {activeSubTab === 'themes' && (
        <ThemeConfigView
          shell={shell}
          onUpdateShellTheme={(updatedTheme) => handleUpdateShell({ ...shell, theme: updatedTheme })}
          showToast={showToast}
        />
      )}

      {/* Live Store Preview Modal */}
      <StorePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        page={previewPage || pages.find((p) => p.id === selectedPageId) || pages[0]}
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

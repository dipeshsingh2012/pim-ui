import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { CMSPage, PageType } from '../../types/cms';

interface PagesListViewProps {
  pages: CMSPage[];
  onUpdatePage: (page: CMSPage) => void;
  onCreatePage: (pageData: Omit<CMSPage, 'id' | 'updated_at'>) => Promise<CMSPage | void> | void;
  onDeletePage: (id: string) => void;
  onSelectPageForSections: (pageId: string) => void;
  onPreviewStore?: (page: CMSPage) => void;
  showToast: (msg: string) => void;
}

export const ALLOWED_PAGE_TYPES: {
  type: 'collection' | 'static';
  label: string;
  icon: string;
  description: string;
  defaultSlug: string;
}[] = [
  {
    type: 'collection',
    label: 'Collection Page (PLP)',
    icon: '☕',
    description: 'Category product listing and filter grid',
    defaultSlug: '/collections/featured',
  },
  {
    type: 'static',
    label: 'Static Page',
    icon: '📄',
    description: 'Story manifesto, brewing guides, and legal pages',
    defaultSlug: '/about',
  },
];

export const CREATABLE_PAGE_TYPES = ALLOWED_PAGE_TYPES;

export const PAGE_TYPE_LABELS: Record<PageType, { label: string; icon: string }> = {
  home: { label: 'Homepage', icon: '🏠' },
  product: { label: 'Product Page', icon: '📦' },
  collection: { label: 'Collection Page', icon: '☕' },
  static: { label: 'Static Page', icon: '📄' },
  discovery: { label: 'Discovery Experience', icon: '🧭' },
};

export function PagesListView({
  pages,
  onUpdatePage,
  onCreatePage,
  onDeletePage,
  onSelectPageForSections,
  onPreviewStore,
  showToast,
}: PagesListViewProps) {
  const handlePreview = (p: CMSPage) => {
    if (onPreviewStore) onPreviewStore(p);
  };

  const [filterType, setFilterType] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);

  // New Page Form State
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('/collections/featured');
  const [newPageType, setNewPageType] = useState<'collection' | 'static'>('collection');
  const [newPageDescription, setNewPageDescription] = useState('');

  // Edit Page Form State
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPublished, setEditPublished] = useState(true);

  const productCount = pages.filter((p) => p.page_type === 'product').length;
  const collectionCount = pages.filter((p) => p.page_type === 'collection').length;
  const staticCount = pages.filter((p) => p.page_type === 'static' || p.page_type === 'discovery').length;

  const filterTabs = [
    { type: 'home', label: 'Homepage', icon: '🏠' },
    { type: 'product', label: 'Product Pages', icon: '📦', count: productCount },
    { type: 'collection', label: 'Collections', icon: '☕', count: collectionCount },
    { type: 'static', label: 'Content & Static', icon: '📄', count: staticCount },
  ];

  const filteredPages = pages.filter((p) => {
    if (filterType === 'static') {
      if (p.page_type !== 'static' && p.page_type !== 'discovery') return false;
    } else if (p.page_type !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) return;

    const formattedSlug = newPageSlug.trim().startsWith('/')
      ? newPageSlug.trim()
      : `/${newPageSlug.trim()}`;

    await onCreatePage({
      title: newPageTitle.trim(),
      slug: formattedSlug,
      page_type: newPageType,
      description: newPageDescription.trim() || undefined,
      is_published: true,
      sections: [],
    });

    setNewPageTitle('');
    setNewPageSlug('/collections/featured');
    setNewPageDescription('');
    setNewPageType('collection');
    setShowCreateModal(false);
    showToast(`Created new ${PAGE_TYPE_LABELS[newPageType].label}`);
  };

  const handleOpenEditModal = (page: CMSPage) => {
    setEditingPage(page);
    setEditTitle(page.title);
    setEditSlug(page.slug);
    setEditDescription(page.description || '');
    setEditPublished(page.is_published);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    const isSystemHome = editingPage.page_type === 'home';
    const finalSlug = isSystemHome
      ? editingPage.slug
      : editSlug.trim().startsWith('/')
      ? editSlug.trim()
      : `/${editSlug.trim()}`;

    const updated: CMSPage = {
      ...editingPage,
      title: editTitle.trim(),
      slug: finalSlug,
      description: editDescription.trim() || undefined,
      is_published: editPublished,
      updated_at: new Date().toISOString(),
    };

    onUpdatePage(updated);
    setEditingPage(null);
    showToast(`Updated page "${updated.title}"`);
  };

  const handleTogglePublish = (page: CMSPage) => {
    const updated = { ...page, is_published: !page.is_published };
    onUpdatePage(updated);
    showToast(updated.is_published ? `Published "${page.title}"` : `Set "${page.title}" to draft`);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isSelected = filterType === tab.type;
            return (
              <button
                key={tab.type}
                type="button"
                onClick={() => setFilterType(tab.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      isSelected ? 'bg-amber-900/60 text-amber-200' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700 bg-slate-50/50"
            />
          </div>

          {filterType === 'home' ? (
            <button
              type="button"
              onClick={() => {
                const homePage = pages.find((p) => p.page_type === 'home');
                if (homePage) onSelectPageForSections(homePage.id);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Configure Layout</span>
            </button>
          ) : filterType === 'product' ? (
            <button
              type="button"
              onClick={() => {
                const prodPage =
                  filteredPages.find((p) => p.page_type === 'product') ||
                  pages.find((p) => p.page_type === 'product');
                if (prodPage) onSelectPageForSections(prodPage.id);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Configure Layout</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNewPageTitle('');
                setNewPageSlug(filterType === 'static' ? '/about' : '/collections/featured');
                setNewPageType(filterType === 'static' ? 'static' : 'collection');
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Page</span>
            </button>
          )}
        </div>
      </div>

      {/* Pages Grid */}
      {filteredPages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
            📄
          </div>
          <h3 className="text-sm font-bold text-slate-900">No pages found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No pages matched "${searchQuery}". Try clearing your search filter.`
              : 'No pages available for this category filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPages.map((page) => {
            const meta = PAGE_TYPE_LABELS[page.page_type] || { label: page.page_type, icon: '📄' };

            return (
              <div
                key={page.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 relative"
              >
                {/* Header Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center text-lg font-bold shrink-0 border border-amber-200/60">
                        {meta.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">{page.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {page.slug}
                          </span>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full">
                            {meta.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Publish Status Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(page)}
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                        page.is_published
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {page.is_published ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  {page.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{page.description}</p>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{page.sections.length}</span>
                    <span>sections</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePreview(page)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Preview Store"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(page)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Page Settings"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {pages.length > 1 && page.page_type !== 'home' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete page "${page.title}"?`)) {
                            onDeletePage(page.id);
                            showToast(`Deleted "${page.title}"`);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectPageForSections(page.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors cursor-pointer ml-1"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-amber-800" />
                      <span>Configure Layout</span>
                      <ArrowRight className="w-3 h-3 text-amber-700" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create New Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Page</h3>
              <p className="text-xs text-slate-500">
                Choose a page archetype to generate a new route.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Page Archetype</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {ALLOWED_PAGE_TYPES.map((pt) => {
                    const isSelected = newPageType === pt.type;
                    return (
                      <button
                        key={pt.type}
                        type="button"
                        onClick={() => {
                          setNewPageType(pt.type);
                          setNewPageSlug(pt.defaultSlug);
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-800 bg-amber-50/50 ring-2 ring-amber-800/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{pt.icon}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />}
                        </div>
                        <div className="mt-1">
                          <div className="text-xs font-bold text-slate-900">{pt.label}</div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{pt.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="e.g. Single Origin Reserve"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Route Slug / URL</label>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="/collections/single-origin"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  placeholder="Brief summary of page content"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs cursor-pointer"
                >
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Page Metadata Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Page Settings</h3>
              <p className="text-xs text-slate-500">
                {editingPage.page_type === 'home'
                  ? 'Homepage entry settings'
                  : 'Customize page title, route, and visibility'}
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Route Slug
                  {editingPage.page_type === 'home' && (
                    <span className="ml-1.5 text-[10px] text-amber-800 font-semibold">(System Fixed Route)</span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  disabled={editingPage.page_type === 'home'}
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl border font-mono text-xs ${
                    editingPage.page_type === 'home'
                      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                      : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editPublished"
                  checked={editPublished}
                  onChange={(e) => setEditPublished(e.target.checked)}
                  className="accent-amber-700 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="editPublished" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Publish on store
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

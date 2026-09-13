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
  onPreviewStorefront: (page: CMSPage) => void;
  showToast: (msg: string) => void;
}

export const ALLOWED_PAGE_TYPES: { type: 'home' | 'product' | 'collection' | 'static'; label: string; icon: string; description: string }[] = [
  { type: 'home', label: 'Homepage', icon: '🏠', description: 'Storefront flagship entry and brand showcase' },
  { type: 'product', label: 'Product Page', icon: '📦', description: 'Single item detail showcase (PDP)' },
  { type: 'collection', label: 'Collection Page', icon: '☕', description: 'Category product listing and filter grid (PLP)' },
  { type: 'static', label: 'Static Pages', icon: '📄', description: 'Story manifesto, brewing guides, and legal pages' },
];

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
  onPreviewStorefront,
  showToast,
}: PagesListViewProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);

  // New Page Form State - Restricted to 4 allowed types
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageType, setNewPageType] = useState<'home' | 'product' | 'collection' | 'static'>('static');
  const [newPageDescription, setNewPageDescription] = useState('');

  // Edit Page Form State
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPublished, setEditPublished] = useState(true);

  const filteredPages = pages.filter((p) => {
    if (filterType !== 'all' && p.page_type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
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
    setNewPageSlug('');
    setNewPageDescription('');
    setNewPageType('static');
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

    const formattedSlug = editSlug.trim().startsWith('/')
      ? editSlug.trim()
      : `/${editSlug.trim()}`;

    const updated: CMSPage = {
      ...editingPage,
      title: editTitle.trim(),
      slug: formattedSlug,
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
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterType === 'all'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            All Pages
          </button>
          {ALLOWED_PAGE_TYPES.map((pt) => {
            const isSelected = filterType === pt.type;
            return (
              <button
                key={pt.type}
                type="button"
                onClick={() => setFilterType(pt.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span>{pt.icon}</span>
                <span>{pt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Create Action */}
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

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Page</span>
          </button>
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
              ? `No pages matched "${searchQuery}". Try clearing your search.`
              : 'Create a new Homepage, Product Page, Collection Page, or Static Page to get started.'}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Page</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPages.map((page) => {
            const meta = PAGE_TYPE_LABELS[page.page_type] || { label: page.page_type, icon: '📄' };
            return (
              <div
                key={page.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center text-lg font-bold shrink-0 border border-amber-200/60">
                        {meta.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{page.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
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
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
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
                      onClick={() => onPreviewStorefront(page)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Preview Storefront"
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
                    {pages.length > 1 && (
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
                      <span>Configure Sections</span>
                      <ArrowRight className="w-3 h-3 text-amber-700" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create New Page Modal - Only 4 Types Allowed */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Storefront Page</h3>
              <p className="text-xs text-slate-500">
                Choose one of the 4 allowed page archetypes to generate a new URL route.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Type Selection Radio Cards */}
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
                          if (!newPageSlug) {
                            if (pt.type === 'home') setNewPageSlug('/');
                            if (pt.type === 'product') setNewPageSlug('/products/new-item');
                            if (pt.type === 'collection') setNewPageSlug('/collections/all');
                            if (pt.type === 'static') setNewPageSlug('/info');
                          }
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
                  placeholder="e.g. Autumn Harvest Reserve"
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
                  placeholder="e.g. /products/autumn-reserve"
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
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs"
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
            <h3 className="text-base font-bold text-slate-900">Edit Page Settings</h3>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Route Slug</label>
                <input
                  type="text"
                  required
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 font-mono text-xs"
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
                  Publish on storefront
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs"
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

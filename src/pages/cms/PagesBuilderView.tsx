import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  Layers,
  Layout,
  CheckCircle2,
  Globe,
  Sliders,
  ChevronRight,
  ExternalLink,
  Save,
} from 'lucide-react';
import { CMSPage, PageSection, SectionType, PageType } from '../../types/cms';
import { SectionFormModal } from './SectionFormModal';

interface PagesBuilderViewProps {
  pages: CMSPage[];
  onUpdatePage: (page: CMSPage) => void;
  onCreatePage: (pageData: Omit<CMSPage, 'id' | 'updated_at'>) => Promise<CMSPage | void> | void;
  onDeletePage: (id: string) => void;
  onPreviewStorefront: (page: CMSPage) => void;
  showToast: (msg: string) => void;
}

const SECTION_TYPE_INFO: Record<
  SectionType,
  { label: string; badgeColor: string; icon: string }
> = {
  hero_banner: { label: 'Hero Banner', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '⚡' },
  category_lane: { label: 'Category Lane', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200', icon: '⭕' },
  category_grid: { label: 'Category Grid', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200', icon: '🗂️' },
  product_lane: { label: 'Product Lane', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '📦' },
  product_grid: { label: 'Product Grid', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '▦' },
  testimonials: { label: 'Testimonials', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200', icon: '⭐' },
  promo_callout: { label: 'Feature Callout', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200', icon: '📢' },
};

const PAGE_TYPE_LABELS: Record<PageType, { label: string; icon: string }> = {
  home: { label: 'Flagship Homepage', icon: '🏠' },
  product: { label: 'Product Page (PDP)', icon: '📦' },
  collection: { label: 'Collection / PLP', icon: '☕' },
  static: { label: 'Story & Content', icon: '📄' },
  discovery: { label: 'Discovery Experience', icon: '🧭' },
};

export function PagesBuilderView({
  pages,
  onUpdatePage,
  onCreatePage,
  onDeletePage,
  onPreviewStorefront,
  showToast,
}: PagesBuilderViewProps) {
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || '');
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);

  useEffect(() => {
    if (pages.length > 0 && !pages.some((p) => p.id === selectedPageId)) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  // New Page form state
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageType, setNewPageType] = useState<PageType>('static');

  const currentPage = pages.find((p) => p.id === selectedPageId) || pages[0];

  if (!currentPage) {
    return (
      <div className="p-8 text-center text-slate-500">
        No pages found. Click "Create Page" to start.
      </div>
    );
  }

  // Handle explicit save of page configuration
  const handleSavePage = () => {
    onUpdatePage(currentPage);
    showToast(`Saved page "${currentPage.title}" & ${currentPage.sections.length} sections`);
  };

  // Handle reordering sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...currentPage.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIdx];
    sections[targetIdx] = temp;

    // Normalize sort_order
    const updatedSections = sections.map((sec, i) => ({ ...sec, sort_order: i + 1 }));
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast(`Reordered "${temp.title}"`);
  };

  // Handle toggling section active status
  const handleToggleSectionActive = (sectionId: string) => {
    const updatedSections = currentPage.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, is_active: !sec.is_active } : sec
    );
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast('Updated section visibility');
  };

  // Handle deleting section
  const handleDeleteSection = (sectionId: string, sectionTitle: string) => {
    if (!confirm(`Remove section "${sectionTitle}" from this page?`)) return;
    const updatedSections = currentPage.sections.filter((sec) => sec.id !== sectionId);
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast(`Removed section "${sectionTitle}"`);
  };

  // Handle saving section edits from modal
  const handleSaveSection = (updatedSection: PageSection) => {
    const updatedSections = currentPage.sections.map((sec) =>
      sec.id === updatedSection.id ? updatedSection : sec
    );
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast(`Saved "${updatedSection.title}"`);
  };

  // Handle adding new section
  const handleAddSection = (type: SectionType) => {
    setShowAddSectionMenu(false);
    let defaultConfig: Record<string, any> = {};

    if (type === 'hero_banner') {
      defaultConfig = {
        headline: 'New Hero Announcement',
        subheadline: 'Craft roasted seasonal beans and precision equipment.',
        primary_cta_text: 'Discover Now',
        primary_cta_url: '#/coffees',
        background_image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop&q=80',
        overlay_opacity: 60,
        text_align: 'center',
      };
    } else if (type === 'category_lane' || type === 'category_grid') {
      defaultConfig = {
        card_style: 'circular',
        has_navigation_arrows: true,
        columns: 4,
        categories: [
          {
            id: 'cat_1',
            title: 'Roasted Coffee',
            image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&q=80',
            url: '#/coffees',
            badge: 'FRESH',
          },
          {
            id: 'cat_2',
            title: 'Espresso Machines',
            image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop&q=80',
            url: '#/equipment',
            badge: 'POPULAR',
          },
        ],
      };
    } else if (type === 'product_lane') {
      defaultConfig = {
        card_style: 'slider',
        limit: 6,
        filter_category: '',
      };
    } else if (type === 'product_grid') {
      defaultConfig = {
        columns: 3,
        limit: 6,
        show_quick_add: true,
        filter_category: '',
      };
    } else if (type === 'testimonials') {
      defaultConfig = {
        testimonials: [
          {
            id: `test_${Date.now()}`,
            author: 'Master Barista',
            role: 'Specialty Coffee Reviewer',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            rating: 5,
            quote: 'Unmatched clarity in flavor notes and roasting consistency.',
            verified_purchase: true,
          },
        ],
      };
    } else if (type === 'promo_callout') {
      defaultConfig = {
        headline: 'CounterCheck™ Dimension Guarantee',
        body: 'Verified countertop fitment before your equipment is dispatched.',
        badge: 'PATENTED TECH',
        button_text: 'Explore Sizing',
        button_url: '#/discovery',
        image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
        layout: 'image_right',
      };
    }

    const newSection: PageSection = {
      id: `sec_${Date.now()}`,
      type,
      title: `New ${SECTION_TYPE_INFO[type].label}`,
      subtitle: 'Configured section block',
      is_active: true,
      sort_order: currentPage.sections.length + 1,
      config: defaultConfig,
    };

    const updatedSections = [...currentPage.sections, newSection];
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast(`Added ${SECTION_TYPE_INFO[type].label}`);
    setEditingSection(newSection);
    setSectionModalOpen(true);
  };

  // Handle creating a new page
  const handleCreateNewPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const created = await onCreatePage({
      title: newPageTitle.trim(),
      slug: newPageSlug.trim().startsWith('/') ? newPageSlug.trim() : `/${newPageSlug.trim()}`,
      page_type: newPageType,
      description: 'Custom merchant configured page',
      is_published: true,
      sections: [],
    });

    if (created && created.id) {
      setSelectedPageId(created.id);
    }

    setNewPageTitle('');
    setNewPageSlug('');
    setShowNewPageModal(false);
    showToast(`Created page "${newPageTitle}"`);
  };

  return (
    <div className="space-y-6">
      {/* Top Page Selector Tabs & Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Page Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {pages.map((p) => {
            const isSelected = p.id === selectedPageId;
            const meta = PAGE_TYPE_LABELS[p.page_type];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPageId(p.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{p.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? 'bg-amber-900/60 text-amber-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {p.slug}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSavePage}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Page</span>
          </button>
          <button
            type="button"
            onClick={() => onPreviewStorefront(currentPage)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>Preview Page</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNewPageModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Page</span>
          </button>
        </div>
      </div>

      {/* Page Metadata Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-lg font-bold shrink-0">
            {PAGE_TYPE_LABELS[currentPage.page_type].icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentPage.title}</h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-amber-100 text-amber-900 border border-amber-300">
                {PAGE_TYPE_LABELS[currentPage.page_type].label}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  currentPage.is_published
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentPage.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentPage.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <span>Publish Status:</span>
            <input
              type="checkbox"
              checked={currentPage.is_published}
              onChange={(e) => {
                onUpdatePage({ ...currentPage, is_published: e.target.checked });
                showToast(e.target.checked ? 'Published page' : 'Page set to draft');
              }}
              className="accent-amber-700 w-4 h-4 cursor-pointer"
            />
          </label>
          <button
            type="button"
            onClick={handleSavePage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
          {pages.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete page "${currentPage.title}"?`)) {
                  onDeletePage(currentPage.id);
                  setSelectedPageId(pages[0].id);
                  showToast('Deleted page');
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Delete Page
            </button>
          )}
        </div>
      </div>

      {/* Page Sections Stack */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Page Section Stack ({currentPage.sections.length} blocks)
            </h3>
          </div>

          {/* Add Section Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddSectionMenu(!showAddSectionMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Page Section</span>
            </button>

            {showAddSectionMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-20 overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Select Section Type to Insert
                </div>
                {(Object.keys(SECTION_TYPE_INFO) as SectionType[]).map((type) => {
                  const meta = SECTION_TYPE_INFO[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleAddSection(type)}
                      className="w-full px-3 py-2 text-left hover:bg-amber-50/70 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span className="text-base">{meta.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{meta.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section Cards List */}
        {currentPage.sections.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
              +
            </div>
            <p className="text-sm font-bold text-slate-700">No sections on this page yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add a Hero Banner, Category Lane, or Product Grid to assemble this page experience.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {currentPage.sections.map((section, index) => {
              const meta = SECTION_TYPE_INFO[section.type];
              return (
                <div
                  key={section.id}
                  className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    section.is_active ? 'border-slate-200' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
                  }`}
                >
                  {/* Left: Reorder Controls & Section Meta */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSection(index, 'up')}
                        className={`p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 ${
                          index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === currentPage.sections.length - 1}
                        onClick={() => handleMoveSection(index, 'down')}
                        className={`p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 ${
                          index === currentPage.sections.length - 1
                            ? 'opacity-30 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{section.title}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border ${meta.badgeColor}`}
                        >
                          {meta.icon} {meta.label}
                        </span>
                        {!section.is_active && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-200 text-slate-600">
                            HIDDEN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {section.subtitle || 'Custom section component'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Section Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleSectionActive(section.id)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        section.is_active
                          ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {section.is_active ? 'Hide' : 'Show'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingSection(section);
                        setSectionModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-amber-700" />
                      <span>Configure</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id, section.title)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Page Save Action Strip */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Configured <span className="font-bold text-slate-900">{currentPage.sections.length} section blocks</span> for{' '}
              <span className="font-bold font-mono text-slate-800">{currentPage.slug}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreviewStorefront(currentPage)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-700" />
              <span>Preview Page</span>
            </button>
            <button
              type="button"
              onClick={handleSavePage}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Page Layout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Editor Modal */}
      <SectionFormModal
        isOpen={sectionModalOpen}
        onClose={() => {
          setSectionModalOpen(false);
          setEditingSection(null);
        }}
        section={editingSection}
        onSave={handleSaveSection}
      />

      {/* Create New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New CMS Page</h3>
            <form onSubmit={handleCreateNewPage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="e.g. Sourcing Manifesto"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Route Path / Slug</label>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="e.g. /sourcing"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Type</label>
                <select
                  value={newPageType}
                  onChange={(e) => setNewPageType(e.target.value as PageType)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                >
                  <option value="home">Homepage</option>
                  <option value="product">Product Page (PDP)</option>
                  <option value="collection">Collection Page (PLP)</option>
                  <option value="static">Static Page (Story, Guides, Legal)</option>
                </select>
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(false)}
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
    </div>
  );
}


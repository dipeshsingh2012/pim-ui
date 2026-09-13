import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  Save,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { CMSPage, PageSection, SectionType, PageType } from '../../types/cms';
import { SectionFormModal } from './SectionFormModal';

interface SectionsBuilderViewProps {
  pages: CMSPage[];
  selectedPageId: string;
  onSelectPageId: (id: string) => void;
  onUpdatePage: (page: CMSPage) => void;
  onPreviewStore?: (page: CMSPage) => void;
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

const PAGE_TYPE_ICONS: Record<PageType, string> = {
  home: '🏠',
  product: '📦',
  collection: '☕',
  static: '📄',
  discovery: '🧭',
};

export function SectionsBuilderView({
  pages,
  selectedPageId,
  onSelectPageId,
  onUpdatePage,
  onPreviewStore,
  showToast,
}: SectionsBuilderViewProps) {
  const handlePreview = (p: CMSPage) => {
    if (onPreviewStore) onPreviewStore(p);
  };
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const currentPage = pages.find((p) => p.id === selectedPageId) || pages[0];

  useEffect(() => {
    if (!currentPage && pages.length > 0) {
      onSelectPageId(pages[0].id);
    }
  }, [pages, currentPage, onSelectPageId]);

  if (!currentPage) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
        <p className="text-sm font-bold text-slate-700">No pages available</p>
        <p className="text-xs text-slate-500">Create a page first to begin adding section blocks.</p>
      </div>
    );
  }

  const handleSavePageSections = () => {
    onUpdatePage(currentPage);
    showToast(`Saved layout for "${currentPage.title}" (${currentPage.sections.length} blocks)`);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...currentPage.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIdx];
    sections[targetIdx] = temp;

    const updatedSections = sections.map((sec, i) => ({ ...sec, sort_order: i + 1 }));
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast(`Reordered "${temp.title}"`);
  };

  const handleToggleSectionActive = (sectionId: string) => {
    const updatedSections = currentPage.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, is_active: !sec.is_active } : sec
    );
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast('Updated section visibility');
  };

  const handleDeleteSection = (sectionId: string, sectionTitle: string) => {
    if (!confirm(`Remove section "${sectionTitle}" from this page?`)) return;
    const updatedSections = currentPage.sections.filter((sec) => sec.id !== sectionId);
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast(`Removed section "${sectionTitle}"`);
  };

  const handleSaveSectionEdits = (updatedSection: PageSection) => {
    const updatedSections = currentPage.sections.map((sec) =>
      sec.id === updatedSection.id ? updatedSection : sec
    );
    onUpdatePage({ ...currentPage, sections: updatedSections });
    showToast(`Saved "${updatedSection.title}"`);
  };

  const handleAddSection = (type: SectionType) => {
    setShowAddMenu(false);
    let defaultConfig: Record<string, any> = {};

    if (type === 'hero_banner') {
      defaultConfig = {
        headline: 'New Hero Announcement',
        subheadline: 'Craft roasted seasonal beans and precision equipment.',
        primary_cta_text: 'Discover Now',
        primary_cta_url: '#/coffees',
        background_image:
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop&q=80',
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
            image_url:
              'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&q=80',
            url: '#/coffees',
            badge: 'FRESH',
          },
          {
            id: 'cat_2',
            title: 'Espresso Machines',
            image_url:
              'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop&q=80',
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
            avatar_url:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            rating: 5,
            quote: 'Unmatched clarity in flavor notes and roasting consistency.',
            verified_purchase: true,
          },
        ],
      };
    } else if (type === 'promo_callout') {
      defaultConfig = {
        headline: 'Direct Farm Transparency',
        body: 'Every crop is traceable directly to the harvest lots and processing tanks.',
        badge: 'FARM DIRECT',
        button_text: 'Explore Harvest Lots',
        button_url: '#/about',
        image_url:
          'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
        layout: 'image_right',
      };
    }

    const newSection: PageSection = {
      id: `sec_${Date.now()}`,
      type,
      title: `New ${SECTION_TYPE_INFO[type].label}`,
      subtitle: 'Configured store block',
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

  return (
    <div className="space-y-6">
      {/* Top Page Selector Pill Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1">
          <label htmlFor="sections-page-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Editing Page:
          </label>
          <div className="relative shrink-0">
            <select
              id="sections-page-select"
              value={currentPage.id}
              onChange={(e) => onSelectPageId(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-amber-700 cursor-pointer"
            >
              <optgroup label="Homepage">
                {pages.filter((p) => p.page_type === 'home').map((p) => (
                  <option key={p.id} value={p.id}>🏠 {p.title} ({p.slug})</option>
                ))}
              </optgroup>
              <optgroup label="Product Pages (PDP)">
                {pages.filter((p) => p.page_type === 'product').map((p) => (
                  <option key={p.id} value={p.id}>📦 {p.title} ({p.slug})</option>
                ))}
              </optgroup>
              <optgroup label="Collections (PLP)">
                {pages.filter((p) => p.page_type === 'collection').map((p) => (
                  <option key={p.id} value={p.id}>☕ {p.title} ({p.slug})</option>
                ))}
              </optgroup>
              <optgroup label="Content & Static">
                {pages.filter((p) => p.page_type === 'static' || p.page_type === 'discovery').map((p) => (
                  <option key={p.id} value={p.id}>📄 {p.title} ({p.slug})</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto ml-2 scrollbar-none">
            {pages.map((p) => {
              const isSelected = p.id === currentPage.id;
              const icon = PAGE_TYPE_ICONS[p.page_type] || '📄';
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPageId(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{icon}</span>
                  <span className="max-w-[140px] truncate">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSavePageSections}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Sections</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreview(currentPage)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>Preview Page</span>
          </button>
        </div>
      </div>

      {/* Page Info Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center text-xl font-bold shrink-0 border border-amber-200/60">
            {PAGE_TYPE_ICONS[currentPage.page_type] || '📄'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentPage.title}</h2>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {currentPage.slug}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  currentPage.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentPage.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            {currentPage.description && (
              <p className="text-xs text-slate-500 mt-0.5">{currentPage.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Section Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Page Section</span>
            </button>

            {showAddMenu && (
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
      </div>

      {/* Sections Stack Block Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Section Layout Blocks ({currentPage.sections.length})
            </h3>
          </div>
        </div>

        {currentPage.sections.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
              +
            </div>
            <p className="text-sm font-bold text-slate-700">No sections on this page yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add a Hero Banner, Category Lane, Product Grid, or Feature Callout to assemble this page.
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
                  {/* Left: Reorder & Info */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSection(index, 'up')}
                        className={`p-1 rounded-md transition-colors ${
                          index === 0
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer'
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === currentPage.sections.length - 1}
                        onClick={() => handleMoveSection(index, 'down')}
                        className={`p-1 rounded-md transition-colors ${
                          index === currentPage.sections.length - 1
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer'
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{section.title}</span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badgeColor}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      {section.subtitle && (
                        <p className="text-xs text-slate-500 line-clamp-1">{section.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer mr-2">
                      <input
                        type="checkbox"
                        checked={section.is_active}
                        onChange={() => handleToggleSectionActive(section.id)}
                        className="accent-amber-700 w-4 h-4 cursor-pointer"
                      />
                      <span>Active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingSection(section);
                        setSectionModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Configure</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id, section.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section Editor Modal */}
      <SectionFormModal
        isOpen={sectionModalOpen}
        onClose={() => {
          setSectionModalOpen(false);
          setEditingSection(null);
        }}
        section={editingSection}
        onSave={handleSaveSectionEdits}
      />
    </div>
  );
}

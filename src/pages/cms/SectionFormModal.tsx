import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Layout,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Type,
  Link as LinkIcon,
  Star,
  Save,
} from 'lucide-react';
import { PageSection, SectionType } from '../../types/cms';

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: PageSection | null;
  onSave: (updatedSection: PageSection) => void;
}

const SECTION_TYPE_LABELS: Record<SectionType, { label: string; description: string }> = {
  hero_banner: {
    label: 'Hero Banner',
    description: 'High-impact full-width banner with headline, CTA actions, and atmospheric imagery.',
  },
  category_lane: {
    label: 'Category Lane',
    description: 'Horizontal sliding rail of category pills or circular cards.',
  },
  category_grid: {
    label: 'Category Grid',
    description: 'Multi-column visual grid showcasing curated collections.',
  },
  product_lane: {
    label: 'Product Lane / Rail',
    description: 'Horizontal sliding carousel of curated or filtered catalog products.',
  },
  product_grid: {
    label: 'Product Grid',
    description: 'Responsive multi-column grid of products with quick add and pricing.',
  },
  testimonials: {
    label: 'Customer Testimonials',
    description: 'Devotee reviews, barista quotes, ratings, and verified buyer badges.',
  },
  promo_callout: {
    label: 'Feature / Promo Callout',
    description: 'Spotlight card highlighting dimension fitment, sourcing ethics, or craft guarantee.',
  },
};

export function SectionFormModal({
  isOpen,
  onClose,
  section,
  onSave,
}: SectionFormModalProps) {
  if (!isOpen || !section) return null;

  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle || '');
  const [isActive, setIsActive] = useState(section.is_active);
  const [config, setConfig] = useState<Record<string, any>>(section.config || {});

  useEffect(() => {
    setTitle(section.title);
    setSubtitle(section.subtitle || '');
    setIsActive(section.is_active);
    setConfig(section.config || {});
  }, [section]);

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...section,
      title,
      subtitle: subtitle.trim() ? subtitle : undefined,
      is_active: isActive,
      config,
    });
    onClose();
  };

  // Helper for adding/removing category tiles in category_lane / category_grid
  const categoriesList = (config.categories as any[]) || [];
  const handleAddCategoryItem = () => {
    const updated = [
      ...categoriesList,
      {
        id: `cat_${Date.now()}`,
        title: 'New Category',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop&q=80',
        url: '#/coffees',
        badge: '',
      },
    ];
    updateConfig('categories', updated);
  };
  const handleRemoveCategoryItem = (idx: number) => {
    const updated = categoriesList.filter((_, i) => i !== idx);
    updateConfig('categories', updated);
  };
  const handleUpdateCategoryItem = (idx: number, field: string, value: string) => {
    const updated = categoriesList.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
    updateConfig('categories', updated);
  };

  // Helper for adding/removing testimonials
  const testimonialsList = (config.testimonials as any[]) || [];
  const handleAddTestimonial = () => {
    const updated = [
      ...testimonialsList,
      {
        id: `test_${Date.now()}`,
        author: 'Devotee Reviewer',
        role: 'Verified Buyer',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        quote: 'Exceptional extraction and consistent roast quality every time.',
        verified_purchase: true,
      },
    ];
    updateConfig('testimonials', updated);
  };
  const handleRemoveTestimonial = (idx: number) => {
    const updated = testimonialsList.filter((_, i) => i !== idx);
    updateConfig('testimonials', updated);
  };
  const handleUpdateTestimonial = (idx: number, field: string, value: any) => {
    const updated = testimonialsList.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
    updateConfig('testimonials', updated);
  };

  const typeMeta = SECTION_TYPE_LABELS[section.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Configure Section</h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  {typeMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-500">{typeMeta.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleSave(e as any)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Section Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Section Admin Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                placeholder="e.g. Flagship Hero Banner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Subtitle / Note
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                placeholder="Internal notes or placement context"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800">Section Active Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                <span className="ml-2 text-xs font-semibold text-slate-600">
                  {isActive ? 'Published on Page' : 'Draft (Hidden)'}
                </span>
              </label>
            </div>
          </div>

          {/* Type-Specific Configurations */}

          {/* 1. HERO BANNER */}
          {section.type === 'hero_banner' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Hero Banner Attributes
              </h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Text</label>
                <input
                  type="text"
                  value={config.headline || ''}
                  onChange={(e) => updateConfig('headline', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  placeholder="e.g. Rare Harvests. Uncompromising Extraction."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subheadline</label>
                <textarea
                  rows={2}
                  value={config.subheadline || ''}
                  onChange={(e) => updateConfig('subheadline', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  placeholder="Describe your roastery philosophy or seasonal offering..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={config.badge || ''}
                    onChange={(e) => updateConfig('badge', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="e.g. AUTUMN 2026 RESERVE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Text Alignment</label>
                  <select
                    value={config.text_align || 'center'}
                    onChange={(e) => updateConfig('text_align', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="center">Centered Alignment</option>
                    <option value="left">Left Alignment</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={config.primary_cta_text || ''}
                    onChange={(e) => updateConfig('primary_cta_text', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="Button Label"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA URL</label>
                  <input
                    type="text"
                    value={config.primary_cta_url || ''}
                    onChange={(e) => updateConfig('primary_cta_url', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="#/coffees"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={config.secondary_cta_text || ''}
                    onChange={(e) => updateConfig('secondary_cta_text', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="Optional secondary button"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secondary CTA URL</label>
                  <input
                    type="text"
                    value={config.secondary_cta_url || ''}
                    onChange={(e) => updateConfig('secondary_cta_url', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="#/discovery"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Background Image URL</label>
                <input
                  type="text"
                  value={config.background_image || ''}
                  onChange={(e) => updateConfig('background_image', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dark Overlay Opacity: {config.overlay_opacity ?? 60}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={config.overlay_opacity ?? 60}
                  onChange={(e) => updateConfig('overlay_opacity', Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>
          )}

          {/* 2 & 3. CATEGORY LANE & CATEGORY GRID */}
          {(section.type === 'category_lane' || section.type === 'category_grid') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Category Collections ({categoriesList.length} items)
                </h4>
                <button
                  type="button"
                  onClick={handleAddCategoryItem}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Category
                </button>
              </div>

              {section.type === 'category_lane' && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Style</label>
                    <select
                      value={config.card_style || 'circular'}
                      onChange={(e) => updateConfig('card_style', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="circular">Circular Image Cards</option>
                      <option value="standard_card">Standard Rounded Cards</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Arrow Navigation</label>
                    <select
                      value={config.has_navigation_arrows ? 'yes' : 'no'}
                      onChange={(e) => updateConfig('has_navigation_arrows', e.target.value === 'yes')}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="yes">Enabled (Left/Right Arrows)</option>
                      <option value="no">Disabled (Touch/Mouse Scroll)</option>
                    </select>
                  </div>
                </div>
              )}

              {section.type === 'category_grid' && (
                <div className="bg-slate-50 p-3 rounded-xl">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grid Columns</label>
                  <select
                    value={config.columns || 4}
                    onChange={(e) => updateConfig('columns', Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {categoriesList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <img
                      src={item.image_url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateCategoryItem(idx, 'title', e.target.value)}
                        placeholder="Category Title"
                        className="px-2 py-1 border rounded border-slate-200"
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUpdateCategoryItem(idx, 'url', e.target.value)}
                        placeholder="Target Link (e.g. #/coffees)"
                        className="px-2 py-1 border rounded border-slate-200"
                      />
                      <input
                        type="text"
                        value={item.image_url}
                        onChange={(e) => handleUpdateCategoryItem(idx, 'image_url', e.target.value)}
                        placeholder="Image URL"
                        className="px-2 py-1 border rounded border-slate-200 text-[11px]"
                      />
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => handleUpdateCategoryItem(idx, 'badge', e.target.value)}
                        placeholder="Badge (Optional)"
                        className="px-2 py-1 border rounded border-slate-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategoryItem(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PRODUCT LANE */}
          {section.type === 'product_lane' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Product Lane / Carousel Configuration
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Style</label>
                  <select
                    value={config.card_style || 'slider'}
                    onChange={(e) => updateConfig('card_style', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="slider">Interactive Carousel Slider</option>
                    <option value="scrollable">Horizontal Scroll Rail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Products Limit</label>
                  <input
                    type="number"
                    min={2}
                    max={24}
                    value={config.limit || 6}
                    onChange={(e) => updateConfig('limit', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Filter by Category</label>
                  <select
                    value={config.filter_category || ''}
                    onChange={(e) => updateConfig('filter_category', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="">All Categories (Mixed Showcase)</option>
                    <option value="coffee_beans">Whole Bean Coffees</option>
                    <option value="espresso_machine">Espresso Machines</option>
                    <option value="grinder">Precision Grinders</option>
                    <option value="accessories">Accessories & Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Filter by Badge</label>
                  <input
                    type="text"
                    value={config.filter_badge || ''}
                    onChange={(e) => updateConfig('filter_badge', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="e.g. NANO LOT, BESTSELLER"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. PRODUCT GRID */}
          {section.type === 'product_grid' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Product Grid Configuration
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grid Columns</label>
                  <select
                    value={config.columns || 3}
                    onChange={(e) => updateConfig('columns', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Items</label>
                  <input
                    type="number"
                    min={3}
                    max={24}
                    value={config.limit || 6}
                    onChange={(e) => updateConfig('limit', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quick Add Button</label>
                  <select
                    value={config.show_quick_add ? 'yes' : 'no'}
                    onChange={(e) => updateConfig('show_quick_add', e.target.value === 'yes')}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="yes">Enabled</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Filter by Category</label>
                <select
                  value={config.filter_category || ''}
                  onChange={(e) => updateConfig('filter_category', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">All Catalog Products</option>
                  <option value="coffee_beans">Whole Bean Coffees Only</option>
                  <option value="espresso_machine">Espresso Machines Only</option>
                  <option value="grinder">Grinders Only</option>
                </select>
              </div>
            </div>
          )}

          {/* 6. TESTIMONIALS */}
          {section.type === 'testimonials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Devotee Testimonials ({testimonialsList.length})
                </h4>
                <button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Review
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {testimonialsList.map((test, idx) => (
                  <div
                    key={test.id || idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-800">Reviewer #{idx + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTestimonial(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={test.author}
                        onChange={(e) => handleUpdateTestimonial(idx, 'author', e.target.value)}
                        placeholder="Author Name"
                        className="px-2 py-1 border rounded border-slate-200"
                      />
                      <input
                        type="text"
                        value={test.role || ''}
                        onChange={(e) => handleUpdateTestimonial(idx, 'role', e.target.value)}
                        placeholder="Role / Title (e.g. Barista Finalist)"
                        className="px-2 py-1 border rounded border-slate-200"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={test.quote}
                      onChange={(e) => handleUpdateTestimonial(idx, 'quote', e.target.value)}
                      placeholder="Quote text..."
                      className="w-full text-xs px-2 py-1 border rounded border-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PROMO CALLOUT */}
          {section.type === 'promo_callout' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Spotlight Promo Callout
              </h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={config.headline || ''}
                  onChange={(e) => updateConfig('headline', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  placeholder="e.g. Guaranteed Kitchen Fit Before You Buy"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Body Description</label>
                <textarea
                  rows={2}
                  value={config.body || ''}
                  onChange={(e) => updateConfig('body', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  placeholder="Explain your key proposition or guarantee..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={config.badge || ''}
                    onChange={(e) => updateConfig('badge', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="e.g. PATENTED FIT TECH"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Layout Style</label>
                  <select
                    value={config.layout || 'image_right'}
                    onChange={(e) => updateConfig('layout', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="image_right">Image on Right / Text Left</option>
                    <option value="image_left">Image on Left / Text Right</option>
                    <option value="card_banner">Full Width Card Banner</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={config.button_text || ''}
                    onChange={(e) => updateConfig('button_text', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="Action Button"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={config.button_url || ''}
                    onChange={(e) => updateConfig('button_url', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    placeholder="#/discovery"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={config.image_url || ''}
                  onChange={(e) => updateConfig('image_url', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Section Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


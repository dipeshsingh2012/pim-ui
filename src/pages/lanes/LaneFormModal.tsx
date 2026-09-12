import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  Package,
  Layers,
  CheckCircle2,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Tag,
} from 'lucide-react';
import { ContentLane, LaneItem, LaneFormValues } from '../../types/lane';
import { Product } from '../../types/product';
import { dataProvider } from '../../providers/dataProvider';

interface LaneFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialLane?: ContentLane | null;
  onClose: () => void;
  onSubmit: (values: LaneFormValues) => Promise<void>;
}

export function LaneFormModal({
  isOpen,
  mode,
  initialLane,
  onClose,
  onSubmit,
}: LaneFormModalProps) {
  const [formData, setFormData] = useState<LaneFormValues>({
    title: '',
    subtitle: '',
    slug: '',
    lane_type: 'category_lane',
    placement: 'homepage',
    card_style: 'circular',
    has_navigation_arrows: true,
    status: 'active',
    sort_order: 0,
    items: [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Catalog Product Picker State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLoading, setPickerLoading] = useState(false);

  // Custom Item Form State
  const [customItemOpen, setCustomItemOpen] = useState(false);
  const [customItem, setCustomItem] = useState<{
    title: string;
    subtitle: string;
    image_url: string;
    target_url: string;
    badge: string;
    price: string;
  }>({
    title: '',
    subtitle: '',
    image_url: '',
    target_url: '#/coffees',
    badge: '',
    price: '',
  });

  useEffect(() => {
    if (initialLane && mode === 'edit') {
      setFormData({
        id: initialLane.id,
        title: initialLane.title,
        subtitle: initialLane.subtitle || '',
        slug: initialLane.slug,
        lane_type: initialLane.lane_type,
        placement: initialLane.placement,
        card_style: initialLane.card_style,
        has_navigation_arrows: initialLane.has_navigation_arrows ?? true,
        status: initialLane.status,
        sort_order: initialLane.sort_order || 0,
        items: initialLane.items || [],
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        slug: '',
        lane_type: 'category_lane',
        placement: 'homepage',
        card_style: 'circular',
        has_navigation_arrows: true,
        status: 'active',
        sort_order: 0,
        items: [],
      });
    }
  }, [initialLane, mode, isOpen]);

  // Load products for picker
  useEffect(() => {
    if (!pickerOpen) return;
    async function loadCatalog() {
      setPickerLoading(true);
      try {
        const filters: any[] = [];
        if (pickerSearch) filters.push({ field: 'q', value: pickerSearch });
        const res = await dataProvider.getList({
          resource: 'products',
          filters,
          pagination: { currentPage: 1, pageSize: 50 },
        });
        setCatalogProducts(res.data as Product[]);
      } catch (e) {
        console.error('Failed to load catalog products', e);
      } finally {
        setPickerLoading(false);
      }
    }
    const timer = setTimeout(() => loadCatalog(), 200);
    return () => clearTimeout(timer);
  }, [pickerOpen, pickerSearch]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const slug = mode === 'create' && !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug;
      return { ...prev, title: val, slug };
    });
  };

  const handleAddItemFromProduct = (prod: Product) => {
    const newItem: LaneItem = {
      id: `item_${prod.id}_${Date.now()}`,
      product_id: prod.id,
      title: prod.name,
      subtitle: prod.roast_level ? `${prod.roast_level.toUpperCase()} • ${prod.category}` : prod.brand,
      image_url: prod.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&q=80',
      target_url: `#/product/${prod.id}`,
      badge: prod.badge || undefined,
      price: `₹ ${prod.price.toLocaleString('en-IN')}`,
      sort_order: formData.items.length,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setPickerOpen(false);
  };

  const handleAddCustomItem = () => {
    if (!customItem.title || !customItem.image_url) {
      alert('Please provide at least a title and image URL');
      return;
    }
    const newItem: LaneItem = {
      id: `custom_${Date.now()}`,
      product_id: null,
      title: customItem.title,
      subtitle: customItem.subtitle || undefined,
      image_url: customItem.image_url,
      target_url: customItem.target_url || '#/coffees',
      badge: customItem.badge || undefined,
      price: customItem.price || undefined,
      sort_order: formData.items.length,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setCustomItem({
      title: '',
      subtitle: '',
      image_url: '',
      target_url: '#/coffees',
      badge: '',
      price: '',
    });
    setCustomItemOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.items.length) return;

    setFormData((prev) => {
      const copy = [...prev.items];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return { ...prev, items: copy };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      setError('Title and unique slug are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save content lane');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {mode === 'create' ? 'Create Product / Category Lane' : `Edit Lane: ${formData.title}`}
              </h3>
              <p className="text-xs text-slate-500">
                Configure circular card slider, destination links, and curated items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Lane Meta Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lane Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Explore by Category"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Unique Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="explore-by-category"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Placement
              </label>
              <select
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
              >
                <option value="homepage">Homepage Only</option>
                <option value="discovery">Discovery Page</option>
                <option value="all">All Storefront Pages</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Subtitle Copy
              </label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Single origin estate roasts, espresso machines, and barista gear"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Card Presentation Style
              </label>
              <select
                value={formData.card_style}
                onChange={(e) => setFormData({ ...formData, card_style: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
              >
                <option value="circular">Circular Cards (Homepage Design)</option>
                <option value="standard_card">Standard Square Cards</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_navigation_arrows}
                onChange={(e) => setFormData({ ...formData, has_navigation_arrows: e.target.checked })}
                className="rounded text-amber-700 focus:ring-amber-600 w-4 h-4"
              />
              <span>Enable Prev / Next Navigation Arrows (Slider Mode)</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Lifecycle Status:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'draft' : 'active' })}
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-colors ${
                  formData.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                {formData.status}
              </button>
            </div>
          </div>

          {/* LIVE CIRCULAR PREVIEW */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Storefront Preview ({formData.card_style})</span>
              </div>
              {formData.has_navigation_arrows && (
                <div className="flex items-center gap-1">
                  <span className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-400">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>

            {formData.title && (
              <div className="mb-4 text-center">
                <h4 className="text-base font-black uppercase tracking-wider text-slate-900">
                  {formData.title}
                </h4>
                {formData.subtitle && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{formData.subtitle}</p>
                )}
              </div>
            )}

            {formData.items.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No items added yet. Add catalog products or custom category tiles below to preview.
              </p>
            ) : (
              <div className="flex items-start gap-4 overflow-x-auto py-2 px-1">
                {formData.items.map((item, idx) => (
                  <div key={item.id} className="flex flex-col items-center shrink-0 w-24">
                    {/* Circular Card Image Container */}
                    <div className="relative w-20 h-20 aspect-square rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 shadow-2xs group">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&q=80';
                        }}
                      />
                      {item.badge && (
                        <span className="absolute top-0 right-0 text-[8px] font-black uppercase tracking-wider bg-amber-600 text-white px-1.5 py-0.5 rounded-full shadow-2xs">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-center text-slate-800 line-clamp-2 leading-tight">
                      {item.title}
                    </span>
                    {item.price && (
                      <span className="text-[9px] font-bold text-amber-800 mt-0.5">
                        {item.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lane Items Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-700" />
                <span>Lane Items ({formData.items.length})</span>
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Pick From Catalog</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomItemOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Tile</span>
                </button>
              </div>
            </div>

            {/* Custom Tile Inline Form */}
            {customItemOpen && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-900 uppercase">
                    New Custom / Category Tile
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomItemOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Tile Title (e.g. Espresso Machines)"
                    value={customItem.title}
                    onChange={(e) => setCustomItem({ ...customItem, title: e.target.value })}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Image URL (Unsplash or CDN)"
                    value={customItem.image_url}
                    onChange={(e) => setCustomItem({ ...customItem, image_url: e.target.value })}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Target Route (e.g. #/equipment)"
                    value={customItem.target_url}
                    onChange={(e) => setCustomItem({ ...customItem, target_url: e.target.value })}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Badge (optional e.g. Popular, Save 15%)"
                    value={customItem.badge}
                    onChange={(e) => setCustomItem({ ...customItem, badge: e.target.value })}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle (optional)"
                    value={customItem.subtitle}
                    onChange={(e) => setCustomItem({ ...customItem, subtitle: e.target.value })}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="py-2 px-4 rounded-xl bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition-colors"
                  >
                    Add Tile to Lane
                  </button>
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 flex items-center justify-between bg-white hover:bg-slate-50/60 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400 w-5">
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                            {item.badge}
                          </span>
                        )}
                        {item.price && (
                          <span className="text-[10px] font-bold text-slate-600">
                            {item.price}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono truncate block">
                        {item.target_url}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveItem(index, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === formData.items.length - 1}
                      onClick={() => handleMoveItem(index, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-rose-400 hover:text-rose-700 ml-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : mode === 'create' ? 'Create Lane' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

        {/* Catalog Product Picker Modal */}
        {pickerOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-bold text-slate-900">Select Product from Catalog</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 border-b border-slate-200 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search catalog products by title, SKU, roastery..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
                {pickerLoading ? (
                  <p className="text-xs text-slate-400 text-center py-8">Loading catalog products...</p>
                ) : catalogProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No products found matching "{pickerSearch}"</p>
                ) : (
                  catalogProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleAddItemFromProduct(p)}
                      className="p-2.5 hover:bg-amber-50/50 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={p.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&q=80'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {p.brand} • {p.category} • ₹{p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-800 hover:underline">
                        + Add
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

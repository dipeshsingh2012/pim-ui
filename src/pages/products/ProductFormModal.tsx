import React, { useState, useEffect } from 'react';
import { X, Check, Coffee, Ruler, DollarSign, Image as ImageIcon, Tag, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Product>) => Promise<void>;
  initialData?: Product | null;
  mode: 'create' | 'edit';
}

type TabType = 'identity' | 'pricing' | 'coffee' | 'dimensions' | 'media';

export function ProductFormModal({ isOpen, onClose, onSubmit, initialData, mode }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Artisan Roasters');
  const [category, setCategory] = useState('single_estate');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [price, setPrice] = useState(550);
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>('');
  const [inStock, setInStock] = useState(true);
  const [badge, setBadge] = useState('');
  const [taxCategory, setTaxCategory] = useState('single_estate');

  const isCoffee = ['single_estate', 'producer_series', 'blends', 'coffee_beans'].includes(category);
  
  // Dimensions & Clearances
  const [widthCm, setWidthCm] = useState(10);
  const [heightCm, setHeightCm] = useState(20);
  const [depthCm, setDepthCm] = useState(6);
  const [weightKg, setWeightKg] = useState<number | ''>(0.25);
  const [topClearanceCm, setTopClearanceCm] = useState(0);
  const [sideClearanceCm, setSideClearanceCm] = useState(0);
  const [rearClearanceCm, setRearClearanceCm] = useState(0);

  // Coffee Specifics
  const [roastLevel, setRoastLevel] = useState('Medium Light');
  const [estate, setEstate] = useState('Baarbara Estate, Chikmagalur');
  const [altitude, setAltitude] = useState('1,450 MASL');
  const [process, setProcess] = useState('Whiskey Barrel Washed');
  const [tasteNotes, setTasteNotes] = useState<string[]>(['Ripe Banana', 'Red Plum']);
  const [noteInput, setNoteInput] = useState('');

  // Media & Description
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80');
  const [cutoutUrl, setCutoutUrl] = useState('');
  const [description, setDescription] = useState('');

  // Initialize or reset form
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name || '');
      setSku(initialData.sku || '');
      setBrand(initialData.brand || 'Artisan Roasters');
      setCategory(initialData.category || 'single_estate');
      setStatus(initialData.status || 'active');
      setPrice(initialData.price || 0);
      setCompareAtPrice(initialData.compare_at_price ?? '');
      setInStock(initialData.in_stock ?? true);
      setBadge(initialData.badge || '');
      setTaxCategory(initialData.tax_category || 'single_estate');
      setWidthCm(initialData.width_cm || 0);
      setHeightCm(initialData.height_cm || 0);
      setDepthCm(initialData.depth_cm || 0);
      setWeightKg(initialData.weight_kg ?? '');
      setTopClearanceCm(initialData.top_clearance_cm || 0);
      setSideClearanceCm(initialData.side_clearance_cm || 0);
      setRearClearanceCm(initialData.rear_clearance_cm || 0);
      setImageUrl(initialData.image_url || '');
      setCutoutUrl(initialData.cutout_url || '');
      setDescription(initialData.description || '');

      // Direct coffee attributes
      if (initialData.roast_level) setRoastLevel(initialData.roast_level);
      if (initialData.estate_name) setEstate(initialData.estate_name);
      if (initialData.process_method) setProcess(initialData.process_method);
      if (initialData.elevation_m) setAltitude(`${initialData.elevation_m} MASL`);

      // Parse taste notes
      if (Array.isArray(initialData.taste_notes) && initialData.taste_notes.length > 0) {
        setTasteNotes(initialData.taste_notes);
      } else if (initialData.taste_notes_json) {
        try {
          const parsed = JSON.parse(initialData.taste_notes_json);
          if (Array.isArray(parsed)) setTasteNotes(parsed);
        } catch {}
      }

      // Parse specs JSON fallback
      if (initialData.specs_json) {
        try {
          const specs = JSON.parse(initialData.specs_json);
          if (!initialData.roast_level && (specs.RoastLevel || specs['Roast Level'])) setRoastLevel(specs.RoastLevel || specs['Roast Level']);
          if (!initialData.estate_name && (specs.Estate || specs.Origin)) setEstate(specs.Estate || specs.Origin);
          if (!initialData.elevation_m && specs.Altitude) setAltitude(specs.Altitude);
          if (!initialData.process_method && specs.Process) setProcess(specs.Process);
        } catch {}
      }
    } else {
      // Reset for create
      setName('');
      setSku('');
      setBrand('Artisan Roasters');
      setCategory('single_estate');
      setStatus('active');
      setPrice(550);
      setCompareAtPrice('');
      setInStock(true);
      setBadge('NEW');
      setTaxCategory('single_estate');
      setWidthCm(10);
      setHeightCm(20);
      setDepthCm(6);
      setWeightKg(0.25);
      setTopClearanceCm(0);
      setSideClearanceCm(0);
      setRearClearanceCm(0);
      setImageUrl('https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80');
      setCutoutUrl('');
      setDescription('Single origin specialty harvest batch-roasted fresh weekly at Artisan Roasters.');
      setTasteNotes(['Hazelnut', 'Dark Chocolate', 'Caramel']);
      setRoastLevel('Medium');
      setEstate('Attikan Estate, BR Hills');
      setAltitude('1,600 MASL');
      setProcess('Pulp Sun-Dried');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleAddNote = () => {
    if (noteInput.trim() && !tasteNotes.includes(noteInput.trim())) {
      setTasteNotes([...tasteNotes, noteInput.trim()]);
      setNoteInput('');
    }
  };

  const handleRemoveNote = (note: string) => {
    setTasteNotes(tasteNotes.filter((n) => n !== note));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      setActiveTab('identity');
      return;
    }
    if (mode === 'edit' && !sku.trim()) {
      setError('SKU is required when editing');
      setActiveTab('identity');
      return;
    }

    setSubmitting(true);
    setError(null);

    const specsObj: Record<string, string> = {};
    if (category === 'coffee_beans' || category === 'single_estate' || category === 'producer_series' || category === 'blends') {
      if (estate) specsObj['Estate'] = estate;
      if (altitude) specsObj['Altitude'] = altitude;
      if (roastLevel) specsObj['Roast Level'] = roastLevel;
      if (process) specsObj['Process'] = process;
    } else {
      specsObj['Dimensions'] = `${widthCm} x ${heightCm} x ${depthCm} cm`;
      if (topClearanceCm > 0) {
        specsObj['Clearance'] = `Requires ${heightCm + topClearanceCm} cm total vertical headroom`;
      }
    }

    const payload: Partial<Product> = {
      name: name.trim(),
      sku: sku.trim() ? sku.trim().toUpperCase() : undefined,
      brand: brand.trim(),
      category,
      status,
      price: Number(price),
      compare_at_price: compareAtPrice === '' ? null : Number(compareAtPrice),
      in_stock: inStock,
      badge: badge.trim() || null,
      tax_category: taxCategory,
      width_cm: Number(widthCm) || 0,
      height_cm: Number(heightCm) || 0,
      depth_cm: Number(depthCm) || 0,
      weight_kg: weightKg === '' ? null : Number(weightKg),
      top_clearance_cm: Number(topClearanceCm) || 0,
      side_clearance_cm: Number(sideClearanceCm) || 0,
      rear_clearance_cm: Number(rearClearanceCm) || 0,
      image_url: imageUrl.trim() || null,
      cutout_url: cutoutUrl.trim() || null,
      description: description.trim() || null,
      roast_level: roastLevel ? roastLevel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') : null,
      process_method: process ? process.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') : null,
      estate_name: estate || null,
      taste_notes: tasteNotes,
      taste_notes_json: JSON.stringify(tasteNotes),
      specs_json: JSON.stringify(specsObj),
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const totalRequiredHeight = Number(heightCm) + Number(topClearanceCm);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                {mode === 'create' ? 'Configure New Product' : `Edit Product: ${initialData?.name}`}
              </h2>
              <p className="text-xs text-slate-500">
                Configure commercial attributes, coffee roast specs, and CounterCheck™ clearance dimensions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'identity'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            1. Identity & Classification
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            2. Pricing & Stock
          </button>

          {isCoffee && (
            <button
              type="button"
              onClick={() => setActiveTab('coffee')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'coffee'
                  ? 'border-amber-800 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Coffee className="w-4 h-4" />
              3. Coffee Roastery Specs
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('dimensions')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'dimensions'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
            {isCoffee ? '4. Package Size' : '3. CounterCheck™ Clearances'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Media & Content
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: IDENTITY */}
          {activeTab === 'identity' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Product Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Baarbara Estate - Whiskey Barrel Aged"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  SKU (Stock Keeping Unit) {mode === 'edit' && '*'}
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder={mode === 'create' ? 'Leave blank to auto-generate (e.g. HJ-BAARBARA-250)' : 'e.g. HJ-BAARBARA-250'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 uppercase font-mono"
                  required={mode === 'edit'}
                />
                {mode === 'create' && (
                  <span className="text-[11px] text-slate-400 block">
                    Optional: Leave blank for automated SKU generation (Format: HJ-DESCRIPTOR-SIZE)
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Brand / Roastery</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Artisan Roasters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
                >
                  <option value="single_estate">Single Estate (Terroir-specific)</option>
                  <option value="producer_series">Producer Series (Limited nano-lots)</option>
                  <option value="blends">Artisan Roaster Blends</option>
                  <option value="equipment">CounterCheck™ Equipment & Brewing Gear</option>
                  <option value="coffee_beans">Specialty Coffee Beans (General)</option>
                  <option value="espresso_machine">Espresso Machines</option>
                  <option value="grinder">Burr Grinders</option>
                  <option value="drinkware">Barista Drinkware & Accessories</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Lifecycle Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white font-medium"
                >
                  <option value="active">Active (Published to Store)</option>
                  <option value="draft">Draft (Hidden from Catalog)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tax Code / Category</label>
                <select
                  value={taxCategory}
                  onChange={(e) => setTaxCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
                >
                  <option value="coffee_beans">Roasted Coffee Beans (HSN 0901 - 5% GST / Reduced VAT)</option>
                  <option value="equipment">Kitchen Appliances (HSN 8419 - 18% GST / Standard VAT)</option>
                  <option value="accessories">Drinkware & Accessories (Standard)</option>
                  <option value="exempt">Tax Exempt (Gift Cards / Digital)</option>
                </select>
                <p className="text-[11px] text-slate-400">Used by checkout & order-service for automated tax rate resolution.</p>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STOCK */}
          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Selling Price (INR ₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Compare-At Price (MSRP Strikethrough)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="Optional original price"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Promotional Badge</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
                >
                  <option value="">None</option>
                  <option value="EXCLUSIVE HARVEST">EXCLUSIVE HARVEST</option>
                  <option value="BESTSELLER">BESTSELLER</option>
                  <option value="NEW">NEW</option>
                  <option value="FLAGSHIP GEAR">FLAGSHIP GEAR</option>
                  <option value="PRECISION BURR">PRECISION BURR</option>
                  <option value="SAVE 15%">SAVE 15%</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-center">
                <label className="text-xs font-bold text-slate-700">Inventory Status</label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      inStock ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        inStock ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-slate-800">
                    {inStock ? 'In Stock (Available on Store)' : 'Out of Stock (Shows "Sold Out")'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COFFEE ROASTERY SPECS */}
          {activeTab === 'coffee' && isCoffee && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Roast Level</label>
                  <select
                    value={roastLevel}
                    onChange={(e) => setRoastLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
                  >
                    <option value="Light">Light (Fruity & Floral)</option>
                    <option value="Medium Light">Medium Light (Balanced Acidity)</option>
                    <option value="Medium">Medium (Sweet & Smooth)</option>
                    <option value="Medium Dark">Medium Dark (Rich Caramel)</option>
                    <option value="Dark Espresso">Dark Espresso (Heavy Crema)</option>
                    <option value="Vienna Dark">Vienna Dark (Deep & Smoky)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Processing Method</label>
                  <input
                    type="text"
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                    placeholder="e.g. Whiskey Barrel Washed, Pulp Sun-Dried"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Estate / Origin</label>
                  <input
                    type="text"
                    value={estate}
                    onChange={(e) => setEstate(e.target.value)}
                    placeholder="e.g. Baarbara Estate, Chikmagalur"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Altitude</label>
                  <input
                    type="text"
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    placeholder="e.g. 1,450 MASL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
              </div>

              {/* Tasting Notes Tag Manager */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700">Flavor & Tasting Notes (Chips)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    placeholder="Type flavor note (e.g. Honey, Plum, Hazelnut) and press Enter"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Add Chip
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tasteNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => handleRemoveNote(note)}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COUNTERCHECK DIMENSIONS & CLEARANCE */}
          {activeTab === 'dimensions' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <Ruler className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">CounterCheck™ Dimensions & Clearance Rules</span>
                  <p className="text-amber-800/90 leading-relaxed">
                    Enter physical appliance measurements and required operational headroom (such as top lid opening, bean hopper refilling, and side/rear heat dissipation).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Width (cm) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={widthCm}
                    onChange={(e) => setWidthCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Height (cm) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Depth (cm) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={depthCm}
                    onChange={(e) => setDepthCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Top Clearance Headroom (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={topClearanceCm}
                    onChange={(e) => setTopClearanceCm(parseFloat(e.target.value) || 0)}
                    placeholder="For hopper / lid"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Side Clearance (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sideClearanceCm}
                    onChange={(e) => setSideClearanceCm(parseFloat(e.target.value) || 0)}
                    placeholder="For ventilation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Rear Clearance (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rearClearanceCm}
                    onChange={(e) => setRearClearanceCm(parseFloat(e.target.value) || 0)}
                    placeholder="For airflow / power cables"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
              </div>

              {/* Total Space Summary Banner */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">Total Vertical Clearance Required: </span>
                  <span className="font-extrabold text-amber-900 text-sm">{totalRequiredHeight.toFixed(1)} cm</span>
                  <span className="text-slate-500 block text-[11px]">
                    (Base appliance: {heightCm} cm + Top headroom: {topClearanceCm} cm)
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                  totalRequiredHeight <= 45 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {totalRequiredHeight <= 45 ? '✓ Fits Standard 45cm Cabinets' : '⚠ High Clearance Warning'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA & DESCRIPTION */}
          {activeTab === 'media' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">High-Res Product Photograph URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Transparent Cutout PNG URL (Optional)</label>
                    <input
                      type="url"
                      value={cutoutUrl}
                      onChange={(e) => setCutoutUrl(e.target.value)}
                      placeholder="https://.../cutout.png"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                    />
                  </div>
                </div>

                {/* Live Image Preview */}
                <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Live Photo Preview</span>
                  {imageUrl ? (
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-white">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      {badge && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-slate-900 text-[9px] font-black rounded-sm tracking-wider">
                          {badge}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                      No Image URL
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700">Product Story & Roastery Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe bean provenance, roast notes, or machine capabilities..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {mode === 'create' ? 'Configuring new SKU' : `SKU: ${sku}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {submitting ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

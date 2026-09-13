import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Check,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  Monitor,
  Smartphone,
  Coffee,
  ShoppingBag,
  Star,
  ExternalLink,
  Flame,
  Layers,
  Sliders,
  Type,
  Maximize2,
  CheckCheck,
} from 'lucide-react';
import {
  ThemeConfig,
  ThemePreset,
  ThemeMode,
  FontFamily,
  BorderRadius,
  GlobalShellConfig,
} from '../../types/cms';
import {
  DEFAULT_THEME_PRESETS,
  fetchTheme,
  fetchThemePresets,
  saveTheme,
} from '../../providers/cmsDataProvider';

interface ThemeConfigViewProps {
  shell: GlobalShellConfig;
  onUpdateShellTheme: (theme: ThemeConfig) => void;
  showToast: (msg: string) => void;
}

const PRESET_METADATA: Record<
  ThemePreset,
  {
    title: string;
    tagline: string;
    description: string;
    swatches: string[];
    vibe: string;
  }
> = {
  alpine: {
    title: 'Hill Jhil Alpine Tarn (Official)',
    tagline: 'Himalayan Mountain & Alpine Glacial Tarn',
    description: 'Extracted directly from the official Hill Jhil crest: Deep alpine spruce (#085454), glacial lake turquoise (#0d9488), and crisp snow mist (#f0fdfa).',
    swatches: ['#085454', '#0d9488', '#2dd4bf', '#f0fdfa'],
    vibe: 'Official Brand Crest',
  },
  amber: {
    title: 'Warm Amber Roast',
    tagline: 'Classic Specialty Roastery',
    description: 'Rich amber-800 brand tones with honey accents and warm cream canvas. Ideal for artisanal micro-lots.',
    swatches: ['#92400e', '#f59e0b', '#fbf9f6', '#1c1917'],
    vibe: 'Flagship Roastery',
  },
  espresso: {
    title: 'Midnight Espresso',
    tagline: 'Modern Dark Barista Aesthetic',
    description: 'Deep espresso noir with warm caramel accents and charcoal surfaces. Designed for sleek nighttime appeal.',
    swatches: ['#1c1917', '#d97706', '#09090b', '#f4f4f5'],
    vibe: 'Contemporary Bar',
  },
  emerald: {
    title: 'Highland Emerald',
    tagline: 'Single Origin & Estate Harvest',
    description: 'Deep rainforest green with fresh mint highlights and light sage surfaces. Emphasizes organic estate farming.',
    swatches: ['#064e3b', '#10b981', '#f0fdf4', '#064e3b'],
    vibe: 'Organic Terroir',
  },
  crimson: {
    title: 'Berry Crimson Velvet',
    tagline: 'Anaerobic Nano-Lots & Seasonal Editions',
    description: 'Luxurious ruby tones paired with wild berry pink accents. Perfect for holiday releases and high-altitude lots.',
    swatches: ['#881337', '#f43f5e', '#fff1f2', '#4c0519'],
    vibe: 'Limited Edition',
  },
  slate: {
    title: 'Modern Minimal Slate',
    tagline: 'Scandinavian Precision Equipment',
    description: 'Crisp monochromatic slate palette with cool stone accents and pure white canvas. Built for espresso machines & gear.',
    swatches: ['#0f172a', '#64748b', '#f8fafc', '#0f172a'],
    vibe: 'Precision Lab',
  },
};

const FONT_OPTIONS: { id: FontFamily; label: string; preview: string; cssClass: string }[] = [
  { id: 'serif', label: 'Classic Roastery Serif', preview: 'Hiljhil Coffee', cssClass: 'font-serif' },
  { id: 'sans', label: 'Clean Modern Sans', preview: 'Hiljhil Coffee', cssClass: 'font-sans' },
  { id: 'mono', label: 'Technical Roast Mono', preview: 'Hiljhil Coffee', cssClass: 'font-mono' },
];

const RADIUS_OPTIONS: { id: BorderRadius; label: string; class: string }[] = [
  { id: 'rounded-none', label: 'Sharp (0px)', class: 'rounded-none' },
  { id: 'rounded-lg', label: 'Subtle (8px)', class: 'rounded-lg' },
  { id: 'rounded-xl', label: 'Standard (12px)', class: 'rounded-xl' },
  { id: 'rounded-2xl', label: 'Curved (16px)', class: 'rounded-2xl' },
  { id: 'rounded-full', label: 'Pill / Smooth', class: 'rounded-full' },
];

export function ThemeConfigView({
  shell,
  onUpdateShellTheme,
  showToast,
}: ThemeConfigViewProps) {
  const [presets, setPresets] = useState<Record<ThemePreset, ThemeConfig>>(DEFAULT_THEME_PRESETS);
  const [theme, setTheme] = useState<ThemeConfig>(
    () => shell.theme || DEFAULT_THEME_PRESETS.alpine
  );
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'draft'>('synced');
  const [addedMockCart, setAddedMockCart] = useState(false);

  // Fetch presets from PostgreSQL via content-service on mount
  useEffect(() => {
    fetchThemePresets()
      .then((presetList) => {
        if (presetList && presetList.length > 0) {
          const map = { ...DEFAULT_THEME_PRESETS };
          for (const p of presetList) {
            if (p.preset) {
              map[p.preset as ThemePreset] = p;
            }
          }
          setPresets(map);
        }
      })
      .catch((err) => {
        console.warn('Failed to load theme presets from content-service:', err);
      });
  }, []);

  useEffect(() => {
    if (shell.theme) {
      setTheme(shell.theme);
    }
  }, [shell.theme]);

  const handleApplyPreset = (presetKey: ThemePreset) => {
    const base = presets[presetKey] || DEFAULT_THEME_PRESETS[presetKey];
    const updated: ThemeConfig = {
      ...base,
      id: `theme_${presetKey}`,
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    setTheme(updated);
    setSyncStatus('draft');
    showToast(`Applied preset "${PRESET_METADATA[presetKey]?.title || presetKey}". Click Publish to make it live.`);
  };

  const handleUpdateField = <K extends keyof ThemeConfig>(field: K, value: ThemeConfig[K]) => {
    setTheme((prev) => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString(),
    }));
    setSyncStatus('draft');
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const result = await saveTheme(theme);
      onUpdateShellTheme(theme);
      setSyncStatus(result.syncedToApi ? 'synced' : 'draft');
      if (result.syncedToApi) {
        showToast('Store theme published & synced to Cloud Run successfully!');
      } else {
        showToast('Store theme saved locally (offline mode).');
      }
    } catch (err) {
      console.error('Failed publishing theme:', err);
      showToast('Error saving theme. Check network connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToPreset = () => {
    handleApplyPreset(theme.preset || 'amber');
    showToast('Reset theme values back to preset defaults.');
  };

  const handleSyncFromApi = async () => {
    setIsSyncing(true);
    try {
      const fetched = await fetchTheme();
      setTheme(fetched);
      onUpdateShellTheme(fetched);
      setSyncStatus('synced');
      showToast('Synced latest theme configuration from content-service.');
    } catch (err) {
      console.warn('Failed syncing theme from API:', err);
      showToast('Could not fetch from server, retained current settings.');
    } finally {
      setIsSyncing(false);
    }
  };

  const STORE_URL = import.meta.env.VITE_STORE_URL || 'https://mycommerce-phi.vercel.app';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Action Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Theme:
          </span>
          <span
            className="px-2.5 py-0.5 text-xs font-bold rounded-md"
            style={{
              backgroundColor: `${theme.accent_color}25`,
              color: theme.primary_color,
              border: `1px solid ${theme.primary_color}40`,
            }}
          >
            {PRESET_METADATA[theme.preset]?.title || theme.name}
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            ({PRESET_METADATA[theme.preset]?.vibe || 'Preset'})
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncFromApi}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="Fetch live theme from content-service"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync API</span>
          </button>

          <button
            type="button"
            onClick={handleResetToPreset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Reset to default values of selected preset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer hover:opacity-95 disabled:opacity-50"
            style={{ backgroundColor: theme.primary_color }}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Live Responsive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preset Gallery & Customization Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Curated Presets Carousel / Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Curated Brand Presets
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {Object.keys(PRESET_METADATA).length} Roastery Palettes Available (Postgres Synced)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(Object.keys(PRESET_METADATA) as ThemePreset[]).map((pKey) => {
                const meta = PRESET_METADATA[pKey];
                const isSelected = theme.preset === pKey;
                const presetDefault = presets[pKey] || DEFAULT_THEME_PRESETS[pKey];

                return (
                  <div
                    key={pKey}
                    onClick={() => handleApplyPreset(pKey)}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer text-left group ${
                      isSelected
                        ? 'border-amber-800 ring-2 ring-amber-800/20 bg-amber-50/40 shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{meta.title}</span>
                          {isSelected && (
                            <span className="p-0.5 rounded-full bg-amber-800 text-white">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{meta.tagline}</p>
                      </div>

                      {/* Color swatch dots */}
                      <div className="flex items-center -space-x-1 shrink-0">
                        {meta.swatches.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      {meta.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        {presetDefault.font_family} · {presetDefault.mode}
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 group-hover:underline">
                        {isSelected ? 'Active Preset' : 'Apply'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Color Palette & Accent Fine-Tuning */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Color Palette & Accent Controls
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Primary Brand Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Primary Brand Tone</span>
                  <span className="font-mono text-[11px] text-slate-400">{theme.primary_color}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primary_color}
                    onChange={(e) => handleUpdateField('primary_color', e.target.value)}
                    className="w-11 h-11 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-2xs"
                  />
                  <input
                    type="text"
                    value={theme.primary_color}
                    onChange={(e) => handleUpdateField('primary_color', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800"
                    placeholder="#92400e"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {['#92400e', '#1c1917', '#064e3b', '#881337', '#0f172a', '#4338ca'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleUpdateField('primary_color', c)}
                      className="w-5 h-5 rounded-full border border-slate-200 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: c }}
                      title={`Select ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Accent / CTA Highlight Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Accent / CTA Highlight</span>
                  <span className="font-mono text-[11px] text-slate-400">{theme.accent_color}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.accent_color}
                    onChange={(e) => handleUpdateField('accent_color', e.target.value)}
                    className="w-11 h-11 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-2xs"
                  />
                  <input
                    type="text"
                    value={theme.accent_color}
                    onChange={(e) => handleUpdateField('accent_color', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800"
                    placeholder="#f59e0b"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {['#f59e0b', '#d97706', '#10b981', '#f43f5e', '#64748b', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleUpdateField('accent_color', c)}
                      className="w-5 h-5 rounded-full border border-slate-200 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: c }}
                      title={`Select ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Background Canvas Tint */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Store Canvas Background</span>
                  <span className="font-mono text-[11px] text-slate-400">{theme.background_color}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.background_color}
                    onChange={(e) => handleUpdateField('background_color', e.target.value)}
                    className="w-11 h-11 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-2xs"
                  />
                  <input
                    type="text"
                    value={theme.background_color}
                    onChange={(e) => handleUpdateField('background_color', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800"
                    placeholder="#fbf9f6"
                  />
                </div>
              </div>

              {/* Surface Container Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Surface Card Background</span>
                  <span className="font-mono text-[11px] text-slate-400">{theme.surface_color}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.surface_color}
                    onChange={(e) => handleUpdateField('surface_color', e.target.value)}
                    className="w-11 h-11 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-2xs"
                  />
                  <input
                    type="text"
                    value={theme.surface_color}
                    onChange={(e) => handleUpdateField('surface_color', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Typography & Elevation Geometry */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Typography & Corner Geometry
              </h2>
            </div>

            <div className="space-y-4">
              {/* Font Family Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Brand Typography</label>
                <div className="grid grid-cols-3 gap-3">
                  {FONT_OPTIONS.map((f) => {
                    const isSelected = theme.font_family === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleUpdateField('font_family', f.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-800 bg-amber-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="text-[11px] font-bold text-slate-700">{f.label}</p>
                        <p className={`text-sm mt-1 font-bold text-slate-900 ${f.cssClass}`}>
                          {f.preview}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Border Radius Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Component Border Radius</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {RADIUS_OPTIONS.map((r) => {
                    const isSelected = theme.border_radius === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleUpdateField('border_radius', r.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campaign / Seasonal Badge Text */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Seasonal Campaign Badge Label</label>
                <input
                  type="text"
                  value={theme.badge_text || ''}
                  onChange={(e) => handleUpdateField('badge_text', e.target.value)}
                  placeholder="e.g. AUTUMN HARVEST, DIWALI SPECIAL, NANO-LOT"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Store Preview */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Live Store Preview
                </h3>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                  }`}
                  title="Desktop scale"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                  }`}
                  title="Mobile scale"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Store Container */}
            <div
              className={`border border-slate-200 overflow-hidden transition-all duration-300 mx-auto ${
                previewDevice === 'mobile' ? 'max-w-[320px] rounded-3xl shadow-lg' : 'w-full rounded-2xl shadow-xs'
              }`}
              style={{
                backgroundColor: theme.background_color,
                color: theme.text_color,
                fontFamily:
                  theme.font_family === 'serif'
                    ? 'Georgia, Cambria, serif'
                    : theme.font_family === 'mono'
                    ? 'Courier New, monospace'
                    : 'inherit',
              }}
            >
              {/* 1. Simulated Promo Bar */}
              <div
                className="px-3 py-2 text-[10px] font-bold text-center flex items-center justify-center gap-2 transition-colors"
                style={{
                  backgroundColor: theme.primary_color,
                  color: '#ffffff',
                }}
              >
                {theme.badge_text && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider"
                    style={{
                      backgroundColor: theme.accent_color,
                      color: theme.primary_color,
                    }}
                  >
                    {theme.badge_text}
                  </span>
                )}
                <span className="truncate">Complimentary express shipping on orders over ₹1,500</span>
              </div>

              {/* 2. Simulated Navigation Header */}
              <div className="p-3 bg-white/90 backdrop-blur-xs border-b border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.jpg"
                    alt="Hill Jhil"
                    className="w-8 h-8 rounded-full object-cover border-2 shadow-xs shrink-0"
                    style={{ borderColor: theme.primary_color }}
                  />
                  <div>
                    <div className="text-xs font-bold leading-tight" style={{ color: theme.primary_color }}>
                      Hill Jhil
                    </div>
                    <div className="text-[9px] text-slate-400">Specialty Coffee & Alpine Roasters</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShoppingBag className="w-3 h-3 text-slate-600" />
                  </div>
                </div>
              </div>

              {/* 3. Simulated Product Showcase Card */}
              <div className="p-4 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Featured Micro-Lot Lot
                </div>

                <div
                  className={`p-3.5 border transition-all duration-200 shadow-xs ${
                    theme.border_radius === 'rounded-none'
                      ? 'rounded-none'
                      : theme.border_radius === 'rounded-lg'
                      ? 'rounded-lg'
                      : theme.border_radius === 'rounded-xl'
                      ? 'rounded-xl'
                      : theme.border_radius === 'rounded-2xl'
                      ? 'rounded-2xl'
                      : 'rounded-3xl'
                  }`}
                  style={{
                    backgroundColor: theme.surface_color,
                    borderColor: `${theme.primary_color}25`,
                  }}
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80"
                      alt="Ethiopian Guji Single Origin"
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white shadow-xs"
                      style={{ backgroundColor: theme.primary_color }}
                    >
                      DIRECT TRADE
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="text-[10px] font-bold text-slate-600 ml-1">4.9</span>
                    </div>

                    <h4 className="text-xs font-bold leading-snug" style={{ color: theme.primary_color }}>
                      Ethiopian Guji Single Origin (250g)
                    </h4>

                    <p className="text-[10px] text-slate-500 line-clamp-2">
                      Heirloom natural lot from Shakiso. Notes of wild lavender, ripe nectarine, and bergamot tea.
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] text-slate-400 line-through">₹1,100</div>
                        <div className="text-sm font-black" style={{ color: theme.primary_color }}>
                          ₹950.00
                        </div>
                      </div>

                      {/* Interactive Add to Bag Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setAddedMockCart(true);
                          setTimeout(() => setAddedMockCart(false), 2500);
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 ${
                          theme.border_radius === 'rounded-none'
                            ? 'rounded-none'
                            : theme.border_radius === 'rounded-lg'
                            ? 'rounded-lg'
                            : theme.border_radius === 'rounded-xl'
                            ? 'rounded-xl'
                            : 'rounded-full'
                        }`}
                        style={{
                          backgroundColor: addedMockCart ? '#10b981' : theme.primary_color,
                        }}
                      >
                        {addedMockCart ? (
                          <>
                            <CheckCheck className="w-3 h-3" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Simulated Footer Snippet */}
              <div className="p-3 bg-slate-900 text-slate-400 text-[9px] text-center border-t border-slate-800">
                © 2026 Hiljhil Roasters Co. · Styled with {PRESET_METADATA[theme.preset]?.title}
              </div>
            </div>

            {/* Direct Link to Store */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Inspect full experience in new tab:</span>
              <a
                href={STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-800 hover:underline"
              >
                <span>Live Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


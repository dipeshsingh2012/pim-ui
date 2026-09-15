import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Coffee,
  Search,
  ShoppingBag,
  Star,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Globe,
  Layers,
  RotateCw,
  Lock,
} from 'lucide-react';
import { CMSPage, GlobalShellConfig, ThemeColor } from '../../types/cms';

interface StorePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: CMSPage | null;
  shell: GlobalShellConfig;
}

const THEME_STYLES: Record<ThemeColor, { bg: string; text: string; badgeBg: string }> = {
  amber: {
    bg: 'bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900',
    text: 'text-amber-100',
    badgeBg: 'bg-amber-600/60 text-amber-200 border-amber-500/40',
  },
  espresso: {
    bg: 'bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950',
    text: 'text-stone-200',
    badgeBg: 'bg-amber-800/60 text-amber-300 border-amber-700/50',
  },
  emerald: {
    bg: 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950',
    text: 'text-emerald-100',
    badgeBg: 'bg-emerald-700/60 text-emerald-200 border-emerald-500/40',
  },
  crimson: {
    bg: 'bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950',
    text: 'text-rose-100',
    badgeBg: 'bg-rose-700/60 text-rose-200 border-rose-500/40',
  },
  slate: {
    bg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900',
    text: 'text-slate-100',
    badgeBg: 'bg-slate-700 text-slate-200 border-slate-600',
  },
};

export function StorePreviewModal({
  isOpen,
  onClose,
  page,
  shell,
}: StorePreviewModalProps) {
  if (!isOpen || !page) return null;

  const [previewMode, setPreviewMode] = useState<'iframe' | 'simulator'>('iframe');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);

  const DEFAULT_STORE_URL = import.meta.env.VITE_STORE_URL || 'https://hilljhil.cafe';
  const [storeBaseUrl, setStoreBaseUrl] = useState<string>(() => {
    const cached = localStorage.getItem('pim_store_url');
    if (cached && !cached.includes('vercel.app') && !cached.includes('localhost')) {
      return cached;
    }
    return DEFAULT_STORE_URL;
  });

  const [urlInputValue, setUrlInputValue] = useState<string>('');
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);

  const viewportWidths = {
    desktop: 'max-w-6xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  };

  const getTargetUrl = (base = storeBaseUrl) => {
    const cleanBase = base.replace(/\/$/, '');
    let slug = page.slug || '/';
    if (page.page_type === 'product' && (slug === '/products/:id' || slug === '/product/:id' || slug.includes(':id'))) {
      slug = '/product/prod_breville_barista_touch';
    }
    const cleanSlug = slug.replace(/^#\/?/, '/');
    if (cleanSlug === '/' || cleanSlug === '') {
      return `${cleanBase}/`;
    }
    return `${cleanBase}${cleanSlug.startsWith('/') ? cleanSlug : `/${cleanSlug}`}`;
  };

  const currentUrl = getTargetUrl(storeBaseUrl);

  const handleUpdateStoreBaseUrl = (newBase: string) => {
    let trimmed = newBase.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      const isLocal = trimmed.includes('localhost') || trimmed.includes('127.0.0.1');
      trimmed = isLocal ? `http://${trimmed}` : `https://${trimmed}`;
    }
    try {
      const parsed = new URL(trimmed);
      trimmed = `${parsed.protocol}//${parsed.host}`;
    } catch {}
    setStoreBaseUrl(trimmed);
    localStorage.setItem('pim_store_url', trimmed);
    setIsEditingUrl(false);
    setIsLoadingIframe(true);
    setIframeKey((k) => k + 1);
  };

  const activeSections = page.sections.filter((s) => s.is_active);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm">
      {/* Top Controller Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between text-white shrink-0 gap-4">
        {/* Left: Title & Page Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-sm">Store Preview</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-mono border border-slate-700">
            {page.title} ({page.slug})
          </span>
        </div>

        {/* Center: Mode Switcher & Viewport Switcher */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setPreviewMode('iframe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'iframe'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Live Store via iframe"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Store (iFrame)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === 'simulator'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Interactive CMS Simulator canvas"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CMS Simulator</span>
            </button>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewport === 'desktop' ? 'bg-amber-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewport === 'tablet' ? 'bg-amber-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewport === 'mobile' ? 'bg-amber-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: External Link & Close */}
        <div className="flex items-center gap-3">
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-800/60 px-3 py-1.5 rounded-xl transition-colors"
            title="Open in new browser tab"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Viewport Frame Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start bg-slate-950">
        {previewMode === 'iframe' ? (
          <div className="w-full flex flex-col items-center gap-3">
            {/* Device Frame */}
            <div
              className={`w-full ${viewportWidths[viewport]} bg-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-slate-700 flex flex-col transition-all duration-300 ${
                viewport === 'mobile'
                  ? 'h-[760px] border-4 border-slate-800 rounded-[36px]'
                  : viewport === 'tablet'
                  ? 'h-[82vh] border-4 border-slate-800 rounded-3xl'
                  : 'h-[82vh]'
              }`}
            >
              {/* Browser Address Bar Chrome */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 select-none shrink-0 gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (urlInputValue.trim()) {
                      handleUpdateStoreBaseUrl(urlInputValue);
                    } else {
                      setIsEditingUrl(false);
                    }
                  }}
                  className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-300 flex-1 max-w-xl mx-auto focus-within:border-amber-600 transition-colors"
                >
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  {isEditingUrl ? (
                    <input
                      type="text"
                      autoFocus
                      value={urlInputValue}
                      onChange={(e) => setUrlInputValue(e.target.value)}
                      onBlur={() => {
                        if (urlInputValue.trim()) {
                          handleUpdateStoreBaseUrl(urlInputValue);
                        }
                        setIsEditingUrl(false);
                      }}
                      className="w-full bg-transparent border-0 text-white focus:outline-hidden text-[11px] font-mono"
                      placeholder="https://hilljhil.cafe"
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setUrlInputValue(storeBaseUrl);
                        setIsEditingUrl(true);
                      }}
                      className="truncate cursor-text flex-1 select-all hover:text-white"
                      title="Click to edit live deployed store host URL"
                    >
                      {currentUrl}
                    </span>
                  )}
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/40 shrink-0">
                    LIVE
                  </span>
                </form>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoadingIframe(true);
                      setIframeKey((k) => k + 1);
                    }}
                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Reload Store Frame"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isLoadingIframe ? 'animate-spin text-amber-400' : ''}`} />
                  </button>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                    title="Open Fullscreen in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Iframe Viewport Area */}
              <div className="relative flex-1 w-full h-full bg-white overflow-hidden">
                {isLoadingIframe && (
                  <div className="absolute inset-0 z-10 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-slate-300">
                    <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <div className="text-xs font-semibold">
                      Connecting to live deployed store at <span className="font-mono text-amber-300">{currentUrl}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Live Host: <span className="font-mono text-slate-300">{storeBaseUrl}</span>
                    </p>
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={currentUrl}
                  onLoad={(e) => {
                    setIsLoadingIframe(false);
                    try {
                      const iframe = e.currentTarget;
                      if (shell.theme) {
                        iframe.contentWindow?.postMessage({ type: 'PIM_THEME_UPDATED', theme: shell.theme }, '*');
                      }
                    } catch {}
                  }}
                  className="w-full h-full border-0 bg-white"
                  title="Live Store Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                />
              </div>
            </div>

            {/* Bottom Info Banner */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl backdrop-blur-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  Rendering live deployed store app from{' '}
                  <span className="font-mono text-slate-200 font-bold">{storeBaseUrl}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    const entered = prompt('Enter custom deployed Store URL:', storeBaseUrl);
                    if (entered) handleUpdateStoreBaseUrl(entered);
                  }}
                  className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Change Host URL
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('simulator')}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>Switch to CMS Simulator</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`w-full ${viewportWidths[viewport]} shadow-2xl rounded-2xl overflow-hidden border border-slate-800 flex flex-col transition-all duration-300 min-h-screen text-slate-900`}
            style={{
              backgroundColor: shell.theme?.background_color || '#ffffff',
              fontFamily:
                shell.theme?.font_family === 'serif'
                  ? 'Georgia, Cambria, serif'
                  : shell.theme?.font_family === 'mono'
                  ? 'Courier New, monospace'
                  : 'inherit',
            }}
          >
          {/* 1. TOP PROMO BAR */}
          {shell.promo_bar.enabled && (
            <div
              className={`py-2 px-4 text-center text-xs font-medium flex items-center justify-center gap-2 ${
                shell.theme ? '' : `${THEME_STYLES[shell.promo_bar.theme].bg} ${THEME_STYLES[shell.promo_bar.theme].text}`
              }`}
              style={
                shell.theme
                  ? {
                      backgroundColor: shell.theme.primary_color,
                      color: '#ffffff',
                    }
                  : undefined
              }
            >
              {shell.promo_bar.badge && (
                <span
                  className={`px-1.5 py-0.2 text-[9px] font-black uppercase rounded border ${
                    THEME_STYLES[shell.promo_bar.theme].badgeBg
                  }`}
                >
                  {shell.promo_bar.badge}
                </span>
              )}
              <span>{shell.promo_bar.text}</span>
              {shell.promo_bar.cta_text && (
                <span className="font-bold underline cursor-pointer inline-flex items-center gap-0.5">
                  {shell.promo_bar.cta_text}
                  <ChevronRight className="w-3 h-3" />
                </span>
              )}
            </div>
          )}

          {/* 2. HEADER */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src={shell.header.logo_url || '/logo.jpg'}
                alt={shell.header.brand_name}
                className="w-8 h-8 rounded-full object-cover border border-amber-800/30 shadow-xs shrink-0"
              />
              <div>
                <div className="font-bold text-slate-900 text-sm leading-tight">
                  {shell.header.brand_name}
                </div>
                <div className="text-[10px] text-slate-500">{shell.header.brand_tagline}</div>
              </div>
            </div>

            {/* Navigation Nodes */}
            <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-700">
              {shell.header.nodes.slice(0, 5).map((node) => (
                <span key={node.id} className="hover:text-amber-800 cursor-pointer flex items-center gap-1">
                  <span>{node.label}</span>
                  {node.badge && (
                    <span className="px-1 py-0.2 text-[8px] font-black rounded bg-amber-100 text-amber-900">
                      {node.badge}
                    </span>
                  )}
                </span>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-2">
              {shell.header.show_search && <Search className="w-4 h-4 text-slate-600" />}
              {shell.header.show_cart && (
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-slate-600" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-amber-700 text-white text-[9px] font-bold flex items-center justify-center">
                    2
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* 3. ASSEMBLED PAGE SECTIONS */}
          <main className="flex-1 space-y-12 pb-16">
            {activeSections.map((sec) => {
              const cfg = sec.config || {};

              // HERO BANNER
              if (sec.type === 'hero_banner') {
                return (
                  <div
                    key={sec.id}
                    className="relative bg-slate-900 text-white py-20 px-6 sm:px-12 overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundImage: `url(${cfg.background_image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-slate-950"
                      style={{ opacity: (cfg.overlay_opacity ?? 60) / 100 }}
                    />
                    <div
                      className={`relative z-10 max-w-2xl ${
                        cfg.text_align === 'left' ? 'text-left' : 'text-center'
                      } space-y-4`}
                    >
                      {cfg.badge && (
                        <span className="inline-block px-2.5 py-1 text-[11px] font-black uppercase tracking-widest rounded-md bg-amber-600 text-white shadow-xs">
                          {cfg.badge}
                        </span>
                      )}
                      <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
                        {cfg.headline || sec.title}
                      </h1>
                      {cfg.subheadline && (
                        <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
                          {cfg.subheadline}
                        </p>
                      )}
                      <div
                        className={`pt-2 flex flex-wrap items-center gap-3 ${
                          cfg.text_align === 'left' ? 'justify-start' : 'justify-center'
                        }`}
                      >
                        {cfg.primary_cta_text && (
                          <button
                            type="button"
                            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>{cfg.primary_cta_text}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {cfg.secondary_cta_text && (
                          <button
                            type="button"
                            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white border border-white/30 transition-all"
                          >
                            {cfg.secondary_cta_text}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              // CATEGORY LANE
              if (sec.type === 'category_lane') {
                const categories = (cfg.categories as any[]) || [];
                return (
                  <div key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 pt-6">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-slate-900">{sec.title}</h2>
                      {sec.subtitle && <p className="text-xs text-slate-500">{sec.subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-4 overflow-x-auto pb-3 scrollbar-none">
                      {categories.map((c, i) => (
                        <div
                          key={c.id || i}
                          className="flex flex-col items-center gap-2 text-center group cursor-pointer shrink-0"
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-700/20 shadow-xs group-hover:scale-105 transition-transform">
                            <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                            {c.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // CATEGORY GRID
              if (sec.type === 'category_grid') {
                const categories = (cfg.categories as any[]) || [];
                return (
                  <div key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 pt-6">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-slate-900">{sec.title}</h2>
                      {sec.subtitle && <p className="text-xs text-slate-500">{sec.subtitle}</p>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categories.map((c, i) => (
                        <div
                          key={c.id || i}
                          className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs group cursor-pointer"
                        >
                          <div className="h-32 w-full overflow-hidden bg-slate-100">
                            <img
                              src={c.image_url}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-3">
                            <span className="text-xs font-bold text-slate-900 block">{c.title}</span>
                            {c.badge && (
                              <span className="text-[10px] font-black uppercase text-amber-800">
                                {c.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // PRODUCT LANE / SLIDER
              if (sec.type === 'product_lane') {
                return (
                  <div key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-serif font-bold text-slate-900">{sec.title}</h2>
                        {sec.subtitle && <p className="text-xs text-slate-500">{sec.subtitle}</p>}
                      </div>
                      <span className="text-xs font-bold text-amber-800 cursor-pointer">View All</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map((num) => (
                        <div
                          key={num}
                          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs space-y-2"
                        >
                          <div className="h-36 rounded-xl bg-slate-100 overflow-hidden">
                            <img
                              src={`https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-amber-700">
                              MICRO-LOT #{num}
                            </span>
                            <div className="text-xs font-bold text-slate-900 leading-snug">
                              Ethiopian Guji Single Origin ({num * 250}g)
                            </div>
                            <div className="text-xs font-bold text-slate-900">${(22.0 * num).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // PRODUCT GRID
              if (sec.type === 'product_grid') {
                return (
                  <div key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-serif font-bold text-slate-900">{sec.title}</h2>
                        {sec.subtitle && <p className="text-xs text-slate-500">{sec.subtitle}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].slice(0, cfg.limit || 6).map((num) => (
                        <div
                          key={num}
                          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs space-y-2"
                        >
                          <div className="h-32 rounded-xl bg-slate-100 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-700">
                              FLAGSHIP GEAR
                            </span>
                            <div className="text-xs font-bold text-slate-900 truncate">
                              Barista Precision Model {num}
                            </div>
                            <div className="text-xs font-bold text-slate-900">$299.95</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // TESTIMONIALS
              if (sec.type === 'testimonials') {
                const tests = (cfg.testimonials as any[]) || [];
                return (
                  <div key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 pt-6">
                    <div className="text-center space-y-1">
                      <h2 className="text-lg font-serif font-bold text-slate-900">{sec.title}</h2>
                      {sec.subtitle && <p className="text-xs text-slate-500">{sec.subtitle}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {tests.map((t, idx) => (
                        <div
                          key={t.id || idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-amber-50/40 shadow-2xs space-y-3"
                        >
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(t.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs italic text-slate-700 leading-relaxed">
                            "{t.quote}"
                          </p>
                          <div className="flex items-center gap-2 pt-1 border-t border-amber-200/40">
                            <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0">
                              {t.avatar_url && (
                                <img src={t.avatar_url} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="text-[11px]">
                              <span className="font-bold text-slate-900 block leading-tight">
                                {t.author}
                              </span>
                              <span className="text-slate-500">{t.role}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // PROMO CALLOUT
              if (sec.type === 'promo_callout') {
                return (
                  <div key={sec.id} className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                    <div className="rounded-3xl border border-slate-200 bg-gradient-to-tr from-amber-50 via-white to-amber-50/60 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xs">
                      <div className="flex-1 space-y-3">
                        {cfg.badge && (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-amber-100 text-amber-900 border border-amber-300">
                            {cfg.badge}
                          </span>
                        )}
                        <h3 className="text-2xl font-serif font-black text-slate-900 leading-tight">
                          {cfg.headline}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{cfg.body}</p>
                        {cfg.button_text && (
                          <button
                            type="button"
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 shadow-xs transition-colors inline-flex items-center gap-1.5"
                          >
                            <span>{cfg.button_text}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {cfg.image_url && (
                        <div className="w-full md:w-1/2 h-56 rounded-2xl overflow-hidden shadow-md">
                          <img src={cfg.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </main>

          {/* 4. FOOTER */}
          <footer className="bg-[#181614] text-stone-200 px-6 py-12 space-y-8 border-t border-stone-800">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
              <div className="space-y-3">
                <div className="font-serif font-black text-base text-amber-400">
                  {shell.footer.brand_name}
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  {shell.footer.brand_description}
                </p>
              </div>

              {shell.footer.columns.slice(0, 3).map((col) => (
                <div key={col.id} className="space-y-2">
                  <div className="font-bold text-stone-100 uppercase tracking-wider text-[11px]">
                    {col.title}
                  </div>
                  <ul className="space-y-1.5 text-stone-400 text-[11px]">
                    {col.links.map((lnk, i) => (
                      <li key={i} className="hover:text-amber-400 cursor-pointer">
                        {lnk.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="max-w-5xl mx-auto pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-500 gap-2">
              <span>{shell.footer.copyright}</span>
              <div className="flex items-center gap-3">
                {shell.footer.social_links.map((s, i) => (
                  <span key={i} className="hover:text-stone-300 cursor-pointer">
                    {s.platform}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
        )}
      </div>
    </div>
  );
}


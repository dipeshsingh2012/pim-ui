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
  Ruler,
  Star,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { CMSPage, GlobalShellConfig, ThemeColor } from '../../types/cms';

interface StorefrontPreviewModalProps {
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

export function StorefrontPreviewModal({
  isOpen,
  onClose,
  page,
  shell,
}: StorefrontPreviewModalProps) {
  if (!isOpen || !page) return null;

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5170';

  const viewportWidths = {
    desktop: 'max-w-6xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  };

  const activeSections = page.sections.filter((s) => s.is_active);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm">
      {/* Top Controller Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-sm">Storefront Live Preview</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
            {page.title} ({page.slug})
          </span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'desktop' ? 'bg-amber-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'tablet' ? 'bg-amber-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewport === 'mobile' ? 'bg-amber-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* External Link & Close */}
        <div className="flex items-center gap-3">
          <a
            href={STOREFRONT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-800/60 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>Open Consumer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Viewport Frame Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950">
        <div
          className={`w-full ${viewportWidths[viewport]} bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-800 flex flex-col transition-all duration-300 min-h-screen text-slate-900 font-sans`}
        >
          {/* 1. TOP PROMO BAR */}
          {shell.promo_bar.enabled && (
            <div
              className={`py-2 px-4 text-center text-xs font-medium flex items-center justify-center gap-2 ${
                THEME_STYLES[shell.promo_bar.theme].bg
              } ${THEME_STYLES[shell.promo_bar.theme].text}`}
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center font-black">
                <Coffee className="w-4 h-4" />
              </div>
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
              {shell.header.show_spatial_finder && (
                <span className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-amber-900 bg-amber-50 rounded-lg border border-amber-200">
                  <Ruler className="w-3 h-3" />
                  <span>3D Fit</span>
                </span>
              )}
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
      </div>
    </div>
  );
}


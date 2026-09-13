import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Search,
  ShoppingBag,
  Megaphone,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { HeaderConfig, PromoBarConfig, ThemeColor } from '../../types/cms';
import { saveHeader as apiSaveHeader, savePromoBar as apiSavePromoBar } from '../../providers/cmsDataProvider';

interface HeaderConfigViewProps {
  header: HeaderConfig;
  promo: PromoBarConfig;
  onUpdateHeader: (updated: HeaderConfig) => void;
  onUpdatePromo: (updated: PromoBarConfig) => void;
  showToast: (msg: string) => void;
}

const THEME_STYLES: Record<ThemeColor, { label: string; bg: string; text: string; badgeBg: string }> = {
  amber: {
    label: 'Warm Amber Roast',
    bg: 'bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900',
    text: 'text-amber-100',
    badgeBg: 'bg-amber-600/60 text-amber-200 border-amber-500/40',
  },
  espresso: {
    label: 'Dark Espresso',
    bg: 'bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950',
    text: 'text-stone-200',
    badgeBg: 'bg-amber-800/60 text-amber-300 border-amber-700/50',
  },
  emerald: {
    label: 'Highland Emerald',
    bg: 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950',
    text: 'text-emerald-100',
    badgeBg: 'bg-emerald-700/60 text-emerald-200 border-emerald-500/40',
  },
  crimson: {
    label: 'Berry Crimson',
    bg: 'bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950',
    text: 'text-rose-100',
    badgeBg: 'bg-rose-700/60 text-rose-200 border-rose-500/40',
  },
  slate: {
    label: 'Modern Slate',
    bg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900',
    text: 'text-slate-100',
    badgeBg: 'bg-slate-700 text-slate-200 border-slate-600',
  },
};

export function HeaderConfigView({
  header,
  promo,
  onUpdateHeader,
  onUpdatePromo,
  showToast,
}: HeaderConfigViewProps) {
  const [localHeader, setLocalHeader] = useState<HeaderConfig>(header);
  const [localPromo, setLocalPromo] = useState<PromoBarConfig>(promo);

  useEffect(() => {
    setLocalHeader(header);
  }, [header]);

  useEffect(() => {
    setLocalPromo(promo);
  }, [promo]);

  const handleSaveHeader = async () => {
    await apiSaveHeader(localHeader);
    onUpdateHeader(localHeader);
    showToast('Header configuration saved');
  };

  const handleSavePromo = async () => {
    await apiSavePromoBar(localPromo);
    onUpdatePromo(localPromo);
    showToast('Promo bar saved');
  };

  return (
    <div className="space-y-6">
      {/* Live Storefront Header Preview */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live Header & Banner Preview
          </span>
          <div className="flex items-center gap-2">
            {localHeader.sticky && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Sticky Mode
              </span>
            )}
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                localPromo.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {localPromo.enabled ? 'Banner Active' : 'Banner Inactive'}
            </span>
          </div>
        </div>

        {/* Promo Bar Preview */}
        {localPromo.enabled && (
          <div
            className={`py-2 px-4 rounded-xl flex items-center justify-center text-xs font-medium gap-2 shadow-inner transition-colors ${
              THEME_STYLES[localPromo.theme].bg
            } ${THEME_STYLES[localPromo.theme].text}`}
          >
            {localPromo.badge && (
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  THEME_STYLES[localPromo.theme].badgeBg
                }`}
              >
                {localPromo.badge}
              </span>
            )}
            <span>{localPromo.text}</span>
            {localPromo.cta_text && (
              <span className="underline font-bold ml-1 cursor-default text-[11px]">
                {localPromo.cta_text} →
              </span>
            )}
          </div>
        )}

        {/* Header Preview Bar */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center font-black text-sm">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                <span>{localHeader.brand_name || 'Brand Name'}</span>
                {localHeader.brand_badge && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                    {localHeader.brand_badge}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">{localHeader.brand_tagline}</div>
            </div>
          </div>

          {/* Quick Links placeholder in preview */}
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-700">
            {localHeader.nodes.slice(0, 5).map((node) => (
              <span key={node.id} className="hover:text-amber-800 cursor-default">
                {node.label}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {localHeader.show_search && (
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Search className="w-3.5 h-3.5" />
              </div>
            )}
            {localHeader.show_cart && (
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center relative">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-700 text-white text-[9px] font-bold flex items-center justify-center">
                  2
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header Brand Settings Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Storefront Header Identity</h3>
            <p className="text-xs text-slate-500">
              Configure brand logo, tagline, header action buttons, and sticky navigation.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveHeader}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Header</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
            <input
              type="text"
              value={localHeader.brand_name}
              onChange={(e) => setLocalHeader({ ...localHeader, brand_name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Tagline</label>
            <input
              type="text"
              value={localHeader.brand_tagline || ''}
              onChange={(e) => setLocalHeader({ ...localHeader, brand_tagline: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Badge</label>
            <input
              type="text"
              value={localHeader.brand_badge || ''}
              onChange={(e) => setLocalHeader({ ...localHeader, brand_badge: e.target.value })}
              placeholder="e.g. FLAGSHIP"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700 uppercase"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={localHeader.show_search}
              onChange={(e) => setLocalHeader({ ...localHeader, show_search: e.target.checked })}
              className="accent-amber-700 w-4 h-4 cursor-pointer"
            />
            <span>Show Search Bar</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={localHeader.show_cart}
              onChange={(e) => setLocalHeader({ ...localHeader, show_cart: e.target.checked })}
              className="accent-amber-700 w-4 h-4 cursor-pointer"
            />
            <span>Show Cart Icon</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={localHeader.sticky}
              onChange={(e) => setLocalHeader({ ...localHeader, sticky: e.target.checked })}
              className="accent-amber-700 w-4 h-4 cursor-pointer"
            />
            <span>Sticky Header on Scroll</span>
          </label>
        </div>
      </div>

      {/* Announcement / Promo Bar Settings Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-800" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Storefront Announcement / Promo Bar</h3>
              <p className="text-xs text-slate-500">
                Top notification ribbon for free shipping announcements, discount codes, or fresh harvests.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSavePromo}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Promo Bar</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={localPromo.enabled}
              onChange={(e) => setLocalPromo({ ...localPromo, enabled: e.target.checked })}
              className="accent-amber-700 w-4 h-4 cursor-pointer"
            />
            <span>Enable Announcement Ribbon</span>
          </label>
        </div>

        {localPromo.enabled && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Announcement Text</label>
                <input
                  type="text"
                  value={localPromo.text}
                  onChange={(e) => setLocalPromo({ ...localPromo, text: e.target.value })}
                  placeholder="e.g. Free shipping on orders over $50"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Highlight Badge</label>
                <input
                  type="text"
                  value={localPromo.badge || ''}
                  onChange={(e) => setLocalPromo({ ...localPromo, badge: e.target.value })}
                  placeholder="e.g. SPECIAL HARVEST"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Call to Action (CTA) Text</label>
                <input
                  type="text"
                  value={localPromo.cta_text || ''}
                  onChange={(e) => setLocalPromo({ ...localPromo, cta_text: e.target.value })}
                  placeholder="e.g. Shop Now"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Call to Action Target URL</label>
                <input
                  type="text"
                  value={localPromo.cta_url || ''}
                  onChange={(e) => setLocalPromo({ ...localPromo, cta_url: e.target.value })}
                  placeholder="e.g. #/coffees"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-700 font-mono text-xs"
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Color Theme Palette</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(Object.keys(THEME_STYLES) as ThemeColor[]).map((thm) => {
                  const info = THEME_STYLES[thm];
                  const isSelected = localPromo.theme === thm;
                  return (
                    <button
                      key={thm}
                      type="button"
                      onClick={() => setLocalPromo({ ...localPromo, theme: thm })}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-700 ring-2 ring-amber-700/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-900">{info.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
                      </div>
                      <div className={`h-4 w-full rounded-md shadow-inner ${info.bg}`}></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

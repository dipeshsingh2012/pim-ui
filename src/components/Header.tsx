import React, { useEffect, useState } from 'react';
import { Coffee, ExternalLink, Activity, Sparkles, Layers, Package } from 'lucide-react';
import { CATALOG_API_URL, CONTENT_API_URL } from '../providers/dataProvider';

interface HeaderProps {
  activeTab?: 'products' | 'cms';
  onSelectTab?: (tab: 'products' | 'cms') => void;
}

const STORE_URL = import.meta.env.VITE_STORE_URL || 'https://hilljhil.cafe';

export function Header({ activeTab = 'products', onSelectTab }: HeaderProps) {
  const [catalogOk, setCatalogOk] = useState<boolean | null>(null);
  const [contentOk, setContentOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (CATALOG_API_URL) {
      fetch(`${CATALOG_API_URL}/health`, { signal: AbortSignal.timeout(8000) })
        .then((res) => (res.ok ? setCatalogOk(true) : setCatalogOk(false)))
        .catch(() => setCatalogOk(false));
    } else {
      setCatalogOk(null);
    }

    if (CONTENT_API_URL) {
      fetch(`${CONTENT_API_URL}/health`, { signal: AbortSignal.timeout(8000) })
        .then((res) => (res.ok ? setContentOk(true) : setContentOk(false)))
        .catch(() => setContentOk(false));
    } else {
      setContentOk(null);
    }
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Navigation Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Hill Jhil"
              className="w-10 h-10 rounded-full object-cover shadow-xs border-2 border-teal-800/40 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-slate-900 tracking-tight text-lg">
                  Hill Jhil Commerce PIM & CMS
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  MERCHANT COCKPIT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Catalog Information & Content Experience Engine
              </p>
            </div>
          </div>

          {/* Module Switcher Tabs */}
          {onSelectTab && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => onSelectTab('products')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-amber-700" />
                <span>Products Catalog</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('cms')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'cms'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Experience CMS</span>
                <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-amber-600 text-white">
                  STUDIO
                </span>
              </button>
            </nav>
          )}
        </div>

        {/* Health Status & Store Link */}
        <div className="flex items-center gap-3">
          {/* Catalog API Health Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 border border-slate-200">
            <Activity
              className={`w-3 h-3 ${
                catalogOk ? 'text-emerald-500' : catalogOk === false ? 'text-rose-500' : 'text-slate-400'
              }`}
            />
            <span className="text-slate-600 font-mono">
              Catalog API {catalogOk ? '✓' : '✗'}
            </span>
          </div>

          {/* Content API Health Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 border border-slate-200">
            <Activity
              className={`w-3 h-3 ${
                contentOk ? 'text-emerald-500' : contentOk === false ? 'text-rose-500' : 'text-slate-400'
              }`}
            />
            <span className="text-slate-600 font-mono">
              Content CMS {contentOk ? '✓' : '✗'}
            </span>
          </div>

          {/* Direct Store Link */}
          <a
            href={STORE_URL || '/'}
            target={STORE_URL ? '_blank' : undefined}
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Store</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}

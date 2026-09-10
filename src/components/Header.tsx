import React, { useEffect, useState } from 'react';
import { Coffee, ExternalLink, Activity, Sparkles } from 'lucide-react';
import { API_URL } from '../providers/dataProvider';

export function Header() {
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.ok ? setBackendOk(true) : setBackendOk(false))
      .catch(() => setBackendOk(false));
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-slate-900 tracking-tight text-lg">
                Hiljhil Cafe PIM
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                PROD CATALOG
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Product Information Management & Spatial Clearances
            </p>
          </div>
        </div>

        {/* Status & Storefront Link */}
        <div className="flex items-center gap-4">
          {/* Backend Health Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200">
            <Activity className={`w-3.5 h-3.5 ${backendOk ? 'text-emerald-500 animate-pulse' : backendOk === false ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className="text-slate-600">
              API :8001 {backendOk ? '(Connected)' : backendOk === false ? '(Offline)' : '(Checking...)'}
            </span>
          </div>

          {/* Direct Storefront Link */}
          <a
            href="http://localhost:5170"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Storefront (mycommerce)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}

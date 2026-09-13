import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Menu,
  Footprints,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Search,
  Coffee,
  Save,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {
  GlobalShellConfig,
  PromoBarConfig,
  HeaderConfig,
  FooterConfig,
  NavNode,
  FooterColumn,
  ThemeColor,
} from '../../types/cms';
import {
  savePromoBar as apiSavePromoBar,
  saveHeader as apiSaveHeader,
  fetchHeader as apiFetchHeader,
  saveFooter as apiSaveFooter,
} from '../../providers/cmsDataProvider';

interface SiteShellViewProps {
  shell: GlobalShellConfig;
  onUpdateShell: (updated: GlobalShellConfig) => void;
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

export function SiteShellView({ shell, onUpdateShell, showToast }: SiteShellViewProps) {
  const [activeTab, setActiveTab] = useState<'promo' | 'header' | 'footer'>('promo');

  // Local editing states
  const [promo, setPromo] = useState<PromoBarConfig>(shell.promo_bar);
  const [header, setHeader] = useState<HeaderConfig>(shell.header);
  const [footer, setFooter] = useState<FooterConfig>(shell.footer);

  useEffect(() => {
    setPromo(shell.promo_bar);
    setHeader(shell.header);
    setFooter(shell.footer);
  }, [shell]);

  // Editing modals/drawers
  const [editingNode, setEditingNode] = useState<{ parentId?: string; node?: NavNode } | null>(null);
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeUrl, setNodeUrl] = useState('');
  const [nodeBadge, setNodeBadge] = useState('');

  // Header API integration & save states
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [isLoadingHeader, setIsLoadingHeader] = useState(false);
  const [headerApiStatus, setHeaderApiStatus] = useState<'idle' | 'synced' | 'local_only' | 'error'>('idle');

  const loadHeaderFromApi = async () => {
    setIsLoadingHeader(true);
    try {
      const fetched = await apiFetchHeader();
      setHeader(fetched);
      onUpdateShell({ ...shell, header: fetched });
      setHeaderApiStatus('synced');
      showToast('Header configuration synced from content-service API');
    } catch (err) {
      console.warn('Could not sync header from API:', err);
      setHeaderApiStatus('local_only');
    } finally {
      setIsLoadingHeader(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'header') {
      loadHeaderFromApi();
    }
  }, [activeTab]);

  // Explicit save triggers
  const handleSavePromo = async () => {
    await apiSavePromoBar(promo);
    onUpdateShell({ ...shell, promo_bar: promo });
    showToast('Promo bar saved via dedicated endpoint');
  };

  const handleSaveHeader = async () => {
    setIsSavingHeader(true);
    try {
      const res = await apiSaveHeader(header);
      onUpdateShell({ ...shell, header: header });
      if (res.syncedToApi) {
        setHeaderApiStatus('synced');
        showToast('Header configuration saved and synced to content-service API');
      } else {
        setHeaderApiStatus('local_only');
        showToast(res.message);
      }
    } catch (err: any) {
      setHeaderApiStatus('error');
      showToast(`Error saving header: ${err?.message || 'Network error'}`);
    } finally {
      setIsSavingHeader(false);
    }
  };

  const handleSaveFooter = async () => {
    await apiSaveFooter(footer);
    onUpdateShell({ ...shell, footer: footer });
    showToast('Footer configuration saved via dedicated endpoint');
  };

  const savePromo = async (newPromo: PromoBarConfig) => {
    setPromo(newPromo);
    await apiSavePromoBar(newPromo);
    onUpdateShell({ ...shell, promo_bar: newPromo });
    showToast('Promo bar updated');
  };

  const updateHeaderDraft = (newHeader: HeaderConfig) => {
    setHeader(newHeader);
    onUpdateShell({ ...shell, header: newHeader });
  };

  const saveFooter = async (newFooter: FooterConfig) => {
    setFooter(newFooter);
    await apiSaveFooter(newFooter);
    onUpdateShell({ ...shell, footer: newFooter });
    showToast('Footer configuration updated');
  };

  // Nav Node operations
  const handleAddTopLevelNode = () => {
    const newNode: NavNode = {
      id: `nav_${Date.now()}`,
      label: 'New Menu Link',
      url: '#/',
    };
    updateHeaderDraft({ ...header, nodes: [...header.nodes, newNode] });
  };

  const handleAddChildNode = (parentId: string) => {
    const updatedNodes = header.nodes.map((node) => {
      if (node.id === parentId) {
        const children = node.children || [];
        return {
          ...node,
          children: [
            ...children,
            {
              id: `nav_${Date.now()}`,
              label: 'Sub-Menu Item',
              url: '#/',
            },
          ],
        };
      }
      return node;
    });
    updateHeaderDraft({ ...header, nodes: updatedNodes });
  };

  const handleDeleteNode = (nodeId: string, parentId?: string) => {
    if (parentId) {
      const updatedNodes = header.nodes.map((node) => {
        if (node.id === parentId && node.children) {
          return {
            ...node,
            children: node.children.filter((c) => c.id !== nodeId),
          };
        }
        return node;
      });
      updateHeaderDraft({ ...header, nodes: updatedNodes });
    } else {
      updateHeaderDraft({
        ...header,
        nodes: header.nodes.filter((n) => n.id !== nodeId),
      });
    }
  };

  const handleOpenEditNode = (node: NavNode, parentId?: string) => {
    setEditingNode({ node, parentId });
    setNodeLabel(node.label);
    setNodeUrl(node.url);
    setNodeBadge(node.badge || '');
  };

  const handleSaveEditedNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNode || !editingNode.node) return;

    const { node, parentId } = editingNode;
    const updatedItem: NavNode = {
      ...node,
      label: nodeLabel.trim(),
      url: nodeUrl.trim(),
      badge: nodeBadge.trim() || undefined,
    };

    if (parentId) {
      const updatedNodes = header.nodes.map((n) => {
        if (n.id === parentId && n.children) {
          return {
            ...n,
            children: n.children.map((c) => (c.id === node.id ? updatedItem : c)),
          };
        }
        return n;
      });
      updateHeaderDraft({ ...header, nodes: updatedNodes });
    } else {
      const updatedNodes = header.nodes.map((n) => (n.id === node.id ? { ...updatedItem, children: n.children } : n));
      updateHeaderDraft({ ...header, nodes: updatedNodes });
    }

    setEditingNode(null);
  };

  // Footer Column operations
  const handleAddFooterColumn = () => {
    const newCol: FooterColumn = {
      id: `col_${Date.now()}`,
      title: 'New Column',
      links: [{ label: 'Link Item', url: '#/' }],
    };
    saveFooter({ ...footer, columns: [...footer.columns, newCol] });
  };

  const handleRemoveFooterColumn = (colId: string) => {
    saveFooter({ ...footer, columns: footer.columns.filter((c) => c.id !== colId) });
  };

  const handleUpdateColumnTitle = (colId: string, title: string) => {
    const updatedCols = footer.columns.map((c) => (c.id === colId ? { ...c, title } : c));
    setFooter({ ...footer, columns: updatedCols });
  };

  const handleAddFooterLink = (colId: string) => {
    const updated = footer.columns.map((c) => {
      if (c.id === colId) {
        return {
          ...c,
          links: [...c.links, { label: 'New Link', url: '#/' }],
        };
      }
      return c;
    });
    saveFooter({ ...footer, columns: updated });
  };

  const handleUpdateFooterLink = (colId: string, linkIdx: number, field: string, val: string) => {
    const updatedCols = footer.columns.map((c) => {
      if (c.id === colId) {
        const newLinks = c.links.map((l, i) => (i === linkIdx ? { ...l, [field]: val } : l));
        return { ...c, links: newLinks };
      }
      return c;
    });
    setFooter({ ...footer, columns: updatedCols });
  };

  const handleRemoveFooterLink = (colId: string, linkIdx: number) => {
    const updated = footer.columns.map((c) => {
      if (c.id === colId) {
        return { ...c, links: c.links.filter((_, i) => i !== linkIdx) };
      }
      return c;
    });
    saveFooter({ ...footer, columns: updated });
  };

  return (
    <div className="space-y-6">
      {/* Shell Element Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('promo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'promo'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Top Promo Bar</span>
          {promo.enabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'header'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Header Navigation Nodes ({header.nodes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'footer'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>Footer & Columns ({footer.columns.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PROMO BAR EDITOR */}
      {/* ======================================================== */}
      {activeTab === 'promo' && (
        <div className="space-y-6">
          {/* Live Preview Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Store Promo Bar Preview
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  promo.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {promo.enabled ? 'Active on Store' : 'Disabled'}
              </span>
            </div>

            {promo.enabled ? (
              <div
                className={`py-2.5 px-4 rounded-xl flex items-center justify-center text-xs font-medium gap-2 shadow-inner transition-colors ${
                  THEME_STYLES[promo.theme].bg
                } ${THEME_STYLES[promo.theme].text}`}
              >
                {promo.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-md border ${
                      THEME_STYLES[promo.theme].badgeBg
                    }`}
                  >
                    {promo.badge}
                  </span>
                )}
                <span>{promo.text}</span>
                {promo.cta_text && (
                  <a
                    href={promo.cta_url || '#'}
                    className="underline font-bold hover:opacity-90 ml-1 inline-flex items-center gap-1"
                  >
                    <span>{promo.cta_text}</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="py-3 px-4 bg-slate-100 text-slate-400 text-center rounded-xl text-xs font-semibold border border-dashed border-slate-300">
                Promo bar is currently disabled and will not display on the store.
              </div>
            )}
          </div>

          {/* Configuration Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Promo Bar Announcement</h3>
                <p className="text-xs text-slate-500">
                  Top-of-page announcement strip across all store pages.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promo.enabled}
                    onChange={(e) => savePromo({ ...promo, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  <span className="ml-3 text-xs font-bold text-slate-700">
                    {promo.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={promo.text}
                  onChange={(e) => savePromo({ ...promo, text: e.target.value })}
                  placeholder="e.g. Complimentary express shipping on orders over $50..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={promo.badge || ''}
                    onChange={(e) => savePromo({ ...promo, badge: e.target.value })}
                    placeholder="e.g. FLASH DROP"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={promo.cta_text || ''}
                    onChange={(e) => savePromo({ ...promo, cta_text: e.target.value })}
                    placeholder="e.g. Shop Harvests"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Target URL</label>
                  <input
                    type="text"
                    value={promo.cta_url || ''}
                    onChange={(e) => savePromo({ ...promo, cta_url: e.target.value })}
                    placeholder="#/coffees"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Theme Color Palette */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Theme Color Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(Object.keys(THEME_STYLES) as ThemeColor[]).map((thm) => {
                    const style = THEME_STYLES[thm];
                    const isSelected = promo.theme === thm;
                    return (
                      <button
                        key={thm}
                        type="button"
                        onClick={() => savePromo({ ...promo, theme: thm })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-700 ring-2 ring-amber-600/30 bg-amber-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`h-4 w-full rounded-md mb-1.5 ${style.bg}`} />
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {style.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Changes save to storage and apply to live store.
                </span>
                <button
                  type="button"
                  onClick={handleSavePromo}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Promo Bar Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: HEADER & NAVIGATION NODES */}
      {/* ======================================================== */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          {/* Header Preview */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Store Navigation Header Preview
            </span>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              {/* Brand Logo */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center font-black text-sm">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm leading-tight">
                    {header.brand_name}
                  </div>
                  <div className="text-[10px] text-slate-500">{header.brand_tagline}</div>
                </div>
              </div>

              {/* Top Nav Items Preview */}
              <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-700">
                {header.nodes.slice(0, 6).map((node) => (
                  <span
                    key={node.id}
                    className="flex items-center gap-1 hover:text-amber-800 cursor-default"
                  >
                    <span>{node.label}</span>
                    {node.badge && (
                      <span className="px-1 py-0.2 text-[8px] font-black rounded bg-amber-100 text-amber-900">
                        {node.badge}
                      </span>
                    )}
                    {node.children && node.children.length > 0 && (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    )}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {header.show_search && (
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                )}
                {header.show_cart && (
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

          {/* Header Brand Settings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-bold text-slate-900">Header Brand & Features</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                    headerApiStatus === 'synced'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : headerApiStatus === 'local_only'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      headerApiStatus === 'synced' ? 'bg-emerald-500' :
                      headerApiStatus === 'local_only' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                    {headerApiStatus === 'synced' ? 'API Connected' : 'Cached Draft'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Configure store brand identity and action buttons.</p>
              </div>
              <button
                type="button"
                onClick={loadHeaderFromApi}
                disabled={isLoadingHeader}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
                title="Fetch latest header configuration from backend API"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingHeader ? 'animate-spin' : ''}`} />
                <span>{isLoadingHeader ? 'Syncing...' : 'Sync from API'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={header.brand_name}
                  onChange={(e) => setHeader({ ...header, brand_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={header.brand_tagline || ''}
                  onChange={(e) => setHeader({ ...header, brand_tagline: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={header.show_search}
                  onChange={(e) => setHeader({ ...header, show_search: e.target.checked })}
                  className="accent-amber-700 w-4 h-4 cursor-pointer"
                />
                <span>Show Search Bar</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={header.show_cart}
                  onChange={(e) => setHeader({ ...header, show_cart: e.target.checked })}
                  className="accent-amber-700 w-4 h-4 cursor-pointer"
                />
                <span>Show Cart Icon</span>
              </label>
            </div>
          </div>

          {/* Navigation Node Tree Builder */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Navigation Node Tree</h3>
                <p className="text-xs text-slate-500">
                  Manage primary store menu links and sub-menu dropdown items.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddTopLevelNode}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Primary Link</span>
                </button>
              </div>
            </div>

            {/* Tree Items */}
            <div className="space-y-3">
              {header.nodes.map((node, idx) => (
                <div key={node.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                  {/* Parent Node Row */}
                  <div className="p-3.5 bg-slate-50/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{node.label}</span>
                      <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {node.url}
                      </span>
                      {node.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-100 text-amber-900 border border-amber-300">
                          {node.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddChildNode(node.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Sub-link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditNode(node)}
                        className="text-slate-400 hover:text-amber-800 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
                        title="Edit Node"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNode(node.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children / Sub-nodes */}
                  {node.children && node.children.length > 0 && (
                    <div className="p-3 pl-8 bg-white border-t border-slate-100 space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Sub-Menu Items ({node.children.length})
                      </div>
                      {node.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">└─</span>
                            <span className="font-semibold text-slate-800">{child.label}</span>
                            <span className="text-[11px] font-mono text-slate-500">{child.url}</span>
                            {child.badge && (
                              <span className="px-1.5 py-0.2 text-[8px] font-bold rounded bg-amber-100 text-amber-900">
                                {child.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditNode(child, node.id)}
                              className="text-slate-400 hover:text-amber-800 p-1 rounded cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNode(child.id, node.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Action Strip - Only 1 Header Save Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {header.nodes.length} primary navigation nodes
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      headerApiStatus === 'synced' ? 'bg-emerald-500' :
                      headerApiStatus === 'local_only' ? 'bg-amber-500' :
                      headerApiStatus === 'error' ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
                    {headerApiStatus === 'synced' ? 'Synced with API' :
                     headerApiStatus === 'local_only' ? 'Local storage cache' :
                     headerApiStatus === 'error' ? 'API sync failed' : 'Ready to save'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Single save action commits brand settings, search/cart controls, and navigation tree to API.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveHeader}
                disabled={isSavingHeader}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60 shrink-0"
              >
                {isSavingHeader ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Header to API...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Header Configuration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FOOTER & COLUMN NODES */}
      {/* ======================================================== */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {/* Footer Settings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Footer Brand & Newsletter Settings</h3>
                <p className="text-xs text-slate-500">Configure footer roastery bio, newsletter, and legal text.</p>
              </div>
              <button
                type="button"
                onClick={handleSaveFooter}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Footer</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={footer.brand_name}
                  onChange={(e) => saveFooter({ ...footer, brand_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Newsletter Title</label>
                <input
                  type="text"
                  value={footer.newsletter_title || ''}
                  onChange={(e) => saveFooter({ ...footer, newsletter_title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Description Bio</label>
              <textarea
                rows={2}
                value={footer.brand_description}
                onChange={(e) => saveFooter({ ...footer, brand_description: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Statement</label>
              <input
                type="text"
                value={footer.copyright}
                onChange={(e) => saveFooter({ ...footer, copyright: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Footer Columns Builder */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Footer Navigation Columns ({footer.columns.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Configure the multi-column links displayed in the roastery footer.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddFooterColumn}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveFooter}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Footer</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {footer.columns.map((col) => (
                <div key={col.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => handleUpdateColumnTitle(col.id, e.target.value)}
                      className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 w-3/4"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFooterColumn(col.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove column"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Links List */}
                  <div className="space-y-1.5">
                    {col.links.map((link, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateFooterLink(col.id, lIdx, 'label', e.target.value)}
                          placeholder="Label"
                          className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded w-1/2"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleUpdateFooterLink(col.id, lIdx, 'url', e.target.value)}
                          placeholder="URL"
                          className="text-[10px] font-mono px-2 py-1 bg-white border border-slate-200 rounded w-1/2"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFooterLink(col.id, lIdx)}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddFooterLink(col.id)}
                    className="w-full py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Action Strip for Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {footer.columns.length} footer navigation columns configured.
              </span>
              <button
                type="button"
                onClick={handleSaveFooter}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Footer Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Node Modal */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {editingNode.parentId ? 'Edit Sub-Menu Item' : 'Edit Primary Navigation Link'}
            </h3>
            <form onSubmit={handleSaveEditedNode} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Display Label</label>
                <input
                  type="text"
                  required
                  value={nodeLabel}
                  onChange={(e) => setNodeLabel(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Route / URL</label>
                <input
                  type="text"
                  required
                  value={nodeUrl}
                  onChange={(e) => setNodeUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag (Optional)</label>
                <input
                  type="text"
                  value={nodeBadge}
                  onChange={(e) => setNodeBadge(e.target.value)}
                  placeholder="e.g. NEW, SAVE 15%"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNode(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


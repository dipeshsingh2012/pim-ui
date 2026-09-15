import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  CircleDot,
  LayoutGrid,
} from 'lucide-react';
import { ContentLane, LaneFormValues } from '../../types/lane';
import { dataProvider } from '../../providers/dataProvider';
import { LaneFormModal } from './LaneFormModal';

const STORE_URL = import.meta.env.VITE_STORE_URL || 'http://localhost:5170';

export function LaneList() {
  const [lanes, setLanes] = useState<ContentLane[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLane, setSelectedLane] = useState<ContentLane | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLanes = async () => {
    setLoading(true);
    try {
      const filters: any[] = [];
      if (searchQuery) filters.push({ field: 'q', value: searchQuery });
      if (placementFilter !== 'all') filters.push({ field: 'placement', value: placementFilter });
      if (statusFilter !== 'all') filters.push({ field: 'status', value: statusFilter });

      const res = await dataProvider.getList({
        resource: 'lanes',
        filters,
        pagination: { currentPage: 1, pageSize: 50 },
      });
      setLanes(res.data as ContentLane[]);
    } catch (err) {
      console.error('Failed to fetch lanes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanes();
  }, [placementFilter, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchLanes(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateLane = async (values: LaneFormValues) => {
    const res = await dataProvider.create({
      resource: 'lanes',
      variables: values,
    });
    showToast(`Created lane "${res.data.title}"`);
    fetchLanes();
  };

  const handleUpdateLane = async (values: LaneFormValues) => {
    if (!selectedLane) return;
    const res = await dataProvider.update({
      resource: 'lanes',
      id: selectedLane.id,
      variables: values,
    });
    showToast(`Updated lane "${res.data.title}"`);
    fetchLanes();
  };

  const handleToggleStatus = async (lane: ContentLane) => {
    try {
      const newStatus = lane.status === 'active' ? 'draft' : 'active';
      await dataProvider.update({
        resource: 'lanes',
        id: lane.id,
        variables: { status: newStatus },
      });
      showToast(`Lane "${lane.title}" is now ${newStatus}`);
      fetchLanes();
    } catch (err) {
      alert('Failed to update lane status');
    }
  };

  const handleDeleteLane = async (lane: ContentLane) => {
    if (!confirm(`Are you sure you want to delete lane "${lane.title}"?`)) return;
    try {
      await dataProvider.deleteOne({
        resource: 'lanes',
        id: lane.id,
      });
      showToast(`Deleted lane "${lane.title}"`);
      fetchLanes();
    } catch (err) {
      alert('Failed to delete lane');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              CONTENT SERVICE
            </span>
            <span className="text-xs font-semibold text-slate-500">• Experience CMS</span>
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 tracking-tight mt-1">
            Product & Category Lanes
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Configure circular card sliders, bestseller rails, and curated collections published to store landing and discovery pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={STORE_URL || '/'}
            target={STORE_URL ? '_blank' : undefined}
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <button
            onClick={() => {
              setSelectedLane(null);
              setModalMode('create');
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Product Lane</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search lanes by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Placement:</span>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
            >
              <option value="all">All Placements</option>
              <option value="homepage">Homepage Only</option>
              <option value="discovery">Discovery Page</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lanes Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-8 h-8 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading content lanes...</p>
        </div>
      ) : lanes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Content Lanes Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Get started by creating a new category slider or product rail to replace hardcoded store content.
          </p>
          <button
            onClick={() => {
              setSelectedLane(null);
              setModalMode('create');
              setModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Lane</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {lanes.map((lane) => (
            <div
              key={lane.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-xs transition-all space-y-4"
            >
              {/* Lane Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                      {lane.title}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      #{lane.slug}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                      {lane.placement}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                      {lane.card_style === 'circular' ? '● Circular' : '■ Square'}
                    </span>
                  </div>
                  {lane.subtitle && (
                    <p className="text-xs text-slate-500 font-medium">{lane.subtitle}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(lane)}
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-colors ${
                      lane.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {lane.status}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedLane(lane);
                      setModalMode('edit');
                      setModalOpen(true);
                    }}
                    className="p-2 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition-colors"
                    title="Edit Lane"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteLane(lane)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Lane"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lane Visual Horizontal Track Preview */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                  <span>{lane.items.length} Items Configured in Slider</span>
                  {lane.has_navigation_arrows && (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <ChevronLeft className="w-3 h-3" />
                      <ChevronRight className="w-3 h-3" />
                      Prev/Next Navigation Active
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4 overflow-x-auto py-2 px-1">
                  {lane.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-center shrink-0 w-24 group"
                    >
                      <div className="relative w-18 h-18 aspect-square rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 group-hover:border-amber-700 transition-all shadow-2xs">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
                      <span className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-center text-slate-800 line-clamp-2 leading-tight group-hover:text-amber-800">
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <LaneFormModal
        isOpen={modalOpen}
        mode={modalMode}
        initialLane={selectedLane}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreateLane : handleUpdateLane}
      />
    </div>
  );
}

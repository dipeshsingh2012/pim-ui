import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Coffee,
  Ruler,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Package,
  Layers,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../../types/product';
import { ProductFormModal } from './ProductFormModal';
import { dataProvider } from '../../providers/dataProvider';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters: any[] = [];
      if (searchQuery) filters.push({ field: 'q', value: searchQuery });
      if (categoryFilter !== 'all') filters.push({ field: 'category', value: categoryFilter });
      if (statusFilter !== 'all') filters.push({ field: 'status', value: statusFilter });

      const res = await dataProvider.getList({
        resource: 'products',
        filters,
        pagination: { currentPage: 1, pageSize: 100 },
      });
      setProducts(res.data as Product[]);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateProduct = async (values: Partial<Product>) => {
    const res = await dataProvider.create({
      resource: 'products',
      variables: values,
    });
    showToast(`Successfully created "${res.data.name}"`);
    fetchProducts();
  };

  const handleUpdateProduct = async (values: Partial<Product>) => {
    if (!selectedProduct) return;
    const res = await dataProvider.update({
      resource: 'products',
      id: selectedProduct.id,
      variables: values,
    });
    showToast(`Updated "${res.data.name}"`);
    fetchProducts();
  };

  const handleToggleStock = async (prod: Product) => {
    try {
      await dataProvider.update({
        resource: 'products',
        id: prod.id,
        variables: { in_stock: !prod.in_stock },
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, in_stock: !p.in_stock } : p))
      );
      showToast(`${prod.name} marked as ${!prod.in_stock ? 'In Stock' : 'Out of Stock'}`);
    } catch (err) {
      console.error('Failed to toggle stock', err);
    }
  };

  const handleDeleteProduct = async (prod: Product) => {
    if (window.confirm(`Are you sure you want to archive "${prod.name}"?`)) {
      try {
        await dataProvider.deleteOne({
          resource: 'products',
          id: prod.id,
        });
        showToast(`Archived "${prod.name}"`);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setSelectedProduct(prod);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Metrics
  const totalCount = products.length;
  const coffeeCount = products.filter((p) => p.category === 'coffee_beans').length;
  const gearCount = products.filter((p) => p.category !== 'coffee_beans').length;
  const inStockCount = products.filter((p) => p.in_stock).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Catalog SKUs</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-serif font-black text-slate-900">{totalCount}</p>
          <span className="text-[11px] text-slate-400">Available across all channels</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Coffee Bean Lots</span>
            <Coffee className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-serif font-black text-amber-950">{coffeeCount}</p>
          <span className="text-[11px] text-slate-400">Single estate & dark roasts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-700 text-xs font-bold">
            <span>CounterCheck™ Gear</span>
            <Ruler className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-serif font-black text-slate-900">{gearCount}</p>
          <span className="text-[11px] text-slate-400">Machines & burr grinders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span>In-Stock Availability</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-serif font-black text-emerald-950">
            {totalCount > 0 ? Math.round((inStockCount / totalCount) * 100) : 0}%
          </p>
          <span className="text-[11px] text-slate-400">{inStockCount} of {totalCount} ready to ship</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, brand..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
            />
          </div>

          {/* New Product CTA */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={openCreateModal}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Configure New Product
            </button>
          </div>
        </div>

        {/* Category Pills & Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'coffee_beans', label: 'Coffee Beans' },
              { id: 'espresso_machine', label: 'Espresso Machines' },
              { id: 'grinder', label: 'Grinders' },
              { id: 'brewing_gear', label: 'Brewing Equipment' },
              { id: 'drinkware', label: 'Drinkware' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-amber-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Draft Only</option>
              <option value="archived">Archived Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Stock Availability</th>
                <th className="py-3 px-4">CounterCheck™ Dimensions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading catalog from product-catalog-service (:8001)...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const totalHeight = (prod.height_cm || 0) + (prod.top_clearance_cm || 0);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Product Thumbnail & Identity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                            {prod.image_url ? (
                              <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Coffee className="w-5 h-5" />
                              </div>
                            )}
                            {prod.badge && (
                              <span className="absolute top-0.5 left-0.5 px-1 py-0.2 bg-amber-400 text-[8px] font-black text-slate-900 rounded-2xs">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight text-xs">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              SKU: {prod.sku} • {prod.brand}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {prod.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 text-xs">
                            ₹ {prod.price.toLocaleString('en-IN')}
                          </span>
                          {prod.compare_at_price && (
                            <span className="block text-[10px] text-slate-400 line-through">
                              ₹ {prod.compare_at_price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            prod.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : prod.status === 'draft'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>

                      {/* Stock Switch */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(prod)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            prod.in_stock
                              ? 'bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100/70 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${prod.in_stock ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                          {prod.in_stock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      {/* Dimensions & Clearance */}
                      <td className="py-3 px-4">
                        {prod.category !== 'coffee_beans' && prod.height_cm > 0 ? (
                          <div className="text-[11px] space-y-0.5">
                            <span className="text-slate-700 font-semibold block">
                              {prod.width_cm} × {prod.height_cm} × {prod.depth_cm} cm
                            </span>
                            <span className="text-amber-800 text-[10px] font-bold block">
                              Headroom: {totalHeight.toFixed(1)} cm
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Storefront PDP Link */}
                          <a
                            href={`http://localhost:5170/product/${prod.id}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview in Storefront"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(prod)}
                            title="Edit Product Details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete / Archive Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod)}
                            title="Archive SKU"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuration Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedProduct}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreateProduct : handleUpdateProduct}
      />
    </div>
  );
}

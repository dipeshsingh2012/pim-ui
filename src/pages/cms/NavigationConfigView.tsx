import React, { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Save,
  Coffee,
} from 'lucide-react';
import { HeaderConfig, NavNode } from '../../types/cms';
import { saveHeader as apiSaveHeader } from '../../providers/cmsDataProvider';

interface NavigationConfigViewProps {
  header: HeaderConfig;
  onUpdateHeader: (updated: HeaderConfig) => void;
  showToast: (msg: string) => void;
}

export function NavigationConfigView({
  header,
  onUpdateHeader,
  showToast,
}: NavigationConfigViewProps) {
  const [localHeader, setLocalHeader] = useState<HeaderConfig>(header);
  const [editingNode, setEditingNode] = useState<{ parentId?: string; node?: NavNode } | null>(null);
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeUrl, setNodeUrl] = useState('');
  const [nodeBadge, setNodeBadge] = useState('');

  useEffect(() => {
    setLocalHeader(header);
  }, [header]);

  const handleSaveNavigation = async () => {
    await apiSaveHeader(localHeader);
    onUpdateHeader(localHeader);
    showToast('Navigation menus saved');
  };

  const handleAddTopLevelNode = () => {
    const newNode: NavNode = {
      id: `nav_${Date.now()}`,
      label: 'New Menu Link',
      url: '#/',
    };
    const updated = { ...localHeader, nodes: [...localHeader.nodes, newNode] };
    setLocalHeader(updated);
  };

  const handleAddChildNode = (parentId: string) => {
    const updatedNodes = localHeader.nodes.map((node) => {
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
    setLocalHeader({ ...localHeader, nodes: updatedNodes });
  };

  const handleDeleteNode = (nodeId: string, parentId?: string) => {
    if (parentId) {
      const updatedNodes = localHeader.nodes.map((node) => {
        if (node.id === parentId && node.children) {
          return {
            ...node,
            children: node.children.filter((c) => c.id !== nodeId),
          };
        }
        return node;
      });
      setLocalHeader({ ...localHeader, nodes: updatedNodes });
    } else {
      setLocalHeader({
        ...localHeader,
        nodes: localHeader.nodes.filter((n) => n.id !== nodeId),
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
      const updatedNodes = localHeader.nodes.map((n) => {
        if (n.id === parentId && n.children) {
          return {
            ...n,
            children: n.children.map((c) => (c.id === node.id ? updatedItem : c)),
          };
        }
        return n;
      });
      setLocalHeader({ ...localHeader, nodes: updatedNodes });
    } else {
      const updatedNodes = localHeader.nodes.map((n) =>
        n.id === node.id ? { ...updatedItem, children: n.children } : n
      );
      setLocalHeader({ ...localHeader, nodes: updatedNodes });
    }

    setEditingNode(null);
  };

  return (
    <div className="space-y-6">
      {/* Live Store Navigation Preview */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live Store Navigation Header Preview
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {localHeader.nodes.length} Primary Menu Links
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center font-black text-sm">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm">{localHeader.brand_name}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 overflow-x-auto">
            {localHeader.nodes.map((node) => (
              <span key={node.id} className="flex items-center gap-1 hover:text-amber-800 cursor-default shrink-0">
                <span>{node.label}</span>
                {node.badge && (
                  <span className="px-1.5 py-0.2 text-[8px] font-black rounded bg-amber-100 text-amber-900 uppercase">
                    {node.badge}
                  </span>
                )}
                {node.children && node.children.length > 0 && (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Node Tree Builder */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Navigation Node Tree</h3>
            <p className="text-xs text-slate-500">
              Manage primary menu links and sub-menu dropdown levels for your store.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddTopLevelNode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Primary Link</span>
            </button>
            <button
              type="button"
              onClick={handleSaveNavigation}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Navigation</span>
            </button>
          </div>
        </div>

        {/* Tree Items */}
        <div className="space-y-3">
          {localHeader.nodes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No navigation links added yet. Click "Add Primary Link" to start.
            </div>
          ) : (
            localHeader.nodes.map((node, idx) => (
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
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {node.badge}
                      </span>
                    )}
                    {node.children && node.children.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-500">
                        ({node.children.length} sub-links)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddChildNode(node.id)}
                      className="text-xs text-amber-800 hover:text-amber-900 font-bold px-2 py-1 rounded-lg hover:bg-amber-50 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Dropdown</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditNode(node)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                      title="Edit Node"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNode(node.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Node"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-Menu Children */}
                {node.children && node.children.length > 0 && (
                  <div className="p-3 bg-white border-t border-slate-100 space-y-2 pl-8">
                    {node.children.map((child) => (
                      <div
                        key={child.id}
                        className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/40 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold text-slate-800">{child.label}</span>
                          <span className="text-[11px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {child.url}
                          </span>
                          {child.badge && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              {child.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditNode(child, node.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNode(child.id, node.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Node Modal */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingNode.parentId ? 'Edit Sub-Menu Item' : 'Edit Primary Navigation Link'}
            </h3>
            <form onSubmit={handleSaveEditedNode} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label</label>
                <input
                  type="text"
                  required
                  value={nodeLabel}
                  onChange={(e) => setNodeLabel(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Route / URL</label>
                <input
                  type="text"
                  required
                  value={nodeUrl}
                  onChange={(e) => setNodeUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Highlight Badge (Optional)</label>
                <input
                  type="text"
                  value={nodeBadge}
                  onChange={(e) => setNodeBadge(e.target.value)}
                  placeholder="e.g. FRESH, SALE"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 uppercase text-xs"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
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
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon, Star } from 'lucide-react';
import { uploadFileWithSignedUrl, UploadProgress } from '../providers/uploadService';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export function MultiImageUpload({ images, onChange, disabled }: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);

  const handleFiles = async (files: FileList | File[]) => {
    if (disabled || !files || files.length === 0) return;

    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    // Create initial queue items
    const newQueueItems: UploadProgress[] = fileArray.map((file, idx) => ({
      fileId: `${Date.now()}_${idx}_${file.name}`,
      fileName: file.name,
      fileSize: file.size,
      progress: 0,
      status: 'pending',
    }));

    setUploadQueue((prev) => [...prev, ...newQueueItems]);

    // Process uploads asynchronously directly from browser via signed upload
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const queueItem = newQueueItems[i];

      // Mark as uploading
      setUploadQueue((prev) =>
        prev.map((item) => (item.fileId === queueItem.fileId ? { ...item, status: 'uploading' } : item))
      );

      try {
        const result = await uploadFileWithSignedUrl(file, (percent) => {
          setUploadQueue((prev) =>
            prev.map((item) => (item.fileId === queueItem.fileId ? { ...item, progress: percent } : item))
          );
        });

        // Mark as completed
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.fileId === queueItem.fileId
              ? { ...item, status: 'completed', progress: 100, url: result.url }
              : item
          )
        );

        // Add to product images
        onChange([...images, result.url]);
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.fileId === queueItem.fileId
              ? { ...item, status: 'error', error: err.message || 'Upload failed' }
              : item
          )
        );
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    const target = images[indexToPrimary];
    const withoutTarget = images.filter((_, idx) => idx !== indexToPrimary);
    onChange([target, ...withoutTarget]);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const activeUploads = uploadQueue.filter((item) => item.status === 'uploading' || item.status === 'pending');

  return (
    <div className="space-y-5">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-amber-700 bg-amber-50/70 scale-[1.005]'
            : 'border-slate-300 hover:border-amber-700/60 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center shadow-xs">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800">
            Click to browse or drag & drop product images
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Async signed upload directly from browser • PNG, JPG, WebP, AVIF up to 50MB
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="mt-1 px-4 py-2 bg-white border border-slate-300 hover:border-amber-800 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-bold shadow-2xs transition-all"
        >
          Select Images from Computer
        </button>
      </div>

      {/* Active Uploads Queue Bar */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          {uploadQueue.map((item) => (
            <div
              key={item.fileId}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center gap-3 text-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                {item.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : item.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <UploadCloud className="w-4 h-4 text-amber-600 animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between font-medium">
                  <span className="truncate font-semibold text-slate-800">{item.fileName}</span>
                  <span className="text-slate-500 font-mono text-[11px] shrink-0 ml-2">
                    {formatBytes(item.fileSize)} • {item.progress}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 rounded-full ${
                      item.status === 'error'
                        ? 'bg-rose-500'
                        : item.status === 'completed'
                        ? 'bg-emerald-500'
                        : 'bg-amber-600'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                {item.error && <span className="text-[10px] text-rose-600 block mt-1">{item.error}</span>}
              </div>
              {item.status !== 'uploading' && (
                <button
                  type="button"
                  onClick={() => setUploadQueue((prev) => prev.filter((q) => q.fileId !== item.fileId))}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Uploaded Product Images</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </span>
          </div>
          {images.length > 0 && (
            <span className="text-[11px] text-slate-400">
              First image is the primary catalog cover
            </span>
          )}
        </div>

        {images.length === 0 ? (
          <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50/60 text-center text-slate-400 text-xs">
            No images uploaded yet. Drop image files above to add them to this product.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imgUrl, idx) => (
              <div
                key={`${imgUrl}_${idx}`}
                className={`relative group rounded-2xl overflow-hidden border bg-white shadow-2xs transition-all ${
                  idx === 0 ? 'border-amber-600 ring-2 ring-amber-600/20' : 'border-slate-200'
                }`}
              >
                {/* Image display */}
                <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
                  <img
                    src={imgUrl}
                    alt={`Product view ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Primary Cover Badge */}
                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-800 text-white text-[9px] font-black uppercase tracking-wider rounded-md shadow-xs flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Cover
                  </span>
                )}

                {/* Card Controls */}
                <div className="p-2 bg-white flex items-center justify-between gap-1 border-t border-slate-100">
                  {idx !== 0 ? (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="text-[10px] font-bold text-amber-800 hover:text-amber-900 transition-colors"
                    >
                      Make Cover
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500">Cover Image</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove Image"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState, useRef } from 'react';
import { 
  X, Plus, Trash2, Upload, Check, Eye, ChevronLeft, ChevronRight, 
  Sparkles, Palette, Image as ImageIcon, Loader2, RotateCcw 
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { LUXURY_COLOR_PRESETS } from './colorPresets';

export default function ColorSwatchesModal({
  isOpen = false,
  onClose,
  swatches = [],
  onUpdateSwatches,
  onSelectColorSwatch,
  activeColorId
}) {
  const [editingList, setEditingList] = useState(swatches);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [activePresetIndex, setActivePresetIndex] = useState(null);
  const fileInputRefs = useRef({});

  React.useEffect(() => {
    setEditingList(swatches);
  }, [swatches, isOpen]);

  if (!isOpen) return null;

  const handleCommit = (updated) => {
    setEditingList(updated);
    onUpdateSwatches?.(updated);
  };

  const handleUpdateField = (index, field, value) => {
    const next = [...editingList];
    next[index] = {
      ...next[index],
      [field]: value
    };
    handleCommit(next);
  };

  const handleApplyPreset = (index, preset) => {
    const next = [...editingList];
    next[index] = {
      ...next[index],
      name: next[index].name || preset.name,
      color: preset.color,
      hex: preset.hex,
      image: next[index].image || preset.sampleImage
    };
    handleCommit(next);
  };

  const handleAddSwatch = () => {
    const newIdx = editingList.length;
    const preset = LUXURY_COLOR_PRESETS[newIdx % LUXURY_COLOR_PRESETS.length];
    const newSwatch = {
      id: `color-${Date.now()}`,
      name: `${preset.name}`,
      color: preset.color,
      hex: preset.hex,
      image: preset.sampleImage
    };
    const next = [...editingList, newSwatch];
    handleCommit(next);
  };

  const handleDeleteSwatch = (index) => {
    if (editingList.length <= 1) {
      alert('Bạn cần giữ ít nhất 1 nút màu cho sản phẩm.');
      return;
    }
    const next = editingList.filter((_, i) => i !== index);
    handleCommit(next);
  };

  const handleMoveSwatch = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= editingList.length) return;
    const next = [...editingList];
    const item = next.splice(fromIdx, 1)[0];
    next.splice(toIdx, 0, item);
    handleCommit(next);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const res = await adminApi.uploadImage(file);
      if (res.data?.url) {
        handleUpdateField(index, 'image', res.data.url);
        onSelectColorSwatch?.({ ...editingList[index], image: res.data.url });
        return;
      }
    } catch (err) {
      console.warn('Backend upload failed, reading as data URL:', err);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      handleUpdateField(index, 'image', e.target.result);
      onSelectColorSwatch?.({ ...editingList[index], image: e.target.result });
    };
    reader.readAsDataURL(file);
    setUploadingIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-[28px] bg-[#161618] border border-white/15 p-5 sm:p-7 shadow-2xl text-start space-y-6 max-h-[90vh] flex flex-col apple-animate-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Quản Lý Bảng Màu Sắc & Slideshow</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-[#2997ff] border border-blue-500/30 font-mono">
                  {editingList.length} màu
                </span>
              </h3>
              <p className="text-xs text-[#86868b]">
                Khi chọn vào màu nào, ảnh trong slideshow sẽ đổi sang màu đó
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Swatches List */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {editingList.map((swatch, idx) => {
            const isCurrentActive = swatch.id === activeColorId;

            return (
              <div 
                key={swatch.id || idx}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isCurrentActive 
                    ? 'bg-[#1c1c20] border-[#0071e3] ring-1 ring-[#0071e3]/40' 
                    : 'bg-[#18181b] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top bar of each swatch: Circle preview, Name, Actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Visual Swatch Circle */}
                    <div 
                      className="relative w-10 h-10 rounded-full flex-shrink-0 border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      style={{ background: swatch.color || swatch.hex || '#333' }}
                      title="Nhấp để xem thử màu này trên slideshow"
                      onClick={() => onSelectColorSwatch?.(swatch)}
                    >
                      {isCurrentActive && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />}
                    </div>

                    {/* Color Name Input */}
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] text-[#86868b] block mb-0.5">Tên màu hiển thị</label>
                      <input
                        type="text"
                        value={swatch.name || ''}
                        onChange={(e) => handleUpdateField(idx, 'name', e.target.value)}
                        placeholder="Ví dụ: Titanium Gray, Space Black..."
                        className="w-full bg-[#111113] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#0071e3]"
                      />
                    </div>
                  </div>

                  {/* Actions: Move, Preview, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectColorSwatch?.(swatch)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-600 text-blue-400 hover:text-white text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
                      title="Xem thử màu này trên ảnh lớn slideshow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Xem thử</span>
                    </button>

                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveSwatch(idx, idx - 1)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Dời sang trái"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < editingList.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveSwatch(idx, idx + 1)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Dời sang phải"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteSwatch(idx)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer ml-1"
                      title="Xóa nút màu này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Color Chooser Section */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-neutral-400 font-medium">Chọn màu sắc nhanh:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-500">Màu đơn:</span>
                      <input
                        type="color"
                        value={swatch.hex || '#484b50'}
                        onChange={(e) => {
                          const hex = e.target.value;
                          handleUpdateField(idx, 'hex', hex);
                          handleUpdateField(idx, 'color', hex);
                        }}
                        className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0 outline-none"
                        title="Chọn màu bất kỳ bằng bảng màu"
                      />
                    </div>
                  </div>

                  {/* Gradient Presets Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
                    {LUXURY_COLOR_PRESETS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(idx, preset)}
                        className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform flex-shrink-0 cursor-pointer shadow"
                        style={{ background: preset.color }}
                        title={`${preset.name} (${preset.hex})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Connected Slideshow Image */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-300 font-medium flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Hình ảnh trong slideshow khi chọn màu này:</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Thumbnail preview */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#111113] border border-white/10 flex-shrink-0 relative group/thumb">
                      {swatch.image ? (
                        <img 
                          src={swatch.image} 
                          alt={swatch.name} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Image URL Input & File Upload Button */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={swatch.image || ''}
                          onChange={(e) => handleUpdateField(idx, 'image', e.target.value)}
                          placeholder="Dán link ảnh (URL)..."
                          className="flex-1 bg-[#111113] border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white outline-none focus:border-[#0071e3]"
                        />

                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[idx] = el)}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(idx, file);
                          }}
                        />

                        <button
                          type="button"
                          disabled={uploadingIndex === idx}
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          className="px-3 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer flex-shrink-0"
                          title="Tải ảnh mới từ máy tính của bạn"
                        >
                          {uploadingIndex === idx ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Tải ảnh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={handleAddSwatch}
            className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nút màu mới</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="apple-btn-blue px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-lg"
          >
            Hoàn Tất & Lưu
          </button>
        </div>

      </div>
    </div>
  );
}

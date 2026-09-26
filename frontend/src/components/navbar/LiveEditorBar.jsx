import React, { useRef, useState } from 'react';
import { Save, RotateCcw, X, Check, Loader2, Sparkles, AlertCircle, ImagePlus, ArrowUpDown, ChevronUp, ChevronDown, Undo2, Redo2, Plus, Trash2, GripVertical } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LiveEditorBar({
  isEditMode,
  hasChanges,
  isSaving,
  onSave,
  onReset,
  onExit,
  onAddFloatingImage,
  onAddFloatingImageFile,
  sectionOrder = ['hero', 'configurator', 'bento', 'specs'],
  onMoveSection,
  onDeleteSection,
  onRestoreSection,
  onOpenCanvaDrawer,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) {
  const { language } = useLanguage();
  const fileInputRef = useRef(null);
  const [showSectionModal, setShowSectionModal] = useState(false);

  if (!isEditMode) return null;

  const sectionLabels = {
    hero: '1. Khối Giới Thiệu Hero',
    configurator: '2. Trình Chọn Cấu Hình Mua Hàng',
    bento: '3. Thẻ Đột Phá Bento Highlights',
    specs: '4. Bảng Thông Số Tech Specs'
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onAddFloatingImageFile) {
        onAddFloatingImageFile(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          onAddFloatingImage?.(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[94vw] sm:w-auto">
        <div className="px-5 py-3 rounded-full bg-[#161617]/95 backdrop-blur-2xl border border-[#333336] shadow-2xl flex flex-wrap items-center justify-between sm:justify-center gap-3 sm:gap-4 text-xs text-[#f5f5f7] apple-animate-in">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#30d158]"></span>
            </span>
            <span className="font-semibold text-white tracking-tight text-[12px]">
              Live Drag & Drop Editor
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#2c2c2e] text-[10px] uppercase font-mono text-[#2997ff] border border-white/5">
              {language}
            </span>
          </div>

          {/* Quick Tools: Canva Studio, Undo/Redo, Add Image & Section Order */}
          <div className="flex items-center gap-2 border-l border-r border-white/10 px-3">
            {/* Canva Studio Drawer Button */}
            <button
              onClick={onOpenCanvaDrawer}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/25 border border-blue-400/30 cursor-pointer"
              title="Mở Canva Studio: Thêm chữ H1/H2, huy hiệu luxury hoặc ảnh"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold">Canva Studio</span>
            </button>

            {/* Undo / Redo Shortcuts */}
            <div className="flex items-center gap-1 bg-[#2c2c2e] p-0.5 rounded-full border border-white/5">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                  canUndo
                    ? 'text-white hover:bg-white/15 cursor-pointer'
                    : 'text-neutral-500 cursor-not-allowed opacity-40'
                }`}
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                  canRedo
                    ? 'text-white hover:bg-white/15 cursor-pointer'
                    : 'text-neutral-500 cursor-not-allowed opacity-40'
                }`}
                title="Làm lại (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/5"
              title="Tải ảnh từ máy tính để kéo thả tự do trên trang"
            >
              <ImagePlus className="w-3.5 h-3.5 text-[#2997ff]" />
              <span className="hidden md:inline">+ Thêm Ảnh Tự Do</span>
            </button>

            <button
              onClick={() => setShowSectionModal(!showSectionModal)}
              className="px-3 py-1.5 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#f5f5f7] text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/5"
              title="Đổi thứ tự hiển thị các khối trên trang"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#ff9f0a]" />
              <span className="hidden md:inline">Thứ Tự Khối</span>
            </button>
          </div>

          {/* Change status badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#86868b]">
            {hasChanges ? (
              <span className="text-[#ff9f0a] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Có thay đổi chưa lưu</span>
              </span>
            ) : (
              <span className="text-[#30d158] flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Đã đồng bộ</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={onReset}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Khôi phục lại như cũ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hoàn tác</span>
              </button>
            )}

            <button
              onClick={onSave}
              disabled={isSaving || !hasChanges}
              className={`px-4 py-1.5 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md ${
                hasChanges
                  ? 'apple-btn-blue text-white cursor-pointer'
                  : 'bg-[#2c2c2e] text-[#6e6e73] cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Lên Web</span>
                </>
              )}
            </button>

            <button
              onClick={onExit}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#86868b] hover:text-white transition-colors cursor-pointer"
              title="Thoát chế độ sửa trực tiếp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Popover for Section Ordering & Management */}
      {showSectionModal && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-84 rounded-2xl bg-[#161617] border border-[#333336] p-4 shadow-2xl apple-animate-in space-y-3.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="text-xs font-semibold text-white">Quản lý & Sắp xếp khối</h3>
              <p className="text-[10px] text-neutral-400">Đổi thứ tự, ẩn hoặc thêm lại các phần trang</p>
            </div>
            <button 
              onClick={() => setShowSectionModal(false)}
              className="text-[#86868b] hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Sections on page */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400">Khối đang hiển thị:</span>
            {sectionOrder.length === 0 ? (
              <p className="text-xs text-neutral-500 italic p-2 text-center">Chưa có khối nào được bật</p>
            ) : (
              sectionOrder.map((secKey, idx) => (
                <div 
                  key={secKey}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c1c1e] border border-white/5 text-xs text-[#f5f5f7] hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-white/10 text-neutral-400 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{sectionLabels[secKey] || secKey}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {idx > 0 && (
                      <button
                        onClick={() => onMoveSection?.(idx, idx - 1)}
                        className="p-1 rounded hover:bg-white/10 text-[#86868b] hover:text-white transition-colors"
                        title="Dời lên trên"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < sectionOrder.length - 1 && (
                      <button
                        onClick={() => onMoveSection?.(idx, idx + 1)}
                        className="p-1 rounded hover:bg-white/10 text-[#86868b] hover:text-white transition-colors"
                        title="Dời xuống dưới"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteSection?.(secKey)}
                      className="p-1 rounded hover:bg-rose-500/20 text-neutral-500 hover:text-rose-400 transition-colors ml-1"
                      title="Ẩn / Xóa khối này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Hidden Sections that can be restored */}
          {['hero', 'configurator', 'bento', 'specs'].some(k => !sectionOrder.includes(k)) && (
            <div className="border-t border-white/10 pt-3 space-y-2">
              <span className="text-[11px] font-semibold text-neutral-400">Khối đã ẩn / xóa (Bấm để thêm lại):</span>
              <div className="space-y-1.5">
                {['hero', 'configurator', 'bento', 'specs']
                  .filter(k => !sectionOrder.includes(k))
                  .map(hiddenKey => (
                    <div
                      key={hiddenKey}
                      className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-dashed border-white/15 text-xs text-neutral-400 hover:border-emerald-500/50 transition-all"
                    >
                      <span>{sectionLabels[hiddenKey] || hiddenKey}</span>
                      <button
                        onClick={() => onRestoreSection?.(hiddenKey)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer"
                        title="Hiển thị lại khối này lên trang"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm lại</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

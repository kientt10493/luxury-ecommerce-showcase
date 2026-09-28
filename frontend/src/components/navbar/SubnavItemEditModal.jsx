import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Link as LinkIcon, Sparkles, ExternalLink, ArrowRight, Compass } from 'lucide-react';

const PRESET_SECTIONS = [
  { id: '#overview', name: 'Overview (Hero Showcase)', icon: '🌟' },
  { id: '#configuration', name: 'Chọn Cấu hình Mua (Configuration)', icon: '🛒' },
  { id: '#innovations', name: 'Đột phá Công nghệ (Bento Features)', icon: '⚡' },
  { id: '#specs', name: 'Thông số Kỹ thuật (Tech Specs)', icon: '📋' },
];

export default function SubnavItemEditModal({
  isOpen,
  item,
  onClose,
  onSave,
  onDelete,
}) {
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('#overview');
  const [type, setType] = useState('link'); // 'link' | 'button'
  const [styleVariant, setStyleVariant] = useState('default'); // 'default' | 'primary' | 'glass'
  const [newTab, setNewTab] = useState(false);

  useEffect(() => {
    if (item) {
      setLabel(item.label || '');
      setHref(item.href || '#overview');
      setType(item.type || 'link');
      setStyleVariant(item.styleVariant || 'default');
      setNewTab(Boolean(item.newTab));
    } else {
      setLabel('');
      setHref('#overview');
      setType('link');
      setStyleVariant('default');
      setNewTab(false);
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    onSave({
      ...(item || {}),
      id: item?.id || `subnav-${Date.now()}`,
      label: label.trim(),
      href: href.trim() || '#overview',
      type,
      styleVariant,
      newTab,
    });
    onClose();
  };

  const isEditingExisting = Boolean(item && item.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md apple-animate-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#1d1d1f] border border-[#38383a] shadow-2xl overflow-hidden text-[#f5f5f7] select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#2d2d2f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0071e3]/20 flex items-center justify-center text-[#2997ff]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                {isEditingExisting ? 'Tùy chỉnh nút điều hướng' : 'Tạo nút điều hướng mới'}
              </h3>
              <p className="text-[11px] text-[#86868b]">
                Thanh Subnav dưới thanh tiêu đề sản phẩm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#86868b] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Label Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#a1a1a6] flex items-center justify-between">
              <span>Tên hiển thị trên nút / liên kết</span>
              <span className="text-[#86868b]">Ví dụ: Overview, Tech Specs, Mua ngay</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Nhập tên nút (vd: Tổng quan, Thông số...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#2c2c2e] border border-white/10 text-white placeholder-[#6e6e73] focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all text-xs"
            />
          </div>

          {/* Navigation Target (Href) */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#a1a1a6] flex items-center justify-between">
              <span>Liên kết đích khi click (Cuộn trang hoặc URL)</span>
              <LinkIcon className="w-3 h-3 text-[#86868b]" />
            </label>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_SECTIONS.map((sec) => (
                <button
                  type="button"
                  key={sec.id}
                  onClick={() => setHref(sec.id)}
                  className={`px-2.5 py-2 rounded-xl text-left border transition-all flex items-center gap-1.5 cursor-pointer ${
                    href === sec.id
                      ? 'bg-[#0071e3]/20 border-[#0071e3] text-white font-medium shadow-sm'
                      : 'bg-[#2c2c2e]/70 border-white/5 text-[#a1a1a6] hover:bg-[#2c2c2e] hover:text-white'
                  }`}
                >
                  <span className="text-xs">{sec.icon}</span>
                  <span className="truncate text-[11px]">{sec.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <input
              type="text"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="Hoặc nhập liên kết tự do: #specs hoặc https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#2c2c2e] border border-white/10 text-white placeholder-[#6e6e73] focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all text-xs font-mono"
            />
          </div>

          {/* Display Type: Text Link vs Pill Button */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#a1a1a6]">
              Kiểu hiển thị
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('link')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  type === 'link'
                    ? 'bg-[#0071e3]/20 border-[#0071e3] text-white font-medium'
                    : 'bg-[#2c2c2e]/60 border-white/5 text-[#a1a1a6] hover:bg-[#2c2c2e]'
                }`}
              >
                <div className="text-xs font-medium">Dạng Text Link</div>
                <div className="text-[10px] text-[#86868b] mt-0.5">Nhẹ nhàng, tối giản chuẩn Apple</div>
                <div className="mt-2 text-xs underline decoration-blue-500/50 text-[#f5f5f7]">
                  {label || 'Sample Link'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType('button')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  type === 'button'
                    ? 'bg-[#0071e3]/20 border-[#0071e3] text-white font-medium'
                    : 'bg-[#2c2c2e]/60 border-white/5 text-[#a1a1a6] hover:bg-[#2c2c2e]'
                }`}
              >
                <div className="text-xs font-medium">Dạng Nút Bấm (Pill Button)</div>
                <div className="text-[10px] text-[#86868b] mt-0.5">Nổi bật, thúc đẩy tương tác</div>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-[#0071e3] text-white text-[11px] font-medium">
                  {label || 'Sample Button'}
                </div>
              </button>
            </div>
          </div>

          {/* Button Style Variants if Type is Button */}
          {type === 'button' && (
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-medium text-[#a1a1a6]">
                Màu sắc nút bấm
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStyleVariant('primary')}
                  className={`flex-1 py-1.5 rounded-lg text-center text-[11px] font-medium border transition-all cursor-pointer ${
                    styleVariant === 'primary' || styleVariant === 'default'
                      ? 'bg-[#0071e3] text-white border-blue-400'
                      : 'bg-[#2c2c2e] text-[#a1a1a6] border-white/5'
                  }`}
                >
                  Xanh Apple Signature
                </button>
                <button
                  type="button"
                  onClick={() => setStyleVariant('glass')}
                  className={`flex-1 py-1.5 rounded-lg text-center text-[11px] font-medium border transition-all cursor-pointer ${
                    styleVariant === 'glass'
                      ? 'bg-white/20 text-white border-white/40'
                      : 'bg-[#2c2c2e] text-[#a1a1a6] border-white/5'
                  }`}
                >
                  Kính mờ Tối giản
                </button>
              </div>
            </div>
          )}

          {/* Open in new tab option for external links */}
          {href.startsWith('http') && (
            <label className="flex items-center gap-2 pt-1 text-[11px] text-[#a1a1a6] cursor-pointer">
              <input
                type="checkbox"
                checked={newTab}
                onChange={(e) => setNewTab(e.target.checked)}
                className="rounded border-[#424245] text-[#0071e3] focus:ring-[#0071e3] bg-[#2c2c2e]"
              />
              <span>Mở trong tab mới (target="_blank")</span>
            </label>
          )}

          {/* Actions: Delete (if editing) & Cancel & Submit */}
          <div className="pt-3 border-t border-[#2d2d2f] flex items-center justify-between gap-3">
            {isEditingExisting ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Bạn có chắc muốn xóa nút "${label}" không?`)) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa nút này</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-[#2c2c2e] hover:bg-[#38383a] text-[#d1d1d6] text-xs font-medium transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEditingExisting ? 'Lưu thay đổi' : 'Thêm nút'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

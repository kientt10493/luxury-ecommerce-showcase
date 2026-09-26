import React from 'react';
import { Save, RotateCcw, X, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LiveEditorBar({
  isEditMode,
  hasChanges,
  isSaving,
  onSave,
  onReset,
  onExit
}) {
  const { language } = useLanguage();

  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92vw] sm:w-auto">
      <div className="px-5 py-3 rounded-full bg-[#161617]/95 backdrop-blur-2xl border border-[#333336] shadow-2xl flex flex-wrap items-center justify-between sm:justify-center gap-3 sm:gap-4 text-xs text-[#f5f5f7] apple-animate-in">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#30d158]"></span>
          </span>
          <span className="font-semibold text-white tracking-tight text-[12px]">
            Chế Độ Sửa Trực Tiếp (Live Word Mode)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#2c2c2e] text-[10px] uppercase font-mono text-[#2997ff] border border-white/5">
            {language}
          </span>
        </div>

        {/* Change status badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#86868b]">
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
  );
}

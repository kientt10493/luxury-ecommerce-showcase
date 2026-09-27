import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import EditableText from '../common/EditableText';
import { Plus, Trash2 } from 'lucide-react';

export default function TechSpecs({
  product,
  isEditMode = false,
  onUpdateSpecsMap,
  textOffsets = {},
  onUpdateTextOffset,
  blockStyles = {},
  activeBlockId,
  onSelectBlock,
  textOverrides = {},
  onUpdateTextOverride,
  hiddenElements = [],
  onDeleteElement
}) {
  const { t } = useLanguage();

  if (!product) return null;

  const internalKeys = ['floating_images', 'section_order', 'canvas_elements', 'text_offsets', 'block_styles'];
  
  // Extract user-facing specs
  const rawSpecs = Object.entries(product.specifications || {})
    .filter(([key, value]) => !internalKeys.includes(key) && typeof value !== 'object');

  // Default fallback if no custom specs are set yet
  const specs = rawSpecs.length > 0 ? rawSpecs : [
    ["Diameter", "42mm"],
    ["Battery", "14 Days"],
    ["Waterproof", "10 ATM"],
    ["Available Finishes", product.variants?.map(v => v.attributes?.color).filter(Boolean).join(', ') || 'Space Black'],
    ["Coverage", "2-Year global warranty with dedicated concierge support"]
  ];

  // Handlers for modifying spec rows
  const handleUpdateKey = (oldKey, newKey) => {
    if (!newKey.trim() || oldKey === newKey) return;
    const currentSpecs = { ...(product.specifications || {}) };
    const val = currentSpecs[oldKey] || '';
    delete currentSpecs[oldKey];
    currentSpecs[newKey.trim()] = val;
    onUpdateSpecsMap?.(currentSpecs);
  };

  const handleUpdateValue = (key, newVal) => {
    const currentSpecs = { ...(product.specifications || {}) };
    currentSpecs[key] = newVal;
    onUpdateSpecsMap?.(currentSpecs);
  };

  const handleDeleteRow = (keyToDelete) => {
    const currentSpecs = { ...(product.specifications || {}) };
    delete currentSpecs[keyToDelete];
    onUpdateSpecsMap?.(currentSpecs);
  };

  const handleAddRow = () => {
    const currentSpecs = { ...(product.specifications || {}) };
    const newKey = `Thông số mới ${Object.keys(currentSpecs).length + 1}`;
    currentSpecs[newKey] = 'Tiêu chuẩn cao cấp';
    onUpdateSpecsMap?.(currentSpecs);
  };

  return (
    <section id="specs" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0b0c] border-t border-[#1d1d1f] text-start">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          {!hiddenElements.includes('specs-category-eyebrow') && (
            <div className="relative group/spec-eyebrow inline-block">
              <EditableText
                id="specs-category-eyebrow"
                value={textOverrides?.['specs-category-eyebrow'] ?? "Specifications"}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['specs-category-eyebrow']}
                isSelected={activeBlockId === 'specs-category-eyebrow'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateTextOverride?.('specs-category-eyebrow', val)}
                offset={textOffsets?.['specs-category-eyebrow']}
                onOffsetChange={onUpdateTextOffset}
                as="div"
                className="text-xs font-semibold uppercase tracking-wider text-[#86868b]"
              />
              {isEditMode && onDeleteElement && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement('specs-category-eyebrow');
                  }}
                  className="absolute -top-2 -right-3 z-20 w-4 h-4 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] shadow opacity-0 group-hover/spec-eyebrow:opacity-100 transition-opacity cursor-pointer"
                  title="Xóa / Ẩn (khôi phục trong Canva Studio)"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {!hiddenElements.includes('specs-section-title') && (
            <div className="relative group/spec-title">
              <EditableText
                id="specs-section-title"
                value={textOverrides?.['specs-section-title'] ?? `${product.name} Tech Specs`}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['specs-section-title']}
                isSelected={activeBlockId === 'specs-section-title'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateTextOverride?.('specs-section-title', val)}
                offset={textOffsets?.['specs-section-title']}
                onOffsetChange={onUpdateTextOffset}
                as="h2"
                className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f5f7]"
              />
              {isEditMode && onDeleteElement && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement('specs-section-title');
                  }}
                  className="absolute -top-2 -right-3 z-20 w-4 h-4 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] shadow opacity-0 group-hover/spec-title:opacity-100 transition-opacity cursor-pointer"
                  title="Xóa / Ẩn tiêu đề (khôi phục trong Canva Studio)"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {!hiddenElements.includes('specs-section-subtitle') && (
            <div className="relative group/spec-sub">
              <EditableText
                id="specs-section-subtitle"
                value={textOverrides?.['specs-section-subtitle'] ?? t('specs.subtitle')}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['specs-section-subtitle']}
                isSelected={activeBlockId === 'specs-section-subtitle'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateTextOverride?.('specs-section-subtitle', val)}
                offset={textOffsets?.['specs-section-subtitle']}
                onOffsetChange={onUpdateTextOffset}
                as="p"
                className="text-base text-[#86868b]"
              />
              {isEditMode && onDeleteElement && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement('specs-section-subtitle');
                  }}
                  className="absolute -top-2 -right-3 z-20 w-4 h-4 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] shadow opacity-0 group-hover/spec-sub:opacity-100 transition-opacity cursor-pointer"
                  title="Xóa / Ẩn phụ đề (khôi phục trong Canva Studio)"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Minimalist Apple Specs List with Hairline Dividers */}
        {!hiddenElements.includes('specs-table-card') && (
        <div 
          style={{
            ...(blockStyles?.['specs-table-card'] || {})
          }}
          onClick={(e) => {
            if (isEditMode && e.target === e.currentTarget) {
              onSelectBlock?.({
                id: 'specs-table-card',
                type: 'Bảng Thông Số',
                label: 'Khối Bảng Thông Số Kỹ Thuật',
                style: blockStyles?.['specs-table-card'] || {}
              });
            }
          }}
          className={`relative group/spec-table border-t border-[#333336] divide-y divide-[#262629] transition-all rounded-2xl ${
            activeBlockId === 'specs-table-card'
              ? 'ring-2 ring-[#0071e3] p-4 bg-white/5'
              : isEditMode
              ? 'hover:ring-1 hover:ring-[#0071e3]/40 cursor-pointer'
              : ''
          }`}
          title={isEditMode ? 'Nhấp để đổi nền, viền và kiểu dáng bảng thông số bằng Canva Studio' : undefined}
        >
          {isEditMode && onDeleteElement && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteElement('specs-table-card');
              }}
              className="absolute top-2 right-2 z-30 px-2 py-0.5 rounded-md bg-rose-500/80 hover:bg-rose-600 text-white text-[11px] font-medium shadow flex items-center gap-1 opacity-0 group-hover/spec-table:opacity-100 transition-opacity cursor-pointer"
              title="Ẩn toàn bộ Bảng Thông Số này (khôi phục trong Canva Studio)"
            >
              ✕ Ẩn bảng
            </button>
          )}
          {specs.map(([label, value], idx) => (
            <div
              key={`${label}-${idx}`}
              className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline group/row transition-colors hover:bg-white/[0.02] px-2 rounded-xl"
            >
              {/* Spec Label */}
              <div className="sm:col-span-4 text-sm font-semibold text-white">
                <EditableText
                  id={`specs-label-${idx}`}
                  value={label}
                  isEditing={isEditMode}
                  blockStyle={blockStyles?.[`specs-label-${idx}`]}
                  isSelected={activeBlockId === `specs-label-${idx}`}
                  onSelectBlock={onSelectBlock}
                  onChange={(newLabel) => handleUpdateKey(label, newLabel)}
                  className="font-semibold text-white"
                  allowDrag={false}
                />
              </div>

              {/* Spec Value */}
              <div className="sm:col-span-7 text-sm text-[#a1a1a6] leading-relaxed">
                <EditableText
                  id={`specs-val-${idx}`}
                  value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  isEditing={isEditMode}
                  blockStyle={blockStyles?.[`specs-val-${idx}`]}
                  isSelected={activeBlockId === `specs-val-${idx}`}
                  onSelectBlock={onSelectBlock}
                  onChange={(newVal) => handleUpdateValue(label, newVal)}
                  className="text-[#a1a1a6]"
                  allowDrag={false}
                />
              </div>

              {/* Delete row action button */}
              {isEditMode && (
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(label)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover/row:opacity-100 cursor-pointer"
                    title={`Xóa dòng "${label}"`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        )}

        {/* Add Row Button in Edit Mode */}
        {isEditMode && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddRow}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 text-blue-400 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm dòng thông số mới</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

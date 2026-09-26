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
  onSelectBlock
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
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Specifications
          </div>
          <div>
            <EditableText
              id="specs-section-title"
              value={`${product.name} Tech Specs`}
              isEditing={isEditMode}
              blockStyle={blockStyles?.['specs-section-title']}
              isSelected={activeBlockId === 'specs-section-title'}
              onSelectBlock={onSelectBlock}
              offset={textOffsets?.['specs-section-title']}
              onOffsetChange={onUpdateTextOffset}
              as="h2"
              className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f5f7]"
            />
          </div>
          <div>
            <EditableText
              id="specs-section-subtitle"
              value={t('specs.subtitle')}
              isEditing={isEditMode}
              blockStyle={blockStyles?.['specs-section-subtitle']}
              isSelected={activeBlockId === 'specs-section-subtitle'}
              onSelectBlock={onSelectBlock}
              offset={textOffsets?.['specs-section-subtitle']}
              onOffsetChange={onUpdateTextOffset}
              as="p"
              className="text-base text-[#86868b]"
            />
          </div>
        </div>

        {/* Minimalist Apple Specs List with Hairline Dividers */}
        <div className="border-t border-[#333336] divide-y divide-[#262629]">
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

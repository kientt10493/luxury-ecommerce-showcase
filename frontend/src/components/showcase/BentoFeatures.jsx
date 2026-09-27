import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Eye, Cpu, Headphones, Shield, Sparkles, Zap, Layers, 
  CheckCircle2, Award, GripVertical, ArrowLeftRight, 
  Trash2, Plus, X, Flame, Star, Battery, Wifi 
} from 'lucide-react';
import EditableText from '../common/EditableText';

const ICON_MAP = {
  Sparkles,
  Shield,
  Cpu,
  Zap,
  Award,
  Headphones,
  Eye,
  Layers,
  CheckCircle2,
  Flame,
  Star,
  Battery,
  Wifi
};

const DEFAULT_ICONS = ['Sparkles', 'Cpu', 'Zap', 'Shield'];
const DEFAULT_COLORS = ['#2997ff', '#ff9f0a', '#30d158', '#bf5af2'];

export default function BentoFeatures({ 
  product,
  isEditMode = false,
  onUpdateFeature,
  onUpdateField,
  onReorderFeatures,
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

  const features = product.features || [];
  const internalKeys = ['floating_images', 'section_order', 'canvas_elements', 'text_offsets', 'block_styles'];
  const specs = product.specifications || {};
  const specEntries = Object.entries(specs).filter(([k, v]) => !internalKeys.includes(k) && typeof v !== 'object');

  // Dynamic feature highlights derived from actual product data
  const feature1 = features[0] || product.tagline || product.name;
  const feature2 = features[1] || (specEntries[0] ? `${specEntries[0][0]}: ${String(specEntries[0][1])}` : 'Engineered Performance');
  const feature3 = features[2] || (specEntries[1] ? `${specEntries[1][0]}: ${String(specEntries[1][1])}` : 'Sensory Immersion');
  const feature4 = features[3] || (specEntries[2] ? `${specEntries[2][0]}: ${String(specEntries[2][1])}` : `${product.name} Craftsmanship`);

  // Key spec tags for Card 1 bottom bar
  const defaultHighlightTags = specEntries.length > 0 
    ? specEntries.slice(0, 3).map(([key, val]) => `${key}: ${String(val)}`)
    : ['Precision Engineered', 'Apple Quality Standard', 'Tested & Certified'];

  let customTags = defaultHighlightTags;
  try {
    if (textOverrides['bento-custom-tags']) {
      customTags = JSON.parse(textOverrides['bento-custom-tags']);
    }
  } catch (e) {}

  const handleRemoveTag = (tagIdx) => {
    const next = customTags.filter((_, i) => i !== tagIdx);
    onUpdateTextOverride?.('bento-custom-tags', JSON.stringify(next));
  };

  const handleAddTag = () => {
    const next = [...customTags, `Thông số mới ${customTags.length + 1}`];
    onUpdateTextOverride?.('bento-custom-tags', JSON.stringify(next));
  };

  // Hidden cards state parsed from textOverrides
  let hiddenCards = [];
  try {
    hiddenCards = textOverrides['bento-hidden-cards'] ? JSON.parse(textOverrides['bento-hidden-cards']) : [];
  } catch (e) {
    hiddenCards = [];
  }

  const handleToggleHideCard = (cardIdx) => {
    let next;
    if (hiddenCards.includes(cardIdx)) {
      next = hiddenCards.filter((i) => i !== cardIdx);
    } else {
      next = [...hiddenCards, cardIdx];
    }
    onUpdateTextOverride?.('bento-hidden-cards', JSON.stringify(next));
  };

  // Hidden footer specs for Card 4
  let hiddenFooterSpecs = [];
  try {
    hiddenFooterSpecs = textOverrides['bento-hidden-footer-specs'] ? JSON.parse(textOverrides['bento-hidden-footer-specs']) : [];
  } catch (e) {}

  const handleToggleHideFooterSpec = (specIdx) => {
    let next;
    if (hiddenFooterSpecs.includes(specIdx)) {
      next = hiddenFooterSpecs.filter((i) => i !== specIdx);
    } else {
      next = [...hiddenFooterSpecs, specIdx];
    }
    onUpdateTextOverride?.('bento-hidden-footer-specs', JSON.stringify(next));
  };

  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [openIconPicker, setOpenIconPicker] = useState(null);

  const renderCardToolbar = (index) => {
    if (!isEditMode) return null;
    const cardId = `bento-card-${index}`;
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-white/10 text-[11px] text-[#86868b] w-full">
        <div 
          className="flex items-center gap-1.5 font-semibold text-[#2997ff] bg-black/40 px-2.5 py-1 rounded-full border border-white/10 cursor-grab active:cursor-grabbing"
          title="Kéo thả thẻ này sang thẻ khác để đổi vị trí"
        >
          <GripVertical className="w-3.5 h-3.5" />
          <span>⠿ Kéo thẻ #{index + 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectBlock?.({
              id: cardId,
              type: 'card',
              label: `Thẻ Bento #${index + 1}`,
              style: blockStyles?.[cardId] || {}
            })}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer shadow ${
              activeBlockId === cardId
                ? 'bg-[#0071e3] text-white ring-2 ring-white/30'
                : 'bg-blue-500/20 hover:bg-[#0071e3] text-[#2997ff] hover:text-white'
            }`}
            title="Sửa nền, viền và style thẻ này bằng Canva Studio"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>🎨 Sửa nền thẻ</span>
          </button>

          {index > 0 && (
            <button
              type="button"
              onClick={() => onReorderFeatures?.(index, index - 1)}
              className="px-2 py-1 rounded-full bg-white/10 hover:bg-[#0071e3] text-white transition-all cursor-pointer text-[11px] font-medium flex items-center gap-1 shadow"
              title="Đổi vị trí sang trước"
            >
              <span>◀</span>
            </button>
          )}
          {index < 3 && (
            <button
              type="button"
              onClick={() => onReorderFeatures?.(index, index + 1)}
              className="px-2 py-1 rounded-full bg-white/10 hover:bg-[#0071e3] text-white transition-all cursor-pointer text-[11px] font-medium flex items-center gap-1 shadow"
              title="Đổi vị trí sang sau"
            >
              <span>▶</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onDeleteElement?.(`bento-card-${index}`);
              handleToggleHideCard(index);
            }}
            className="px-2.5 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white transition-all cursor-pointer text-[11px] font-medium flex items-center gap-1 shadow ml-1"
            title="Ẩn / Xóa thẻ Bento này khỏi trang (Có thể khôi phục lại trong Canva Studio)"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Xóa thẻ</span>
          </button>
        </div>
      </div>
    );
  };

  const makeDragProps = (index) => ({
    draggable: isEditMode,
    onDragStart: (e) => {
      // Don't drag card if user is selecting or editing text inside an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', String(index));
    },
    onDragOver: (e) => {
      if (!isEditMode) return;
      e.preventDefault();
      setDragOverIndex(index);
    },
    onDragLeave: () => {
      if (dragOverIndex === index) setDragOverIndex(null);
    },
    onDrop: (e) => {
      if (!isEditMode) return;
      e.preventDefault();
      setDragOverIndex(null);
      const src = Number(e.dataTransfer.getData('text/plain'));
      if (!isNaN(src) && src !== index) {
        onReorderFeatures?.(src, index);
      }
    }
  });

  const getCardCustomStyle = (index) => {
    const s = blockStyles?.[`bento-card-${index}`] || {};
    return {
      ...(s.backgroundColor ? { backgroundColor: s.backgroundColor } : {}),
      ...(s.background ? { background: s.background } : {}),
      ...(s.backgroundImage ? { backgroundImage: s.backgroundImage, backgroundSize: s.backgroundSize || 'cover', backgroundPosition: s.backgroundPosition || 'center' } : {}),
      ...(s.borderRadius ? { borderRadius: s.borderRadius } : {}),
      ...(s.border ? { border: s.border } : {}),
      ...(s.padding ? { padding: s.padding } : {}),
      ...(s.boxShadow ? { boxShadow: s.boxShadow } : {}),
      ...(s.backdropFilter ? { backdropFilter: s.backdropFilter, WebkitBackdropFilter: s.backdropFilter } : {})
    };
  };

  const renderCardIcon = (cardIndex) => {
    const iconKey = textOverrides?.[`bento-card-${cardIndex}-icon`] || DEFAULT_ICONS[cardIndex] || 'Sparkles';
    const IconComponent = ICON_MAP[iconKey] || Sparkles;
    const iconColor = DEFAULT_COLORS[cardIndex] || '#2997ff';

    return (
      <div className="relative inline-block select-none">
        <button
          type="button"
          onClick={() => {
            if (isEditMode) {
              setOpenIconPicker(openIconPicker === cardIndex ? null : cardIndex);
            }
          }}
          className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${
            isEditMode ? 'hover:scale-105 hover:border-blue-500 hover:bg-white/10 cursor-pointer ring-1 ring-blue-500/40' : ''
          }`}
          style={{ color: iconColor }}
          title={isEditMode ? 'Nhấp để chọn đổi icon khác cho thẻ này' : undefined}
        >
          <IconComponent className="w-6 h-6" />
        </button>

        {/* Icon Picker Popover */}
        {isEditMode && openIconPicker === cardIndex && (
          <div className="absolute top-14 left-0 z-50 p-3 rounded-2xl bg-[#1c1c1e] border border-white/15 shadow-2xl grid grid-cols-4 gap-2 w-56 backdrop-blur-2xl">
            {Object.entries(ICON_MAP).map(([name, Comp]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onUpdateTextOverride?.(`bento-card-${cardIndex}-icon`, name);
                  setOpenIconPicker(null);
                }}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  iconKey === name ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title={name}
              >
                <Comp className="w-5 h-5" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="innovations" className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-start">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Apple Style Section Headline */}
        <div className="space-y-3">
          {!hiddenElements.includes('bento-badge') && (
            <div>
              <EditableText
                id="bento-badge"
                value={textOverrides?.['bento-badge'] ?? t('bento.badge')}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['bento-badge']}
                isSelected={activeBlockId === 'bento-badge'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateTextOverride?.('bento-badge', val)}
                offset={textOffsets?.['bento-badge']}
                onOffsetChange={onUpdateTextOffset}
                as="div"
                className="text-xs font-semibold text-[#ff9f0a] uppercase tracking-wider"
              />
            </div>
          )}
          {!hiddenElements.includes('bento-title') && !hiddenElements.includes('bento-section-title') && (
            <div>
              <EditableText
                id="bento-section-title"
                value={textOverrides?.['bento-section-title'] ?? "Get the highlights."}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['bento-section-title']}
                isSelected={activeBlockId === 'bento-section-title'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateTextOverride?.('bento-section-title', val)}
                offset={textOffsets?.['bento-section-title']}
                onOffsetChange={onUpdateTextOffset}
                as="h2"
                className="text-4xl sm:text-6xl font-bold tracking-tight text-[#f5f5f7]"
              />
            </div>
          )}
          {!hiddenElements.includes('bento-subtitle') && !hiddenElements.includes('bento-section-subtitle') && (
            <div>
              <EditableText
                id="bento-section-subtitle"
                value={product.tagline || t('bento.subtitle')}
                isEditing={isEditMode}
                blockStyle={blockStyles?.['bento-section-subtitle']}
                isSelected={activeBlockId === 'bento-section-subtitle'}
                onSelectBlock={onSelectBlock}
                onChange={(val) => onUpdateField?.('tagline', val)}
                offset={textOffsets?.['bento-section-subtitle']}
                onOffsetChange={onUpdateTextOffset}
                as="p"
                className="text-lg text-[#86868b] max-w-2xl font-normal leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Dynamic Apple Bento Grid with Drag & Drop Reordering */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Main Flagship Breakthrough (Large 8 Cols) */}
          {!hiddenCards.includes(0) && !hiddenElements.includes('bento-card-0') && (
            <div 
              {...makeDragProps(0)}
              style={getCardCustomStyle(0)}
              className={`md:col-span-8 p-8 sm:p-10 rounded-[32px] bg-[#161617] border transition-all flex flex-col justify-between space-y-6 group shadow-xl ${
                dragOverIndex === 0
                  ? 'ring-4 ring-[#0071e3] scale-[1.01] bg-[#1c1c1f] border-[#0071e3]'
                  : activeBlockId === 'bento-card-0'
                  ? 'ring-2 ring-[#0071e3] border-[#0071e3]'
                  : isEditMode
                  ? 'border-[#0071e3]/40 border-dashed hover:border-[#0071e3]'
                  : 'border-[#2d2d30]'
              }`}
            >
              {renderCardToolbar(0)}

              <div>
                {renderCardIcon(0)}
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="text-xs uppercase tracking-wider text-[#2997ff] font-semibold">
                  <EditableText
                    id="bento-card-0-eyebrow"
                    value={textOverrides?.['bento-card-0-eyebrow'] ?? product.name}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-0-eyebrow']}
                    isSelected={activeBlockId === 'bento-card-0-eyebrow'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateTextOverride?.('bento-card-0-eyebrow', val)}
                    offset={textOffsets?.['bento-card-0-eyebrow']}
                    onOffsetChange={onUpdateTextOffset}
                    as="div"
                    className="text-xs uppercase tracking-wider text-[#2997ff] font-semibold"
                  />
                </div>

                <div>
                  <EditableText
                    id="bento-card-0-title"
                    value={feature1}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-0-title']}
                    isSelected={activeBlockId === 'bento-card-0-title'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateFeature?.(0, val)}
                    offset={textOffsets?.['bento-card-0-title']}
                    onOffsetChange={onUpdateTextOffset}
                    as="h3"
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight"
                  />
                </div>

                <div>
                  <EditableText
                    id="bento-card-0-desc"
                    value={product.description || t('bento.subtitle')}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-0-desc']}
                    isSelected={activeBlockId === 'bento-card-0-desc'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateField?.('description', val)}
                    offset={textOffsets?.['bento-card-0-desc']}
                    onOffsetChange={onUpdateTextOffset}
                    as="p"
                    multiline={true}
                    className="text-[#86868b] text-base leading-relaxed font-normal"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
                {customTags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    <EditableText
                      id={`bento-tag-${idx}`}
                      value={textOverrides?.[`bento-tag-${idx}`] ?? tag}
                      isEditing={isEditMode}
                      onChange={(val) => onUpdateTextOverride?.(`bento-tag-${idx}`, val)}
                      onSelectBlock={onSelectBlock}
                      isSelected={activeBlockId === `bento-tag-${idx}`}
                      blockStyle={blockStyles?.[`bento-tag-${idx}`]}
                      allowDrag={false}
                      className="text-xs text-[#a1a1a6] font-mono"
                    />
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-neutral-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                        title="Xóa tag này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 transition-all text-xs flex items-center gap-1 cursor-pointer"
                    title="Thêm tag nổi bật mới"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm tag</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bento Card 2: Computational Silicon / Architecture (4 Cols) */}
          {!hiddenCards.includes(1) && !hiddenElements.includes('bento-card-1') && (
            <div 
              {...makeDragProps(1)}
              style={getCardCustomStyle(1)}
              className={`md:col-span-4 p-8 rounded-[32px] bg-[#161617] border transition-all flex flex-col justify-between space-y-6 shadow-xl ${
                dragOverIndex === 1
                  ? 'ring-4 ring-[#0071e3] scale-[1.01] bg-[#1c1c1f] border-[#0071e3]'
                  : activeBlockId === 'bento-card-1'
                  ? 'ring-2 ring-[#0071e3] border-[#0071e3]'
                  : isEditMode
                  ? 'border-[#0071e3]/40 border-dashed hover:border-[#0071e3]'
                  : 'border-[#2d2d30]'
              }`}
            >
              {renderCardToolbar(1)}

              <div>
                {renderCardIcon(1)}
              </div>

              <div className="space-y-3">
                <div>
                  <EditableText
                    id="bento-card-1-title"
                    value={feature2}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-1-title']}
                    isSelected={activeBlockId === 'bento-card-1-title'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateFeature?.(1, val)}
                    offset={textOffsets?.['bento-card-1-title']}
                    onOffsetChange={onUpdateTextOffset}
                    as="h3"
                    className="text-2xl font-bold tracking-tight text-white leading-snug"
                  />
                </div>
                <div>
                  <EditableText
                    id="bento-card-1-desc"
                    value={textOverrides?.['bento-card-1-desc'] ?? (specEntries[0] 
                      ? `Engineered with ${specEntries[0][0]}: ${specEntries[0][1]} for uncompromised fidelity.` 
                      : 'Engineered with bespoke hardware telemetry and micro-architecture for instant responsiveness.')}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-1-desc']}
                    isSelected={activeBlockId === 'bento-card-1-desc'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateTextOverride?.('bento-card-1-desc', val)}
                    offset={textOffsets?.['bento-card-1-desc']}
                    onOffsetChange={onUpdateTextOffset}
                    as="p"
                    multiline={true}
                    className="text-[#86868b] text-sm leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <EditableText
                  id="bento-card-1-badge"
                  value={textOverrides?.['bento-card-1-badge'] ?? (specEntries[0] ? `${specEntries[0][0]} • Optimized` : 'Peak Efficiency')}
                  isEditing={isEditMode}
                  onChange={(val) => onUpdateTextOverride?.('bento-card-1-badge', val)}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'bento-card-1-badge'}
                  blockStyle={blockStyles?.['bento-card-1-badge']}
                  allowDrag={false}
                  className="text-[11px] text-[#ff9f0a] font-mono font-medium"
                />
              </div>
            </div>
          )}

          {/* Bento Card 3: Sensory & Telemetry (4 Cols) */}
          {!hiddenCards.includes(2) && !hiddenElements.includes('bento-card-2') && (
            <div 
              {...makeDragProps(2)}
              style={getCardCustomStyle(2)}
              className={`md:col-span-4 p-8 rounded-[32px] bg-[#161617] border transition-all flex flex-col justify-between space-y-6 shadow-xl ${
                dragOverIndex === 2
                  ? 'ring-4 ring-[#0071e3] scale-[1.01] bg-[#1c1c1f] border-[#0071e3]'
                  : activeBlockId === 'bento-card-2'
                  ? 'ring-2 ring-[#0071e3] border-[#0071e3]'
                  : isEditMode
                  ? 'border-[#0071e3]/40 border-dashed hover:border-[#0071e3]'
                  : 'border-[#2d2d30]'
              }`}
            >
              {renderCardToolbar(2)}

              <div>
                {renderCardIcon(2)}
              </div>

              <div className="space-y-3">
                <div>
                  <EditableText
                    id="bento-card-2-title"
                    value={feature3}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-2-title']}
                    isSelected={activeBlockId === 'bento-card-2-title'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateFeature?.(2, val)}
                    offset={textOffsets?.['bento-card-2-title']}
                    onOffsetChange={onUpdateTextOffset}
                    as="h3"
                    className="text-2xl font-bold tracking-tight text-white leading-snug"
                  />
                </div>
                <div>
                  <EditableText
                    id="bento-card-2-desc"
                    value={textOverrides?.['bento-card-2-desc'] ?? (specEntries[1]
                      ? `Advanced integration featuring ${specEntries[1][0]}: ${specEntries[1][1]}.`
                      : 'Continuous telemetry feedback calibrated for real-time human interaction.')}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-2-desc']}
                    isSelected={activeBlockId === 'bento-card-2-desc'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateTextOverride?.('bento-card-2-desc', val)}
                    offset={textOffsets?.['bento-card-2-desc']}
                    onOffsetChange={onUpdateTextOffset}
                    as="p"
                    multiline={true}
                    className="text-[#86868b] text-sm leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <EditableText
                  id="bento-card-2-badge"
                  value={textOverrides?.['bento-card-2-badge'] ?? (specEntries[1] ? `${specEntries[1][0]} • Certified` : 'Precision Tuned')}
                  isEditing={isEditMode}
                  onChange={(val) => onUpdateTextOverride?.('bento-card-2-badge', val)}
                  onSelectBlock={onSelectBlock}
                  isSelected={activeBlockId === 'bento-card-2-badge'}
                  blockStyle={blockStyles?.['bento-card-2-badge']}
                  allowDrag={false}
                  className="text-[11px] text-[#30d158] font-mono font-medium"
                />
              </div>
            </div>
          )}

          {/* Bento Card 4: Materials & Craftsmanship (Large 8 Cols) */}
          {!hiddenCards.includes(3) && !hiddenElements.includes('bento-card-3') && (
            <div 
              {...makeDragProps(3)}
              style={getCardCustomStyle(3)}
              className={`md:col-span-8 p-8 sm:p-10 rounded-[32px] bg-[#161617] border transition-all flex flex-col justify-between space-y-6 shadow-xl ${
                dragOverIndex === 3
                  ? 'ring-4 ring-[#0071e3] scale-[1.01] bg-[#1c1c1f] border-[#0071e3]'
                  : activeBlockId === 'bento-card-3'
                  ? 'ring-2 ring-[#0071e3] border-[#0071e3]'
                  : isEditMode
                  ? 'border-[#0071e3]/40 border-dashed hover:border-[#0071e3]'
                  : 'border-[#2d2d30]'
              }`}
            >
              {renderCardToolbar(3)}

              <div>
                {renderCardIcon(3)}
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <EditableText
                    id="bento-card-3-title"
                    value={feature4}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-3-title']}
                    isSelected={activeBlockId === 'bento-card-3-title'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateFeature?.(3, val)}
                    offset={textOffsets?.['bento-card-3-title']}
                    onOffsetChange={onUpdateTextOffset}
                    as="h3"
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight"
                  />
                </div>
                <div>
                  <EditableText
                    id="bento-card-3-desc"
                    value={textOverrides?.['bento-card-3-desc'] ?? (specEntries[2]
                      ? `Every component conforms to the highest industrial specifications, combining ${specEntries[2][0]}: ${specEntries[2][1]} with aerospace-grade durability.`
                      : 'Formed from premium materials selected for structural integrity, tactile satisfaction, and prolonged endurance.')}
                    isEditing={isEditMode}
                    blockStyle={blockStyles?.['bento-card-3-desc']}
                    isSelected={activeBlockId === 'bento-card-3-desc'}
                    onSelectBlock={onSelectBlock}
                    onChange={(val) => onUpdateTextOverride?.('bento-card-3-desc', val)}
                    offset={textOffsets?.['bento-card-3-desc']}
                    onOffsetChange={onUpdateTextOffset}
                    as="p"
                    multiline={true}
                    className="text-[#86868b] text-base leading-relaxed font-normal"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
                {!hiddenFooterSpecs.includes(0) && (
                  <div className="flex items-center gap-1.5">
                    <EditableText
                      id="bento-card-3-spec-0"
                      value={textOverrides?.['bento-card-3-spec-0'] ?? `${product.variants?.length || 1} Configurations`}
                      isEditing={isEditMode}
                      onChange={(val) => onUpdateTextOverride?.('bento-card-3-spec-0', val)}
                      onSelectBlock={onSelectBlock}
                      isSelected={activeBlockId === 'bento-card-3-spec-0'}
                      blockStyle={blockStyles?.['bento-card-3-spec-0']}
                      allowDrag={false}
                    />
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleToggleHideFooterSpec(0)}
                        className="text-neutral-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                        title="Xóa thông số này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
                {!hiddenFooterSpecs.includes(0) && !hiddenFooterSpecs.includes(1) && <span className="text-[#424245]">•</span>}
                {!hiddenFooterSpecs.includes(1) && (
                  <div className="flex items-center gap-1.5">
                    <EditableText
                      id="bento-card-3-spec-1"
                      value={textOverrides?.['bento-card-3-spec-1'] ?? "Global 2-Year Coverage"}
                      isEditing={isEditMode}
                      onChange={(val) => onUpdateTextOverride?.('bento-card-3-spec-1', val)}
                      onSelectBlock={onSelectBlock}
                      isSelected={activeBlockId === 'bento-card-3-spec-1'}
                      blockStyle={blockStyles?.['bento-card-3-spec-1']}
                      allowDrag={false}
                    />
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleToggleHideFooterSpec(1)}
                        className="text-neutral-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                        title="Xóa thông số này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
                {(!hiddenFooterSpecs.includes(0) || !hiddenFooterSpecs.includes(1)) && !hiddenFooterSpecs.includes(2) && <span className="text-[#424245]">•</span>}
                {!hiddenFooterSpecs.includes(2) && (
                  <div className="flex items-center gap-1.5">
                    <EditableText
                      id="bento-card-3-spec-2"
                      value={textOverrides?.['bento-card-3-spec-2'] ?? "100% Recyclable Packaging"}
                      isEditing={isEditMode}
                      onChange={(val) => onUpdateTextOverride?.('bento-card-3-spec-2', val)}
                      onSelectBlock={onSelectBlock}
                      isSelected={activeBlockId === 'bento-card-3-spec-2'}
                      blockStyle={blockStyles?.['bento-card-3-spec-2']}
                      allowDrag={false}
                    />
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleToggleHideFooterSpec(2)}
                        className="text-neutral-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                        title="Xóa thông số này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
                {isEditMode && hiddenFooterSpecs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onUpdateTextOverride?.('bento-hidden-footer-specs', '[]')}
                    className="px-2 py-0.5 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/20 cursor-pointer"
                    title="Khôi phục các thông số chân trang đã xóa"
                  >
                    + Khôi phục {hiddenFooterSpecs.length} thông số
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Restore Hidden Cards Bar (Edit Mode Only) */}
        {isEditMode && hiddenCards.length > 0 && (
          <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <span>⚠️ Có {hiddenCards.length} thẻ Bento đang bị ẩn/xóa:</span>
              <div className="flex flex-wrap items-center gap-2">
                {hiddenCards.map(idx => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleHideCard(idx)}
                    className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer font-medium"
                  >
                    ➕ Khôi phục Thẻ #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateTextOverride?.('bento-hidden-cards', '[]')}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              Khôi phục tất cả thẻ
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

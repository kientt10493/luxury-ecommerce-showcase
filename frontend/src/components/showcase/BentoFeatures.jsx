import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Eye, Cpu, Headphones, Shield, Sparkles, Zap, Layers, CheckCircle2, Award, GripVertical, ArrowLeftRight } from 'lucide-react';
import EditableText from '../common/EditableText';

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
  onSelectBlock
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
  const highlightTags = specEntries.length > 0 
    ? specEntries.slice(0, 3).map(([key, val]) => `${key}: ${String(val)}`)
    : ['Precision Engineered', 'Apple Quality Standard', 'Tested & Certified'];

  const [dragOverIndex, setDragOverIndex] = React.useState(null);

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

  return (
    <section id="innovations" className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-start">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Apple Style Section Headline */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[#ff9f0a] uppercase tracking-wider">
            {t('bento.badge')}
          </div>
          <div>
            <EditableText
              id="bento-section-title"
              value="Get the highlights."
              isEditing={isEditMode}
              blockStyle={blockStyles?.['bento-section-title']}
              isSelected={activeBlockId === 'bento-section-title'}
              onSelectBlock={onSelectBlock}
              offset={textOffsets?.['bento-section-title']}
              onOffsetChange={onUpdateTextOffset}
              as="h2"
              className="text-4xl sm:text-6xl font-bold tracking-tight text-[#f5f5f7]"
            />
          </div>
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
        </div>

        {/* Dynamic Apple Bento Grid with Drag & Drop Reordering */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Main Flagship Breakthrough (Large 8 Cols) */}
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

            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2997ff]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="text-xs uppercase tracking-wider text-[#2997ff] font-semibold">
                {product.name}
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

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
              {highlightTags.map((tag, idx) => (
                <React.Fragment key={idx}>
                  <span>{tag}</span>
                  {idx < highlightTags.length - 1 && <span className="text-[#424245]">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bento Card 2: Computational Silicon / Architecture (4 Cols) */}
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

            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff9f0a]">
              <Cpu className="w-6 h-6" />
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
              <p className="text-[#86868b] text-sm leading-relaxed">
                {specEntries[0] 
                  ? `Engineered with ${specEntries[0][0]}: ${specEntries[0][1]} for uncompromised fidelity.` 
                  : 'Engineered with bespoke hardware telemetry and micro-architecture for instant responsiveness.'}
              </p>
            </div>

            <div className="text-[11px] text-[#ff9f0a] font-mono font-medium">
              {specEntries[0] ? `${specEntries[0][0]} • Optimized` : 'Peak Efficiency'}
            </div>
          </div>

          {/* Bento Card 3: Sensory & Telemetry (4 Cols) */}
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

            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#30d158]">
              <Zap className="w-6 h-6" />
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
              <p className="text-[#86868b] text-sm leading-relaxed">
                {specEntries[1]
                  ? `Advanced integration featuring ${specEntries[1][0]}: ${specEntries[1][1]}.`
                  : 'Continuous telemetry feedback calibrated for real-time human interaction.'}
              </p>
            </div>

            <div className="text-[11px] text-[#30d158] font-mono font-medium">
              {specEntries[1] ? `${specEntries[1][0]} • Certified` : 'Precision Tuned'}
            </div>
          </div>

          {/* Bento Card 4: Materials & Craftsmanship (Large 8 Cols) */}
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

            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#bf5af2]">
              <Shield className="w-6 h-6" />
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
              <p className="text-[#86868b] text-base leading-relaxed font-normal">
                {specEntries[2]
                  ? `Every component conforms to the highest industrial specifications, combining ${specEntries[2][0]}: ${specEntries[2][1]} with aerospace-grade durability.`
                  : 'Formed from premium materials selected for structural integrity, tactile satisfaction, and prolonged endurance.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#a1a1a6] font-mono border-t border-white/5 pt-4">
              <span>{product.variants?.length || 1} Configurations</span>
              <span className="text-[#424245]">•</span>
              <span>Global 2-Year Coverage</span>
              <span className="text-[#424245]">•</span>
              <span>100% Recyclable Packaging</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { productApi, adminApi } from '../services/api';
import Navbar, { DEFAULT_SUBNAV_ITEMS } from '../components/navbar/Navbar';
import HeroShowcase from '../components/showcase/HeroShowcase';
import VariantPicker from '../components/showcase/VariantPicker';
import BentoFeatures from '../components/showcase/BentoFeatures';
import TechSpecs from '../components/showcase/TechSpecs';
import QuickBuyModal from '../components/checkout/QuickBuyModal';
import VietQRModal from '../components/checkout/VietQRModal';
import LiveEditorBar from '../components/navbar/LiveEditorBar';
import DraggableFloatingImage from '../components/common/DraggableFloatingImage';
import CanvaOverlay from '../components/common/canva/CanvaOverlay';
import CanvaBlockInspector from '../components/common/canva/CanvaBlockInspector';
import EditableText from '../components/common/EditableText';
import { Loader2, Shield, X, Key, Layers, ArrowUp, ArrowDown, GripVertical, Trash2, Sparkles } from 'lucide-react';

const DEFAULT_PAGE_DIMENSIONS = {
  widthMode: '100%',
  customWidth: '100%',
  minHeight: 'auto',
  paddingX: 0,
  paddingY: 0,
  backgroundColor: '',
  align: 'center'
};

export default function HomePage({ onNavigateAdmin, onOrderSuccess }) {
  const { language, t } = useLanguage();
  const { currency, formatPrice } = useCurrency();

  const [products, setProducts] = useState([]);
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Edit Mode state (Word-style in-place editing & Drag-and-drop)
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('Admin@2026');
  const [authError, setAuthError] = useState('');

  // Drag & drop floating images and section ordering state
  const [floatingImages, setFloatingImages] = useState([]);
  const [sectionOrder, setSectionOrder] = useState(['hero', 'configurator', 'bento', 'specs']);
  const [subnavItems, setSubnavItems] = useState(DEFAULT_SUBNAV_ITEMS);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);

  // Canva Studio visual canvas elements, text offsets & block styling state
  const [canvasElements, setCanvasElements] = useState([]);
  const [textOffsets, setTextOffsets] = useState({});
  const [blockStyles, setBlockStyles] = useState({});
  const [textOverrides, setTextOverrides] = useState({});
  const [activeBlock, setActiveBlock] = useState(null);
  const [pageDimensions, setPageDimensions] = useState(DEFAULT_PAGE_DIMENSIONS);
  const [hiddenElements, setHiddenElements] = useState([]);
  const [isCanvaDrawerOpen, setIsCanvaDrawerOpen] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const canvaHistoryRef = useRef({
    undo: () => {},
    redo: () => {}
  });

  const handleHistoryStateChange = React.useCallback(({ canUndo: u, canRedo: r, undo, redo }) => {
    canvaHistoryRef.current = { undo, redo };
    setCanUndo((prev) => (prev !== u ? u : prev));
    setCanRedo((prev) => (prev !== r ? r : prev));
  }, []);

  // Modals state
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutVariant, setCheckoutVariant] = useState(null);
  const [vietQRData, setVietQRData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    productApi.getProducts(language, currency)
      .then((res) => {
        if (!isMounted) return;
        setProducts(res.data);
        if (res.data.length > 0) {
          const targetId = activeProductId || res.data[0].id;
          if (!activeProductId) {
            setActiveProductId(targetId);
          }
          return productApi.getProductDetail(targetId, language, currency);
        }
      })
      .then((detailRes) => {
        if (!isMounted) return;
        if (detailRes && detailRes.data) {
          const prodData = detailRes.data;
          setActiveProduct(prodData);
          if (prodData.variants && prodData.variants.length > 0) {
            setSelectedVariant(prodData.variants[0]);
          }
          // Load floating images & section order from specifications
          if (prodData.specifications?.floating_images) {
            setFloatingImages(prodData.specifications.floating_images);
          } else {
            setFloatingImages([]);
          }
          if (prodData.specifications?.section_order) {
            setSectionOrder(prodData.specifications.section_order);
          } else {
            setSectionOrder(['hero', 'configurator', 'bento', 'specs']);
          }
          if (prodData.specifications?.canvas_elements) {
            setCanvasElements(prodData.specifications.canvas_elements);
          } else {
            setCanvasElements([]);
          }
          if (prodData.specifications?.text_offsets) {
            setTextOffsets(prodData.specifications.text_offsets);
          } else {
            setTextOffsets({});
          }
          if (prodData.specifications?.block_styles) {
            setBlockStyles(prodData.specifications.block_styles);
          } else {
            setBlockStyles({});
          }
          if (prodData.specifications?.subnav_items && Array.isArray(prodData.specifications.subnav_items)) {
            setSubnavItems(prodData.specifications.subnav_items);
          } else {
            const savedLocal = localStorage.getItem(`aura_subnav_items_${prodData.id}`);
            if (savedLocal) {
              try {
                setSubnavItems(JSON.parse(savedLocal));
              } catch (e) {
                setSubnavItems(DEFAULT_SUBNAV_ITEMS);
              }
            } else {
              setSubnavItems(DEFAULT_SUBNAV_ITEMS);
            }
          }
          if (prodData.specifications?.text_overrides) {
            setTextOverrides(prodData.specifications.text_overrides);
          } else {
            const savedOverrides = localStorage.getItem(`aura_text_overrides_${prodData.id}`);
            if (savedOverrides) {
              try {
                setTextOverrides(JSON.parse(savedOverrides));
              } catch (e) {
                setTextOverrides({});
              }
            } else {
              setTextOverrides({});
            }
          }
          if (prodData.specifications?.page_dimensions) {
            setPageDimensions({ ...DEFAULT_PAGE_DIMENSIONS, ...prodData.specifications.page_dimensions });
          } else {
            const savedDims = localStorage.getItem(`aura_page_dimensions_${prodData.id}`);
            if (savedDims) {
              try {
                setPageDimensions({ ...DEFAULT_PAGE_DIMENSIONS, ...JSON.parse(savedDims) });
              } catch (e) {
                setPageDimensions(DEFAULT_PAGE_DIMENSIONS);
              }
            } else {
              setPageDimensions(DEFAULT_PAGE_DIMENSIONS);
            }
          }
          if (prodData.specifications?.hidden_elements && Array.isArray(prodData.specifications.hidden_elements)) {
            setHiddenElements(prodData.specifications.hidden_elements);
          } else {
            const savedHidden = localStorage.getItem(`aura_hidden_elements_${prodData.id}`);
            if (savedHidden) {
              try {
                setHiddenElements(JSON.parse(savedHidden));
              } catch (e) {
                setHiddenElements([]);
              }
            } else {
              setHiddenElements([]);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeProductId, language, currency]);

  const handleSelectProduct = (prod) => {
    setActiveProductId(prod.id);
    setActiveBlock(null);
    setHasChanges(false);
  };

  // Toggle Live Edit
  const handleToggleLiveEdit = () => {
    if (isEditMode) {
      setIsEditMode(false);
      return;
    }
    const token = localStorage.getItem('aura_admin_token');
    if (!token) {
      setShowAuthModal(true);
    } else {
      setIsEditMode(true);
    }
  };

  const handleQuickAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await adminApi.login(adminUsername, adminPassword);
      localStorage.setItem('aura_admin_token', res.data.access_token);
      setShowAuthModal(false);
      setIsEditMode(true);
    } catch (err) {
      setAuthError('Mật khẩu không chính xác. Vui lòng thử lại.');
    }
  };

  // In-place text field update
  const handleUpdateField = (field, value) => {
    if (!activeProduct) return;
    setActiveProduct((prev) => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Subnav items update handler
  const handleUpdateSubnavItems = (newItems) => {
    setSubnavItems(newItems);
    if (activeProduct) {
      try {
        localStorage.setItem(`aura_subnav_items_${activeProduct.id}`, JSON.stringify(newItems));
      } catch (e) {
        // ignore storage errors
      }
      setActiveProduct((prev) => ({
        ...prev,
        specifications: {
          ...(prev.specifications || {}),
          subnav_items: newItems
        }
      }));
    }
    setHasChanges(true);
  };

  // In-place feature highlight update
  const handleUpdateFeature = (index, value) => {
    if (!activeProduct) return;
    const currentFeatures = [...(activeProduct.features || [])];
    while (currentFeatures.length <= index) {
      currentFeatures.push('');
    }
    currentFeatures[index] = value;
    setActiveProduct((prev) => ({
      ...prev,
      features: currentFeatures
    }));
    setHasChanges(true);
  };

  // Reorder Bento feature highlights (Drag & Drop or Swap)
  const handleReorderFeatures = (sourceIdx, targetIdx) => {
    if (!activeProduct) return;
    const list = [...(activeProduct.features || [])];
    while (list.length < 4) {
      list.push(`Feature ${list.length + 1}`);
    }
    const temp = list[sourceIdx];
    list[sourceIdx] = list[targetIdx];
    list[targetIdx] = temp;
    setActiveProduct((prev) => ({
      ...prev,
      features: list
    }));
    setHasChanges(true);
  };

  // Update Hero Hardware main image directly (Upload or Drop)
  const handleUpdateHeroImage = (dataUrl) => {
    if (!activeProduct) return;
    const newImages = [...(activeProduct.images || [])];
    if (newImages.length > 0) {
      newImages[0] = dataUrl;
    } else {
      newImages.push(dataUrl);
    }
    setActiveProduct((prev) => ({
      ...prev,
      images: newImages
    }));
    setHasChanges(true);
  };

  // Update hero badges
  const handleUpdateBadge = (index, val) => {
    handleUpdateFeature(index, val);
  };

  // Upload and Image Handlers
  const handleUpdateHeroImageFile = async (file) => {
    if (!activeProduct) return;
    try {
      const res = await adminApi.uploadImage(file);
      if (res.data?.url) {
        handleUpdateHeroImage(res.data.url);
        return;
      }
    } catch (err) {
      console.warn('Backend upload failed, falling back to data URL:', err);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      handleUpdateHeroImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddFloatingImage = (srcUrl) => {
    const newImg = {
      id: `float-${Date.now()}`,
      src: srcUrl,
      x: Math.min(window.innerWidth - 260, 40 + floatingImages.length * 30),
      y: 160 + floatingImages.length * 40,
      width: 220,
      caption: ''
    };
    setFloatingImages((prev) => [...prev, newImg]);
    setHasChanges(true);
  };

  const handleAddFloatingImageFile = async (file) => {
    try {
      const res = await adminApi.uploadImage(file);
      if (res.data?.url) {
        handleAddFloatingImage(res.data.url);
        return;
      }
    } catch (err) {
      console.warn('Backend upload failed, falling back to data URL:', err);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      handleAddFloatingImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateFloatingImagePosition = (id, x, y) => {
    setFloatingImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
    setHasChanges(true);
  };

  const handleUpdateFloatingImageWidth = (id, width) => {
    setFloatingImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, width } : item))
    );
    setHasChanges(true);
  };

  const handleDeleteFloatingImage = (id) => {
    setFloatingImages((prev) => prev.filter((item) => item.id !== id));
    setHasChanges(true);
  };

  // Canva Studio elements change handler
  const handleCanvasElementsChange = React.useCallback((newElements) => {
    setCanvasElements(newElements);
    setHasChanges(true);
  }, []);

  // Text offsets update handler
  const handleUpdateTextOffset = (id, offset) => {
    setTextOffsets((prev) => ({
      ...prev,
      [id]: offset
    }));
    setHasChanges(true);
  };

  // Canva Studio block styles update handlers
  const handleUpdateBlockStyle = (blockId, stylePatch) => {
    setBlockStyles((prev) => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        ...stylePatch
      }
    }));
    setHasChanges(true);
  };

  const handleResetBlockStyle = (blockId) => {
    setBlockStyles((prev) => {
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
    setHasChanges(true);
  };

  // In-place text overrides handler
  const handleUpdateTextOverride = (id, value) => {
    setTextOverrides((prev) => {
      const next = {
        ...prev,
        [id]: value
      };
      if (activeProduct) {
        try {
          localStorage.setItem(`aura_text_overrides_${activeProduct.id}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    setHasChanges(true);
  };

  const handleSelectBlock = (blockInfo) => {
    if (blockInfo && blockInfo.id && textOverrides[blockInfo.id] !== undefined) {
      blockInfo = {
        ...blockInfo,
        value: textOverrides[blockInfo.id]
      };
    }
    setActiveBlock(blockInfo);
    if (blockInfo) {
      setIsCanvaDrawerOpen(true);
    }
  };

  // Canva Studio page dimensions handler
  const handleUpdatePageDimensions = (dims) => {
    setPageDimensions((prev) => {
      const next = typeof dims === 'function' ? dims(prev) : { ...prev, ...dims };
      if (activeProduct) {
        try {
          localStorage.setItem(`aura_page_dimensions_${activeProduct.id}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    setHasChanges(true);
  };

  // Universal element delete / hide handler
  const handleDeleteElement = (id) => {
    if (!id) return;
    // If it's a dynamic canvas element
    if (canvasElements.some(el => el.id === id)) {
      setCanvasElements(prev => prev.filter(el => el.id !== id));
      if (activeBlock?.id === id) setActiveBlock(null);
      setHasChanges(true);
      return;
    }
    // Otherwise it's a native page element
    setHiddenElements((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (activeProduct) {
        try {
          localStorage.setItem(`aura_hidden_elements_${activeProduct.id}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    if (activeBlock?.id === id) {
      setActiveBlock(null);
    }
    setHasChanges(true);
  };

  // Universal element restore handler
  const handleRestoreElement = (id) => {
    setHiddenElements((prev) => {
      const next = prev.filter(elId => elId !== id);
      if (activeProduct) {
        try {
          localStorage.setItem(`aura_hidden_elements_${activeProduct.id}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    setHasChanges(true);
  };

  const handleRestoreAllElements = () => {
    setHiddenElements([]);
    if (activeProduct) {
      try {
        localStorage.removeItem(`aura_hidden_elements_${activeProduct.id}`);
      } catch (e) {}
    }
    setHasChanges(true);
  };

  // Universal element duplicate handler
  const handleDuplicateElement = (id) => {
    if (!id) return;
    const targetElement = canvasElements.find(el => el.id === id);
    if (targetElement) {
      const newElement = {
        ...targetElement,
        id: `el-${Date.now()}`,
        x: (targetElement.x || 100) + 24,
        y: (targetElement.y || 100) + 24,
        style: { ...(targetElement.style || {}) }
      };
      setCanvasElements(prev => [...prev, newElement]);
      setActiveBlock({
        id: newElement.id,
        type: newElement.type || 'Phần Tử Mới',
        label: newElement.label || newElement.content || 'Phần Tử Nhân Bản',
        style: newElement.style || {},
        value: newElement.content || ''
      });
      setHasChanges(true);
    }
  };

  // Global Delete / Backspace keyboard listener when activeBlock is selected
  useEffect(() => {
    if (!isEditMode || !activeBlock?.id) return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || activeEl.isContentEditable) {
          return;
        }
      }
      e.preventDefault();
      handleDeleteElement(activeBlock.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, activeBlock, canvasElements, activeProduct]);

  // Hardware specifications map update handler
  const handleUpdateSpecsMap = (newSpecsMap) => {
    setActiveProduct((prev) => {
      const existing = prev.specifications || {};
      const internalPreserved = {};
      ['floating_images', 'section_order', 'canvas_elements', 'text_offsets', 'block_styles', 'subnav_items', 'text_overrides', 'page_dimensions', 'hidden_elements'].forEach((k) => {
        if (existing[k] !== undefined) internalPreserved[k] = existing[k];
      });
      return {
        ...prev,
        specifications: {
          ...newSpecsMap,
          ...internalPreserved
        }
      };
    });
    setHasChanges(true);
  };

  // Section Drag & Drop & Delete Handlers
  const handleSectionDragStart = (e, index) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleSectionDrop = (e, targetIndex) => {
    e.preventDefault();
    setDropTargetIndex(null);
    const fromIndex = draggedSectionIndex;
    setDraggedSectionIndex(null);

    if (fromIndex === null || fromIndex === targetIndex) return;

    const list = [...sectionOrder];
    const item = list.splice(fromIndex, 1)[0];
    list.splice(targetIndex, 0, item);
    setSectionOrder(list);
    setHasChanges(true);
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setDropTargetIndex(null);
  };

  const handleDeleteSection = (secKey) => {
    setSectionOrder((prev) => prev.filter((k) => k !== secKey));
    setHasChanges(true);
  };

  const handleRestoreSection = (secKey) => {
    if (!sectionOrder.includes(secKey)) {
      setSectionOrder((prev) => [...prev, secKey]);
      setHasChanges(true);
    }
  };

  // Section Ordering Handler
  const handleMoveSection = (fromIdx, toIdx) => {
    const list = [...sectionOrder];
    const item = list.splice(fromIdx, 1)[0];
    list.splice(toIdx, 0, item);
    setSectionOrder(list);
    setHasChanges(true);
  };

  // Save changes live to backend SQLite database
  const handleSaveLive = async () => {
    if (!activeProduct) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('aura_admin_token');
      if (!token) {
        setShowAuthModal(true);
        setIsSaving(false);
        return;
      }

      // 1. Fetch latest product full details
      let fullData = null;
      try {
        const res = await adminApi.getProduct(activeProduct.id);
        fullData = res.data;
      } catch (fetchErr) {
        if (fetchErr.response?.status === 401) {
          localStorage.removeItem('aura_admin_token');
          setShowAuthModal(true);
          setIsSaving(false);
          alert('Phiên làm việc quản trị đã hết hạn. Vui lòng đăng nhập lại mật khẩu quản trị.');
          return;
        }
        throw fetchErr;
      }

      const existingTranslations = fullData.translations || {};
      const currentLangTrans = existingTranslations[language] || {};

      const updatedTranslations = {
        ...existingTranslations,
        [language]: {
          ...currentLangTrans,
          name: activeProduct.name,
          tagline: activeProduct.tagline || '',
          description: activeProduct.description || '',
          features: Array.isArray(activeProduct.features)
            ? activeProduct.features
            : (activeProduct.features || '').split('\n').filter(Boolean)
        }
      };

      // Base specs preserving existing technical specifications
      const baseSpecs = fullData.specifications || currentLangTrans.specifications || activeProduct.specifications || {};
      const updatedSpecs = {
        ...baseSpecs,
        floating_images: floatingImages,
        section_order: sectionOrder,
        canvas_elements: canvasElements,
        text_offsets: textOffsets,
        block_styles: blockStyles,
        subnav_items: subnavItems,
        text_overrides: textOverrides,
        page_dimensions: pageDimensions,
        hidden_elements: hiddenElements
      };

      // Construct clean payload strictly conforming to ProductCreateRequest schema
      const payload = {
        slug: fullData.slug || activeProduct.slug,
        images: activeProduct.images || fullData.images || [],
        is_featured: fullData.is_featured ?? true,
        is_active: true,
        translations: ['en', 'vi', 'ar'].map((langKey) => {
          const tData = updatedTranslations[langKey] || {};
          let feats = tData.features;
          if (typeof feats === 'string') {
            feats = feats.split('\n').filter(Boolean);
          } else if (!Array.isArray(feats)) {
            feats = [];
          }
          return {
            language: langKey,
            name: tData.name || activeProduct.name || fullData.slug,
            tagline: tData.tagline || '',
            description: tData.description || '',
            features: feats,
            specifications: updatedSpecs
          };
        }),
        variants: (fullData.variants && fullData.variants.length > 0)
          ? fullData.variants.map((v) => ({
              sku: v.sku,
              attributes: v.attributes || {},
              attribute_translations: v.attribute_translations || {},
              stock_quantity: Number(v.stock_quantity ?? 10),
              variant_image: v.variant_image,
              is_active: v.is_active ?? true,
              prices: (v.prices && v.prices.length > 0)
                ? v.prices.map((p) => ({
                    currency: p.currency,
                    price: Number(p.price),
                    compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null
                  }))
                : [
                    { currency: 'USD', price: 1299.0 },
                    { currency: 'VND', price: 32500000.0 },
                    { currency: 'SAR', price: 4870.0 }
                  ]
            }))
          : [
              {
                sku: fullData.variant?.sku || `${fullData.slug}-DEFAULT`,
                attributes: {
                  color: fullData.variant?.color || 'Space Gray',
                  storage: fullData.variant?.storage || '512GB'
                },
                stock_quantity: Number(fullData.variant?.stock || 10),
                prices: [
                  { currency: 'USD', price: Number(fullData.variant?.price_usd || 1299) },
                  { currency: 'VND', price: Number(fullData.variant?.price_vnd || 32500000) },
                  { currency: 'SAR', price: Number(fullData.variant?.price_sar || 4870) }
                ]
              }
            ]
      };

      await adminApi.updateProduct(activeProduct.id, payload);
      setHasChanges(false);

      // Re-sync current product and list to stay 100% in sync without creating duplicates
      try {
        const [detailRes, listRes] = await Promise.all([
          productApi.getProductDetail(activeProduct.id, language, currency),
          productApi.getProducts(language, currency)
        ]);
        if (detailRes?.data) setActiveProduct(detailRes.data);
        if (listRes?.data) setProducts(listRes.data);
      } catch (syncErr) {
        console.warn('Re-sync after save:', syncErr);
      }

      alert('✅ Đã cập nhật và lưu thay đổi thành công vào sản phẩm hiện tại!');
    } catch (err) {
      console.error('Error saving live edits:', err);
      const detailMsg = err.response?.data?.detail;
      const msg = typeof detailMsg === 'string'
        ? detailMsg
        : (Array.isArray(detailMsg) ? detailMsg.map(d => `${d.loc?.join('.')}: ${d.msg}`).join(', ') : 'Không thể lưu thay đổi trực tiếp. Vui lòng kiểm tra lại kết nối backend.');
      alert(`⚠️ Không thể lưu: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (activeProductId) {
      setLoading(true);
      productApi.getProductDetail(activeProductId, language, currency)
        .then((res) => {
          setActiveProduct(res.data);
          if (res.data.specifications?.floating_images) {
            setFloatingImages(res.data.specifications.floating_images);
          }
          if (res.data.specifications?.section_order) {
            setSectionOrder(res.data.specifications.section_order);
          }
          if (res.data.specifications?.canvas_elements) {
            setCanvasElements(res.data.specifications.canvas_elements);
          } else {
            setCanvasElements([]);
          }
          if (res.data.specifications?.text_offsets) {
            setTextOffsets(res.data.specifications.text_offsets);
          } else {
            setTextOffsets({});
          }
          if (res.data.specifications?.block_styles) {
            setBlockStyles(res.data.specifications.block_styles);
          } else {
            setBlockStyles({});
          }
          if (res.data.specifications?.text_overrides) {
            setTextOverrides(res.data.specifications.text_overrides);
          } else {
            setTextOverrides({});
          }
          if (res.data.specifications?.subnav_items) {
            setSubnavItems(res.data.specifications.subnav_items);
          } else {
            setSubnavItems(DEFAULT_SUBNAV_ITEMS);
          }
          if (res.data.specifications?.page_dimensions) {
            setPageDimensions({ ...DEFAULT_PAGE_DIMENSIONS, ...res.data.specifications.page_dimensions });
          } else {
            setPageDimensions(DEFAULT_PAGE_DIMENSIONS);
          }
          if (res.data.specifications?.hidden_elements && Array.isArray(res.data.specifications.hidden_elements)) {
            setHiddenElements(res.data.specifications.hidden_elements);
          } else {
            setHiddenElements([]);
          }
          setHasChanges(false);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleOpenQuickBuy = (productToBuy = null, variantToBuy = null) => {
    const prod = productToBuy || activeProduct;
    const v = variantToBuy || selectedVariant || (prod?.variants?.[0]);
    setCheckoutProduct(prod);
    setCheckoutVariant(v);
    setQuickBuyOpen(true);
  };

  const handleLaunchVietQR = (qrPaymentData) => {
    setQuickBuyOpen(false);
    setVietQRData(qrPaymentData);
  };

  const getPageCanvasStyle = () => {
    const isCustom = pageDimensions.widthMode === 'custom';
    let targetWidth = '100%';
    if (isCustom && pageDimensions.customWidth) {
      targetWidth = `${pageDimensions.customWidth}px`;
    } else if (pageDimensions.widthMode && pageDimensions.widthMode !== '100%') {
      targetWidth = pageDimensions.widthMode;
    }

    const isCentered = pageDimensions.align === 'center';
    const isRight = pageDimensions.align === 'right';

    return {
      maxWidth: targetWidth === '100%' ? '100%' : targetWidth,
      width: '100%',
      marginLeft: isRight ? 'auto' : (isCentered ? 'auto' : '0'),
      marginRight: isCentered ? 'auto' : (isRight ? '0' : 'auto'),
      minHeight: pageDimensions.minHeight && pageDimensions.minHeight !== 'auto' ? `${pageDimensions.minHeight}px` : undefined,
      paddingLeft: pageDimensions.paddingX ? `${pageDimensions.paddingX}px` : undefined,
      paddingRight: pageDimensions.paddingX ? `${pageDimensions.paddingX}px` : undefined,
      paddingTop: pageDimensions.paddingY ? `${pageDimensions.paddingY}px` : undefined,
      paddingBottom: pageDimensions.paddingY ? `${pageDimensions.paddingY}px` : undefined,
      backgroundColor: pageDimensions.backgroundColor || undefined,
      transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1), min-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.2s ease, background-color 0.2s ease',
      boxShadow: targetWidth !== '100%' ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)' : undefined
    };
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      
      {/* Apple Double Navigation (Global 44px + Subnav 52px) */}
      <Navbar
        productName={activeProduct?.name || "Aura Vision Pro"}
        productPrice={activeProduct ? formatPrice(activeProduct.price) : ""}
        onOpenQuickBuy={() => handleOpenQuickBuy()}
        onNavigateAdmin={onNavigateAdmin}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        isCurrentAdmin={false}
        onToggleLiveEdit={handleToggleLiveEdit}
        isLiveEditActive={isEditMode}
        subnavItems={subnavItems}
        onUpdateSubnavItems={handleUpdateSubnavItems}
      />

      {loading && !activeProduct ? (
        <div className="h-[75vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#0071e3]" />
          <span className="text-xs text-[#86868b] tracking-wider">
            Loading {t('nav.brand')} Storefront...
          </span>
        </div>
      ) : (
        <main id="page-canvas-wrapper" className="relative" style={getPageCanvasStyle()}>
          {/* Canva Studio Visual Overlay with Unified Assets & Block Inspector Drawer */}
          <CanvaOverlay
            elements={canvasElements}
            onChangeElements={handleCanvasElementsChange}
            isEditMode={isEditMode}
            isDrawerOpen={isCanvaDrawerOpen}
            onCloseDrawer={() => setIsCanvaDrawerOpen(false)}
            onOpenDrawer={() => setIsCanvaDrawerOpen(true)}
            onHistoryStateChange={handleHistoryStateChange}
            activeBlock={activeBlock}
            blockStyles={blockStyles}
            onUpdateBlockStyle={handleUpdateBlockStyle}
            onResetBlockStyle={handleResetBlockStyle}
            onClearActiveBlock={() => setActiveBlock(null)}
            sectionOrder={sectionOrder}
            onMoveSection={handleMoveSection}
            onSelectBlock={handleSelectBlock}
            pageDimensions={pageDimensions}
            onUpdatePageDimensions={handleUpdatePageDimensions}
            hiddenElements={hiddenElements}
            onRestoreElement={handleRestoreElement}
            onRestoreAllElements={handleRestoreAllElements}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
          />

          {/* Dynamic Section Ordering with Direct Visual Controls */}
          {sectionOrder.map((sectionKey, secIndex) => {
            const sectionLabels = {
              hero: '1. Khối Giới Thiệu Hero Showcase',
              configurator: '2. Trình Chọn Cấu Hình & Mua Hàng',
              bento: '3. Thẻ Đột Phá Bento Highlights',
              specs: '4. Bảng Thông Số Kỹ Thuật Tech Specs'
            };

            const getSectionCustomStyle = (key) => {
              const s = blockStyles[`section-${key}`] || {};
              return {
                ...(s.backgroundColor ? { backgroundColor: s.backgroundColor } : {}),
                ...(s.background ? { background: s.background } : {}),
                ...(s.backgroundImage ? { backgroundImage: s.backgroundImage, backgroundSize: s.backgroundSize || 'cover', backgroundPosition: s.backgroundPosition || 'center' } : {}),
                ...(s.padding ? { padding: s.padding } : {}),
                ...(s.borderRadius ? { borderRadius: s.borderRadius } : {}),
                ...(s.border ? { border: s.border } : {}),
                ...(s.boxShadow ? { boxShadow: s.boxShadow } : {}),
                ...(s.backdropFilter ? { backdropFilter: s.backdropFilter, WebkitBackdropFilter: s.backdropFilter } : {})
              };
            };

            const renderSectionControl = () => {
              if (!isEditMode) return null;
              const currentSectionTitle = textOverrides?.[`section-label-${sectionKey}`] || sectionLabels[sectionKey] || sectionKey;
              return (
                <div className="sticky top-24 z-30 max-w-5xl mx-auto px-4 pt-3 pb-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-2xl bg-[#161617]/95 backdrop-blur-xl border border-[#0071e3]/40 shadow-2xl ring-1 ring-[#0071e3]/20 text-xs text-white">
                    <div className="flex items-center gap-2 font-semibold text-[#2997ff] px-2 py-1 rounded-lg hover:bg-white/10 transition-colors">
                      <div 
                        draggable
                        onDragStart={(e) => handleSectionDragStart(e, secIndex)}
                        onDragEnd={handleSectionDragEnd}
                        className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none"
                        title="Giữ chuột và kéo để đổi vị trí khối này lên trên hoặc xuống dưới"
                      >
                        <GripVertical className="w-4 h-4 text-[#2997ff]" />
                        <span>Vị trí #{secIndex + 1}:</span>
                      </div>
                      <EditableText
                        id={`section-label-${sectionKey}`}
                        value={currentSectionTitle}
                        isEditing={isEditMode}
                        onChange={(val) => handleUpdateTextOverride(`section-label-${sectionKey}`, val)}
                        onSelectBlock={handleSelectBlock}
                        isSelected={activeBlock?.id === `section-label-${sectionKey}`}
                        blockStyle={blockStyles?.[`section-label-${sectionKey}`]}
                        allowDrag={false}
                        className="font-semibold text-[#2997ff]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Canva Studio Style Section Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectBlock({
                          id: `section-${sectionKey}`,
                          type: 'Khối Section',
                          label: currentSectionTitle,
                          value: currentSectionTitle,
                          onUpdateText: (val) => handleUpdateTextOverride(`section-label-${sectionKey}`, val),
                          sectionKey: sectionKey,
                          secIndex: secIndex,
                          style: blockStyles[`section-${sectionKey}`] || {}
                        })}
                        className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-medium text-xs shadow ${
                          activeBlock?.id === `section-${sectionKey}`
                            ? 'bg-[#0071e3] text-white ring-2 ring-white/30'
                            : 'bg-white/10 hover:bg-white/20 text-[#2997ff]'
                        }`}
                        title="Mở Canva Studio đổi màu nền, chèn ảnh nền, viền và bo góc cho khối này"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>🎨 Canva Sửa Khối</span>
                      </button>

                      {secIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveSection(secIndex, secIndex - 1)}
                          className="px-3 py-1 rounded-full bg-white/10 hover:bg-[#0071e3] text-white flex items-center gap-1.5 transition-all cursor-pointer font-medium shadow"
                          title="Dời lên trên"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Dời lên</span>
                        </button>
                      )}
                      {secIndex < sectionOrder.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveSection(secIndex, secIndex + 1)}
                          className="px-3 py-1 rounded-full bg-white/10 hover:bg-[#0071e3] text-white flex items-center gap-1.5 transition-all cursor-pointer font-medium shadow"
                          title="Dời xuống dưới"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Dời xuống</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(sectionKey)}
                        className="px-2.5 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer text-xs ml-1"
                        title="Ẩn / Xóa khối này khỏi trang (có thể khôi phục lại bất kỳ lúc nào)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Xóa khối</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            };

            const sectionWrapperProps = {
              onDragOver: (e) => handleSectionDragOver(e, secIndex),
              onDrop: (e) => handleSectionDrop(e, secIndex),
              style: getSectionCustomStyle(sectionKey),
              className: `relative group/sec transition-all ${
                dropTargetIndex === secIndex ? 'ring-4 ring-[#0071e3] shadow-[0_0_40px_rgba(0,113,227,0.4)] rounded-3xl' : ''
              } ${draggedSectionIndex === secIndex ? 'opacity-40' : ''} ${
                activeBlock?.id === `section-${sectionKey}` ? 'ring-2 ring-[#0071e3] ring-offset-4 ring-offset-black rounded-3xl' : ''
              }`
            };

            if (sectionKey === 'hero') {
              return (
                <div key="hero" {...sectionWrapperProps}>
                  {renderSectionControl()}
                  <HeroShowcase
                    product={activeProduct}
                    allProducts={products}
                    onSelectProduct={handleSelectProduct}
                    onQuickBuy={(p) => handleOpenQuickBuy(p)}
                    isEditMode={isEditMode}
                    onUpdateField={handleUpdateField}
                    onUpdateImage={handleUpdateHeroImage}
                    onUpdateImageFile={handleUpdateHeroImageFile}
                    onUpdateBadge={handleUpdateBadge}
                    textOffsets={textOffsets}
                    onUpdateTextOffset={handleUpdateTextOffset}
                    blockStyles={blockStyles}
                    activeBlockId={activeBlock?.id}
                    onSelectBlock={handleSelectBlock}
                    textOverrides={textOverrides}
                    onUpdateTextOverride={handleUpdateTextOverride}
                    hiddenElements={hiddenElements}
                    onDeleteElement={handleDeleteElement}
                  />
                </div>
              );
            }

            if (sectionKey === 'configurator' && activeProduct) {
              return (
                <div key="configurator" {...sectionWrapperProps}>
                  {renderSectionControl()}
                  <VariantPicker
                    product={activeProduct}
                    selectedVariant={selectedVariant}
                    onSelectVariant={setSelectedVariant}
                    onBuyNow={(p, v) => handleOpenQuickBuy(p, v)}
                    isEditMode={isEditMode}
                    textOffsets={textOffsets}
                    onUpdateTextOffset={handleUpdateTextOffset}
                    blockStyles={blockStyles}
                    activeBlockId={activeBlock?.id}
                    onSelectBlock={handleSelectBlock}
                    textOverrides={textOverrides}
                    onUpdateTextOverride={handleUpdateTextOverride}
                    hiddenElements={hiddenElements}
                    onDeleteElement={handleDeleteElement}
                  />
                </div>
              );
            }

            if (sectionKey === 'bento' && activeProduct) {
              return (
                <div key="bento" {...sectionWrapperProps}>
                  {renderSectionControl()}
                  <BentoFeatures 
                    product={activeProduct} 
                    isEditMode={isEditMode}
                    onUpdateFeature={handleUpdateFeature}
                    onUpdateField={handleUpdateField}
                    onReorderFeatures={handleReorderFeatures}
                    textOffsets={textOffsets}
                    onUpdateTextOffset={handleUpdateTextOffset}
                    blockStyles={blockStyles}
                    activeBlockId={activeBlock?.id}
                    onSelectBlock={handleSelectBlock}
                    textOverrides={textOverrides}
                    onUpdateTextOverride={handleUpdateTextOverride}
                    hiddenElements={hiddenElements}
                    onDeleteElement={handleDeleteElement}
                  />
                </div>
              );
            }

            if (sectionKey === 'specs' && activeProduct) {
              return (
                <div key="specs" {...sectionWrapperProps}>
                  {renderSectionControl()}
                  <TechSpecs 
                    product={activeProduct} 
                    isEditMode={isEditMode}
                    onUpdateSpecsMap={handleUpdateSpecsMap}
                    textOffsets={textOffsets}
                    onUpdateTextOffset={handleUpdateTextOffset}
                    blockStyles={blockStyles}
                    activeBlockId={activeBlock?.id}
                    onSelectBlock={handleSelectBlock}
                    textOverrides={textOverrides}
                    onUpdateTextOverride={handleUpdateTextOverride}
                    hiddenElements={hiddenElements}
                    onDeleteElement={handleDeleteElement}
                  />
                </div>
              );
            }

            return null;
          })}
        </main>
      )}

      {/* Custom Draggable Floating Images on Website */}
      {floatingImages.map((imgItem) => (
        <DraggableFloatingImage
          key={imgItem.id}
          item={imgItem}
          isEditMode={isEditMode}
          onUpdatePosition={handleUpdateFloatingImagePosition}
          onUpdateWidth={handleUpdateFloatingImageWidth}
          onDelete={handleDeleteFloatingImage}
        />
      ))}

      {/* Floating Apple Live Drag & Drop Editor Dock */}
      <LiveEditorBar
        isEditMode={isEditMode}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSaveLive}
        onReset={handleReset}
        onExit={() => setIsEditMode(false)}
        onAddFloatingImage={handleAddFloatingImage}
        onAddFloatingImageFile={handleAddFloatingImageFile}
        sectionOrder={sectionOrder}
        onMoveSection={handleMoveSection}
        onDeleteSection={handleDeleteSection}
        onRestoreSection={handleRestoreSection}
        onOpenCanvaDrawer={() => setIsCanvaDrawerOpen(true)}
        onUndo={() => canvaHistoryRef.current.undo?.()}
        onRedo={() => canvaHistoryRef.current.redo?.()}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Apple Iconic Footer */}
      <footer 
        style={{
          ...(blockStyles?.['page-footer'] || {})
        }}
        onClick={(e) => {
          if (isEditMode && e.target === e.currentTarget) {
            handleSelectBlock({
              id: 'page-footer',
              type: 'Chân Trang',
              label: 'Chân Trang (Footer)',
              style: blockStyles?.['page-footer'] || {}
            });
          }
        }}
        className={`border-t border-[#1d1d1f] bg-[#0b0b0c] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#6e6e73] transition-all ${
          activeBlock?.id === 'page-footer' ? 'ring-2 ring-[#0071e3]' : ''
        }`}
      >
        <div className="max-w-5xl mx-auto space-y-4">
          <EditableText
            id="footer-disclaimer"
            value={textOverrides?.['footer-disclaimer'] ?? "1. Trade‑in values will vary based on the condition, year, and configuration of your eligible trade‑in device. Not all devices are eligible for credit. Prices quoted are inclusive of local taxes where applicable."}
            isEditing={isEditMode}
            onChange={(val) => handleUpdateTextOverride('footer-disclaimer', val)}
            onSelectBlock={handleSelectBlock}
            isSelected={activeBlock?.id === 'footer-disclaimer'}
            blockStyle={blockStyles?.['footer-disclaimer']}
            allowDrag={false}
            as="p"
            multiline={true}
            className="border-b border-[#1d1d1f] pb-4 leading-relaxed font-light text-[#6e6e73]"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              <EditableText
                id="footer-copyright"
                value={textOverrides?.['footer-copyright'] ?? "Copyright © 2026 AURA Inc. All rights reserved."}
                isEditing={isEditMode}
                onChange={(val) => handleUpdateTextOverride('footer-copyright', val)}
                onSelectBlock={handleSelectBlock}
                isSelected={activeBlock?.id === 'footer-copyright'}
                blockStyle={blockStyles?.['footer-copyright']}
                allowDrag={false}
                className="text-[#6e6e73]"
              />
            </div>

            <div className="flex items-center gap-4 text-[#86868b] flex-wrap">
              <EditableText
                id="footer-link-privacy"
                value={textOverrides?.['footer-link-privacy'] ?? "Privacy Policy"}
                isEditing={isEditMode}
                onChange={(val) => handleUpdateTextOverride('footer-link-privacy', val)}
                onSelectBlock={handleSelectBlock}
                isSelected={activeBlock?.id === 'footer-link-privacy'}
                blockStyle={blockStyles?.['footer-link-privacy']}
                allowDrag={false}
                className="hover:underline cursor-pointer"
              />
              <span>|</span>
              <EditableText
                id="footer-link-terms"
                value={textOverrides?.['footer-link-terms'] ?? "Terms of Use"}
                isEditing={isEditMode}
                onChange={(val) => handleUpdateTextOverride('footer-link-terms', val)}
                onSelectBlock={handleSelectBlock}
                isSelected={activeBlock?.id === 'footer-link-terms'}
                blockStyle={blockStyles?.['footer-link-terms']}
                allowDrag={false}
                className="hover:underline cursor-pointer"
              />
              <span>|</span>
              <EditableText
                id="footer-link-sales"
                value={textOverrides?.['footer-link-sales'] ?? "Sales Policy"}
                isEditing={isEditMode}
                onChange={(val) => handleUpdateTextOverride('footer-link-sales', val)}
                onSelectBlock={handleSelectBlock}
                isSelected={activeBlock?.id === 'footer-link-sales'}
                blockStyle={blockStyles?.['footer-link-sales']}
                allowDrag={false}
                className="hover:underline cursor-pointer"
              />
              <span>|</span>
              <EditableText
                id="footer-link-legal"
                value={textOverrides?.['footer-link-legal'] ?? "Legal"}
                isEditing={isEditMode}
                onChange={(val) => handleUpdateTextOverride('footer-link-legal', val)}
                onSelectBlock={handleSelectBlock}
                isSelected={activeBlock?.id === 'footer-link-legal'}
                blockStyle={blockStyles?.['footer-link-legal']}
                allowDrag={false}
                className="hover:underline cursor-pointer"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Admin Auth Dialog for Live Edit */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-[28px] bg-[#161617] p-7 border border-[#2d2d30] shadow-2xl text-start apple-animate-in space-y-5">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/30 flex items-center justify-center text-[#2997ff]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Xác Thực Quản Trị</h3>
                <p className="text-[11px] text-[#86868b]">Mở quyền sửa văn bản & kéo thả trực tiếp</p>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleQuickAuth} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#a1a1a6] mb-1">Tài khoản</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#a1a1a6] mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#333336] text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <button
                type="submit"
                className="apple-btn-blue w-full py-2.5 text-xs font-semibold cursor-pointer shadow-lg mt-2"
              >
                Kích Hoạt Chế Độ Sửa Ngay
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {quickBuyOpen && checkoutProduct && checkoutVariant && (
        <QuickBuyModal
          product={checkoutProduct}
          variant={checkoutVariant}
          onClose={() => setQuickBuyOpen(false)}
          onLaunchVietQR={handleLaunchVietQR}
          onOrderSuccess={(orderId) => {
            setQuickBuyOpen(false);
            onOrderSuccess(orderId);
          }}
        />
      )}

      {/* VietQR Live Modal */}
      {vietQRData && (
        <VietQRModal
          paymentData={vietQRData}
          onClose={() => setVietQRData(null)}
          onPaymentSuccess={(orderId) => {
            setVietQRData(null);
            onOrderSuccess(orderId);
          }}
        />
      )}

    </div>
  );
}

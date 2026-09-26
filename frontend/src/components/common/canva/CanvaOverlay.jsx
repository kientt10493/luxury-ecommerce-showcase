import React, { useState, useEffect, useRef, useCallback } from 'react';
import CanvaBoundingBox from './CanvaBoundingBox';
import CanvaDrawer from './CanvaDrawer';

export default function CanvaOverlay({
  elements = [],
  onChangeElements,
  isEditMode = false,
  isDrawerOpen = false,
  onCloseDrawer,
  onOpenDrawer,
  onHistoryStateChange
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Store current elements in ref for keyboard events and snapshot comparison
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  const historyRef = useRef(history);
  historyRef.current = history;

  const redoRef = useRef(redoStack);
  redoRef.current = redoStack;

  const onChangeElementsRef = useRef(onChangeElements);
  onChangeElementsRef.current = onChangeElements;

  const onHistoryStateChangeRef = useRef(onHistoryStateChange);
  onHistoryStateChangeRef.current = onHistoryStateChange;

  // 1. Snapshot Management for Undo / Redo
  const saveSnapshot = useCallback(() => {
    setHistory((prev) => {
      const next = [...prev, JSON.parse(JSON.stringify(elementsRef.current))];
      if (next.length > 30) next.shift(); // Keep max 30 snapshots
      return next;
    });
    setRedoStack([]); // Clear redo on new action
  }, []);

  const handleUndo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const previous = historyRef.current[historyRef.current.length - 1];
    const newHistory = historyRef.current.slice(0, -1);

    setRedoStack((prev) => [JSON.parse(JSON.stringify(elementsRef.current)), ...prev]);
    setHistory(newHistory);
    onChangeElementsRef.current?.(previous);
  }, []);

  const handleRedo = useCallback(() => {
    if (redoRef.current.length === 0) return;
    const next = redoRef.current[0];
    const newRedo = redoRef.current.slice(1);

    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(elementsRef.current))]);
    setRedoStack(newRedo);
    onChangeElementsRef.current?.(next);
  }, []);

  // Expose undo/redo state to parent (guarded against re-renders)
  const prevHistoryLenRef = useRef(-1);
  const prevRedoLenRef = useRef(-1);

  useEffect(() => {
    const curHistLen = history.length;
    const curRedoLen = redoStack.length;

    if (curHistLen !== prevHistoryLenRef.current || curRedoLen !== prevRedoLenRef.current) {
      prevHistoryLenRef.current = curHistLen;
      prevRedoLenRef.current = curRedoLen;

      onHistoryStateChangeRef.current?.({
        canUndo: curHistLen > 0,
        canRedo: curRedoLen > 0,
        undo: handleUndo,
        redo: handleRedo
      });
    }
  }, [history.length, redoStack.length, handleUndo, handleRedo]);

  // 2. Global Keyboard Shortcuts: Ctrl+Z, Ctrl+Y, Delete, Ctrl+D, Arrow keys, Escape
  useEffect(() => {
    if (!isEditMode) return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in standard inputs or textareas
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';
      const isContentEditable = document.activeElement?.isContentEditable;

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!isInput && !isContentEditable) {
          e.preventDefault();
          handleUndo();
          return;
        }
      }

      // Redo: Ctrl+Y or Cmd+Shift+Z or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        if (!isInput && !isContentEditable) {
          e.preventDefault();
          handleRedo();
          return;
        }
      }

      // Deselect on Escape
      if (e.key === 'Escape') {
        setSelectedId(null);
        return;
      }

      // If an element is selected and not editing text:
      if (selectedId && !isInput && !isContentEditable) {
        // Delete or Backspace
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          saveSnapshot();
          const filtered = elementsRef.current.filter((el) => el.id !== selectedId);
          setSelectedId(null);
          onChangeElements?.(filtered);
          return;
        }

        // Duplicate: Ctrl+D
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
          e.preventDefault();
          saveSnapshot();
          const target = elementsRef.current.find((el) => el.id === selectedId);
          if (target) {
            const duplicated = {
              ...JSON.parse(JSON.stringify(target)),
              id: `canva-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              x: target.x + 25,
              y: target.y + 25,
              zIndex: (target.zIndex || 35) + 1
            };
            const updated = [...elementsRef.current, duplicated];
            setSelectedId(duplicated.id);
            onChangeElements?.(updated);
          }
          return;
        }

        // Nudge with Arrow keys: 1px or 10px (with Shift)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 2;
          const target = elementsRef.current.find((el) => el.id === selectedId);
          if (target) {
            saveSnapshot();
            let newX = target.x;
            let newY = target.y;
            if (e.key === 'ArrowUp') newY -= step;
            if (e.key === 'ArrowDown') newY += step;
            if (e.key === 'ArrowLeft') newX -= step;
            if (e.key === 'ArrowRight') newX += step;

            const updated = elementsRef.current.map((el) =>
              el.id === selectedId ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) } : el
            );
            onChangeElements?.(updated);
          }
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, selectedId, handleUndo, handleRedo, saveSnapshot, onChangeElements]);

  // Click outside to deselect
  useEffect(() => {
    if (!isEditMode || !selectedId) return;

    const handlePointerDownOutside = (e) => {
      if (
        e.target.closest('[data-canva-element]') ||
        e.target.closest('[data-canva-drawer]') ||
        e.target.closest('[data-canva-toolbar]') ||
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.target.closest('textarea')
      ) {
        return;
      }
      setSelectedId(null);
    };

    window.addEventListener('pointerdown', handlePointerDownOutside);
    return () => window.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [isEditMode, selectedId]);

  // 3. Canvas Element Modifiers (All defensively handling ID & snapshot control)
  const handleUpdateTransform = (id, transform, recordSnapshot = true) => {
    if (recordSnapshot) {
      saveSnapshot();
    }
    const targetId = typeof id === 'string' ? id : selectedId;
    if (!targetId) return;
    const updated = elements.map((el) => (el.id === targetId ? { ...el, ...transform } : el));
    onChangeElements?.(updated);
  };

  const handleUpdateContent = (id, newContent) => {
    saveSnapshot();
    const targetId = typeof id === 'string' ? id : selectedId;
    if (!targetId) return;
    const updated = elements.map((el) => (el.id === targetId ? { ...el, content: newContent } : el));
    onChangeElements?.(updated);
  };

  const handleUpdateStyle = (id, styleDiff) => {
    saveSnapshot();
    const targetId = typeof id === 'string' ? id : selectedId;
    if (!targetId) return;
    const updated = elements.map((el) => {
      if (el.id === targetId) {
        return {
          ...el,
          style: {
            ...(el.style || {}),
            ...styleDiff
          }
        };
      }
      return el;
    });
    onChangeElements?.(updated);
  };

  const handleBringForward = (id) => {
    saveSnapshot();
    const targetId = typeof id === 'string' ? id : selectedId;
    if (!targetId) return;
    const target = elements.find((el) => el.id === targetId);
    if (!target) return;
    const currentZ = target.zIndex || 35;
    const updated = elements.map((el) => (el.id === targetId ? { ...el, zIndex: currentZ + 5 } : el));
    onChangeElements?.(updated);
  };

  const handleSendBackward = (id) => {
    saveSnapshot();
    const targetId = typeof id === 'string' ? id : selectedId;
    if (!targetId) return;
    const target = elements.find((el) => el.id === targetId);
    if (!target) return;
    const currentZ = target.zIndex || 35;
    const updated = elements.map((el) => (el.id === targetId ? { ...el, zIndex: Math.max(10, currentZ - 5) } : el));
    onChangeElements?.(updated);
  };

  const handleDuplicate = (id) => {
    saveSnapshot();
    const targetId = typeof id === 'string' ? id : selectedId;
    if (!targetId) return;
    const target = elements.find((el) => el.id === targetId);
    if (!target) return;
    const duplicated = {
      ...JSON.parse(JSON.stringify(target)),
      id: `canva-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      x: target.x + 25,
      y: target.y + 25,
      zIndex: (target.zIndex || 35) + 1
    };
    const updated = [...elements, duplicated];
    setSelectedId(duplicated.id);
    onChangeElements?.(updated);
  };

  const handleDelete = (id) => {
    saveSnapshot();
    const targetId = typeof id === 'string' ? id : selectedId;
    if (!targetId) return;
    const filtered = elements.filter((el) => el.id !== targetId);
    if (selectedId === targetId) setSelectedId(null);
    onChangeElements?.(filtered);
  };

  // Helper to place new elements directly in current user viewport
  const getInitialPosition = (width = 320) => {
    const scrollY = window.scrollY || 0;
    const mainRect = document.querySelector('main')?.getBoundingClientRect();
    const mainTop = mainRect ? mainRect.top + scrollY : 0;
    const relativeY = scrollY + window.innerHeight / 2 - mainTop - 60;
    const relativeX = window.innerWidth / 2 - width / 2;

    return {
      x: Math.max(20, Math.min(window.innerWidth - width - 40, Math.round(relativeX))),
      y: Math.max(50, Math.round(relativeY))
    };
  };

  // 4. Asset Drawer Add Handlers
  const handleAddText = (variant) => {
    saveSnapshot();
    let width = 320;
    let initialContent = 'Nhấp đúp hoặc bấm Sửa chữ để đổi nội dung...';
    let initialStyle = {
      fontSize: 16,
      fontWeight: 'normal',
      color: '#ffffff',
      textAlign: 'left'
    };

    if (variant === 'h1') {
      width = 460;
      initialContent = 'Tiêu Đề Đột Phá Mới';
      initialStyle = {
        fontSize: 36,
        fontWeight: '700',
        color: '#f5f5f7',
        textAlign: 'left',
        letterSpacing: '-0.02em'
      };
    } else if (variant === 'h2') {
      width = 380;
      initialContent = 'Trải nghiệm đỉnh cao công nghệ 2026';
      initialStyle = {
        fontSize: 22,
        fontWeight: '600',
        color: '#a1a1a6',
        textAlign: 'left'
      };
    } else if (variant === 'quote') {
      width = 380;
      initialContent = '“Sự tinh tế đạt tới mức độ tối giản hoàn mỹ.”';
      initialStyle = {
        fontSize: 18,
        fontWeight: '500',
        color: '#fde047',
        textAlign: 'center',
        fontStyle: 'italic'
      };
    }

    const { x, y } = getInitialPosition(width);

    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x,
      y,
      width,
      rotation: 0,
      zIndex: 40,
      content: initialContent,
      style: initialStyle
    };

    const updated = [...elements, newElement];
    setSelectedId(newElement.id);
    onChangeElements?.(updated);
  };

  const handleAddBadge = (preset) => {
    saveSnapshot();
    const width = 260;
    const { x, y } = getInitialPosition(width);

    const newElement = {
      id: `badge-${Date.now()}`,
      type: 'badge',
      x,
      y,
      width,
      rotation: 0,
      zIndex: 40,
      content: preset.content,
      style: {
        ...preset.style,
        textAlign: 'center'
      }
    };

    const updated = [...elements, newElement];
    setSelectedId(newElement.id);
    onChangeElements?.(updated);
  };

  const handleAddImage = (imgUrl) => {
    saveSnapshot();
    const width = 240;
    const { x, y } = getInitialPosition(width);

    const newElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      x,
      y,
      width,
      height: 180,
      rotation: 0,
      zIndex: 38,
      content: imgUrl,
      style: {
        borderRadius: '16px',
        opacity: 1,
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }
    };

    const updated = [...elements, newElement];
    setSelectedId(newElement.id);
    onChangeElements?.(updated);
  };

  // If NOT in Edit Mode, render static luxury elements for site visitors
  if (!isEditMode) {
    if (!elements || elements.length === 0) return null;
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {elements.map((el) => {
          const rotationStyle = el.rotation ? `rotate(${el.rotation}deg)` : undefined;
          return (
            <div
              key={el.id}
              className="absolute pointer-events-auto transition-transform duration-200"
              style={{
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: el.width ? `${el.width}px` : 'auto',
                height: el.height ? `${el.height}px` : 'auto',
                zIndex: el.zIndex || 30,
                transform: rotationStyle,
                transformOrigin: 'center center'
              }}
            >
              {el.type === 'text' && (
                <div
                  style={{
                    color: el.style?.color || '#ffffff',
                    fontSize: el.style?.fontSize ? `${el.style.fontSize}px` : '16px',
                    fontWeight: el.style?.fontWeight || 'normal',
                    textAlign: el.style?.textAlign || 'left',
                    fontStyle: el.style?.fontStyle,
                    letterSpacing: el.style?.letterSpacing,
                    lineHeight: 1.4
                  }}
                >
                  {el.content}
                </div>
              )}

              {el.type === 'badge' && (
                <span
                  style={{
                    display: 'inline-block',
                    color: el.style?.color,
                    backgroundColor: el.style?.backgroundColor,
                    borderColor: el.style?.borderColor,
                    borderWidth: el.style?.borderWidth,
                    borderStyle: el.style?.borderStyle,
                    borderRadius: el.style?.borderRadius || '9999px',
                    padding: el.style?.padding,
                    fontSize: el.style?.fontSize ? `${el.style.fontSize}px` : '11px',
                    fontWeight: el.style?.fontWeight || '600',
                    letterSpacing: el.style?.letterSpacing,
                    boxShadow: el.style?.boxShadow,
                    backdropFilter: el.style?.backdropFilter,
                    textAlign: el.style?.textAlign || 'center'
                  }}
                >
                  {el.content}
                </span>
              )}

              {el.type === 'image' && (
                <img
                  src={el.content}
                  alt="Decorative Graphic"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{
                    borderRadius: el.style?.borderRadius || '16px',
                    opacity: el.style?.opacity ?? 1,
                    boxShadow: el.style?.boxShadow
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // IN EDIT MODE: Render interactive bounding boxes & asset drawer
  return (
    <>
      {/* Visual Canvas Elements Layer */}
      <div 
        data-canva-overlay="true"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 40 }}
      >
        {elements.map((el) => (
          <CanvaBoundingBox
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            isEditMode={isEditMode}
            onSelect={(id) => setSelectedId(id)}
            onSaveSnapshot={saveSnapshot}
            onUpdateTransform={handleUpdateTransform}
            onUpdateContent={handleUpdateContent}
            onUpdateStyle={handleUpdateStyle}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Asset Library Drawer */}
      <CanvaDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        onAddText={handleAddText}
        onAddBadge={handleAddBadge}
        onAddImage={handleAddImage}
      />
    </>
  );
}

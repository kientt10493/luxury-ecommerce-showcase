import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export default function CanvaImageSlider({
  images = [],
  style = {},
  isEditMode = false,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize images to array
  const rawList = Array.isArray(images) ? images : [images].filter(Boolean);
  const slideList = rawList.length > 0 ? rawList : [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop'
  ];

  const total = slideList.length;
  const autoplay = style.autoplay ?? true;
  const interval = style.interval || 3500;
  const showArrows = style.showArrows ?? true;
  const showDots = style.showDots ?? true;
  const objectFit = style.objectFit || 'cover';
  const borderRadius = style.borderRadius ?? '20px';

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || total <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, total, isHovered]);

  // Keep currentIndex in bounds if images array shrunk
  useEffect(() => {
    if (currentIndex >= total) {
      setCurrentIndex(Math.max(0, total - 1));
    }
  }, [total, currentIndex]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleDotClick = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius,
        boxShadow: style.boxShadow || '0 20px 50px rgba(0,0,0,0.65)',
        opacity: style.opacity ?? 1
      }}
      className={`relative w-full h-full overflow-hidden select-none group/slider bg-[#0b0b0c] ${className}`}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full overflow-hidden">
        {slideList.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={url}
              alt={`Slide ${idx + 1}`}
              draggable={false}
              style={{ objectFit }}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Floating Index Counter Badge (Top Right) */}
      <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] tracking-wider pointer-events-none shadow-lg">
        {currentIndex + 1} / {total}
      </div>

      {/* Navigation Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-[#0071e3] text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer opacity-80 group-hover/slider:opacity-100"
            title="Slide trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-[#0071e3] text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer opacity-80 group-hover/slider:opacity-100"
            title="Slide tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleDotClick(idx, e)}
              onPointerDown={(e) => e.stopPropagation()}
              className={`transition-all rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 h-1.5 bg-[#2997ff] shadow-sm'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
              }`}
              title={`Chuyển tới ảnh ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

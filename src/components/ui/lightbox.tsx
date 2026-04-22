import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useTheme } from "@/src/contexts";
import Swal from "sweetalert2";

type LightboxItem = {
  url: string;
  name?: string;
};

type Props = {
  items: LightboxItem[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  onDelete?: (index: number) => void; // ✅ add this
};

const rubberBand = (value: number, limit: number) => {
  if (Math.abs(value) <= limit) return value;

  const excess = Math.abs(value) - limit;
  const direction = value > 0 ? 1 : -1;

  return direction * (limit + excess * 0.25);
};
const Lightbox = ({
  items,
  initialIndex = 0,
  open,
  onClose,
  onDelete,
}: Props) => {
  const { tokens, isDark } = useTheme();

  const [index, setIndex] = useState(initialIndex);

  // 🔍 Zoom & pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  const velocity = useRef({ x: 0, y: 0 });
  const lastMove = useRef({ x: 0, y: 0, t: 0 });
  const animation = useRef<number | null>(null);

  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const pinchRef = useRef<number | null>(null);
  const initialScale = useRef(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 250;

    if (now - lastTap.current < DOUBLE_CLICK_DELAY) {
      // toggle zoom
      setScale((prev) => (prev > 1 ? 1 : 2.5));
      setPosition({ x: 0, y: 0 });
    }

    lastTap.current = now;
  };
  // Reset when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [initialIndex, open]);

  // ⌨️ Keyboard
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  // 🔍 Scroll zoom (centered)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta = -e.deltaY * 0.0015;
    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 1), 4);
      return next;
    });
  };

  // ✋ Drag pan
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;

    const now = performance.now();

    const dx = e.clientX - lastMove.current.x;
    const dy = e.clientY - lastMove.current.y;
    const dt = now - lastMove.current.t;

    velocity.current = {
      x: dx / dt,
      y: dy / dt,
    };

    lastMove.current = {
      x: e.clientX,
      y: e.clientY,
      t: now,
    };

    setPosition((pos) => ({
      x: pos.x + dx,
      y: pos.y + dy,
    }));
  };

  const onMouseUp = () => {
    dragging.current = false;

    const decay = 0.95;

    const animate = () => {
      velocity.current.x *= decay;
      velocity.current.y *= decay;

      setPosition((pos) => ({
        x: pos.x + velocity.current.x * 16,
        y: pos.y + velocity.current.y * 16,
      }));

      if (
        Math.abs(velocity.current.x) > 0.01 ||
        Math.abs(velocity.current.y) > 0.01
      ) {
        animation.current = requestAnimationFrame(animate);
      } else {
        animation.current = null;
      }
    };

    animation.current = requestAnimationFrame(animate);
  };

  // 📱 Swipe
  const touchStart = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = Math.sqrt(dx * dx + dy * dy);
      initialScale.current = scale;
    } else {
      touchStart.current = e.touches[0].clientX;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const ratio = distance / pinchRef.current;

      setScale(Math.min(Math.max(initialScale.current * ratio, 1), 4));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(16px)",
      }}
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)`,
          color: tokens.text,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ color: tokens.textMuted }}>
          {index + 1} / {items.length}
        </span>

        <div className="flex items-center gap-2">
          {/* 🗑 Delete */}
          <button
            onClick={() => {
              //   if (confirm("Delete this image?")) {
              //     onDelete?.(index);
              //   }
              Swal.fire({
                title: "Delete this image?",
                text: "You won't be able to undo this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it",
                cancelButtonText: "Cancel",
              }).then((result) => {
                if (result.isConfirmed) {
                  onDelete?.(index);

                  Swal.fire(
                    "Deleted!",
                    "Your image has been removed.",
                    "success",
                  );
                }
              });
            }}
            className="p-2 rounded-lg backdrop-blur-md transition hover:scale-110 active:scale-95"
            style={{
              background: isDark
                ? "rgba(220,38,38,0.6)"
                : "rgba(255,255,255,0.7)",
              border: `1px solid ${tokens.border}`,
            }}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>

          {/* ❌ Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg backdrop-blur-md transition hover:scale-110 active:scale-95"
            style={{
              background: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
              border: `1px solid ${tokens.border}`,
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative z-10"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* 🎞️ Slide animation wrapper */}
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
            width: `${items.length * 100}%`,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-full flex-shrink-0"
            >
              <img
                src={item.url}
                onTouchMove={onTouchMove}
                onDoubleClick={handleDoubleClick}
                onMouseDown={onMouseDown}
                draggable={false}
                className="max-h-[80vh] max-w-[90vw] object-contain select-none"
                style={{
                  transform:
                    i === index
                      ? `translate(
        ${rubberBand(position.x, 300)}px,
        ${rubberBand(position.y, 300)}px
      ) scale(${scale})`
                      : "scale(1)",
                  transition:
                    dragging.current || scale !== 1
                      ? "none"
                      : "transform 0.3s ease",
                  cursor: scale > 1 ? "grab" : "default",
                }}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-5 p-3 rounded-full"
          style={{ background: tokens.surface }}
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute right-5 p-3 rounded-full"
          style={{ background: tokens.surface }}
        >
          <ChevronRight />
        </button>
      </div>

      {/* ⚡ Virtualized-ish thumbnails */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 px-6 py-4 overflow-x-auto"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-3">
          {items.map((item, i) => {
            const active = i === index;

            return (
              <img
                key={i}
                src={item.url}
                onClick={() => setIndex(i)}
                className="w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  border: active
                    ? `2px solid ${tokens.accent}`
                    : `1px solid ${tokens.border}`,
                  opacity: active ? 1 : 0.6,
                  transform: active ? "scale(1.05)" : "scale(1)",
                  backdropFilter: "blur(6px)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;

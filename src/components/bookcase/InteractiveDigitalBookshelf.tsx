import React, { useState, useEffect, useRef } from 'react';
import {
  Library,
  RotateCcw,
  Shuffle,
  Camera,
  History,
  Volume2,
  VolumeX,
  Palette,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { soundFX } from '../../utils/soundEffects';
import { Book } from '../../types';
import confetti from 'canvas-confetti';

interface ShelfItem {
  book: Book;
  isLeaning: boolean;
  isStacked: boolean;
}

interface InteractiveDigitalBookshelfProps {
  onOpenSnapshotLog: () => void;
  onOpenBookDetail: (book: Book) => void;
}

const SHELF_THEMES = [
  { id: 'walnut', name: 'Rich Walnut', woodClass: 'from-amber-950 via-amber-900 to-amber-950 text-amber-200 border-amber-950/80 shadow-amber-950/40' },
  { id: 'oak', name: 'Golden Oak', woodClass: 'from-amber-800 via-amber-700 to-amber-800 text-amber-100 border-amber-900/60 shadow-amber-900/30' },
  { id: 'espresso', name: 'Dark Espresso', woodClass: 'from-stone-900 via-stone-950 to-stone-900 text-stone-300 border-stone-950 shadow-black/50' },
  { id: 'birch', name: 'Nordic Birch', woodClass: 'from-amber-200 via-amber-100 to-amber-200 text-stone-800 border-amber-300 shadow-stone-300/40' },
];

export const InteractiveDigitalBookshelf: React.FC<InteractiveDigitalBookshelfProps> = ({
  onOpenSnapshotLog,
  onOpenBookDetail,
}) => {
  const { books, authors, saveBookcaseSnapshot } = useData();
  const { isDark } = useTheme();

  // Filter only acquired/owned books
  const ownedBooks = books.filter((b) => b.is_owned);

  // Shelf organization state: 3 Shelves
  const [shelves, setShelves] = useState<ShelfItem[][]>(() => {
    // Try to restore from sessionStorage
    const saved = sessionStorage.getItem('folioread_bookshelf_arrangement');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate with current owned books
        if (Array.isArray(parsed) && parsed.length === 3) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }

    // Default distribution across 3 shelves
    const s1: ShelfItem[] = [];
    const s2: ShelfItem[] = [];
    const s3: ShelfItem[] = [];

    ownedBooks.forEach((book, idx) => {
      const item: ShelfItem = {
        book,
        isLeaning: idx % 5 === 4,
        isStacked: false,
      };
      if (idx % 3 === 0) s1.push(item);
      else if (idx % 3 === 1) s2.push(item);
      else s3.push(item);
    });

    return [s1, s2, s3];
  });

  const [shelfTheme, setShelfTheme] = useState<'walnut' | 'oak' | 'espresso' | 'birch'>('walnut');
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());
  const [draggedBookId, setDraggedBookId] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<{ shelfIndex: number; itemIndex: number } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState<string | null>(null);

  const bookcaseRef = useRef<HTMLDivElement>(null);

  // Save to sessionStorage whenever shelves change
  useEffect(() => {
    sessionStorage.setItem('folioread_bookshelf_arrangement', JSON.stringify(shelves));
  }, [shelves]);

  const toggleSound = () => {
    const nextMuted = soundFX.toggleMute();
    setIsMuted(nextMuted);
  };

  // Reset to default ordered layout
  const handleReset = () => {
    soundFX.playShuffle();
    const s1: ShelfItem[] = [];
    const s2: ShelfItem[] = [];
    const s3: ShelfItem[] = [];

    ownedBooks.forEach((book, idx) => {
      const item: ShelfItem = { book, isLeaning: false, isStacked: false };
      if (idx % 3 === 0) s1.push(item);
      else if (idx % 3 === 1) s2.push(item);
      else s3.push(item);
    });

    setShelves([s1, s2, s3]);
  };

  // Randomize arrangement across shelves
  const handleRandomize = () => {
    soundFX.playShuffle();
    const allItems: ShelfItem[] = shelves.flat();
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);

    const s1: ShelfItem[] = [];
    const s2: ShelfItem[] = [];
    const s3: ShelfItem[] = [];

    shuffled.forEach((item, idx) => {
      const leaning = Math.random() > 0.75;
      const stacked = !leaning && Math.random() > 0.85;
      const updatedItem = { ...item, isLeaning: leaning, isStacked: stacked };

      if (idx % 3 === 0) s1.push(updatedItem);
      else if (idx % 3 === 1) s2.push(updatedItem);
      else s3.push(updatedItem);
    });

    setShelves([s1, s2, s3]);
  };

  // Sort by Spine Color (Rainbow Hue)
  const handleSortColor = () => {
    soundFX.playShuffle();
    const allItems = shelves.flat();
    const sorted = [...allItems].sort((a, b) => {
      const colA = a.book.spine_color || '#333333';
      const colB = b.book.spine_color || '#333333';
      return colA.localeCompare(colB);
    });

    const s1: ShelfItem[] = [];
    const s2: ShelfItem[] = [];
    const s3: ShelfItem[] = [];

    sorted.forEach((item, idx) => {
      const updated = { ...item, isLeaning: false, isStacked: false };
      if (idx % 3 === 0) s1.push(updated);
      else if (idx % 3 === 1) s2.push(updated);
      else s3.push(updated);
    });

    setShelves([s1, s2, s3]);
  };

  // Sort by Height / Page Count
  const handleSortHeight = () => {
    soundFX.playShuffle();
    const allItems = shelves.flat();
    const sorted = [...allItems].sort((a, b) => b.book.total_pages - a.book.total_pages);

    const s1: ShelfItem[] = [];
    const s2: ShelfItem[] = [];
    const s3: ShelfItem[] = [];

    sorted.forEach((item, idx) => {
      const updated = { ...item, isLeaning: false, isStacked: false };
      if (idx % 3 === 0) s1.push(updated);
      else if (idx % 3 === 1) s2.push(updated);
      else s3.push(updated);
    });

    setShelves([s1, s2, s3]);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, shelfIndex: number, itemIndex: number, bookId: string) => {
    soundFX.playPickupBook();
    setDraggedBookId(bookId);
    setDragSource({ shelfIndex, itemIndex });
    e.dataTransfer.setData('text/plain', bookId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnShelf = (e: React.DragEvent, targetShelfIndex: number, targetItemIndex?: number) => {
    e.preventDefault();
    if (!dragSource) return;

    soundFX.playPlaceBook();

    setShelves((prev) => {
      const newShelves = prev.map((shelf) => [...shelf]);
      const [movedItem] = newShelves[dragSource.shelfIndex].splice(dragSource.itemIndex, 1);

      if (movedItem) {
        if (targetItemIndex !== undefined) {
          newShelves[targetShelfIndex].splice(targetItemIndex, 0, movedItem);
        } else {
          newShelves[targetShelfIndex].push(movedItem);
        }
      }
      return newShelves;
    });

    setDraggedBookId(null);
    setDragSource(null);
  };

  // Toggle book tilt (upright vs cozy lean)
  const handleToggleLean = (e: React.MouseEvent, shelfIndex: number, itemIndex: number) => {
    e.stopPropagation();
    soundFX.playPlaceBook();
    setShelves((prev) => {
      const newShelves = prev.map((shelf) => [...shelf]);
      const current = newShelves[shelfIndex][itemIndex];
      newShelves[shelfIndex][itemIndex] = {
        ...current,
        isLeaning: !current.isLeaning,
      };
      return newShelves;
    });
  };

  // Take high resolution canvas snapshot
  const handleTakeSnapshot = async () => {
    setIsCapturing(true);
    soundFX.playSnapshot();

    try {
      // Build an HTML5 Canvas drawing representing the bookcase
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 800;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw background wall
      const wallGrad = ctx.createLinearGradient(0, 0, 0, height);
      wallGrad.addColorStop(0, '#1c1917');
      wallGrad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, width, height);

      // Bookshelf Frame
      ctx.fillStyle = shelfTheme === 'walnut' ? '#451a03' : shelfTheme === 'oak' ? '#78350f' : shelfTheme === 'birch' ? '#d97706' : '#1c1917';
      ctx.fillRect(60, 40, width - 120, height - 80);

      // Shelves inner back
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(80, 60, width - 160, height - 120);

      // Draw 3 Shelves
      const shelfHeight = (height - 120) / 3;

      shelves.forEach((shelfItems, sIdx) => {
        const shelfY = 60 + (sIdx + 1) * shelfHeight - 24;

        // Shelf wooden beam
        const beamGrad = ctx.createLinearGradient(0, shelfY, 0, shelfY + 24);
        beamGrad.addColorStop(0, '#78350f');
        beamGrad.addColorStop(0.5, '#451a03');
        beamGrad.addColorStop(1, '#290f02');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(80, shelfY, width - 160, 24);

        // Draw books standing on this shelf
        let curX = 110;
        shelfItems.forEach((item) => {
          const spineW = Math.max(34, Math.min(68, item.book.total_pages / 7.5));
          const spineH = Math.max(130, Math.min(190, 140 + (item.book.total_pages % 50)));
          const spineY = shelfY - spineH;

          ctx.save();
          if (item.isLeaning) {
            ctx.translate(curX, shelfY);
            ctx.rotate(0.18);
            ctx.translate(-curX, -shelfY);
          }

          // Spine Body
          ctx.fillStyle = item.book.spine_color || '#262626';
          ctx.fillRect(curX, spineY, spineW, spineH);

          // Top/Bottom Gold Banding
          ctx.fillStyle = item.book.spine_accent || '#fbbf24';
          ctx.fillRect(curX, spineY + 8, spineW, 3);
          ctx.fillRect(curX, spineY + spineH - 12, spineW, 3);

          // Spine vertical title text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px serif';
          ctx.save();
          ctx.translate(curX + spineW / 2 + 4, spineY + spineH / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = 'center';
          const truncated = item.book.title.length > 20 ? item.book.title.slice(0, 18) + '...' : item.book.title;
          ctx.fillText(truncated, 0, 0);
          ctx.restore();

          ctx.restore();

          curX += spineW + 8;
        });
      });

      // Watermark / Header
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 22px serif';
      ctx.fillText("Aaryan's Curated Bookcase", 100, 36);

      ctx.fillStyle = '#a8a29e';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Snapshot taken on ${new Date().toLocaleDateString()} • ${ownedBooks.length} physical volumes`, 100, height - 16);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      // Save to Firestore (auto-capped to 10)
      await saveBookcaseSnapshot(
        `Curated Library (${new Date().toLocaleDateString()})`,
        dataUrl,
        ownedBooks.length
      );

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSnapshotSuccessMsg('Snapshot captured & preserved in the community log!');
      setTimeout(() => setSnapshotSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to capture snapshot', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const selectedThemeObj = SHELF_THEMES.find((t) => t.id === shelfTheme) || SHELF_THEMES[0];

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Title & Volume Count */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-xs">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <span>The Digital Library & Bookcase</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                {ownedBooks.length} Physical Volumes
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Interactive physical library. Drag & drop books between shelves, click to tilt, arrange, and capture snapshots.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Randomize Button */}
          <button
            onClick={handleRandomize}
            title="Shuffle Books Randomly"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Randomize</span>
          </button>

          {/* Sort Color */}
          <button
            onClick={handleSortColor}
            title="Sort Spines by Color Gradient"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-rose-500" />
            <span>By Color</span>
          </button>

          {/* Sort Height */}
          <button
            onClick={handleSortHeight}
            title="Sort by Page Count / Thickness"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500" />
            <span>By Pages</span>
          </button>

          {/* Reset Arrangement */}
          <button
            onClick={handleReset}
            title="Reset to Default"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Shelf Wood Selector */}
          <select
            value={shelfTheme}
            onChange={(e) => setShelfTheme(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer"
          >
            {SHELF_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Take Snapshot Button */}
          <button
            onClick={handleTakeSnapshot}
            disabled={isCapturing}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{isCapturing ? 'Snapping...' : 'Take Snapshot'}</span>
          </button>

          {/* Snapshot Log Gallery Trigger */}
          <button
            onClick={onOpenSnapshotLog}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>Log (Max 10)</span>
          </button>
        </div>
      </div>

      {/* Snapshot Success Toast */}
      {snapshotSuccessMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">{snapshotSuccessMsg}</span>
          </div>
          <button
            onClick={onOpenSnapshotLog}
            className="underline font-semibold cursor-pointer"
          >
            View in Snapshot Log →
          </button>
        </div>
      )}

      {/* The Graphic Interactive Bookcase Frame */}
      <div
        ref={bookcaseRef}
        className="relative rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border-8 border-amber-950/90 dark:border-stone-900 bg-stone-950 text-stone-100"
        style={{
          backgroundImage: `radial-gradient(ellipse at center, rgba(30, 20, 15, 0.45) 0%, rgba(10, 8, 7, 0.95) 100%)`,
        }}
      >
        {/* Subtle Arch / Library Ambiance Top Header */}
        <div className="text-center pb-4 mb-2 border-b border-amber-950/60">
          <span className="font-serif italic text-amber-200/60 text-xs tracking-widest uppercase">
            ✦ Private Physical Library Archive ✦
          </span>
        </div>

        {/* 3 Physical Wooden Shelves */}
        <div className="space-y-12">
          {shelves.map((shelfItems, shelfIndex) => {
            return (
              <div
                key={shelfIndex}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnShelf(e, shelfIndex)}
                className="relative group/shelf"
              >
                {/* Books Row standing on top of shelf */}
                <div className="min-h-[190px] flex items-end px-4 sm:px-8 space-x-1.5 sm:space-x-2.5 overflow-x-auto pb-0.5 scrollbar-thin">
                  {shelfItems.length === 0 ? (
                    <div className="w-full py-12 text-center text-xs text-amber-200/30 italic">
                      Empty shelf space — drag any book here
                    </div>
                  ) : (
                    shelfItems.map((item, itemIndex) => {
                      const book = item.book;
                      const author = authors.find((a) => a.id === book.author_id)?.name;
                      
                      // Calculate thickness based on pages
                      const spineWidth = Math.max(34, Math.min(68, Math.round(book.total_pages / 7.5)));
                      const spineHeight = Math.max(140, Math.min(200, 150 + (book.total_pages % 50)));

                      return (
                        <div
                          key={book.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, shelfIndex, itemIndex, book.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => {
                            e.stopPropagation();
                            handleDropOnShelf(e, shelfIndex, itemIndex);
                          }}
                          onClick={() => onOpenBookDetail(book)}
                          title={`${book.title} by ${author} (${book.total_pages}p) • Double click to tilt`}
                          onDoubleClick={(e) => handleToggleLean(e, shelfIndex, itemIndex)}
                          style={{
                            width: `${spineWidth}px`,
                            height: `${spineHeight}px`,
                            backgroundColor: book.spine_color || '#1e293b',
                            transform: item.isLeaning ? 'rotate(9deg) translateY(4px)' : 'none',
                          }}
                          className={`relative shrink-0 rounded-t-sm shadow-md hover:shadow-xl hover:-translate-y-2 cursor-grab active:cursor-grabbing transition-all select-none border-t border-r border-white/20 flex flex-col justify-between py-2.5 px-1 group/book ${
                            draggedBookId === book.id ? 'opacity-40 scale-95' : ''
                          }`}
                        >
                          {/* Top Gilded Band */}
                          <div
                            className="w-full h-1 rounded-xs opacity-80"
                            style={{ backgroundColor: book.spine_accent || '#fbbf24' }}
                          />

                          {/* Spine Vertical Title Text */}
                          <div className="flex-1 flex items-center justify-center overflow-hidden py-1">
                            <span
                              className="font-serif font-bold text-[11px] sm:text-xs text-white/95 tracking-wide text-center uppercase drop-shadow-sm whitespace-nowrap"
                              style={{
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed',
                                transform: 'rotate(180deg)',
                                maxHeight: `${spineHeight - 50}px`,
                              }}
                            >
                              {book.title}
                            </span>
                          </div>

                          {/* Author Mini Text & Bottom Gilded Band */}
                          <div className="space-y-1">
                            <div className="text-[8px] font-sans text-amber-200/80 text-center truncate px-0.5">
                              {author?.split(' ').pop()}
                            </div>
                            <div
                              className="w-full h-1 rounded-xs opacity-80"
                              style={{ backgroundColor: book.spine_accent || '#fbbf24' }}
                            />
                          </div>

                          {/* Bookmark Ribbon Tail hanging slightly */}
                          <div
                            className="absolute -bottom-2 right-2 w-1.5 h-3 rounded-b-xs shadow-xs"
                            style={{ backgroundColor: book.spine_accent || '#fbbf24' }}
                          />

                          {/* Hover Tooltip / Action button */}
                          <button
                            onClick={(e) => handleToggleLean(e, shelfIndex, itemIndex)}
                            title="Toggle Book Lean / Upright"
                            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/book:opacity-100 transition-opacity whitespace-nowrap z-10"
                          >
                            {item.isLeaning ? 'Straighten' : 'Tilt'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Heavy 3D Wooden Shelf Beam */}
                <div
                  className={`w-full h-7 rounded-sm bg-gradient-to-b ${selectedThemeObj.woodClass} border-t-2 border-b-4 relative shadow-xl`}
                >
                  {/* Wood Grain Bevel */}
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Shelf Floor Trim */}
        <div className="mt-8 pt-4 border-t border-amber-950/70 flex items-center justify-between text-[11px] text-amber-200/60 font-mono">
          <span>Double-click any book to tilt / lean • Drag to reorder</span>
          <span>Tip: Click book spine to read long-form review</span>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CalendarCheck,
  Star,
  Plus,
  Bookmark,
  BookMarked,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Lightbulb,
  CheckSquare,
  Target,
  BarChart2,
  Layers,
  Headphones,
  Check,
  ArrowRight,
  ShoppingBag,
  Library,
  User,
  Tag,
  DollarSign,
  Sun,
  Trash2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Book, ActiveNavTab } from '../../types';
import { formatBookStatus } from '../../utils/formatters';

interface NotionDashboardProps {
  onSelectBook: (book: Book) => void;
  onOpenAddBook: () => void;
  setActiveTab: (tab: ActiveNavTab) => void;
}

export const NotionDashboard: React.FC<NotionDashboardProps> = ({
  onSelectBook,
  onOpenAddBook,
  setActiveTab,
}) => {
  const { books, authors, goal, habits, settings, toggleDailyHabit } = useData();
  const { isAdmin } = useAuth();
  const { theme } = useTheme();

  const [bookshelfSubTab, setBookshelfSubTab] = useState<'currently' | '2025'>('currently');
  const [isHabitCollapsed, setIsHabitCollapsed] = useState(false);
  const [reminders, setReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('folio_reminders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      'preorder book',
      'finish Obelisk Gate chapter 12',
      'check local indie bookstore for Earthsea edition',
    ];
  });
  const [newReminderText, setNewReminderText] = useState('');
  const [isAddingReminder, setIsAddingReminder] = useState(false);

  const handleDeleteReminder = (idxToRemove: number) => {
    const updated = reminders.filter((_, idx) => idx !== idxToRemove);
    setReminders(updated);
    try {
      localStorage.setItem('folio_reminders', JSON.stringify(updated));
    } catch {}
  };

  // Books categorization
  const currentlyReadingBooks = books.filter((b) => b.status === 'Currently Reading');
  const readBooks2025 = books
    .filter((b) => b.status === 'Read')
    .sort((a, b) => {
      const dateA = new Date(a.date_finished || '').getTime() || 0;
      const dateB = new Date(b.date_finished || '').getTime() || 0;
      return dateB - dateA;
    });

  const tbrBooks = books.filter((b) => b.is_owned && b.status === 'TBR');
  const recentlyBoughtBooks = books
    .filter((b) => b.is_owned && b.purchase_date)
    .sort((a, b) => {
      const dateA = new Date(a.purchase_date || '').getTime() || 0;
      const dateB = new Date(b.purchase_date || '').getTime() || 0;
      return dateB - dateA;
    });

  // Books finished this month for "my month at a glance"
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const finishedThisMonthBooks = readBooks2025.filter((b) => {
    if (!b.date_finished) return false;
    try {
      const d = new Date(b.date_finished);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    } catch {
      return false;
    }
  });

  const monthGlanceBooks = finishedThisMonthBooks.length > 0
    ? finishedThisMonthBooks
    : readBooks2025.slice(0, 2);

  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Goal metrics
  const targetBooks = goal.target_books || 30;
  const goalPercent = Math.min(100, Math.round((readBooks2025.length / targetBooks) * 100));

  // Today Habit status
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayHabit = habits.find((h) => h.date === todayStr);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminderText.trim()) {
      const updated = [...reminders, newReminderText.trim()];
      setReminders(updated);
      try {
        localStorage.setItem('folio_reminders', JSON.stringify(updated));
      } catch {}
      setNewReminderText('');
      setIsAddingReminder(false);
    }
  };

  // Dot Progress generator (10 circles: filled & open, e.g. ●●●●●○○○○○ 50%)
  const renderDotProgress = (pagesRead: number, totalPages: number) => {
    const pct = Math.min(100, Math.round((pagesRead / (totalPages || 1)) * 100));
    const filledDots = Math.min(10, Math.max(0, Math.round(pct / 10)));
    const openDots = 10 - filledDots;

    return (
      <div className="flex items-center space-x-1 font-mono text-[11px] text-stone-800 dark:text-stone-200 mt-2 select-none">
        <div className="flex space-x-0.5">
          {Array.from({ length: filledDots }).map((_, i) => (
            <span key={`f-${i}`} className="text-stone-900 dark:text-stone-100 text-xs">●</span>
          ))}
          {Array.from({ length: openDots }).map((_, i) => (
            <span key={`o-${i}`} className="text-stone-300 dark:text-stone-600 text-xs">○</span>
          ))}
        </div>
        <span className="ml-1.5 font-sans font-medium text-stone-600 dark:text-stone-400">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 3-Column Notion Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: bookish reminders, monthly tbr, month at a glance */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-4">

          {/* Card 2: bookish reminders (Soft Butter/Theme Card) */}
          <div className={`p-4 rounded-2xl ${theme.cardReminders} border shadow-2xs space-y-2.5 transition-colors`}>
            <div className="flex items-center justify-between text-stone-900 dark:text-stone-100">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif italic font-semibold text-xs tracking-tight">
                  bookish reminders
                </h3>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setIsAddingReminder(!isAddingReminder)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 font-sans pl-1">
              {reminders.map((rem, idx) => (
                <li key={idx} className="flex items-center justify-between group">
                  <div className="flex items-start space-x-2 min-w-0">
                    <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-snug break-words">{rem}</span>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(idx)}
                      title="Delete reminder"
                      className="p-1 rounded text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors shrink-0 ml-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
              {reminders.length === 0 && (
                <li className="text-stone-400 italic text-[11px]">No active reminders.</li>
              )}
            </ul>

            {isAdmin && isAddingReminder && (
              <form onSubmit={handleAddReminder} className="pt-2 flex items-center space-x-1.5">
                <input
                  type="text"
                  placeholder="New reminder..."
                  value={newReminderText}
                  onChange={(e) => setNewReminderText(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] font-semibold cursor-pointer"
                >
                  Add
                </button>
              </form>
            )}
          </div>

          {/* Card 3: my monthly tbr (Moves to TBR page on click) */}
          <div
            onClick={() => setActiveTab('my-tbr')}
            className={`p-4 rounded-2xl ${theme.cardMonthlyTbr} border shadow-2xs space-y-3 cursor-pointer hover:shadow-sm transition-all group`}
          >
            <div className="flex items-center justify-between text-stone-900 dark:text-stone-100">
              <div className="flex items-center space-x-2">
                <BookMarked className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                <h3 className="font-serif italic font-semibold text-xs tracking-tight group-hover:text-amber-600 transition-colors">
                  my monthly tbr
                </h3>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 flex items-center space-x-1.5">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span>this month</span>
              </div>

              {tbrBooks.slice(0, 3).map((book) => (
                <div
                  key={book.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBook(book);
                  }}
                  className="flex items-center space-x-2 py-1 px-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="hover:underline font-medium truncate">{book.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: my month at a glance (BOOKS COMPLETED THIS MONTH ONLY: Thumbnail, Title, Star Rating) */}
          <div className={`p-4 rounded-2xl ${theme.cardMonthGlance} border shadow-2xs space-y-3 transition-colors`}>
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
              <CalendarCheck className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <h3 className="font-serif italic font-semibold text-xs tracking-tight">
                my month at a glance
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-stone-600 dark:text-stone-400 pb-1 border-b border-black/5 dark:border-white/5">
                <span>Completed in</span>
                <span>{currentMonthName}</span>
              </div>

              {monthGlanceBooks.length === 0 ? (
                <div className="py-4 text-center text-xs text-stone-400 italic">
                  No books completed this month yet.
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {monthGlanceBooks.map((book) => {
                    const author = authors.find((a) => a.id === book.author_id)?.name;
                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelectBook(book)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-stone-900 transition-colors cursor-pointer group"
                      >
                        {/* Small Thumbnail */}
                        <div className="w-9 h-13 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 shadow-2xs border border-stone-200 dark:border-stone-700">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>

                        {/* Title & Star Rating */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-[10px] text-stone-500 truncate">
                            {author}
                          </p>
                          <div className="flex items-center space-x-1 text-amber-500 font-mono text-[10px] font-semibold mt-0.5">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span>{book.star_rating > 0 ? book.star_rating.toFixed(1) : '5.0'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Card: To Be Read (Showing 2-3 item tiles with highlighted hoverable title) */}
          <div className={`p-4 rounded-3xl ${theme.cardMonthlyTbr} border shadow-2xs space-y-3 transition-colors`}>
            <div
              onClick={() => setActiveTab('my-tbr')}
              className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10 cursor-pointer group/header hover:bg-black/5 dark:hover:bg-white/5 -mx-1 px-1.5 py-1 rounded-xl transition-all"
              title="View full To Be Read catalog"
            >
              <div className="flex items-center space-x-2">
                <BookMarked className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover/header:scale-110 transition-transform" />
                <h4 className="font-serif italic font-bold text-xs text-stone-900 dark:text-stone-100 group-hover/header:text-amber-600 dark:group-hover/header:text-amber-400 transition-colors">
                  To Be Read
                </h4>
              </div>
              <div className="text-[11px] font-medium text-stone-500 group-hover/header:text-stone-900 dark:group-hover/header:text-stone-100 flex items-center space-x-1">
                <span className="group-hover/header:underline">{tbrBooks.length} queued</span>
                <ArrowRight className="w-3 h-3 ml-0.5 group-hover/header:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* 2 to 3 Book Item Tiles */}
            <div className="space-y-2">
              {tbrBooks.slice(0, 3).map((book) => {
                const author = authors.find((a) => a.id === book.author_id)?.name;
                return (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-stone-900 hover:shadow-2xs transition-all cursor-pointer flex items-center space-x-2.5 group"
                  >
                    <div className="w-8 h-11 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                      <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                        {book.title}
                      </h5>
                      <p className="text-[10px] text-stone-500 truncate">{author}</p>
                      <span className="text-[9px] font-mono text-stone-400">{book.total_pages}p • {book.format}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Recently Bought (Showing 2-3 item tiles with highlighted hoverable title) */}
          <div className={`p-4 rounded-3xl ${theme.cardReading} border shadow-2xs space-y-3 transition-colors`}>
            <div
              onClick={() => setActiveTab('recently-bought')}
              className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10 cursor-pointer group/header hover:bg-black/5 dark:hover:bg-white/5 -mx-1 px-1.5 py-1 rounded-xl transition-all"
              title="View full Recently Bought collection"
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover/header:scale-110 transition-transform" />
                <h4 className="font-serif italic font-bold text-xs text-stone-900 dark:text-stone-100 group-hover/header:text-emerald-600 dark:group-hover/header:text-emerald-400 transition-colors">
                  Recently Bought
                </h4>
              </div>
              <div className="text-[11px] font-medium text-stone-500 group-hover/header:text-stone-900 dark:group-hover/header:text-stone-100 flex items-center space-x-1">
                <span className="group-hover/header:underline">{recentlyBoughtBooks.length} titles</span>
                <ArrowRight className="w-3 h-3 ml-0.5 group-hover/header:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* 2 to 3 Book Item Tiles */}
            <div className="space-y-2">
              {recentlyBoughtBooks.slice(0, 3).map((book) => {
                const author = authors.find((a) => a.id === book.author_id)?.name;
                return (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-stone-900 hover:shadow-2xs transition-all cursor-pointer flex items-center space-x-2.5 group"
                  >
                    <div className="w-8 h-11 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                      <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                        {book.title}
                      </h5>
                      <p className="text-[10px] text-stone-500 truncate">{author}</p>
                      <span className="text-[9px] font-mono text-stone-400">
                        {book.purchase_date || 'Purchased'} • {book.format}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* CENTER COLUMN: my bookshelf, my year in reading (Titles, ratings & thumbnails) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Card 5: my bookshelf (Light Cyan/Teal Notion Card) */}
          <div className={`p-5 rounded-3xl ${theme.cardBookshelf} border shadow-2xs space-y-4 transition-colors`}>
            
            {/* Header & Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4.5 h-4.5 text-stone-700 dark:text-stone-200" />
                <h2 className="font-serif italic font-semibold text-base text-stone-900 dark:text-stone-100 tracking-tight">
                  my bookshelf
                </h2>
              </div>

              {/* Notion-style tab bar */}
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setBookshelfSubTab('currently')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    bookshelfSubTab === 'currently'
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Currently</span>
                </button>

                <button
                  onClick={() => setBookshelfSubTab('2025')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    bookshelfSubTab === '2025'
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>2025</span>
                </button>
              </div>
            </div>

            {/* Currently Reading Notion View */}
            {bookshelfSubTab === 'currently' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentlyReadingBooks.map((book) => {
                  const author = authors.find((a) => a.id === book.author_id)?.name;

                  return (
                    <div
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        {/* Book Cover Image inside Card */}
                        <div className="aspect-4/5 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-3 border border-stone-200 dark:border-stone-700">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Title with book icon */}
                        <div className="flex items-center space-x-2 text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{book.title}</span>
                        </div>

                        {/* Author with user icon */}
                        <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                          <User className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{author}</span>
                        </div>
                      </div>

                      {/* 10-dot progress indicator */}
                      {renderDotProgress(book.pages_read, book.total_pages)}
                    </div>
                  );
                })}

                {/* + New page button */}
                {isAdmin && (
                  <button
                    onClick={onOpenAddBook}
                    className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-stone-300/80 dark:border-stone-700 flex flex-col items-center justify-center space-y-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:border-stone-400 transition-all cursor-pointer bg-white/30 dark:bg-stone-900/30"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-medium font-sans">+ New page</span>
                  </button>
                )}
              </div>
            )}

            {/* 2025 Read Table View */}
            {bookshelfSubTab === '2025' && (
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-medium border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>Author</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3">
                        <div className="flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Status</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {readBooks2025.map((book) => {
                      const author = authors.find((a) => a.id === book.author_id)?.name;
                      return (
                        <tr
                          key={book.id}
                          onClick={() => onSelectBook(book)}
                          className="hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 px-3 flex items-center space-x-2 font-serif font-bold text-stone-900 dark:text-stone-100">
                            <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{book.title}</span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 dark:text-stone-300">{author}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                              ● {formatBookStatus(book.status, book.star_rating)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 text-[11px] font-mono text-stone-400 border-t border-stone-100 dark:border-stone-800">
                  COUNT {readBooks2025.length}
                </div>
              </div>
            )}
          </div>

          {/* Card 6: my year in reading (ONLY CONTAINS LIST OF TITLES, RATINGS, AND THUMBNAILS - CLICKS OPEN REVIEW) */}
          <div className={`p-5 rounded-3xl ${theme.cardYearReading} border shadow-2xs space-y-4 transition-colors`}>
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4.5 h-4.5 text-stone-700 dark:text-stone-200" />
                <h2 className="font-serif italic font-semibold text-base text-stone-900 dark:text-stone-100 tracking-tight">
                  my year in reading (2025)
                </h2>
              </div>
              <span className="text-xs font-mono font-medium text-stone-500">
                {readBooks2025.length} books completed
              </span>
            </div>

            {/* List of titles with thumbnails and star ratings (Clicking opens review) */}
            <div className="space-y-2.5">
              {readBooks2025.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 italic">
                  No completed books recorded for this year yet.
                </div>
              ) : (
                readBooks2025.map((book) => {
                  const author = authors.find((a) => a.id === book.author_id)?.name;
                  return (
                    <div
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className="p-3 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-stone-900 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        {/* Book Thumbnail */}
                        <div className="w-11 h-15 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 shadow-2xs border border-stone-200 dark:border-stone-700">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>

                        {/* Title & Author */}
                        <div className="min-w-0">
                          <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-stone-500 truncate">
                            by {author} • {book.total_pages} pages
                          </p>
                          <span className="text-[10px] font-mono text-stone-400">
                            Finished: {book.date_finished || '2025'}
                          </span>
                        </div>
                      </div>

                      {/* Star Rating & Open Indicator */}
                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="flex items-center space-x-1 text-amber-500 font-mono text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{book.star_rating > 0 ? book.star_rating.toFixed(1) : '5.0'}</span>
                        </div>
                        <span className="text-xs text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors font-medium">
                          Review →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Quote & Artwork, my data, habit tracker, reading goals */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card 7: Quote block with Dynamic Theme Arch Silhouette */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs flex">
            <div className="flex-1 pr-6 border-l-2 border-stone-900 dark:border-stone-100 pl-3">
              <p className="font-serif italic text-xs leading-relaxed text-stone-800 dark:text-stone-200">
                "{settings.quote_text}"
              </p>
              <span className="block font-sans text-[11px] text-stone-500 mt-1">
                - {settings.quote_author}
              </span>
            </div>

            {/* Organic Arch Silhouette Shape */}
            <div className={`w-14 h-28 -mr-6 -my-4 rounded-l-full bg-gradient-to-br ${theme.silhouetteGradient} shadow-inner opacity-90 transition-all`} />
          </div>

          {/* Card 8: my data / my trackers (Theme Card) */}
          <div className={`p-4 rounded-2xl ${theme.cardData} border shadow-2xs space-y-3 transition-colors`}>
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 pb-1">
              <BarChart2 className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <h3 className="font-serif italic font-semibold text-xs tracking-tight">
                my data
              </h3>
            </div>

            <nav className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
              <button
                onClick={() => setActiveTab('statistics')}
                className="w-full flex items-center space-x-2.5 py-1 px-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5 text-stone-400" />
                <span className="hover:underline">my statistics</span>
              </button>

              <button
                onClick={() => setActiveTab('goals')}
                className="w-full flex items-center space-x-2.5 py-1 px-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <Target className="w-3.5 h-3.5 text-stone-400" />
                <span className="hover:underline">reading goals</span>
              </button>

              <button
                onClick={() => setActiveTab('habits')}
                className="w-full flex items-center space-x-2.5 py-1 px-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-stone-400" />
                <span className="hover:underline">habit tracker</span>
              </button>

              <button
                onClick={() => setActiveTab('my-series')}
                className="w-full flex items-center space-x-2.5 py-1 px-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                <span className="hover:underline">series database</span>
              </button>
            </nav>
          </div>

          {/* Card 9: habit tracker (Theme Card) */}
          <div className={`p-4 rounded-2xl ${theme.cardHabit} border shadow-2xs space-y-2.5 transition-colors`}>
            <button
              onClick={() => setIsHabitCollapsed(!isHabitCollapsed)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
                <CheckSquare className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                <ChevronRight className={`w-3 h-3 text-stone-400 transition-transform ${isHabitCollapsed ? '' : 'rotate-90'}`} />
                <h3 className="font-serif italic font-semibold text-xs tracking-tight">
                  habit tracker
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                {habits.filter((h) => h.read_physical || h.read_audio).length}d
              </span>
            </button>

            {!isHabitCollapsed && (
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => toggleDailyHabit(todayStr, 'physical')}
                    className={`py-1.5 px-2 rounded-xl border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      todayHabit?.read_physical
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                        : 'bg-white/80 dark:bg-stone-800 border-stone-300 text-stone-700'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Physical</span>
                    {todayHabit?.read_physical && <Check className="w-3 h-3 ml-1" />}
                  </button>

                  <button
                    onClick={() => toggleDailyHabit(todayStr, 'audio')}
                    className={`py-1.5 px-2 rounded-xl border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      todayHabit?.read_audio
                        ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                        : 'bg-white/80 dark:bg-stone-800 border-stone-300 text-stone-700'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Audio</span>
                    {todayHabit?.read_audio && <Check className="w-3 h-3 ml-1" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 10: reading goals (Theme Card) */}
          <div className={`p-4 rounded-2xl ${theme.cardGoals} border shadow-2xs space-y-3 transition-colors`}>
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
              <Target className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <h3 className="font-serif italic font-semibold text-xs tracking-tight">
                reading goals
              </h3>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-medium text-stone-500 flex items-center space-x-1.5">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span>2025</span>
              </div>

              {/* Aesthetic Year Art Cover Banner */}
              <div className="relative rounded-2xl overflow-hidden p-5 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 text-center border border-black/5 dark:border-white/10 shadow-xs">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-800/80 dark:text-stone-100 tracking-wider block">
                  2025
                </span>
              </div>

              <div className="p-3 bg-white/80 dark:bg-stone-900/80 rounded-xl border border-stone-200/60 dark:border-stone-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300 font-medium">
                  <span>Reading Goal Progress</span>
                  <span className="font-mono font-bold text-amber-600">{goalPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${goalPercent}%` }} />
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-sans pt-1">
                  you've read {readBooks2025.length} books • {goal.books_completed_count || readBooks2025.length} of {targetBooks}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

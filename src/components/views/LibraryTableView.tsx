import React, { useState, useRef, useEffect } from 'react';
import {
  Library,
  Search,
  Filter,
  Star,
  Plus,
  Grid,
  List as ListIcon,
  Calendar,
  CalendarCheck,
  ArrowUpDown,
  BookOpen,
  ChevronDown,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  X,
  Check,
  Type,
  User,
  Headphones,
  Clock,
  Calculator,
  XCircle,
  CheckCheck,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Book, BookFormat, BookStatus } from '../../types';
import { formatBookStatus } from '../../utils/formatters';

interface LibraryTableViewProps {
  onSelectBook: (book: Book) => void;
  onOpenAddBook: () => void;
}

type LibraryTab = 'All' | '2025' | 'TBR' | 'Currently Reading' | 'Read This Month' | 'DNF' | 'Complete';

interface FilterState {
  sortField: 'date_finished' | 'title' | 'star_rating' | 'total_pages';
  sortOrder: 'desc' | 'asc';
  timeframe: 'all' | 'this_year' | 'this_month';
  status: 'ALL' | BookStatus;
  format: 'ALL' | BookFormat;
  minRating: number;
}

const DEFAULT_FILTERS: FilterState = {
  sortField: 'date_finished',
  sortOrder: 'desc',
  timeframe: 'all',
  status: 'ALL',
  format: 'ALL',
  minRating: 0,
};

export const LibraryTableView: React.FC<LibraryTableViewProps> = ({ onSelectBook, onOpenAddBook }) => {
  const { books, authors, deleteBook } = useData();
  const { isAdmin } = useAuth();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<LibraryTab>('2025');
  const [viewMode, setViewMode] = useState<'list' | 'tile'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isAddFilterOpen, setIsAddFilterOpen] = useState(false);
  const [openPillDropdown, setOpenPillDropdown] = useState<string | null>(null);

  const addFilterRef = useRef<HTMLDivElement>(null);
  const pillDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addFilterRef.current && !addFilterRef.current.contains(e.target as Node)) {
        setIsAddFilterOpen(false);
      }
      if (pillDropdownRef.current && !pillDropdownRef.current.contains(e.target as Node)) {
        setOpenPillDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Multi-criteria filter & sort pipeline
  const filteredBooks = books
    .filter((b) => {
      const author = authors.find((a) => a.id === b.author_id)?.name || '';
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Tab selection (when activeTab is 'All', no status restriction)
      if (activeTab === '2025' && b.status !== 'Read') return false;
      if (activeTab === 'TBR' && b.status !== 'TBR') return false;
      if (activeTab === 'Currently Reading' && b.status !== 'Currently Reading') return false;
      if (activeTab === 'Read This Month') {
        if (b.status !== 'Read' || !b.date_finished) return false;
        try {
          const d = new Date(b.date_finished);
          if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return false;
        } catch {
          return false;
        }
      }
      if (activeTab === 'DNF' && b.status !== 'DNF') return false;
      if (activeTab === 'Complete' && b.status !== 'Read') return false;

      // Status filter
      if (filters.status !== 'ALL' && b.status !== filters.status) return false;

      // Format filter
      if (filters.format !== 'ALL' && b.format !== filters.format) return false;

      // Rating filter
      if (filters.minRating > 0 && b.star_rating < filters.minRating) return false;

      // Timeframe filter
      if (filters.timeframe === 'this_year') {
        if (!b.date_finished) return false;
        try {
          const d = new Date(b.date_finished);
          if (d.getFullYear() !== currentYear) return false;
        } catch {
          return false;
        }
      } else if (filters.timeframe === 'this_month') {
        if (!b.date_finished) return false;
        try {
          const d = new Date(b.date_finished);
          if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return false;
        } catch {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortField === 'title') {
        return filters.sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (filters.sortField === 'star_rating') {
        return filters.sortOrder === 'asc'
          ? a.star_rating - b.star_rating
          : b.star_rating - a.star_rating;
      }
      if (filters.sortField === 'total_pages') {
        return filters.sortOrder === 'asc'
          ? a.total_pages - b.total_pages
          : b.total_pages - a.total_pages;
      }
      // default: date_finished
      const dateA = new Date(a.date_finished || a.purchase_date || a.createdAt || '').getTime() || 0;
      const dateB = new Date(b.date_finished || b.purchase_date || b.createdAt || '').getTime() || 0;
      return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Calculate summaries for footer
  const count = filteredBooks.length;
  const rated = filteredBooks.filter((b) => b.star_rating > 0);
  const avgRating = rated.length > 0
    ? (rated.reduce((acc, b) => acc + b.star_rating, 0) / rated.length).toFixed(1)
    : '0';
  const sumPages = filteredBooks.reduce((acc, b) => acc + (b.total_pages || 0), 0);
  const sumAudio = filteredBooks.filter((b) => b.format === 'Audiobook').length * 10;

  // Active filter state check
  const hasActiveFilters =
    filters.timeframe !== 'all' ||
    filters.status !== 'ALL' ||
    filters.format !== 'ALL' ||
    filters.minRating > 0 ||
    filters.sortField !== 'date_finished' ||
    filters.sortOrder !== 'desc';

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Helper when user selects a status from "+ Add filter"
  const handleSelectStatusFilter = (st: BookStatus) => {
    setFilters({ ...filters, status: st });
    setIsAddFilterOpen(false);
    // Switch to 'All' tab to avoid conflict if on a specific status tab
    if (activeTab !== 'All' && activeTab !== st) {
      setActiveTab('All');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Title & View Switcher */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
            <Library className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-sans font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            my library
          </h1>
        </div>

        {/* View Mode Switcher (Tile vs List) */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200/70 dark:border-stone-700/60">
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('tile')}
            title="Tile View"
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'tile'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Tile View</span>
          </button>
        </div>
      </div>

      {/* Notion Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs">
        <div className="flex flex-wrap items-center space-x-1 sm:space-x-1.5">
          <button
            onClick={() => setActiveTab('All')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'All'
                ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Library className="w-3.5 h-3.5 opacity-75" />
            <span>All Books</span>
          </button>

          <button
            onClick={() => setActiveTab('2025')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === '2025'
                ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 opacity-75" />
            <span>2025</span>
          </button>

          <button
            onClick={() => setActiveTab('TBR')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'TBR'
                ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 opacity-75" />
            <span>TBR</span>
          </button>

          <button
            onClick={() => setActiveTab('Currently Reading')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'Currently Reading'
                ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 opacity-75" />
            <span>Currently Reading</span>
          </button>

          <button
            onClick={() => setActiveTab('Read This Month')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'Read This Month'
                ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 opacity-75" />
            <span>Read This Month</span>
          </button>

          <button
            onClick={() => setActiveTab('DNF')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'DNF'
                ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 opacity-75" />
            <span>DNF'd</span>
          </button>

          <button
            onClick={() => setActiveTab('Complete')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'Complete'
                ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5 opacity-75" />
            <span>Complete Read Library</span>
          </button>
        </div>

        {/* Right Toolbar: Quick Search & Blue New Button */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs w-32 sm:w-44 focus:w-56 transition-all focus:outline-hidden"
            />
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAddBook}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#2383e2] hover:bg-[#1a73ca] text-white rounded-lg font-medium text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          )}
        </div>
      </div>

      {/* Minimalist Interactive Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
        
        {/* Filter Pill 1: Sort Dropdown */}
        <div className="relative" ref={openPillDropdown === 'sort' ? pillDropdownRef : null}>
          <button
            onClick={() => setOpenPillDropdown(openPillDropdown === 'sort' ? null : 'sort')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-[11px] font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3 h-3 text-stone-400" />
            <span>
              Sort: {filters.sortField === 'date_finished'
                ? 'Date Finished'
                : filters.sortField === 'title'
                ? 'Title'
                : filters.sortField === 'star_rating'
                ? 'Rating'
                : 'Pages'}{' '}
              ({filters.sortOrder === 'desc' ? 'Desc' : 'Asc'})
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {openPillDropdown === 'sort' && (
            <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setFilters({ ...filters, sortField: 'date_finished', sortOrder: 'desc' });
                  setOpenPillDropdown(null);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <span>Date Finished (Newest)</span>
                {filters.sortField === 'date_finished' && filters.sortOrder === 'desc' && <Check className="w-3 h-3 text-blue-500" />}
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, sortField: 'title', sortOrder: 'asc' });
                  setOpenPillDropdown(null);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <span>Title (A-Z)</span>
                {filters.sortField === 'title' && filters.sortOrder === 'asc' && <Check className="w-3 h-3 text-blue-500" />}
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, sortField: 'star_rating', sortOrder: 'desc' });
                  setOpenPillDropdown(null);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <span>Highest Rated</span>
                {filters.sortField === 'star_rating' && <Check className="w-3 h-3 text-blue-500" />}
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, sortField: 'total_pages', sortOrder: 'desc' });
                  setOpenPillDropdown(null);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <span>Most Pages</span>
                {filters.sortField === 'total_pages' && <Check className="w-3 h-3 text-blue-500" />}
              </button>
            </div>
          )}
        </div>

        {/* Filter Pill 2: Timeframe (Interactive dropdown + X button) */}
        {filters.timeframe !== 'all' && (
          <div className="flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-medium space-x-1.5 transition-all">
            <Calendar className="w-3 h-3 text-blue-500" />
            <button
              onClick={() => setFilters({ ...filters, timeframe: filters.timeframe === 'this_year' ? 'this_month' : 'this_year' })}
              className="hover:underline cursor-pointer"
              title="Click to toggle timeframe"
            >
              Finished: {filters.timeframe === 'this_year' ? 'This year' : 'This month'}
            </button>
            <button
              onClick={() => setFilters({ ...filters, timeframe: 'all' })}
              title="Disable timeframe filter"
              className="hover:bg-blue-200/50 dark:hover:bg-blue-900 rounded p-0.5 ml-0.5 cursor-pointer text-blue-600 dark:text-blue-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Filter Pill 3: Status (Interactive dropdown + X button) */}
        {filters.status !== 'ALL' && (
          <div className="flex items-center px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-medium space-x-1.5 transition-all">
            <CheckCircle2 className="w-3 h-3 text-purple-500" />
            <span>Status: {filters.status}</span>
            <button
              onClick={() => setFilters({ ...filters, status: 'ALL' })}
              title="Disable status filter"
              className="hover:bg-purple-200/50 dark:hover:bg-purple-900 rounded p-0.5 ml-0.5 cursor-pointer text-purple-600 dark:text-purple-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Filter Pill 4: Format (Interactive dropdown + X button) */}
        {filters.format !== 'ALL' && (
          <div className="flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium space-x-1.5 transition-all">
            <Headphones className="w-3 h-3 text-emerald-500" />
            <span>Format: {filters.format}</span>
            <button
              onClick={() => setFilters({ ...filters, format: 'ALL' })}
              title="Disable format filter"
              className="hover:bg-emerald-200/50 dark:hover:bg-emerald-900 rounded p-0.5 ml-0.5 cursor-pointer text-emerald-600 dark:text-emerald-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Filter Pill 5: Minimum Rating (Interactive dropdown + X button) */}
        {filters.minRating > 0 && (
          <div className="flex items-center px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-medium space-x-1.5 transition-all">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Rating: {filters.minRating}★+</span>
            <button
              onClick={() => setFilters({ ...filters, minRating: 0 })}
              title="Disable rating filter"
              className="hover:bg-amber-200/50 dark:hover:bg-amber-900 rounded p-0.5 ml-0.5 cursor-pointer text-amber-600 dark:text-amber-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* + Add Filter Popover Menu (Clean Minimalist Dropdown) */}
        <div className="relative" ref={addFilterRef}>
          <button
            onClick={() => setIsAddFilterOpen(!isAddFilterOpen)}
            className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 flex items-center space-x-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer border border-dashed border-stone-300 dark:border-stone-700 shadow-2xs"
          >
            <Plus className="w-3 h-3 text-stone-500" />
            <span>Add filter</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isAddFilterOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-2 text-xs">
              <div className="flex items-center justify-between px-2 pt-1 pb-0.5 text-stone-400">
                <span className="text-[10px] uppercase tracking-wider font-bold">Filter Options</span>
                <SlidersHorizontal className="w-3 h-3" />
              </div>

              {/* Status options */}
              <div className="space-y-0.5">
                <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 px-2 pt-1 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3 h-3 text-purple-500" />
                  <span>Reading Status</span>
                </div>
                {(['Read', 'Currently Reading', 'TBR', 'DNF'] as BookStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleSelectStatusFilter(st)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      filters.status === st
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{st}</span>
                    {filters.status === st && <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />}
                  </button>
                ))}
              </div>

              {/* Timeframe options */}
              <div className="space-y-0.5 pt-1.5 border-t border-stone-100 dark:border-stone-800">
                <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 px-2 pt-1 flex items-center space-x-1.5">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <span>Finished Timeframe</span>
                </div>
                <button
                  onClick={() => {
                    setFilters({ ...filters, timeframe: 'this_year' });
                    setIsAddFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    filters.timeframe === 'this_year'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>This Year ({currentYear})</span>
                  {filters.timeframe === 'this_year' && <Check className="w-3 h-3 text-blue-500" />}
                </button>
                <button
                  onClick={() => {
                    setFilters({ ...filters, timeframe: 'this_month' });
                    setIsAddFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    filters.timeframe === 'this_month'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>This Month</span>
                  {filters.timeframe === 'this_month' && <Check className="w-3 h-3 text-blue-500" />}
                </button>
              </div>

              {/* Format options */}
              <div className="space-y-0.5 pt-1.5 border-t border-stone-100 dark:border-stone-800">
                <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 px-2 pt-1 flex items-center space-x-1.5">
                  <Bookmark className="w-3 h-3 text-emerald-500" />
                  <span>Edition Format</span>
                </div>
                {(['Physical', 'eReader', 'Audiobook'] as BookFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFilters({ ...filters, format: fmt });
                      setIsAddFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      filters.format === fmt
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{fmt}</span>
                    {filters.format === fmt && <Check className="w-3 h-3 text-emerald-500" />}
                  </button>
                ))}
              </div>

              {/* Rating filter options */}
              <div className="space-y-0.5 pt-1.5 border-t border-stone-100 dark:border-stone-800">
                <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 px-2 pt-1 flex items-center space-x-1.5">
                  <Star className="w-3 h-3 text-amber-500" />
                  <span>Minimum Star Rating</span>
                </div>
                {[5, 4, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setFilters({ ...filters, minRating: num });
                      setIsAddFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      filters.minRating === num
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{num} Stars & above</span>
                    {filters.minRating === num && <Check className="w-3 h-3 text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-[11px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* VIEW 1: NOTION DATABASE LIST VIEW (MATCHING REFERENCE EXACTLY) */}
      {viewMode === 'list' ? (
        <div className={`bg-white dark:bg-stone-900 rounded-xl border ${theme.tableBorder} overflow-x-auto shadow-2xs`}>
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className={`${theme.tableHeader} font-medium border-b ${theme.tableBorder}`}>
              <tr>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <Type className="w-3.5 h-3.5 text-stone-400" />
                    <span>Title</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Author</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                    <span>Status</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Star Rating</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-stone-400" />
                    <span>Total Pages</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <Headphones className="w-3.5 h-3.5 text-stone-400" />
                    <span>Hours (Audio)</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Date Started</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 font-normal">
                  <div className="flex items-center space-x-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-stone-400" />
                    <span>Date Finished</span>
                  </div>
                </th>
                {isAdmin && <th className="py-2.5 px-3 font-normal text-right w-16">Actions</th>}
              </tr>
            </thead>
            <tbody className={`divide-y ${theme.tableBorder} font-sans text-xs`}>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-12 text-center text-stone-400 italic">
                    No books match your current filters.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => {
                  const author = authors.find((a) => a.id === book.author_id)?.name;
                  return (
                    <tr
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className={`${theme.tableRowHover} cursor-pointer transition-colors group`}
                    >
                      {/* Title with open book icon + [OPEN] button on hover */}
                      <td className="py-2.5 px-3 flex items-center justify-between font-serif font-bold text-stone-900 dark:text-stone-100">
                        <div className="flex items-center space-x-2 truncate pr-2">
                          <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{book.title}</span>
                        </div>
                        
                        {/* Notion [OPEN] hover pill */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBook(book);
                          }}
                          className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium text-stone-600 dark:text-stone-300 bg-stone-200/80 dark:bg-stone-700 hover:bg-stone-300 transition-opacity uppercase tracking-wider shrink-0"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>OPEN</span>
                        </button>
                      </td>

                      {/* Author */}
                      <td className="py-2.5 px-3 text-stone-700 dark:text-stone-300">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{author}</span>
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${theme.pillColor}`}>
                          ● {formatBookStatus(book.status, book.star_rating)}
                        </span>
                      </td>

                      {/* Star Rating */}
                      <td className="py-2.5 px-3 font-mono">
                        {book.star_rating > 0 ? (
                          <div className="flex items-center space-x-1 text-amber-500 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span>{book.star_rating}</span>
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      {/* Total Pages */}
                      <td className="py-2.5 px-3 font-mono text-stone-600 dark:text-stone-300">
                        {book.total_pages}
                      </td>

                      {/* Hours (Audio) */}
                      <td className="py-2.5 px-3 font-mono text-stone-400">
                        {book.format === 'Audiobook' ? '10' : ''}
                      </td>

                      {/* Date Started */}
                      <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                        {book.date_started || '—'}
                      </td>

                      {/* Date Finished */}
                      <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                        {book.date_finished || '—'}
                      </td>

                      {/* Admin Delete Action */}
                      {isAdmin && (
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete "${book.title}"?`)) {
                                await deleteBook(book.id);
                              }
                            }}
                            title="Delete Book"
                            className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded transition-all cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}

              {/* + New page row matching screenshot */}
              {isAdmin && (
                <tr
                  onClick={onOpenAddBook}
                  className={`${theme.tableRowHover} cursor-pointer text-stone-400 hover:text-stone-700 dark:hover:text-stone-200`}
                >
                  <td colSpan={isAdmin ? 9 : 8} className="py-2 px-3 flex items-center space-x-1.5 font-sans">
                    <Plus className="w-3.5 h-3.5" />
                    <span>New page</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer Summary Bar */}
          <div className={`p-2.5 ${theme.tableHeader} text-[10px] font-mono text-stone-400 border-t ${theme.tableBorder} flex items-center px-4`}>
            <span>COUNT {count}</span>
          </div>
        </div>
      ) : (
        /* VIEW 2: TILE / CARD GALLERY VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredBooks.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-stone-400 italic">
              No books match your current filters.
            </div>
          ) : (
            filteredBooks.map((book) => {
              const author = authors.find((a) => a.id === book.author_id)?.name;
              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="group flex flex-col cursor-pointer"
                >
                  <div className="aspect-2/3 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-xs border border-stone-200/80 dark:border-stone-700 group-hover:shadow-lg group-hover:-translate-y-1 transition-all relative">
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {book.star_rating > 0 && (
                      <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{book.star_rating}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-xs font-serif font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 truncate">{author}</p>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};

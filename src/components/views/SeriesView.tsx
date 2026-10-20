import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  User,
  Tag,
  Sparkles,
  Plus,
  TrendingUp,
  Kanban,
  Type,
  CircleDot,
  Globe,
  Star,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { SeriesStatus, Book, SeriesItem } from '../../types';
import { SeriesDetailModal } from '../modals/SeriesDetailModal';

interface SeriesViewProps {
  onSelectBook?: (book: Book) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({ onSelectBook }) => {
  const { series, authors, books } = useData();
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'all-series' | 'all-books' | 'board' | 'progress'>('all-series');
  const [selectedSeries, setSelectedSeries] = useState<SeriesItem | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Title */}
      <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-sans font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center space-x-2.5">
          <Layers className="w-7 h-7 text-stone-700 dark:text-stone-200" />
          <span>my series tracker</span>
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Catalog and track reading progression across multi-volume series. Click any series name for overall series reviews.
        </p>
      </div>

      {/* View Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('all-books')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'all-books'
              ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>All Books</span>
        </button>

        <button
          onClick={() => setActiveTab('all-series')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'all-series'
              ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Series</span>
        </button>

        <button
          onClick={() => setActiveTab('board')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'board'
              ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Status Board</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'progress'
              ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Progress View</span>
        </button>
      </div>

      {/* Notion Database Table View */}
      {activeTab === 'all-series' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-medium border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="py-2.5 px-4">
                  <div className="flex items-center space-x-1.5">
                    <Type className="w-3.5 h-3.5 text-stone-400" />
                    <span>Series Name</span>
                  </div>
                </th>
                <th className="py-2.5 px-4">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Author</span>
                  </div>
                </th>
                <th className="py-2.5 px-4">
                  <div className="flex items-center space-x-1.5">
                    <CircleDot className="w-3.5 h-3.5 text-stone-400" />
                    <span>Series Type</span>
                  </div>
                </th>
                <th className="py-2.5 px-4">
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Overall Rating</span>
                  </div>
                </th>
                <th className="py-2.5 px-4">
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                    <span>Books in Series</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {series.map((s) => {
                const author = authors.find((a) => a.id === s.author_id)?.name;
                const seriesBooks = books.filter((b) => b.series_id === s.id);

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors group"
                  >
                    {/* Series Name (Clickable to open Series Review Modal) */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedSeries(s)}
                        className="font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2 text-left cursor-pointer group-hover:text-amber-600 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-stone-400 shrink-0 group-hover:text-amber-500" />
                        <span className="underline decoration-stone-300 dark:decoration-stone-700 underline-offset-4">{s.title}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-stone-700 dark:text-stone-300">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{author}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        {s.total_books === 3 ? 'Trilogy' : `${s.total_books}-Book Cycle`}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-amber-500">
                      <button
                        onClick={() => setSelectedSeries(s)}
                        className="flex items-center space-x-1 cursor-pointer hover:underline"
                      >
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{s.overall_rating ? s.overall_rating.toFixed(1) : '5.0'}</span>
                      </button>
                    </td>

                    {/* Books in Series (Statuses removed as requested!) */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {seriesBooks.length > 0 ? (
                          seriesBooks.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => onSelectBook?.(b)}
                              className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="hover:underline">{b.title}</span>
                            </button>
                          ))
                        ) : (
                          <span className="text-stone-400 italic">Volumes cataloged</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="p-2.5 bg-stone-50 dark:bg-stone-800/40 text-[11px] font-mono text-stone-400 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
            <span>COUNT {series.length} series</span>
            <span className="text-stone-400 text-[10px]">Click series title to read overall review</span>
          </div>
        </div>
      )}

      {/* Board View */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(['Not Started', 'In Progress', 'Caught Up', 'Completed'] as SeriesStatus[]).map((status) => {
            const list = series.filter((s) => s.status === status);
            return (
              <div key={status} className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span>{status}</span>
                  <span className="font-mono text-stone-400">{list.length}</span>
                </div>
                {list.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSeries(s)}
                    className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer group"
                  >
                    <h4 className="font-serif font-bold text-xs group-hover:text-amber-600 transition-colors">{s.title}</h4>
                    <span className="text-[10px] text-stone-500 font-mono block">{s.books_read}/{s.total_books} books read</span>
                    {s.overall_rating && (
                      <div className="flex items-center space-x-1 text-amber-500 text-[10px] font-mono font-semibold">
                        <Star className="w-2.5 h-2.5 fill-amber-500" />
                        <span>{s.overall_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Progress View */}
      {activeTab === 'progress' && (
        <div className="space-y-4">
          {series.map((s) => {
            const pct = Math.round((s.books_read / (s.total_books || 1)) * 100);
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSeries(s)}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 hover:border-amber-400 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="group-hover:text-amber-600 transition-colors">{s.title}</span>
                  <span className="font-mono">{pct}%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'all-books' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {books.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBook?.(b)}
              className="p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="aspect-2/3 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-2">
                <img src={b.cover_image_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
              </div>
              <h4 className="text-xs font-serif font-bold truncate group-hover:text-amber-600 transition-colors">{b.title}</h4>
              <p className="text-[10px] text-stone-500 truncate">{b.format}</p>
            </div>
          ))}
        </div>
      )}

      {/* Series Detail & Review Modal */}
      {selectedSeries && (
        <SeriesDetailModal
          series={selectedSeries}
          onClose={() => setSelectedSeries(null)}
          onSelectBook={(b) => {
            setSelectedSeries(null);
            onSelectBook?.(b);
          }}
        />
      )}

    </div>
  );
};

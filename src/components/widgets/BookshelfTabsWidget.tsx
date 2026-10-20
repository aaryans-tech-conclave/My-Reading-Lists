import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Star, Plus, Minus, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Book } from '../../types';

export const BookshelfTabsWidget: React.FC = () => {
  const { books, authors, updateBook, setSelectedBook } = useData();
  const { isAdmin } = useAuth();
  const { accentClass } = useTheme();

  const [activeTab, setActiveTab] = useState<'currently' | 'read' | 'tbr'>('currently');

  const currentlyReading = books.filter((b) => b.status === 'Currently Reading');
  const read2025 = books
    .filter((b) => b.status === 'Read')
    .sort((a, b) => {
      const dateA = new Date(a.date_finished || '').getTime() || 0;
      const dateB = new Date(b.date_finished || '').getTime() || 0;
      return dateB - dateA;
    });
  const tbrBooks = books.filter((b) => b.status === 'TBR');

  const handlePageUpdate = async (e: React.MouseEvent, book: Book, delta: number) => {
    e.stopPropagation();
    const newPage = Math.min(book.total_pages, Math.max(0, book.pages_read + delta));
    const updates: Partial<Book> = { pages_read: newPage };
    if (newPage >= book.total_pages) {
      updates.status = 'Read';
      updates.date_finished = new Date().toISOString().slice(0, 10);
    }
    await updateBook(book.id, updates);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs mb-8 transition-all">
      
      {/* Widget Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>My Bookshelf</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">Current progress and completed journey</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('currently')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'currently'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            Currently Reading ({currentlyReading.length})
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'read'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            2025 Read ({read2025.length})
          </button>
          <button
            onClick={() => setActiveTab('tbr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tbr'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            TBR ({tbrBooks.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-6">
        
        {/* Currently Reading Tab */}
        {activeTab === 'currently' && (
          <div>
            {currentlyReading.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                You are not currently reading any book. Choose one from TBR to begin!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentlyReading.map((book) => {
                  const author = authors.find((a) => a.id === book.author_id)?.name;
                  const percent = Math.min(100, Math.round((book.pages_read / (book.total_pages || 1)) * 100));

                  return (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/70 flex space-x-4 cursor-pointer group hover:shadow-md transition-all"
                    >
                      <div className="w-20 sm:w-24 h-28 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700">
                        <img
                          src={book.cover_image_url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                              {book.format} Edition
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            by {author}
                          </p>
                        </div>

                        {/* Progress Bar & Counters */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
                            <span className="font-semibold text-stone-800 dark:text-stone-200">
                              {percent}% completed
                            </span>
                            <span className="text-stone-500 dark:text-stone-400">
                              {book.pages_read} / {book.total_pages}p
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          {/* Admin Quick Page Progress Controls */}
                          {isAdmin && (
                            <div className="mt-2.5 flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => handlePageUpdate(e, book, -10)}
                                className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-[10px] font-mono hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                              >
                                -10
                              </button>
                              <button
                                onClick={(e) => handlePageUpdate(e, book, 10)}
                                className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-semibold hover:bg-amber-200 transition-colors"
                              >
                                +10p
                              </button>
                              <button
                                onClick={(e) => handlePageUpdate(e, book, 25)}
                                className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-mono font-semibold hover:bg-amber-600 transition-colors"
                              >
                                +25p
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2025 Read List Tab */}
        {activeTab === 'read' && (
          <div className="space-y-3">
            {read2025.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No books marked as finished in 2025 yet.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {read2025.map((book) => {
                  const author = authors.find((a) => a.id === book.author_id)?.name;
                  return (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className="py-3 px-2 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/40 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-14 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-2xs">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {author} • {book.total_pages} pages
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {book.star_rating > 0 && (
                          <div className="flex items-center space-x-1 text-amber-500 font-mono text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{book.star_rating.toFixed(1)}</span>
                          </div>
                        )}
                        <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                          Finished {book.date_finished || '2025'}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TBR Tab */}
        {activeTab === 'tbr' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {tbrBooks.map((book) => {
              const author = authors.find((a) => a.id === book.author_id)?.name;
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="aspect-2/3 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-xs border border-stone-200/70 dark:border-stone-700 group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="mt-1.5 text-xs font-medium text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
                    {author}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

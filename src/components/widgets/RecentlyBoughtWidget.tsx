import React, { useState } from 'react';
import { ShoppingBag, Maximize2, X, Calendar, ArrowRight, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Book } from '../../types';
import { formatBookStatus } from '../../utils/formatters';

export const RecentlyBoughtWidget: React.FC = () => {
  const { books, authors, setSelectedBook } = useData();
  const { accentClass } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Books with purchase dates or owned, sorted by purchase_date desc
  const boughtBooks = books
    .filter((b) => b.is_owned && b.purchase_date)
    .sort((a, b) => {
      const dateA = new Date(a.purchase_date || '').getTime() || 0;
      const dateB = new Date(b.purchase_date || '').getTime() || 0;
      return dateB - dateA;
    });

  // Top 3 preview items
  const previewBooks = boughtBooks.slice(0, 3);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* Dashboard Preview Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center space-x-2 text-left group cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <span>Recently Bought</span>
                  <span className="text-[11px] font-sans font-normal text-stone-400 dark:text-stone-500">
                    ({boughtBooks.length})
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Chronological acquisitions</p>
              </div>
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              title="Expand to Chronological Timeline"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top 3 Preview Grid */}
          {previewBooks.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400 dark:text-stone-500">
              No recorded purchases yet.
            </div>
          ) : (
            <div className="space-y-2.5 my-2">
              {previewBooks.map((book) => {
                const author = authors.find((a) => a.id === book.author_id)?.name;
                return (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer group border border-transparent hover:border-stone-200/60 dark:hover:border-stone-700/60"
                  >
                    <div className="w-10 h-14 shrink-0 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-2xs">
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                        {author}
                      </p>
                      <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(book.purchase_date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer View All Trigger */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-2 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            {boughtBooks.length > 3 ? `+${boughtBooks.length - 3} more acquired` : 'All acquisitions shown'}
          </span>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Timeline View →
          </button>
        </div>
      </div>

      {/* Expanded Full View: Chronological Timeline */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-3xl max-h-[85vh] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    Acquisition Timeline — Chronological Purchases
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Ordered strictly by purchase date from latest to oldest
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Timeline */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
                {boughtBooks.map((book) => {
                  const author = authors.find((a) => a.id === book.author_id)?.name;
                  return (
                    <div
                      key={book.id}
                      onClick={() => {
                        setIsExpanded(false);
                        setSelectedBook(book);
                      }}
                      className="relative group cursor-pointer"
                    >
                      {/* Node Bullet */}
                      <div className="absolute -left-6 sm:-left-8 top-3 w-4 h-4 rounded-full bg-white dark:bg-stone-900 border-2 border-emerald-500 group-hover:bg-emerald-500 group-hover:scale-125 transition-all shadow-xs" />

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 hover:shadow-md group-hover:border-emerald-300 dark:group-hover:border-emerald-700 transition-all flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-20 shrink-0 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700 shadow-xs">
                            <img
                              src={book.cover_image_url}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold">
                                {formatDate(book.purchase_date)}
                              </span>
                              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                                {book.format} Edition
                              </span>
                            </div>
                            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              by {author}
                            </p>
                            <div className="mt-2 flex items-center space-x-2 text-[10px] text-stone-400">
                              <span>{book.total_pages} pages</span>
                              <span>•</span>
                              <span>Status: {formatBookStatus(book.status, book.star_rating)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-2 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Close Timeline
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

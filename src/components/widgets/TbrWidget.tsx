import React, { useState } from 'react';
import { Clock, Maximize2, X, BookOpen, Star, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Book } from '../../types';

export const TbrWidget: React.FC = () => {
  const { books, authors, setSelectedBook } = useData();
  const { accentClass } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Owned TBR books
  const tbrBooks = books.filter((b) => b.is_owned && b.status === 'TBR');
  
  // Top 3 preview items
  const previewBooks = tbrBooks.slice(0, 3);

  const filteredExpanded = tbrBooks.filter((b) => {
    const author = authors.find((a) => a.id === b.author_id)?.name || '';
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center space-x-1.5">
                  <span>To Be Read (TBR)</span>
                  <span className="text-[11px] font-sans font-normal text-stone-400 dark:text-stone-500">
                    ({tbrBooks.length})
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Owned physical & digital queue</p>
              </div>
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              title="Expand to Full Gallery"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top 3 Preview Grid */}
          {previewBooks.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400 dark:text-stone-500">
              No owned TBR books currently.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 my-2">
              {previewBooks.map((book) => {
                const author = authors.find((a) => a.id === book.author_id)?.name;
                return (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className="group relative cursor-pointer flex flex-col"
                  >
                    <div className="aspect-2/3 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-xs border border-stone-200/60 dark:border-stone-700 group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-1.5 text-[11px] font-medium text-stone-800 dark:text-stone-200 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {book.title}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
                      {author}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer View All Trigger */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-2 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            {tbrBooks.length > 3 ? `+${tbrBooks.length - 3} more in queue` : 'All in queue shown'}
          </span>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>
      </div>

      {/* Expanded Full View Modal / Drawer */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    To Be Read (TBR) — Full Library Gallery
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    All {tbrBooks.length} books you own that are queued up for reading
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Filter by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 w-48 sm:w-64"
                />
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Full Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              {filteredExpanded.length === 0 ? (
                <div className="py-16 text-center text-stone-400 dark:text-stone-500 text-sm">
                  No TBR books found matching your query.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {filteredExpanded.map((book) => {
                    const author = authors.find((a) => a.id === book.author_id)?.name;
                    return (
                      <div
                        key={book.id}
                        onClick={() => {
                          setIsExpanded(false);
                          setSelectedBook(book);
                        }}
                        className="group flex flex-col cursor-pointer"
                      >
                        <div className="aspect-2/3 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-sm border border-stone-200/80 dark:border-stone-700 group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all relative">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                            {book.total_pages}p
                          </div>
                        </div>
                        <h4 className="mt-2 text-xs font-serif font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                          {author}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {book.genre_tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-1.5 py-0.5 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-500">
              <span>Click any book to read notes or edit ratings</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Close Gallery
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

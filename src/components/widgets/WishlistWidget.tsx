import React, { useState } from 'react';
import { Bookmark, Maximize2, X, ShoppingCart, Check, Plus, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import confetti from 'canvas-confetti';

export const WishlistWidget: React.FC = () => {
  const { books, authors, markAsBought, setSelectedBook } = useData();
  const { isAdmin } = useAuth();
  const { accentClass } = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [buyingId, setBuyingId] = useState<string | null>(null);

  // Unowned books
  const wishlistBooks = books.filter((b) => !b.is_owned);

  // Top 3 preview items
  const previewBooks = wishlistBooks.slice(0, 3);

  const filteredExpanded = wishlistBooks.filter((b) => {
    const author = authors.find((a) => a.id === b.author_id)?.name || '';
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleMarkBought = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    setBuyingId(bookId);
    try {
      await markAsBought(bookId);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Failed to mark as bought', err);
    } finally {
      setBuyingId(null);
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
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex items-center space-x-1.5">
                  <span>Wishlist</span>
                  <span className="text-[11px] font-sans font-normal text-stone-400 dark:text-stone-500">
                    ({wishlistBooks.length})
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Wanted books to acquire</p>
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
              No wishlist items currently.
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
                    <div className="aspect-2/3 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-xs border border-stone-200/60 dark:border-stone-700 group-hover:shadow-md group-hover:-translate-y-1 transition-all relative">
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover filter saturate-[0.85]"
                        loading="lazy"
                      />
                      <div className="absolute top-1 left-1 bg-rose-600/90 text-white text-[9px] px-1 rounded-sm font-semibold">
                        Wish
                      </div>
                    </div>
                    <span className="mt-1.5 text-[11px] font-medium text-stone-800 dark:text-stone-200 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
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
            {wishlistBooks.length > 3 ? `+${wishlistBooks.length - 3} more wanted` : 'All wanted books shown'}
          </span>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
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
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    Wishlist — Full Book Directory
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {wishlistBooks.length} titles you want to acquire or read next
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Filter wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500 w-48 sm:w-64"
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
                  No wishlist books found.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {filteredExpanded.map((book) => {
                    const author = authors.find((a) => a.id === book.author_id)?.name;
                    return (
                      <div
                        key={book.id}
                        className="group flex flex-col justify-between p-2 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 transition-all hover:shadow-md"
                      >
                        <div
                          onClick={() => {
                            setIsExpanded(false);
                            setSelectedBook(book);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="aspect-2/3 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-xs border border-stone-200/80 dark:border-stone-700 group-hover:-translate-y-1 transition-transform relative">
                            <img
                              src={book.cover_image_url}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-semibold shadow-xs">
                              Unowned
                            </div>
                          </div>
                          <h4 className="mt-2 text-xs font-serif font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                            {author}
                          </p>
                        </div>

                        {/* Admin "Mark as Bought" Action Button */}
                        {isAdmin && (
                          <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                            <button
                              onClick={(e) => handleMarkBought(e, book.id)}
                              disabled={buyingId === book.id}
                              className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 shadow-xs transition-colors cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>{buyingId === book.id ? 'Moving...' : 'Mark as Bought'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-500">
              <span>{isAdmin ? 'Admin: Click "Mark as Bought" to transfer directly to TBR & Recently Bought' : 'Curated wish list'}</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Close Wishlist
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

import React, { useState } from 'react';
import { Bookmark, Check, Plus, Search, Grid, List as ListIcon, Star } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Book } from '../../types';
import confetti from 'canvas-confetti';

interface WishlistViewProps {
  onSelectBook: (book: Book) => void;
  onOpenAddBook: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onSelectBook, onOpenAddBook }) => {
  const { books, authors, markAsBought } = useData();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const wishlistBooks = books
    .filter((b) => !b.is_owned)
    .filter((b) => {
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
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800 gap-3">
        <div>
          <h1 className="text-3xl font-sans font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2.5">
            <Bookmark className="w-7 h-7 text-stone-700 dark:text-stone-200" />
            <span>wishlist</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {wishlistBooks.length} titles you want to acquire or read next
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAddBook}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            + New Wanted Book
          </button>
        )}
      </div>

      {/* Search */}
      <div className="w-full sm:w-72">
        <input
          type="text"
          placeholder="Filter wishlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {wishlistBooks.map((book) => {
          const author = authors.find((a) => a.id === book.author_id)?.name;
          return (
            <div
              key={book.id}
              className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div onClick={() => onSelectBook(book)} className="cursor-pointer">
                <div className="aspect-2/3 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-2 border border-stone-200 dark:border-stone-700 relative">
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-semibold">
                    Unowned
                  </div>
                </div>
                <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 truncate hover:text-amber-600 transition-colors">
                  {book.title}
                </h4>
                <p className="text-[11px] text-stone-500 truncate">{author}</p>
              </div>

              {/* Admin Mark as Bought Button */}
              {isAdmin && (
                <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
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

    </div>
  );
};

import React, { useState } from 'react';
import { ShoppingBag, Calendar, Star, BookOpen, ArrowUpDown, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Book } from '../../types';
import { formatBookStatus } from '../../utils/formatters';

interface RecentlyBoughtViewProps {
  onSelectBook: (book: Book) => void;
}

export const RecentlyBoughtView: React.FC<RecentlyBoughtViewProps> = ({ onSelectBook }) => {
  const { books, authors } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Books acquired, sorted by purchase date descending
  const boughtBooks = books
    .filter((b) => b.is_owned && b.purchase_date)
    .filter((b) => {
      const author = authors.find((a) => a.id === b.author_id)?.name || '';
      return (
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.purchase_date || '').getTime() || 0;
      const dateB = new Date(b.purchase_date || '').getTime() || 0;
      return dateB - dateA;
    });

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
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800 gap-3">
        <div>
          <h1 className="text-3xl font-sans font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2.5">
            <ShoppingBag className="w-7 h-7 text-stone-700 dark:text-stone-200" />
            <span>recently bought</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Chronological log of all purchased and acquired volumes (latest to oldest)
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search acquisitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Chronological Timeline / List */}
      <div className="space-y-3">
        {boughtBooks.length === 0 ? (
          <div className="py-20 text-center text-xs text-stone-400">
            No acquired book purchases recorded yet.
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden shadow-2xs">
            {boughtBooks.map((book) => {
              const author = authors.find((a) => a.id === book.author_id)?.name;
              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 shadow-2xs border border-stone-200 dark:border-stone-700">
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-0.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                          {formatDate(book.purchase_date)}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {book.format}
                        </span>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        by {author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    {book.star_rating > 0 && (
                      <div className="flex items-center space-x-1 text-amber-500 font-mono text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{book.star_rating.toFixed(1)}</span>
                      </div>
                    )}
                    <span className="text-xs font-mono text-stone-400 hidden sm:inline">
                      {book.total_pages}p
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {book.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

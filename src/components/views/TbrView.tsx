import React, { useState } from 'react';
import { Clock, Search, Grid, List as ListIcon, Star, BookOpen, Plus, BookMarked } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Book } from '../../types';

interface TbrViewProps {
  onSelectBook: (book: Book) => void;
  onOpenAddBook: () => void;
}

export const TbrView: React.FC<TbrViewProps> = ({ onSelectBook, onOpenAddBook }) => {
  const { books, authors } = useData();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tbrBooks = books
    .filter((b) => b.is_owned && b.status === 'TBR')
    .filter((b) => {
      const author = authors.find((a) => a.id === b.author_id)?.name || '';
      return (
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800 gap-3">
        <div>
          <h1 className="text-3xl font-sans font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2.5">
            <BookMarked className="w-7 h-7 text-stone-700 dark:text-stone-200" />
            <span>to be read (tbr)</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {tbrBooks.length} owned titles in your personal reading queue
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <button
              onClick={onOpenAddBook}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              + New Book
            </button>
          )}

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-400'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="w-full sm:w-72">
        <input
          type="text"
          placeholder="Filter TBR books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {tbrBooks.map((book) => {
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
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                    {book.total_pages}p
                  </div>
                </div>
                <h3 className="mt-2 text-xs font-serif font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  {author}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs divide-y divide-stone-100 dark:divide-stone-800">
          {tbrBooks.map((book) => {
            const author = authors.find((a) => a.id === book.author_id)?.name;
            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="p-3.5 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-14 rounded overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
                    <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-stone-500">{author}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-stone-400">{book.total_pages} pages</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

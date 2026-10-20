import React, { useState, useMemo } from 'react';
import { Tag, BookOpen, Star, Sparkles, Filter, Layers, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Book } from '../../types';

interface GenresViewProps {
  onSelectBook: (book: Book) => void;
}

export const GenresView: React.FC<GenresViewProps> = ({ onSelectBook }) => {
  const { books, authors } = useData();
  const { theme } = useTheme();

  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  // Extract all distinct genres across library books
  const genreStats = useMemo(() => {
    const counts = new Map<string, number>();
    books.forEach((b) => {
      b.genre_tags.forEach((tag) => {
        const cleaned = tag.trim();
        if (cleaned) {
          counts.set(cleaned, (counts.get(cleaned) || 0) + 1);
        }
      });
    });

    // Sort genres alphabetically
    const sorted = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return sorted;
  }, [books]);

  // Group books by genre for the "all" view
  const booksByGenre = useMemo(() => {
    const map = new Map<string, Book[]>();
    genreStats.forEach(({ name }) => {
      map.set(name, []);
    });

    books.forEach((book) => {
      book.genre_tags.forEach((tag) => {
        const list = map.get(tag.trim());
        if (list && !list.some((b) => b.id === book.id)) {
          list.push(book);
        }
      });
    });

    return map;
  }, [books, genreStats]);

  // Books filtered by the selected genre
  const filteredBooks = useMemo(() => {
    if (selectedGenre === 'all') return books;
    return books.filter((b) => b.genre_tags.some((t) => t.toLowerCase() === selectedGenre.toLowerCase()));
  }, [books, selectedGenre]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Title & Header */}
      <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-sans font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2.5">
          <Tag className="w-7 h-7 text-stone-700 dark:text-stone-200" />
          <span>my genres</span>
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Cataloged literature categorized by literary taxonomy, themes, and motifs
        </p>
      </div>

      {/* Top Filter Chips: All genres presented up top */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center space-x-1.5">
            <Filter className="w-3 h-3" />
            <span>Select Genre Filter</span>
          </span>
          <span className="text-[11px] font-mono text-stone-400">
            {genreStats.length} genres read
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {/* "All Genres" Chip */}
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 border ${
              selectedGenre === 'all'
                ? `${theme.sidebarActive} shadow-xs`
                : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>All Genres</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/15 font-mono">
              {books.length}
            </span>
          </button>

          {/* Individual Genre Chips */}
          {genreStats.map((g) => {
            const isSelected = selectedGenre === g.name;
            return (
              <button
                key={g.name}
                onClick={() => setSelectedGenre(isSelected ? 'all' : g.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 border ${
                  isSelected
                    ? `${theme.sidebarActive} shadow-xs`
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Tag className="w-3 h-3 opacity-60" />
                <span>{g.name}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/15 font-mono">
                  {g.count}
                </span>
                {isSelected && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Area */}
      {selectedGenre !== 'all' ? (
        /* Single Genre Tile View */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <span className="text-amber-500">●</span>
              <span>{selectedGenre}</span>
              <span className="text-xs font-mono font-normal text-stone-400">({filteredBooks.length} books)</span>
            </h2>
            <button
              onClick={() => setSelectedGenre('all')}
              className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline cursor-pointer"
            >
              Show all genre groups
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBooks.map((book) => {
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
            })}
          </div>
        </div>
      ) : (
        /* All Genre Groups / Grounds View */
        <div className="space-y-8">
          {genreStats.map(({ name, count }) => {
            const genreBooks = booksByGenre.get(name) || [];
            if (genreBooks.length === 0) return null;

            return (
              <div
                key={name}
                className="bg-white/80 dark:bg-stone-900/80 p-5 rounded-3xl border border-stone-200/70 dark:border-stone-800 shadow-2xs space-y-4"
              >
                {/* Genre Group Title */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {name}
                    </h2>
                    <span className="text-[11px] font-mono text-stone-400">
                      • {count} title{count > 1 ? 's' : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedGenre(name)}
                    className="text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
                  >
                    Filter this genre →
                  </button>
                </div>

                {/* Small squares / tiles grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {genreBooks.map((book) => {
                    const author = authors.find((a) => a.id === book.author_id)?.name;
                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelectBook(book)}
                        className="group flex flex-col cursor-pointer"
                      >
                        <div className="aspect-2/3 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-2xs border border-stone-200 dark:border-stone-700 group-hover:scale-103 group-hover:shadow-md transition-all relative">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {book.star_rating > 0 && (
                            <div className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-amber-400 text-[9px] font-mono px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              <span>{book.star_rating}</span>
                            </div>
                          )}
                        </div>
                        <h4 className="mt-1.5 text-[11px] font-serif font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-[10px] text-stone-500 truncate">{author}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

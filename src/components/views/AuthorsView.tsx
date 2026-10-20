import React, { useState } from 'react';
import { Users, Heart, BookOpen, Globe, Sparkles, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Author, Book } from '../../types';
import { formatBookStatus } from '../../utils/formatters';

interface AuthorsViewProps {
  onSelectBook: (book: Book) => void;
  filteredAuthorId?: string;
}

export const AuthorsView: React.FC<AuthorsViewProps> = ({ onSelectBook, filteredAuthorId }) => {
  const { authors, books } = useData();
  const { isAdmin } = useAuth();
  const { accentClass } = useTheme();

  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(filteredAuthorId || null);

  const displayedAuthors = selectedAuthorId
    ? authors.filter((a) => a.id === selectedAuthorId)
    : authors;

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800 gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span>My Authors & Literary Voices</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Gallery of authors with linked library titles and biographies
          </p>
        </div>

        {selectedAuthorId && (
          <button
            onClick={() => setSelectedAuthorId(null)}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            ← View All Authors
          </button>
        )}
      </div>

      {/* Authors Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedAuthors.map((author) => {
          const authorBooks = books.filter((b) => b.author_id === author.id);

          return (
            <div
              key={author.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Author Avatar & Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700 shadow-xs">
                    {author.cover_image_url ? (
                      <img
                        src={author.cover_image_url}
                        alt={author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif font-bold text-xl text-stone-400">
                        {author.name[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                        {author.name}
                      </h3>
                      {author.is_favorite && (
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      <span>{author.nationality}</span>
                      <span>•</span>
                      <span>{author.pronouns}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {author.bio && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 mb-4 font-sans">
                    {author.bio}
                  </p>
                )}

                {/* Linked Books in Library */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    In Library ({authorBooks.length})
                  </span>

                  <div className="space-y-1.5">
                    {authorBooks.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => onSelectBook(b)}
                        className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0 group-hover:text-amber-500" />
                          <span className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            {b.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                          {formatBookStatus(b.status, b.star_rating)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                <span>Total pages: {authorBooks.reduce((acc, b) => acc + b.total_pages, 0)}</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">Author profile</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Star,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Save,
  Quote,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Book, BookStatus } from '../../types';
import { formatBookStatus } from '../../utils/formatters';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onSelectAuthor?: (authorId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onSelectAuthor,
}) => {
  const { authors, updateBook, deleteBook } = useData();
  const { isAdmin } = useAuth();
  const { accentClass } = useTheme();

  const author = authors.find((a) => a.id === book.author_id);

  // Editing state
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewText, setReviewText] = useState(book.long_text_review || '');
  const [starRating, setStarRating] = useState(book.star_rating || 0);
  const [status, setStatus] = useState<BookStatus>(book.status);
  const [pagesRead, setPagesRead] = useState(book.pages_read || 0);
  const [isSaving, setIsSaving] = useState(false);

  // Star Rating Interactive Component (Allows half-stars)
  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((starNum) => {
          const filled = starRating >= starNum;
          const halfFilled = !filled && starRating >= starNum - 0.5;

          return (
            <button
              key={starNum}
              type="button"
              disabled={!isAdmin}
              onClick={() => {
                if (!isAdmin) return;
                // If clicked exact same, cycle: full -> half -> 0
                if (starRating === starNum) {
                  setStarRating(starNum - 0.5);
                } else if (starRating === starNum - 0.5) {
                  setStarRating(starNum - 1);
                } else {
                  setStarRating(starNum);
                }
              }}
              title={isAdmin ? `Set rating to ${starNum} or half-click for ${starNum - 0.5}` : `${book.star_rating} Stars`}
              className={`p-0.5 rounded transition-transform ${
                isAdmin ? 'cursor-pointer hover:scale-115' : 'cursor-default'
              }`}
            >
              <Star
                className={`w-5 h-5 ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : halfFilled
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-stone-300 dark:text-stone-700'
                }`}
              />
            </button>
          );
        })}
        <span className="ml-2 font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">
          {starRating > 0 ? starRating.toFixed(1) : 'Unrated'}
        </span>
      </div>
    );
  };

  // Quick Markdown formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('review-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = reviewText.substring(start, end);
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = reviewText.substring(0, start) + replacement + reviewText.substring(end);
    setReviewText(newText);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBook(book.id, {
        long_text_review: reviewText,
        star_rating: starRating,
        status,
        pages_read: pagesRead,
      });
      setIsEditingReview(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      await deleteBook(book.id);
      onClose();
    }
  };

  // Convert markdown-like headers, quotes and lists for public view
  const renderFormattedReview = (text: string) => {
    if (!text.trim()) {
      return (
        <div className="py-12 text-center text-stone-400 dark:text-stone-500 italic text-sm">
          No written review recorded yet for this title.
        </div>
      );
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-3.5 text-stone-800 dark:text-stone-200 leading-relaxed font-sans text-sm sm:text-base">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-5 mb-2 pb-1 border-b border-stone-200 dark:border-stone-800">
                {line.slice(2)}
              </h1>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-4 mb-2">
                {line.slice(3)}
              </h2>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mt-3 mb-1">
                {line.slice(4)}
              </h3>
            );
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="p-4 my-3 bg-amber-50/70 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-r-2xl font-serif italic text-stone-800 dark:text-stone-200">
                "{line.slice(2).replace(/^"/, '').replace(/"$/, '')}"
              </blockquote>
            );
          }
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
              <li key={idx} className="ml-5 list-disc text-stone-700 dark:text-stone-300">
                {line.slice(2)}
              </li>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="ml-5 font-medium text-stone-800 dark:text-stone-200">
                {line}
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono">
              {book.format} Edition
            </span>
            {book.is_owned && (
              <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Owned
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && !isEditingReview && (
              <button
                onClick={() => setIsEditingReview(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Review & Rating</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={handleDelete}
                title="Delete Book"
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">
          
          {/* Top Meta Section */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            
            {/* Book Cover */}
            <div className="w-36 sm:w-48 aspect-2/3 shrink-0 rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700">
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Meta Information Details */}
            <div className="flex-1 space-y-3.5 min-w-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                  {book.title}
                </h1>

                {/* Hyperlinked Author */}
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-sm text-stone-500 dark:text-stone-400">Written by</span>
                  <button
                    onClick={() => {
                      if (onSelectAuthor && author) {
                        onClose();
                        onSelectAuthor(author.id);
                      }
                    }}
                    className="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <span>{author?.name || 'Unknown Author'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Star Rating Component */}
              <div className="pt-1">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                  Star Rating
                </span>
                {renderInteractiveStars()}
              </div>

              {/* Status and Progress Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Status</span>
                  {isAdmin ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as BookStatus)}
                      className="mt-1 bg-transparent text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Currently Reading">Currently Reading</option>
                      <option value="Read">Read</option>
                      <option value="TBR">TBR</option>
                      <option value="DNF">DNF</option>
                    </select>
                  ) : (
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      {formatBookStatus(book.status, book.star_rating)}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Pages</span>
                  {isAdmin ? (
                    <div className="flex items-center space-x-1 mt-1 font-mono text-xs font-bold">
                      <input
                        type="number"
                        min="0"
                        max={book.total_pages}
                        value={pagesRead}
                        onChange={(e) => setPagesRead(Number(e.target.value))}
                        className="w-14 bg-white dark:bg-stone-700 px-1 py-0.5 rounded border border-stone-300"
                      />
                      <span className="text-stone-400">/ {book.total_pages}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-stone-800 dark:text-stone-200">
                      {book.pages_read} / {book.total_pages} ({Math.round((book.pages_read / (book.total_pages || 1)) * 100)}%)
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Finished Date</span>
                  <span className="text-xs font-mono font-semibold text-stone-800 dark:text-stone-200">
                    {book.date_finished || 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {book.genre_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dedicated Long-Form Review Section */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>The Long-Form Review & Reading Notes</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Reflections, favorite passages, and literary critique
                </p>
              </div>

              {isAdmin && isEditingReview && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white ${accentClass.bg} shadow-sm hover:opacity-95 transition-all cursor-pointer`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Review'}</span>
                </button>
              )}
            </div>

            {/* WYSIWYG / Markdown Editor (Admin) vs Rendered View (Public) */}
            {isAdmin && isEditingReview ? (
              <div className="space-y-2">
                {/* Formatting Toolbar */}
                <div className="flex items-center space-x-1 p-2 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                  <button
                    type="button"
                    onClick={() => insertFormatting('# ')}
                    className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                    title="Heading 1"
                  >
                    <Heading1 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('## ')}
                    className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                    title="Heading 2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                    title="Quote Block"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('* ')}
                    className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  id="review-textarea"
                  rows={14}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your long-form review here. Use # for headers, > for quotes, * for bullets..."
                  className="w-full p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-serif text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ) : (
              <div className="bg-stone-50 dark:bg-stone-950/60 p-6 rounded-2xl border border-stone-200/70 dark:border-stone-800">
                {renderFormattedReview(book.long_text_review)}
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-500">
          <span>{isAdmin ? 'Admin Mode: All changes saved directly to Firebase' : "Aaryan's Public Portfolio"}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

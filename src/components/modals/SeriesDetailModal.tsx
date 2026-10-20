import React, { useState } from 'react';
import {
  X,
  Star,
  Layers,
  User,
  BookOpen,
  Edit3,
  Check,
  Globe,
  Tag,
  Sparkles,
} from 'lucide-react';
import { SeriesItem, Book } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SeriesDetailModalProps {
  series: SeriesItem;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export const SeriesDetailModal: React.FC<SeriesDetailModalProps> = ({
  series,
  onClose,
  onSelectBook,
}) => {
  const { authors, books, updateSeriesReview } = useData();
  const { isAdmin } = useAuth();
  const { theme } = useTheme();

  const author = authors.find((a) => a.id === series.author_id)?.name || 'Unknown Author';
  const seriesBooks = books.filter((b) => b.series_id === series.id);

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(series.overall_rating || 5.0);
  const [review, setReview] = useState(
    series.overall_review ||
      `### Overall Series Reflections on ${series.title}\n\nA magnificent series traversing expansive themes and unforgettable character journeys.`
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSeriesReview(series.id, rating, review);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag & Title */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
          <Layers className="w-4 h-4" />
          <span className="uppercase tracking-wider font-mono text-[11px]">Series Overall Review</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {series.title}
            </h2>
            <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>{author}</span>
              <span>•</span>
              <span className="font-mono">{series.total_books} Books</span>
              <span>•</span>
              <span className="font-mono">{series.books_read} Read</span>
            </div>
          </div>

          {/* Overall Rating Display */}
          <div className="flex flex-col items-start sm:items-end">
            <div className="flex items-center space-x-1.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
              ))}
              <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 font-mono">
              Series Rating
            </span>
          </div>
        </div>

        {/* Curator Edit Trigger */}
        {isAdmin && !isEditing && (
          <div className="my-3 flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-500" />
              <span>Edit Series Review</span>
            </button>
          </div>
        )}

        {/* Curator Editing Form */}
        {isEditing ? (
          <div className="my-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Series Overall Star Rating (0 to 5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Overall Series Review / Reflections
              </label>
              <textarea
                rows={6}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs leading-relaxed font-sans"
              />
            </div>

            <div className="flex items-center space-x-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Review'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Rendered Overall Review */
          <div className="my-5 prose prose-stone dark:prose-invert max-w-none text-xs leading-relaxed space-y-2 whitespace-pre-wrap text-stone-700 dark:text-stone-300">
            {review}
          </div>
        )}

        {/* Books within this Series Section */}
        <div className="pt-5 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Books in this Series ({seriesBooks.length})</span>
            </h3>
            <span className="text-[11px] text-stone-400">
              Click any volume to open its individual review
            </span>
          </div>

          {seriesBooks.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-3">
              No individual book volumes linked to this series yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seriesBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => {
                    onClose();
                    onSelectBook(book);
                  }}
                  className="flex items-center space-x-3 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700 shrink-0 shadow-2xs border border-stone-300 dark:border-stone-600">
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {book.total_pages} pages • {book.format}
                    </p>
                    <div className="flex items-center space-x-1 text-amber-500 text-[10px] font-mono mt-1 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{book.star_rating > 0 ? book.star_rating.toFixed(1) : 'Unrated'}</span>
                      <span className="text-stone-400 ml-auto group-hover:text-stone-700 dark:group-hover:text-stone-300 font-sans text-[10px]">
                        Read review →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

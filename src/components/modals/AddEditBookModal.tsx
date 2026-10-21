import React, { useState } from 'react';
import { X, Plus, BookPlus, Palette } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Book, BookFormat, BookStatus } from '../../types';

interface AddEditBookModalProps {
  onClose: () => void;
  initialBook?: Book;
}

const PRESET_SPINE_COLORS = [
  '#1e293b', // Navy Slate
  '#831843', // Crimson Burgundy
  '#166534', // Forest Emerald
  '#854d0e', // Amber Ochre
  '#4c1d95', // Royal Plum
  '#0f766e', // Deep Teal
  '#3f3f46', // Charcoal
  '#b45309', // Terracotta
];

export const AddEditBookModal: React.FC<AddEditBookModalProps> = ({ onClose, initialBook }) => {
  const { authors, series, addBook, updateBook, addSeries } = useData();
  const { accentClass } = useTheme();

  const [title, setTitle] = useState(initialBook?.title || '');
  const [authorId, setAuthorId] = useState(initialBook?.author_id || authors[0]?.id || '');
  const [seriesId, setSeriesId] = useState(initialBook?.series_id || '');
  const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState(
    initialBook?.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'
  );
  const [status, setStatus] = useState<BookStatus>(initialBook?.status || 'Currently Reading');
  const [format, setFormat] = useState<BookFormat>(initialBook?.format || 'Physical');
  const [isOwned, setIsOwned] = useState<boolean>(initialBook !== undefined ? initialBook.is_owned : true);
  const [purchaseDate, setPurchaseDate] = useState(initialBook?.purchase_date || new Date().toISOString().slice(0, 10));
  const [totalPages, setTotalPages] = useState<number>(initialBook?.total_pages || 350);
  const [pagesRead, setPagesRead] = useState<number>(initialBook?.pages_read || 0);
  const [starRating, setStarRating] = useState<number>(initialBook?.star_rating || 0);
  const [genreTagsInput, setGenreTagsInput] = useState(initialBook?.genre_tags.join(', ') || 'Literary Fiction, Mystery');
  const [spineColor, setSpineColor] = useState(initialBook?.spine_color || '#1e293b');
  const [longTextReview, setLongTextReview] = useState(initialBook?.long_text_review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorId) return;

    setIsSubmitting(true);
    const tags = genreTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .slice(0, 8);

    try {
      let resolvedSeriesId = seriesId;
      if (isCreatingNewSeries && newSeriesTitle.trim()) {
        resolvedSeriesId = await addSeries({
          title: newSeriesTitle.trim(),
          author_id: authorId,
          status: status === 'Read' ? 'In Progress' : 'Not Started',
          total_books: 3,
          books_read: status === 'Read' ? 1 : 0,
          overall_rating: starRating > 0 ? starRating : 5.0,
          overall_review: `### Overall Series Reflections on ${newSeriesTitle.trim()}\n\nA magnificent series traversing expansive themes and unforgettable character journeys.`,
        });
      }

      const payload: Omit<Book, 'id'> = {
        title: title.trim(),
        author_id: authorId,
        series_id: resolvedSeriesId || undefined,
        cover_image_url: coverUrl.trim(),
        status,
        format,
        is_owned: isOwned,
        purchase_date: isOwned ? purchaseDate : undefined,
        total_pages: Number(totalPages) || 300,
        pages_read: Number(pagesRead) || 0,
        star_rating: Number(starRating) || 0,
        genre_tags: tags,
        spine_color: spineColor,
        spine_accent: '#fbbf24',
        long_text_review: longTextReview,
      };

      if (initialBook) {
        await updateBook(initialBook.id, payload);
      } else {
        await addBook(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                {initialBook ? 'Edit Book Details' : 'Add New Book to Portfolio'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Curate library catalog and digital bookcase</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Secret History"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-serif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Author *</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-stone-700 dark:text-stone-300">Series (Optional)</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNewSeries(!isCreatingNewSeries);
                    setSeriesId('');
                  }}
                  className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  {isCreatingNewSeries ? 'Choose Existing Series' : '+ Create New Series'}
                </button>
              </div>
              {isCreatingNewSeries ? (
                <input
                  type="text"
                  placeholder="Enter new series title..."
                  value={newSeriesTitle}
                  onChange={(e) => setNewSeriesTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-serif"
                />
              ) : (
                <select
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">None (Standalone)</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full px-2.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100"
              >
                <option value="Currently Reading">Currently Reading</option>
                <option value="TBR">TBR</option>
                <option value="Read">Read</option>
                <option value="DNF">DNF</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as BookFormat)}
                className="w-full px-2.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100"
              >
                <option value="Physical">Physical</option>
                <option value="eReader">eReader</option>
                <option value="Audiobook">Audiobook</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Total Pages</label>
              <input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Pages Read</label>
              <input
                type="number"
                min="0"
                max={totalPages}
                value={pagesRead}
                onChange={(e) => setPagesRead(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>
          </div>

          {/* Ownership & Purchase Date */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100">Ownership Status</span>
                <p className="text-[11px] text-stone-500">Uncheck to mark as Wishlist item instead of owned</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOwned}
                  onChange={(e) => setIsOwned(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {isOwned && (
              <div>
                <label className="block font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Purchase / Acquisition Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-mono"
                />
              </div>
            )}
          </div>

          {/* Digital Bookcase Spine Color */}
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1.5 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Digital Bookcase Spine Color</span>
            </label>
            <div className="flex items-center space-x-2">
              {PRESET_SPINE_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setSpineColor(hex)}
                  style={{ backgroundColor: hex }}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    spineColor === hex ? 'ring-2 ring-amber-500 scale-110 shadow-xs' : 'opacity-85'
                  }`}
                />
              ))}
              <input
                type="color"
                value={spineColor}
                onChange={(e) => setSpineColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Cover Image URL</label>
            <input
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Genre Tags (comma-separated)</label>
            <input
              type="text"
              value={genreTagsInput}
              onChange={(e) => setGenreTagsInput(e.target.value)}
              placeholder="Sci-Fi, Classics, Philosophy"
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Initial Review / Reading Notes</label>
            <textarea
              rows={4}
              value={longTextReview}
              onChange={(e) => setLongTextReview(e.target.value)}
              placeholder="Write preliminary impressions or leave blank to write later..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-serif"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium hover:bg-stone-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-xl text-white font-semibold ${accentClass.bg} shadow-xs hover:opacity-95 transition-opacity cursor-pointer`}
            >
              {isSubmitting ? 'Saving...' : initialBook ? 'Save Changes' : 'Add to Collection'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

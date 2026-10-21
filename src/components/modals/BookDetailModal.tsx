import React, { useState, useMemo } from 'react';
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
  Tag,
  Plus,
  Check,
  Layers,
  ArrowRight,
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
  onSelectSeries?: (seriesId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onSelectAuthor,
  onSelectSeries,
}) => {
  const { authors, books, series, updateBook, deleteBook } = useData();
  const { isAdmin } = useAuth();
  const { accentClass } = useTheme();

  const author = authors.find((a) => a.id === book.author_id);

  // Editing state
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewText, setReviewText] = useState(book.long_text_review || '');
  const [starRating, setStarRating] = useState(book.star_rating || 0);
  const [status, setStatus] = useState<BookStatus>(book.status);
  const [pagesRead, setPagesRead] = useState(book.pages_read || 0);
  const [genreTags, setGenreTags] = useState<string[]>(book.genre_tags || []);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRatingSaved, setIsRatingSaved] = useState(false);

  // Derive all available genres across the library
  const availableGenres = useMemo(() => {
    const defaults = [
      'Fantasy', 'Sci-Fi', 'Literary Fiction', 'Mystery', 'Thriller',
      'Historical Fiction', 'Romance', 'Non-Fiction', 'Memoir', 'Biography',
      'Horror', 'Classics', 'Dystopian', 'Magical Realism', 'Graphic Novel',
      'Philosophy', 'Young Adult', 'Mythology'
    ];
    const set = new Set<string>(defaults);
    books.forEach((b) => {
      b.genre_tags?.forEach((t) => {
        const cleaned = t.trim();
        if (cleaned) set.add(cleaned);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [books]);

  // Quick save rating button for curator (even if text review hasn't been changed)
  const handleQuickSaveRating = async () => {
    setIsSaving(true);
    try {
      const updates: Partial<Book> = { star_rating: starRating };
      if (book.status === 'TBR' && starRating > 0) {
        updates.status = 'Read';
        setStatus('Read');
      }
      await updateBook(book.id, updates);
      setIsRatingSaved(true);
      setTimeout(() => setIsRatingSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Star Rating Interactive Component (Allows half-stars)
  const renderInteractiveStars = () => {
    return (
      <div className="flex flex-wrap items-center gap-2">
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

        {/* Dedicated Save Rating Button if rating has changed without needing text review edit */}
        {isAdmin && (starRating !== (book.star_rating || 0) || ((book.star_rating || 0) === 0 && starRating > 0)) && (
          <button
            type="button"
            onClick={handleQuickSaveRating}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer animate-in fade-in ring-2 ring-amber-400/40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : `Save Rating (${starRating.toFixed(1)} ★)`}</span>
          </button>
        )}

        {isAdmin && (book.star_rating || 0) === 0 && starRating === 0 && (
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium italic">
            Click stars to rate & save
          </span>
        )}

        {isRatingSaved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Rating Saved!</span>
          </span>
        )}
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
        genre_tags: genreTags,
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
                      {book.status}
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
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {genreTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {isAdmin && !isEditingReview && (
                  <button
                    type="button"
                    onClick={() => setIsEditingReview(true)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-amber-600" />
                    <span>Edit Tags</span>
                  </button>
                )}
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
                  <span>{isSaving ? 'Saving...' : 'Save Review & Tags'}</span>
                </button>
              )}
            </div>

            {/* WYSIWYG / Markdown Editor (Admin) vs Rendered View (Public) */}
            {isAdmin && isEditingReview ? (
              <div className="space-y-4">
                {/* Genre Tags Editor: Choose as many available genres as desired */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        Edit Genre Tags ({genreTags.length} selected)
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Click any genre to toggle
                    </span>
                  </div>

                  {/* Active Selected Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {genreTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-medium shadow-2xs"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => setGenreTags(genreTags.filter((t) => t !== tag))}
                          className="hover:text-amber-200 cursor-pointer ml-1 p-0.5"
                          title={`Remove ${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {genreTags.length === 0 && (
                      <span className="text-xs text-stone-400 italic">No genres selected yet. Click options below:</span>
                    )}
                  </div>

                  {/* All Available Genres */}
                  <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 space-y-2">
                    <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block">
                      Choose from all cataloged genres:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                      {availableGenres.map((genre) => {
                        const isSelected = genreTags.includes(genre);
                        return (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setGenreTags(genreTags.filter((t) => t !== genre));
                              } else {
                                setGenreTags([...genreTags, genre]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1 border ${
                              isSelected
                                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-semibold'
                                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-stone-400" />}
                            <span>{genre}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Add Custom New Tag */}
                    <div className="pt-1 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add new genre tag..."
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = customTagInput.trim();
                            if (val && !genreTags.includes(val)) {
                              setGenreTags([...genreTags, val]);
                              setCustomTagInput('');
                            }
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs w-48 text-stone-900 dark:text-stone-100"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = customTagInput.trim();
                          if (val && !genreTags.includes(val)) {
                            setGenreTags([...genreTags, val]);
                            setCustomTagInput('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors cursor-pointer"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>
                </div>

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

            {/* Part of Series Hyperlink Banner at Bottom of Review */}
            {book.series_id && (
              (() => {
                const linkedSeries = series.find(
                  (s) =>
                    s.id === book.series_id ||
                    (book.series_id && s.title.toLowerCase() === book.series_id.toLowerCase())
                );
                if (!linkedSeries) return null;
                const seriesVols = books.filter(
                  (b) =>
                    b.series_id === linkedSeries.id ||
                    (b.series_id && linkedSeries.title && b.series_id.toLowerCase() === linkedSeries.title.toLowerCase())
                );

                return (
                  <div className="mt-6 p-4.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 block font-mono">
                          Part of Series
                        </span>
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                          {linkedSeries.title}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {seriesVols.length} {seriesVols.length === 1 ? 'book' : 'books'} cataloged in this series
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectSeries?.(linkedSeries.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      <span>Explore Series & Overall Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })()
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

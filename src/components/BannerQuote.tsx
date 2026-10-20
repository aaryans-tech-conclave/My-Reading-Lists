import React, { useState } from 'react';
import { Quote, Edit3, Image, Check, X, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const BannerQuote: React.FC = () => {
  const { settings, updateSettings } = useData();
  const { isAdmin } = useAuth();
  const { accentClass } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [bannerTitle, setBannerTitle] = useState(settings.banner_title);
  const [bannerUrl, setBannerUrl] = useState(settings.banner_image_url);
  const [quoteText, setQuoteText] = useState(settings.quote_text);
  const [quoteAuthor, setQuoteAuthor] = useState(settings.quote_author);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        banner_title: bannerTitle,
        banner_image_url: bannerUrl,
        quote_text: quoteText,
        quote_author: quoteAuthor,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setBannerTitle(settings.banner_title);
    setBannerUrl(settings.banner_image_url);
    setQuoteText(settings.quote_text);
    setQuoteAuthor(settings.quote_author);
    setIsEditing(false);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 mb-8 transition-all">
      
      {/* Banner Background Image with Gradient Overlay */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden">
        <img
          src={settings.banner_image_url || 'https://images.unsplash.com/photo-1507842229451-7f01be7f7b3a?auto=format&fit=crop&q=80&w=1600'}
          alt="Library Banner"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05] transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Admin Edit Trigger */}
        {isAdmin && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Banner & Quote</span>
          </button>
        )}

        {/* Content on Banner */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-medium tracking-wide uppercase mb-2.5 border border-white/10">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Personal Library Anthology</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-sm mb-3">
              {settings.banner_title}
            </h1>

            {/* Quote Block */}
            <div className="flex items-start space-x-2.5 bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/15 text-stone-100 max-w-2xl">
              <Quote className="w-4 h-4 text-amber-300 shrink-0 mt-0.5 opacity-80" />
              <div className="text-xs sm:text-sm font-serif italic leading-relaxed">
                "{settings.quote_text}"
                {settings.quote_author && (
                  <span className="block not-italic font-sans text-[11px] font-semibold text-amber-200 mt-1 uppercase tracking-wider">
                    — {settings.quote_author}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Inline Editor Drawer */}
      {isAdmin && isEditing && (
        <div className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span>Edit Banner Title, Image & Featured Quote</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white ${accentClass.bg} shadow-xs hover:opacity-95 transition-opacity`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Apply Changes'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Portfolio Headline / Title
              </label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Banner Cover Image URL (Unsplash or direct image)
              </label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Featured Literary Quote
              </label>
              <textarea
                rows={2}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-serif"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Quote Author / Attribution
              </label>
              <input
                type="text"
                value={quoteAuthor}
                onChange={(e) => setQuoteAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

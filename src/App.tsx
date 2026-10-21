import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BookDetailModal } from './components/modals/BookDetailModal';
import { AddEditBookModal } from './components/modals/AddEditBookModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { AuthorsView } from './components/views/AuthorsView';
import { SeriesView } from './components/views/SeriesView';
import { StatisticsView } from './components/views/StatisticsView';
import { LibraryTableView } from './components/views/LibraryTableView';
import { TbrView } from './components/views/TbrView';
import { RecentlyBoughtView } from './components/views/RecentlyBoughtView';
import { WishlistView } from './components/views/WishlistView';
import { GenresView } from './components/views/GenresView';
import { HabitTrackerWidget } from './components/widgets/HabitTrackerWidget';
import { ReadingGoalsWidget } from './components/widgets/ReadingGoalsWidget';
import { NotionDashboard } from './components/notion/NotionDashboard';
import { SeriesDetailModal } from './components/modals/SeriesDetailModal';
import { ActiveNavTab, SeriesItem } from './types';
import { Plus, Trash2, RotateCcw, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [filterAuthorId, setFilterAuthorId] = useState<string | undefined>(undefined);
  const [selectedSeriesForModal, setSelectedSeriesForModal] = useState<SeriesItem | null>(null);

  const { selectedBook, setSelectedBook, clearAllBooks, resetToDefaultData, books, series } = useData();
  const { isAdmin, openAuthModal } = useAuth();
  const { theme, accentClass } = useTheme();

  const handleSelectAuthor = (authorId: string) => {
    setFilterAuthorId(authorId);
    setActiveTab('my-authors');
  };

  const handleSelectSeries = (seriesId: string) => {
    const target = series.find(
      (s) => s.id === seriesId || (seriesId && s.title.toLowerCase() === seriesId.toLowerCase())
    );
    if (target) {
      setSelectedSeriesForModal(target);
    } else {
      setActiveTab('my-series');
    }
  };

  const handleClearSampleBooks = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all current sample mockup books? This gives you an empty, clean library to upload your own books.'
      )
    ) {
      await clearAllBooks();
    }
  };

  const handleResetSampleBooks = async () => {
    if (
      window.confirm(
        'Reset sample collection? This will re-seed the library with curated starter books.'
      )
    ) {
      await resetToDefaultData();
    }
  };

  return (
    <div className={`min-h-screen ${theme.pageBg} ${theme.pageText} flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddBook={() => setIsAddBookOpen(true)}
      />

      {/* Curator Admin Control Banner (Only visible to Admin) */}
      {isAdmin && (
        <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/30 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-amber-500 text-stone-950 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                Curator Admin Mode Active
              </span>
              <span className="text-amber-700/80 dark:text-amber-300/80 hidden sm:inline">
                • {books.length} books in catalog • Live sync to Firebase
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAddBookOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add Book</span>
              </button>

              <button
                onClick={handleClearSampleBooks}
                title="Wipe mockup items to start with an empty library"
                className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900 font-medium flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden md:inline">Delete Mockup Items</span>
                <span className="md:hidden">Clear All</span>
              </button>

              <button
                onClick={handleResetSampleBooks}
                title="Re-seed starter books if needed"
                className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 font-medium flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden lg:inline">Reset Samples</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Body Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Collapsible Sidebar on Left Margin */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setFilterAuthorId(undefined);
          }}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          
          {/* TAB 1: NOTION READING LIFE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <NotionDashboard
                onSelectBook={(book) => setSelectedBook(book)}
                onOpenAddBook={() => setIsAddBookOpen(true)}
                setActiveTab={setActiveTab}
              />
            </div>
          )}

          {/* TAB 2: MY LIBRARY (TILE & LIST VIEWS) */}
          {activeTab === 'my-library' && (
            <div className="animate-in fade-in duration-150">
              <LibraryTableView
                onSelectBook={(book) => setSelectedBook(book)}
                onOpenAddBook={() => setIsAddBookOpen(true)}
              />
            </div>
          )}

          {/* TAB 3: MY AUTHORS */}
          {activeTab === 'my-authors' && (
            <div className="animate-in fade-in duration-150">
              <AuthorsView
                onSelectBook={(book) => setSelectedBook(book)}
                filteredAuthorId={filterAuthorId}
              />
            </div>
          )}

          {/* TAB 4: MY SERIES */}
          {activeTab === 'my-series' && (
            <div className="animate-in fade-in duration-150">
              <SeriesView onSelectBook={(book) => setSelectedBook(book)} />
            </div>
          )}

          {/* TAB 4.5: MY GENRES PAGE */}
          {activeTab === 'my-genres' && (
            <div className="animate-in fade-in duration-150">
              <GenresView
                onSelectBook={(book) => setSelectedBook(book)}
              />
            </div>
          )}

          {/* TAB 5: TO BE READ (TBR) PAGE */}
          {activeTab === 'my-tbr' && (
            <div className="animate-in fade-in duration-150">
              <TbrView
                onSelectBook={(book) => setSelectedBook(book)}
                onOpenAddBook={() => setIsAddBookOpen(true)}
              />
            </div>
          )}

          {/* TAB 6: RECENTLY BOUGHT PAGE */}
          {activeTab === 'recently-bought' && (
            <div className="animate-in fade-in duration-150">
              <RecentlyBoughtView
                onSelectBook={(book) => setSelectedBook(book)}
              />
            </div>
          )}

          {/* TAB 7: WISHLIST PAGE */}
          {activeTab === 'wishlist' && (
            <div className="animate-in fade-in duration-150">
              <WishlistView
                onSelectBook={(book) => setSelectedBook(book)}
                onOpenAddBook={() => setIsAddBookOpen(true)}
              />
            </div>
          )}

          {/* TAB 8: STATISTICS */}
          {activeTab === 'statistics' && (
            <div className="animate-in fade-in duration-150">
              <StatisticsView />
            </div>
          )}

          {/* TAB 9: HABITS */}
          {activeTab === 'habits' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-4 border-b border-stone-200/80 dark:border-stone-800">
                <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Reading Habit Consistency Matrix
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Weekly progress, physical page reading, and audiobook listening
                </p>
              </div>
              <HabitTrackerWidget />
            </div>
          )}

          {/* TAB 10: GOALS */}
          {activeTab === 'goals' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-4 border-b border-stone-200/80 dark:border-stone-800">
                <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Yearly Reading Target & Pace
                </h1>
              </div>
              <ReadingGoalsWidget />
            </div>
          )}

        </main>
      </div>

      {/* Floating Action Button (FAB) for Admin */}
      {isAdmin && (
        <button
          onClick={() => setIsAddBookOpen(true)}
          title="Add New Book"
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all ${accentClass.bg} flex items-center space-x-2 cursor-pointer`}
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Add Book</span>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-6 px-4 text-center text-xs text-stone-400 dark:text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-stone-700 dark:text-stone-300">Aaryan's Reading Lists</span>
          </div>

          <div className="text-[11px] text-stone-400">
            A personal literary archive
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSelectAuthor={handleSelectAuthor}
          onSelectSeries={handleSelectSeries}
        />
      )}

      {selectedSeriesForModal && (
        <SeriesDetailModal
          series={selectedSeriesForModal}
          onClose={() => setSelectedSeriesForModal(null)}
          onSelectBook={(book) => {
            setSelectedSeriesForModal(null);
            setSelectedBook(book);
          }}
        />
      )}

      {isAddBookOpen && (
        <AddEditBookModal onClose={() => setIsAddBookOpen(false)} />
      )}

      <AdminAuthModal />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <MainAppContent />
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

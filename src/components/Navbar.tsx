import React, { useState } from 'react';
import {
  BookOpen,
  Sun,
  Moon,
  Palette,
  ShieldCheck,
  LayoutDashboard,
  BookMarked,
  Layers,
  BarChart2,
  Check,
  Sparkles,
  Flame,
  TreePine,
  Coffee,
  Contrast,
  Heart,
  Waves,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES, ThemeName } from '../context/ThemeContext';
import { ActiveNavTab } from '../types';

const THEME_ICONS: Record<ThemeName, React.FC<{ className?: string }>> = {
  pastel: ({ className }) => <Sparkles className={`${className || 'w-4 h-4'} text-emerald-500`} />,
  halloween: ({ className }) => <Flame className={`${className || 'w-4 h-4'} text-amber-500`} />,
  christmas: ({ className }) => <TreePine className={`${className || 'w-4 h-4'} text-emerald-600`} />,
  autumn: ({ className }) => <Coffee className={`${className || 'w-4 h-4'} text-amber-700`} />,
  monochrome: ({ className }) => <Contrast className={`${className || 'w-4 h-4'} text-stone-700 dark:text-stone-300`} />,
  sakura: ({ className }) => <Heart className={`${className || 'w-4 h-4'} text-rose-500`} />,
  ocean: ({ className }) => <Waves className={`${className || 'w-4 h-4'} text-teal-500`} />,
};

interface NavbarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  onOpenAddBook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddBook,
}) => {
  const { isAdmin, logout, openAuthModal } = useAuth();
  const { activeTheme, theme, setTheme, isDark, toggleDarkMode } = useTheme();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const themeList = Object.keys(THEMES) as ThemeName[];
  const CurrentThemeIcon = THEME_ICONS[activeTheme] || Sparkles;

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md ${theme.navBg} border-b transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-2.5 text-left group cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-xl ${theme.accentBg} flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100 block leading-none">
                Aaryan's
              </span>
              <span className="text-[11px] font-sans tracking-wide uppercase text-stone-500 dark:text-stone-400 font-medium">
                Reading Tracker
              </span>
            </div>
          </button>
        </div>

        {/* Center Quick Navigation Switcher */}
        <div className="hidden sm:flex items-center bg-stone-200/60 dark:bg-stone-800/80 p-1 rounded-full border border-stone-300/60 dark:border-stone-700">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('my-library')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'my-library'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>My Library</span>
          </button>

          <button
            onClick={() => setActiveTab('my-series')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'my-series'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Series</span>
          </button>

          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'statistics'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Statistics</span>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2">
          
          {/* Themes Palette Menu */}
          <div className="relative">
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              title="Change Global Theme & Color Scheme"
              className="flex items-center space-x-1.5 p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              <div className="flex items-center space-x-1 text-xs font-medium hidden md:flex">
                <CurrentThemeIcon className="w-3.5 h-3.5" />
                <span>{theme.name}</span>
              </div>
            </button>

            {isPaletteOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsPaletteOpen(false)}
              >
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Full Dashboard Themes
                </div>
                <div className="space-y-1">
                  {themeList.map((tKey) => {
                    const item = THEMES[tKey];
                    const isSelected = activeTheme === tKey;
                    const ItemIcon = THEME_ICONS[tKey];
                    return (
                      <button
                        key={tKey}
                        onClick={() => {
                          setTheme(tKey);
                          setIsPaletteOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block leading-none">{item.name}</span>
                            <span className="text-[10px] text-stone-400 font-normal leading-tight block mt-0.5">
                              {item.description}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Admin Mode Badge & Actions */}
          {isAdmin && (
            <div className="flex items-center space-x-2 pl-1 border-l border-stone-200 dark:border-stone-800">
              <button
                onClick={onOpenAddBook}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                <span>+ New</span>
              </button>
              <button
                onClick={logout}
                title="Click to Exit Curator Mode"
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-mono text-[11px]">Exit Curator</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

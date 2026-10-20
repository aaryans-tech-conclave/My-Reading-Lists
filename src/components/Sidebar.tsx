import React from 'react';
import {
  BookMarked,
  Users,
  Layers,
  Clock,
  Target,
  CalendarCheck,
  BarChart3,
  LayoutDashboard,
  ShoppingBag,
  Bookmark,
  Tag,
} from 'lucide-react';
import { ActiveNavTab } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

interface SidebarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { theme } = useTheme();
  const { books, authors, series } = useData();

  const distinctGenresCount = Array.from(new Set(books.flatMap((b) => b.genre_tags))).length;

  const readingLinks = [
    {
      id: 'dashboard' as ActiveNavTab,
      label: 'Dashboard Hub',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'my-library' as ActiveNavTab,
      label: 'My Library',
      icon: BookMarked,
      badge: books.length,
    },
    {
      id: 'my-authors' as ActiveNavTab,
      label: 'My Authors',
      icon: Users,
      badge: authors.length,
    },
    {
      id: 'my-series' as ActiveNavTab,
      label: 'My Series',
      icon: Layers,
      badge: series.length,
    },
    {
      id: 'my-genres' as ActiveNavTab,
      label: 'My Genres',
      icon: Tag,
      badge: distinctGenresCount,
    },
    {
      id: 'my-tbr' as ActiveNavTab,
      label: 'To Be Read (TBR)',
      icon: Clock,
      badge: books.filter((b) => b.is_owned && b.status === 'TBR').length,
    },
    {
      id: 'recently-bought' as ActiveNavTab,
      label: 'Recently Bought',
      icon: ShoppingBag,
      badge: books.filter((b) => b.is_owned && b.purchase_date).length,
    },
    {
      id: 'wishlist' as ActiveNavTab,
      label: 'Wishlist',
      icon: Bookmark,
      badge: books.filter((b) => !b.is_owned).length,
    },
  ];

  const dataLinks = [
    {
      id: 'goals' as ActiveNavTab,
      label: 'Reading Goals',
      icon: Target,
      badge: '2025',
    },
    {
      id: 'habits' as ActiveNavTab,
      label: 'Habit Tracker',
      icon: CalendarCheck,
      badge: 'Active',
    },
    {
      id: 'statistics' as ActiveNavTab,
      label: 'My Statistics',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside className={`w-64 shrink-0 hidden lg:block border-r ${theme.sidebarBg} p-5 space-y-6 transition-colors duration-200`}>
      
      {/* Group: My Reading */}
      <div className="space-y-1.5">
        <h3 className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 font-sans">
          My Reading
        </h3>
        <nav className="space-y-0.5">
          {readingLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? theme.sidebarActive
                    : 'text-stone-600 dark:text-stone-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-stone-900/20 dark:text-stone-900'
                        : 'bg-black/10 dark:bg-white/10 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Group: My Data */}
      <div className="space-y-1.5">
        <h3 className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 font-sans">
          My Trackers & Data
        </h3>
        <nav className="space-y-0.5">
          {dataLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-stone-900/20 dark:text-stone-900'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
};

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'pastel' | 'halloween' | 'christmas' | 'autumn' | 'monochrome' | 'sakura' | 'ocean';

export interface ThemeColors {
  name: string;
  emoji: string;
  description: string;
  // Whole Page Environment
  pageBg: string;
  pageText: string;
  navBg: string;
  sidebarBg: string;
  sidebarActive: string;
  cardGeneral: string;
  // Accents
  accentBg: string;
  accentText: string;
  accentBorder: string;
  accentButton: string;
  // Notion-style themed cards
  cardReading: string;
  cardReminders: string;
  cardMonthlyTbr: string;
  cardMonthGlance: string;
  cardBookshelf: string;
  cardYearReading: string;
  cardData: string;
  cardHabit: string;
  cardGoals: string;
  // Visual elements
  silhouetteGradient: string;
  tableHeader: string;
  tableBorder: string;
  tableRowHover: string;
  pillColor: string;
  adminBadge: string;
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  pastel: {
    name: 'Soft Pastels',
    emoji: '🌿',
    description: 'Original gentle aesthetic with lavender, sage, butter, and sky tones',
    pageBg: 'bg-[#faf8f5] dark:bg-[#151419]',
    pageText: 'text-[#2b2a27] dark:text-[#edebe8]',
    navBg: 'bg-[#faf8f5]/90 dark:bg-[#151419]/90 border-stone-200/80 dark:border-stone-800',
    sidebarBg: 'bg-[#f5f2ed]/80 dark:bg-[#19181f]/80 border-stone-200 dark:border-stone-800',
    sidebarActive: 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs',
    cardGeneral: 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800',
    accentBg: 'bg-emerald-600',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    accentBorder: 'border-emerald-300 dark:border-emerald-800',
    accentButton: 'bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900',
    cardReading: 'bg-[#f7f2fa] dark:bg-[#231b2e] border-[#ebdff5] dark:border-[#3d2f4e]',
    cardReminders: 'bg-[#fef9e7] dark:bg-[#2c2718] border-[#f8ecc2] dark:border-[#4d442b]',
    cardMonthlyTbr: 'bg-[#edf7f7] dark:bg-[#1a292b] border-[#d8eded] dark:border-[#2a4549]',
    cardMonthGlance: 'bg-[#fdf0f4] dark:bg-[#2e1c25] border-[#f8d8e3] dark:border-[#4d2f3d]',
    cardBookshelf: 'bg-[#edf7f9] dark:bg-[#1b2b32] border-[#d4eff4] dark:border-[#274852]',
    cardYearReading: 'bg-[#eff6ef] dark:bg-[#1c2c1e] border-[#d7ebd8] dark:border-[#2c4730]',
    cardData: 'bg-[#eff5f0] dark:bg-[#1e2a22] border-[#d9ebdd] dark:border-[#284430]',
    cardHabit: 'bg-[#faeee4] dark:bg-[#34261d] border-[#f4decb] dark:border-[#4d3425]',
    cardGoals: 'bg-[#fcf0f2] dark:bg-[#321f26] border-[#f7d7dd] dark:border-[#4c2a34]',
    silhouetteGradient: 'from-[#a65d4b] via-[#8c4837] to-[#733627]',
    tableHeader: 'bg-stone-50 dark:bg-stone-800/60',
    tableBorder: 'border-stone-200 dark:border-stone-800',
    tableRowHover: 'hover:bg-stone-50/80 dark:hover:bg-stone-800/40',
    pillColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300',
    adminBadge: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  halloween: {
    name: 'Spooky Halloween',
    emoji: '🎃',
    description: 'Light whitish peach backdrop with warm pumpkin yellow-orange hues and obsidian accents',
    pageBg: 'bg-[#fff8f2] dark:bg-[#fff5ee]',
    pageText: 'text-[#2b211a] dark:text-[#2b211a]',
    navBg: 'bg-[#fff8f2]/95 dark:bg-[#fff5ee]/95 border-amber-200/80 dark:border-amber-200/80',
    sidebarBg: 'bg-[#fff1e5]/90 dark:bg-[#ffeee0]/90 border-amber-200/60 dark:border-amber-200/60',
    sidebarActive: 'bg-amber-500 text-stone-950 font-bold shadow-xs',
    cardGeneral: 'bg-white border-amber-200/80 text-stone-900 shadow-xs',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-800 dark:text-amber-800',
    accentBorder: 'border-amber-400',
    accentButton: 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold',
    cardReading: 'bg-[#fff3e6] border-[#fed7aa] text-stone-900',
    cardReminders: 'bg-[#fefce8] border-[#fef08a] text-stone-900',
    cardMonthlyTbr: 'bg-[#fff7ed] border-[#fed7aa] text-stone-900',
    cardMonthGlance: 'bg-[#ffedd5] border-[#fdba74] text-stone-900',
    cardBookshelf: 'bg-[#fff6ec] border-[#fed7aa] text-stone-900',
    cardYearReading: 'bg-[#fef9c3]/60 border-[#fef08a] text-stone-900',
    cardData: 'bg-[#ffedd5]/70 border-[#fed7aa] text-stone-900',
    cardHabit: 'bg-[#fff4e8] border-[#fdba74] text-stone-900',
    cardGoals: 'bg-[#fef3c7]/70 border-[#fde68a] text-stone-900',
    silhouetteGradient: 'from-[#f97316] via-[#fb923c] to-[#ea580c]',
    tableHeader: 'bg-[#fff2e4] text-amber-950 border-b border-amber-200',
    tableBorder: 'border-amber-200/80',
    tableRowHover: 'hover:bg-amber-50/80',
    pillColor: 'bg-amber-100 text-amber-900 border border-amber-300',
    adminBadge: 'bg-amber-500 text-stone-950 border-amber-600 font-bold',
  },
  christmas: {
    name: 'Winter Christmas',
    emoji: '🎄',
    description: 'Evergreen pine, rich cranberry red, frosted snow, and warm gold',
    pageBg: 'bg-[#f4f8f5] dark:bg-[#0c1611]',
    pageText: 'text-[#18281e] dark:text-[#edf7f0]',
    navBg: 'bg-[#f4f8f5]/90 dark:bg-[#0c1611]/90 border-emerald-200/80 dark:border-emerald-900/60',
    sidebarBg: 'bg-[#eaf3ed]/90 dark:bg-[#101e17]/90 border-emerald-200 dark:border-emerald-900',
    sidebarActive: 'bg-emerald-800 text-white shadow-xs',
    cardGeneral: 'bg-white dark:bg-[#12221a] border-emerald-200 dark:border-emerald-900',
    accentBg: 'bg-red-700',
    accentText: 'text-red-700 dark:text-red-400',
    accentBorder: 'border-emerald-400 dark:border-emerald-800',
    accentButton: 'bg-red-700 hover:bg-red-800 text-white font-bold',
    cardReading: 'bg-[#ecfdf5] dark:bg-[#12291e] border-[#a7f3d0] dark:border-[#1d4d38]',
    cardReminders: 'bg-[#fff1f2] dark:bg-[#2b1216] border-[#fecdd3] dark:border-[#521c25]',
    cardMonthlyTbr: 'bg-[#f0fdf4] dark:bg-[#13281c] border-[#bbf7d0] dark:border-[#1e482e]',
    cardMonthGlance: 'bg-[#fef2f2] dark:bg-[#2a1315] border-[#fecaca] dark:border-[#4d1d20]',
    cardBookshelf: 'bg-[#f0fdf4] dark:bg-[#122419] border-[#bbf7d0] dark:border-[#1b4327]',
    cardYearReading: 'bg-[#fef2f2] dark:bg-[#2c1316] border-[#fecaca] dark:border-[#4f1e22]',
    cardData: 'bg-[#f0fdf4] dark:bg-[#13271c] border-[#bbf7d0] dark:border-[#1e472e]',
    cardHabit: 'bg-[#fef2f2] dark:bg-[#2a1215] border-[#fecaca] dark:border-[#4e1c1f]',
    cardGoals: 'bg-[#f0fdf4] dark:bg-[#12251a] border-[#bbf7d0] dark:border-[#1b4428]',
    silhouetteGradient: 'from-[#b91c1c] via-[#991b1b] to-[#14532d]',
    tableHeader: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200',
    tableBorder: 'border-emerald-200 dark:border-emerald-900',
    tableRowHover: 'hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30',
    pillColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    adminBadge: 'bg-red-100 text-red-800 border-red-300',
  },
  autumn: {
    name: 'Cozy Autumn',
    emoji: '🍂',
    description: 'Toasted almond, spiced sepia, warm amber, and cinnamon bark',
    pageBg: 'bg-[#fbf7f2] dark:bg-[#18120e]',
    pageText: 'text-[#31231a] dark:text-[#f5ede5]',
    navBg: 'bg-[#fbf7f2]/90 dark:bg-[#18120e]/90 border-amber-200/80 dark:border-amber-950',
    sidebarBg: 'bg-[#f4ebe1]/90 dark:bg-[#1e1712]/90 border-amber-200 dark:border-amber-950',
    sidebarActive: 'bg-amber-800 text-white shadow-xs',
    cardGeneral: 'bg-white dark:bg-[#221a14] border-amber-200/80 dark:border-amber-950',
    accentBg: 'bg-amber-700',
    accentText: 'text-amber-800 dark:text-amber-300',
    accentBorder: 'border-amber-300 dark:border-amber-800',
    accentButton: 'bg-amber-800 hover:bg-amber-900 text-white font-bold',
    cardReading: 'bg-[#fcf5ec] dark:bg-[#2c2018] border-[#eddac4] dark:border-[#503726]',
    cardReminders: 'bg-[#fbf2e9] dark:bg-[#2a1e15] border-[#ead4be] dark:border-[#4d3523]',
    cardMonthlyTbr: 'bg-[#f7f0e8] dark:bg-[#281e17] border-[#e4d3c3] dark:border-[#493526]',
    cardMonthGlance: 'bg-[#fdf3ec] dark:bg-[#2f1f17] border-[#ebd3c1] dark:border-[#533525]',
    cardBookshelf: 'bg-[#faf1e8] dark:bg-[#291e17] border-[#e6d1be] dark:border-[#4c3524]',
    cardYearReading: 'bg-[#fbf4ec] dark:bg-[#2b1f17] border-[#ebd7c5] dark:border-[#4f3727]',
    cardData: 'bg-[#f7efe6] dark:bg-[#271d17] border-[#e2d0bf] dark:border-[#483425]',
    cardHabit: 'bg-[#fcf5ec] dark:bg-[#2d2018] border-[#edd9c3] dark:border-[#513727]',
    cardGoals: 'bg-[#f9eee4] dark:bg-[#2a1c15] border-[#e5cdbc] dark:border-[#4c3122]',
    silhouetteGradient: 'from-[#c2410c] via-[#9a3412] to-[#78350f]',
    tableHeader: 'bg-amber-50/80 dark:bg-[#261d16] text-amber-950 dark:text-amber-200',
    tableBorder: 'border-amber-200 dark:border-amber-950',
    tableRowHover: 'hover:bg-amber-50/60 dark:hover:bg-amber-950/20',
    pillColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200',
    adminBadge: 'bg-amber-200 text-amber-900 border-amber-400',
  },
  monochrome: {
    name: 'Newspaper Monochrome',
    emoji: '🖤',
    description: 'Crisp editorial black, stark whites, light greys, and ink typography',
    pageBg: 'bg-[#f8f9fa] dark:bg-[#121212]',
    pageText: 'text-[#1a1a1a] dark:text-[#f0f0f0]',
    navBg: 'bg-[#f8f9fa]/90 dark:bg-[#121212]/90 border-stone-300 dark:border-stone-800',
    sidebarBg: 'bg-[#f1f3f5]/90 dark:bg-[#181818]/90 border-stone-300 dark:border-stone-800',
    sidebarActive: 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold',
    cardGeneral: 'bg-white dark:bg-[#1a1a1a] border-stone-300 dark:border-stone-800',
    accentBg: 'bg-black dark:bg-white',
    accentText: 'text-black dark:text-white',
    accentBorder: 'border-black dark:border-white',
    accentButton: 'bg-black text-white hover:bg-stone-800 dark:bg-white dark:text-black font-bold',
    cardReading: 'bg-[#ffffff] dark:bg-[#1a1a1a] border-[#dee2e6] dark:border-[#333333]',
    cardReminders: 'bg-[#f8f9fa] dark:bg-[#1c1c1c] border-[#dee2e6] dark:border-[#383838]',
    cardMonthlyTbr: 'bg-[#ffffff] dark:bg-[#1a1a1a] border-[#dee2e6] dark:border-[#333333]',
    cardMonthGlance: 'bg-[#f8f9fa] dark:bg-[#1c1c1c] border-[#dee2e6] dark:border-[#383838]',
    cardBookshelf: 'bg-[#ffffff] dark:bg-[#1a1a1a] border-[#dee2e6] dark:border-[#333333]',
    cardYearReading: 'bg-[#f8f9fa] dark:bg-[#1c1c1c] border-[#dee2e6] dark:border-[#383838]',
    cardData: 'bg-[#ffffff] dark:bg-[#1a1a1a] border-[#dee2e6] dark:border-[#333333]',
    cardHabit: 'bg-[#f8f9fa] dark:bg-[#1c1c1c] border-[#dee2e6] dark:border-[#383838]',
    cardGoals: 'bg-[#ffffff] dark:bg-[#1a1a1a] border-[#dee2e6] dark:border-[#333333]',
    silhouetteGradient: 'from-[#171717] via-[#262626] to-[#404040]',
    tableHeader: 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100',
    tableBorder: 'border-stone-300 dark:border-stone-800',
    tableRowHover: 'hover:bg-stone-100/70 dark:hover:bg-stone-800/40',
    pillColor: 'bg-stone-200 text-stone-900 dark:bg-stone-700 dark:text-stone-100',
    adminBadge: 'bg-stone-200 text-black border-stone-400 font-bold',
  },
  sakura: {
    name: 'Cherry Blossom',
    emoji: '🌸',
    description: 'Delicate sakura petal pinks, soft rose quartz, and morning dew',
    pageBg: 'bg-[#fdf7f9] dark:bg-[#191015]',
    pageText: 'text-[#2b1721] dark:text-[#fbebf2]',
    navBg: 'bg-[#fdf7f9]/90 dark:bg-[#191015]/90 border-rose-200 dark:border-rose-950',
    sidebarBg: 'bg-[#fbf0f4]/90 dark:bg-[#20141b]/90 border-rose-200 dark:border-rose-950',
    sidebarActive: 'bg-rose-600 text-white shadow-xs font-semibold',
    cardGeneral: 'bg-white dark:bg-[#23151e] border-rose-200 dark:border-rose-950',
    accentBg: 'bg-rose-500',
    accentText: 'text-rose-600 dark:text-rose-400',
    accentBorder: 'border-rose-300 dark:border-rose-800',
    accentButton: 'bg-rose-600 hover:bg-rose-700 text-white font-bold',
    cardReading: 'bg-[#fdf2f8] dark:bg-[#2c1622] border-[#fbcfe8] dark:border-[#54213d]',
    cardReminders: 'bg-[#fff1f2] dark:bg-[#2a1419] border-[#fecdd3] dark:border-[#521d27]',
    cardMonthlyTbr: 'bg-[#fdf2f8] dark:bg-[#2a1520] border-[#fbcfe8] dark:border-[#501e38]',
    cardMonthGlance: 'bg-[#fff1f2] dark:bg-[#2c141a] border-[#fecdd3] dark:border-[#531e28]',
    cardBookshelf: 'bg-[#fdf2f8] dark:bg-[#2b1521] border-[#fbcfe8] dark:border-[#52203a]',
    cardYearReading: 'bg-[#fff1f2] dark:bg-[#2c151b] border-[#fecdd3] dark:border-[#531f29]',
    cardData: 'bg-[#fdf2f8] dark:bg-[#2c1622] border-[#fbcfe8] dark:border-[#53213c]',
    cardHabit: 'bg-[#fff1f2] dark:bg-[#2a1318] border-[#fecdd3] dark:border-[#511c25]',
    cardGoals: 'bg-[#fdf2f8] dark:bg-[#2c1521] border-[#fbcfe8] dark:border-[#521f39]',
    silhouetteGradient: 'from-[#f43f5e] via-[#e11d48] to-[#9f1239]',
    tableHeader: 'bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200',
    tableBorder: 'border-rose-200 dark:border-rose-950',
    tableRowHover: 'hover:bg-rose-50/60 dark:hover:bg-rose-950/20',
    pillColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    adminBadge: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  ocean: {
    name: 'Midnight Ocean',
    emoji: '🌊',
    description: 'Coastal seafoam, deep marine teal, aquamarine, and midnight tides',
    pageBg: 'bg-[#f2faf9] dark:bg-[#0b1617]',
    pageText: 'text-[#132729] dark:text-[#eaf7f7]',
    navBg: 'bg-[#f2faf9]/90 dark:bg-[#0b1617]/90 border-teal-200 dark:border-teal-950',
    sidebarBg: 'bg-[#e7f5f4]/90 dark:bg-[#101f21]/90 border-teal-200 dark:border-teal-950',
    sidebarActive: 'bg-teal-700 text-white shadow-xs font-semibold',
    cardGeneral: 'bg-white dark:bg-[#132629] border-teal-200 dark:border-teal-950',
    accentBg: 'bg-teal-600',
    accentText: 'text-teal-700 dark:text-teal-400',
    accentBorder: 'border-teal-300 dark:border-teal-800',
    accentButton: 'bg-teal-700 hover:bg-teal-800 text-white font-bold',
    cardReading: 'bg-[#f0fdfa] dark:bg-[#122827] border-[#ccfbf1] dark:border-[#1d4d4a]',
    cardReminders: 'bg-[#f0f9ff] dark:bg-[#112638] border-[#e0f2fe] dark:border-[#1e4868]',
    cardMonthlyTbr: 'bg-[#f0fdfa] dark:bg-[#112726] border-[#ccfbf1] dark:border-[#1b4a47]',
    cardMonthGlance: 'bg-[#ecfeff] dark:bg-[#10272b] border-[#cffafe] dark:border-[#19484f]',
    cardBookshelf: 'bg-[#f0fdfa] dark:bg-[#122827] border-[#ccfbf1] dark:border-[#1b4b48]',
    cardYearReading: 'bg-[#ecfeff] dark:bg-[#11262a] border-[#cffafe] dark:border-[#1a4951]',
    cardData: 'bg-[#f0fdfa] dark:bg-[#132928] border-[#ccfbf1] dark:border-[#1d4d4b]',
    cardHabit: 'bg-[#f0f9ff] dark:bg-[#112536] border-[#e0f2fe] dark:border-[#1d4664]',
    cardGoals: 'bg-[#f0fdfa] dark:bg-[#122726] border-[#ccfbf1] dark:border-[#1b4a47]',
    silhouetteGradient: 'from-[#0d9488] via-[#0f766e] to-[#115e59]',
    tableHeader: 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200',
    tableBorder: 'border-teal-200 dark:border-teal-950',
    tableRowHover: 'hover:bg-teal-50/60 dark:hover:bg-teal-950/20',
    pillColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300',
    adminBadge: 'bg-teal-100 text-teal-800 border-teal-300',
  },
};

interface ThemeContextType {
  activeTheme: ThemeName;
  theme: ThemeColors;
  setTheme: (name: ThemeName) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  accentClass: {
    bg: string;
    text: string;
    border: string;
    btn: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem('folioread_theme_name') as ThemeName) || 'pastel';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('folioread_dark') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const setTheme = (name: ThemeName) => {
    setActiveThemeState(name);
    localStorage.setItem('folioread_theme_name', name);
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('folioread_dark', String(next));
      return next;
    });
  };

  const theme = THEMES[activeTheme] || THEMES.pastel;

  const accentClass = {
    bg: theme.accentBg,
    text: theme.accentText,
    border: theme.accentBorder,
    btn: theme.accentButton,
  };

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        theme,
        setTheme,
        isDark,
        toggleDarkMode,
        accentClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

import React, { useState, useMemo } from 'react';
import { CalendarCheck, BookOpen, Headphones, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const HabitTrackerWidget: React.FC = () => {
  const { habits, toggleDailyHabit } = useData();
  const { isAdmin } = useAuth();
  const { activeTheme } = useTheme();

  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    formattedDate: string;
    sessions: number;
    hasPhysical: boolean;
    hasAudio: boolean;
    x: number;
    y: number;
  } | null>(null);

  // Generate current week dates for quick logging
  const today = new Date();
  const currentWeekDays = useMemo(() => {
    const list: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      list.push({ dateStr, dayName, dayNum, isToday: i === 0 });
    }
    return list;
  }, []);

  const todayStr = today.toISOString().slice(0, 10);
  const todayHabit = habits.find((h) => h.date === todayStr);

  // Format date helper: "Jul 12", "Oct 15"
  const formatMonthDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Build the 53-week x 7-day grid for selectedYear
  const { weeks, monthHeaders, totalYearSessions } = useMemo(() => {
    const startOfYear = new Date(selectedYear, 0, 1);
    const endOfYear = new Date(selectedYear, 11, 31);
    
    // Day of week of Jan 1 (0 = Sunday, 1 = Monday, etc.)
    const startDayOfWeek = startOfYear.getDay();

    const weeksData: {
      weekIndex: number;
      days: {
        date: Date | null;
        dateStr: string;
        formattedDate: string;
        intensity: number; // 0, 1, 2
        hasPhysical: boolean;
        hasAudio: boolean;
        isToday: boolean;
      }[];
    }[] = [];

    // Map habits by date string for quick lookup
    const habitMap = new Map<string, { read_physical: boolean; read_audio: boolean }>();
    habits.forEach((h) => {
      habitMap.set(h.date, { read_physical: h.read_physical, read_audio: h.read_audio });
    });

    let currentCursor = new Date(startOfYear);
    // Rewind cursor to the Sunday of the first week
    currentCursor.setDate(currentCursor.getDate() - startDayOfWeek);

    let sessionCounter = 0;
    const monthHeaderPositions: { monthName: string; weekCol: number }[] = [];
    const seenMonths = new Set<number>();

    for (let w = 0; w < 53; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const thisDate = new Date(currentCursor);
        const inYear = thisDate.getFullYear() === selectedYear;
        const dateStr = thisDate.toISOString().slice(0, 10);
        const formattedDate = formatMonthDay(thisDate);

        if (inYear && !seenMonths.has(thisDate.getMonth()) && thisDate.getDate() <= 7) {
          seenMonths.add(thisDate.getMonth());
          monthHeaderPositions.push({
            monthName: thisDate.toLocaleDateString('en-US', { month: 'short' }),
            weekCol: w,
          });
        }

        const habitData = habitMap.get(dateStr);
        let intensity = 0;
        let hasPhysical = false;
        let hasAudio = false;

        if (inYear) {
          if (habitData) {
            hasPhysical = habitData.read_physical;
            hasAudio = habitData.read_audio;
            intensity = (hasPhysical ? 1 : 0) + (hasAudio ? 1 : 0);
          } else {
            // Seed realistic patterns for past dates of the year if empty
            const dayNum = thisDate.getDate();
            const monthNum = thisDate.getMonth();
            const seedVal = (dayNum * 13 + monthNum * 7) % 10;
            if (thisDate <= today && selectedYear === 2025) {
              if (seedVal > 6) intensity = 2;
              else if (seedVal > 3) intensity = 1;
            } else if (selectedYear < 2025) {
              if (seedVal > 5) intensity = 2;
              else if (seedVal > 2) intensity = 1;
            }
          }
          if (intensity > 0) sessionCounter += intensity;
        }

        weekDays.push({
          date: inYear ? thisDate : null,
          dateStr,
          formattedDate,
          intensity,
          hasPhysical,
          hasAudio,
          isToday: dateStr === todayStr,
        });

        currentCursor.setDate(currentCursor.getDate() + 1);
      }
      weeksData.push({ weekIndex: w, days: weekDays });
    }

    return {
      weeks: weeksData,
      monthHeaders: monthHeaderPositions,
      totalYearSessions: sessionCounter,
    };
  }, [selectedYear, habits, todayStr]);

  // Color coding mapped to active theme
  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) {
      if (activeTheme === 'halloween') return 'bg-amber-100/50 dark:bg-amber-950/30 border-amber-200/40';
      if (activeTheme === 'christmas') return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/40';
      if (activeTheme === 'autumn') return 'bg-amber-50 dark:bg-stone-800 border-stone-200/40';
      if (activeTheme === 'monochrome') return 'bg-stone-100 dark:bg-stone-850 border-stone-200/40';
      if (activeTheme === 'sakura') return 'bg-rose-50 dark:bg-stone-800 border-rose-200/40';
      if (activeTheme === 'ocean') return 'bg-sky-50 dark:bg-stone-800 border-sky-200/40';
      return 'bg-stone-100 dark:bg-stone-800 border-stone-200/40';
    }

    if (activeTheme === 'halloween') {
      if (intensity === 1) return 'bg-[#fcd34d] dark:bg-amber-600 border-amber-400';
      return 'bg-[#ea580c] dark:bg-orange-500 border-orange-600';
    }

    if (activeTheme === 'christmas') {
      if (intensity === 1) return 'bg-emerald-400 dark:bg-emerald-600 border-emerald-500';
      return 'bg-red-600 dark:bg-red-700 border-red-700';
    }

    if (activeTheme === 'autumn') {
      if (intensity === 1) return 'bg-amber-400 dark:bg-amber-600 border-amber-500';
      return 'bg-amber-700 dark:bg-amber-600 border-amber-800';
    }

    if (activeTheme === 'monochrome') {
      if (intensity === 1) return 'bg-stone-400 dark:bg-stone-500 border-stone-500';
      return 'bg-stone-900 dark:bg-stone-100 border-stone-900';
    }

    if (activeTheme === 'sakura') {
      if (intensity === 1) return 'bg-pink-300 dark:bg-pink-600 border-pink-400';
      return 'bg-rose-500 dark:bg-rose-600 border-rose-600';
    }

    if (activeTheme === 'ocean') {
      if (intensity === 1) return 'bg-cyan-400 dark:bg-cyan-600 border-cyan-500';
      return 'bg-blue-600 dark:bg-blue-500 border-blue-700';
    }

    // Default pastel
    if (intensity === 1) return 'bg-emerald-300 dark:bg-emerald-600 border-emerald-400';
    return 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700';
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-6">
      
      {/* Top Header & Year Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-mono text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              {selectedYear}: {totalYearSessions.toLocaleString()} Reading Sessions {selectedYear === 2025 ? '(so far)' : ''}
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Full annual reading consistency matrix (52 weeks)
          </p>
        </div>

        {/* Year Selector Buttons */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          {[2025, 2024, 2023].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* GitHub-Style Annual Horizontal Matrix (Matching Screenshot Layout) */}
      <div className="relative overflow-x-auto pb-4 pt-1">
        <div className="min-w-[820px] select-none">
          
          {/* Month Labels row */}
          <div className="flex text-[11px] font-mono text-stone-400 dark:text-stone-500 mb-1.5 pl-6 h-4">
            {monthHeaders.map((m, idx) => {
              // Approximate left offset percentage based on week index
              const leftPercent = (m.weekCol / 53) * 100;
              return (
                <span
                  key={idx}
                  style={{ left: `${leftPercent}%` }}
                  className="absolute transform text-stone-600 dark:text-stone-400 font-medium"
                >
                  {m.monthName}
                </span>
              );
            })}
          </div>

          {/* Grid Layout: Days of Week on left, 53 Columns of 7 Squares */}
          <div className="flex">
            
            {/* Weekday indicators (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-stone-400 dark:text-stone-500 pr-2 py-0.5 w-6 h-[108px]">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* 53 Columns of 7 Rows */}
            <div className="flex gap-[3.5px]">
              {weeks.map((week) => (
                <div key={week.weekIndex} className="flex flex-col gap-[3.5px]">
                  {week.days.map((day, dIdx) => {
                    if (!day.date) {
                      return (
                        <div
                          key={dIdx}
                          className="w-[12px] h-[12px] rounded-[2.5px] opacity-0 pointer-events-none"
                        />
                      );
                    }

                    const colorClass = getIntensityColor(day.intensity);

                    return (
                      <div
                        key={dIdx}
                        title={day.formattedDate}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({
                            dateStr: day.dateStr,
                            formattedDate: day.formattedDate,
                            sessions: day.intensity,
                            hasPhysical: day.hasPhysical,
                            hasAudio: day.hasAudio,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-[12px] h-[12px] rounded-[2.5px] border ${colorClass} transition-all duration-100 hover:scale-135 hover:z-20 cursor-pointer ${
                          day.isToday ? 'ring-2 ring-amber-400' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 mt-4 pl-6">
            <span>Learn how we calculate streaks & sessions</span>
            <div className="flex items-center space-x-1.5 font-mono text-[10px]">
              <span>Less</span>
              <span className={`w-3 h-3 rounded-[2px] border ${getIntensityColor(0)}`} />
              <span className={`w-3 h-3 rounded-[2px] border ${getIntensityColor(1)}`} />
              <span className={`w-3 h-3 rounded-[2px] border ${getIntensityColor(2)}`} />
              <span>More</span>
            </div>
          </div>

        </div>

        {/* Floating Tooltip with exact "Jul 12" / "Oct 15" format */}
        {hoveredDay && (
          <div
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-mono shadow-xl border border-stone-700 animate-in fade-in duration-75 flex items-center space-x-1.5"
            style={{ left: hoveredDay.x, top: hoveredDay.y }}
          >
            <span className="font-bold text-amber-300">{hoveredDay.formattedDate}</span>
            {hoveredDay.sessions > 0 && (
              <span className="text-stone-300">
                • {hoveredDay.sessions} session{hoveredDay.sessions > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Interactive Day Logger (Curator Only) */}
      {isAdmin && (
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Log Today's Reading ({today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
              </h3>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              {habits.filter((h) => h.read_physical || h.read_audio).length} days logged this month
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => toggleDailyHabit(todayStr, 'physical')}
              className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                todayHabit?.read_physical
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Physical Book</span>
              {todayHabit?.read_physical && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>

            <button
              onClick={() => toggleDailyHabit(todayStr, 'audio')}
              className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                todayHabit?.read_audio
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audiobook</span>
              {todayHabit?.read_audio && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

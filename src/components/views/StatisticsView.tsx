import React, { useState } from 'react';
import {
  BarChart3,
  Filter,
  Plus,
  Star,
  Calendar,
  Headphones,
  FileText,
  CheckCircle2,
  BookOpen,
  XCircle,
  ChevronDown,
  Hash,
  Table,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const StatisticsView: React.FC = () => {
  const { books } = useData();

  const [activeFilterTab, setActiveFilterTab] = useState<'2025' | 'this-month' | 'all-time'>('2025');

  const STATS_MONTHS = [
    {
      month: 'January 2025',
      books: ['The Obelisk Gate', 'The Fifth Season'],
      totalBooks: 2,
      totalPages: 1000,
      hoursListened: 10,
      avgRating: 3.5,
      dnf: 0,
    },
    {
      month: 'February 2025',
      books: ['The Stone Sky'],
      totalBooks: 1,
      totalPages: 350,
      hoursListened: 0,
      avgRating: 5.0,
      dnf: 0,
    },
    {
      month: 'March 2025',
      books: [],
      totalBooks: 0,
      totalPages: 0,
      hoursListened: 0,
      avgRating: 0,
      dnf: 0,
    },
    {
      month: 'April 2025',
      books: [],
      totalBooks: 0,
      totalPages: 0,
      hoursListened: 0,
      avgRating: 0,
      dnf: 0,
    },
    {
      month: 'May 2025',
      books: [],
      totalBooks: 0,
      totalPages: 0,
      hoursListened: 0,
      avgRating: 0,
      dnf: 0,
    },
    {
      month: 'June 2025',
      books: [],
      totalBooks: 0,
      totalPages: 0,
      hoursListened: 0,
      avgRating: 0,
      dnf: 0,
    },
    {
      month: 'July 2025',
      books: [],
      totalBooks: 0,
      totalPages: 0,
      hoursListened: 0,
      avgRating: 0,
      dnf: 0,
    },
    {
      month: 'August 2025',
      books: [],
      totalBooks: 0,
      totalPages: 0,
      hoursListened: 0,
      avgRating: 0,
      dnf: 0,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Title */}
      <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
        <h1 className="text-3xl font-sans font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2.5">
          <BarChart3 className="w-7 h-7 text-stone-700 dark:text-stone-200" />
          <span>my statistics</span>
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Monthly read volumes, cumulative page counts, listening hours, and ratings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveFilterTab('2025')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeFilterTab === '2025'
                ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>2025</span>
          </button>

          <button
            onClick={() => setActiveFilterTab('this-month')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeFilterTab === 'this-month'
                ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>This Month</span>
          </button>

          <button
            onClick={() => setActiveFilterTab('all-time')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeFilterTab === 'all-time'
                ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>All Time</span>
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2">
          <div className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-medium flex items-center space-x-1.5">
            <Calendar className="w-3 h-3 text-blue-500" />
            <span>Month and Year Read: 2025</span>
            <ChevronDown className="w-3 h-3 text-blue-500" />
          </div>

          <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center space-x-1 text-[11px] px-2 py-1 rounded border border-dashed border-stone-300 dark:border-stone-700">
            <Plus className="w-3 h-3" />
            <span>Add filter</span>
          </button>
        </div>
      </div>

      {/* Statistics Database Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-medium border-b border-stone-200 dark:border-stone-800">
            <tr>
              <th className="py-2.5 px-3">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Month and Year Read</span>
                </div>
              </th>
              <th className="py-2.5 px-3">
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span>Books Read</span>
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end space-x-1.5">
                  <Hash className="w-3.5 h-3.5 text-stone-400" />
                  <span>Total Books</span>
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Total Pages</span>
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end space-x-1.5">
                  <Headphones className="w-3.5 h-3.5 text-stone-400" />
                  <span>Hours Listened</span>
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end space-x-1.5">
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                  <span>Total DNF</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono text-[11px]">
            {STATS_MONTHS.map((row) => (
              <tr key={row.month} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="py-2.5 px-3 font-sans flex items-center space-x-2 text-stone-800 dark:text-stone-200">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-medium">{row.month}</span>
                </td>
                <td className="py-2.5 px-3 font-sans">
                  <div className="flex flex-wrap gap-1">
                    {row.books.length > 0 ? (
                      row.books.map((b) => (
                        <span
                          key={b}
                          className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium flex items-center space-x-1"
                        >
                          <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{b}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-400 text-[10px]">—</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-stone-800 dark:text-stone-200">
                  {row.totalBooks}
                </td>
                <td className="py-2.5 px-3 text-right text-stone-600 dark:text-stone-300">
                  {row.totalPages}
                </td>
                <td className="py-2.5 px-3 text-right text-stone-600 dark:text-stone-300">
                  {row.hoursListened}
                </td>
                <td className="py-2.5 px-3 text-right text-stone-400">
                  {row.dnf}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Footer Row */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/40 text-[11px] font-mono text-stone-500 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <span>3 books • 1350 pages</span>
        </div>
      </div>

    </div>
  );
};

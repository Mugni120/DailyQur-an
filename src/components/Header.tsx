import React from 'react';
import { BookOpen, Sparkles, ScrollText, Award, Bookmark, Moon, Sun, Coffee } from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types/quran';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('surah-list')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-arabic text-xl font-bold text-white">ق</span>
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Al-Qur'an Modern <span className="text-xs uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider">PRO</span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                114 Surah · Tajwid Interaktif · Murottal 7 Qari
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('surah-list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'surah-list'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>114 Surah</span>
            </button>

            <button
              onClick={() => setActiveTab('reader')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'reader'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="font-arabic text-xs">📖</span>
              <span>Baca Mushaf</span>
            </button>

            <button
              onClick={() => setActiveTab('tajwid')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tajwid'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tajwid Interaktif</span>
            </button>

            <button
              onClick={() => setActiveTab('hadith')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'hadith'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5 text-teal-400" />
              <span>Hadist Shahih</span>
            </button>

            <button
              onClick={() => setActiveTab('hafidz')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'hafidz'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Latihan Hafidz</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'bookmarks'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favorit</span>
            </button>
          </nav>

          {/* Right Controls: Theme Switcher */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              <button
                onClick={() => setTheme('dark')}
                title="Mode Gelap"
                className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-slate-800 text-emerald-400' : 'hover:text-slate-200'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('light')}
                title="Mode Terang"
                className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-slate-800 text-amber-400' : 'hover:text-slate-200'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                title="Mode Sepia Malam"
                className={`p-1.5 rounded-md transition-colors ${theme === 'sepia' ? 'bg-slate-800 text-yellow-600' : 'hover:text-slate-200'}`}
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('surah-list')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${activeTab === 'surah-list' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            114 Surah
          </button>
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${activeTab === 'reader' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Baca Mushaf
          </button>
          <button
            onClick={() => setActiveTab('tajwid')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${activeTab === 'tajwid' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Tajwid
          </button>
          <button
            onClick={() => setActiveTab('hadith')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${activeTab === 'hadith' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Hadist
          </button>
          <button
            onClick={() => setActiveTab('hafidz')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${activeTab === 'hafidz' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Latihan Hafidz
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${activeTab === 'bookmarks' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            Favorit
          </button>
        </div>
      </div>
    </header>
  );
};

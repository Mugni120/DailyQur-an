/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SurahList } from './components/SurahList';
import { SurahReader } from './components/SurahReader';
import { TajwidGuide } from './components/TajwidGuide';
import { HadithView } from './components/HadithView';
import { HafidzTrainer } from './components/HafidzTrainer';
import { BookmarksView } from './components/BookmarksView';
import { AudioDock } from './components/AudioDock';
import { ActiveTab, ThemeMode } from './types/quran';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('surah-list');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const [savedBookmarks, setSavedBookmarks] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran_bookmarks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [1, 18, 36, 67]; // default bookmarks: Al-Fatihah, Al-Kahf, Yasin, Al-Mulk
  });

  const handleToggleBookmark = (surahNumber: number) => {
    setSavedBookmarks(prev => {
      const updated = prev.includes(surahNumber)
        ? prev.filter(n => n !== surahNumber)
        : [...prev, surahNumber];
      if (typeof window !== 'undefined') {
        localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSelectSurah = (surahNum: number) => {
    setSelectedSurahNumber(surahNum);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaySurah = (surahNum: number) => {
    audioEngine.playAyah(surahNum, 1);
  };

  // Sync theme class to body or root container
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-sepia');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // Color variables according to theme
  const getThemeClasses = () => {
    if (theme === 'light') return 'bg-slate-50 text-slate-900';
    if (theme === 'sepia') return 'bg-[#f8f3e8] text-[#332b21]';
    return 'bg-slate-950 text-slate-100';
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'surah-list' && (
          <SurahList
            onSelectSurah={handleSelectSurah}
            onPlaySurah={handlePlaySurah}
            savedBookmarks={savedBookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'reader' && (
          <SurahReader
            surahNumber={selectedSurahNumber}
            onBackToList={() => setActiveTab('surah-list')}
            onSelectSurah={(num) => setSelectedSurahNumber(num)}
            onOpenHadithTab={() => setActiveTab('hadith')}
          />
        )}

        {activeTab === 'tajwid' && <TajwidGuide />}

        {activeTab === 'hadith' && (
          <HadithView onOpenSurah={handleSelectSurah} />
        )}

        {activeTab === 'hafidz' && (
          <HafidzTrainer onSelectSurahForReader={handleSelectSurah} />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            savedBookmarks={savedBookmarks}
            onSelectSurah={handleSelectSurah}
            onPlaySurah={handlePlaySurah}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </main>

      {/* Floating Bottom Audio Dock */}
      <AudioDock />
    </div>
  );
}

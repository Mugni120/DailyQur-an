import React, { useState, useMemo } from 'react';
import { Search, Play, BookOpen, Compass, Sparkles } from 'lucide-react';
import { SURAHS_LIST } from '../data/surahs';
import { SurahMeta } from '../types/quran';

interface SurahListProps {
  onSelectSurah: (surahNumber: number) => void;
  onPlaySurah: (surahNumber: number) => void;
  savedBookmarks: number[];
  onToggleBookmark: (surahNumber: number) => void;
}

export const SurahList: React.FC<SurahListProps> = ({
  onSelectSurah,
  onPlaySurah,
  savedBookmarks,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Makkiyyah' | 'Madaniyyah' | 'juz30'>('all');
  const [selectedJuz, setSelectedJuz] = useState<string>('all');

  const filteredSurahs = useMemo(() => {
    return SURAHS_LIST.filter(surah => {
      // Filter Type
      if (filterType === 'Makkiyyah' && surah.revelationType !== 'Makkiyyah') return false;
      if (filterType === 'Madaniyyah' && surah.revelationType !== 'Madaniyyah') return false;
      if (filterType === 'juz30' && surah.juzNumber !== 30) return false;

      // Filter Juz
      if (selectedJuz !== 'all' && surah.juzNumber !== parseInt(selectedJuz)) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = String(surah.number) === q;
        const matchLatin = surah.nameLatin.toLowerCase().includes(q);
        const matchTranslation = surah.nameTranslation.toLowerCase().includes(q);
        const matchArabic = surah.nameArabic.includes(q);
        return matchNumber || matchLatin || matchTranslation || matchArabic;
      }

      return true;
    });
  }, [searchQuery, filterType, selectedJuz]);

  return (
    <div className="space-y-6 pb-28">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <span className="font-arabic text-9xl text-emerald-400 select-none">القرآن</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Al-Qur'anul Karim · Kitab Hidayah & Penenang Jiwa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Baca, Pelajari Tajwid, & Dengarkan Murottal 114 Surah
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya." 
            <span className="text-xs text-emerald-400 ml-1.5">(HR. Bukhari No. 5027)</span>
          </p>

          {/* Quick Jump Stats */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div><strong className="text-emerald-400">114</strong> Surah</div>
            <span>·</span>
            <div><strong className="text-emerald-400">6.236</strong> Ayat</div>
            <span>·</span>
            <div><strong className="text-emerald-400">30</strong> Juz</div>
            <span>·</span>
            <div><strong className="text-amber-400">7</strong> Qari Dunia</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari surah (misal: Al-Kahf, Yasin, 67, Pembukaan)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua (114)
          </button>
          <button
            onClick={() => setFilterType('Makkiyyah')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'Makkiyyah'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Makkiyyah
          </button>
          <button
            onClick={() => setFilterType('Madaniyyah')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'Madaniyyah'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Madaniyyah
          </button>
          <button
            onClick={() => setFilterType('juz30')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'juz30'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Juz 'Amma (30)
          </button>
        </div>

        {/* Juz Dropdown */}
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedJuz}
            onChange={(e) => setSelectedJuz(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Pilih Juz (Semua)</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
              <option key={juz} value={juz}>
                Juz {juz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => {
          const isSaved = savedBookmarks.includes(surah.number);
          return (
            <div
              key={surah.number}
              className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-600/50 rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
            >
              <div>
                {/* Header row: Number badge & Type */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 border border-slate-700/60 group-hover:bg-emerald-500/20 transition-colors">
                      {surah.number}
                    </span>
                    <span className="text-xs text-slate-400">
                      Juz {surah.juzNumber} · {surah.numberOfAyahs} Ayat
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400">
                    {surah.revelationType}
                  </span>
                </div>

                {/* Content: Arabic name & Indonesian info */}
                <div className="flex items-baseline justify-between mt-2 mb-1">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {surah.nameLatin}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {surah.nameTranslation}
                    </p>
                  </div>
                  <div className="font-arabic text-2xl text-emerald-300 font-bold select-none text-right">
                    {surah.nameArabic}
                  </div>
                </div>

                {/* Virtue note */}
                {surah.virtue && (
                  <p className="mt-2 text-[11px] text-slate-400/90 line-clamp-2 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
                    {surah.virtue}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => onPlaySurah(surah.number)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dengar Murottal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleBookmark(surah.number)}
                    title={isSaved ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isSaved
                        ? 'text-amber-400 bg-amber-950/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ★
                  </button>

                  <button
                    onClick={() => onSelectSurah(surah.number)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Buka Surah</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-400">Tidak ada surah yang cocok dengan pencarian "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('all'); setSelectedJuz('all'); }}
            className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-emerald-400 hover:bg-slate-700"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};

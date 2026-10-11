import React, { useState, useMemo } from 'react';
import { ScrollText, Search, Copy, Check, BookOpen } from 'lucide-react';
import { HADITHS_LIST } from '../data/hadiths';
import { SURAHS_LIST } from '../data/surahs';

interface HadithViewProps {
  onOpenSurah: (surahNumber: number) => void;
}

export const HadithView: React.FC<HadithViewProps> = ({ onOpenSurah }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = useMemo(() => {
    const list = Array.from(new Set(HADITHS_LIST.map(h => h.category)));
    return ['all', ...list];
  }, []);

  const filteredHadiths = useMemo(() => {
    return HADITHS_LIST.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          item.translation.toLowerCase().includes(q) ||
          item.narrator.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.arabic.includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
            <ScrollText className="w-4 h-4 text-amber-400" />
            <span>As-Sunnah An-Nabawiyyah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hadist-Hadist Keutamaan Al-Qur'an
          </h1>
          <p className="text-sm text-slate-300">
            Kumpulan hadist shahih riwayat Bukhari, Muslim, Abu Dawud, dan At-Tirmidzi seputar keutamaan tilawah, mahkota penghafal Al-Qur'an (hafidz), serta surah-surah pilihan.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari hadist (misal: hafidz, pahala 10 kebaikan, mahkota, Al-Mulk)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Semua Hadist' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hadith List */}
      <div className="space-y-4">
        {filteredHadiths.map(item => {
          const fullText = `"${item.title}"\n\n${item.arabic}\n\nArtinya: "${item.translation}"\n\nRiwayat: ${item.source} (${item.narrator})`;

          return (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">
                    {item.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {item.grade}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(item.id, fullText)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Hadist</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-100">
                {item.title}
              </h3>

              {/* Matan Arabic */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <p className="font-arabic text-xl sm:text-2xl text-emerald-300 text-right leading-loose select-text">
                  {item.arabic}
                </p>
              </div>

              {/* Translation */}
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{item.translation}"
              </p>

              {/* Footer Source & Related Surahs */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div>
                  <strong className="text-slate-300">{item.source}</strong> · Perawi: {item.narrator}
                </div>

                {item.relatedSurahs && item.relatedSurahs.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400">Surah Terkait:</span>
                    {item.relatedSurahs.map(sNum => {
                      const s = SURAHS_LIST.find(x => x.number === sNum);
                      if (!s) return null;
                      return (
                        <button
                          key={sNum}
                          onClick={() => onOpenSurah(sNum)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 transition-colors"
                        >
                          <BookOpen className="w-3 h-3 text-emerald-400" />
                          <span>{s.nameLatin}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

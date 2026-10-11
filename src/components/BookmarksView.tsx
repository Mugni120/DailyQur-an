import React from 'react';
import { Bookmark, BookOpen, Play, Trash2 } from 'lucide-react';
import { SURAHS_LIST } from '../data/surahs';

interface BookmarksViewProps {
  savedBookmarks: number[];
  onSelectSurah: (surahNumber: number) => void;
  onPlaySurah: (surahNumber: number) => void;
  onToggleBookmark: (surahNumber: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  savedBookmarks,
  onSelectSurah,
  onPlaySurah,
  onToggleBookmark
}) => {
  const bookmarkedSurahs = SURAHS_LIST.filter(s => savedBookmarks.includes(s.number));

  return (
    <div className="space-y-6 pb-28">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Koleksi Favorit Pribadi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Surah Pilihan & Markah Bacaan
          </h1>
          <p className="text-sm text-slate-300">
            Daftar surah-surah yang Anda tandai untuk dibaca rutin atau dimuraja'ah setiap hari.
          </p>
        </div>
      </div>

      {bookmarkedSurahs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-xl">
            ★
          </div>
          <h3 className="text-base font-bold text-slate-200">Belum Ada Surah Favorit</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Klik tanda bintang (★) pada kartu surah di katalog 114 Surah untuk menyimpannya ke daftar ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedSurahs.map(surah => (
            <div
              key={surah.number}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                    {surah.number}
                  </span>
                  <span className="text-xs text-slate-400">
                    Juz {surah.juzNumber} · {surah.numberOfAyahs} Ayat
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{surah.nameLatin}</h3>
                    <p className="text-xs text-slate-400">{surah.nameTranslation}</p>
                  </div>
                  <div className="font-arabic text-2xl text-emerald-300 font-bold">
                    {surah.nameArabic}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onPlaySurah(surah.number)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-emerald-300"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dengar Murottal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleBookmark(surah.number)}
                    title="Hapus dari favorit"
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectSurah(surah.number)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Buka</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

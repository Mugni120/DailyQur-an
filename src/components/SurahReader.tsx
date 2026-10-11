import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, Copy, Check, Sparkles, BookOpen, ScrollText } from 'lucide-react';
import { SURAHS_LIST } from '../data/surahs';
import { getSurahVerses, applyTajwidHighlight } from '../data/verses';
import { Ayah, SurahMeta } from '../types/quran';
import { audioEngine, AudioPlaybackState } from '../utils/audioEngine';
import { HADITHS_LIST } from '../data/hadiths';

interface SurahReaderProps {
  surahNumber: number;
  onBackToList: () => void;
  onSelectSurah: (num: number) => void;
  onOpenHadithTab: () => void;
}

export const SurahReader: React.FC<SurahReaderProps> = ({
  surahNumber,
  onBackToList,
  onSelectSurah,
  onOpenHadithTab
}) => {
  const [verses, setVerses] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [arabicFontSize, setArabicFontSize] = useState<number>(30);
  const [showTajwid, setShowTajwid] = useState<boolean>(true);
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [audioState, setAudioState] = useState<AudioPlaybackState>(audioEngine.getState());
  const [selectedHadithModal, setSelectedHadithModal] = useState<boolean>(false);

  const currentSurah: SurahMeta = SURAHS_LIST.find(s => s.number === surahNumber) || SURAHS_LIST[0];

  const relatedHadiths = HADITHS_LIST.filter(h => h.relatedSurahs?.includes(surahNumber));

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getSurahVerses(surahNumber).then(data => {
      if (isMounted) {
        setVerses(data);
        setLoading(false);
      }
    });

    const unsubscribe = audioEngine.subscribe(state => {
      if (isMounted) {
        setAudioState(state);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [surahNumber]);

  const handlePlayAyah = (ayahNum: number) => {
    if (audioState.isPlaying && audioState.surahNumber === surahNumber && audioState.ayahNumber === ayahNum) {
      audioEngine.pause();
    } else {
      audioEngine.playAyah(surahNumber, ayahNum);
    }
  };

  const handleCopyAyah = (ayah: Ayah) => {
    const textToCopy = `${ayah.arab}\n\n"${ayah.latin}"\n\nArtinya: ${ayah.translation}\n(QS. ${currentSurah.nameLatin} [${surahNumber}]: ${ayah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <button
          onClick={onBackToList}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke 114 Surah</span>
        </button>

        {/* Previous & Next Surah Buttons */}
        <div className="flex items-center gap-2">
          {surahNumber > 1 && (
            <button
              onClick={() => onSelectSurah(surahNumber - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Surah Sebelumnya</span>
            </button>
          )}

          {surahNumber < 114 && (
            <button
              onClick={() => onSelectSurah(surahNumber + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <span>Surah Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Surah Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/40 p-6 sm:p-8 text-center shadow-lg">
        <div className="space-y-2">
          <div className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            Surah Ke-{currentSurah.number} · Juz {currentSurah.juzNumber} · {currentSurah.revelationType} · {currentSurah.numberOfAyahs} Ayat
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentSurah.nameLatin}
          </h1>
          <div className="font-arabic text-3xl sm:text-4xl text-emerald-300 font-bold select-none my-2">
            {currentSurah.nameArabic}
          </div>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            "{currentSurah.nameTranslation}" — {currentSurah.virtue || ''}
          </p>
        </div>

        {/* Quick action: Play Whole Surah & View Related Hadith */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => handlePlayAyah(1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Putar Murottal Surah Ini</span>
          </button>

          {relatedHadiths.length > 0 && (
            <button
              onClick={() => setSelectedHadithModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition-colors"
            >
              <ScrollText className="w-4 h-4" />
              <span>Hadist Terkait ({relatedHadiths.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Reader Settings Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Toggle options */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTajwid(!showTajwid)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              showTajwid
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Warna Tajwid {showTajwid ? 'Aktif' : 'Nonaktif'}</span>
          </button>

          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              showLatin ? 'bg-slate-800 text-emerald-300 border border-slate-700' : 'bg-slate-800/50 text-slate-500'
            }`}
          >
            Latin
          </button>

          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              showTranslation ? 'bg-slate-800 text-emerald-300 border border-slate-700' : 'bg-slate-800/50 text-slate-500'
            }`}
          >
            Terjemahan
          </button>
        </div>

        {/* Font size control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Ukuran Teks:</span>
          <button
            onClick={() => setArabicFontSize(Math.max(22, arabicFontSize - 2))}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            A-
          </button>
          <span className="text-xs font-mono text-emerald-400 px-1">{arabicFontSize}px</span>
          <button
            onClick={() => setArabicFontSize(Math.min(48, arabicFontSize + 2))}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            A+
          </button>
        </div>
      </div>

      {/* Bismillah Calligraphy (except Surah 9 At-Taubah) */}
      {surahNumber !== 9 && (
        <div className="text-center py-6 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <div className="font-arabic text-3xl sm:text-4xl text-emerald-300 select-none">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
          </div>
        </div>
      )}

      {/* Verses List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Memuat ayat-ayat suci Al-Qur'an...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {verses.map(ayah => {
            const isPlayingThis =
              audioState.isPlaying &&
              audioState.surahNumber === surahNumber &&
              audioState.ayahNumber === ayah.numberInSurah;

            const arabicRendered = showTajwid ? applyTajwidHighlight(ayah.arab) : ayah.arab;

            return (
              <div
                key={ayah.numberInSurah}
                id={`ayah-${ayah.numberInSurah}`}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                  isPlayingThis
                    ? 'bg-emerald-950/20 border-emerald-500/80 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Verse Header Row */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/60">
                  {/* Verse Number Badge */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {ayah.numberInSurah}
                    </div>
                    <span className="text-xs text-slate-400">
                      Ayat {ayah.numberInSurah} / {currentSurah.numberOfAyahs}
                    </span>
                  </div>

                  {/* Actions: Play Audio, Copy, Bookmark */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePlayAyah(ayah.numberInSurah)}
                      title={isPlayingThis ? 'Jeda Audio' : 'Putar Ayat Ini'}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isPlayingThis
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingThis ? 'Sedang Diputar' : 'Putar'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyAyah(ayah)}
                      title="Salin Ayat"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {copiedAyah === ayah.numberInSurah ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div
                  className="font-arabic text-right my-4 text-slate-100 select-text leading-loose"
                  style={{ fontSize: `${arabicFontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: arabicRendered }}
                />

                {/* Latin Transliteration */}
                {showLatin && (
                  <div className="mt-3 text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed italic">
                    {ayah.latin}
                  </div>
                )}

                {/* Indonesian Translation */}
                {showTranslation && (
                  <div className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {ayah.translation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Hadist Terkait Surah */}
      {selectedHadithModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-slate-100">
                  Hadist Terkait {currentSurah.nameLatin}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHadithModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {relatedHadiths.map(h => (
                <div key={h.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400">{h.category}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">{h.grade}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">{h.title}</h4>
                  <p className="font-arabic text-lg text-emerald-300 text-right">{h.arabic}</p>
                  <p className="text-xs text-slate-300 italic">"{h.translation}"</p>
                  <p className="text-[11px] text-slate-400">{h.source} ({h.narrator})</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedHadithModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

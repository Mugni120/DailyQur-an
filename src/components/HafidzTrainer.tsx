import React, { useState, useEffect } from 'react';
import { Award, Eye, EyeOff, RotateCcw, CheckCircle, HelpCircle, Flame, Check, Sparkles } from 'lucide-react';
import { SURAHS_LIST } from '../data/surahs';
import { OFFLINE_VERSES_STORE } from '../data/verses';
import { Ayah } from '../types/quran';
import confetti from 'canvas-confetti';

interface HafidzTrainerProps {
  onSelectSurahForReader: (surahNum: number) => void;
}

export const HafidzTrainer: React.FC<HafidzTrainerProps> = ({ onSelectSurahForReader }) => {
  const [activeMode, setActiveMode] = useState<'sambung' | 'scramble' | 'blind' | 'tracker'>('sambung');

  // --- Mode 1: Sambung Ayat State ---
  const [quizSurahNum, setQuizSurahNum] = useState<number>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [sambungSelectedOption, setSambungSelectedOption] = useState<number | null>(null);
  const [sambungStreak, setSambungStreak] = useState<number>(0);
  const [sambungScore, setSambungScore] = useState<number>(0);

  // Available surahs with full offline verses for quiz
  const availableQuizSurahs = [1, 93, 94, 97, 103, 108, 109, 110, 111, 112, 113, 114];

  const currentAyahs: Ayah[] = OFFLINE_VERSES_STORE[quizSurahNum] || OFFLINE_VERSES_STORE[1];
  const maxQIndex = Math.max(0, currentAyahs.length - 2);
  const promptAyah = currentAyahs[currentQuestionIndex] || currentAyahs[0];
  const correctNextAyah = currentAyahs[currentQuestionIndex + 1] || currentAyahs[1];

  // Generate 4 options for Sambung Ayat
  const sambungOptions = React.useMemo(() => {
    const options = [correctNextAyah];
    // Gather other random ayahs
    const otherAyahs: Ayah[] = [];
    availableQuizSurahs.forEach(sNum => {
      const list = OFFLINE_VERSES_STORE[sNum] || [];
      list.forEach(a => {
        if (a.arab !== correctNextAyah.arab && a.arab !== promptAyah.arab) {
          otherAyahs.push(a);
        }
      });
    });

    // Shuffle and pick 3 wrong options
    const shuffledOthers = [...otherAyahs].sort(() => 0.5 - Math.random());
    options.push(...shuffledOthers.slice(0, 3));
    return options.sort(() => 0.5 - Math.random());
  }, [quizSurahNum, currentQuestionIndex]);

  const handleSambungAnswer = (idx: number) => {
    if (sambungSelectedOption !== null) return;
    setSambungSelectedOption(idx);

    const isCorrect = sambungOptions[idx].arab === correctNextAyah.arab;
    if (isCorrect) {
      setSambungStreak(prev => prev + 1);
      setSambungScore(prev => prev + 10);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } else {
      setSambungStreak(0);
    }
  };

  const handleNextSambungQuestion = () => {
    setSambungSelectedOption(null);
    if (currentQuestionIndex < maxQIndex) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Pick next available quiz surah
      const nextIdx = (availableQuizSurahs.indexOf(quizSurahNum) + 1) % availableQuizSurahs.length;
      setQuizSurahNum(availableQuizSurahs[nextIdx]);
      setCurrentQuestionIndex(0);
    }
  };

  // --- Mode 2: Word Scramble State ---
  const [scrambleSurahNum, setScrambleSurahNum] = useState<number>(112); // Default Al-Ikhlas
  const [scrambleAyahIdx, setScrambleAyahIdx] = useState<number>(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [userSelectedWords, setUserSelectedWords] = useState<string[]>([]);
  const [isScrambleCorrect, setIsScrambleCorrect] = useState<boolean | null>(null);

  const targetAyahForScramble = (OFFLINE_VERSES_STORE[scrambleSurahNum] || OFFLINE_VERSES_STORE[112])[scrambleAyahIdx];

  useEffect(() => {
    if (targetAyahForScramble) {
      const words = targetAyahForScramble.arab.split(' ').filter(w => w.trim() !== '');
      setScrambledWords([...words].sort(() => 0.5 - Math.random()));
      setUserSelectedWords([]);
      setIsScrambleCorrect(null);
    }
  }, [scrambleSurahNum, scrambleAyahIdx]);

  const handlePickWord = (word: string, indexInScrambled: number) => {
    if (isScrambleCorrect) return;
    setUserSelectedWords(prev => [...prev, word]);
    setScrambledWords(prev => prev.filter((_, i) => i !== indexInScrambled));
  };

  const handleRemoveWord = (word: string, indexInSelected: number) => {
    if (isScrambleCorrect) return;
    setUserSelectedWords(prev => prev.filter((_, i) => i !== indexInSelected));
    setScrambledWords(prev => [...prev, word]);
  };

  const checkScramble = () => {
    const userString = userSelectedWords.join(' ');
    const originalString = targetAyahForScramble.arab;
    const correct = userString === originalString;
    setIsScrambleCorrect(correct);
    if (correct) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
  };

  // --- Mode 3: Blind / Peek Mode State ---
  const [blindSurahNum, setBlindSurahNum] = useState<number>(1);
  const [blindDifficulty, setBlindDifficulty] = useState<'blur' | 'first-word' | 'hidden'>('blur');
  const [peekingAyah, setPeekingAyah] = useState<number | null>(null);

  const triggerPeek = (ayahNum: number) => {
    setPeekingAyah(ayahNum);
    setTimeout(() => {
      setPeekingAyah(null);
    }, 2500);
  };

  // --- Mode 4: Memorization Tracker State ---
  const [hafalanStatus, setHafalanStatus] = useState<Record<number, 'belum' | 'proses' | 'mutqin'>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hafidz_tracker');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    // Default starter
    return { 1: 'mutqin', 112: 'mutqin', 113: 'mutqin', 114: 'mutqin' };
  });

  const updateStatus = (surahNum: number, status: 'belum' | 'proses' | 'mutqin') => {
    const updated = { ...hafalanStatus, [surahNum]: status };
    setHafalanStatus(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hafidz_tracker', JSON.stringify(updated));
    }
  };

  const totalMutqinSurahs = Object.values(hafalanStatus).filter(s => s === 'mutqin').length;
  const totalProsesSurahs = Object.values(hafalanStatus).filter(s => s === 'proses').length;
  const juz30Mutqin = SURAHS_LIST.filter(s => s.juzNumber === 30 && hafalanStatus[s.number] === 'mutqin').length;

  return (
    <div className="space-y-6 pb-28">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Studio Pelatihan & Uji Ingatan Penghafal Al-Qur'an</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Fitur Latihan Hafidz
          </h1>
          <p className="text-sm text-slate-300">
            Kuatkan hafalan Anda dengan metode interaktif: Sambung Lanjutan Ayat, Susun Kata Acak, Mode Teks Buram/Intip (Peek Mode), serta Pelacak Kelancaran Mutqin.
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveMode('sambung')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeMode === 'sambung'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>1. Sambung Ayat</span>
        </button>

        <button
          onClick={() => setActiveMode('scramble')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeMode === 'scramble'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>2. Susun Kata Ayat</span>
        </button>

        <button
          onClick={() => setActiveMode('blind')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeMode === 'blind'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <EyeOff className="w-4 h-4 text-rose-400" />
          <span>3. Mode Teks Buram (Blind / Peek)</span>
        </button>

        <button
          onClick={() => setActiveMode('tracker')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeMode === 'tracker'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>4. Tracker & Target Mutqin</span>
        </button>
      </div>

      {/* ================= MODE 1: SAMBUNG AYAT ================= */}
      {activeMode === 'sambung' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">
                QS. {SURAHS_LIST.find(s => s.number === quizSurahNum)?.nameLatin} [Ayat {promptAyah.numberInSurah}]
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>Streak: {sambungStreak}</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Skor: {sambungScore}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-center">
            <div className="text-xs font-medium text-slate-400">
              Pertanyaan: Sambunglah ayat kelanjutan dari potongan berikut:
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-arabic text-2xl sm:text-3xl text-emerald-300 font-bold leading-loose">
                {promptAyah.arab}
              </div>
              <div className="text-xs text-amber-200/80 italic">{promptAyah.latin}</div>
              <div className="text-xs text-slate-400">"{promptAyah.translation}"</div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {sambungOptions.map((opt, idx) => {
              const isSelected = sambungSelectedOption === idx;
              const isCorrect = opt.arab === correctNextAyah.arab;

              let style = 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 text-slate-200';
              if (sambungSelectedOption !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50';
                } else if (isSelected) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSambungAnswer(idx)}
                  disabled={sambungSelectedOption !== null}
                  className={`w-full p-4 rounded-xl border text-right transition-all space-y-1 ${style}`}
                >
                  <div className="font-arabic text-xl font-bold">{opt.arab}</div>
                  <div className="text-left text-[11px] text-slate-400 line-clamp-1 italic">{opt.latin}</div>
                </button>
              );
            })}
          </div>

          {sambungSelectedOption !== null && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextSambungQuestion}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                Lanjut Soal Berikutnya →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= MODE 2: SUSUN KATA AYAT ================= */}
      {activeMode === 'scramble' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200">
              Susun Kata: QS. {SURAHS_LIST.find(s => s.number === scrambleSurahNum)?.nameLatin} Ayat {targetAyahForScramble?.numberInSurah}
            </h3>

            <select
              value={scrambleSurahNum}
              onChange={(e) => {
                setScrambleSurahNum(Number(e.target.value));
                setScrambleAyahIdx(0);
              }}
              className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200"
            >
              <option value="112">Al-Ikhlas</option>
              <option value="113">Al-Falaq</option>
              <option value="114">An-Nas</option>
              <option value="108">Al-Kausar</option>
              <option value="103">Al-'Asr</option>
              <option value="94">Asy-Syarh</option>
            </select>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-slate-400">
              Terjemahan target: <span className="text-slate-200 italic">"{targetAyahForScramble?.translation}"</span>
            </p>
          </div>

          {/* User's Arranged Words Slot */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[90px] flex flex-wrap items-center justify-center gap-2">
            {userSelectedWords.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                Klik kata-kata acak di bawah ini untuk menyusun urutan yang benar
              </span>
            ) : (
              userSelectedWords.map((word, i) => (
                <button
                  key={i}
                  onClick={() => handleRemoveWord(word, i)}
                  className="font-arabic text-xl px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold hover:bg-rose-950/60 hover:border-rose-500 hover:text-rose-300 transition-colors"
                  title="Klik untuk menghapus"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Scrambled Words Pool */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400">Pilihan kata acak:</span>
            <div className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              {scrambledWords.map((word, i) => (
                <button
                  key={i}
                  onClick={() => handlePickWord(word, i)}
                  className="font-arabic text-xl px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Check Button & Result */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                const words = targetAyahForScramble.arab.split(' ').filter(w => w.trim() !== '');
                setScrambledWords([...words].sort(() => 0.5 - Math.random()));
                setUserSelectedWords([]);
                setIsScrambleCorrect(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Susunan</span>
            </button>

            <button
              onClick={checkScramble}
              disabled={scrambledWords.length > 0}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                scrambledWords.length === 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Periksa Susunan
            </button>
          </div>

          {isScrambleCorrect !== null && (
            <div className={`p-4 rounded-xl border text-center text-xs font-semibold ${
              isScrambleCorrect
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}>
              {isScrambleCorrect ? (
                <div>
                  🎉 Masha Allah! Susunan ayat Anda tepat 100%!
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        const surahList = OFFLINE_VERSES_STORE[scrambleSurahNum];
                        if (scrambleAyahIdx < surahList.length - 1) {
                          setScrambleAyahIdx(prev => prev + 1);
                        } else {
                          setScrambleAyahIdx(0);
                        }
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs"
                    >
                      Lanjut Ayat Berikutnya
                    </button>
                  </div>
                </div>
              ) : (
                'Urutan kata belum tepat. Silakan coba atur kembali urutan katanya.'
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= MODE 3: BLIND / PEEK MODE ================= */}
      {activeMode === 'blind' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Pilih Surah Latihan:</span>
              <select
                value={blindSurahNum}
                onChange={(e) => setBlindSurahNum(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-200"
              >
                {availableQuizSurahs.map(num => (
                  <option key={num} value={num}>
                    {num}. {SURAHS_LIST.find(s => s.number === num)?.nameLatin}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setBlindDifficulty('blur')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  blindDifficulty === 'blur' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Teks Buram (Blur)
              </button>
              <button
                onClick={() => setBlindDifficulty('first-word')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  blindDifficulty === 'first-word' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Kata Awal Saja
              </button>
              <button
                onClick={() => setBlindDifficulty('hidden')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  blindDifficulty === 'hidden' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Tutup Total (Uji Mandiri)
              </button>
            </div>
          </div>

          {/* Verses in Blind Mode */}
          <div className="space-y-3">
            {(OFFLINE_VERSES_STORE[blindSurahNum] || OFFLINE_VERSES_STORE[1]).map(ayah => {
              const isPeeking = peekingAyah === ayah.numberInSurah;

              let textDisplay = ayah.arab;
              let filterClass = '';

              if (!isPeeking) {
                if (blindDifficulty === 'blur') {
                  filterClass = 'blur-sm select-none transition-all';
                } else if (blindDifficulty === 'first-word') {
                  const words = ayah.arab.split(' ');
                  textDisplay = `${words[0]} ... (${words.length - 1} kata tersembunyi)`;
                } else if (blindDifficulty === 'hidden') {
                  textDisplay = '••••••••••••••••••••••••••••••';
                  filterClass = 'text-slate-600 tracking-widest';
                }
              }

              return (
                <div
                  key={ayah.numberInSurah}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {ayah.numberInSurah}
                    </span>
                    <button
                      onClick={() => triggerPeek(ayah.numberInSurah)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isPeeking ? 'Mengintip (2d)...' : 'Intip Teks'}</span>
                    </button>
                  </div>

                  <div className="w-full text-right">
                    <div className={`font-arabic text-2xl sm:text-3xl text-emerald-300 font-bold ${filterClass}`}>
                      {textDisplay}
                    </div>
                    {isPeeking && (
                      <div className="text-xs text-slate-400 mt-1 italic">
                        "{ayah.translation}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODE 4: TRACKER MUTQIN ================= */}
      {activeMode === 'tracker' && (
        <div className="space-y-6">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Total Surah Mutqin</span>
              <div className="text-2xl font-bold text-emerald-400">
                {totalMutqinSurahs} <span className="text-xs text-slate-500 font-normal">/ 114 Surah</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(totalMutqinSurahs / 114) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Khusus Juz 30 ('Amma)</span>
              <div className="text-2xl font-bold text-amber-400">
                {juz30Mutqin} <span className="text-xs text-slate-500 font-normal">/ 37 Surah</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(juz30Mutqin / 37) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Sedang Dihafal (Proses)</span>
              <div className="text-2xl font-bold text-cyan-400">
                {totalProsesSurahs} <span className="text-xs text-slate-500 font-normal">Surah</span>
              </div>
              <span className="text-[11px] text-slate-500 block pt-1">
                Data tersimpan otomatis di browser
              </span>
            </div>
          </div>

          {/* Checklist 114 Surah Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">
                Daftar Capaian Hafalan 114 Surah
              </h3>
              <span className="text-xs text-slate-400">
                Pilih status: Belum / Proses / Mutqin
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
              {SURAHS_LIST.map(surah => {
                const status = hafalanStatus[surah.number] || 'belum';

                return (
                  <div
                    key={surah.number}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {surah.number}. {surah.nameLatin}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Juz {surah.juzNumber} · {surah.numberOfAyahs} Ayat
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateStatus(surah.number, 'belum')}
                        className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                          status === 'belum'
                            ? 'bg-slate-800 text-slate-300 font-bold border border-slate-700'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Belum
                      </button>
                      <button
                        onClick={() => updateStatus(surah.number, 'proses')}
                        className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                          status === 'proses'
                            ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/40'
                            : 'text-slate-500 hover:text-amber-300'
                        }`}
                      >
                        Proses
                      </button>
                      <button
                        onClick={() => updateStatus(surah.number, 'mutqin')}
                        className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                          status === 'mutqin'
                            ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40'
                            : 'text-slate-500 hover:text-emerald-300'
                        }`}
                      >
                        Mutqin ✓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, HelpCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { TAJWID_RULES, TAJWID_QUIZZES } from '../data/tajwid';
import confetti from 'canvas-confetti';

export const TajwidGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'rules' | 'quiz'>('rules');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const categories = ['all', 'Nun Sukun & Tanwin', 'Mim Sukun', 'Qalqalah (Pantulan)', 'Hukum Mad (Panjang)', 'Ghunnah'];

  const filteredRules = selectedCategory === 'all'
    ? TAJWID_RULES
    : TAJWID_RULES.filter(r => r.category === selectedCategory);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing after answer
    setSelectedOption(idx);

    const isCorrect = idx === TAJWID_QUIZZES[currentQuizIndex].correctIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < TAJWID_QUIZZES.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Kaidah & Hukum Tajwid Al-Qur'an</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ensiklopedi Tajwid Interaktif
          </h1>
          <p className="text-sm text-slate-300">
            Pelajari hukum nun sukun, mim sukun, qalqalah, dan mad dengan contoh praktis, visual warna tajwid, serta uji pemahaman melalui kuis interaktif.
          </p>
        </div>
      </div>

      {/* Mode Switcher: Panduan Kaidah vs Kuis Tajwid */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rules'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panduan Kaidah Hukum</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Kuis Uji Tajwid ({TAJWID_QUIZZES.length} Soal)</span>
          </button>
        </div>

        {/* Category filters if on rules view */}
        {activeTab === 'rules' && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rules Content */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map(rule => (
            <div
              key={rule.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {rule.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                    <span>{rule.name}</span>
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: rule.colorHex }}
                      title={`Indikator warna: ${rule.colorHex}`}
                    />
                  </h3>
                </div>
                <div className="font-arabic text-xl text-emerald-300 font-bold">
                  {rule.arabicName}
                </div>
              </div>

              {/* Huruf & Deskripsi */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Huruf-huruf:</div>
                  <div className="text-xs text-amber-300 font-arabic font-semibold mt-0.5">
                    {rule.letters}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Kaidah / Pengertian:</div>
                  <div className="text-xs text-slate-300 leading-relaxed mt-0.5">
                    {rule.description}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-400 font-medium">Cara Membaca:</div>
                  <div className="text-xs text-slate-200 font-medium mt-0.5">
                    {rule.howToRead}
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">Contoh Ayat dalam Al-Qur'an:</div>
                <div className="grid grid-cols-1 gap-2">
                  {rule.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[11px] text-slate-400 block">{ex.surahInfo}</span>
                        <span className="text-xs text-slate-300 font-medium">{ex.note}</span>
                      </div>
                      <div className="font-arabic text-xl font-bold text-right" style={{ color: rule.colorHex }}>
                        {ex.phrase}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Content */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {!quizFinished ? (
            <>
              {/* Quiz Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Soal {currentQuizIndex + 1} dari {TAJWID_QUIZZES.length}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Skor: {quizScore}
                </span>
              </div>

              {/* Question & Arabic Display */}
              <div className="space-y-4 text-center">
                <h3 className="text-base font-semibold text-slate-100">
                  {TAJWID_QUIZZES[currentQuizIndex].question}
                </h3>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 my-4">
                  <div className="font-arabic text-3xl text-emerald-300 font-bold">
                    {TAJWID_QUIZZES[currentQuizIndex].arabicText}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Fokus pada lafal: <span className="text-amber-400 font-arabic text-sm">{TAJWID_QUIZZES[currentQuizIndex].highlightedPart}</span>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {TAJWID_QUIZZES[currentQuizIndex].options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === TAJWID_QUIZZES[currentQuizIndex].correctIndex;

                  let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800';

                  if (selectedOption !== null) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-3.5 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && (
                        <span>
                          {isCorrectAnswer ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          ) : null}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Explanation */}
              {selectedOption !== null && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Penjelasan Kaidah:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {TAJWID_QUIZZES[currentQuizIndex].explanation}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                    >
                      {currentQuizIndex < TAJWID_QUIZZES.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Selesai & Lihat Skor'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Alhamdulillah, Kuis Selesai!</h3>
              <p className="text-sm text-slate-300">
                Skor Anda: <strong className="text-emerald-400">{quizScore}</strong> dari {TAJWID_QUIZZES.length} Soal Benar
              </p>
              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ulangi Kuis Tajwid</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

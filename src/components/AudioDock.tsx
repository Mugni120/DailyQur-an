import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Gauge, Mic, Sparkles } from 'lucide-react';
import { audioEngine, AudioPlaybackState } from '../utils/audioEngine';
import { QARI_LIST } from '../data/qaris';
import { SURAHS_LIST } from '../data/surahs';

export const AudioDock: React.FC = () => {
  const [state, setState] = useState<AudioPlaybackState>(audioEngine.getState());
  const [showQariModal, setShowQariModal] = useState<boolean>(false);

  useEffect(() => {
    const unsub = audioEngine.subscribe(s => setState(s));
    return unsub;
  }, []);

  const currentQari = QARI_LIST.find(q => q.id === state.qariId) || QARI_LIST[0];
  const currentSurah = SURAHS_LIST.find(s => s.number === state.surahNumber) || SURAHS_LIST[0];

  const handleTogglePlay = () => {
    if (state.isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.resume();
    }
  };

  const handlePrevAyah = () => {
    if (state.ayahNumber > 1) {
      audioEngine.playAyah(state.surahNumber, state.ayahNumber - 1);
    }
  };

  const handleNextAyah = () => {
    if (state.ayahNumber < currentSurah.numberOfAyahs) {
      audioEngine.playAyah(state.surahNumber, state.ayahNumber + 1);
    }
  };

  const handleCycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(state.playbackRate) + 1) % speeds.length;
    audioEngine.setPlaybackRate(speeds[nextIdx]);
  };

  const handleCycleRepeat = () => {
    const repeats = [1, 3, 5, 10, 999];
    const nextIdx = (repeats.indexOf(state.repeatTarget) + 1) % repeats.length;
    audioEngine.setRepeatTarget(repeats[nextIdx]);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl py-2 px-4 transition-all">
        {/* Progress bar at the very top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
            style={{ width: `${state.progressPercent}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 h-16">
          {/* Left: Surah & Reciter Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowQariModal(true)}
              className="relative w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 hover:border-emerald-500/50 group transition-all"
              title="Ganti Qari / Tokoh Islam"
            >
              <Mic className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              {state.isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                  QS. {currentSurah.nameLatin}
                </span>
                <span className="text-xs text-emerald-400 font-semibold shrink-0">
                  : Ayat {state.ayahNumber}
                </span>
                {state.isSynthesizerMode && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                    Synthesizer
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowQariModal(true)}
                className="text-xs text-slate-400 hover:text-emerald-400 truncate flex items-center gap-1 transition-colors text-left"
              >
                <span>Qari: {currentQari.name}</span>
                <span className="text-[10px] text-slate-500">({currentQari.country})</span>
              </button>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrevAyah}
              disabled={state.ayahNumber <= 1}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Ayat Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all"
              title={state.isPlaying ? 'Jeda' : 'Putar'}
            >
              {state.isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextAyah}
              disabled={state.ayahNumber >= currentSurah.numberOfAyahs}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Ayat Berikutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Practice Settings (Repeat & Speed) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Repeat count button */}
            <button
              onClick={handleCycleRepeat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
              title="Ulangi Ayat (Untuk Menghafal)"
            >
              <Repeat className="w-3.5 h-3.5 text-emerald-400" />
              <span>{state.repeatTarget === 999 ? 'Loop' : `${state.repeatTarget}x`}</span>
              {state.repeatTarget > 1 && (
                <span className="text-[10px] text-emerald-400 font-mono">
                  ({state.currentRepeatCount}/{state.repeatTarget})
                </span>
              )}
            </button>

            {/* Playback rate button */}
            <button
              onClick={handleCycleSpeed}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors"
              title="Kecepatan Tilawah"
            >
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{state.playbackRate}x</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reciter (Qari) Selection Modal */}
      {showQariModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-slate-100">
                  Pilih Suara Qari / Tokoh Islam
                </h3>
              </div>
              <button
                onClick={() => setShowQariModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {QARI_LIST.map(qari => {
                const isSelected = qari.id === state.qariId;
                return (
                  <div
                    key={qari.id}
                    onClick={() => {
                      audioEngine.setQari(qari.id);
                      setShowQariModal(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        <span>{qari.name}</span>
                        <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {qari.country}
                        </span>
                      </div>
                      <div className="text-xs text-amber-400 font-medium mt-0.5">
                        Gaya: {qari.style}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {qari.description}
                      </div>
                    </div>

                    <div className="font-arabic text-lg text-emerald-400 font-bold shrink-0">
                      {qari.arabicName}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowQariModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

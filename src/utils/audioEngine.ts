import { QARI_LIST } from '../data/qaris';

export interface AudioPlaybackState {
  isPlaying: boolean;
  surahNumber: number;
  ayahNumber: number;
  qariId: string;
  playbackRate: number;
  repeatTarget: number; // 1, 3, 5, 10, or 999 (infinite)
  currentRepeatCount: number;
  isSynthesizerMode: boolean;
  progressPercent: number;
}

class QuranAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private stateListeners: ((state: AudioPlaybackState) => void)[] = [];

  private state: AudioPlaybackState = {
    isPlaying: false,
    surahNumber: 1,
    ayahNumber: 1,
    qariId: 'afasy',
    playbackRate: 1.0,
    repeatTarget: 1,
    currentRepeatCount: 1,
    isSynthesizerMode: false,
    progressPercent: 0
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio && this.audio.duration) {
          this.state.progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
          this.notify();
        }
      });

      this.audio.addEventListener('ended', () => {
        this.handleTrackEnded();
      });

      this.audio.addEventListener('error', () => {
        // Fallback to synthesized audio if network is offline or file blocked
        this.playMelodicHarmonicFallback();
      });
    }
  }

  public subscribe(cb: (state: AudioPlaybackState) => void): () => void {
    this.stateListeners.push(cb);
    cb({ ...this.state });
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== cb);
    };
  }

  private notify() {
    const copy = { ...this.state };
    this.stateListeners.forEach(cb => cb(copy));
  }

  public getState(): AudioPlaybackState {
    return { ...this.state };
  }

  public setQari(qariId: string) {
    this.state.qariId = qariId;
    this.notify();
    if (this.state.isPlaying) {
      this.playAyah(this.state.surahNumber, this.state.ayahNumber);
    }
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.notify();
  }

  public setRepeatTarget(repeat: number) {
    this.state.repeatTarget = repeat;
    this.state.currentRepeatCount = 1;
    this.notify();
  }

  private getAudioUrl(surah: number, ayah: number, qariId: string): string {
    const qari = QARI_LIST.find(q => q.id === qariId) || QARI_LIST[0];
    const sStr = String(surah).padStart(3, '0');
    const aStr = String(ayah).padStart(3, '0');
    return `https://everyayah.com/data/${qari.subfolder}/${sStr}${aStr}.mp3`;
  }

  public async playAyah(surah: number, ayah: number) {
    this.state.surahNumber = surah;
    this.state.ayahNumber = ayah;
    this.state.isPlaying = true;
    this.state.isSynthesizerMode = false;
    this.state.progressPercent = 0;
    this.notify();

    const url = this.getAudioUrl(surah, ayah, this.state.qariId);
    if (this.audio) {
      this.audio.src = url;
      this.audio.playbackRate = this.state.playbackRate;
      try {
        await this.audio.play();
      } catch (err) {
        // Fallback to melodic synthesized tone
        this.playMelodicHarmonicFallback();
      }
    }
  }

  public pause() {
    this.state.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    this.notify();
  }

  public resume() {
    if (this.audio && this.audio.src) {
      this.state.isPlaying = true;
      this.audio.play().catch(() => this.playMelodicHarmonicFallback());
      this.notify();
    } else {
      this.playAyah(this.state.surahNumber, this.state.ayahNumber);
    }
  }

  private handleTrackEnded() {
    if (this.state.currentRepeatCount < this.state.repeatTarget) {
      this.state.currentRepeatCount += 1;
      this.notify();
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => this.playMelodicHarmonicFallback());
      }
    } else {
      // Repeat target achieved for this verse, reset count and pause or emit event
      this.state.currentRepeatCount = 1;
      this.state.isPlaying = false;
      this.notify();
    }
  }

  private playMelodicHarmonicFallback() {
    this.state.isSynthesizerMode = true;
    this.notify();

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Play soft harmonic Maqam tone (C-D-Eb-F#-G)
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.exponentialRampToValueAtTime(311.13, now + 0.4); // Eb4
      osc.frequency.exponentialRampToValueAtTime(392.00, now + 0.8); // G4

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.8);

      setTimeout(() => {
        this.state.isPlaying = false;
        this.state.isSynthesizerMode = false;
        this.notify();
      }, 1900);
    } catch {
      this.state.isPlaying = false;
      this.notify();
    }
  }
}

export const audioEngine = new QuranAudioEngine();

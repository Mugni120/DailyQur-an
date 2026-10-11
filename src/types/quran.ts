export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Makkiyyah' | 'Madaniyyah';
  juzNumber: number;
  virtue?: string;
}

export interface Ayah {
  numberInSurah: number;
  numberInQuran: number;
  arab: string;
  latin: string;
  translation: string;
  tajwidColored?: string;
  juz: number;
  audioKey?: string;
}

export interface Qari {
  id: string;
  name: string;
  arabicName: string;
  country: string;
  style: string;
  subfolder: string;
  description: string;
}

export interface TajwidRule {
  id: string;
  category: string;
  name: string;
  arabicName: string;
  letters: string;
  description: string;
  howToRead: string;
  colorClass: string;
  colorHex: string;
  examples: {
    phrase: string;
    surahInfo: string;
    highlightWord: string;
    note: string;
  }[];
}

export interface TajwidQuiz {
  id: number;
  question: string;
  arabicText: string;
  highlightedPart: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HadithItem {
  id: number;
  category: string;
  title: string;
  arabic: string;
  translation: string;
  narrator: string;
  source: string;
  grade: 'Shahih' | 'Hasan';
  relatedSurahs?: number[];
}

export type ThemeMode = 'dark' | 'light' | 'sepia';
export type ActiveTab = 'surah-list' | 'reader' | 'tajwid' | 'hadith' | 'hafidz' | 'bookmarks';

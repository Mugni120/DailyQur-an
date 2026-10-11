import { TajwidRule, TajwidQuiz } from '../types/quran';

export const TAJWID_RULES: TajwidRule[] = [
  {
    id: 'idzhar-halqi',
    category: 'Nun Sukun & Tanwin',
    name: 'Idzhar Halqi',
    arabicName: 'إظهار حلقي',
    letters: 'ء , هـ , ع , ح , غ , خ (Hamzah, Ha\', \'Ain, Ha, Ghain, Kha\')',
    description: 'Apabila nun sukun (نْ) atau tanwin (ـًـٍـٌ) bertemu dengan salah satu dari enam huruf halaq (tenggorokan).',
    howToRead: 'Dibaca jelas, terang, tanpa mendengung (ghunnah), dan tidak tersendat-sendat.',
    colorClass: 'tajwid-idzhar',
    colorHex: '#38bdf8',
    examples: [
      { phrase: 'مِنْ خَوْفٍ', surahInfo: 'Quraisy: 4', highlightWord: 'مِنْ خَوْفٍ', note: 'Nun sukun bertemu Kha\' (خ)' },
      { phrase: 'عَنْهُمْ', surahInfo: 'Al-Bayyinah: 8', highlightWord: 'عَنْهُمْ', note: 'Nun sukun bertemu Ha\' (هـ)' },
      { phrase: 'عَذَابٌ أَلِيمٌ', surahInfo: 'Al-Baqarah: 10', highlightWord: 'عَذَابٌ أَلِيمٌ', note: 'Tanwin bertemu Hamzah (أ)' }
    ]
  },
  {
    id: 'idgham-bighunnah',
    category: 'Nun Sukun & Tanwin',
    name: 'Idgham Bighunnah',
    arabicName: 'إدغام بغنة',
    letters: 'ي , ن , م , و (Ya, Nun, Mim, Wawu - disingkat YaNMu/YaNMaW)',
    description: 'Apabila nun sukun (نْ) atau tanwin bertemu salah satu dari 4 huruf tersebut dalam dua kata terpisah.',
    howToRead: 'Memasukkan bunyi nun/tanwin ke huruf berikutnya disertai dengungan tertahan 2 harakat.',
    colorClass: 'tajwid-idgham-bighunnah',
    colorHex: '#2dd4bf',
    examples: [
      { phrase: 'مَن يَقُولُ', surahInfo: 'Al-Baqarah: 8', highlightWord: 'مَن يَقُولُ', note: 'Nun sukun melebur ke Ya\' dengan dengung' },
      { phrase: 'مِّن مَّالٍ', surahInfo: 'Al-Mu\'minun: 55', highlightWord: 'مِّن مَّالٍ', note: 'Nun sukun melebur ke Mim dengan dengung' },
      { phrase: 'خَيْرًا يَرَهُ', surahInfo: 'Az-Zalzalah: 7', highlightWord: 'خَيْرًا يَرَهُ', note: 'Tanwin melebur ke Ya\'' }
    ]
  },
  {
    id: 'idgham-bilaghunnah',
    category: 'Nun Sukun & Tanwin',
    name: 'Idgham Bilaghunnah',
    arabicName: 'إدغام بغير غنة',
    letters: 'ل , ر (Lam dan Ra\')',
    description: 'Apabila nun sukun atau tanwin bertemu dengan huruf Lam atau Ra\'.',
    howToRead: 'Memasukkan bunyi nun/tanwin seutuhnya ke dalam huruf Lam atau Ra\' secara bersih TANPA mendengung.',
    colorClass: 'tajwid-idgham-bilaghunnah',
    colorHex: '#c084fc',
    examples: [
      { phrase: 'مِّن لَّدُنْهُ', surahInfo: 'Al-Kahf: 2', highlightWord: 'مِّن لَّدُنْهُ', note: 'Nun sukun melebur murni ke Lam' },
      { phrase: 'مِّن رَّبِّهِمْ', surahInfo: 'Al-Baqarah: 5', highlightWord: 'مِّن رَّبِّهِمْ', note: 'Nun sukun melebur murni ke Ra\'' },
      { phrase: 'غَفُورٌ رَّحِيمٌ', surahInfo: 'Al-Baqarah: 173', highlightWord: 'غَفُورٌ رَّحِيمٌ', note: 'Tanwin melebur ke Ra\' tanpa dengung' }
    ]
  },
  {
    id: 'iqlab',
    category: 'Nun Sukun & Tanwin',
    name: 'Iqlab',
    arabicName: 'إقلاب',
    letters: 'ب (Ba\')',
    description: 'Apabila nun sukun atau tanwin bertemu dengan huruf Ba\'. Dalam mushaf biasanya ditandai huruf mim kecil (م).',
    howToRead: 'Mengubah bunyi nun atau tanwin menjadi bunyi huruf Mim (م) samar disertai dengung 2 harakat.',
    colorClass: 'tajwid-iqlab',
    colorHex: '#f59e0b',
    examples: [
      { phrase: 'مِنۢ بَعْدِ', surahInfo: 'Al-Baqarah: 27', highlightWord: 'مِنۢ بَعْدِ', note: 'Nun berubah bunyi Mim sebelum Ba\'' },
      { phrase: 'كَلَّا لَيُنۢبَذَنَّ', surahInfo: 'Al-Humazah: 4', highlightWord: 'لَيُنۢبَذَنَّ', note: 'Nun sukun bertemu Ba\' dalam satu kata' },
      { phrase: 'عَلِيمٌۢ بِذَاتِ الصُّدُورِ', surahInfo: 'Ali \'Imran: 119', highlightWord: 'عَلِيمٌۢ بِذَاتِ', note: 'Tanwin berubah Mim sebelum Ba\'' }
    ]
  },
  {
    id: 'ikhfa-haqiqi',
    category: 'Nun Sukun & Tanwin',
    name: 'Ikhfa\' Haqiqi',
    arabicName: 'إخفاء حقيقي',
    letters: 'ت , ث , ج , د , ذ , ز , س , ش , ص , ض , ط , ظ , ف , ق , ك (15 huruf)',
    description: 'Apabila nun sukun atau tanwin bertemu dengan salah satu dari 15 huruf ikhfa\'.',
    howToRead: 'Menyamarkan bacaan nun/tanwin antara idzhar dan idgham, siap melafalkan makhraj huruf berikutnya disertai dengung 2 harakat.',
    colorClass: 'tajwid-ikhfa',
    colorHex: '#fb7185',
    examples: [
      { phrase: 'مِن تَحْتِهَا', surahInfo: 'Al-Baqarah: 25', highlightWord: 'مِن تَحْتِهَا', note: 'Nun sukun samar sebelum Ta\'' },
      { phrase: 'كُنتُمْ', surahInfo: 'Al-Baqarah: 23', highlightWord: 'كُنتُمْ', note: 'Nun sukun samar sebelum Ta\'' },
      { phrase: 'مِن قَبْلُ', surahInfo: 'Al-Baqarah: 25', highlightWord: 'مِن قَبْلُ', note: 'Ikhfa tebal (Tafkhim) sebelum huruf Qaf' }
    ]
  },
  {
    id: 'ikhfa-syafawi',
    category: 'Mim Sukun',
    name: 'Ikhfa\' Syafawi',
    arabicName: 'إخفاء شفوي',
    letters: 'ب (Ba\')',
    description: 'Apabila mim sukun (مْ) bertemu dengan huruf Ba\' (ب).',
    howToRead: 'Membunyikan mim sukun dengan bibir dirapatkan perlahan (samar) disertai ghunnah / dengung 2 harakat.',
    colorClass: 'tajwid-ikhfa',
    colorHex: '#fb7185',
    examples: [
      { phrase: 'تَرْمِيهِم بِحِجَارَةٍ', surahInfo: 'Al-Fil: 4', highlightWord: 'تَرْمِيهِم بِحِجَارَةٍ', note: 'Mim sukun bertemu Ba\' didengungkan lembut' },
      { phrase: 'يَعْتَصِم بِاللَّهِ', surahInfo: 'Ali \'Imran: 101', highlightWord: 'يَعْتَصِم بِاللَّهِ', note: 'Bibir dirapatkan samar berharakat 2 hitungan' }
    ]
  },
  {
    id: 'idgham-mimi',
    category: 'Mim Sukun',
    name: 'Idgham Mimi (Mutamatsilain)',
    arabicName: 'إدغام مِثْلَيْنِ',
    letters: 'م (Mim)',
    description: 'Apabila mim sukun (مْ) bertemu dengan sesama huruf Mim bertasydid (مّ).',
    howToRead: 'Memasukkan mim pertama ke mim kedua dengan tasydid sempurna dan dengungan 2 harakat penuh.',
    colorClass: 'tajwid-idgham-bighunnah',
    colorHex: '#2dd4bf',
    examples: [
      { phrase: 'لَهُم مَّا يَشَاءُونَ', surahInfo: 'Az-Zumar: 34', highlightWord: 'لَهُم مَّا', note: 'Mim sukun melebur sempurna ke Mim bertasydid' },
      { phrase: 'فِي قُلُوبِهِم مَّرَضٌ', surahInfo: 'Al-Baqarah: 10', highlightWord: 'قُلُوبِهِم مَّرَضٌ', note: 'Dengung tebal 2 harakat' }
    ]
  },
  {
    id: 'idzhar-syafawi',
    category: 'Mim Sukun',
    name: 'Idzhar Syafawi',
    arabicName: 'إظهار شفوي',
    letters: 'Semua huruf hijaiyah kecuali Mim (م) dan Ba\' (ب) - berjumlah 26 huruf',
    description: 'Apabila mim sukun bertemu huruf apa saja selain Ba\' dan Mim. Sangat ditekankan jangan sampai samar terutama saat bertemu Wawu (و) dan Fa\' (ف).',
    howToRead: 'Dibaca terang dan jelas di bibir tanpa dengung.',
    colorClass: 'tajwid-idzhar',
    colorHex: '#38bdf8',
    examples: [
      { phrase: 'أَلَمْ تَرَ', surahInfo: 'Al-Fil: 1', highlightWord: 'أَلَمْ تَرَ', note: 'Mim sukun dibaca jelas sebelum Ta\'' },
      { phrase: 'عَلَيْهِمْ وَلَا الضَّالِّينَ', surahInfo: 'Al-Fatihah: 7', highlightWord: 'عَلَيْهِمْ وَلَا', note: 'Jelas sebelum Wawu, tidak boleh tertahan mendengung' }
    ]
  },
  {
    id: 'qalqalah',
    category: 'Qalqalah (Pantulan)',
    name: 'Qalqalah (Sughra, Kubra & Akbar)',
    arabicName: 'قلقلة',
    letters: 'ق , ط , ب , ج , د (Baju Di Thoko / Quthbu Jad)',
    description: 'Getaran suara yang memantul ketika huruf qalqalah berharakat sukun (asli atau waqaf). Terdiri dari Sughra (di tengah kata), Kubra (di akhir kata karena berhenti), dan Akbar (di akhir bertasydid).',
    howToRead: 'Dipantulkan dengan suara yang jelas tanpa menambah harakat vokal buatan.',
    colorClass: 'tajwid-qalqalah',
    colorHex: '#60a5fa',
    examples: [
      { phrase: 'يَجْعَلْ', surahInfo: 'Al-Fil: 2', highlightWord: 'يَجْعَلْ', note: 'Qalqalah Sughra: Jim di tengah kata memantul ringan' },
      { phrase: 'قُلْ هُوَ اللَّهُ أَحَدٌ', surahInfo: 'Al-Ikhlas: 1', highlightWord: 'أَحَدٌ', note: 'Qalqalah Kubra: Dal di akhir ayat saat waqaf memantul kuat' },
      { phrase: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', surahInfo: 'Al-Lahab: 1', highlightWord: 'وَتَبَّ', note: 'Qalqalah Akbar: Ba bertasydid saat waqaf, ditekan lalu dipantulkan mantap' }
    ]
  },
  {
    id: 'mad-thabii',
    category: 'Hukum Mad (Panjang)',
    name: 'Mad Thabi\'i (Asli)',
    arabicName: 'مد طبيعي',
    letters: 'Alif setelah fathah, Wawu sukun setelah dhammah, Ya\' sukun setelah kasrah',
    description: 'Pemanjangan suara yang mendasar dan murni tanpa sebab hamzah maupun sukun.',
    howToRead: 'Dipanjangkan tepat 2 harakat (1 alif), tidak boleh kurang dan tidak boleh berlebihan.',
    colorClass: 'tajwid-mad',
    colorHex: '#34d399',
    examples: [
      { phrase: 'نُوحِيهَا', surahInfo: 'Hud: 49', highlightWord: 'نُوحِيهَا', note: 'Mengumpulkan 3 huruf mad asli: Wawu, Ya\', dan Alif' },
      { phrase: 'قَالَ', surahInfo: 'Al-Baqarah: 30', highlightWord: 'قَالَ', note: 'Fathah diikuti Alif dipanjangkan 2 ketukan' }
    ]
  },
  {
    id: 'mad-wajib-muttashil',
    category: 'Hukum Mad (Panjang)',
    name: 'Mad Wajib Muttashil',
    arabicName: 'مد واجب متصل',
    letters: 'Mad Thabi\'i bertemu Hamzah (ء) dalam SATU KATA yang sama',
    description: 'Pertemuan huruf mad dengan hamzah di dalam sebuah kata utuh.',
    howToRead: 'Wajib dipanjangkan 4 sampai 5 harakat saat washal maupun waqaf.',
    colorClass: 'tajwid-mad',
    colorHex: '#34d399',
    examples: [
      { phrase: 'إِذَا جَاءَ نَصْرُ اللَّهِ', surahInfo: 'An-Nasr: 1', highlightWord: 'جَاءَ', note: 'Mad dan hamzah berada di satu kata, 4-5 harakat' },
      { phrase: 'السَّمَاءِ', surahInfo: 'Al-Baqarah: 22', highlightWord: 'السَّمَاءِ', note: 'Tanda alis melengkung di atas huruf mad' }
    ]
  },
  {
    id: 'mad-jaiz-munfashil',
    category: 'Hukum Mad (Panjang)',
    name: 'Mad Jaiz Munfashil',
    arabicName: 'مد جائز منفصل',
    letters: 'Mad Thabi\'i bertemu Hamzah dalam DUA KATA TERPISAH',
    description: 'Pertemuan huruf mad di akhir kata pertama dengan hamzah di awal kata kedua.',
    howToRead: 'Boleh dibaca 2, 4, atau 5 harakat (standar riwayat Hafsh dari \'Ashim jalur Syathibiyyah adalah 4-5 harakat).',
    colorClass: 'tajwid-mad',
    colorHex: '#34d399',
    examples: [
      { phrase: 'إِنَّا أَعْطَيْنَاكَ', surahInfo: 'Al-Kautsar: 1', highlightWord: 'إِنَّا أَعْطَيْنَاكَ', note: 'Innaa di kata pertama, A\'thaynaaka di kata kedua' },
      { phrase: 'يَا أَيُّهَا', surahInfo: 'Al-Baqarah: 21', highlightWord: 'يَا أَيُّهَا', note: 'Panjang 4-5 harakat' }
    ]
  },
  {
    id: 'ghunnah-musyaddadah',
    category: 'Ghunnah',
    name: 'Ghunnah Musyaddadah',
    arabicName: 'غنة مشددة',
    letters: 'Nun bertasydid (نّ) dan Mim bertasydid (مّ)',
    description: 'Huruf Nun atau Mim yang memiliki tanda tasydid di manapun posisinya.',
    howToRead: 'Wajib didengungkan secara penuh (Akmalu ma takun) selama 2 harakat bertempo stabil.',
    colorClass: 'tajwid-ghunnah',
    colorHex: '#f43f5e',
    examples: [
      { phrase: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', surahInfo: 'Asy-Syarh: 6', highlightWord: 'إِنَّ', note: 'Nun bertasydid didengungkan mantap' },
      { phrase: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', surahInfo: 'An-Nas: 1', highlightWord: 'النَّاسِ', note: 'Dengung terdengar lembut keluar dari rongga hidung (khoisyum)' }
    ]
  }
];

export const TAJWID_QUIZZES: TajwidQuiz[] = [
  {
    id: 1,
    question: 'Hukum tajwid apakah yang terdapat pada potongan ayat berikut saat nun sukun bertemu huruf Kha (خ)?',
    arabicText: 'مِنْ خَوْفٍ',
    highlightedPart: 'مِنْ خَـ',
    options: ['Idzhar Halqi', 'Idgham Bighunnah', 'Ikhfa Haqiqi', 'Iqlab'],
    correctIndex: 0,
    explanation: 'Huruf Kha (خ) adalah salah satu dari 6 huruf halaq (tenggorokan). Ketika nun sukun bertemu huruf halaq, maka hukumnya adalah Idzhar Halqi dan dibaca jelas tanpa dengung.'
  },
  {
    id: 2,
    question: 'Berapa panjang harakat yang wajib dibaca pada hukum Mad Wajib Muttashil (seperti pada kata جَاءَ)?',
    arabicText: 'إِذَا جَاءَ نَصْرُ اللَّهِ',
    highlightedPart: 'جَاءَ',
    options: ['2 harakat', '4 sampai 5 harakat', '8 harakat', '1 harakat'],
    correctIndex: 1,
    explanation: 'Mad Wajib Muttashil terjadi karena huruf mad bertemu hamzah dalam satu kata, hukumnya wajib dipanjangkan 4 sampai 5 harakat.'
  },
  {
    id: 3,
    question: 'Pada lafadz "مِنۢ بَعْدِ", bunyi nun sukun berubah menjadi suara huruf apakah?',
    arabicText: 'مِنۢ بَعْدِ',
    highlightedPart: 'مِنۢ بَـ',
    options: ['Tetap nun jelas', 'Suara Mim (م) samar disertai dengung (Iqlab)', 'Suara Wawu', 'Suara Ra tipis'],
    correctIndex: 1,
    explanation: 'Iqlab secara bahasa berarti membalik/mengubah. Bunyi nun sukun atau tanwin berubah menjadi suara Mim samar dengan dengungan 2 harakat saat bertemu huruf Ba.'
  },
  {
    id: 4,
    question: 'Manakah di bawah ini yang merupakan huruf Qalqalah?',
    arabicText: 'ق , ط , ب , ج , د',
    highlightedPart: 'ق-ط-ب-ج-د',
    options: ['Kaf, Lam, Mim, Nun', 'Qaf, Tha, Ba, Jim, Dal (Baju Di Thoko)', 'Kha, Shad, Dhad, Ghain', 'Fa, Wawu, Ha, Ya'],
    correctIndex: 1,
    explanation: 'Huruf qalqalah ada lima yang terangkum dalam lafadz "Quthbu Jad" (ق , ط , ب , ج , د). Huruf-huruf ini dipantulkan ketika sukun.'
  },
  {
    id: 5,
    question: 'Pada surah Al-Fil "تَرْمِيهِم بِحِجَارَةٍ", hukum tajwid antara mim sukun bertemu Ba (ب) disebut...',
    arabicText: 'تَرْمِيهِم بِحِجَارَةٍ',
    highlightedPart: 'ـهِم بِـ',
    options: ['Idzhar Syafawi', 'Ikhfa\' Syafawi', 'Idgham Mimi', 'Idzhar Halqi'],
    correctIndex: 1,
    explanation: 'Mim sukun yang bertemu huruf Ba (ب) hukumnya adalah Ikhfa\' Syafawi, dibaca samar di kedua bibir disertai dengungan 2 harakat.'
  }
];

/**
 * Ge'ez Fidel (ፊደል) Syllabary & Numeral Matrix
 * Detailed phonological and orthographic data for Classical Ethiopic
 */

export interface FidelGlyph {
  char: string;
  order: number; // 1 to 7
  orderName: string;
  seriesConsonant: string;
  seriesName: string;
  ipa: string;
  academic: string;
  vowel: string;
  frequencyRankInCorpus: number;
}

export interface FidelRow {
  consonant: string;
  name: string;
  ipaBase: string;
  academicBase: string;
  meaning: string;
  glyphs: FidelGlyph[];
}

export const GEEZ_VOWEL_ORDERS = [
  { order: 1, name: 'ግዕዝ (Gəʻəz)', roman: 'ä', ipa: 'ɐ', label: '1st Order' },
  { order: 2, name: 'ካዕብ (Kaʻəb)', roman: 'u', ipa: 'u', label: '2nd Order' },
  { order: 3, name: 'ሣልስ (Śaləs)', roman: 'i', ipa: 'i', label: '3rd Order' },
  { order: 4, name: 'ራብዕ (Rabəʻ)', roman: 'a', ipa: 'aː', label: '4th Order' },
  { order: 5, name: 'ኃምስ (Ḫaməs)', roman: 'e', ipa: 'e', label: '5th Order' },
  { order: 6, name: 'ሳድስ (Sadəs)', roman: 'ə', ipa: 'ɨ / ∅', label: '6th Order' },
  { order: 7, name: 'ሳብዕ (Sabəʻ)', roman: 'o', ipa: 'o', label: '7th Order' },
];

export const FIDEL_ROWS_DATA: FidelRow[] = [
  {
    consonant: 'ሆ',
    name: 'Hoy',
    ipaBase: 'h',
    academicBase: 'h',
    meaning: 'Breathing / aspirate',
    glyphs: [
      { char: 'ሀ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ሆ', seriesName: 'Hoy', ipa: '/ha/', academic: 'hä', vowel: 'ä', frequencyRankInCorpus: 14 },
      { char: 'ሁ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ሆ', seriesName: 'Hoy', ipa: '/hu/', academic: 'hu', vowel: 'u', frequencyRankInCorpus: 8 },
      { char: 'ሂ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ሆ', seriesName: 'Hoy', ipa: '/hi/', academic: 'hi', vowel: 'i', frequencyRankInCorpus: 42 },
      { char: 'ሃ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ሆ', seriesName: 'Hoy', ipa: '/haː/', academic: 'ha', vowel: 'a', frequencyRankInCorpus: 19 },
      { char: 'ሄ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ሆ', seriesName: 'Hoy', ipa: '/he/', academic: 'hē', vowel: 'e', frequencyRankInCorpus: 88 },
      { char: 'ህ', order: 6, orderName: 'Sadəs', seriesConsonant: 'ሆ', seriesName: 'Hoy', ipa: '/h/', academic: 'hə', vowel: 'ə', frequencyRankInCorpus: 55 },
      { char: 'ሆ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ሆ', seriesName: 'Hoy', ipa: '/ho/', academic: 'hō', vowel: 'o', frequencyRankInCorpus: 76 },
    ],
  },
  {
    consonant: 'ለ',
    name: 'Lawi',
    ipaBase: 'l',
    academicBase: 'l',
    meaning: 'Tongue / lateral',
    glyphs: [
      { char: 'ለ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ለ', seriesName: 'Lawi', ipa: '/la/', academic: 'lä', vowel: 'ä', frequencyRankInCorpus: 2 },
      { char: 'ሉ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ለ', seriesName: 'Lawi', ipa: '/lu/', academic: 'lu', vowel: 'u', frequencyRankInCorpus: 31 },
      { char: 'ሊ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ለ', seriesName: 'Lawi', ipa: '/li/', academic: 'li', vowel: 'i', frequencyRankInCorpus: 27 },
      { char: 'ላ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ለ', seriesName: 'Lawi', ipa: '/laː/', academic: 'la', vowel: 'a', frequencyRankInCorpus: 22 },
      { char: 'ሌ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ለ', seriesName: 'Lawi', ipa: '/le/', academic: 'lē', vowel: 'e', frequencyRankInCorpus: 64 },
      { char: 'ል', order: 6, orderName: 'Sadəs', seriesConsonant: 'ለ', seriesName: 'Lawi', ipa: '/l/', academic: 'lə', vowel: 'ə', frequencyRankInCorpus: 4 },
      { char: 'ሎ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ለ', seriesName: 'Lawi', ipa: '/lo/', academic: 'lō', vowel: 'o', frequencyRankInCorpus: 35 },
    ],
  },
  {
    consonant: 'ሐ',
    name: 'Ḥawt',
    ipaBase: 'ħ',
    academicBase: 'ḥ',
    meaning: 'Voiceless pharyngeal fricative',
    glyphs: [
      { char: 'ሐ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ሐ', seriesName: 'Ḥawt', ipa: '/ħa/', academic: 'ḥä', vowel: 'ä', frequencyRankInCorpus: 29 },
      { char: 'ሑ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ሐ', seriesName: 'Ḥawt', ipa: '/ħu/', academic: 'ḥu', vowel: 'u', frequencyRankInCorpus: 48 },
      { char: 'ሒ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ሐ', seriesName: 'Ḥawt', ipa: '/ħi/', academic: 'ḥi', vowel: 'i', frequencyRankInCorpus: 85 },
      { char: 'ሓ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ሐ', seriesName: 'Ḥawt', ipa: '/ħaː/', academic: 'ḥa', vowel: 'a', frequencyRankInCorpus: 50 },
      { char: 'ሔ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ሐ', seriesName: 'Ḥawt', ipa: '/ħe/', academic: 'ḥē', vowel: 'e', frequencyRankInCorpus: 12 },
      { char: 'ሕ', order: 6, orderName: 'Sadəs', seriesConsonant: 'ሐ', seriesName: 'Ḥawt', ipa: '/ħ/', academic: 'ḥə', vowel: 'ə', frequencyRankInCorpus: 16 },
      { char: 'ሖ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ሐ', seriesName: 'Ḥawt', ipa: '/ħo/', academic: 'ḥō', vowel: 'o', frequencyRankInCorpus: 92 },
    ],
  },
  {
    consonant: 'መ',
    name: 'May',
    ipaBase: 'm',
    academicBase: 'm',
    meaning: 'Water / bilabial nasal',
    glyphs: [
      { char: 'መ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'መ', seriesName: 'May', ipa: '/ma/', academic: 'mä', vowel: 'ä', frequencyRankInCorpus: 5 },
      { char: 'ሙ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'መ', seriesName: 'May', ipa: '/mu/', academic: 'mu', vowel: 'u', frequencyRankInCorpus: 11 },
      { char: 'ሚ', order: 3, orderName: 'Śaləs', seriesConsonant: 'መ', seriesName: 'May', ipa: '/mi/', academic: 'mi', vowel: 'i', frequencyRankInCorpus: 40 },
      { char: 'ማ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'መ', seriesName: 'May', ipa: '/maː/', academic: 'ma', vowel: 'a', frequencyRankInCorpus: 23 },
      { char: 'ሜ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'መ', seriesName: 'May', ipa: '/me/', academic: 'mē', vowel: 'e', frequencyRankInCorpus: 78 },
      { char: 'ም', order: 6, orderName: 'Sadəs', seriesConsonant: 'መ', seriesName: 'May', ipa: '/m/', academic: 'mə', vowel: 'ə', frequencyRankInCorpus: 7 },
      { char: 'ሞ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'መ', seriesName: 'May', ipa: '/mo/', academic: 'mō', vowel: 'o', frequencyRankInCorpus: 49 },
    ],
  },
  {
    consonant: 'ሠ',
    name: 'Śawt',
    ipaBase: 'ɬ / sʼ',
    academicBase: 'ś',
    meaning: 'Lateral fricative / ejective dental',
    glyphs: [
      { char: 'ሠ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ሠ', seriesName: 'Śawt', ipa: '/ɬa/', academic: 'śä', vowel: 'ä', frequencyRankInCorpus: 60 },
      { char: 'ሡ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ሠ', seriesName: 'Śawt', ipa: '/ɬu/', academic: 'śu', vowel: 'u', frequencyRankInCorpus: 99 },
      { char: 'ሢ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ሠ', seriesName: 'Śawt', ipa: '/ɬi/', academic: 'śi', vowel: 'i', frequencyRankInCorpus: 110 },
      { char: 'ሣ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ሠ', seriesName: 'Śawt', ipa: '/ɬaː/', academic: 'śa', vowel: 'a', frequencyRankInCorpus: 66 },
      { char: 'ሤ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ሠ', seriesName: 'Śawt', ipa: '/ɬe/', academic: 'śē', vowel: 'e', frequencyRankInCorpus: 115 },
      { char: 'ሥ', order: 6, orderName: 'Sadəs', seriesConsonant: 'ሠ', seriesName: 'Śawt', ipa: '/ɬ/', academic: 'śə', vowel: 'ə', frequencyRankInCorpus: 26 },
      { char: 'ሦ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ሠ', seriesName: 'Śawt', ipa: '/ɬo/', academic: 'śō', vowel: 'o', frequencyRankInCorpus: 125 },
    ],
  },
  {
    consonant: 'ረ',
    name: 'Rəʼs',
    ipaBase: 'r',
    academicBase: 'r',
    meaning: 'Head / alveolar trill',
    glyphs: [
      { char: 'ረ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ረ', seriesName: 'Rəʼs', ipa: '/ra/', academic: 'rä', vowel: 'ä', frequencyRankInCorpus: 13 },
      { char: 'ሩ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ረ', seriesName: 'Rəʼs', ipa: '/ru/', academic: 'ru', vowel: 'u', frequencyRankInCorpus: 54 },
      { char: 'ሪ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ረ', seriesName: 'Rəʼs', ipa: '/ri/', academic: 'ri', vowel: 'i', frequencyRankInCorpus: 51 },
      { char: 'ራ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ረ', seriesName: 'Rəʼs', ipa: '/raː/', academic: 'ra', vowel: 'a', frequencyRankInCorpus: 33 },
      { char: 'ሬ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ረ', seriesName: 'Rəʼs', ipa: '/re/', academic: 'rē', vowel: 'e', frequencyRankInCorpus: 81 },
      { char: 'ር', order: 6, orderName: 'Sadəs', seriesConsonant: 'ረ', seriesName: 'Rəʼs', ipa: '/r/', academic: 'rə', vowel: 'ə', frequencyRankInCorpus: 6 },
      { char: 'ሮ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ረ', seriesName: 'Rəʼs', ipa: '/ro/', academic: 'rō', vowel: 'o', frequencyRankInCorpus: 62 },
    ],
  },
  {
    consonant: 'ሰ',
    name: 'Sat',
    ipaBase: 's',
    academicBase: 's',
    meaning: 'Voiceless alveolar fricative',
    glyphs: [
      { char: 'ሰ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ሰ', seriesName: 'Sat', ipa: '/sa/', academic: 'sä', vowel: 'ä', frequencyRankInCorpus: 17 },
      { char: 'ሱ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ሰ', seriesName: 'Sat', ipa: '/su/', academic: 'su', vowel: 'u', frequencyRankInCorpus: 47 },
      { char: 'ሲ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ሰ', seriesName: 'Sat', ipa: '/si/', academic: 'si', vowel: 'i', frequencyRankInCorpus: 80 },
      { char: 'ሳ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ሰ', seriesName: 'Sat', ipa: '/saː/', academic: 'sa', vowel: 'a', frequencyRankInCorpus: 41 },
      { char: 'ሴ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ሰ', seriesName: 'Sat', ipa: '/se/', academic: 'sē', vowel: 'e', frequencyRankInCorpus: 90 },
      { char: 'ስ', order: 6, orderName: 'Sadəs', seriesConsonant: 'ሰ', seriesName: 'Sat', ipa: '/s/', academic: 'sə', vowel: 'ə', frequencyRankInCorpus: 9 },
      { char: 'ሶ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ሰ', seriesName: 'Sat', ipa: '/so/', academic: 'sō', vowel: 'o', frequencyRankInCorpus: 61 },
    ],
  },
  {
    consonant: 'ቀ',
    name: 'Qaf',
    ipaBase: 'kʼ',
    academicBase: 'q',
    meaning: 'Ejective velar stop',
    glyphs: [
      { char: 'ቀ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ቀ', seriesName: 'Qaf', ipa: '/kʼa/', academic: 'qä', vowel: 'ä', frequencyRankInCorpus: 37 },
      { char: 'ቁ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ቀ', seriesName: 'Qaf', ipa: '/kʼu/', academic: 'qu', vowel: 'u', frequencyRankInCorpus: 74 },
      { char: 'ቂ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ቀ', seriesName: 'Qaf', ipa: '/kʼi/', academic: 'qi', vowel: 'i', frequencyRankInCorpus: 98 },
      { char: 'ቃ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ቀ', seriesName: 'Qaf', ipa: '/kʼaː/', academic: 'qa', vowel: 'a', frequencyRankInCorpus: 30 },
      { char: 'ቄ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ቀ', seriesName: 'Qaf', ipa: '/kʼe/', academic: 'qē', vowel: 'e', frequencyRankInCorpus: 114 },
      { char: 'ቅ', order: 6, orderName: 'Sadəs', seriesConsonant: 'ቀ', seriesName: 'Qaf', ipa: '/kʼ/', academic: 'qə', vowel: 'ə', frequencyRankInCorpus: 25 },
      { char: 'ቆ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ቀ', seriesName: 'Qaf', ipa: '/kʼo/', academic: 'qō', vowel: 'o', frequencyRankInCorpus: 89 },
    ],
  },
  {
    consonant: 'በ',
    name: 'Bet',
    ipaBase: 'b',
    academicBase: 'b',
    meaning: 'House / voiced bilabial stop',
    glyphs: [
      { char: 'በ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'በ', seriesName: 'Bet', ipa: '/ba/', academic: 'bä', vowel: 'ä', frequencyRankInCorpus: 3 },
      { char: 'ቡ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'በ', seriesName: 'Bet', ipa: '/bu/', academic: 'bu', vowel: 'u', frequencyRankInCorpus: 71 },
      { char: 'ቢ', order: 3, orderName: 'Śaləs', seriesConsonant: 'በ', seriesName: 'Bet', ipa: '/bi/', academic: 'bi', vowel: 'i', frequencyRankInCorpus: 44 },
      { char: 'ባ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'በ', seriesName: 'Bet', ipa: '/baː/', academic: 'ba', vowel: 'a', frequencyRankInCorpus: 34 },
      { char: 'ቤ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'በ', seriesName: 'Bet', ipa: '/be/', academic: 'bē', vowel: 'e', frequencyRankInCorpus: 24 },
      { char: 'ብ', order: 6, orderName: 'Sadəs', seriesConsonant: 'በ', seriesName: 'Bet', ipa: '/b/', academic: 'bə', vowel: 'ə', frequencyRankInCorpus: 15 },
      { char: 'ቦ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'በ', seriesName: 'Bet', ipa: '/bo/', academic: 'bō', vowel: 'o', frequencyRankInCorpus: 38 },
    ],
  },
  {
    consonant: 'ተ',
    name: 'Täw',
    ipaBase: 't',
    academicBase: 't',
    meaning: 'Mark / voiceless dental stop',
    glyphs: [
      { char: 'ተ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ተ', seriesName: 'Täw', ipa: '/ta/', academic: 'tä', vowel: 'ä', frequencyRankInCorpus: 10 },
      { char: 'ቱ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ተ', seriesName: 'Täw', ipa: '/tu/', academic: 'tu', vowel: 'u', frequencyRankInCorpus: 21 },
      { char: 'ቲ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ተ', seriesName: 'Täw', ipa: '/ti/', academic: 'ti', vowel: 'i', frequencyRankInCorpus: 43 },
      { char: 'ታ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ተ', seriesName: 'Täw', ipa: '/taː/', academic: 'ta', vowel: 'a', frequencyRankInCorpus: 32 },
      { char: 'ቴ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ተ', seriesName: 'Täw', ipa: '/te/', academic: 'tē', vowel: 'e', frequencyRankInCorpus: 57 },
      { char: 'ት', order: 6, orderName: 'Sadəs', seriesConsonant: 'ተ', seriesName: 'Täw', ipa: '/t/', academic: 'tə', vowel: 'ə', frequencyRankInCorpus: 5 },
      { char: 'ቶ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ተ', seriesName: 'Täw', ipa: '/to/', academic: 'tō', vowel: 'o', frequencyRankInCorpus: 53 },
    ],
  },
  {
    consonant: 'ነ',
    name: 'Nähs',
    ipaBase: 'n',
    academicBase: 'n',
    meaning: 'Alveolar nasal',
    glyphs: [
      { char: 'ነ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'ነ', seriesName: 'Nähs', ipa: '/na/', academic: 'nä', vowel: 'ä', frequencyRankInCorpus: 18 },
      { char: 'ኑ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'ነ', seriesName: 'Nähs', ipa: '/nu/', academic: 'nu', vowel: 'u', frequencyRankInCorpus: 52 },
      { char: 'ኒ', order: 3, orderName: 'Śaləs', seriesConsonant: 'ነ', seriesName: 'Nähs', ipa: '/ni/', academic: 'ni', vowel: 'i', frequencyRankInCorpus: 20 },
      { char: 'ና', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'ነ', seriesName: 'Nähs', ipa: '/naː/', academic: 'na', vowel: 'a', frequencyRankInCorpus: 28 },
      { char: 'ኔ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'ነ', seriesName: 'Nähs', ipa: '/ne/', academic: 'nē', vowel: 'e', frequencyRankInCorpus: 84 },
      { char: 'ን', order: 6, orderName: 'Sadəs', seriesConsonant: 'ነ', seriesName: 'Nähs', ipa: '/n/', academic: 'nə', vowel: 'ə', frequencyRankInCorpus: 11 },
      { char: 'ኖ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'ነ', seriesName: 'Nähs', ipa: '/no/', academic: 'nō', vowel: 'o', frequencyRankInCorpus: 72 },
    ],
  },
  {
    consonant: 'አ',
    name: 'ʼAlf',
    ipaBase: 'ʔ',
    academicBase: 'ʼ',
    meaning: 'Glottal stop',
    glyphs: [
      { char: 'አ', order: 1, orderName: 'Gəʻəz', seriesConsonant: 'አ', seriesName: 'ʼAlf', ipa: '/ʔa/', academic: 'ʼä', vowel: 'ä', frequencyRankInCorpus: 15 },
      { char: 'ኡ', order: 2, orderName: 'Kaʻəb', seriesConsonant: 'አ', seriesName: 'ʼAlf', ipa: '/ʔu/', academic: 'ʼu', vowel: 'u', frequencyRankInCorpus: 65 },
      { char: 'ኢ', order: 3, orderName: 'Śaləs', seriesConsonant: 'አ', seriesName: 'ʼAlf', ipa: '/ʔi/', academic: 'ʼi', vowel: 'i', frequencyRankInCorpus: 39 },
      { char: 'ኣ', order: 4, orderName: 'Rabəʻ', seriesConsonant: 'አ', seriesName: 'ʼAlf', ipa: '/ʔaː/', academic: 'ʼa', vowel: 'a', frequencyRankInCorpus: 77 },
      { char: 'ኤ', order: 5, orderName: 'Ḫaməs', seriesConsonant: 'አ', seriesName: 'ʼAlf', ipa: '/ʔe/', academic: 'ʼē', vowel: 'e', frequencyRankInCorpus: 68 },
      { char: 'እ', order: 6, orderName: 'Sadəs', seriesConsonant: 'አ', seriesName: 'ʼAlf', ipa: '/ʔ/', academic: 'ʼə', vowel: 'ə', frequencyRankInCorpus: 16 },
      { char: 'ኦ', order: 7, orderName: 'Sabəʻ', seriesConsonant: 'አ', seriesName: 'ʼAlf', ipa: '/ʔo/', academic: 'ʼō', vowel: 'o', frequencyRankInCorpus: 56 },
    ],
  },
];

/**
 * Converts Ge'ez Numeral string into integer
 */
export function parseGeezNumeral(geezStr: string): number {
  const map: Record<string, number> = {
    '፩': 1, '፪': 2, '፫': 3, '፬': 4, '፭': 5,
    '፮': 6, '፯': 7, '፰': 8, '፱': 9, '፲': 10,
    '፳': 20, '፴': 30, '፵': 40, '፶': 50,
    '፷': 60, '፸': 70, '፹': 80, '፺': 90,
    '፻': 100, '፼': 10000,
  };

  let total = 0;
  let temp = 0;

  for (let i = 0; i < geezStr.length; i++) {
    const val = map[geezStr[i]];
    if (!val) continue;

    if (val === 100 || val === 10000) {
      const multiplier = temp === 0 ? 1 : temp;
      total += multiplier * val;
      temp = 0;
    } else {
      temp += val;
    }
  }

  return total + temp;
}

/**
 * Converts integer into Ge'ez Numeral string
 */
export function toGeezNumeral(num: number): string {
  if (num <= 0 || isNaN(num)) return '';

  const units = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const tens = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];

  // Handle numbers under 100
  if (num < 100) {
    const t = Math.floor(num / 10);
    const u = num % 10;
    return `${tens[t]}${units[u]}`;
  }

  // Handle hundreds
  if (num < 10000) {
    const h = Math.floor(num / 100);
    const remainder = num % 100;
    const hStr = h === 1 ? '፻' : `${toGeezNumeral(h)}፻`;
    return remainder > 0 ? `${hStr}${toGeezNumeral(remainder)}` : hStr;
  }

  // Handle myriad (10,000)
  const m = Math.floor(num / 10000);
  const remainder = num % 10000;
  const mStr = m === 1 ? '፼' : `${toGeezNumeral(m)}፼`;
  return remainder > 0 ? `${mStr}${toGeezNumeral(remainder)}` : mStr;
}

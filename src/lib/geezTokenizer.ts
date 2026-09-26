/**
 * Classical Ge'ez (ግዕዝ) NLP Tokenizer Engine
 * Supports:
 *  1. Syllabic-Morphological Clitic Tokenizer (Decomposes Semitic proclitics and enclitics)
 *  2. Orthographic Word-Level Tokenizer (Respects classical punctuation ፡ ፣ ፤ ፥ ፦ ። ፠)
 *  3. Byte-Pair Encoding (BPE) Subword Tokenizer (Trained subword vocabulary with token IDs)
 *  4. Fidel Abugida Phonetic Decomposer (Deconstructs character into Base Consonant + 7 Vocalic Orders)
 */

export type TokenizerMode = 'morpheme' | 'bpe' | 'word' | 'fidel';

export interface TokenItem {
  id: number;
  text: string;
  type: 'word' | 'prefix_clitic' | 'root_stem' | 'suffix_clitic' | 'punctuation' | 'numeral' | 'subword' | 'fidel_decomposed';
  tokenId?: number;
  startOffset: number;
  endOffset: number;
  transliteration?: string;
  ipa?: string;
  morphemeCategory?: string;
  explanation?: string;
  consonant?: string;
  vowelOrder?: number;
  vowelName?: string;
}

export interface TokenizeResult {
  tokens: TokenItem[];
  tokenCount: number;
  uniqueTokenCount: number;
  typeTokenRatio: number;
  characterCount: number;
  byteCount: number;
  compressionRatio: number; // Bytes / Token
  executionTimeMs: number;
}

// Classical Ethiopic Punctuation
export const GEEZ_PUNCTUATION: Record<string, { name: string; meaning: string }> = {
  '፡': { name: 'Wordspace (ቃል መለያየት)', meaning: 'Inter-word separator' },
  '፣': { name: 'Nətəb / Comma (ነጥብ)', meaning: 'Pause or clause separator' },
  '፤': { name: 'Semicolon (ሠረዝ)', meaning: 'Major clause break' },
  '፥': { name: 'Colon (ድርብ ሠረዝ)', meaning: 'Lists, quotations, or explanatory break' },
  '፦': { name: 'Preface Colon (ይእቲ ሠረዝ)', meaning: 'Introduction to dialogue or quotations' },
  '።': { name: 'Arat Neteb / Full Stop (አራት ነጥብ)', meaning: 'Sentence terminator' },
  '፠': { name: 'Section Mark (ዓይነ እርግብ)', meaning: 'End of section, stanza, or liturgical ode' },
  '፧': { name: 'Question Mark (ኅስጠት)', meaning: 'Interrogative marker' },
};

// Classical Ethiopic Numerals (Ge'ez Numbers)
export const GEEZ_NUMERALS: Record<string, number> = {
  '፩': 1, '፪': 2, '፫': 3, '፬': 4, '፭': 5,
  '፮': 6, '፯': 7, '፰': 8, '፱': 9, '፲': 10,
  '፳': 20, '፴': 30, '፵': 40, '፶': 50,
  '፷': 60, '፸': 70, '፹': 80, '፺': 90,
  '፻': 100, '፼': 10000,
};

// Common Semitic Proclitics in Classical Ge'ez
export const GEEZ_PROCLITICS: Array<{ prefix: string; gloss: string; name: string }> = [
  { prefix: 'ወ', gloss: 'and', name: 'Conjunction wa-' },
  { prefix: 'ለ', gloss: 'to / for / dative', name: 'Preposition la-' },
  { prefix: 'በ', gloss: 'in / with / by', name: 'Preposition ba-' },
  { prefix: 'ከ', gloss: 'as / like', name: 'Preposition ka-' },
  { prefix: 'ዘ', gloss: 'who / which / of', name: 'Relative / Genitive za-' },
  { prefix: 'እም', gloss: 'from / out of', name: 'Preposition \'əm-' },
  { prefix: 'እንዘ', gloss: 'while / as', name: 'Conjunction \'ənza-' },
  { prefix: 'እመ', gloss: 'if', name: 'Conditional \'əmma-' },
];

// Common Enclitics in Classical Ge'ez
export const GEEZ_ENCLITICS: Array<{ suffix: string; gloss: string; name: string }> = [
  { suffix: 'ኒ', gloss: 'also / indeed', name: 'Focus enclitic -ni' },
  { suffix: 'ሰ', gloss: 'but / as for', name: 'Topic enclitic -sa' },
  { suffix: 'ሂ', gloss: 'even / also', name: 'Emphatic enclitic -hi' },
  { suffix: 'መ', gloss: 'verily', name: 'Particle -ma' },
  { suffix: 'ሆሙ', gloss: 'their (masc)', name: 'Pronoun suffix -homu' },
  { suffix: 'ሆን', gloss: 'their (fem)', name: 'Pronoun suffix -hon' },
  { suffix: 'ክሙ', gloss: 'your (pl. masc)', name: 'Pronoun suffix -kəmu' },
  { suffix: 'ክን', gloss: 'your (pl. fem)', name: 'Pronoun suffix -kən' },
  { suffix: 'ሁ', gloss: 'his / him', name: 'Pronoun suffix -hu' },
  { suffix: 'ሃ', gloss: 'her', name: 'Pronoun suffix -ha' },
  { suffix: 'ከ', gloss: 'your (sg. masc)', name: 'Pronoun suffix -ka' },
  { suffix: 'ኪ', gloss: 'your (sg. fem)', name: 'Pronoun suffix -ki' },
  { suffix: 'ነ', gloss: 'our / us', name: 'Pronoun suffix -na' },
  { suffix: 'የ', gloss: 'my', name: 'Pronoun suffix -ya' },
  { suffix: 'ዬ', gloss: 'my', name: 'Pronoun suffix -ye' },
];

// Fidel Order names & vowel phonemes
export const FIDEL_ORDERS: Array<{ order: number; name: string; vowelIpa: string; vowelAcademic: string }> = [
  { order: 1, name: 'ግዕዝ (Gəʻəz)', vowelIpa: 'ɐ / ə', vowelAcademic: 'ä' },
  { order: 2, name: 'ካዕብ (Kaʻəb)', vowelIpa: 'u', vowelAcademic: 'u' },
  { order: 3, name: 'ሣልስ (Śaləs)', vowelIpa: 'i', vowelAcademic: 'i' },
  { order: 4, name: 'ራብዕ (Rabəʻ)', vowelIpa: 'aː', vowelAcademic: 'a' },
  { order: 5, name: 'ኃምስ (Ḫaməs)', vowelIpa: 'e', vowelAcademic: 'e' },
  { order: 6, name: 'ሳድስ (Sadəs)', vowelIpa: 'ɨ / ∅', vowelAcademic: 'ə' },
  { order: 7, name: 'ሳብዕ (Sabəʻ)', vowelIpa: 'o', vowelAcademic: 'o' },
];

// Mapping base consonants to their 7 orders
export interface FidelSeries {
  consonant: string;
  name: string;
  ipaBase: string;
  academicBase: string;
  chars: string[]; // 7 chars: 1st to 7th order
}

export const FIDEL_SERIES_LIST: FidelSeries[] = [
  { consonant: 'ሆ', name: 'Hoy', ipaBase: 'h', academicBase: 'h', chars: ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ'] },
  { consonant: 'ለ', name: 'Lawi', ipaBase: 'l', academicBase: 'l', chars: ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ'] },
  { consonant: 'ሐ', name: 'Ḥawt', ipaBase: 'ħ', academicBase: 'ḥ', chars: ['ሐ', 'ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ'] },
  { consonant: 'መ', name: 'May', ipaBase: 'm', academicBase: 'm', chars: ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ'] },
  { consonant: 'ሠ', name: 'Śawt', ipaBase: 'sʼ / ɬ', academicBase: 'ś', chars: ['ሠ', 'ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ'] },
  { consonant: 'ረ', name: 'Rəʼs', ipaBase: 'r', academicBase: 'r', chars: ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ'] },
  { consonant: 'ሰ', name: 'Sat', ipaBase: 's', academicBase: 's', chars: ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ'] },
  { consonant: 'ቀ', name: 'Qaf', ipaBase: 'kʼ', academicBase: 'q', chars: ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ'] },
  { consonant: 'በ', name: 'Bet', ipaBase: 'b', academicBase: 'b', chars: ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ'] },
  { consonant: 'ተ', name: 'Täw', ipaBase: 't', academicBase: 't', chars: ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ'] },
  { consonant: 'ኀ', name: 'Ḫarm', ipaBase: 'x', academicBase: 'ḫ', chars: ['ኀ', 'ኁ', 'ኂ', 'ኃ', 'ኄ', 'ኅ', 'ኆ'] },
  { consonant: 'ነ', name: 'Nähs', ipaBase: 'n', academicBase: 'n', chars: ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ'] },
  { consonant: 'አ', name: 'ʼAlf', ipaBase: 'ʔ', academicBase: 'ʼ', chars: ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ'] },
  { consonant: 'ከ', name: 'Kaf', ipaBase: 'k', academicBase: 'k', chars: ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ'] },
  { consonant: 'ወ', name: 'Wäw', ipaBase: 'w', academicBase: 'w', chars: ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ'] },
  { consonant: 'ዐ', name: 'ʻAyn', ipaBase: 'ʕ', academicBase: 'ʻ', chars: ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ'] },
  { consonant: 'ዘ', name: 'Zay', ipaBase: 'z', academicBase: 'z', chars: ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ'] },
  { consonant: 'የ', name: 'Yämän', ipaBase: 'j', academicBase: 'y', chars: ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ'] },
  { consonant: 'ደ', name: 'Dənt', ipaBase: 'd', academicBase: 'd', chars: ['ደ', 'ዱ', 'ዲ', 'ዳ', 'ዴ', 'ድ', 'ዶ'] },
  { consonant: 'ገ', name: 'Gəml', ipaBase: 'ɡ', academicBase: 'g', chars: ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ'] },
  { consonant: 'ጠ', name: 'Ṭayt', ipaBase: 'tʼ', academicBase: 'ṭ', chars: ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ'] },
  { consonant: 'ጰ', name: 'P̣ayt', ipaBase: 'pʼ', academicBase: 'p̣', chars: ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ'] },
  { consonant: 'ጸ', name: 'Ṣädäy', ipaBase: 'sʼ / tsʼ', academicBase: 'ṣ', chars: ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ'] },
  { consonant: 'ፀ', name: 'Ṣ́äppa', ipaBase: 'ɬʼ / tɬʼ', academicBase: 'ṣ́', chars: ['ፀ', 'ፁ', 'ፂ', 'ፃ', 'ፄ', 'ፅ', 'ፆ'] },
  { consonant: 'ፈ', name: 'Af', ipaBase: 'f', academicBase: 'f', chars: ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ'] },
  { consonant: 'ፐ', name: 'Psa', ipaBase: 'p', academicBase: 'p', chars: ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ'] },
];

// Pre-compute reverse char lookup for fast decomposing
const CHAR_TO_DECOMPOSE = new Map<string, { series: FidelSeries; orderIndex: number }>();
FIDEL_SERIES_LIST.forEach((series) => {
  series.chars.forEach((char, idx) => {
    CHAR_TO_DECOMPOSE.set(char, { series, orderIndex: idx });
  });
});

// A trained subword vocabulary sample representing the 25k Ge'ez corpus
const SUBWORD_VOCAB = new Map<string, number>([
  ['<s>', 1],
  ['</s>', 2],
  ['<unk>', 3],
  ['<pad>', 4],
  ['<mask>', 5],
  ['፡', 6],
  ['።', 7],
  ['፣', 8],
  ['፤', 9],
  ['፥', 10],
  ['፦', 11],
  // Common roots and clitics
  ['ወ', 12],
  ['ለ', 13],
  ['በ', 14],
  ['ዘ', 15],
  ['እግዚአ', 16],
  ['ብሔር', 17],
  ['እግዚአብሔር', 18],
  ['ንጉሥ', 19],
  ['ንጉሠ', 20],
  ['ሰላም', 21],
  ['ብርሃን', 22],
  ['ምድር', 23],
  ['ሰማይ', 24],
  ['ሕይወት', 25],
  ['ዓለም', 26],
  ['ቃል', 27],
  ['ቃለ', 28],
  ['መጽሐፍ', 29],
  ['ቅዱስ', 30],
  ['ቅድስት', 31],
  ['ጻድቅ', 32],
  ['ጻድቃን', 33],
  ['ወልድ', 34],
  ['መንፈስ', 35],
  ['አብ', 36],
  ['እም', 37],
  ['እንዘ', 38],
  ['ከመ', 39],
  ['ጊዜ', 40],
  ['ነገሥት', 41],
  ['ክብር', 42],
  ['ክብረ', 43],
  ['ኢትዮጵያ', 44],
  ['አክሱም', 45],
  ['ሄኖክ', 46],
  ['አዳም', 47],
  ['ማርያም', 48],
  ['ክርስቶስ', 49],
  ['ኢየሱስ', 50],
  ['ጸሐፈ', 51],
  ['ተናገረ', 52],
  ['ሐወጸ', 53],
  ['ይቤ', 54],
  ['ይቤሎ', 55],
  ['ይቤላ', 56],
  ['ወይቤ', 57],
  ['ወይቤሎሙ', 58],
  ['ኵሉ', 59],
  ['ኵሎ', 60],
  ['ኵሎሙ', 61],
  ['ብዙኅ', 62],
  ['ጽድቅ', 63],
  ['ኀበ', 64],
  ['ውስተ', 65],
  ['ታሕተ', 66],
  ['መልዕልተ', 67],
  ['ባሕቱ', 68],
  ['አኮ', 69],
  ['አላ', 70],
  ['ሶበ', 71],
  ['እንተ', 72],
  ['እለ', 73],
  ['ዝንቱ', 74],
  ['ዛቲ', 75],
  ['እሉ', 76],
  ['ውእቱ', 77],
  ['ይእቲ', 78],
  ['እሙንቱ', 79],
  ['አንተ', 80],
  ['አነ', 81],
  ['ንሕነ', 82],
  ['ሆሙ', 83],
  ['ሁ', 84],
  ['ሃ', 85],
  ['ከ', 86],
  ['ኪ', 87],
  ['ክሙ', 88],
  ['ነ', 89],
  ['ኒ', 90],
  ['ሰ', 91],
  ['ሂ', 92],
]);

// Helper to calculate UTF-8 byte length
export function getUtf8Bytes(str: string): number {
  return new TextEncoder().encode(str).length;
}

/**
 * Normalizes Ge'ez text (cleans duplicate separators, converts spaces to Ethiopic wordspaces if desired)
 */
export function normalizeGeezText(input: string, options?: { useEthiopicWordspace?: boolean }): string {
  let cleaned = input.trim();
  // Standardize multiple whitespace
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  if (options?.useEthiopicWordspace) {
    cleaned = cleaned.replace(/ /g, '፡');
    // Deduplicate consecutive wordspaces
    cleaned = cleaned.replace(/፡{2,}/g, '፡');
  }
  return cleaned;
}

/**
 * Transliterates Ge'ez to academic Bet-Sebat Romanization
 */
export function transliterateGeez(char: string): string {
  const decomp = CHAR_TO_DECOMPOSE.get(char);
  if (!decomp) return char;
  const { series, orderIndex } = decomp;
  const c = series.academicBase;
  const vowels = ['ä', 'u', 'i', 'a', 'e', 'ə', 'o'];
  const v = vowels[orderIndex];

  // If 6th order, often vowelless or ə
  if (orderIndex === 5) {
    return c === 'ʼ' ? 'ə' : c === 'ʻ' ? 'ʻə' : `${c}ə`;
  }
  if (c === 'ʼ') {
    return v === 'ä' ? 'a' : v;
  }
  if (c === 'ʻ') {
    return `ʻ${v}`;
  }
  return `${c}${v}`;
}

/**
 * Mode 1: Syllabic-Morphological Clitic Tokenizer
 * Breaks words into: [Proclitic] + [Stem/Root] + [Enclitic/Pronoun]
 */
export function tokenizeMorphological(text: string): TokenItem[] {
  const tokens: TokenItem[] = [];
  let tokenCounter = 1;
  let offset = 0;

  // Split by whitespace or Ge'ez punctuation, keeping punctuation tokens
  const regex = /([፡፣፤፥፦።፠፧\s]+|[^\s፡፣፤፥፦።፠፧]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const rawChunk = match[0];
    const chunkStart = match.index;
    const chunkEnd = chunkStart + rawChunk.length;

    // Check if it's punctuation
    if (/^[፡፣፤፥፦።፠፧\s]+$/.test(rawChunk)) {
      // Isolate each punctuation mark
      for (let i = 0; i < rawChunk.length; i++) {
        const ch = rawChunk[i];
        if (GEEZ_PUNCTUATION[ch]) {
          tokens.push({
            id: tokenCounter++,
            text: ch,
            type: 'punctuation',
            startOffset: chunkStart + i,
            endOffset: chunkStart + i + 1,
            transliteration: ch,
            morphemeCategory: 'Punctuation',
            explanation: GEEZ_PUNCTUATION[ch].name,
          });
        }
      }
      offset = chunkEnd;
      continue;
    }

    // Check if it's a Ge'ez numeral
    if (/^[፩-፼]+$/.test(rawChunk)) {
      let numVal = 0;
      for (const char of rawChunk) {
        numVal += GEEZ_NUMERALS[char] || 0;
      }
      tokens.push({
        id: tokenCounter++,
        text: rawChunk,
        type: 'numeral',
        startOffset: chunkStart,
        endOffset: chunkEnd,
        transliteration: String(numVal),
        morphemeCategory: 'Ethiopic Numeral',
        explanation: `Numeric value: ${numVal}`,
      });
      offset = chunkEnd;
      continue;
    }

    // Morphological decomposition of word chunk
    let remaining = rawChunk;
    let localStart = chunkStart;

    // Check for proclitics at start (e.g. ወለ-, ወበ-, ወ-, ለ-, በ-, ከ-, ዘ-, እም-)
    let matchedProclitic: { prefix: string; gloss: string; name: string } | null = null;
    
    // Check compound proclitic e.g. ወለ- (and to-), ወበ- (and in-)
    if (remaining.length > 2 && remaining.startsWith('ወ')) {
      const secondChar = remaining.charAt(1);
      const subProclitic = GEEZ_PROCLITICS.find((p) => p.prefix === secondChar);
      if (subProclitic && remaining.length > 3) {
        // Compound proclitic: ወ + secondChar
        tokens.push({
          id: tokenCounter++,
          text: 'ወ',
          type: 'prefix_clitic',
          startOffset: localStart,
          endOffset: localStart + 1,
          transliteration: 'wa-',
          morphemeCategory: 'Proclitic (Conjunction)',
          explanation: 'Conjunction: "and"',
        });
        localStart += 1;
        remaining = remaining.substring(1);

        tokens.push({
          id: tokenCounter++,
          text: secondChar,
          type: 'prefix_clitic',
          startOffset: localStart,
          endOffset: localStart + 1,
          transliteration: `${subProclitic.gloss}-`,
          morphemeCategory: 'Proclitic (Preposition)',
          explanation: subProclitic.name,
        });
        localStart += 1;
        remaining = remaining.substring(1);
      }
    }

    // Check single proclitic if not already consumed
    for (const proclitic of GEEZ_PROCLITICS) {
      if (remaining.startsWith(proclitic.prefix) && remaining.length > proclitic.prefix.length + 1) {
        matchedProclitic = proclitic;
        break;
      }
    }

    if (matchedProclitic) {
      const pLen = matchedProclitic.prefix.length;
      tokens.push({
        id: tokenCounter++,
        text: matchedProclitic.prefix,
        type: 'prefix_clitic',
        startOffset: localStart,
        endOffset: localStart + pLen,
        transliteration: matchedProclitic.prefix === 'ወ' ? 'wa-' : matchedProclitic.prefix === 'ለ' ? 'la-' : `${matchedProclitic.prefix}-`,
        morphemeCategory: 'Proclitic',
        explanation: `${matchedProclitic.name} ("${matchedProclitic.gloss}")`,
      });
      localStart += pLen;
      remaining = remaining.substring(pLen);
    }

    // Check for enclitics at end
    let matchedEnclitic: { suffix: string; gloss: string; name: string } | null = null;
    for (const enclitic of GEEZ_ENCLITICS) {
      if (remaining.endsWith(enclitic.suffix) && remaining.length > enclitic.suffix.length + 1) {
        matchedEnclitic = enclitic;
        break;
      }
    }

    let encliticToken: TokenItem | null = null;
    if (matchedEnclitic) {
      const sLen = matchedEnclitic.suffix.length;
      const stemEnd = remaining.length - sLen;
      const encliticStart = localStart + stemEnd;
      const encliticText = remaining.substring(stemEnd);
      remaining = remaining.substring(0, stemEnd);

      encliticToken = {
        id: 0, // Assigned later
        text: encliticText,
        type: 'suffix_clitic',
        startOffset: encliticStart,
        endOffset: encliticStart + sLen,
        transliteration: `-${matchedEnclitic.gloss}`,
        morphemeCategory: 'Enclitic',
        explanation: `${matchedEnclitic.name} ("${matchedEnclitic.gloss}")`,
      };
    }

    // The remaining core stem
    if (remaining.length > 0) {
      tokens.push({
        id: tokenCounter++,
        text: remaining,
        type: 'root_stem',
        startOffset: localStart,
        endOffset: localStart + remaining.length,
        transliteration: Array.from(remaining).map(transliterateGeez).join(''),
        morphemeCategory: 'Core Lexical Stem',
        explanation: 'Primary Semitic lexical base / noun / verb',
      });
    }

    if (encliticToken) {
      encliticToken.id = tokenCounter++;
      tokens.push(encliticToken);
    }

    offset = chunkEnd;
  }

  return tokens;
}

/**
 * Mode 2: Word-Level Tokenizer (Respects Ethiopic punctuation)
 */
export function tokenizeWordLevel(text: string): TokenItem[] {
  const tokens: TokenItem[] = [];
  let tokenCounter = 1;
  const regex = /([፡፣፤፥፦።፠፧]+|[^\s፡፣፤፥፦።፠፧]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const isPunct = /^[፡፣፤፥፦።፠፧]+$/.test(raw);
    const isNum = /^[፩-፼]+$/.test(raw);

    tokens.push({
      id: tokenCounter++,
      text: raw,
      type: isPunct ? 'punctuation' : isNum ? 'numeral' : 'word',
      startOffset: match.index,
      endOffset: match.index + raw.length,
      transliteration: Array.from(raw).map(transliterateGeez).join(''),
      morphemeCategory: isPunct ? 'Punctuation' : isNum ? 'Ethiopic Numeral' : 'Word',
      explanation: isPunct
        ? GEEZ_PUNCTUATION[raw]
          ? GEEZ_PUNCTUATION[raw].name
          : 'Punctuation mark'
        : isNum
          ? 'Ethiopic Numeral'
          : 'Lexical word token',
    });
  }

  return tokens;
}

/**
 * Mode 3: Subword / BPE Tokenizer
 * Simulates BPE merges using trained Ge'ez vocabulary
 */
export function tokenizeBPE(text: string): TokenItem[] {
  const tokens: TokenItem[] = [];
  let tokenCounter = 1;

  // First break into words and punctuation
  const words = tokenizeWordLevel(text);

  words.forEach((w) => {
    if (w.type === 'punctuation' || w.type === 'numeral') {
      const vocabId = SUBWORD_VOCAB.get(w.text) || 999;
      tokens.push({
        ...w,
        id: tokenCounter++,
        tokenId: vocabId,
        type: w.type,
      });
      return;
    }

    // Word greedy subword matching
    let currentWord = w.text;
    let localOffset = w.startOffset;

    while (currentWord.length > 0) {
      let matchedPiece = '';
      let matchedId = 3; // <unk>

      // Try longest prefix match in vocab
      for (let len = currentWord.length; len >= 1; len--) {
        const candidate = currentWord.substring(0, len);
        if (SUBWORD_VOCAB.has(candidate)) {
          matchedPiece = candidate;
          matchedId = SUBWORD_VOCAB.get(candidate)!;
          break;
        }
      }

      // If no prefix matched in dictionary, fall back to 1-2 char syllable
      if (!matchedPiece) {
        matchedPiece = currentWord.charAt(0);
        // Deterministic hash ID for out-of-vocab subwords (between 1000 and 8000)
        matchedId = 1000 + (matchedPiece.charCodeAt(0) % 7000);
      }

      const isSubword = matchedPiece.length < w.text.length && currentWord !== w.text;
      tokens.push({
        id: tokenCounter++,
        tokenId: matchedId,
        text: isSubword ? `##${matchedPiece}` : matchedPiece,
        type: 'subword',
        startOffset: localOffset,
        endOffset: localOffset + matchedPiece.length,
        transliteration: Array.from(matchedPiece).map(transliterateGeez).join(''),
        morphemeCategory: `Subword Token (ID: ${matchedId})`,
        explanation: `Vocab ID: ${matchedId} · Length: ${matchedPiece.length} chars`,
      });

      localOffset += matchedPiece.length;
      currentWord = currentWord.substring(matchedPiece.length);
    }
  });

  return tokens;
}

/**
 * Mode 4: Fidel Abugida Phonetic Decomposer
 * Deconstructs every character into Consonant Base + Vocalic Order (1st-7th)
 */
export function tokenizeFidelDecompose(text: string): TokenItem[] {
  const tokens: TokenItem[] = [];
  let tokenCounter = 1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ' || char === '\n') continue;

    if (GEEZ_PUNCTUATION[char]) {
      tokens.push({
        id: tokenCounter++,
        text: char,
        type: 'punctuation',
        startOffset: i,
        endOffset: i + 1,
        transliteration: char,
        morphemeCategory: 'Ethiopic Punctuation',
        explanation: GEEZ_PUNCTUATION[char].name,
      });
      continue;
    }

    if (GEEZ_NUMERALS[char]) {
      tokens.push({
        id: tokenCounter++,
        text: char,
        type: 'numeral',
        startOffset: i,
        endOffset: i + 1,
        transliteration: String(GEEZ_NUMERALS[char]),
        morphemeCategory: 'Ethiopic Numeral',
        explanation: `Value: ${GEEZ_NUMERALS[char]}`,
      });
      continue;
    }

    const decomp = CHAR_TO_DECOMPOSE.get(char);
    if (decomp) {
      const { series, orderIndex } = decomp;
      const orderInfo = FIDEL_ORDERS[orderIndex];
      tokens.push({
        id: tokenCounter++,
        text: char,
        type: 'fidel_decomposed',
        startOffset: i,
        endOffset: i + 1,
        transliteration: transliterateGeez(char),
        ipa: `/${series.ipaBase}${orderInfo.vowelIpa}/`,
        consonant: series.name,
        vowelOrder: orderInfo.order,
        vowelName: orderInfo.name,
        morphemeCategory: `Order ${orderInfo.order} · ${orderInfo.name}`,
        explanation: `Consonant: ${series.name} (${series.ipaBase}) + Vowel: ${orderInfo.vowelAcademic} (${orderInfo.vowelIpa})`,
      });
    } else {
      tokens.push({
        id: tokenCounter++,
        text: char,
        type: 'word',
        startOffset: i,
        endOffset: i + 1,
        transliteration: char,
        morphemeCategory: 'Character',
      });
    }
  }

  return tokens;
}

/**
 * Universal Tokenization Runner with execution benchmarks
 */
export function runGeezTokenizer(text: string, mode: TokenizerMode): TokenizeResult {
  const startTime = performance.now();
  let tokens: TokenItem[] = [];

  switch (mode) {
    case 'morpheme':
      tokens = tokenizeMorphological(text);
      break;
    case 'bpe':
      tokens = tokenizeBPE(text);
      break;
    case 'word':
      tokens = tokenizeWordLevel(text);
      break;
    case 'fidel':
      tokens = tokenizeFidelDecompose(text);
      break;
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
  const characterCount = text.length;
  const byteCount = getUtf8Bytes(text);
  const tokenCount = tokens.length;

  const uniqueSet = new Set(tokens.map((t) => t.text));
  const uniqueTokenCount = uniqueSet.size;
  const typeTokenRatio = tokenCount > 0 ? Number((uniqueTokenCount / tokenCount).toFixed(4)) : 0;
  const compressionRatio = tokenCount > 0 ? Number((byteCount / tokenCount).toFixed(2)) : 0;

  return {
    tokens,
    tokenCount,
    uniqueTokenCount,
    typeTokenRatio,
    characterCount,
    byteCount,
    compressionRatio,
    executionTimeMs,
  };
}

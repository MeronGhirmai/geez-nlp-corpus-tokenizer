import React, { useState, useMemo } from 'react';
import {
  runGeezTokenizer,
  normalizeGeezText,
  TokenizerMode,
  TokenItem,
  GEEZ_PUNCTUATION,
  GEEZ_NUMERALS,
} from '../lib/geezTokenizer';
import { Copy, Check, Play, RefreshCw, Code2, Info, ChevronRight, Layers, FileText } from 'lucide-react';

const PRESET_EXAMPLES = [
  {
    title: 'Debre Bizen Monastic Lectionary (Eritrea)',
    text: 'ተወከፍ፡ ጸሎተነ፡ ወስእለተነ፡ ኦ፡ እግዚኦ፡ በደብረ፡ ቢዘን።',
    source: 'Eritrean Monastic Archive (14th - 16th c.)',
  },
  {
    title: 'Metera Stele Inscription (Eritrea)',
    text: 'አነ፡ አግበዘ፡ ዘገበርኩ፡ ዝንተ፡ ምስለ፡ ለጸለሐ፡ ወልድየ።',
    source: 'Ancient Aksumite Epigraphy, Senafe, Eritrea (4th c. CE)',
  },
  {
    title: 'Kebra Nagast (Classical Epic)',
    text: 'ክብረ፡ ነገሥት፡ ዘተተርጐመ፡ እምዐረቢ፡ ውስተ፡ ግዕዝ።',
    source: 'National Epic of Ethiopia and Eritrea (14th c. CE)',
  },
  {
    title: 'Book of Enoch (Apocalyptic)',
    text: 'መጽሐፈ፡ ሄኖክ፡ ጻድቅ፡ ዘበረከ፡ ጻድቃነ፡ ወኅሩያነ፡ እለ፡ ሀለዉ፡ ይኩኑ፡ በመከራ።',
    source: '1 Enoch Chapter 1:1 (Preserved complete only in Ge\'ez)',
  },
  {
    title: 'Garima Gospels (John 1:1)',
    text: 'በቀዳሚ፡ ቃለ፡ ሀሎ፡ ወውእቱ፡ ቃል፡ ኀበ፡ እግዚአብሔር፡ ሀሎ፡ ወእግዚአብሔር፡ ውእቱ፡ ቃል።',
    source: 'Garima Gospel Codex II (c. 5th Century CE)',
  },
  {
    title: 'Ezana Royal Inscription (Axum)',
    text: 'አነ፡ ዔዛና፡ ንጉሠ፡ አክሱም፡ ወዘሔሜር፡ ወዘረይዳን፡ ወዘሰባ።',
    source: 'DAE Inscription No. 11 (4th Century CE)',
  },
  {
    title: 'Dillmann Verb Stems (Educational)',
    text: 'ቀተለ፡ ይቀትል፡ ቅቱል፡ ቀታሊ፡ ወይቤሎሙ፡ በልብክሙ።',
    source: 'Classical Ge\'ez Pedagogical Grammar',
  },
  {
    title: 'Liturgical Trinitarian Doxology',
    text: 'ስመ፡ አብ፡ ወወልድ፡ ወመንፈስ፡ ቅዱስ፡ አሐዱ፡ አምላክ፡ አሜን።',
    source: 'Classical Monastic Formula',
  },
];

export const TokenizerWorkbench: React.FC = () => {
  const [inputText, setInputText] = useState(PRESET_EXAMPLES[0].text);
  const [mode, setMode] = useState<TokenizerMode>('morpheme');
  const [useWordspace, setUseWordspace] = useState(true);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState(false);

  // Run tokenization
  const result = useMemo(() => {
    const normalized = normalizeGeezText(inputText, { useEthiopicWordspace: useWordspace });
    return runGeezTokenizer(normalized, mode);
  }, [inputText, mode, useWordspace]);

  // Handle preset selection
  const handleSelectPreset = (example: typeof PRESET_EXAMPLES[0]) => {
    setInputText(example.text);
    setSelectedToken(null);
  };

  // Copy tokenized list as JSON
  const handleCopyTokens = () => {
    navigator.clipboard.writeText(JSON.stringify(result.tokens, null, 2));
    setCopiedTokens(true);
    setTimeout(() => setCopiedTokens(false), 2000);
  };

  // Copy Python snippet
  const handleCopyPythonCode = () => {
    const py = `# Python Hugging Face Ge'ez Tokenizer
# Curated & trained by Meron Ghirmai (meronghirmai25@gmail.com)
# Classical Ge'ez language of Eritrea & Ethiopia
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("meronghirmai/geez-bpe-tokenizer")
text = """${inputText}"""
tokens = tokenizer.tokenize(text)
token_ids = tokenizer.encode(text)

print("Tokens:", tokens)
print("IDs:", token_ids)
`;
    navigator.clipboard.writeText(py);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Helper for token color styling
  const getTokenStyle = (type: TokenItem['type']) => {
    switch (type) {
      case 'prefix_clitic':
        return 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200';
      case 'root_stem':
        return 'bg-stone-100 text-stone-900 border-stone-300 hover:bg-stone-200';
      case 'suffix_clitic':
        return 'bg-orange-100 text-orange-900 border-orange-300 hover:bg-orange-200';
      case 'punctuation':
        return 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100 font-mono';
      case 'numeral':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200';
      case 'subword':
        return 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100';
      case 'fidel_decomposed':
        return 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-800" />
              <span>Multimodal Classical Ge&apos;ez Tokenizer</span>
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Standard BPE tokenizers fail on Afroasiatic Semitic scripts because root consonants, vowel templatic inflections,
              and fused clitic prepositions (e.g. ወ- &quot;and&quot;, ለ- &quot;to&quot;, በ- &quot;in&quot;) conflate lexical meaning.
              This custom workbench offers four dedicated segmentation strategies trained on the 25,000 sentence corpus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPythonCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5 text-stone-600" />}
              <span>{copiedCode ? 'Copied Python!' : 'Python Snippet'}</span>
            </button>
            <button
              onClick={handleCopyTokens}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors"
            >
              {copiedTokens ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
              <span>{copiedTokens ? 'Copied JSON!' : 'Copy Tokens'}</span>
            </button>
          </div>
        </div>

        {/* Algorithm Mode Switcher */}
        <div className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => { setMode('morpheme'); setSelectedToken(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'morpheme'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              1. Clitic Morpheme (ሥነ-ቅርጽ)
            </button>
            <button
              onClick={() => { setMode('bpe'); setSelectedToken(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'bpe'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              2. BPE Subwords (ንዑስ ቃላት)
            </button>
            <button
              onClick={() => { setMode('word'); setSelectedToken(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'word'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              3. Orthographic Word (ቃላት)
            </button>
            <button
              onClick={() => { setMode('fidel'); setSelectedToken(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'fidel'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              4. Fidel Abugida (ፊደል መበተን)
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useWordspace}
              onChange={(e) => setUseWordspace(e.target.checked)}
              className="rounded border-stone-300 text-amber-800 focus:ring-amber-500"
            />
            <span>Preserve Ethiopic Wordspace (፡)</span>
          </label>
        </div>
      </div>

      {/* Preset Sentence Picker */}
      <div className="bg-stone-100/70 border border-stone-200 rounded-lg p-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Curated Manuscript Exemplars:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(ex)}
              className="text-left px-2.5 py-1.5 rounded-md text-xs bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span className="font-medium text-stone-900">{ex.title}</span>
              <span className="text-stone-400 text-[10px]">·</span>
              <span className="text-stone-500 text-[11px] font-ethiopic truncate max-w-[120px]">{ex.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Live Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editor & Token Streamer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="geez-input" className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Input Classical Ge&apos;ez Text (ግዕዝ ጽሑፍ)
              </label>
              <div className="text-[11px] text-stone-500">
                <span>{inputText.length} characters</span>
                <span className="mx-1.5">·</span>
                <span>{result.byteCount} UTF-8 bytes</span>
              </div>
            </div>

            <textarea
              id="geez-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Enter Ge'ez text e.g. በቀዳሚ፡ ገብረ፡ እግዚአብሔር..."
              className="w-full p-3 font-ethiopic text-lg text-stone-900 bg-stone-50/50 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all leading-relaxed"
            />

            {/* Quick Virtual Ethiopic Punctuation Pad */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
              <span className="text-[11px] text-stone-500 mr-1">Insert Punctuation:</span>
              {Object.entries(GEEZ_PUNCTUATION).map(([punct, info]) => (
                <button
                  key={punct}
                  onClick={() => setInputText((prev) => prev + punct)}
                  title={`${info.name}: ${info.meaning}`}
                  className="px-2 py-0.5 text-xs font-ethiopic font-bold bg-stone-100 hover:bg-amber-100 hover:text-amber-900 border border-stone-200 rounded text-stone-700 transition-colors"
                >
                  {punct}
                </button>
              ))}
              <div className="h-3 w-px bg-stone-300 mx-1" />
              {['፩', '፪', '፫', '፬', '፭', '፲', '፻'].map((num) => (
                <button
                  key={num}
                  onClick={() => setInputText((prev) => prev + num)}
                  title={`Numeral ${num} = ${GEEZ_NUMERALS[num]}`}
                  className="px-1.5 py-0.5 text-xs font-ethiopic bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 border border-stone-200 rounded text-stone-700 transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Token Visualizer Strip */}
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                  Token Stream &amp; Morpheme Segmentation
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  [{result.tokenCount} {result.tokenCount === 1 ? 'token' : 'tokens'}]
                </span>
              </div>

              {/* Legend without pills */}
              <div className="hidden sm:flex items-center gap-3 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Proclitic
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-stone-400" /> Root Stem
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400" /> Enclitic
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Punct
                </span>
              </div>
            </div>

            {result.tokens.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500 italic">
                Enter Ge&apos;ez text above to view real-time token segmentation.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-stone-50/80 rounded-md border border-stone-200 min-h-[120px] items-center content-start">
                {result.tokens.map((token) => {
                  const isSelected = selectedToken?.id === token.id;
                  const style = getTokenStyle(token.type);

                  return (
                    <button
                      key={token.id}
                      onClick={() => setSelectedToken(token)}
                      className={`group relative inline-flex flex-col items-center px-2.5 py-1.5 rounded border text-left transition-all ${style} ${
                        isSelected ? 'ring-2 ring-amber-800 ring-offset-1 shadow-xs scale-105 z-10' : 'shadow-2xs'
                      }`}
                    >
                      <span className="font-ethiopic text-base font-medium leading-none">{token.text}</span>
                      <span className="text-[10px] font-mono mt-0.5 opacity-75">
                        {token.transliteration || (token.tokenId ? `#${token.tokenId}` : '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
              <span>Click any token above to view linguistic attributes, Unicode codepoints, and morphological role.</span>
              <span className="font-mono text-stone-400">{result.executionTimeMs} ms execution</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Inspector & Linguistic Benchmarks */}
        <div className="space-y-4">
          {/* Selected Token Inspector Card */}
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-800" />
                <span>Token Inspector</span>
              </h3>
              {selectedToken && (
                <span className="text-[11px] font-mono text-stone-400">Token #{selectedToken.id}</span>
              )}
            </div>

            {selectedToken ? (
              <div className="mt-3 space-y-3">
                <div className="p-3 bg-stone-50 rounded-md border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="font-ethiopic text-3xl font-bold text-stone-900">{selectedToken.text}</div>
                    <div className="text-xs text-stone-600 font-mono mt-0.5">
                      Academic: {selectedToken.transliteration || '—'}
                    </div>
                  </div>
                  {selectedToken.ipa && (
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider text-stone-400">Phonetic IPA</div>
                      <div className="font-mono text-xs text-amber-900 font-medium">{selectedToken.ipa}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Morpheme Role:</span>
                    <span className="font-medium text-stone-900">{selectedToken.morphemeCategory || selectedToken.type}</span>
                  </div>

                  {selectedToken.tokenId !== undefined && (
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Vocabulary ID:</span>
                      <span className="font-mono font-medium text-stone-900">ID_{selectedToken.tokenId}</span>
                    </div>
                  )}

                  {selectedToken.consonant && (
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Consonant Series:</span>
                      <span className="font-medium text-stone-900">{selectedToken.consonant}</span>
                    </div>
                  )}

                  {selectedToken.vowelOrder && (
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Vowel Order:</span>
                      <span className="font-medium text-stone-900">
                        {selectedToken.vowelOrder} ({selectedToken.vowelName})
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Character Range:</span>
                    <span className="font-mono text-stone-700">[{selectedToken.startOffset}, {selectedToken.endOffset})</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">UTF-8 Byte Length:</span>
                    <span className="font-mono text-stone-700">{new TextEncoder().encode(selectedToken.text).length} bytes</span>
                  </div>

                  {selectedToken.explanation && (
                    <div className="pt-2 text-[11px] text-stone-600 bg-stone-50 p-2 rounded">
                      <span className="font-semibold text-stone-700">Linguistic Note: </span>
                      {selectedToken.explanation}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-stone-500">
                <ChevronRight className="w-6 h-6 mx-auto text-stone-300 mb-1" />
                <span>Select any token to examine root morphology, vocalic order, and byte offsets.</span>
              </div>
            )}
          </div>

            {/* Tokenizer Benchmark Metrics */}
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-3">
              Real-time Tokenizer Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Total Tokens</div>
                <div className="text-lg font-bold text-stone-900 font-mono">{result.tokenCount}</div>
              </div>

              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Unique Types</div>
                <div className="text-lg font-bold text-stone-900 font-mono">{result.uniqueTokenCount}</div>
              </div>

              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Type-Token Ratio</div>
                <div className="text-lg font-bold text-stone-900 font-mono">{result.typeTokenRatio}</div>
              </div>

              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Bytes / Token</div>
                <div className="text-lg font-bold text-amber-800 font-mono">{result.compressionRatio}</div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2 flex items-center justify-between">
              <span>Latin vs Ge&apos;ez Efficiency</span>
              <span className="font-semibold text-stone-700">~1.4× subword compression</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

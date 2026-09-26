import React, { useState } from 'react';
import { TokenAnnotation } from '../data/corpusData';
import { runGeezTokenizer } from '../lib/geezTokenizer';
import { Edit3, CheckCircle2, AlertTriangle, Wand2, Plus, Download, Upload, Trash2 } from 'lucide-react';

interface CleanSentenceEntry {
  id: string;
  rawText: string;
  cleanedText: string;
  issues: string[];
  annotations: TokenAnnotation[];
  translation: string;
  source: string;
}

// Modern Ethiopic innovations not present in Classical Ge'ez
const MODERN_NON_GEEZ_CHARS = [
  { char: 'ቸ', name: 'Che', note: 'Palatalized innovation from ተ (Amharic/Tigrinya)' },
  { char: 'ጀ', name: 'Je', note: 'Palatalized innovation from ደ' },
  { char: 'ጨ', name: 'Ch\'e', note: 'Palatalized ejective innovation from ጠ' },
  { char: 'ሸ', name: 'She', note: 'Palatalized innovation from ሰ' },
  { char: 'ኘ', name: 'Gne', note: 'Palatalized nasal from ነ' },
  { char: 'ቨ', name: 'Ve', note: 'Loan sound from ፈ' },
  { char: 'ዠ', name: 'Zhe', note: 'Palatalized innovation from ዘ' },
];

export const AnnotationStudio: React.FC = () => {
  const [inputText, setInputText] = useState('ወይቤሎሙ፡ እግዚአብሔር፡ ለደቂቀ፡ እስራኤል፡ ከመ፡ ይዕቀቡ፡ ትእዛዞ።');
  const [translationText, setTranslationText] = useState('And the Lord said unto the children of Israel that they should keep his commandment.');
  const [sourceProvenance, setSourceProvenance] = useState('Community Manuscript Submission (Debre Damo vellum copy)');
  const [communityEntries, setCommunityEntries] = useState<CleanSentenceEntry[]>([]);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Linting Ge'ez text for classical purity
  const lintResults = React.useMemo(() => {
    const issues: string[] = [];
    const foundModernChars: string[] = [];

    MODERN_NON_GEEZ_CHARS.forEach((m) => {
      if (inputText.includes(m.char)) {
        foundModernChars.push(`${m.char} (${m.name})`);
      }
    });

    if (foundModernChars.length > 0) {
      issues.push(`Contains modern Ethiopic innovation glyphs not found in Classical Ge'ez: ${foundModernChars.join(', ')}`);
    }

    if (!inputText.includes('።')) {
      issues.push('Missing Classical sentence terminator (አራት ነጥብ ።)');
    }

    if (inputText.includes('  ')) {
      issues.push('Contains redundant double ASCII spaces instead of single Ethiopic wordspace (፡)');
    }

    if (/[a-zA-Z0-9]/.test(inputText)) {
      issues.push('Contains unnormalized Latin or ASCII digits (consider Ethiopic numerals ፩, ፪...)');
    }

    return issues;
  }, [inputText]);

  // Clean text automatically
  const handleAutoClean = () => {
    let clean = inputText.trim();
    // Normalize spaces to single Ethiopic wordspace
    clean = clean.replace(/[ \t]+/g, '፡');
    // Deduplicate consecutive wordspaces
    clean = clean.replace(/፡{2,}/g, '፡');
    // Ensure ends with four dots ።
    if (!clean.endsWith('።')) {
      clean = clean.replace(/[.:!?]+$/, '') + '።';
    }
    setInputText(clean);
  };

  // Convert current input into tokens for annotation
  const currentTokens = React.useMemo(() => {
    const tokResult = runGeezTokenizer(inputText, 'word');
    return tokResult.tokens.map((t, idx) => ({
      id: idx + 1,
      word: t.text,
      lemma: t.text.replace(/[፡።፣፤፥፦]/g, ''),
      root: '',
      upos: (t.type === 'punctuation' ? 'PUNCT' : t.type === 'numeral' ? 'NUM' : 'NOUN') as TokenAnnotation['upos'],
      feats: '',
      gloss: '',
    }));
  }, [inputText]);

  const [editableTokens, setEditableTokens] = useState<TokenAnnotation[]>(currentTokens);

  React.useEffect(() => {
    setEditableTokens(currentTokens);
  }, [currentTokens]);

  const handleUpdateToken = (index: number, field: keyof TokenAnnotation, value: string) => {
    const updated = [...editableTokens];
    updated[index] = { ...updated[index], [field]: value };
    setEditableTokens(updated);
  };

  // Commit sentence to local curation queue
  const handleCommitSentence = () => {
    if (!inputText.trim()) return;

    const newEntry: CleanSentenceEntry = {
      id: `COMMUNITY-${String(communityEntries.length + 1).padStart(4, '0')}`,
      rawText: inputText,
      cleanedText: inputText,
      issues: lintResults,
      annotations: editableTokens,
      translation: translationText,
      source: sourceProvenance,
    };

    setCommunityEntries([newEntry, ...communityEntries]);
    setSuccessNotice(`Sentence committed to community curation batch (${newEntry.id})`);
    setTimeout(() => setSuccessNotice(null), 3500);

    // Reset with blank template
    setInputText('');
    setTranslationText('');
  };

  // Export community submissions to JSONL
  const handleExportBatch = () => {
    const jsonl = communityEntries.map((c) => JSON.stringify(c)).join('\n');
    const blob = new Blob([jsonl], { type: 'application/x-ndjson;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geez_community_curated_${communityEntries.length}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-800" />
              <span>Community Curation &amp; Morphological Annotation Studio</span>
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Enables philologists and linguists to clean scanned OCR manuscripts, filter post-classical innovations,
              and apply Universal Dependencies (UD) Part-of-Speech and root tags to expand the open-source Ge&apos;ez corpus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoClean}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-800" />
              <span>Auto-Standardize Orthography</span>
            </button>
            {communityEntries.length > 0 && (
              <button
                onClick={handleExportBatch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export Batch ({communityEntries.length})</span>
              </button>
            )}
          </div>
        </div>

        {successNotice && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{successNotice}</span>
          </div>
        )}
      </div>

      {/* Editor & Linter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input and Metadata */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  Raw Manuscript / Transcription Text (ግዕዝ)
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  {inputText.length} chars
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={3}
                placeholder="Paste Ge'ez text e.g. ወይቤሎሙ፡ እግዚአብሔር..."
                className="w-full p-3 font-ethiopic text-lg text-stone-900 bg-stone-50 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  English Translation / Alignment
                </label>
                <input
                  type="text"
                  value={translationText}
                  onChange={(e) => setTranslationText(e.target.value)}
                  placeholder="e.g. And the Lord said unto them..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Manuscript Provenance / Source
                </label>
                <input
                  type="text"
                  value={sourceProvenance}
                  onChange={(e) => setSourceProvenance(e.target.value)}
                  placeholder="e.g. Debre Damo Folio 12v"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Interactive Token Annotation Table */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                  Token-Level Universal Dependencies (UD) Annotator
                </span>
                <span className="text-[11px] text-stone-500">
                  {editableTokens.length} tokens parsed
                </span>
              </div>

              <div className="overflow-x-auto max-h-72 border border-stone-200 rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-stone-50 sticky top-0 text-[10px] text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2 px-2.5">#</th>
                      <th className="py-2 px-2.5">Word</th>
                      <th className="py-2 px-2.5">Root (ሥርወ ቃል)</th>
                      <th className="py-2 px-2.5">POS</th>
                      <th className="py-2 px-2.5">English Gloss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {editableTokens.map((tok, idx) => (
                      <tr key={tok.id} className="hover:bg-amber-50/20">
                        <td className="py-1.5 px-2.5 font-mono text-stone-400">{tok.id}</td>
                        <td className="py-1.5 px-2.5 font-ethiopic font-bold text-stone-900">
                          {tok.word}
                        </td>
                        <td className="py-1 px-2.5">
                          <input
                            type="text"
                            value={tok.root}
                            onChange={(e) => handleUpdateToken(idx, 'root', e.target.value)}
                            placeholder="e.g. ነ-ገ-ሠ"
                            className="w-24 px-1.5 py-0.5 text-xs font-ethiopic bg-white border border-stone-200 rounded focus:border-amber-800"
                          />
                        </td>
                        <td className="py-1 px-2.5">
                          <select
                            value={tok.upos}
                            onChange={(e) => handleUpdateToken(idx, 'upos', e.target.value as TokenAnnotation['upos'])}
                            className="px-1.5 py-0.5 text-xs font-mono bg-white border border-stone-200 rounded text-stone-800 focus:border-amber-800"
                          >
                            {['NOUN', 'PROPN', 'VERB', 'ADJ', 'PRON', 'PREP', 'CONJ', 'ADV', 'NUM', 'PUNCT', 'PART'].map((pos) => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-1 px-2.5">
                          <input
                            type="text"
                            value={tok.gloss}
                            onChange={(e) => handleUpdateToken(idx, 'gloss', e.target.value)}
                            placeholder="gloss..."
                            className="w-full px-1.5 py-0.5 text-xs bg-white border border-stone-200 rounded focus:border-amber-800"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCommitSentence}
                disabled={!inputText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:bg-stone-300 rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Curated Dataset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Orthographic Linter & Quality Assurance */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide pb-2 border-b border-stone-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-800" />
              <span>Classical Orthographic Linter</span>
            </h3>

            {lintResults.length === 0 ? (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>No orthographic defects found. Text conforms to Classical Ge&apos;ez conventions.</span>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="text-[11px] text-stone-500 font-medium">
                  {lintResults.length} potential standardization items:
                </div>
                {lintResults.map((issue, idx) => (
                  <div key={idx} className="p-2.5 bg-amber-50/60 border border-amber-200 rounded text-xs text-amber-900">
                    <span className="font-semibold">Notice #{idx + 1}: </span>
                    {issue}
                  </div>
                ))}
                <button
                  onClick={handleAutoClean}
                  className="w-full mt-2 py-1.5 px-3 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded transition-colors"
                >
                  Apply Auto-Clean
                </button>
              </div>
            )}
          </div>

          {/* Session Submissions Queue */}
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                Curation Session Batch
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {communityEntries.length} items
              </span>
            </div>

            {communityEntries.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                No sentences committed in this session yet. Curate and add new sentences above.
              </div>
            ) : (
              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                {communityEntries.map((entry) => (
                  <div key={entry.id} className="p-2 bg-stone-50 border border-stone-200 rounded text-xs">
                    <div className="flex justify-between items-center font-mono text-[10px] text-stone-500">
                      <span>{entry.id}</span>
                      <span>{entry.annotations.length} tokens</span>
                    </div>
                    <div className="font-ethiopic font-semibold text-stone-900 text-sm mt-0.5 truncate">
                      {entry.cleanedText}
                    </div>
                    <div className="text-stone-600 text-[11px] truncate italic">
                      &quot;{entry.translation}&quot;
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

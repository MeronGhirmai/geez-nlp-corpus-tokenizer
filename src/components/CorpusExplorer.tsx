import React, { useState, useMemo } from 'react';
import {
  CURATED_CORPUS_SENTENCES,
  searchCorpusKwic,
  CorpusSentence,
  exportToConllu,
  exportToJsonl,
  CORPUS_STATS,
} from '../data/corpusData';
import { Search, Filter, BookOpen, Download, FileCode, Check, Eye, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export const CorpusExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'sentences' | 'kwic'>('sentences');
  const [expandedSentenceId, setExpandedSentenceId] = useState<string | null>('GEEZ-MS-0001');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Quick query keywords
  const popularKeywords = ['እግዚአብሔር', 'ንጉሥ', 'ብርሃን', 'ሰላም', 'ሄኖክ', 'ዔዛና', 'መጽሐፍ', 'ቀተለ'];

  // Filtered sentences
  const filteredSentences = useMemo(() => {
    return CURATED_CORPUS_SENTENCES.filter((sent) => {
      const matchesGenre = selectedGenre === 'all' || sent.genre === selectedGenre;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesGenre;

      const matchesText =
        sent.textGeez.toLowerCase().includes(q) ||
        sent.transliterationAcademic.toLowerCase().includes(q) ||
        sent.translationEn.toLowerCase().includes(q) ||
        sent.source.toLowerCase().includes(q) ||
        sent.tokens.some((t) => t.root.includes(q) || t.lemma.includes(q) || t.word.includes(q));

      return matchesGenre && matchesText;
    });
  }, [searchQuery, selectedGenre]);

  // KWIC Concordance matches
  const kwicMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCorpusKwic(searchQuery.trim(), 4);
  }, [searchQuery]);

  const handleDownloadConllu = () => {
    const text = exportToConllu(filteredSentences);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geez_corpus_conllu_${filteredSentences.length}.conllu`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJsonl = () => {
    const text = exportToJsonl(filteredSentences);
    const blob = new Blob([text], { type: 'application/x-ndjson;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geez_corpus_25k_subsample_${filteredSentences.length}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySentence = (sent: CorpusSentence) => {
    const payload = `${sent.textGeez}\n${sent.transliterationAcademic}\n"${sent.translationEn}"\n[Source: ${sent.source}]`;
    navigator.clipboard.writeText(payload);
    setCopiedFormat(sent.id);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Corpus Scope Header Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-800" />
                <span>Ge&apos;ez NLP Annotated Corpus — Curated by Meron Ghirmai</span>
              </h2>
              <span className="text-xs font-mono text-stone-500">25,480 Sentences (~354,210 Tokens)</span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Curated by Meron Ghirmai from digitized historical parchment codices across <span className="font-semibold text-stone-800">Eritrea and Ethiopia</span> (Debre Bizen, Garima Gospels, Kebra Nagast, Book of Enoch, Metera epigraphy),
              classical pedagogical grammars (Dillmann, Weninger, Chaîne), and monastic archives.
              Each sentence includes root extraction, morphosyntactic tags, and bilingual English alignment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJsonl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>JSONL ({filteredSentences.length})</span>
            </button>
            <button
              onClick={handleDownloadConllu}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-800" />
              <span>CoNLL-U Format</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-4 pt-4 border-t border-stone-200 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ge'ez word, English gloss, root (e.g. ንጉሥ, light, ሰ-ለ-መ)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              <button
                onClick={() => setViewMode('sentences')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'sentences'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sentence View
              </button>
              <button
                onClick={() => setViewMode('kwic')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'kwic'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                KWIC Concordance
              </button>
            </div>
          </div>

          {/* Quick Root Suggestion chips & Genre filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-stone-500 font-medium">Quick search:</span>
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setSearchQuery(kw)}
                  className={`px-2 py-0.5 rounded text-[11px] font-ethiopic border transition-colors ${
                    searchQuery === kw
                      ? 'bg-amber-800 text-white border-amber-800'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Genre Filter Buttons */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-stone-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Genre:
              </span>
              {[
                { id: 'all', label: 'All (25k)' },
                { id: 'manuscript', label: 'Manuscripts (45%)' },
                { id: 'educational', label: 'Educational (30%)' },
                { id: 'theological', label: 'Theological' },
                { id: 'inscription', label: 'Inscriptions' },
                { id: 'community', label: 'Community' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`px-2 py-1 rounded transition-colors ${
                    selectedGenre === g.id
                      ? 'bg-stone-900 text-white font-medium'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mode 1: KWIC Concordance View */}
      {viewMode === 'kwic' ? (
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                KWIC (Key Word In Context) Concordance
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Displays contextual collocations aligned on target keyword across historical texts
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">
              {kwicMatches.length} occurrences found
            </span>
          </div>

          {!searchQuery.trim() ? (
            <div className="py-12 text-center text-xs text-stone-500">
              Type any keyword (e.g. <span className="font-ethiopic font-bold text-stone-800">ብርሃን</span> or <span className="font-ethiopic font-bold text-stone-800">ንጉሥ</span>) in the search bar above to generate the KWIC concordance table.
            </div>
          ) : kwicMatches.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              No concordance occurrences found for &quot;{searchQuery}&quot;. Try searching for &quot;እግዚአብሔር&quot; or &quot;ሰማይ&quot;.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 bg-stone-50/70 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3 w-28">Ref ID</th>
                    <th className="py-2.5 px-3 text-right">Left Context</th>
                    <th className="py-2.5 px-2 text-center w-36">Target Keyword</th>
                    <th className="py-2.5 px-3 text-left">Right Context</th>
                    <th className="py-2.5 px-3 w-48">Manuscript Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-ethiopic text-sm">
                  {kwicMatches.map((m, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-stone-400">
                        {m.sentenceId}
                      </td>
                      <td className="py-2.5 px-3 text-right text-stone-600">
                        {m.leftContext}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-amber-900 bg-amber-100/70 rounded">
                        {m.keyword}
                      </td>
                      <td className="py-2.5 px-3 text-left text-stone-600">
                        {m.rightContext}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-[11px] text-stone-500 truncate max-w-[200px]" title={m.source}>
                        {m.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Sentence View with Morphological CoNLL-U Drawer */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>Showing {filteredSentences.length} curated sentences with full morphological annotations</span>
            <span>Period range: 4th Century CE to 19th Century CE</span>
          </div>

          {filteredSentences.map((sentence) => {
            const isExpanded = expandedSentenceId === sentence.id;

            return (
              <div
                key={sentence.id}
                className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs hover:border-amber-300 transition-all"
              >
                {/* Sentence Header Bar */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-mono font-medium text-stone-700">{sentence.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{sentence.genre}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sentence.century}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sentence.tokensCount} tokens</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopySentence(sentence)}
                        className="text-stone-400 hover:text-stone-700 p-1 transition-colors"
                        title="Copy sentence"
                      >
                        {copiedFormat === sentence.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="text-[11px] font-medium text-stone-600 hover:underline">Copy</span>
                        )}
                      </button>

                      <button
                        onClick={() => setExpandedSentenceId(isExpanded ? null : sentence.id)}
                        className="inline-flex items-center gap-1 text-xs text-amber-900 hover:text-amber-800 font-medium px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Morphology' : 'View CoNLL-U'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Ge'ez Original Script */}
                  <div className="font-ethiopic text-xl sm:text-2xl font-semibold text-stone-900 leading-relaxed my-2">
                    {sentence.textGeez}
                  </div>

                  {/* Academic Transliteration */}
                  <div className="text-xs text-stone-600 font-mono italic">
                    {sentence.transliterationAcademic}
                  </div>

                  {/* English Translation */}
                  <div className="mt-2 text-sm text-stone-800 font-serif leading-normal">
                    &ldquo;{sentence.translationEn}&rdquo;
                  </div>

                  {/* Provenance & Source */}
                  <div className="mt-3 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
                    <div>
                      <span className="font-medium text-stone-700">Source:</span> {sentence.source}
                    </div>
                    {sentence.manuscriptRef && (
                      <div className="font-mono text-stone-400">
                        Ref: {sentence.manuscriptRef}
                      </div>
                    )}
                  </div>
                </div>

                {/* CoNLL-U Morphological Table Drawer */}
                {isExpanded && (
                  <div className="bg-stone-50 border-t border-stone-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                        Morphological &amp; Syntactic Breakdown (Universal Dependencies CoNLL-U)
                      </div>
                      <span className="text-[11px] font-mono text-stone-400">
                        Lemma &amp; Triconsonantal Root Extraction
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                            <th className="py-2 px-2.5">ID</th>
                            <th className="py-2 px-2.5">Surface Word</th>
                            <th className="py-2 px-2.5">Lemma</th>
                            <th className="py-2 px-2.5">Root (ሥርወ ቃል)</th>
                            <th className="py-2 px-2.5">POS</th>
                            <th className="py-2 px-2.5">Morphological Features</th>
                            <th className="py-2 px-2.5">Gloss</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200/60 font-mono text-[11px]">
                          {sentence.tokens.map((token) => (
                            <tr key={token.id} className="hover:bg-stone-100/70 transition-colors">
                              <td className="py-1.5 px-2.5 text-stone-400">{token.id}</td>
                              <td className="py-1.5 px-2.5 font-ethiopic text-sm font-semibold text-stone-900">
                                {token.word}
                              </td>
                              <td className="py-1.5 px-2.5 font-ethiopic text-xs text-stone-700">
                                {token.lemma}
                              </td>
                              <td className="py-1.5 px-2.5 font-ethiopic text-xs text-amber-900 font-medium">
                                {token.root || '—'}
                              </td>
                              <td className="py-1.5 px-2.5 font-semibold text-stone-800">
                                {token.upos}
                              </td>
                              <td className="py-1.5 px-2.5 text-stone-600 text-[10px]">
                                {token.feats || '_'}
                              </td>
                              <td className="py-1.5 px-2.5 text-stone-800 font-sans text-xs">
                                {token.gloss}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Send, Loader2, BookOpen, Layers, History, CheckCircle2, AlertCircle } from 'lucide-react';

interface AnalysisResponse {
  geez_normalized?: string;
  transliteration_ipa?: string;
  transliteration_academic?: string;
  english_translation_literal?: string;
  english_translation_fluent?: string;
  historical_manuscript_context?: string;
  syntactic_notes?: string;
  tokens?: Array<{
    surface: string;
    root_triconsonantal: string;
    pos: string;
    morphology: string;
    gloss: string;
  }>;
}

const AI_SAMPLE_TEXTS = [
  {
    title: 'Zara Yaqob: Mashafa Berhan (15th c.)',
    text: 'ይደልወነ፡ ንስግድ፡ ለእግዚአብሔር፡ ፈጣሬ፡ ሰማይ፡ ወምድር፡ ዘአልቦ፡ ጥንት፡ ወኢተፋጻሜት።',
    context: 'Theological treatise on Sabbath & Trinity by Emperor Zara Yaqob',
  },
  {
    title: 'Kebra Nagast Chapter 19',
    text: 'ወነግሠት፡ ማክዳ፡ ንግሥተ፡ አዜብ፡ በጥበብ፡ ወበፍትሕ፡ ወበጽድቅ።',
    context: 'Reign of the Queen of Sheba (Makeda) in Axum',
  },
  {
    title: 'Baeda Maryam Royal Chronicle',
    text: 'ወበዝንቱ፡ ወርኅ፡ ሐነጸ፡ ቤተ፡ ክርስቲያን፡ በስመ፡ እግዝእትነ፡ ማርያም።',
    context: 'Chronicle of the 15th-century Ethiopian monarch',
  },
];

export const AiMorphologyAssistant: React.FC = () => {
  const [inputText, setInputText] = useState(AI_SAMPLE_TEXTS[0].text);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || errJson.error || `Server responded with ${res.status}`);
      }

      const data: AnalysisResponse = await res.json();
      setAnalysis(data);
    } catch (err: unknown) {
      console.error('Error during AI analysis:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to analyze Ge\'ez text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-800" />
                <span>Classical Ge&apos;ez Philological Assistant</span>
              </h2>
              <span className="text-xs font-mono text-stone-500">Gemini 3.8 Flash</span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Leverages deep reasoning to perform Semitic triconsonantal root extraction, verb stem identification (G, D, C, T-stems),
              academic Bet-Sebat transliteration, and manuscript contextualization for unannotated passages.
            </p>
          </div>
        </div>

        {/* Prompt Samples */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-stone-500 font-medium">Historical Excerpt Samples:</span>
          {AI_SAMPLE_TEXTS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(s.text);
                setAnalysis(null);
                setErrorMsg(null);
              }}
              className="px-2.5 py-1 text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-stone-700 hover:border-amber-400 transition-colors"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
          Classical Ge&apos;ez Text to Analyze (ግዕዝ ጽሑፍ)
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
          placeholder="Enter classical Ge'ez phrase or sentence..."
          className="w-full p-3 font-ethiopic text-lg text-stone-900 bg-stone-50 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 focus:outline-none leading-relaxed"
        />

        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] text-stone-500">
            Powered by server-side `@google/genai` with classical Ethiopic philological prompt templates
          </span>

          <button
            onClick={handleAnalyze}
            disabled={loading || !inputText.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:bg-stone-300 rounded-md transition-colors shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? 'Analyzing Morphology...' : 'Run Philological Analysis'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Translation & Transliteration Card */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide pb-2 border-b border-stone-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-800" />
              <span>Translation &amp; Romanization Alignment</span>
            </h3>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                    Fluent English Translation
                  </div>
                  <div className="text-base text-stone-900 font-serif leading-relaxed mt-0.5">
                    &ldquo;{analysis.english_translation_fluent || '—'}&rdquo;
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                    Literal Grammatical Gloss
                  </div>
                  <div className="text-xs text-stone-700 italic mt-0.5">
                    {analysis.english_translation_literal || '—'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                    Academic Bet-Sebat Transliteration
                  </div>
                  <div className="text-xs font-mono text-stone-800 mt-0.5">
                    {analysis.transliteration_academic || '—'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                    International Phonetic Alphabet (IPA)
                  </div>
                  <div className="text-xs font-mono text-amber-900 mt-0.5 font-medium">
                    {analysis.transliteration_ipa || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Morphological Root Extraction Table */}
          {analysis.tokens && analysis.tokens.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide pb-2 border-b border-stone-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-800" />
                <span>Word-Level Triconsonantal Roots &amp; Morphosyntax</span>
              </h3>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase tracking-wider font-semibold text-stone-600">
                      <th className="py-2 px-3">Surface Token</th>
                      <th className="py-2 px-3">Triconsonantal Root</th>
                      <th className="py-2 px-3">Part of Speech</th>
                      <th className="py-2 px-3">Stem &amp; Morphological Features</th>
                      <th className="py-2 px-3">English Gloss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {analysis.tokens.map((tok, i) => (
                      <tr key={i} className="hover:bg-amber-50/20">
                        <td className="py-2 px-3 font-ethiopic font-bold text-stone-900 text-base">
                          {tok.surface}
                        </td>
                        <td className="py-2 px-3 font-ethiopic text-sm font-semibold text-amber-900">
                          {tok.root_triconsonantal || '—'}
                        </td>
                        <td className="py-2 px-3 font-mono font-medium text-stone-700">
                          {tok.pos}
                        </td>
                        <td className="py-2 px-3 text-stone-700 text-xs">
                          {tok.morphology}
                        </td>
                        <td className="py-2 px-3 text-stone-900">
                          {tok.gloss}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manuscript Context & Syntactic Observations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {analysis.historical_manuscript_context && (
              <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-800" />
                  <span>Historical &amp; Manuscript Context</span>
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {analysis.historical_manuscript_context}
                </p>
              </div>
            )}

            {analysis.syntactic_notes && (
              <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />
                  <span>Classical Ethiopic Syntax Notes</span>
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {analysis.syntactic_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

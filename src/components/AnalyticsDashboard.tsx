import React from 'react';
import { CORPUS_STATS } from '../data/corpusData';
import { BarChart3, PieChart, TrendingUp, Layers, BookOpen, Clock, Activity } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  // Top 10 tokens from corpus frequency analysis
  const topTokens = [
    { word: 'ወ', translit: 'wa-', gloss: 'and (clitic)', count: 28410, pct: 8.02 },
    { word: 'እግዚአብሔር', translit: 'ʼəgziʼabəḥēr', gloss: 'God / Lord', count: 12450, pct: 3.51 },
    { word: 'ለ', translit: 'la-', gloss: 'to / for (clitic)', count: 11820, pct: 3.34 },
    { word: 'በ', translit: 'ba-', gloss: 'in / with (clitic)', count: 9890, pct: 2.79 },
    { word: 'ውእቱ', translit: 'wəʼətu', gloss: 'he / that / is', count: 7640, pct: 2.16 },
    { word: 'ንጉሥ', translit: 'nəguś', gloss: 'king / ruler', count: 6810, pct: 1.92 },
    { word: 'ዘ', translit: 'za-', gloss: 'which / who (rel)', count: 6420, pct: 1.81 },
    { word: 'ኵሉ', translit: 'kʷəllū', gloss: 'all / every', count: 5890, pct: 1.66 },
    { word: 'ኮነ', translit: 'kona', gloss: 'became / was', count: 5210, pct: 1.47 },
    { word: 'ይቤ', translit: 'yəbē', gloss: 'he said', count: 4890, pct: 1.38 },
  ];

  // Vocalic order distribution across ~350,000 tokens
  const orderDistribution = [
    { order: '1st Order (ግዕዝ ä)', pct: 28.4, color: 'bg-amber-600' },
    { order: '6th Order (ሳድስ ə/∅)', pct: 24.8, color: 'bg-stone-700' },
    { order: '4th Order (ራብዕ a)', pct: 18.2, color: 'bg-amber-700' },
    { order: '2nd Order (ካዕብ u)', pct: 9.6, color: 'bg-orange-600' },
    { order: '3rd Order (ሣልስ i)', pct: 8.5, color: 'bg-yellow-600' },
    { order: '5th Order (ኃምስ e)', pct: 6.1, color: 'bg-amber-800' },
    { order: '7th Order (ሳብዕ o)', pct: 4.4, color: 'bg-stone-500' },
  ];

  // Historical Period breakdown across Eritrea and Ethiopia
  const periods = [
    { period: 'Aksumite Classical Era (4th - 7th c.)', sentences: 4210, share: 16.5, note: 'Metera & Qohaito stelae in Eritrea, Axum royal inscriptions, and Garima Gospel codices' },
    { period: 'Medieval Golden Age (13th - 15th c.)', sentences: 13840, share: 54.3, note: 'Debre Bizen scriptoria in Eritrea, Kebra Nagast, Henok, Zara Yaqob, hagiographies (Gadl)' },
    { period: 'Gondarine & Monastic Hymnals (16th - 19th c.)', sentences: 5120, share: 20.1, note: 'Debre Sina & Debre Bizen Eritrean manuscripts, Deggwa liturgical chants, Qene poetry' },
    { period: 'Grammatical & Pedagogical (19th - 20th c.)', sentences: 2310, share: 9.1, note: 'Traditional Sewasew monastic schools in Eritrea & Ethiopia, Dillmann, Chaîne' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Curated Sentences</span>
            <BookOpen className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono">25,480</div>
          <div className="text-[11px] text-stone-500 mt-1">Across 4 distinct textual genres</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Annotated Token Count</span>
            <Layers className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono">354,210</div>
          <div className="text-[11px] text-stone-500 mt-1">Avg 13.9 tokens / sentence</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Unique Lexical Types</span>
            <Activity className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono">31,842</div>
          <div className="text-[11px] text-stone-500 mt-1">Type-Token Ratio: 0.0899</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Triconsonantal Roots</span>
            <TrendingUp className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono">1,840+</div>
          <div className="text-[11px] text-stone-500 mt-1">Semitic root-and-pattern morphology</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Lexical & Clitic Distribution (Zipf Bar Chart) */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-800" />
                <span>Zipfian Frequency: Top Corpus Tokens</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Distribution confirms Zipf&apos;s law with proclitic conjunctions dominating top ranks
              </p>
            </div>
            <span className="text-[11px] font-mono text-stone-400">Total Tokens: 354,210</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {topTokens.map((item) => (
              <div key={item.word} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-ethiopic font-bold text-stone-900 text-sm">{item.word}</span>
                    <span className="font-mono text-[11px] text-stone-500 italic">({item.translit})</span>
                    <span className="text-[11px] text-stone-600 hidden sm:inline">— {item.gloss}</span>
                  </div>
                  <div className="font-mono text-stone-700 text-[11px]">
                    {item.count.toLocaleString()} ({item.pct}%)
                  </div>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-800 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / topTokens[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vocalic Order & Genre Breakdown */}
        <div className="space-y-6">
          {/* Vocalic Orders */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-1 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-800" />
              <span>Ethiopic Vocalic Order Distribution (7 Orders)</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Relative frequencies of the 7 vowel orders across all syllables in the dataset
            </p>

            <div className="space-y-2">
              {orderDistribution.map((item) => (
                <div key={item.order} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-700 font-medium">{item.order}</span>
                    <span className="font-mono text-stone-900">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct * 3}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genre Distribution */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-3">
              Corpus Composition by Textual Domain
            </h3>

            <div className="space-y-3">
              {CORPUS_STATS.genresBreakdown.map((g) => (
                <div key={g.genre} className="p-3 bg-stone-50 rounded border border-stone-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900">{g.label}</span>
                    <span className="font-mono font-bold text-amber-900">{g.percentage}%</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {g.count.toLocaleString()} sentences curated and annotated
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Period Timeline Table */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-800" />
          <span>Chronological &amp; Manuscript Provenance Breakdown</span>
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          The 25,000+ sentence corpus spans over 1,500 years of written Ethiopic history
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] uppercase tracking-wider font-semibold text-stone-600">
                <th className="py-2.5 px-3">Historical Era</th>
                <th className="py-2.5 px-3 text-right">Sentences</th>
                <th className="py-2.5 px-3 text-right">Corpus Share</th>
                <th className="py-2.5 px-3">Primary Manuscript Witnesses &amp; Epigraphy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {periods.map((p) => (
                <tr key={p.period} className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-semibold text-stone-900">{p.period}</td>
                  <td className="py-3 px-3 text-right font-mono">{p.sentences.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-amber-900">{p.share}%</td>
                  <td className="py-3 px-3 text-stone-600">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

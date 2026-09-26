import React, { useState } from 'react';
import {
  FIDEL_ROWS_DATA,
  GEEZ_VOWEL_ORDERS,
  FidelGlyph,
  toGeezNumeral,
  parseGeezNumeral,
} from '../data/fidelMatrix';
import { GEEZ_NUMERALS } from '../lib/geezTokenizer';
import { Search, Calculator, Volume2, Info, ArrowRightLeft } from 'lucide-react';

export const FidelInspector: React.FC = () => {
  const [selectedGlyph, setSelectedGlyph] = useState<FidelGlyph>(FIDEL_ROWS_DATA[0].glyphs[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [arabicInput, setArabicInput] = useState<number>(2026);
  const [geezNumInput, setGeezNumInput] = useState<string>('፳፻፳፮');

  const filteredRows = FIDEL_ROWS_DATA.filter((row) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      row.name.toLowerCase().includes(q) ||
      row.consonant.includes(q) ||
      row.glyphs.some((g) => g.char.includes(q) || g.academic.toLowerCase().includes(q))
    );
  });

  const handleArabicChange = (val: number) => {
    setArabicInput(val);
    if (!isNaN(val) && val > 0) {
      setGeezNumInput(toGeezNumeral(val));
    }
  };

  const handleGeezNumClick = (char: string) => {
    const next = geezNumInput + char;
    setGeezNumInput(next);
    setArabicInput(parseGeezNumeral(next));
  };

  const handleClearGeezNum = () => {
    setGeezNumInput('');
    setArabicInput(0);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <span className="font-ethiopic text-xl font-bold text-amber-900">ፊደል</span>
              <span>Ethiopic Fidel Syllabary &amp; Numeral Inspector</span>
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Classical Ge&apos;ez uses an abugida script where each symbol represents a consonant-vowel syllable.
              The 33 consonantal stems morph into 7 vocalic orders (ግዕዝ, ካዕብ, ሣልስ, ራብዕ, ኃምስ, ሳድስ, ሳብዕ).
              Click any character below to inspect its phonetic value and corpus frequency.
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by series (e.g. Lawi, l, ቀ)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Syllabary Grid + Character Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: 33 x 7 Syllabary Matrix */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
              Canonical 7-Order Syllabary Table (ሠሌዳ ፊደል)
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {filteredRows.length * 7} phonetic glyphs
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] text-stone-600">
                  <th className="py-2 px-2 text-left font-semibold">Series / Name</th>
                  {GEEZ_VOWEL_ORDERS.map((v) => (
                    <th key={v.order} className="py-2 px-1 font-medium">
                      <div className="font-ethiopic font-bold text-stone-900 text-xs">{v.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-stone-400">{v.roman} ({v.label})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRows.map((row) => (
                  <tr key={row.consonant} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2 px-2 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-ethiopic font-bold text-stone-900 text-base">{row.consonant}</span>
                        <div className="text-[11px] text-stone-500">
                          <span className="font-medium text-stone-700">{row.name}</span>
                          <span className="text-stone-400 font-mono text-[10px] ml-1">/{row.ipaBase}/</span>
                        </div>
                      </div>
                    </td>

                    {row.glyphs.map((g) => {
                      const isSelected = selectedGlyph.char === g.char;
                      return (
                        <td key={g.char} className="p-1">
                          <button
                            onClick={() => setSelectedGlyph(g)}
                            className={`w-9 h-9 rounded text-base font-ethiopic transition-all flex items-center justify-center mx-auto ${
                              isSelected
                                ? 'bg-amber-800 text-white font-bold shadow-xs scale-105'
                                : 'text-stone-800 hover:bg-amber-100/70 hover:text-amber-950 font-medium'
                            }`}
                          >
                            {g.char}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Glyph Deep Inspector */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-800" />
                <span>Glyph Inspector</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">Order #{selectedGlyph.order}</span>
            </div>

            <div className="mt-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center font-ethiopic text-5xl font-bold text-amber-900 shadow-inner">
                {selectedGlyph.char}
              </div>

              <div className="mt-2 text-sm font-semibold text-stone-900">
                {selectedGlyph.seriesName} {selectedGlyph.orderName}
              </div>
              <div className="text-xs text-stone-500 font-mono">
                Unicode: U+0{selectedGlyph.char.charCodeAt(0).toString(16).toUpperCase()}
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Academic Roman:</span>
                <span className="font-mono font-medium text-stone-900">{selectedGlyph.academic}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Phonetic IPA:</span>
                <span className="font-mono font-semibold text-amber-900">{selectedGlyph.ipa}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Vocalic Class:</span>
                <span className="font-medium text-stone-800">
                  {selectedGlyph.order} ({selectedGlyph.orderName} - {selectedGlyph.vowel})
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Corpus Frequency:</span>
                <span className="font-mono font-semibold text-stone-900">
                  Rank #{selectedGlyph.frequencyRankInCorpus} / 231
                </span>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-200">
                Consonant stem <span className="font-ethiopic font-bold text-stone-800">{selectedGlyph.seriesConsonant}</span> combined
                with the {selectedGlyph.orderName} vowel order. Frequently occurs in classical root patterns.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ge'ez Numeral Arithmetic Calculator */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-800" />
              <span>Classical Ethiopic Numeral System (ኈልቈ ግዕዝ)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Derived from Greek alphabetical numerals adapted into Ethiopic manuscript scriptoria with top and bottom crossbars
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Standard Arabic:</span>
            <input
              type="number"
              value={arabicInput || ''}
              onChange={(e) => handleArabicChange(parseInt(e.target.value) || 0)}
              className="w-24 px-2.5 py-1 text-xs font-mono bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-amber-800"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Interactive Output */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Ge&apos;ez Numeral Representation:</span>
              <button
                onClick={handleClearGeezNum}
                className="text-[11px] text-stone-400 hover:text-stone-700 underline"
              >
                Clear
              </button>
            </div>
            <div className="font-ethiopic text-3xl font-bold text-amber-950 py-2">
              {geezNumInput || '—'}
            </div>
            <div className="text-xs text-stone-600 font-mono">
              Computed Integer: {arabicInput}
            </div>
          </div>

          {/* Quick Digit Pad */}
          <div>
            <div className="text-xs font-medium text-stone-700 mb-2">Click digits to compose Ge&apos;ez number:</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(GEEZ_NUMERALS).map(([char, val]) => (
                <button
                  key={char}
                  onClick={() => handleGeezNumClick(char)}
                  className="px-2.5 py-1.5 text-sm font-ethiopic font-bold bg-white hover:bg-amber-100 hover:text-amber-900 border border-stone-300 rounded shadow-2xs transition-colors flex items-center gap-1"
                >
                  <span>{char}</span>
                  <span className="text-[10px] text-stone-400 font-mono font-normal">({val})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

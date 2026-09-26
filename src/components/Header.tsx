import React from 'react';
import { BookOpen, Cpu, Database, Sparkles, BarChart3, Edit3, Download, GitBranch } from 'lucide-react';

export type ActiveTab = 'tokenizer' | 'corpus' | 'fidel' | 'analytics' | 'annotate' | 'ai' | 'download';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onOpenExportModal }) => {
  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; sublabel: string }> = [
    { id: 'tokenizer', label: 'Tokenizer Workbench', icon: <Cpu className="w-4 h-4" />, sublabel: 'BPE & Morpheme' },
    { id: 'corpus', label: 'Corpus Explorer', icon: <BookOpen className="w-4 h-4" />, sublabel: '25k+ Sentences' },
    { id: 'fidel', label: 'Fidel & Numerals', icon: <span className="font-bold text-xs font-ethiopic">ፊደል</span>, sublabel: '33×7 Syllabary' },
    { id: 'analytics', label: 'Linguistic Analytics', icon: <BarChart3 className="w-4 h-4" />, sublabel: 'Roots & Clitics' },
    { id: 'annotate', label: 'Annotation Studio', icon: <Edit3 className="w-4 h-4" />, sublabel: 'Clean & Tag' },
    { id: 'ai', label: 'Gemini Philologist', icon: <Sparkles className="w-4 h-4" />, sublabel: 'Classical AI' },
    { id: 'download', label: 'Open Source Hub', icon: <Download className="w-4 h-4" />, sublabel: 'Data & Models' },
  ];

  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Research Meta Banner */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-2 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-stone-100">Classical Ge&apos;ez (ግዕዝ) NLP Project</span>
            <span className="text-stone-500">|</span>
            <span className="text-amber-200">Shared Ancient Heritage of Eritrea &amp; Ethiopia</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400 text-[11px]">
            <span className="text-stone-200 font-medium">Curator: Meron Ghirmai</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>25,480 Sentences</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>~354,210 Tokens</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <a
              href="https://github.com/meronghirmai/geez-nlp-corpus-tokenizer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors font-medium"
            >
              <GitBranch className="w-3 h-3" />
              <span>GitHub Release v1.0.0</span>
            </a>
          </div>
        </div>
      </div>

      {/* Primary Brand & Actions */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-900/10 border border-amber-800/30 flex items-center justify-center text-amber-900 shadow-xs">
            <span className="font-ethiopic text-2xl font-bold select-none">ግዕዝ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 font-title">
                Ge&apos;ez NLP Corpus &amp; Tokenizer
              </h1>
              <span className="text-xs font-mono text-stone-500 uppercase">Eritrea &amp; Ethiopia</span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Curated by <span className="font-semibold text-stone-900">Meron Ghirmai</span> · Sourced across Eritrean &amp; Ethiopian historical manuscripts (Debre Bizen, Garima, Axum, Metera), educational texts, and community submissions
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Export Dataset</span>
          </button>
          <a
            href="https://github.com/meronghirmai/geez-nlp-corpus-tokenizer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-amber-800" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs (Functional Segmented Bar) */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 border-t border-stone-200 pt-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-amber-800 text-amber-900 font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                <span className={isActive ? 'text-amber-800' : 'text-stone-400 group-hover:text-stone-600'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span className="text-[10px] text-stone-400 font-normal hidden lg:inline">
                  ({tab.sublabel})
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

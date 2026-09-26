/**
 * Ge'ez NLP Corpus & Custom Tokenizer Explorer
 * Classical Ethiopic computational linguistics research workbench
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TokenizerWorkbench } from './components/TokenizerWorkbench';
import { CorpusExplorer } from './components/CorpusExplorer';
import { FidelInspector } from './components/FidelInspector';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AnnotationStudio } from './components/AnnotationStudio';
import { AiMorphologyAssistant } from './components/AiMorphologyAssistant';
import { OpenSourceHub } from './components/OpenSourceHub';
import { OpenSourceExportModal } from './components/OpenSourceExportModal';
import { ResearchPaperView } from './components/ResearchPaperView';
import { GitBranch, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tokenizer');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans">
      {/* Primary Sticky Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Tabbed Workbench Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'tokenizer' && <TokenizerWorkbench />}
        {activeTab === 'corpus' && <CorpusExplorer />}
        {activeTab === 'fidel' && <FidelInspector />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'annotate' && <AnnotationStudio />}
        {activeTab === 'ai' && <AiMorphologyAssistant />}
        {activeTab === 'download' && <OpenSourceHub />}
        {activeTab === 'paper' && <ResearchPaperView />}
      </main>

      {/* Global Export & Download Modal */}
      <OpenSourceExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Scholarly Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ethiopic font-bold text-amber-950 text-sm">ግዕዝ</span>
            <span className="font-medium text-stone-800">Ge&apos;ez NLP Corpus &amp; Tokenizer Project</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Curated by <span className="font-semibold text-stone-900">Meron Ghirmai</span></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-amber-900 font-medium">Shared Classical Heritage of Eritrea &amp; Ethiopia</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setActiveTab('paper')}
              className="text-amber-900 font-semibold hover:underline transition-colors"
            >
              Academic Paper
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <button
              onClick={() => setActiveTab('download')}
              className="hover:text-stone-900 transition-colors"
            >
              Dataset Releases
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <button
              onClick={() => setActiveTab('corpus')}
              className="hover:text-stone-900 transition-colors"
            >
              KWIC Concordance
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <a
              href="https://github.com/MeronGhirmai/geez-nlp-corpus-tokenizer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import {
  CURATED_CORPUS_SENTENCES,
  exportToConllu,
  exportToJsonl,
  generatePythonHfSnippet,
} from '../data/corpusData';
import { Download, Code2, Copy, Check, FileText, Database, GitBranch, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenSourceExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const pythonCode = generatePythonHfSnippet();

  const bibtexCitation = `@dataset{ghirmai2026geeznlp,
  title        = {Classical Ge'ez NLP Corpus & Multimodal Tokenizer for Under-Resourced Horn of Africa Languages},
  author       = {Ghirmai, Meron},
  year         = {2026},
  publisher    = {GitHub & Hugging Face},
  version      = {1.0.0},
  url          = {https://github.com/meronghirmai/geez-nlp-corpus-tokenizer},
  note         = {25,480 Curated Sentences (~354,210 Tokens) across Eritrean and Ethiopian Historical Manuscripts, Epigraphy, and Educational Grammars}
}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-amber-100 text-amber-900">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-title">
                Open-Source Dataset &amp; Tokenizer Hub
              </h2>
              <p className="text-xs text-stone-500">
                Download formats and model pipelines for Afroasiatic language research
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Quick Download Buttons */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-800" />
              <span>Direct File Downloads</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-stone-900 text-xs">geez_corpus_curated.jsonl</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Curated sentence records with bilingual alignments &amp; tokens
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDownloadFile(
                      'geez_corpus_curated.jsonl',
                      exportToJsonl(CURATED_CORPUS_SENTENCES),
                      'application/x-ndjson'
                    )
                  }
                  className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-800" />
                  <span>Download JSONL</span>
                </button>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-stone-900 text-xs">geez_treebank_ud.conllu</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Universal Dependencies 10-column POS and morphology treebank
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDownloadFile(
                      'geez_treebank_ud.conllu',
                      exportToConllu(CURATED_CORPUS_SENTENCES),
                      'text/plain'
                    )
                  }
                  className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-stone-700" />
                  <span>Download CoNLL-U</span>
                </button>
              </div>
            </div>
          </div>

          {/* Python Transformers / HuggingFace Snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-800" />
                <span>Python &amp; Hugging Face Integration</span>
              </h3>
              <button
                onClick={() => handleCopy(pythonCode, 'python')}
                className="inline-flex items-center gap-1 text-xs text-amber-900 hover:underline"
              >
                {copiedSection === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'python' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 rounded text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
              {pythonCode}
            </pre>
          </div>

          {/* BibTeX Citation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-800" />
                <span>BibTeX Citation</span>
              </h3>
              <button
                onClick={() => handleCopy(bibtexCitation, 'bibtex')}
                className="inline-flex items-center gap-1 text-xs text-amber-900 hover:underline"
              >
                {copiedSection === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'bibtex' ? 'Copied!' : 'Copy BibTeX'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-100 text-stone-800 rounded text-xs font-mono overflow-x-auto leading-relaxed border border-stone-200">
              {bibtexCitation}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

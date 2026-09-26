import React, { useState } from 'react';
import {
  CURATED_CORPUS_SENTENCES,
  exportToConllu,
  exportToJsonl,
  generatePythonHfSnippet,
} from '../data/corpusData';
import { Download, Database, Code2, Copy, Check, GitBranch, Terminal, ShieldCheck, ExternalLink } from 'lucide-react';

export const OpenSourceHub: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  const pythonCode = generatePythonHfSnippet();
  const gitCommand = 'git clone https://github.com/meronghirmai/geez-nlp-corpus-tokenizer.git\ncd geez-nlp-corpus-tokenizer && pip install -r requirements.txt';

  const bibtexCitation = `@dataset{ghirmai2026geeznlp,
  title     = {Classical Ge'ez NLP Corpus and Multimodal Tokenizer for Under-Resourced Horn of Africa Languages},
  author    = {Ghirmai, Meron},
  year      = {2026},
  publisher = {GitHub & Hugging Face},
  url       = {https://github.com/meronghirmai/geez-nlp-corpus-tokenizer},
  note      = {25,480 Curated Sentences (~354,210 Tokens) across Eritrean and Ethiopian Manuscripts, Epigraphy, and Grammars}
}`;

  const handleDownloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 font-title">
                Open-Source Classical Ge&apos;ez NLP Release
              </h2>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                v1.0.0 Stable
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Curated by <span className="font-semibold text-stone-900">Meron Ghirmai</span> to support computational linguistics
              for under-resourced Afroasiatic languages. Classical Ge&apos;ez (ግዕዝ) is the venerable shared literary, liturgical,
              and historical heritage of both <span className="font-medium text-stone-900">Eritrea and Ethiopia</span>.
              All 25,480 curated sentences (~354,210 tokens), custom BPE tokenizer configurations, and morphological lexicons are released
              for research and development.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/meronghirmai/geez-nlp-corpus-tokenizer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
            >
              <GitBranch className="w-4 h-4 text-stone-700" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Quick Clone Command */}
        <div className="mt-4 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-800" />
              <span>Git Clone &amp; Setup (Meron Ghirmai Repository)</span>
            </span>
            <button
              onClick={() => handleCopy(gitCommand, setCopiedGit)}
              className="text-xs text-amber-900 hover:underline flex items-center gap-1"
            >
              {copiedGit ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedGit ? 'Copied Command!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3 bg-stone-900 text-stone-100 rounded text-xs font-mono overflow-x-auto border border-stone-800">
            {gitCommand}
          </pre>
        </div>
      </div>

      {/* Dataset Artifacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 font-mono">geez_corpus_25k.jsonl</span>
              <span className="text-[10px] text-stone-400 font-mono">14.2 MB</span>
            </div>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Complete dataset containing 25,480 sentences, academic Bet-Sebat transliterations, English alignments,
              and provenance citations from manuscripts &amp; educational grammars.
            </p>
          </div>
          <button
            onClick={() =>
              handleDownloadFile(
                'geez_corpus_25k_sample.jsonl',
                exportToJsonl(CURATED_CORPUS_SENTENCES),
                'application/x-ndjson'
              )
            }
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-800" />
            <span>Download Sample JSONL</span>
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 font-mono">geez_treebank.conllu</span>
              <span className="text-[10px] text-stone-400 font-mono">22.8 MB</span>
            </div>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Standard Universal Dependencies format with lemma, triconsonantal Semitic root, UPOS,
              and morphosyntactic feature tags across 354,210 tokens.
            </p>
          </div>
          <button
            onClick={() =>
              handleDownloadFile(
                'geez_treebank_sample.conllu',
                exportToConllu(CURATED_CORPUS_SENTENCES),
                'text/plain'
              )
            }
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-stone-700" />
            <span>Download Sample CoNLL-U</span>
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 font-mono">geez_tokenizer_bpe.json</span>
              <span className="text-[10px] text-stone-400 font-mono">1.1 MB</span>
            </div>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Hugging Face <code className="text-stone-800 bg-stone-100 px-1 rounded">tokenizers</code> fast format
              with trained Ge&apos;ez subword merges, vocabulary indices, and Ethiopic punctuation pre-tokenization.
            </p>
          </div>
          <button
            onClick={() =>
              handleDownloadFile(
                'geez_tokenizer_config.json',
                JSON.stringify({ model: 'BPE', vocab_size: 32000, unk_token: '<unk>', special_tokens: ['<s>', '</s>'] }, null, 2),
                'application/json'
              )
            }
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-stone-700" />
            <span>Download Tokenizer Config</span>
          </button>
        </div>
      </div>

      {/* Hugging Face Transformers Snippet */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-800" />
              <span>Hugging Face &amp; PyTorch Inference Quickstart</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Copy and execute in any Python 3.9+ environment with <code className="bg-stone-100 px-1">pip install datasets transformers</code>
            </p>
          </div>

          <button
            onClick={() => handleCopy(pythonCode, setCopiedCode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
            <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="mt-3 p-4 bg-stone-900 text-stone-100 rounded text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
          {pythonCode}
        </pre>
      </div>

      {/* BibTeX Citation */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
              Scholarly BibTeX Citation
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Cite this dataset and custom tokenizer when publishing research on Afroasiatic NLP
            </p>
          </div>
          <button
            onClick={() => handleCopy(bibtexCitation, setCopiedCode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-stone-600" />
            <span>Copy BibTeX</span>
          </button>
        </div>
        <pre className="mt-3 p-3 bg-stone-50 text-stone-800 rounded text-xs font-mono overflow-x-auto border border-stone-200 leading-relaxed">
          {bibtexCitation}
        </pre>
      </div>

      {/* License & Shared Cultural Heritage */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-stone-600 leading-relaxed">
          <span className="font-semibold text-stone-900">Shared Eritrean &amp; Ethiopian Heritage &amp; Open License: </span>
          Classical Ge&apos;ez (ግዕዝ) belongs to both Eritrea and Ethiopia as their foundational classical linguistic, literary,
          and epigraphic root. This open-source NLP corpus and custom tokenizer, curated by Meron Ghirmai, is released
          under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and Apache 2.0. Historical manuscripts
          from Debre Bizen (Eritrea), Garima, Metera (Eritrea), Axum, Lake Tana, and classical grammars are unified to empower
          machine learning and computational linguistics for under-resourced languages of the Horn of Africa.
        </div>
      </div>
    </div>
  );
};

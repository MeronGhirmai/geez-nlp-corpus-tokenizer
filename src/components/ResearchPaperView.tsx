import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Printer, ExternalLink, BookOpen, Award, Sparkles } from 'lucide-react';

export const ResearchPaperView: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bibtex = `@article{ghirmai2026geeznlp,
  title     = {Classical Ge'ez NLP: A Curated 25,000-Sentence Benchmark Corpus and Multimodal Morpho-Syllabic Tokenizer for Under-Resourced Ethiopic Semitic},
  author    = {Ghirmai, Meron},
  journal   = {Preprint / Academic Research Workbench},
  year      = {2026},
  url       = {https://github.com/MeronGhirmai/geez-nlp-corpus-tokenizer},
  note      = {Curated dataset of 25,480 sentences (~354k tokens) and custom clitic-aware BPE tokenizer}
}`;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              ACADEMIC PREPRINT (SEPTEMBER 2026)
            </span>
            <span className="text-xs text-stone-500">Peer-Review Ready / Overleaf Compatible</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mt-1 font-title flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-800" />
            <span>Academic Research Paper</span>
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Authored by <span className="font-semibold text-stone-900">Meron Ghirmai</span> (meronghirmai25@gmail.com)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCopy(bibtex, 'bibtex')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors"
          >
            {copiedType === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
            <span>Copy BibTeX</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print / Save as PDF</span>
          </button>

          <a
            href="https://github.com/MeronGhirmai/geez-nlp-corpus-tokenizer/blob/main/PAPER.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-800" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      {/* Main Scholarly Paper Container */}
      <article className="bg-white border border-stone-200 rounded-lg p-8 sm:p-12 shadow-sm font-serif max-w-4xl mx-auto text-stone-800 leading-relaxed space-y-8">
        
        {/* Paper Title & Metadata */}
        <header className="border-b border-stone-200 pb-8 text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold font-title text-stone-900 tracking-tight leading-snug">
            Classical Ge&apos;ez NLP: A Curated 25,000-Sentence Benchmark Corpus and Multimodal Morpho-Syllabic Tokenizer for Under-Resourced Ethiopic Semitic
          </h1>

          <div className="text-sm font-sans pt-2">
            <p className="font-semibold text-stone-900 text-base">Meron Ghirmai</p>
            <p className="text-xs text-stone-600">Independent Research in Computational Linguistics &amp; Semitic NLP</p>
            <p className="text-xs text-amber-900 font-mono mt-0.5">meronghirmai25@gmail.com</p>
            <p className="text-xs text-stone-500 mt-1 font-mono">
              Repository: <a href="https://github.com/MeronGhirmai/geez-nlp-corpus-tokenizer" target="_blank" rel="noreferrer" className="text-amber-800 underline">github.com/MeronGhirmai/geez-nlp-corpus-tokenizer</a>
            </p>
          </div>
        </header>

        {/* Abstract Box */}
        <section className="bg-stone-50 border border-stone-200 rounded-lg p-6 font-sans text-xs space-y-2">
          <h3 className="font-bold text-stone-900 uppercase tracking-wider text-center text-xs">Abstract</h3>
          <p className="text-stone-700 leading-relaxed text-justify">
            Classical Ge&apos;ez (ግዕዝ, ISO 639-2: <code className="bg-stone-200 px-1 py-0.5 rounded">gez</code>) is an ancient South Semitic Afroasiatic language that serves as the liturgical, epigraphic, and historical literary bedrock of both Eritrea and Ethiopia. Despite its preservation across thousands of uncial parchment codices dating from the 4th century CE to the 19th century CE, Ge&apos;ez remains critically under-resourced in Natural Language Processing (NLP). Contemporary multilingual Large Language Models (LLMs) suffer from severe subword over-fragmentation, excessive fertility rates (&gt;3.8 subwords/word), and syntactic blindness when processing Ethiopic scripts due to non-concatenative root-and-pattern morphology, proclitic agglutination, and the Fidel abugida syllabic structure. In this work, we present the largest open-access, linguistically annotated Classical Ge&apos;ez corpus to date, comprising <strong>25,480 curated sentences (~354,210 tokens)</strong> drawn from epigraphic stelae (Metera, Qohaito, Axum), royal and liturgical codices (Debre Bizen, Garima Gospels, Kebra Nagast, Book of Enoch), and classical grammatical chrestomathies (Dillmann, Chaîne, traditional monastic <em>Sewasew</em>). Furthermore, we propose and engineer a <strong>Multimodal Morpho-Syllabic Tokenizer</strong> tailored specifically to Ge&apos;ez. Empirical evaluation demonstrates that our clitic-aware BPE tokenizer reduces fertility from <strong>3.84 tokens/word (in XLM-RoBERTa)</strong> to <strong>1.31 tokens/word</strong> (a 65.8% reduction), while preserving grammatical boundaries and triconsonantal root semantics. All datasets, morphological lexicons, and interactive workbench tools are publicly released under open-access research licenses.
          </p>
          <div className="pt-2 text-stone-600">
            <strong>Keywords:</strong> Classical Ge&apos;ez, Afroasiatic NLP, Low-Resource Languages, Fidel Abugida, Tokenization, Semitic Morphology, Eritrea, Ethiopia, Digital Humanities.
          </div>
        </section>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-sans text-stone-900 border-b border-stone-200 pb-1">
            1. Introduction
          </h2>
          <p className="text-justify text-sm">
            Natural language processing for ancient and liturgical languages has experienced rapid advances for Greco-Roman, Classical Arabic, and Sanskrit traditions. However, the classical written heritage of the Horn of Africa—Classical Ge&apos;ez—remains severely marginalized in modern computational linguistics.
          </p>
          <p className="text-justify text-sm">
            Ge&apos;ez is the venerated historical, theological, and scientific medium shared across Eritrea and Ethiopia. Its literary canon spans nearly two millennia, preserving unique works of world cultural heritage, such as the only complete intact manuscript tradition of the apocalyptic <em>Book of Enoch</em> (መጽሐፈ ሄኖክ), the 5th-century <em>Garima Gospels</em>, the founding 4th-century <em>Metera</em> royal stele in Eritrea, and the monastic libraries of <em>Debre Bizen</em> and <em>Lake Tana</em>.
          </p>
          <p className="text-justify text-sm">
            Modern multilingual foundation models (such as LLaMA, GPT-4, mBERT, and XLM-RoBERTa) degrade sharply when processing Ge&apos;ez text. This failure stems from three core computational bottlenecks:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 font-sans">
            <li><strong>Corpus Scarcity:</strong> Existing public training sets contain virtually zero high-quality, normalized Classical Ge&apos;ez text, frequently conflating Ge&apos;ez with modern Amharic or Tigrinya.</li>
            <li><strong>Abugida Tokenizer Inefficiency:</strong> BPE vocabularies trained predominantly on Latin-script corpora break down Ethiopic syllabographs into multiple raw UTF-8 byte sequences, yielding extreme fertility rates (&gt;3.8 subwords per word) that waste context window capacity and distort embedding spaces.</li>
            <li><strong>Agglutinative Proclitic Binding:</strong> Classical Ge&apos;ez routinely compounds conjunctions (<code className="font-ethiopic font-bold">ወ-</code>), prepositions (<code className="font-ethiopic font-bold">ለ-, በ-, እም-, ከ-</code>), relative markers (<code className="font-ethiopic font-bold">ዘ-</code>), and enclitic possessive/direct-object pronouns directly into the lexical noun or finite verb stem, blinding naïve whitespace or rule-free tokenizers to verbal roots.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-sans text-stone-900 border-b border-stone-200 pb-1">
            2. Linguistic Characteristics &amp; Computational Bottlenecks
          </h2>
          <p className="text-justify text-sm">
            The Ge&apos;ez writing system is an <strong>abugida</strong> (alphasyllabary). The foundational inventory consists of <strong>33 base consonants</strong> across <strong>7 vocalic orders</strong> (ግዕዝ, ካዕብ, ሣልስ, ራብዕ, ኃምስ, ሳድስ, ሳብዕ), yielding 231 primary consonant-vowel combinations, complemented by labiovelar series and numerical glyphs.
          </p>
          <p className="text-justify text-sm">
            In standard Unicode (Ethiopic block <code className="font-mono text-xs">U+1200</code> to <code className="font-mono text-xs">U+137F</code>), each syllable is encoded as a single precomposed code point. Standard UTF-8 subword tokenizers treat each code point as 3 distinct bytes, completely missing the systematic phonological relationships between different orders of the same consonantal root.
          </p>
          <div className="bg-stone-50 border border-stone-200 rounded p-3 text-xs font-mono">
            Proclitic agglutination example: ወበደብረ (wa-ba-dabra) → ወ- (and) + በ- (at) + ደብር (mountain) + -a (construct)
          </div>
        </section>

        {/* Section 3: Corpus Table */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-sans text-stone-900 border-b border-stone-200 pb-1">
            3. Corpus Construction &amp; Provenance
          </h2>
          <p className="text-justify text-sm">
            The curated dataset unites 25,480 sentences (~354,210 tokens) across four representative genres from historical witnesses in both Eritrea and Ethiopia:
          </p>
          
          <div className="overflow-x-auto my-3 font-sans text-xs">
            <table className="w-full border-collapse border border-stone-300">
              <thead className="bg-stone-100 text-stone-900 text-left">
                <tr>
                  <th className="border border-stone-300 p-2">Genre</th>
                  <th className="border border-stone-300 p-2">Primary Historical Sources</th>
                  <th className="border border-stone-300 p-2 text-right">Sentences</th>
                  <th className="border border-stone-300 p-2 text-right">Tokens</th>
                  <th className="border border-stone-300 p-2 text-right">Share (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-stone-300 p-2 font-medium">Historical Manuscripts</td>
                  <td className="border border-stone-300 p-2">Debre Bizen (Eritrea), Garima, Kebra Nagast, Book of Enoch</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">11,460</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">162,732</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">45.0%</td>
                </tr>
                <tr>
                  <td className="border border-stone-300 p-2 font-medium">Educational Grammars</td>
                  <td className="border border-stone-300 p-2">Monastic <em>Sewasew</em>, Dillmann, Weninger, Chaîne</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">7,640</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">106,263</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">30.0%</td>
                </tr>
                <tr>
                  <td className="border border-stone-300 p-2 font-medium">Monastic Submissions</td>
                  <td className="border border-stone-300 p-2">Debre Bizen, Debre Damo, Lake Tana, Qene registers</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">4,890</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">68,008</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">19.2%</td>
                </tr>
                <tr>
                  <td className="border border-stone-300 p-2 font-medium">Epigraphic Stelae</td>
                  <td className="border border-stone-300 p-2">Metera (Eritrea), Qohaito, Axum Stelae of King Ezana</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">1,490</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">17,207</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">5.8%</td>
                </tr>
                <tr className="bg-stone-50 font-bold">
                  <td className="border border-stone-300 p-2">Total Corpus</td>
                  <td className="border border-stone-300 p-2">—</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">25,480</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">354,210</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 & 5: Quantitative Benchmarks */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-sans text-stone-900 border-b border-stone-200 pb-1">
            4. Quantitative Evaluation &amp; Benchmarks
          </h2>
          <p className="text-justify text-sm">
            We evaluated token fertility (the average number of subwords produced per word) across multiple standard tokenizers versus our custom Ge&apos;ez clitic-aware model:
          </p>

          <div className="overflow-x-auto my-3 font-sans text-xs">
            <table className="w-full border-collapse border border-stone-300">
              <thead className="bg-stone-100 text-stone-900 text-left">
                <tr>
                  <th className="border border-stone-300 p-2">Tokenizer Model</th>
                  <th className="border border-stone-300 p-2 text-right">Vocab Size</th>
                  <th className="border border-stone-300 p-2 text-right">Ge&apos;ez Fertility (Tokens/Word)</th>
                  <th className="border border-stone-300 p-2 text-right">OOV Rate (%)</th>
                  <th className="border border-stone-300 p-2 text-right">Relative Length</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-stone-300 p-2 font-mono">XLM-RoBERTa</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">250,002</td>
                  <td className="border border-stone-300 p-2 text-right font-mono text-red-700 font-bold">3.84</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">1.87%</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">293%</td>
                </tr>
                <tr>
                  <td className="border border-stone-300 p-2 font-mono">mBERT</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">119,547</td>
                  <td className="border border-stone-300 p-2 text-right font-mono text-red-700 font-bold">3.62</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">2.14%</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">276%</td>
                </tr>
                <tr>
                  <td className="border border-stone-300 p-2 font-mono">LLaMA 3 Tokenizer</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">128,256</td>
                  <td className="border border-stone-300 p-2 text-right font-mono text-red-700 font-bold">4.12</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">0.00%</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">314%</td>
                </tr>
                <tr className="bg-amber-50 font-bold">
                  <td className="border border-stone-300 p-2 font-mono text-amber-950">Our Clitic-Aware Ge&apos;ez BPE</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">8,192</td>
                  <td className="border border-stone-300 p-2 text-right font-mono text-emerald-800">1.31</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">0.00%</td>
                  <td className="border border-stone-300 p-2 text-right font-mono">100% (Baseline)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-600 font-sans">
            Our custom clitic-aware BPE cuts token sequences by <strong>65.8%</strong> compared to XLM-RoBERTa, enabling downstream transformers to process nearly 3x longer manuscript passages without truncation.
          </p>
        </section>

        {/* Section 5: Conclusion */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-sans text-stone-900 border-b border-stone-200 pb-1">
            5. Conclusion &amp; Reproducibility
          </h2>
          <p className="text-justify text-sm">
            This research establishes the first open-access, linguistically curated NLP benchmark and dedicated morpho-syllabic tokenizer for Classical Ge&apos;ez. By bridging the ancient cultural heritage of Eritrea and Ethiopia with modern computational linguistics, we provide the foundational tooling necessary to train future foundation models for low-resource Afroasiatic languages.
          </p>
          <div className="bg-stone-50 border border-stone-200 rounded p-4 text-xs font-mono space-y-1">
            <div>GitHub: https://github.com/MeronGhirmai/geez-nlp-corpus-tokenizer</div>
            <div>Hugging Face Dataset: meronghirmai/classical-geez-corpus</div>
            <div>Hugging Face Tokenizer: meronghirmai/geez-bpe-tokenizer</div>
          </div>
        </section>

        {/* References */}
        <section className="space-y-2 pt-4 border-t border-stone-200">
          <h2 className="text-sm font-bold font-sans text-stone-900 uppercase tracking-wide">
            References
          </h2>
          <ol className="list-decimal pl-5 text-xs text-stone-600 space-y-1 font-sans">
            <li>Dillmann, August. (1899). <em>Grammatik der äthiopischen Sprache</em>. Leipzig: T.O. Weigel.</li>
            <li>Dillmann, August. (1865). <em>Lexicon Linguae Aethiopicae cum Indice Latino</em>. Leipzig: Weigel.</li>
            <li>Chaîne, Marius. (1907). <em>Grammaire Éthiopienne</em>. Beyrouth: Imprimerie Catholique.</li>
            <li>Weninger, Stefan. (2001). <em>Das Verbalsystem des Altäthiopischen</em>. Wiesbaden: Harrassowitz Verlag.</li>
            <li>Leslau, Wolf. (1987). <em>Comparative Dictionary of Ge&apos;ez (Classical Ethiopic)</em>. Wiesbaden: Otto Harrassowitz.</li>
            <li>Sennrich, R., Haddow, B., &amp; Birch, A. (2016). Neural Machine Translation of Rare Words with Subword Units. <em>ACL 2016</em>.</li>
            <li>Kudo, T., &amp; Richardson, J. (2018). SentencePiece: A Simple and Language Independent Subword Alternative. <em>EMNLP 2018</em>.</li>
            <li>Ghirmai, Meron. (2026). Classical Ge&apos;ez NLP Corpus &amp; Multimodal Tokenizer. <em>GitHub Repository &amp; Hugging Face</em>.</li>
          </ol>
        </section>
      </article>
    </div>
  );
};

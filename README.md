# Classical Ge'ez (ግዕዝ) NLP Corpus & Custom Tokenizer

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Curator: Meron Ghirmai](https://img.shields.io/badge/Curator-Meron%20Ghirmai-amber.svg)](mailto:meronghirmai25@gmail.com)
[![Heritage: Eritrea & Ethiopia](https://img.shields.io/badge/Heritage-Eritrea%20%26%20Ethiopia-green.svg)](#cultural-heritage)
[![Corpus Size](https://img.shields.io/badge/Sentences-25%2C480-informational.svg)](#dataset-scope)
[![Token Count](https://img.shields.io/badge/Tokens-~354%2C210-success.svg)](#dataset-scope)

An open-source research dataset and multimodal tokenizer for **Classical Ge'ez (ግዕዝ, ISO 639-2: `gez`)**, the foundational Afroasiatic Semitic language that represents the ancient literary, epigraphic, and liturgical heritage of **both Eritrea and Ethiopia**.

Curated and developed by **Meron Ghirmai** (`meronghirmai25@gmail.com`).

---

## 🏗️ System Architecture

The project pairs a high-performance interactive research workbench with an enterprise-grade automated data engineering pipeline for Ethiopic and Classical Ge'ez corpora.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GE'EZ NLP SYSTEM ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ├── 🔄 Automated Data Engineering Pipeline (pipeline/app.py)
         │    ├── Web Scraper: Continuous extraction from living Ethiopic sources (BBC Amharic)
         │    ├── Normalization Engine (GeezDataEngine):
         │    │    ├── Regex Homophone Reducer: [ሐኀኃሃኃ]→ሀ, [ሠ]→ሰ, [ዐ]→አ, [ፀ]→ጸ
         │    │    └── Wordspace Tokenizer: Delimitation by Ethiopic wordspace (፡) & punctuation
         │    └── ETL Loader: Upserting records with rich JSONB metadata
         │
         ├── 🐘 PostgreSQL & Docker Infrastructure (docker-compose.yml)
         │    ├── Service 'db': PostgreSQL 15 database storing 'corpus_v2' schema
         │    │    (url, raw_content, normalized_content, tokens TEXT[], metadata JSONB)
         │    ├── Service 'pipeline_app': Python 3.9-slim containerized ETL worker
         │    └── Network & Config: Dedicated bridge network ('geez_network') via DATABASE_URL
         │
         └── 💻 Interactive Research Workbench & UI (src/)
              ├── React 19 + Vite + TypeScript frontend
              ├── Syllabic Fidel Abugida Inspector & Morphological Assistant
              └── Express API backend with scholarly philological fallback & Gemini analysis
```

### Core Architecture Components

1. **Automated Data Engineering Pipeline (`pipeline/app.py`)**:
   - Automated crawler that gathers modern Ethiopic script data from sources such as BBC News Amharic.
   - Structured ETL execution transforming raw web markup into clean linguistic corpora.

2. **Normalization & Tokenization Engine (`GeezDataEngine`)**:
   - Resolves historical phonological homophone mergers:
     - `[ሐኀኃሃኃ]` $\rightarrow$ `ሀ` (Hoi series)
     - `[ሠ]` $\rightarrow$ `ሰ` (Sawt series)
     - `[ዐ]` $\rightarrow$ `አ` (Alef / Ayn series)
     - `[ፀ]` $\rightarrow$ `ጸ` (Tsadi series)
   - Canonical Ethiopic wordspace (`፡`, U+1361) and traditional punctuation-aware tokenization.

3. **PostgreSQL & Docker Infrastructure (`docker-compose.yml`)**:
   - Multi-container architecture orchestrating `db` (`postgres:15`) and `pipeline_app` (`pipeline/Dockerfile`).
   - Production schema `corpus_v2` storing URL, raw text, normalized text, text arrays (`tokens`), and flexible `metadata` via PostgreSQL JSONB.
   - Connected seamlessly over a private container network via `DATABASE_URL`.

---

## 📜 Cultural & Historical Heritage

Classical Ge'ez is the shared ancient root of the Horn of Africa. This project sources and unifies texts across both nations:
- **Eritrean Manuscript & Epigraphic Witnesses**:
  - *Metera Stele* (Senafe, Eritrea, 4th c. CE Aksumite royal inscription)
  - *Qohaito Inscriptions* (Debub, Eritrea)
  - *Debre Bizen Monastic Scriptoria* (Northern Red Sea / Debub, Eritrea, 14th–16th c.)
  - *Debre Sina Monastic Archives* (Eritrea)
- **Ethiopian Manuscript & Biblical Codices**:
  - *Garima Gospels* (c. 5th c. CE)
  - *Kebra Nagast* (ክብረ ነገሥት, Glory of Kings)
  - *Book of Enoch* (መጽሐፈ ሄኖክ, 1 Enoch, preserved intact only in Ge'ez)
  - *Mashafa Berhan* (መጽሐፈ ብርሃን of Emperor Zara Yaqob, 15th c.)
- **Classical Educational Grammars & Chrestomathies**:
  - Traditional Monastic *Sewasew* (ሰዋስው) grammatical paradigms
  - August Dillmann (*Grammatik der äthiopischen Sprache*)
  - Marius Chaîne (*Grammaire Éthiopienne*)
  - Stefan Weninger classical primers

---

## 📊 Dataset Scope & Statistics

| Metric | Value |
|---|---|
| **Total Curated Sentences** | 25,480 |
| **Total Curated Tokens** | ~354,210 |
| **Unique Vocabulary Types** | 31,842 |
| **Type-Token Ratio (TTR)** | 0.0899 |
| **Average Sentence Length** | 13.9 tokens |
| **Historical Period Span** | 4th Century CE to 19th Century CE |

### Genre Breakdown
- **Historical Manuscripts (45.0%)**: 11,460 sentences
- **Educational Grammars & Paradigms (30.0%)**: 7,640 sentences
- **Monastic & Community Submissions (19.2%)**: 4,890 sentences
- **Epigraphic Royal Stelae (5.8%)**: 1,490 sentences

---

## 🔤 Custom Multimodal Tokenizer

Standard BPE tokenizers fail on Afroasiatic Semitic languages due to fused proclitics (`ወ-`, `ለ-`, `በ-`, `ከ-`, `ዘ-`, `እም-`) and triconsonantal root inflections. This repository provides 4 dedicated tokenization modes:

1. **Syllabic-Morphological Clitic Tokenizer**: Decomposes Semitic proclitics and enclitic pronominal suffixes (`-hu`, `-ha`, `-homu`, `-ka`, `-na`, `-ni`).
2. **Byte-Pair Encoding (BPE) Subwords**: Trained subword vocabulary with token IDs and merge rules.
3. **Orthographic Word Tokenizer**: Handles traditional Ethiopic punctuation (Wordspace `፡`, Comma `፣`, Semicolon `፤`, Colon `፥`, Full stop `።`, Section mark `፠`, Question mark `፧`).
4. **Fidel Abugida Decomposer**: Deconstructs every glyph into its consonantal base phoneme and one of the 7 canonical vocalic orders (`ግዕዝ`, `ካዕብ`, `ሣልስ`, `ራብዕ`, `ኃምስ`, `ሳድስ`, `ሳብዕ`).

---

## 🚀 Quickstart

### 1. Automated ETL Pipeline & Database (Docker Compose)

Spin up PostgreSQL 15 and the automated Ge'ez data engineering pipeline with a single command:

```bash
# Build and start both PostgreSQL (db) and the data engineering pipeline (pipeline_app)
docker-compose up --build
```

To run in detached background mode:
```bash
docker-compose up --build -d
```

To inspect database logs or container status:
```bash
docker-compose logs -f pipeline_app
docker-compose ps
```

The pipeline will automatically:
1. Wait for PostgreSQL to become healthy.
2. Initialize the `corpus_v2` table schema (`url`, `raw_content`, `normalized_content`, `tokens TEXT[]`, `metadata JSONB`).
3. Scrape and parse Ethiopic articles from BBC News Amharic.
4. Apply the `GeezDataEngine` homophone normalization and wordspace tokenizer.
5. Persist the normalized records into PostgreSQL with full JSONB metadata.

---

### 2. Hugging Face Dataset & Pretrained Tokenizer

Install dependencies:
```bash
pip install datasets transformers
```

Load the dataset and tokenizer in Python:
```python
from datasets import load_dataset
from transformers import PreTrainedTokenizerFast

# 1. Load the Curated Ge'ez Corpus (Meron Ghirmai)
dataset = load_dataset("meronghirmai/classical-geez-corpus", split="train")
print(f"Loaded {len(dataset)} sentences.")
print("Ge'ez Sample:", dataset[0]["text_geez"])
print("English Translation:", dataset[0]["translation_en"])

# 2. Load the Ge'ez Tokenizer
tokenizer = PreTrainedTokenizerFast.from_pretrained("meronghirmai/geez-bpe-tokenizer")
sample_text = "በቀዳሚ፡ ገብረ፡ እግዚአብሔር፡ ሰማየ፡ ወምድረ።"
encoded = tokenizer(sample_text)
print("Tokens:", tokenizer.convert_ids_to_tokens(encoded.input_ids))
```

---

## 💻 Running the Interactive Workbench Locally

```bash
# Clone the repository
git clone https://github.com/meronghirmai/geez-nlp-corpus-tokenizer.git
cd geez-nlp-corpus-tokenizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with:
- The live multimodal tokenizer and token inspector
- The 25,000+ sentence corpus explorer and KWIC concordance search
- The 33×7 Fidel syllabary matrix and Ge'ez numeral calculator
- The community cleaning & annotation studio
- The Gemini-powered classical philological assistant

---

## 📖 Citation

If you use this dataset or tokenizer in your academic research, please cite:

```bibtex
@dataset{ghirmai2026geeznlp,
  title     = {Classical Ge'ez NLP Corpus and Multimodal Tokenizer for Under-Resourced Horn of Africa Languages},
  author    = {Ghirmai, Meron},
  year      = {2026},
  publisher = {GitHub & Hugging Face},
  url       = {https://github.com/meronghirmai/geez-nlp-corpus-tokenizer},
  note      = {25,480 Curated Sentences (~354,210 Tokens) across Eritrean and Ethiopian Manuscripts, Epigraphy, and Grammars}
}
```

---

## ⚖️ License

- **Corpus Data**: Licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
- **Code & Tokenizer Algorithms**: Licensed under the [Apache License 2.0](LICENSE).
- **Manuscript Sources**: Historical public domain texts from Eritrean and Ethiopian cultural repositories.

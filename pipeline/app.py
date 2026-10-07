import os
import re
import sys
import time
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import Json

class GeezDataEngine:
    """
    Data engineering engine for Ge'ez and Ethiopic script processing:
    - Homophone normalization
    - Ethiopic wordspace tokenization
    - Automated ETL pipeline with PostgreSQL storage
    """

    def __init__(self, db_url: Optional[str] = None):
        self.db_url = db_url or os.getenv("DATABASE_URL")
        # Fallback parameters if DATABASE_URL is not set
        self.db_host = os.getenv("DB_HOST", "localhost")
        self.db_port = os.getenv("DB_PORT", "5432")
        self.db_name = os.getenv("DB_NAME", "geez_corpus")
        self.db_user = os.getenv("DB_USER", "postgres")
        self.db_pass = os.getenv("DB_PASSWORD", os.getenv("DB_PASS", "postgres"))

    def get_connection(self, max_retries: int = 10, retry_delay: int = 3):
        """
        Establish connection to PostgreSQL with retry logic (useful in Docker environments).
        """
        for attempt in range(1, max_retries + 1):
            try:
                if self.db_url:
                    conn = psycopg2.connect(self.db_url)
                else:
                    conn = psycopg2.connect(
                        host=self.db_host,
                        port=self.db_port,
                        database=self.db_name,
                        user=self.db_user,
                        password=self.db_pass,
                    )
                return conn
            except psycopg2.OperationalError as e:
                print(f"[GeezDataEngine] Connection attempt {attempt}/{max_retries} failed: {e}")
                if attempt == max_retries:
                    raise
                time.sleep(retry_delay)

    def init_schema(self) -> None:
        """
        Initialize the database schema, creating corpus_v2 table.
        Columns: url, raw_content, normalized_content, tokens (TEXT[]), metadata (JSONB).
        """
        print("[GeezDataEngine] Initializing database schema (corpus_v2)...")
        conn = self.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS corpus_v2 (
                        id SERIAL PRIMARY KEY,
                        url TEXT UNIQUE NOT NULL,
                        raw_content TEXT NOT NULL,
                        normalized_content TEXT NOT NULL,
                        tokens TEXT[] NOT NULL,
                        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE INDEX IF NOT EXISTS idx_corpus_v2_url ON corpus_v2(url);
                """)
            conn.commit()
            print("[GeezDataEngine] Schema initialization complete. 'corpus_v2' is ready.")
        finally:
            conn.close()

    def normalize_script(self, text: str) -> str:
        """
        Handle Ge'ez homophone variations using regex:
        - [ሐኀኃሃኃ] -> ሀ
        - [ሠ] -> ሰ
        - [ዐ] -> አ
        - [ፀ] -> ጸ
        """
        if not text:
            return ""
        # Apply homophone variation replacements as specified
        normalized = re.sub(r'[ሐኀኃሃኃ]', 'ሀ', text)
        normalized = re.sub(r'[ሠ]', 'ሰ', normalized)
        normalized = re.sub(r'[ዐ]', 'አ', normalized)
        normalized = re.sub(r'[ፀ]', 'ጸ', normalized)
        return normalized

    def tokenize(self, text: str) -> List[str]:
        """
        Tokenize Ge'ez/Ethiopic text based on Ethiopic wordspace (፡),
        standard whitespace, and canonical Ethiopic punctuation marks.
        """
        if not text:
            return []
        # Ethiopic wordspace (፡ U+1361) and punctuation (።፣፤፥፦፧፨) plus standard whitespace
        raw_tokens = re.split(r'[\s፡።፣፤፥፦፧፨]+', text)
        return [t.strip() for t in raw_tokens if t.strip()]

    def scrape_articles(self, base_url: str = "https://www.bbc.com/amharic", max_articles: int = 10) -> List[Dict[str, Any]]:
        """
        Scrape contemporary Ethiopic script articles from BBC News Amharic.
        """
        print(f"[GeezDataEngine] Scraping articles from {base_url}...")
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "am,en;q=0.9",
        }
        try:
            res = requests.get(base_url, headers=headers, timeout=15)
            res.raise_for_status()
        except Exception as e:
            print(f"[GeezDataEngine] Failed to access base URL {base_url}: {e}")
            return []

        soup = BeautifulSoup(res.text, "html.parser")
        links = soup.find_all("a", href=True)

        article_urls = set()
        for link in links:
            href = link["href"]
            if "/amharic/articles/" in href:
                full_url = href if href.startswith("http") else f"https://www.bbc.com{href}"
                article_urls.add(full_url)

        print(f"[GeezDataEngine] Found {len(article_urls)} unique article candidate links.")

        scraped_records = []
        for url in list(article_urls)[:max_articles]:
            try:
                print(f"[GeezDataEngine] Fetching: {url}")
                art_res = requests.get(url, headers=headers, timeout=15)
                art_res.raise_for_status()
                art_soup = BeautifulSoup(art_res.text, "html.parser")

                # Extract title
                title_tag = art_soup.find("h1")
                title = title_tag.get_text().strip() if title_tag else "No Title"

                # Extract article body paragraphs
                paragraphs = art_soup.find_all("p")
                body_parts = [p.get_text().strip() for p in paragraphs if p.get_text().strip()]
                raw_content = "\n\n".join(body_parts)

                if not raw_content:
                    print(f"[GeezDataEngine] Skipping empty content for {url}")
                    continue

                # Normalization & Tokenization
                normalized_content = self.normalize_script(raw_content)
                tokens = self.tokenize(normalized_content)

                metadata = {
                    "source": "BBC News Amharic",
                    "title": title,
                    "scraped_at": datetime.now(timezone.utc).isoformat(),
                    "char_count": len(raw_content),
                    "token_count": len(tokens),
                }

                scraped_records.append({
                    "url": url,
                    "raw_content": raw_content,
                    "normalized_content": normalized_content,
                    "tokens": tokens,
                    "metadata": metadata,
                })
            except Exception as e:
                print(f"[GeezDataEngine] Error processing article {url}: {e}")

        print(f"[GeezDataEngine] Successfully extracted {len(scraped_records)} articles.")
        return scraped_records

    def store_records(self, records: List[Dict[str, Any]]) -> int:
        """
        Upsert processed article records into corpus_v2 table.
        """
        if not records:
            print("[GeezDataEngine] No records to store.")
            return 0

        conn = self.get_connection()
        inserted_count = 0
        try:
            with conn.cursor() as cur:
                upsert_query = """
                    INSERT INTO corpus_v2 (url, raw_content, normalized_content, tokens, metadata)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (url) DO UPDATE SET
                        raw_content = EXCLUDED.raw_content,
                        normalized_content = EXCLUDED.normalized_content,
                        tokens = EXCLUDED.tokens,
                        metadata = EXCLUDED.metadata;
                """
                for r in records:
                    cur.execute(upsert_query, (
                        r["url"],
                        r["raw_content"],
                        r["normalized_content"],
                        r["tokens"],
                        Json(r["metadata"])
                    ))
                    inserted_count += 1
            conn.commit()
            print(f"[GeezDataEngine] Successfully upserted {inserted_count} records into corpus_v2.")
            return inserted_count
        finally:
            conn.close()

    def run_etl(self, max_articles: int = 10) -> int:
        """
        Full ETL workflow execution: scrape -> normalize -> tokenize -> store in PostgreSQL.
        """
        print("[GeezDataEngine] Starting Ge'ez ETL Pipeline execution...")
        self.init_schema()
        records = self.scrape_articles(max_articles=max_articles)
        count = self.store_records(records)
        print(f"[GeezDataEngine] Pipeline run finished. Total articles stored/updated: {count}")
        return count

def main():
    engine = GeezDataEngine()
    engine.init_schema()
    engine.run_etl()

    # If running inside a persistent container or worker
    interval = int(os.getenv("SCRAPE_INTERVAL_SECONDS", "86400"))
    if os.getenv("RUN_ONCE", "false").lower() in ("true", "1", "yes"):
        print("[GeezDataEngine] RUN_ONCE is enabled. Exiting cleanly.")
        sys.exit(0)

    print(f"[GeezDataEngine] Standing by. Next crawl in {interval} seconds...")
    while True:
        time.sleep(interval)
        try:
            engine.run_etl()
        except Exception as e:
            print(f"[GeezDataEngine] Error in scheduled run: {e}")

if __name__ == "__main__":
    main()

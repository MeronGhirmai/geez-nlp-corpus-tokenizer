import os
import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import execute_values
import time

# Database configuration from Environment Variables
DB_HOST = os.getenv("DB_HOST", "db")
DB_NAME = os.getenv("DB_NAME", "geez_corpus")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")

def get_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    # Create table for our Ge'ez corpus
    cur.execute('''
        CREATE TABLE IF NOT EXISTS scraped_data (
            id SERIAL PRIMARY KEY,
            url TEXT UNIQUE,
            title TEXT,
            content TEXT,
            tokens TEXT[],
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    conn.commit()
    cur.close()
    conn.close()

def simple_geez_tokenizer(text):
    """
    A lightweight Python implementation of your Ge'ez tokenizer logic.
    Splits by Ethiopic wordspace (፡) and punctuation.
    """
    punctuation = ['።', '፡', '፣', '፤', '፥', '፦', '፧', '፨']
    for p in punctuation:
        text = text.replace(p, ' ')
    return [token for token in text.split() if token]

def scrape_and_store():
    print("Starting Scrape...")
    url = "https://www.bbc.com/amharic" # Living source of Ethiopic script
    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.text, 'html.parser')
        links = soup.find_all('a', href=True)
        
        articles = []
        for link in links:
            if "/amharic/articles/" in link['href']:
                article_url = "https://www.bbc.com" + link['href']
                articles.append(article_url)
        
        conn = get_connection()
        cur = conn.cursor()

        for a_url in list(set(articles))[:10]: # Process top 10 articles
            article_res = requests.get(a_url)
            article_soup = BeautifulSoup(article_res.text, 'html.parser')
            
            title = article_soup.find('h1').text if article_soup.find('h1') else "No Title"
            paragraphs = article_soup.find_all('p')
            full_text = " ".join([p.text for p in paragraphs])
            
            # Use the tokenizer logic
            tokens = simple_geez_tokenizer(full_text)

            cur.execute(
                "INSERT INTO scraped_data (url, title, content, tokens) VALUES (%s, %s, %s, %s) ON CONFLICT (url) DO NOTHING",
                (a_url, title, full_text, tokens)
            )
            print(f"Stored: {title[:30]}...")

        conn.commit()
        cur.close()
        conn.close()
        print("Pipeline Run Complete.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    init_db()
    while True:
        scrape_and_store()
        print("Waiting 24 hours for next crawl...")
        time.sleep(86400) # Runs once a day

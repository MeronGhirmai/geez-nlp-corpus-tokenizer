import unittest
from unittest.mock import MagicMock
try:
    from pipeline.app import GeezDataEngine
except ImportError:
    from app import GeezDataEngine

class TestGeezDataEngine(unittest.TestCase):
    def setUp(self):
        self.engine = GeezDataEngine()

    def test_homophone_normalization(self):
        # [ሐኀኃሃኃ] -> ሀ, [ሠ] -> ሰ, [ዐ] -> አ, [ፀ] -> ጸ
        sample = "ሐኀኃሃኃ ሠርቀ ዐይነ ፀሐይ"
        normalized = self.engine.normalize_script(sample)
        self.assertEqual(normalized, "ሀሀሀሀሀ ሰርቀ አይነ ጸሀይ")

    def test_wordspace_tokenization(self):
        # Ethiopic wordspace (፡) and punctuation splitting
        sample = "ይደልወነ፡ንስግድ፡ለእግዚአብሔር።"
        tokens = self.engine.tokenize(sample)
        self.assertEqual(tokens, ["ይደልወነ", "ንስግድ", "ለእግዚአብሔር"])

    def test_init_schema_sql(self):
        mock_conn = MagicMock()
        mock_cur = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cur
        self.engine.get_connection = MagicMock(return_value=mock_conn)

        self.engine.init_schema()

        call_args = mock_cur.execute.call_args[0][0]
        self.assertIn("CREATE TABLE IF NOT EXISTS corpus_v2", call_args)
        self.assertIn("url TEXT UNIQUE NOT NULL", call_args)
        self.assertIn("raw_content TEXT NOT NULL", call_args)
        self.assertIn("normalized_content TEXT NOT NULL", call_args)
        self.assertIn("tokens TEXT[] NOT NULL", call_args)
        self.assertIn("metadata JSONB NOT NULL", call_args)
        mock_conn.commit.assert_called_once()

    def test_store_records_sql(self):
        mock_conn = MagicMock()
        mock_cur = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cur
        self.engine.get_connection = MagicMock(return_value=mock_conn)

        records = [{
            "url": "https://www.bbc.com/amharic/articles/sample",
            "raw_content": "ይደልወነ፡ንስግድ",
            "normalized_content": "ይደልወነ፡ንስግድ",
            "tokens": ["ይደልወነ", "ንስግድ"],
            "metadata": {"title": "Test Title", "source": "BBC Amharic"}
        }]

        stored = self.engine.store_records(records)
        self.assertEqual(stored, 1)
        mock_cur.execute.assert_called_once()
        sql_query = mock_cur.execute.call_args[0][0]
        self.assertIn("INSERT INTO corpus_v2", sql_query)
        self.assertIn("ON CONFLICT (url) DO UPDATE", sql_query)
        mock_conn.commit.assert_called_once()

if __name__ == "__main__":
    unittest.main()

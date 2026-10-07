@echo off
echo ===================================================
echo Starting Ge'ez NLP Corpus & Tokenizer Web Server...
echo ===================================================
echo.
echo Opening http://localhost:3000 in your default browser...
start http://localhost:3000
echo.
echo Starting dev server (Press Ctrl+C to stop)...
call npm.cmd run dev
pause

Kisah Sukses — Final Maintained (Local AI)

This package uses a local heuristic summarizer (no OpenAI key required).
It is designed to guarantee that the app works immediately after deployment.

To deploy:
1. Push all files to GitHub repository root.
2. On Render, create a Web Service connected to the repo.
3. Build command: npm install
4. Start command: npm start

Notes:
- Local AI is heuristic-based and produces concise summaries and action steps.
- If you later want to enable OpenAI API, we can replace the /api/ai handler with an OpenAI client version.

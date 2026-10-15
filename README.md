# ResumAI

An interactive resume builder with a live A4 preview, ATS-focused tools, and six editable templates.

## What you can do

- Edit personal details, summary, experience, skills, education, projects, certifications, and languages.
- Rearrange resume sections and compare templates and color themes in the live preview.
- Save progress locally in this browser and export a PDF, JSON backup, or ATS-friendly text.
- Use Gemini-powered generation, bullet rewrites, job matching, cover letters, and PDF analysis when a server API key is configured.

## Run locally

Requirements: Bun and Node.js 20 or newer.

```bash
bun install
```

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable AI actions. The editor, live preview, local save, and exports do not require an AI key.

```bash
bun run dev
```

The development server runs on `http://localhost:3000`.

## Checks

```bash
bun run lint
bun run build
```

This repository contains the runnable implementation. `Resume-AI` is a separate AI Studio starter placeholder.
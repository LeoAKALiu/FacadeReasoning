# Facade Reasoning Demo

A **Next.js + TypeScript + Tailwind** demo that showcases a focused workflow:

**few facade images → evidence extraction → parameter mapping → reasoning completion → structured results (with reliability + review-needed boundaries) → one-page export**.

The UI is intentionally “client-reporting friendly”: default views are **result-first**, with explanations folded into secondary areas.

## Requirements

- Node.js 18+ (recommended)
- npm (or your preferred package manager)

## Install

```bash
cd /root/FacadeReasoning
npm install
```

## Run (development)

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Build & run (production)

```bash
npm run build
npm run start
```

To change port (example):

```bash
npm run start -- -p 3001
```

## Project structure (high level)

- `src/app/` — App Router pages
  - `/` (Home)
  - `/[projectId]/evidence`
  - `/[projectId]/mapping`
  - `/[projectId]/reasoning`
  - `/[projectId]/overview`
  - `/[projectId]/export`
- `src/components/` — UI components by page/domain
- `src/data/` — mock cases and types (demo data)
- `public/assets/cases/` — per-case images (optional real assets)

## Case assets (optional but recommended)

Put real assets under:

`public/assets/cases/<case-id>/`

Example: `public/assets/cases/case-01/`

Expected filenames (placeholders exist; missing files fall back to inline placeholders):

- `facade-original.jpg` (or `.png` depending on case data)
- `facade-annotated.png`
- `facade-rectified.png`
- `detail-01.png` … `detail-04.png`
- `structure-sketch.svg`
- `parameter-preview.png` or `parameter-preview.svg`
- `component-candidates.svg` (optional)
- `report-preview.png` (optional)

See: `public/assets/cases/README.md`.

## Notes

- **No backend**: this is a demo with mock data and static assets.
- **Reliability vs review**: reliability is shown as a confidence signal; “待复核/人工复核” is the explicit boundary where manual verification is required.


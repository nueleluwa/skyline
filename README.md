# Henry Montego Homes — Montego Skyline II (landing page)

Vite + React + Tailwind + shadcn/ui (no shadcn Button: the site uses its own `.btn` style). It builds to plain static files, so it runs on any shared host, including cPanel.

```text
index.html          page head: title, meta description, social tags, JSON-LD
src/App.tsx         all sections
src/config.ts       the file you normally edit (contacts, form endpoint, enquiry types)
src/site.css        the site's design (tokens, layout, buttons, section styles)
src/components/     header, enquiry form, dialogs, shadcn/ui parts (ui/)
public/             assets (images, fonts, logo), sprite.svg, send.php
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173 (or the port shown)
npm run build    # outputs dist/
```

## Upload to cPanel

1. `npm run build`
2. In cPanel File Manager, upload **the contents of `dist/`** (not the folder itself) to `public_html`, or to a subfolder. Paths are relative, so either works.
3. `send.php` is included in `dist/` and emails enquiries to `info@henrymontegohomes.com` (change `$to` in `public/send.php`). It needs PHP `mail()`, which cPanel provides. Send a test enquiry after uploading and check the inbox and spam folder.

The dev server has no PHP, so there the form shows the "send by email or WhatsApp" fallback. That is expected.

## Before launch

- `index.html`: make `og:image` / `twitter:image` absolute URLs on the live domain and add `<link rel="canonical">` and `og:url`.
- `src/config.ts`: set `registerInterestUrl` if the Tally form should open from "Register your interest".
- Facebook link in the footer (`src/App.tsx`) once supplied.
- Left out until verified (see comments in `src/App.tsx`): figures strip items beyond 2 towers / 20 floors, Location travel times, Investment proof points, the Architecture "engineered for the future" line, developer awards.
- The amenities gallery uses details of the supplied building renders. Swap in verified interior renders when available.

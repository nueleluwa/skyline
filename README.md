# Henry Montego Homes — Oniru Twin Towers (one-page site)

Plain HTML, CSS and JavaScript. No build step, no dependencies. Open `index.html`, or upload the folder to any static host.

```
index.html        all sections, semantic markup, SEO / social metadata
css/styles.css    tokens + one block per section
js/config.js      the only file you normally need to edit
js/main.js        nav, reveal, dialogs, lightbox, enquiry form
assets/           optimised WebP renders, logo variants, favicon, og-image
```

## Before launch

Edit `js/config.js`:

| Setting | What it does |
| --- | --- |
| `formEndpoint` | URL that accepts a JSON POST (Formspree, CRM webhook, Zapier/Make, your API). While empty the form validates, then offers the visitor a pre-filled **email** (info@henrymontegohomes.com) or **WhatsApp** (09025441368) message. It never shows a fake "sent" message. |
| `registerInterestUrl` | The existing Tally form. When set, every "Register interest" link opens it. While empty they scroll to the enquiry form. |
| `filmUrl` | YouTube/Vimeo embed URL or `.mp4`. While empty, "Watch the Film" shows a "coming soon" panel. |

Also in `index.html`:

- Make `og:image` / `twitter:image` absolute URLs on the live domain, and add `<link rel="canonical">` and `og:url`.
- Add the Facebook link in the footer (comment marks the spot) once supplied.
- Amenities gallery: the brochure has no interior renders, so the three images are details of the building renders. Swap in verified fitness / lounge / dining renders, and check the amenities list against the approved development documentation.
- The "launch date to be confirmed" line appears in the hero and the form intro. Update both when a date is set.

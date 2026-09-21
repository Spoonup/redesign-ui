# SpoonUp — redesign

A from-scratch redesign of [spoonupfoods.com](https://spoonupfoods.com), built
as a static multi-page site with GSAP-driven animation.

## Structure

- [`frontend/`](frontend) — the site itself. Plain HTML/CSS/JS, no build step.
- [`backend/`](backend) — placeholder. No backend exists yet; see
  [`backend/README.md`](backend/README.md) for what's missing before this
  could take real orders.

## Running locally

No build tools needed — serve `frontend/` with any static file server, e.g.:

```bash
cd frontend
python -m http.server 5173
```

Then open http://localhost:5173.

## Status / known gaps

- Checkout is a placeholder — it shows a toast message instead of charging
  anything. No payment provider is wired up.
- The contact form opens the visitor's email client (`mailto:`) rather than
  submitting anywhere.
- Product data, prices and images are copied from the live spoonupfoods.com
  site as of the redesign date and should be reviewed by SpoonUp before this
  goes live.
- Product photos are currently loaded from SpoonUp's existing image hosting
  rather than bundled locally.

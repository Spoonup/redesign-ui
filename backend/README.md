# Backend

There is no backend yet. Everything in [`../frontend`](../frontend) is a static
site — plain HTML/CSS/JS with no server, database or API. The "cart" and
"checkout" in the frontend only use `localStorage`; nothing is actually
charged or persisted anywhere, and the contact form just opens the visitor's
email client.

To make this a real, working store, a backend would need to cover at least:

- **Product data** — an admin-editable source of truth (currently the catalog
  is hardcoded in `frontend/assets/js/data.js`, copied from the live
  spoonupfoods.com site).
- **Checkout & payments** — order creation plus a payment gateway integration
  (Razorpay/Stripe or similar) and GST calculation done server-side.
- **Orders** — storage, status (pickup/delivery), and a way for SpoonUp to see
  and fulfil incoming orders.
- **Delivery/pickup logic** — the ₹499 free-delivery threshold and address
  validation are currently client-side only and trivially bypassable.
- **Contact form** — an actual endpoint to receive and store/send messages,
  instead of `mailto:`.

None of this has been built. This folder is a placeholder so the repo has the
structure requested, not a claim that a backend exists.

# Tre's Beats Store (MVP)

A minimal Next.js + Stripe app for uploading and selling beats.

## 1) Prereqs
- Node 18+
- Stripe account (use **test mode**)
- (Optional) Resend account for emailing download links

## 2) Install
```bash
npm i   # or pnpm i / yarn
```

## 3) Env Vars – create `.env.local`
```bash
STRIPE_SECRET_KEY=sk_test_...

# Webhook secret created in Stripe CLI or Dashboard webhook endpoint
STRIPE_WEBHOOK_SECRET=whsec_...

# Simple admin gate for /upload
ADMIN_PASSWORD=change-me

# Public base URL (Vercel/Render) or http://localhost:3000
BASE_URL=http://localhost:3000

# Optional for emailing links via Resend
RESEND_API_KEY=re_...
FROM_EMAIL=Tre <no-reply@yourdomain.com>
```

## 4) Dev
```bash
npm run dev
# In another terminal: start Stripe webhook to your local server
# Requires Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook
```
> Test card: `4242 4242 4242 4242` with any future date, any CVC/ZIP.

## 5) Uploading
- Visit `/upload`, enter the admin password, fill details, select audio/cover, submit.
- Files save to `public/beats` (local). For production, switch to S3.

## 6) Buying & Delivery
- Click **Buy** → Stripe Checkout.
- On `checkout.session.completed`, the webhook (`/api/webhook`) issues a time‑limited download link and emails it (if RESEND configured). Otherwise it logs the link in server logs.

## 7) One‑click Deploy (Vercel)
1. Push this project to a Git repo (GitHub/GitLab/Bitbucket).
2. **Import** into Vercel → Framework: Next.js.
3. Add the Env Vars from step 3.
4. After deploy, create a **Stripe webhook endpoint** pointing to:
   `https://YOUR-VERCEL-DOMAIN/api/webhook`
   - Events: `checkout.session.completed` (you can add more later).
5. Test a purchase in Stripe test mode, confirm email/log contains the download link.

## 8) Production TODOs
- Switch storage to S3 (use AWS SDK + presigned URLs).
- Real auth for admin (e.g., Clerk/Auth.js).
- Database (Postgres + Prisma) for orders and licenses.
- Add license types/tiers (MP3/WAV/Trackouts) and watermarked previews.
- Rate limits + file validation.

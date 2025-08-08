import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { issueDownloadLink } from '@/lib/tokens';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const beatId = session.metadata?.beatId;
    const customerEmail = session.customer_details?.email;
    if (beatId && customerEmail) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const link = await issueDownloadLink(beatId, baseUrl);

      if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: customerEmail,
            subject: "Your beat download link",
            html: `<p>Thanks for your purchase!</p><p>Your download link (valid 2 hours): <a href="${link}">${link}</a></p>`
          });
        } catch (e) {
          console.error('Email send failed', e);
        }
      } else {
        console.log('Download link (send via email):', link, 'for', customerEmail);
      }
    }
  }
  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
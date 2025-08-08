import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getBeat } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { beatId } = await req.json();
  const beat = await getBeat(beatId);
  if (!beat) return NextResponse.json({ error: 'Beat not found' }, { status: 404 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: beat.title },
          unit_amount: beat.price,
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success`,
    cancel_url: `${baseUrl}/cancel`,
    metadata: { beatId: beat.id }
  });

  return NextResponse.json({ url: session.url });
}
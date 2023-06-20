import { stripe } from '@/pages/services/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { query as q } from 'faunadb'
import { fauna } from '@/pages/services/fauna'

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    const price = req.body.priceId

    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email)))
    )

    let stripeCustomerId = user.data.stripe_customer_id

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
            subscription_status: 'active',
            subscription_id: price,
            subscription_start_date: new Date(),
            subscription_end_date: new Date(
              new Date().getTime() + 30 * 24 * 60 * 60 * 1000
            ),
            subscription_interval: 'month',
            subscription_interval_count: 1,
            subscription_price: price,
            subscription_currency: 'usd',
          },
        })
      )

      stripeCustomerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{ price, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL || '',
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}

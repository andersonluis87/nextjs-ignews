import { fauna } from '@/pages/services/fauna'
import { stripe } from '@/pages/services/stripe'
import { query as q } from 'faunadb'

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  const USER_BY_STRIPE_CUSTOMER_ID_INDEX = 'user_by_stripe_customer_id'
  const SUBSCRIPTION_BY_ID_INDEX = 'subscription_by_id'

  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index(USER_BY_STRIPE_CUSTOMER_ID_INDEX), customerId))
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  await fauna.query(
    q.If(
      q.Not(
        q.Exists(q.Match(q.Index(SUBSCRIPTION_BY_ID_INDEX), subscriptionId))
      ),
      q.Create(q.Collection('subscriptions'), { data: subscriptionData }),
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index(SUBSCRIPTION_BY_ID_INDEX), subscriptionId))
        ),
        { data: subscriptionData }
      )
    )
  )
}

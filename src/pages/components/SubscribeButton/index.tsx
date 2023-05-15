import { useSession, signIn } from 'next-auth/react'
import styles from './styles.module.scss'
import { api } from '@/pages/services/api'
import { getStripeJs } from '@/pages/services/stripe-js'

interface SubscribeButtonProps {
  priceId: string
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status } = useSession()

  async function handleSubscribe() {
    if (status !== 'authenticated') {
      signIn('github')
      return
    }

    try {
      const response = await api.post('/subscribe', { priceId })

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err)
      console.log(err)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}

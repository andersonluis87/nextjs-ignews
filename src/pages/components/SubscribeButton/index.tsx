import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  console.log('priceId', priceId)
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  )
}

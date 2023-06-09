import { GetServerSideProps } from 'next'

import Head from 'next/head'
import Image from 'next/image'

import styles from './home.module.scss'
import SubscribeButton from './components/SubscribeButton'
import { stripe } from './services/stripe'

interface HomeProps {
  product: {
    priceId: string
    amount: string
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width={334}
          height={520}
        />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1N1qgtHA7un3vRFmxsv0JUw9', {
    expand: ['product'],
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((price.unit_amount || 0) / 100),
  }

  return {
    props: { product },
  }
}

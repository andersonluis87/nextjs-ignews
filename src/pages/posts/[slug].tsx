import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { createClient } from '../../../prismicio'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import styles from './post.module.scss'
import { ParsedUrlQuery } from 'querystring'
import { SessionSubscription } from '../api/auth/[...nextauth]'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

interface Params extends ParsedUrlQuery {
  slug: string
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session: SessionSubscription | null = await getSession({ req })

  console.log('session', session)

  const { slug } = params as Params

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const prismicClient = createClient()

  const response = await prismicClient.getByUID('post', String(slug))

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'en-US',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  }

  return {
    props: { post },
  }
}

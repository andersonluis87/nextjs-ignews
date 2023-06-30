import Head from 'next/head'
import styles from './styles.module.scss'
import { GetStaticProps } from 'next'
import { createClient } from '../../../prismicio'
import { RichText } from 'prismic-dom'
import { RTParagraphNode } from '@prismicio/types'

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(({ slug, title, excerpt, updatedAt }) => (
            <a href="" key={slug}>
              <time>{updatedAt}</time>
              <strong>{title}</strong>
              <p>{excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismicClient = createClient()

  const response = await prismicClient.getAllByType('post')
  console.log('posts', JSON.stringify(response[0], null, 2))

  const posts = response.map((post) => {
    const firstParagraph = post.data.content.find(
      (c) => c.type === 'paragraph'
    ) as RTParagraphNode

    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: firstParagraph?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'en-US',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    }
  })

  return {
    props: { posts },
  }
}

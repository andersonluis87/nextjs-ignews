import Image from 'next/image'
import SignInButton from '../SignInButton'
import styles from './styles.module.scss'

import { ActiveLink } from '../ActiveLink'

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width={110} height={31} />

        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            Home
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            Posts
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}

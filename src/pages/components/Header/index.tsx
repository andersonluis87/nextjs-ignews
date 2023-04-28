import { useState } from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import SignInButton from '../SignInButton'

export default function Header() {
  const [activeMenu, setActiveMenu] = useState('home')

  const handleActiveMenu = (menu: string) => {
    setActiveMenu(menu)
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width={110} height={31} />

        <nav>
          <a
            href="#"
            className={activeMenu === 'home' ? styles.active : ''}
            onClick={() => handleActiveMenu('home')}
          >
            Home
          </a>
          <a
            href="#"
            className={activeMenu === 'posts' ? styles.active : ''}
            onClick={() => handleActiveMenu('posts')}
          >
            Posts
          </a>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}

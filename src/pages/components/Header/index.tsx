import Image from 'next/image'

export function Header() {
  return (
    <header>
      <div>
        <Image src="/images/logo.svg" alt="ig.news" />
        <nav>
          <a href="" className="active">
            Home
          </a>
        </nav>
      </div>
    </header>
  )
}

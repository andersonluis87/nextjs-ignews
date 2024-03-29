import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement | string
  activeClassName: string
}

export function ActiveLink({
  children,
  activeClassName,
  ...props
}: ActiveLinkProps) {
  const { asPath } = useRouter()

  const className = asPath === props.href ? activeClassName : ''

  return (
    <Link {...props} className={className}>
      {children}
    </Link>
  )
}

import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'

export type SessionSubscription = Session & {
  activeSubscription?: object | null
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session }): Promise<SessionSubscription> {
      try {
        if (!session?.user?.email) {
          return {
            ...session,
            activeSubscription: null,
          }
        }
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        }
      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user }) {
      const { name, email } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email as q.ExprArg)
                )
              )
            ),
            q.Create(q.Collection('users'), {
              data: { email, name },
            }),
            q.Get(
              q.Match(q.Index('user_by_email'), q.Casefold(email as q.ExprArg))
            )
          )
        )

        return true
      } catch {
        return false
      }
    },
  },
}
export default NextAuth(authOptions)

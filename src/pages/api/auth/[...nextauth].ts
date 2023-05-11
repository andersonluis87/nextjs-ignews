import NextAuth, { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
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

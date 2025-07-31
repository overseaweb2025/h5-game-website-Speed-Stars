import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/en/auth/signin",
    error: "/en/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in - can add custom logic here
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img width="150px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>
   <h3 align="center">BrazyAuth.js</h3>
   <p align="center">Authentication for Next.js</p>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
</p>

## Overview

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

This is a monorepo containing the following packages / projects:

1. The primary `brazy-auth` package
2. A development test application
3. All `@brazy-auth/*-adapter` packages
4. The documentation site

## Getting Started

```
npm install --save brazy-auth
```

## Features

### Flexible and easy to use

- Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0
- Built-in support for [many popular sign-in services](https://next-auth.js.org/providers)
- Supports email / passwordless authentication
- Supports stateless authentication with any backend (Active Directory, LDAP, etc)
- Supports both JSON Web Tokens and database sessions
- Designed for Serverless but runs anywhere (AWS Lambda, Docker, Heroku, etc…)

### Own your own data

BrazyAuth.js can be used with or without a database.

- An open source solution that allows you to keep control of your data
- Supports Bring Your Own Database (BYOD) and can be used with any database
- Built-in support for [MySQL, MariaDB, Postgres, Microsoft SQL Server, MongoDB and SQLite](https://next-auth.js.org/configuration/databases)
- Works great with databases from popular hosting providers
- Can also be used _without a database_ (e.g. OAuth + JWT)

### Secure by default

- Promotes the use of passwordless sign-in mechanisms
- Designed to be secure by default and encourage best practices for safeguarding user data
- Uses Cross-Site Request Forgery (CSRF) Tokens on POST routes (sign in, sign out)
- Default cookie policy aims for the most restrictive policy appropriate for each cookie
- When JSON Web Tokens are enabled, they are encrypted by default (JWE) with A256GCM
- Auto-generates symmetric signing and encryption keys for developer convenience
- Features tab/window syncing and session polling to support short lived sessions
- Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org)

Advanced options allow you to define your own routines to handle controlling what accounts are allowed to sign in, for encoding and decoding JSON Web Tokens and to set custom cookie security policies and session properties, so you can control who is able to sign in and how often sessions have to be re-validated.

## Example

### Add API Route

```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from "brazy-auth"
import AppleProvider from "brazy-auth/providers/apple"
import GoogleProvider from "brazy-auth/providers/google"
import EmailProvider from "brazy-auth/providers/email"

export default NextAuth({
  secret: process.env.SECRET,
  providers: [
    // OAuth authentication providers
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Sign in with passwordless email link
    EmailProvider({
      server: process.env.MAIL_SERVER,
      from: "<no-reply@example.com>",
    }),
  ],
})
```

### Add React Hook

The `useSession()` React Hook in the BrazyAuth.js client is the easiest way to check if someone is signed in.

```javascript
import { useSession, signIn, signOut } from "brazy-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

### Share/configure session state

Use the `<SessionProvider>` to allow instances of `useSession()` to share the session object across components. It also takes care of keeping the session updated and synced between tabs/windows.

```jsx title="pages/_app.js"
import { SessionProvider } from "brazy-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

## License

ISC

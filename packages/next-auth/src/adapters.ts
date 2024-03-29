import { Account, User, Awaitable } from "."

export interface AdapterUser extends User {
  id: string
  emailVerified: string | null
}

export interface AdapterSession {
  id: string
  /** A randomly generated value that is used to get hold of the session. */
  sessionToken: string
  /** Used to connect the session to a particular user */
  accountId: string
  expires: Date
}

export interface VerificationToken {
  identifier: string
  expires: Date
  token: string
}

export interface SettingsAdapter {
  steam: boolean
}
/**
 * Using a custom adapter you can connect to any database backend or even several different databases.
 * Custom adapters created and maintained by our community can be found in the adapters repository.
 * Feel free to add a custom adapter from your project to the repository,
 * or even become a maintainer of a certain adapter.
 * Custom adapters can still be created and used in a project without being added to the repository.
 *
 * **Required methods**
 *
 * _(These methods are required for all sign in flows)_
 * - `createUser`
 * - `getUser`
 * - `getUserByEmail`
 * - `getUserByAccount`
 * - `linkAccount`
 * - `createSession`
 * - `getSessionAndUser`
 * - `updateSession`
 * - `deleteSession`
 * - `updateUser`
 *
 * _(Required to support email / passwordless sign in)_
 *
 * - `createVerificationToken`
 * - `useVerificationToken`
 *
 * **Unimplemented methods**
 *
 * _(These methods will be required in a future release, but are not yet invoked)_
 * - `deleteUser`
 * - `unlinkAccount`
 *
 * [Adapters Overview](https://next-auth.js.org/adapters/overview) |
 * [Create a custom adapter](https://next-auth.js.org/tutorials/creating-a-database-adapter)
 */
export interface Adapter {
  createUser: (user: Omit<AdapterUser, "id">) => Awaitable<AdapterUser>
  getUser: (id: string) => Awaitable<AdapterUser | null>
  getUserByEmail: (email: string) => Awaitable<AdapterUser | null>
  /** Using the provider id and the id of the user for a specific account, get the user. */
  getUserByAccount: (
    steamId: Pick<Account, "provider" | "steamId">
  ) => Awaitable<AdapterUser | null>
  updateUser: (user: Partial<AdapterUser>) => Awaitable<AdapterUser>
  /** @todo Implement */
  deleteUser?: (
    userId: string
  ) => Promise<void> | Awaitable<AdapterUser | null | undefined>
  getAccountBySteamId?: (
    steamId: string
  ) => Promise<void> | Awaitable<Account | null | undefined>
  updateUserKYC?: (
    steamId: string,
    applicantId: string,
    kycStatus: string
  ) => Promise<void> | Awaitable<User | null | undefined>
  updateAccount?: (
    account: Partial<Account>
  ) => Promise<Account | null>
  linkAccount: (
    account: Account
  ) => Promise<void> | Awaitable<Account | null | undefined>
  /** @todo Implement */
  unlinkAccount?: (
    steamId: Pick<Account, "provider" | "steamId">
  ) => Promise<void> | Awaitable<Account | undefined>
  /** Creates a session for the user and returns it. */
  createSession: (session: {
    sessionToken: string
    accountId: string
    expires: Date
  }) => Awaitable<AdapterSession>
  getSessionAndUser: (
    sessionToken: string
  ) => Awaitable<{ session: AdapterSession; user: AdapterUser } | null>
  updateSettings: (
    steam: boolean
  ) => Awaitable<AdapterSettings | null | undefined>
  updateSession: (
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
  ) => Awaitable<AdapterSession | null | undefined>
  /**
   * Deletes a session from the database.
   * It is preferred that this method also returns the session
   * that is being deleted for logging purposes.
   */
  deleteSession: (
    sessionToken: string
  ) => Promise<void> | Awaitable<AdapterSession | null | undefined>
  createVerificationToken?: (
    verificationToken: VerificationToken
  ) => Awaitable<VerificationToken | null | undefined>
  /**
   * Return verification token from the database
   * and delete it so it cannot be used again.
   */
  useVerificationToken?: (params: {
    identifier: string
    token: string
  }) => Awaitable<VerificationToken | null>
}

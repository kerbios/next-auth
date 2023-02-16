import type { Account, Account as AdapterAccount } from "brazy-auth"
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from "brazy-auth/adapters"
import { Sequelize, Model, ModelCtor, Identifier } from "sequelize"
import * as defaultModels from "./models"

export { defaultModels as models }

// @see https://sequelize.org/master/manual/typescript.html
interface AccountInstance
  extends Model<AdapterAccount, Partial<AdapterAccount>>,
    AdapterAccount {}
interface UserInstance
  extends Model<AdapterUser, Partial<AdapterUser>>,
    AdapterUser {}
interface SessionInstance
  extends Model<AdapterSession, Partial<AdapterSession>>,
    AdapterSession {}
interface VerificationTokenInstance
  extends Model<VerificationToken, Partial<VerificationToken>>,
    VerificationToken {}

interface SequelizeAdapterOptions {
  synchronize?: boolean
  models?: Partial<{
    User: ModelCtor<UserInstance>
    Account: ModelCtor<AccountInstance>
    Session: ModelCtor<SessionInstance>
    VerificationToken: ModelCtor<VerificationTokenInstance>
  }>
}

export default function SequelizeAdapter(
  client: Sequelize,
  options?: SequelizeAdapterOptions
): Adapter {
  const { models, synchronize = true } = options ?? {}
  const defaultModelOptions = { underscored: true, timestamps: false }
  const { User, Account, Session, VerificationToken } = {
    User:
      models?.User ??
      client.define<UserInstance>(
        "user",
        defaultModels.User,
        defaultModelOptions
      ),
    Account:
      models?.Account ??
      client.define<AccountInstance>(
        "account",
        defaultModels.Account,
        defaultModelOptions
      ),
    Session:
      models?.Session ??
      client.define<SessionInstance>(
        "session",
        defaultModels.Session,
        defaultModelOptions
      ),
    VerificationToken:
      models?.VerificationToken ??
      client.define<VerificationTokenInstance>(
        "verificationToken",
        defaultModels.VerificationToken,
        defaultModelOptions
      ),
  }
  let _synced = false
  const sync = async () => {
    if (process.env.NODE_ENV !== "production" && synchronize && !_synced) {
      const syncOptions =
        typeof synchronize === "object" ? synchronize : undefined

      await Promise.all([
        User.sync(syncOptions),
        Account.sync(syncOptions),
        Session.sync(syncOptions),
        VerificationToken.sync(syncOptions),
      ])

      _synced = true
    }
  }
  User.hasMany(Account);
  Account.belongsTo(User, { onDelete: "cascade" })
  Session.belongsTo(Account, { onDelete: "cascade" })

  return {
    async createUser(user) {
      await sync()

      return await User.create(user)
    },
    async getUser(id) {
      await sync()

      const userInstance = await User.findByPk(id)

      return userInstance?.get({ plain: true }) ?? null
    },
    async getUserByEmail(email) {
      await sync()

      const userInstance = await User.findOne({
        where: { email },
      })

      return userInstance?.get({ plain: true }) ?? null
    },
    async getUserByAccount({ provider, steamId }) {
      await sync()

      const accountInstance = await Account.findOne({
        where: { provider, steamId },
      })

      if (!accountInstance) {
        return null
      }

      const userInstance = await User.findByPk(accountInstance.userId)

      return userInstance?.get({ plain: true }) ?? null
    },
    async updateUser(user) {
      await sync()

      await User.update(user, { where: { id: user.id } })
      const userInstance = await User.findByPk(user.id)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return userInstance!
    },
    async deleteUser(userId) {
      await sync()

      const userInstance = await User.findByPk(userId)

      await User.destroy({ where: { id: userId } })

      return userInstance
    },
    async getAccountBySteamId(steamId: string) {
      await sync()
      const accountInstance = await Account.findOne({
        where: { steamId },
      })
      return accountInstance
    },
    async updateUserKYC(steamId: string, applicantId: string, kycStatus: string) {
      await sync()
      
      const filter = {
        where: {
          steamId
        }
      };

      const accountInstance = await Account.findOne(filter)

      if (!accountInstance) {
        return null
      }

      const userInstance = await User.findByPk(accountInstance.userId as Identifier)

      if (!userInstance) {
        return null
      }
  
      const affected = await userInstance.update({
        applicantId,
        kycStatus
      })

      if (affected) {
        return await User.findByPk(accountInstance.userId as Identifier)
      } else {
        return null
      }
    },
    async linkAccount(account) {
      await sync()

      return await Account.create(account)
    },
    async unlinkAccount({ provider, steamId }) {
      await sync()

      await Account.destroy({
        where: { provider, steamId },
      })
    },
    async updateAccount(account: Partial<Account>) {
      await sync()

      const affected = await Account.update(account, { where: { id: account.id } })

      if (affected) {
        return await Account.findByPk(account.id as Identifier)
      } else {
        return null
      }
    },
    async createSession(session) {
      await sync()

      return await Session.create(session)
    },
    async getSessionAndUser(sessionToken) {
      await sync()

      const sessionInstance = await Session.findOne({
        where: { sessionToken },
      })

      if (!sessionInstance) {
        return null
      }

      const userInstance = await User.findByPk(sessionInstance.accountId)

      if (!userInstance) {
        return null
      }

      return {
        session: sessionInstance?.get({ plain: true }),
        user: userInstance?.get({ plain: true }),
      }
    },
    async updateSession({ sessionToken, expires }) {
      await sync()

      await Session.update(
        { expires, sessionToken },
        { where: { sessionToken } }
      )

      return await Session.findOne({ where: { sessionToken } })
    },
    async deleteSession(sessionToken) {
      await sync()

      await Session.destroy({ where: { sessionToken } })
    },
    async createVerificationToken(token) {
      await sync()

      return await VerificationToken.create(token)
    },
    async useVerificationToken({ identifier, token }) {
      await sync()

      const tokenInstance = await VerificationToken.findOne({
        where: { identifier, token },
      })

      await VerificationToken.destroy({ where: { identifier } })

      return tokenInstance?.get({ plain: true }) ?? null
    },
  }
}

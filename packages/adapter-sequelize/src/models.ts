import { DataTypes } from "sequelize"

export const Account = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, allowNull: false },
  provider: { type: DataTypes.STRING, allowNull: false },
  steamId: { type: DataTypes.STRING, allowNull: false },
  apiKey: { type: DataTypes.STRING },
  tradeUrl: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  userId: { type: DataTypes.UUID },
}

export const User = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: "email" },
  emailVerified: { type: DataTypes.DATE },
}

export const Session = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expires: { type: DataTypes.DATE, allowNull: false },
  sessionToken: {
    type: DataTypes.STRING,
    unique: "sessionToken",
    allowNull: false,
  },
  accountId: { type: DataTypes.UUID },
}

export const VerificationToken = {
  token: { type: DataTypes.STRING, primaryKey: true },
  identifier: { type: DataTypes.STRING, allowNull: false },
  expires: { type: DataTypes.DATE, allowNull: false },
}

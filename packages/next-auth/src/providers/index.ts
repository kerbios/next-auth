import type { OAuthConfig, OAuthProvider, OAuthProviderType } from "./oauth"
import type { OpenIDConfig, OpenIDProvider, OpenIDProviderType } from "./openid"
import type { EmailConfig, EmailProvider, EmailProviderType } from "./email"

import type {
  CredentialsConfig,
  CredentialsProvider,
  CredentialsProviderType,
} from "./credentials"

export * from "./openid"
export * from "./oauth"
export * from "./email"
export * from "./credentials"


export type ProviderType = "oauth" | "email" | "credentials" | "openid"

export interface CommonProviderOptions {
  id: string
  name: string
  type: ProviderType
  options?: Record<string, unknown>
}

export type Provider = OAuthConfig<any> | EmailConfig | CredentialsConfig | OpenIDConfig<any>

export type BuiltInProviders = Record<OAuthProviderType, OAuthProvider> &
  Record<CredentialsProviderType, CredentialsProvider> &
  Record<EmailProviderType, EmailProvider> &
  Record<OpenIDProviderType, OpenIDProvider>

export type AppProviders = Array<
  Provider | ReturnType<BuiltInProviders[keyof BuiltInProviders]>
>

export interface AppProvider extends CommonProviderOptions {
  signinUrl: string
  callbackUrl: string
}

export type RedirectableProviderType = "email" | "credentials" | "openid"

export type BuiltInProviderType = RedirectableProviderType | OAuthProviderType

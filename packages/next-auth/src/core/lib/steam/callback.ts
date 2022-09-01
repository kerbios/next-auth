import OpenIDClient from './client'

export default async (url, provider) => {
  console.log('CALLBACK', url)
  const client = OpenIDClient(provider)

  const { claimedIdentifier } = await client.verifyAssertion(url)

  const profile = await provider.profile(claimedIdentifier)

  return {
    claimedIdentifier,
    account: {
      provider: provider.id,
      type: provider.type,
      id: profile.id
    },
    profile: {
      name: profile.name,
      email: profile.email ? profile.email.toLowerCase() : null,
      image: profile.image
    }
  }
}
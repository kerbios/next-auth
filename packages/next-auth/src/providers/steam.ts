import fetch from 'node-fetch'

export default function SteamProvider(options) {
  const { apiKey } = options
  return {
    id: 'steam',
    name: 'Steam',
    type: 'openid',
    authenticationUrl: 'https://steamcommunity.com/openid',
    realm: null,
    stateless: true,
    strict: false,
    extensions: [],
    async profile (identifier) {
      // the identifier is an URL to the users profile.
      // Let's extract the steamID from it first.
      const [steamID] = identifier.split('/').slice(-1)

      const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamID}&format=json`)
      if (!response.ok) {
        throw new Error(`Unable to fetch Steam Profile. Status: ${response.status}`)
      }
      const json = await response.json()
      const [{
        steamid: id,
        personaname: name,
        avatarfull: image
      }] = json.response.players

      return { id, name, image }
    },
    ...options
  }
}
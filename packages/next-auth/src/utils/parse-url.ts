export interface InternalUrl {
  /** @default "https://dev.example.com:3000" */
  origin: string
  /** @default "dev.example.com:3000" */
  host: string
  /** @default "/api/auth" */
  path: string
  /** @default "https://dev.example.com:3000/api/auth" */
  base: string
  /** @default "https://dev.example.com:3000/api/auth" */
  toString: () => string
}

/** Returns an `URL` like object to make requests/redirects from server-side */
export default function parseUrl(url?: string): InternalUrl {
  const defaultUrl = new URL("https://dev.example.com/api/auth")

  if (url && !url.startsWith("http")) {
    url = `https://${url}`
  }

  const _url = new URL(url ?? defaultUrl)
  const path = (_url.pathname === "/" ? defaultUrl.pathname : _url.pathname)
    // Remove trailing slash
    .replace(/\/$/, "")

  const base = `${_url.origin}${path}`

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  }
}

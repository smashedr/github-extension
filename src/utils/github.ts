interface Repository {
  owner: string
  name: string
  url: string
}

export function getOwnerRepo(fullUrl?: string): Repository | null {
  console.log('getOwnerRepo:', fullUrl)
  if (!fullUrl) return null
  try {
    const url = new URL(fullUrl)
    const [owner, name] = url.pathname.split('/').filter(Boolean)
    if (!owner || !name) return null
    if (GITHUB_RESERVED_PATHS.has(owner.toLowerCase())) return null
    return { owner, name, url: `${url.origin}/${owner}/${name}` }
  } catch (error) {
    console.log('error:', error)
    return null
  }
}

const GITHUB_RESERVED_PATHS = new Set([
  'explore',
  'trending',
  'topics',
  'collections',
  'events',
  'search',
  'dashboard',
  'notifications',
  'issues',
  'pulls',
  'stars',
  'watching',
  'settings',
  'login',
  'logout',
  'join',
  'session',
  'sessions',
  'password_reset',
  'account',
  'new',
  'orgs',
  'organizations',
  'users',
  'teams',
  'marketplace',
  'sponsors',
  'features',
  'enterprise',
  'pricing',
  'security',
  'codespaces',
  'copilot',
  'apps',
  'gists',
  'about',
  'contact',
  'site',
  'home',
  'readme',
  '404',
  '500',
])

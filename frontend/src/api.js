import Cookies from 'js-cookie'

// The backend address lives here once, read from the environment.
// Supports both VITE_API_URL and VITE_API_BASE_URL
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000'

const API_URL = BASE_URL
export default API_URL

export const apiUrl = path => `${BASE_URL}${path}`

// --- Tokens -----------------------------------------------------------------
const ACCESS_TOKEN_KEY = 'jwt_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY)

export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY)

export const saveTokens = ({access, refresh}) => {
  Cookies.set(ACCESS_TOKEN_KEY, access, {expires: 30})
  Cookies.set(REFRESH_TOKEN_KEY, refresh, {expires: 30})
}

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}

// --- One fetch for the whole app --------------------------------------------
export const apiFetch = (path, options = {}) => {
  const token = getAccessToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token !== undefined) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(apiUrl(path), {...options, headers})
}

import type { AuthUser } from 'shared-types'
import { API_URL, request } from './client'

export const loginUrl = `${API_URL}/auth/google`

export const authApi = {
  me: () => request<AuthUser>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
}

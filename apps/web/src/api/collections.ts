import type { Collection, CreateCollectionPayload, UpdateCollectionPayload } from 'shared-types'
import { request } from './client'

export const collectionsApi = {
  list: () => request<Collection[]>('/collections'),
  get: (id: string) => request<Collection>(`/collections/${id}`),
  create: (payload: CreateCollectionPayload) =>
    request<Collection>('/collections', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: UpdateCollectionPayload) =>
    request<Collection>(`/collections/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: string) => request<void>(`/collections/${id}`, { method: 'DELETE' }),
}

import type { Item, CreateItemPayload, UpdateItemPayload } from 'shared-types'
import { request } from './client'

export const itemsApi = {
  list: (collectionId: string) => request<Item[]>(`/collections/${collectionId}/items`),
  get: (collectionId: string, id: string) =>
    request<Item>(`/collections/${collectionId}/items/${id}`),
  create: (collectionId: string, payload: CreateItemPayload) =>
    request<Item>(`/collections/${collectionId}/items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (collectionId: string, id: string, payload: UpdateItemPayload) =>
    request<Item>(`/collections/${collectionId}/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  remove: (collectionId: string, id: string) =>
    request<void>(`/collections/${collectionId}/items/${id}`, { method: 'DELETE' }),
}

export interface AuthUser {
  email: string;
}

export type ItemStatus = 'not_owned' | 'pending' | 'owned';

export interface Item {
  id: string;
  name: string;
  releaseYear: number | null;
  // Full-resolution photos, in display order. Only populated on the item
  // detail endpoint — absent when the item comes from a Collection's
  // `items` (use `thumbnail` there instead).
  images: string[];
  // Resized/compressed copy of images[0], generated server-side.
  thumbnail: string | null;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  // Resized/compressed cover photo, generated server-side.
  thumbnail: string | null;
  // Present only when the API includes the relation (detail endpoint), absent on list responses.
  items?: Item[];
  // Present only on list responses (loaded as a count, not the full relation).
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  image?: string | null;
}

export type UpdateCollectionPayload = Partial<CreateCollectionPayload>;

export interface CreateItemPayload {
  name: string;
  releaseYear?: number | null;
  images?: string[];
  status?: ItemStatus;
}

export type UpdateItemPayload = Partial<CreateItemPayload>;

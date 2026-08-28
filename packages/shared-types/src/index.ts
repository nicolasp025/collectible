export interface Attribute {
  key: string;
  value: string;
}

export type ItemStatus = 'not_owned' | 'pending' | 'owned';

export interface Item {
  id: string;
  name: string;
  releaseYear: number | null;
  // Full-resolution image. Only populated on the item detail endpoint —
  // absent when the item comes from a Collection's `items` (use `thumbnail`
  // there instead, which is always populated alongside `image`).
  image: string | null;
  // Resized/compressed copy of `image`, generated server-side.
  thumbnail: string | null;
  status: ItemStatus;
  attributes: Attribute[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  // Present only when the API includes the relation (detail endpoint), absent on list responses.
  items?: Item[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
}

export type UpdateCollectionPayload = Partial<CreateCollectionPayload>;

export interface CreateItemPayload {
  name: string;
  releaseYear?: number | null;
  image?: string | null;
  status?: ItemStatus;
  attributes?: Attribute[];
}

export type UpdateItemPayload = Partial<CreateItemPayload>;

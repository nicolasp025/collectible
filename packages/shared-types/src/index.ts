export interface Attribute {
  key: string;
  value: string;
}

export interface Item {
  id: string;
  name: string;
  releaseDate: string | null;
  image: string | null;
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
  releaseDate?: string | null;
  image?: string | null;
  attributes?: Attribute[];
}

export type UpdateItemPayload = Partial<CreateItemPayload>;

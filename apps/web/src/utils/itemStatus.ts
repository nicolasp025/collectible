import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { ItemStatus } from 'shared-types'

export const ITEM_STATUSES: ItemStatus[] = ['not_owned', 'pending', 'owned']

export const ITEM_STATUS_CONFIG: Record<
  ItemStatus,
  { label: string; icon: typeof XCircle; colorClass: string }
> = {
  not_owned: { label: 'Non possédé', icon: XCircle, colorClass: 'text-rgx-danger' },
  pending: { label: 'En attente', icon: Clock, colorClass: 'text-rgx-warning' },
  owned: { label: 'Possédé', icon: CheckCircle2, colorClass: 'text-rgx-accent' },
}

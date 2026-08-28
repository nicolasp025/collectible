import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react'
import type { Collection, Item } from 'shared-types'
import { collectionsApi } from '../api/collections'
import { ITEM_STATUS_CONFIG } from '../utils/itemStatus'
import { ItemImage } from '../components/ItemImage'

type SortKey = 'year-desc' | 'year-asc' | 'name-asc' | 'name-desc'

// Items without a year always sink to the bottom; ties (including same year)
// fall back to the name so the order stays stable and predictable.
function compareByYear(a: Item, b: Item, direction: 1 | -1) {
  if (a.releaseYear === b.releaseYear) return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
  if (a.releaseYear === null) return 1
  if (b.releaseYear === null) return -1
  return direction * (b.releaseYear - a.releaseYear)
}

export default function CollectionItemsPage() {
  const { collectionId } = useParams<{ collectionId: string }>()
  const navigate = useNavigate()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('year-desc')

  useEffect(() => {
    if (!collectionId) return
    setLoading(true)
    collectionsApi
      .get(collectionId)
      .then(setCollection)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [collectionId])

  const items = collection?.items ?? []

  const sortedItems = useMemo(() => {
    const arr = [...items]
    switch (sortKey) {
      case 'year-desc':
        return arr.sort((a, b) => compareByYear(a, b, 1))
      case 'year-asc':
        return arr.sort((a, b) => compareByYear(a, b, -1))
      case 'name-asc':
        return arr.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
      case 'name-desc':
        return arr.sort((a, b) => b.name.localeCompare(a.name, 'fr', { sensitivity: 'base' }))
    }
  }, [items, sortKey])

  if (loading) {
    return (
      <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
        <div className="font-mono text-[13px] text-rgx-muted">Chargement...</div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
        <div className="font-mono text-[13px] text-rgx-danger">{error || 'Collection introuvable.'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
      <button
        onClick={() => navigate('/')}
        className="mb-[22px] flex cursor-pointer items-center gap-1.5 border-none bg-none p-0 font-mono text-[12px] text-rgx-muted-2"
      >
        <ArrowLeft size={14} /> RETOUR AUX COLLECTIONS
      </button>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-heading text-[26px] font-bold">{collection.name}</h1>
        <div className="flex items-center gap-[18px]">
          <span className="font-mono text-[12px] text-rgx-muted">
            {items.length} ITEM{items.length > 1 ? 'S' : ''}
          </span>
          <button
            onClick={() => navigate(`/collections/${collectionId}/items/new`)}
            className="flex cursor-pointer items-center gap-2 border-none bg-rgx-accent px-4 py-2.5 font-heading text-[13px] font-semibold tracking-[0.04em] text-rgx-bg [clip-path:polygon(0_0,100%_0,100%_100%,12px_100%,0_calc(100%-12px))]"
          >
            <Plus size={16} strokeWidth={2.5} />
            AJOUTER
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-5 flex items-center gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.06em] text-rgx-muted">TRIER PAR</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="cursor-pointer border border-rgx-border-strong bg-rgx-surface-alt px-2.5 py-2 font-mono text-[12px] text-rgx-text outline-none"
          >
            <option value="year-desc">Année de sortie (plus récents)</option>
            <option value="year-asc">Année de sortie (moins récents)</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
          </select>
        </div>
      )}

      {items.length === 0 ? (
        <div className="border border-dashed border-rgx-border-strong px-5 py-[60px] text-center font-mono text-[13px] text-rgx-muted">
          Aucun item référencé pour le moment.
          <div className="mt-3.5">
            <button
              onClick={() => navigate(`/collections/${collectionId}/items/new`)}
              className="cursor-pointer border border-rgx-accent bg-transparent px-4 py-2 font-heading text-[12px] font-semibold tracking-[0.05em] text-rgx-accent"
            >
              AJOUTER UN ITEM
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
          {sortedItems.map((item) => {
            const status = ITEM_STATUS_CONFIG[item.status]
            const StatusIcon = status.icon
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/collections/${collectionId}/items/${item.id}`)}
                className="group relative flex cursor-pointer flex-col overflow-hidden border border-rgx-border bg-rgx-surface p-0 text-left text-inherit transition-colors after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-transparent after:content-[''] hover:border-rgx-accent hover:after:bg-rgx-accent"
              >
                <ItemImage
                  name={item.name}
                  image={item.thumbnail}
                  className="h-[250px] w-full border-b border-rgx-border"
                />
                <div
                  className={`absolute top-2.5 right-2.5 rounded-full bg-rgx-bg/80 p-1 ${status.colorClass}`}
                  title={status.label}
                >
                  <StatusIcon size={16} strokeWidth={2.5} />
                </div>
                <div className="px-4 pt-3.5 pb-4">
                  <div className="mb-1.5 font-heading text-[15px] font-semibold">{item.name}</div>
                  <div className="flex items-center justify-between font-mono text-[11.5px] text-rgx-muted">
                    <span>{item.releaseYear ?? '—'}</span>
                    <span className="text-rgx-accent">
                      {item.attributes.length} ATTR <ChevronRight size={12} className="inline -translate-y-px" />
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

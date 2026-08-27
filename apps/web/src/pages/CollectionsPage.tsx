import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Collection } from 'shared-types'
import { collectionsApi } from '../api/collections'
import { formatDate } from '../utils/formatDate'
import { DotMenu } from '../components/DotMenu'
import { CollectionFormModal } from '../components/CollectionFormModal'
import { ConfirmModal } from '../components/ConfirmModal'

export default function CollectionsPage() {
  const navigate = useNavigate()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formTarget, setFormTarget] = useState<Collection | null | 'new'>(null)
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null)

  const load = () => {
    setLoading(true)
    collectionsApi
      .list()
      .then(setCollections)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSave = (name: string) => {
    const promise =
      formTarget === 'new' ? collectionsApi.create({ name }) : collectionsApi.update(formTarget!.id, { name })
    promise
      .then(() => {
        setFormTarget(null)
        load()
      })
      .catch((e) => setError(e.message))
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    collectionsApi
      .remove(deleteTarget.id)
      .then(() => {
        setDeleteTarget(null)
        load()
      })
      .catch((e) => setError(e.message))
  }

  return (
    <div className="min-h-screen bg-rgx-bg text-rgx-text">
      <div className="flex items-center justify-between border-b border-rgx-border px-7 py-5">
        <span className="font-heading text-[18px] font-bold tracking-[0.06em]">
          <span className="mr-2.5 inline-block h-3 w-3 -translate-y-px bg-rgx-accent [clip-path:polygon(0_0,100%_0,100%_60%,60%_100%,0_100%)]" />
          RGX <span className="text-rgx-accent">// COLLECTIBLE</span>
        </span>
        <div className="flex items-center gap-[18px]">
          <span className="font-mono text-[12px] text-rgx-muted">
            {collections.length} COLLECTION{collections.length > 1 ? 'S' : ''}
          </span>
          <button
            onClick={() => setFormTarget('new')}
            className="flex cursor-pointer items-center gap-2 border-none bg-rgx-accent px-4 py-2.5 font-heading text-[13px] font-semibold tracking-[0.04em] text-rgx-bg [clip-path:polygon(0_0,100%_0,100%_100%,12px_100%,0_calc(100%-12px))]"
          >
            <Plus size={16} strokeWidth={2.5} />
            CRÉER UNE COLLECTION
          </button>
        </div>
      </div>

      <div className="p-7">
        {error && <div className="mb-4 font-mono text-[12.5px] text-rgx-danger">{error}</div>}

        {loading ? (
          <div className="font-mono text-[13px] text-rgx-muted">Chargement...</div>
        ) : collections.length === 0 ? (
          <div className="border border-dashed border-rgx-border-strong px-5 py-[60px] text-center font-mono text-[13px] text-rgx-muted">
            Aucune collection pour le moment.
            <div className="mt-3.5">
              <button
                onClick={() => setFormTarget('new')}
                className="cursor-pointer border border-rgx-accent bg-transparent px-4 py-2 font-heading text-[12px] font-semibold tracking-[0.05em] text-rgx-accent"
              >
                CRÉER UNE COLLECTION
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/collections/${collection.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/collections/${collection.id}`)
                }}
                className="group relative cursor-pointer overflow-hidden border border-rgx-border bg-rgx-surface transition-colors after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-transparent after:content-[''] hover:border-rgx-accent hover:after:bg-rgx-accent"
              >
                <div className="flex h-[140px] w-full items-center justify-center border-b border-rgx-border bg-[repeating-linear-gradient(135deg,#12160F_0px,#12160F_10px,#161C13_10px,#161C13_20px)] font-heading text-[2.5rem] font-bold text-[#3A4A35]">
                  {collection.name.trim().charAt(0).toUpperCase() || '?'}
                </div>
                <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
                  <DotMenu onEdit={() => setFormTarget(collection)} onDelete={() => setDeleteTarget(collection)} />
                </div>
                <div className="px-4 pt-3.5 pb-4">
                  <div className="mb-1.5 font-heading text-[15px] font-semibold">{collection.name}</div>
                  <div className="font-mono text-[11.5px] text-rgx-muted">{formatDate(collection.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formTarget && (
        <CollectionFormModal
          initial={formTarget === 'new' ? null : formTarget}
          onCancel={() => setFormTarget(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title={`Supprimer "${deleteTarget.name}" ?`}
          message="Cette action est définitive et supprimera aussi tous les items de cette collection."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

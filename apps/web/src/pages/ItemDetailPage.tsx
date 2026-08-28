import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import type { Item } from 'shared-types'
import { itemsApi } from '../api/items'
import { ITEM_STATUS_CONFIG } from '../utils/itemStatus'
import { ItemImage } from '../components/ItemImage'
import { ConfirmModal } from '../components/ConfirmModal'

export default function ItemDetailPage() {
  const { collectionId, itemId } = useParams<{ collectionId: string; itemId: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)
  const [hasNavigated, setHasNavigated] = useState(false)

  useEffect(() => {
    if (!collectionId || !itemId) return
    setLoading(true)
    itemsApi
      .get(collectionId, itemId)
      .then((i) => {
        setItem(i)
        setPhotoIndex(0)
        setHasNavigated(false)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [collectionId, itemId])

  const handleDelete = () => {
    if (!collectionId || !itemId) return
    itemsApi
      .remove(collectionId, itemId)
      .then(() => navigate(`/collections/${collectionId}`))
      .catch((e) => setError(e.message))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
        <div className="font-mono text-[13px] text-rgx-muted">Chargement...</div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
        <div className="font-mono text-[13px] text-rgx-danger">{error || 'Item introuvable.'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
      <div className="mx-auto max-w-[1100px]">
        <button
          onClick={() => navigate(`/collections/${collectionId}`)}
          className="mb-[22px] flex cursor-pointer items-center gap-1.5 border-none bg-none p-0 font-mono text-[12px] text-rgx-muted-2"
        >
          <ArrowLeft size={14} /> RETOUR À LA LISTE
        </button>

        <div className="grid grid-cols-[520px_1fr] gap-7">
          <div className="relative overflow-hidden">
            <ItemImage
              key={photoIndex}
              name={item.name}
              image={item.images[photoIndex] ?? null}
              className={`h-[520px] w-full border border-rgx-border ${
                hasNavigated
                  ? slideDirection === 1
                    ? 'animate-[rgx-slide-in-right_550ms_cubic-bezier(0.4,0,0.2,1)]'
                    : 'animate-[rgx-slide-in-left_550ms_cubic-bezier(0.4,0,0.2,1)]'
                  : ''
              }`}
            />
            {item.images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setHasNavigated(true)
                    setSlideDirection(-1)
                    setPhotoIndex((i) => (i - 1 + item.images.length) % item.images.length)
                  }}
                  aria-label="Photo précédente"
                  className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-rgx-bg/80 text-rgx-text"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => {
                    setHasNavigated(true)
                    setSlideDirection(1)
                    setPhotoIndex((i) => (i + 1) % item.images.length)
                  }}
                  aria-label="Photo suivante"
                  className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-rgx-bg/80 text-rgx-text"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute right-2 bottom-2 rounded-full bg-rgx-bg/80 px-2 py-0.5 font-mono text-[11px] text-rgx-text">
                  {photoIndex + 1} / {item.images.length}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="mb-1.5 font-mono text-[11.5px] tracking-[0.08em] text-rgx-accent">
              SORTIE : {item.releaseYear ?? '—'}
            </div>
            <h1 className="m-0 mb-2 font-heading text-[30px] leading-[1.15] font-bold">{item.name}</h1>
            {(() => {
              const status = ITEM_STATUS_CONFIG[item.status]
              const StatusIcon = status.icon
              return (
                <div className={`mb-5 flex items-center gap-1.5 font-mono text-[12px] tracking-[0.04em] ${status.colorClass}`}>
                  <StatusIcon size={14} strokeWidth={2.5} />
                  {status.label.toUpperCase()}
                </div>
              )
            })()}

            <div className="mb-[26px] flex gap-2.5">
              <button
                onClick={() => navigate(`/collections/${collectionId}/items/${itemId}/edit`)}
                className="flex cursor-pointer items-center gap-1.5 border border-rgx-accent bg-transparent px-3.5 py-2 font-heading text-[12.5px] font-semibold tracking-[0.04em] text-rgx-accent"
              >
                <Pencil size={13} /> MODIFIER
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 border border-[#3A2323] bg-transparent px-3.5 py-2 font-heading text-[12.5px] font-semibold tracking-[0.04em] text-rgx-danger"
              >
                <Trash2 size={13} /> SUPPRIMER
              </button>
            </div>

            <div className="mb-2 border-b border-rgx-border pb-2 font-mono text-[11px] tracking-[0.1em] text-rgx-muted">
              FICHE TECHNIQUE
            </div>
            <table className="w-full border-collapse">
              <tbody>
                {item.attributes.length === 0 && (
                  <tr>
                    <td className="py-2.5 font-mono text-[12.5px] text-rgx-muted">Aucun attribut renseigné.</td>
                  </tr>
                )}
                {item.attributes.map((attr, i) => (
                  <tr key={i} className="border-b border-[#161C13]">
                    <td className="w-[40%] py-2.5 pr-3.5 font-mono text-[12px] tracking-[0.04em] whitespace-nowrap text-rgx-accent">
                      {attr.key.toUpperCase()}
                    </td>
                    <td className="py-2.5 text-[13.5px] text-rgx-text">{attr.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {confirmOpen && (
          <ConfirmModal
            title={`Supprimer "${item.name}" ?`}
            message="Cette action est définitive et retirera l'item de la liste."
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

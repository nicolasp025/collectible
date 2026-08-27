import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import type { Item } from 'shared-types'
import { itemsApi } from '../api/items'
import { formatDateOnly } from '../utils/formatDate'
import { ItemImage } from '../components/ItemImage'
import { ConfirmModal } from '../components/ConfirmModal'

export default function ItemDetailPage() {
  const { collectionId, itemId } = useParams<{ collectionId: string; itemId: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!collectionId || !itemId) return
    setLoading(true)
    itemsApi
      .get(collectionId, itemId)
      .then(setItem)
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
      <div className="mx-auto max-w-[900px]">
        <button
          onClick={() => navigate(`/collections/${collectionId}`)}
          className="mb-[22px] flex cursor-pointer items-center gap-1.5 border-none bg-none p-0 font-mono text-[12px] text-rgx-muted-2"
        >
          <ArrowLeft size={14} /> RETOUR À LA LISTE
        </button>

        <div className="grid grid-cols-[300px_1fr] gap-7">
          <div>
            <ItemImage name={item.name} image={item.image} className="h-[260px] w-full border border-rgx-border" />
          </div>

          <div>
            <div className="mb-1.5 font-mono text-[11.5px] tracking-[0.08em] text-rgx-accent">
              SORTIE : {formatDateOnly(item.releaseDate).toUpperCase()}
            </div>
            <h1 className="m-0 mb-5 font-heading text-[30px] leading-[1.15] font-bold">{item.name}</h1>

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

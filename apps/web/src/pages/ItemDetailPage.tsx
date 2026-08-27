import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import type { Item } from 'shared-types'
import { itemsApi } from '../api/items'
import { colors } from '../theme'
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
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
        <div style={{ color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          Chargement...
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
        <div style={{ color: colors.danger, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          {error || 'Item introuvable.'}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button
          onClick={() => navigate(`/collections/${collectionId}`)}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textMuted2,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            marginBottom: 22,
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> RETOUR À LA LISTE
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28 }}>
          <div>
            <ItemImage
              name={item.name}
              image={item.image}
              style={{ width: '100%', height: 260, border: `1px solid ${colors.border}` }}
            />
          </div>

          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                color: colors.accent,
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}
            >
              SORTIE : {formatDateOnly(item.releaseDate).toUpperCase()}
            </div>
            <h1
              style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700,
                fontSize: 30,
                margin: '0 0 20px',
                lineHeight: 1.15,
              }}
            >
              {item.name}
            </h1>

            <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
              <button
                onClick={() => navigate(`/collections/${collectionId}/items/${itemId}/edit`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'transparent',
                  border: `1px solid ${colors.accent}`,
                  color: colors.accent,
                  padding: '8px 14px',
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 600,
                  fontSize: 12.5,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                <Pencil size={13} /> MODIFIER
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'transparent',
                  border: '1px solid #3A2323',
                  color: colors.danger,
                  padding: '8px 14px',
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 600,
                  fontSize: 12.5,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={13} /> SUPPRIMER
              </button>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: colors.textMuted,
                letterSpacing: '0.1em',
                marginBottom: 8,
                borderBottom: `1px solid ${colors.border}`,
                paddingBottom: 8,
              }}
            >
              FICHE TECHNIQUE
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {item.attributes.length === 0 && (
                  <tr>
                    <td
                      style={{
                        padding: '10px 0',
                        color: colors.textMuted,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12.5,
                      }}
                    >
                      Aucun attribut renseigné.
                    </td>
                  </tr>
                )}
                {item.attributes.map((attr, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #161C13' }}>
                    <td
                      style={{
                        padding: '9px 14px 9px 0',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: colors.accent,
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                        width: '40%',
                      }}
                    >
                      {attr.key.toUpperCase()}
                    </td>
                    <td
                      style={{
                        padding: '9px 0',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        color: colors.text,
                      }}
                    >
                      {attr.value}
                    </td>
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

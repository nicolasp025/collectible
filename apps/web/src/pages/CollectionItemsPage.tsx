import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react'
import type { Collection } from 'shared-types'
import { collectionsApi } from '../api/collections'
import { colors } from '../theme'
import { formatDateOnly } from '../utils/formatDate'
import { ItemImage } from '../components/ItemImage'

type SortKey = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'

export default function CollectionItemsPage() {
  const { collectionId } = useParams<{ collectionId: string }>()
  const navigate = useNavigate()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date-desc')

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
      case 'date-desc':
        return arr.sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''))
      case 'date-asc':
        return arr.sort((a, b) => (a.releaseDate ?? '').localeCompare(b.releaseDate ?? ''))
      case 'name-asc':
        return arr.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
      case 'name-desc':
        return arr.sort((a, b) => b.name.localeCompare(a.name, 'fr', { sensitivity: 'base' }))
    }
  }, [items, sortKey])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
        <div style={{ color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          Chargement...
        </div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
        <div style={{ color: colors.danger, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          {error || 'Collection introuvable.'}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
      <button
        onClick={() => navigate('/')}
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
        <ArrowLeft size={14} /> RETOUR AUX COLLECTIONS
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h1
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 26,
            margin: 0,
          }}
        >
          {collection.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.textMuted }}>
            {items.length} ITEM{items.length > 1 ? 'S' : ''}
          </span>
          <button
            onClick={() => navigate(`/collections/${collectionId}/items/new`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: colors.accent,
              color: colors.bg,
              border: 'none',
              padding: '9px 16px',
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            AJOUTER
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: colors.textMuted,
              letterSpacing: '0.06em',
            }}
          >
            TRIER PAR
          </span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{
              background: colors.surfaceAlt,
              border: `1px solid ${colors.borderStrong}`,
              color: colors.text,
              padding: '8px 10px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="date-desc">Date de sortie (plus récents)</option>
            <option value="date-asc">Date de sortie (moins récents)</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
          </select>
        </div>
      )}

      {items.length === 0 ? (
        <div
          style={{
            border: `1px dashed ${colors.borderStrong}`,
            padding: '60px 20px',
            textAlign: 'center',
            color: colors.textMuted,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          }}
        >
          Aucun item référencé pour le moment.
          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => navigate(`/collections/${collectionId}/items/new`)}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.accent}`,
                color: colors.accent,
                padding: '8px 16px',
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.05em',
                cursor: 'pointer',
              }}
            >
              AJOUTER UN ITEM
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 16,
          }}
        >
          {sortedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/collections/${collectionId}/items/${item.id}`)}
              className="rgx-card"
              style={{
                textAlign: 'left',
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                color: 'inherit',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <ItemImage
                name={item.name}
                image={item.image}
                style={{ width: '100%', height: 140, borderBottom: `1px solid ${colors.border}` }}
              />
              <div style={{ padding: '14px 16px 16px' }}>
                <div
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 6,
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11.5,
                    color: colors.textMuted,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{formatDateOnly(item.releaseDate)}</span>
                  <span style={{ color: colors.accent }}>
                    {item.attributes.length} ATTR{' '}
                    <ChevronRight size={12} style={{ display: 'inline', verticalAlign: -2 }} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .rgx-card { transition: border-color 0.15s ease; }
        .rgx-card:hover { border-color: ${colors.accent}; }
      `}</style>
    </div>
  )
}

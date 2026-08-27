import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Collection } from 'shared-types'
import { collectionsApi } from '../api/collections'
import { colors } from '../theme'
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
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '0.06em',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              background: colors.accent,
              clipPath: 'polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)',
              marginRight: 10,
              verticalAlign: -1,
            }}
          />
          RGX <span style={{ color: colors.accent }}>// INVENTORY</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.textMuted }}>
            {collections.length} COLLECTION{collections.length > 1 ? 'S' : ''}
          </span>
          <button
            onClick={() => setFormTarget('new')}
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
            CRÉER UNE COLLECTION
          </button>
        </div>
      </div>

      <div style={{ padding: 28 }}>
        {error && (
          <div style={{ color: colors.danger, fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            Chargement...
          </div>
        ) : collections.length === 0 ? (
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
            Aucune collection pour le moment.
            <div style={{ marginTop: 14 }}>
              <button
                onClick={() => setFormTarget('new')}
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
                CRÉER UNE COLLECTION
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
            {collections.map((collection) => (
              <div
                key={collection.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/collections/${collection.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/collections/${collection.id}`)
                }}
                className="rgx-card"
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 140,
                    borderBottom: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'repeating-linear-gradient(135deg, #12160F 0px, #12160F 10px, #161C13 10px, #161C13 20px)',
                    color: '#3A4A35',
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: '2.5rem',
                  }}
                >
                  {collection.name.trim().charAt(0).toUpperCase() || '?'}
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10 }} onClick={(e) => e.stopPropagation()}>
                  <DotMenu onEdit={() => setFormTarget(collection)} onDelete={() => setDeleteTarget(collection)} />
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div
                    style={{
                      fontFamily: "'Chakra Petch', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 6,
                    }}
                  >
                    {collection.name}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: colors.textMuted }}>
                    {formatDate(collection.createdAt)}
                  </div>
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

      <style>{`
        .rgx-card { transition: border-color 0.15s ease; }
        .rgx-card:hover { border-color: ${colors.accent}; }
      `}</style>
    </div>
  )
}

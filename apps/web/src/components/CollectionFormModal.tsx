import { useState } from 'react'
import type { Collection } from 'shared-types'
import { colors } from '../theme'
import { Modal } from './Modal'

export function CollectionFormModal({
  initial,
  onCancel,
  onSave,
}: {
  initial: Collection | null
  onCancel: () => void
  onSave: (name: string) => void
}) {
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name ?? '')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Le nom de la collection est obligatoire.')
      return
    }
    onSave(name.trim())
  }

  return (
    <Modal onClose={onCancel}>
      <div
        style={{
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: colors.text,
          marginBottom: 18,
        }}
      >
        {isEdit ? 'MODIFIER LA COLLECTION' : 'CRÉER UNE COLLECTION'}
      </div>

      <label
        style={{
          display: 'block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: colors.accent,
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}
      >
        NOM *
      </label>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Souris"
        style={{
          width: '100%',
          background: colors.surfaceAlt,
          border: `1px solid ${colors.borderStrong}`,
          color: colors.text,
          padding: '10px 12px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 13.5,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {error && (
        <div style={{ color: colors.danger, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginTop: 10 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button
          onClick={handleSubmit}
          style={{
            background: colors.accent,
            border: 'none',
            color: colors.bg,
            padding: '10px 18px',
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          {isEdit ? 'ENREGISTRER' : 'CRÉER'}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: `1px solid ${colors.borderStrong}`,
            color: colors.text,
            padding: '10px 16px',
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          ANNULER
        </button>
      </div>
    </Modal>
  )
}

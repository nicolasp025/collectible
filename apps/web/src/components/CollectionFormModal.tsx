import { useState } from 'react'
import type { Collection } from 'shared-types'
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
      <div className="mb-[18px] font-heading text-[18px] font-bold text-rgx-text">
        {isEdit ? 'MODIFIER LA COLLECTION' : 'CRÉER UNE COLLECTION'}
      </div>

      <label className="mb-1.5 block font-mono text-[11px] tracking-[0.06em] text-rgx-accent">NOM *</label>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Souris"
        className="w-full border border-rgx-border-strong bg-rgx-surface-alt px-3 py-2.5 text-[13.5px] text-rgx-text outline-none focus:border-rgx-accent"
      />

      {error && <div className="mt-2.5 font-mono text-[12px] text-rgx-danger">{error}</div>}

      <div className="mt-5 flex gap-2.5">
        <button
          onClick={handleSubmit}
          className="flex-1 cursor-pointer border-none bg-rgx-accent px-[18px] py-2.5 font-heading text-[13px] font-bold tracking-[0.04em] text-rgx-bg"
        >
          {isEdit ? 'ENREGISTRER' : 'CRÉER'}
        </button>
        <button
          onClick={onCancel}
          className="cursor-pointer border border-rgx-border-strong bg-transparent px-4 py-2.5 font-heading text-[13px] font-semibold text-rgx-text"
        >
          ANNULER
        </button>
      </div>
    </Modal>
  )
}

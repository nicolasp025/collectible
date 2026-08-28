import { useState } from 'react'
import { ImageOff, Upload } from 'lucide-react'
import type { Collection } from 'shared-types'
import { Modal } from './Modal'
import { ItemImage } from './ItemImage'

const MAX_IMAGE_SIZE = 4 * 1024 * 1024

export function CollectionFormModal({
  initial,
  onCancel,
  onSave,
}: {
  initial: Collection | null
  onCancel: () => void
  onSave: (name: string, image?: string | null) => void
}) {
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name ?? '')
  const [image, setImage] = useState<string | null>(initial?.thumbnail ?? null)
  const [imageChanged, setImageChanged] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_IMAGE_SIZE) {
      setError("L'image dépasse 4 Mo, choisis un fichier plus léger.")
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
      setImageChanged(true)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImageChanged(true)
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Le nom de la collection est obligatoire.')
      return
    }
    onSave(name.trim(), imageChanged ? image : undefined)
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

      <label className="mt-[18px] mb-1.5 block font-mono text-[11px] tracking-[0.06em] text-rgx-accent">IMAGE</label>
      <div className="flex items-start gap-3.5">
        <ItemImage name={name} image={image} className="h-[70px] w-[100px] shrink-0" />
        <div className="flex-1">
          <label
            htmlFor="rgx-collection-file-input"
            className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-rgx-border-strong px-3 py-2.5 font-mono text-[12px] text-rgx-accent"
          >
            <Upload size={14} />
            {image ? "CHANGER L'IMAGE" : 'CHOISIR UNE IMAGE'}
          </label>
          <input
            id="rgx-collection-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {image ? (
            <button
              type="button"
              onClick={removeImage}
              className="mt-2 cursor-pointer border-none bg-none p-0 font-mono text-[11px] text-rgx-muted-2"
            >
              RETIRER L'IMAGE
            </button>
          ) : (
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[11.5px] text-rgx-muted">
              <ImageOff size={13} /> UN PLACEHOLDER SERA UTILISÉ
            </div>
          )}
        </div>
      </div>

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

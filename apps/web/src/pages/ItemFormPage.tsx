import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImageOff, Upload, X } from 'lucide-react'
import type { ItemStatus } from 'shared-types'
import { itemsApi } from '../api/items'
import { ItemImage } from '../components/ItemImage'
import { ITEM_STATUSES, ITEM_STATUS_CONFIG } from '../utils/itemStatus'

const MAX_IMAGE_SIZE = 4 * 1024 * 1024

const fieldClass =
  'w-full border border-rgx-border-strong bg-rgx-surface-alt px-3 py-2.5 text-[13.5px] text-rgx-text outline-none focus:border-rgx-accent'
const labelClass = 'mb-1.5 block font-mono text-[11px] tracking-[0.06em] text-rgx-accent'

export default function ItemFormPage() {
  const { collectionId, itemId } = useParams<{ collectionId: string; itemId: string }>()
  const navigate = useNavigate()
  const isEdit = !!itemId

  const [loading, setLoading] = useState(isEdit)
  const [name, setName] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [status, setStatus] = useState<ItemStatus>('owned')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !collectionId || !itemId) return
    itemsApi
      .get(collectionId, itemId)
      .then((item) => {
        setName(item.name)
        setReleaseYear(item.releaseYear !== null ? String(item.releaseYear) : '')
        setImages(item.images)
        setStatus(item.status)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isEdit, collectionId, itemId])

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return

    const validFiles = files.filter((f) => f.size <= MAX_IMAGE_SIZE)
    setError(
      validFiles.length < files.length
        ? "Une ou plusieurs images dépassent 4 Mo et ont été ignorées."
        : '',
    )

    Promise.all(validFiles.map(readFileAsDataUrl)).then((dataUrls) =>
      setImages((prev) => [...prev, ...dataUrls]),
    )
  }

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index))

  const goBack = () => {
    if (isEdit) navigate(`/collections/${collectionId}/items/${itemId}`)
    else navigate(`/collections/${collectionId}`)
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Le nom de l'objet est obligatoire.")
      return
    }
    if (!collectionId) return

    const payload = {
      name: name.trim(),
      releaseYear: releaseYear ? Number(releaseYear) : null,
      images,
      status,
    }

    const promise = isEdit
      ? itemsApi.update(collectionId, itemId!, payload)
      : itemsApi.create(collectionId, payload)

    promise
      .then((item) => navigate(`/collections/${collectionId}/items/${item.id}`))
      .catch((e) => setError(e.message))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-rgx-bg p-4 text-rgx-text sm:p-7">
        <div className="font-mono text-[13px] text-rgx-muted">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rgx-bg p-4 text-rgx-text sm:p-7">
      <div className="mx-auto max-w-[640px]">
        <button
          onClick={goBack}
          className="mb-4 flex cursor-pointer items-center gap-1.5 border-none bg-none p-0 font-mono text-[12px] text-rgx-muted-2 sm:mb-[22px]"
        >
          <ArrowLeft size={14} /> ANNULER
        </button>

        <h1 className="m-0 mb-6 font-heading text-[20px] font-bold sm:text-[24px]">
          {isEdit ? "MODIFIER L'OBJET" : 'AJOUTER UN OBJET'}
        </h1>

        <div className="flex flex-col gap-[18px]">
          <div>
            <label className={labelClass}>NOM *</label>
            <input
              className={fieldClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: DeathAdder V3 Pro"
            />
          </div>

          <div>
            <label className={labelClass}>ANNÉE DE SORTIE</label>
            <input
              type="number"
              inputMode="numeric"
              min={1000}
              max={new Date().getFullYear() + 5}
              step={1}
              className={fieldClass}
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="Ex: 2023"
            />
          </div>

          <div>
            <label className={labelClass}>STATUT</label>
            <select
              className={`${fieldClass} cursor-pointer`}
              value={status}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
            >
              {ITEM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ITEM_STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>IMAGES</label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <ItemImage name={name} image={img} className="h-[90px] w-[120px]" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Retirer cette image"
                    className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-rgx-bg/80 text-rgx-text"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label
                htmlFor="rgx-file-input"
                className="flex h-[90px] w-[120px] cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-rgx-border-strong font-mono text-[11px] text-rgx-accent"
              >
                <Upload size={16} />
                AJOUTER
              </label>
              <input
                id="rgx-file-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {images.length === 0 && (
              <div className="mt-2 flex items-center gap-1.5 font-mono text-[11.5px] text-rgx-muted">
                <ImageOff size={13} /> UN PLACEHOLDER SERA UTILISÉ
              </div>
            )}
          </div>

          {error && <div className="font-mono text-[12px] text-rgx-danger">{error}</div>}

          <div className="mt-2 flex gap-2.5">
            <button
              onClick={handleSubmit}
              className="flex-1 cursor-pointer border-none bg-rgx-accent px-5 py-2.5 font-heading text-[13px] font-bold tracking-[0.04em] text-rgx-bg"
            >
              {isEdit ? 'ENREGISTRER LES MODIFICATIONS' : "AJOUTER L'OBJET"}
            </button>
            <button
              onClick={goBack}
              className="cursor-pointer border border-rgx-border-strong bg-transparent px-4.5 py-2.5 font-heading text-[13px] font-semibold text-rgx-text"
            >
              ANNULER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImageOff, Upload, X } from 'lucide-react'
import { itemsApi } from '../api/items'
import { ItemImage } from '../components/ItemImage'

const MAX_IMAGE_SIZE = 4 * 1024 * 1024

let rowIdCounter = 0
function nextRowId() {
  rowIdCounter += 1
  return `row-${rowIdCounter}`
}

type AttributeRow = { rowId: string; key: string; value: string }

const fieldClass =
  'w-full border border-rgx-border-strong bg-rgx-surface-alt px-3 py-2.5 text-[13.5px] text-rgx-text outline-none focus:border-rgx-accent'
const labelClass = 'mb-1.5 block font-mono text-[11px] tracking-[0.06em] text-rgx-accent'

export default function ItemFormPage() {
  const { collectionId, itemId } = useParams<{ collectionId: string; itemId: string }>()
  const navigate = useNavigate()
  const isEdit = !!itemId

  const [loading, setLoading] = useState(isEdit)
  const [name, setName] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [attributes, setAttributes] = useState<AttributeRow[]>([{ rowId: nextRowId(), key: '', value: '' }])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !collectionId || !itemId) return
    itemsApi
      .get(collectionId, itemId)
      .then((item) => {
        setName(item.name)
        setReleaseDate(item.releaseDate ?? '')
        setImage(item.image)
        setAttributes(
          item.attributes.length
            ? item.attributes.map((a) => ({ rowId: nextRowId(), key: a.key, value: a.value }))
            : [{ rowId: nextRowId(), key: '', value: '' }],
        )
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isEdit, collectionId, itemId])

  const updateAttr = (rowId: string, field: 'key' | 'value', val: string) => {
    setAttributes((prev) => prev.map((a) => (a.rowId === rowId ? { ...a, [field]: val } : a)))
  }
  const removeAttr = (rowId: string) => setAttributes((prev) => prev.filter((a) => a.rowId !== rowId))
  const addAttr = () => setAttributes((prev) => [...prev, { rowId: nextRowId(), key: '', value: '' }])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_IMAGE_SIZE) {
      setError("L'image dépasse 4 Mo, choisis un fichier plus léger.")
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const goBack = () => {
    if (isEdit) navigate(`/collections/${collectionId}/items/${itemId}`)
    else navigate(`/collections/${collectionId}`)
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Le nom de l'item est obligatoire.")
      return
    }
    if (!collectionId) return

    const cleanAttributes = attributes
      .map((a) => ({ key: a.key.trim(), value: a.value.trim() }))
      .filter((a) => a.key)

    const payload = {
      name: name.trim(),
      releaseDate: releaseDate || null,
      image,
      attributes: cleanAttributes,
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
      <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
        <div className="font-mono text-[13px] text-rgx-muted">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rgx-bg p-7 text-rgx-text">
      <div className="mx-auto max-w-[640px]">
        <button
          onClick={goBack}
          className="mb-[22px] flex cursor-pointer items-center gap-1.5 border-none bg-none p-0 font-mono text-[12px] text-rgx-muted-2"
        >
          <ArrowLeft size={14} /> ANNULER
        </button>

        <h1 className="m-0 mb-6 font-heading text-[24px] font-bold">
          {isEdit ? "MODIFIER L'ITEM" : 'AJOUTER UN ITEM'}
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
            <label className={labelClass}>DATE DE SORTIE</label>
            <input
              type="date"
              className={fieldClass}
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>IMAGE</label>
            <div className="flex items-start gap-3.5">
              <ItemImage name={name} image={image} className="h-[90px] w-[120px] shrink-0" />
              <div className="flex-1">
                <label
                  htmlFor="rgx-file-input"
                  className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-rgx-border-strong px-3 py-2.5 font-mono text-[12px] text-rgx-accent"
                >
                  <Upload size={14} />
                  {image ? "CHANGER L'IMAGE" : 'CHOISIR UNE IMAGE'}
                </label>
                <input
                  id="rgx-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {image ? (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
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
          </div>

          <div>
            <label className={labelClass}>ATTRIBUTS</label>
            <div className="flex flex-col gap-2">
              {attributes.map((attr) => (
                <div key={attr.rowId} className="flex gap-2">
                  <input
                    className={`${fieldClass} w-[38%]`}
                    value={attr.key}
                    onChange={(e) => updateAttr(attr.rowId, 'key', e.target.value)}
                    placeholder="Clé (ex: Capteur)"
                  />
                  <input
                    className={fieldClass}
                    value={attr.value}
                    onChange={(e) => updateAttr(attr.rowId, 'value', e.target.value)}
                    placeholder="Valeur (ex: Focus Pro 30K)"
                  />
                  <button
                    onClick={() => removeAttr(attr.rowId)}
                    aria-label="Supprimer l'attribut"
                    className="w-[38px] shrink-0 cursor-pointer border border-rgx-border-strong bg-transparent text-rgx-muted-2"
                  >
                    <X size={14} className="mx-auto" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addAttr}
              className="mt-2.5 w-full cursor-pointer border border-dashed border-rgx-border-strong bg-transparent px-3 py-2 font-mono text-[12px] text-rgx-accent"
            >
              + AJOUTER UN ATTRIBUT
            </button>
          </div>

          {error && <div className="font-mono text-[12px] text-rgx-danger">{error}</div>}

          <div className="mt-2 flex gap-2.5">
            <button
              onClick={handleSubmit}
              className="flex-1 cursor-pointer border-none bg-rgx-accent px-5 py-2.5 font-heading text-[13px] font-bold tracking-[0.04em] text-rgx-bg"
            >
              {isEdit ? 'ENREGISTRER LES MODIFICATIONS' : "AJOUTER L'ITEM"}
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

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImageOff, Upload, X } from 'lucide-react'
import { itemsApi } from '../api/items'
import { colors } from '../theme'
import { ItemImage } from '../components/ItemImage'

const MAX_IMAGE_SIZE = 4 * 1024 * 1024

let rowIdCounter = 0
function nextRowId() {
  rowIdCounter += 1
  return `row-${rowIdCounter}`
}

type AttributeRow = { rowId: string; key: string; value: string }

function fieldStyle() {
  return {
    width: '100%',
    background: colors.surfaceAlt,
    border: `1px solid ${colors.borderStrong}`,
    color: colors.text,
    padding: '10px 12px',
    fontFamily: "'Inter', sans-serif",
    fontSize: 13.5,
    outline: 'none',
    boxSizing: 'border-box' as const,
  }
}

function labelStyle() {
  return {
    display: 'block',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: colors.accent,
    letterSpacing: '0.06em',
    marginBottom: 6,
  }
}

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
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
        <div style={{ color: colors.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          Chargement...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: 28 }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button
          onClick={goBack}
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
          <ArrowLeft size={14} /> ANNULER
        </button>

        <h1
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            margin: '0 0 24px',
          }}
        >
          {isEdit ? "MODIFIER L'ITEM" : 'AJOUTER UN ITEM'}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle()}>NOM *</label>
            <input
              style={fieldStyle()}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: DeathAdder V3 Pro"
            />
          </div>

          <div>
            <label style={labelStyle()}>DATE DE SORTIE</label>
            <input
              type="date"
              style={fieldStyle()}
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle()}>IMAGE</label>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <ItemImage name={name} image={image} style={{ width: 120, height: 90, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="rgx-file-input"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    justifyContent: 'center',
                    border: `1px dashed ${colors.borderStrong}`,
                    color: colors.accent,
                    padding: '10px 12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} />
                  {image ? "CHANGER L'IMAGE" : 'CHOISIR UNE IMAGE'}
                </label>
                <input
                  id="rgx-file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {image ? (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    style={{
                      marginTop: 8,
                      background: 'none',
                      border: 'none',
                      color: colors.textMuted2,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    RETIRER L'IMAGE
                  </button>
                ) : (
                  <div
                    style={{
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: colors.textMuted,
                      fontSize: 11.5,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <ImageOff size={13} /> UN PLACEHOLDER SERA UTILISÉ
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle()}>ATTRIBUTS</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {attributes.map((attr) => (
                <div key={attr.rowId} style={{ display: 'flex', gap: 8 }}>
                  <input
                    style={{ ...fieldStyle(), width: '38%' }}
                    value={attr.key}
                    onChange={(e) => updateAttr(attr.rowId, 'key', e.target.value)}
                    placeholder="Clé (ex: Capteur)"
                  />
                  <input
                    style={fieldStyle()}
                    value={attr.value}
                    onChange={(e) => updateAttr(attr.rowId, 'value', e.target.value)}
                    placeholder="Valeur (ex: Focus Pro 30K)"
                  />
                  <button
                    onClick={() => removeAttr(attr.rowId)}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${colors.borderStrong}`,
                      color: colors.textMuted2,
                      cursor: 'pointer',
                      width: 38,
                      flexShrink: 0,
                    }}
                    aria-label="Supprimer l'attribut"
                  >
                    <X size={14} style={{ margin: '0 auto' }} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addAttr}
              style={{
                marginTop: 10,
                background: 'transparent',
                border: `1px dashed ${colors.borderStrong}`,
                color: colors.accent,
                padding: '8px 12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              + AJOUTER UN ATTRIBUT
            </button>
          </div>

          {error && (
            <div style={{ color: colors.danger, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              onClick={handleSubmit}
              style={{
                background: colors.accent,
                border: 'none',
                color: colors.bg,
                padding: '11px 20px',
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {isEdit ? 'ENREGISTRER LES MODIFICATIONS' : "AJOUTER L'ITEM"}
            </button>
            <button
              onClick={goBack}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.borderStrong}`,
                color: colors.text,
                padding: '11px 18px',
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              ANNULER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

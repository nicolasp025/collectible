export function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// For date-only strings (YYYY-MM-DD, e.g. Item.releaseDate) — appending a local
// midnight time avoids the UTC-parsing day shift `new Date(iso)` would cause.
export function formatDateOnly(date: string | null | undefined) {
  if (!date) return '—'
  return formatDate(`${date}T00:00:00`)
}

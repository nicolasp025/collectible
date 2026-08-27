import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { colors } from '../theme'

export function DotMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-label="Actions"
        style={{
          background: 'rgba(10,13,8,0.7)',
          border: `1px solid ${colors.border}`,
          color: colors.textMuted2,
          width: 30,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 34,
            right: 0,
            background: colors.surface,
            border: `1px solid ${colors.borderStrong}`,
            minWidth: 140,
            zIndex: 10,
          }}
        >
          <button
            onClick={() => {
              setOpen(false)
              onEdit()
            }}
            style={menuItemStyle(colors.accent)}
          >
            MODIFIER
          </button>
          <button
            onClick={() => {
              setOpen(false)
              onDelete()
            }}
            style={menuItemStyle(colors.danger)}
          >
            SUPPRIMER
          </button>
        </div>
      )}
    </div>
  )
}

function menuItemStyle(color: string) {
  return {
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    background: 'transparent',
    border: 'none',
    color,
    padding: '10px 12px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11.5,
    letterSpacing: '0.05em',
    cursor: 'pointer',
  }
}

import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'

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
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-label="Actions"
        className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center border border-rgx-border bg-[rgba(10,13,8,0.7)] text-rgx-muted-2"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[34px] right-0 z-10 min-w-[140px] border border-rgx-border-strong bg-rgx-surface"
        >
          <button
            onClick={() => {
              setOpen(false)
              onEdit()
            }}
            className="block w-full cursor-pointer border-none bg-transparent px-3 py-2.5 text-left font-mono text-[11.5px] tracking-[0.05em] text-rgx-accent"
          >
            MODIFIER
          </button>
          <button
            onClick={() => {
              setOpen(false)
              onDelete()
            }}
            className="block w-full cursor-pointer border-none bg-transparent px-3 py-2.5 text-left font-mono text-[11.5px] tracking-[0.05em] text-rgx-danger"
          >
            SUPPRIMER
          </button>
        </div>
      )}
    </div>
  )
}

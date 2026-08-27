import type { ReactNode } from 'react'

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,7,4,0.7)]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[380px] max-w-[90vw] border border-rgx-border-strong bg-rgx-surface p-6"
      >
        {children}
      </div>
    </div>
  )
}

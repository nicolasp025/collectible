import type { ReactNode } from 'react'
import { colors } from '../theme'

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,7,4,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface,
          border: `1px solid ${colors.borderStrong}`,
          padding: 24,
          width: 380,
          maxWidth: '90vw',
        }}
      >
        {children}
      </div>
    </div>
  )
}

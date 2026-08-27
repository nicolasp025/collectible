import { colors } from '../theme'
import { Modal } from './Modal'

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'SUPPRIMER',
  onConfirm,
  onCancel,
}: {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal onClose={onCancel}>
      <div
        style={{
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 600,
          fontSize: 17,
          color: colors.text,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: colors.textMuted2, marginBottom: 22 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: `1px solid ${colors.borderStrong}`,
            color: colors.text,
            padding: '8px 16px',
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 600,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          ANNULER
        </button>
        <button
          onClick={onConfirm}
          style={{
            background: colors.danger,
            border: 'none',
            color: '#1A0808',
            padding: '8px 16px',
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 600,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

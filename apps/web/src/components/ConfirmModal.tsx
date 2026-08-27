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
      <div className="mb-2.5 font-heading text-[17px] font-semibold text-rgx-text">{title}</div>
      <p className="mb-[22px] text-[13.5px] text-rgx-muted-2">{message}</p>
      <div className="flex justify-end gap-2.5">
        <button
          onClick={onCancel}
          className="cursor-pointer border border-rgx-border-strong bg-transparent px-4 py-2 font-heading text-[12.5px] font-semibold text-rgx-text"
        >
          ANNULER
        </button>
        <button
          onClick={onConfirm}
          className="cursor-pointer border-none bg-rgx-danger px-4 py-2 font-heading text-[12.5px] font-semibold text-[#1A0808]"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

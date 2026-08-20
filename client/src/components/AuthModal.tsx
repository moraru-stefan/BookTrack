import { useEffect, type ReactNode } from 'react'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function AuthModal({ open, onClose, children }: AuthModalProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-[modal-backdrop-in_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm animate-[modal-content-in_180ms_ease-out] rounded-2xl bg-white p-8 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute top-4 right-4 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-5 w-5"
          >
            <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

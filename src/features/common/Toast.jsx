import React, { useState } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const show = (message, type = 'success', duration = 3000) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration)
  }

  return { toasts, show }
}

export const Toast = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className="animate-fade-up px-5 py-3 rounded-2xl text-sm font-semibold pointer-events-auto"
        style={{
          background:  t.type === 'success' ? '#00e5a015' : '#ff4d6a15',
          border:     `1px solid ${t.type === 'success' ? '#00e5a050' : '#ff4d6a50'}`,
          color:       t.type === 'success' ? '#00e5a0'   : '#ff4d6a',
          boxShadow:  `0 8px 24px ${t.type === 'success' ? '#00e5a010' : '#ff4d6a10'}`,
        }}
      >
        {t.type === 'success' ? '✓' : '✕'} {t.message}
      </div>
    ))}
  </div>
)

import React, { useState } from 'react'
import { hashText } from '../bookmarks/utils/crypto'

export const ChangeMasterPassword = ({ onConfirm, onCancel, onToast }) => {
  const [current,   setCurrent]   = useState('')
  const [newPwd,    setNewPwd]    = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
  const inputStyle = { background: 'var(--bg)', border: '1px solid var(--border)' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!current || !newPwd || !confirm) { setError('All fields required'); return }
    if (newPwd !== confirm)              { setError('New passwords do not match'); return }
    if (newPwd.length < 6)              { setError('Password must be at least 6 characters'); return }

    setIsLoading(true)
    try {
      const stored = localStorage.getItem('vault-master')
      const currentHash = await hashText(current)
      const isValid = stored?.startsWith('sha256:') ? currentHash === stored : current === stored

      if (!isValid) { setError('Current password is incorrect'); return }

      localStorage.setItem('vault-master', await hashText(newPwd))
      onToast?.('Master password changed successfully', 'success')
      onConfirm?.()
    } catch {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="animate-scale-in rounded-3xl p-6 sm:p-8 w-full max-w-md"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="text-xl font-bold mb-1">Change Master Password</h2>
        <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
          Your vault will remain encrypted — only the unlock key changes.
        </p>

        <div className="space-y-3 mb-6">
          <input type="password" value={current} onChange={(e) => { setCurrent(e.target.value); setError('') }}
            placeholder="Current password" className={inputCls} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
            onBlur={(e)  => e.target.style.borderColor = 'var(--border)'} />
          <input type="password" value={newPwd} onChange={(e) => { setNewPwd(e.target.value); setError('') }}
            placeholder="New password" className={inputCls} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
            onBlur={(e)  => e.target.style.borderColor = 'var(--border)'} />
          <input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError('') }}
            placeholder="Confirm new password" className={inputCls} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
            onBlur={(e)  => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {error && (
          <p className="text-xs mb-4 px-3 py-2 rounded-xl"
            style={{ color: '#ff4d6a', background: '#ff4d6a15', border: '1px solid #ff4d6a30' }}>
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'var(--teal)', color: '#07080f', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Saving...' : 'Change'}
          </button>
        </div>
      </form>
    </div>
  )
}

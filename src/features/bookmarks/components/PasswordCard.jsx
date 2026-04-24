import React, { useEffect, useState } from 'react'
import { getCardInitials, getCardTitle, getPasswordMask } from '../utils/bookmarkDisplay'

const getFaviconUrl = (website) => {
  if (!website) return null
  try {
    const { hostname } = new URL(website)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } catch { return null }
}

const categoryColors = {
  Social: '#4d9fff', Video: '#ff6b6b', Design: '#c084fc', Streaming: '#f97316',
  Productivity: '#00e5a0', Entertainment: '#f43f5e', Shopping: '#fbbf24', Music: '#a78bfa',
}

const PasswordCard = ({
  bookmarks, hasBookmarks, searchTerm,
  onDelete, onEdit, onRevealPassword, onRevealNotes, onToast,
}) => {
  const [revealedIds,       setRevealedIds]       = useState([])
  const [revealedPasswords, setRevealedPasswords] = useState({})
  const [revealedNotes,     setRevealedNotes]     = useState({})
  const [loadingIds,        setLoadingIds]        = useState([])
  const [decryptErrors,     setDecryptErrors]     = useState({})
  const [copiedId,          setCopiedId]          = useState(null)
  const [editingItem,       setEditingItem]       = useState(null)
  const [editForm,          setEditForm]          = useState({})
  const [faviconErrors,     setFaviconErrors]     = useState({})
  const [pinnedIds,         setPinnedIds]         = useState(() => {
    try { return JSON.parse(localStorage.getItem('vault-pinned') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('vault-pinned', JSON.stringify(pinnedIds))
  }, [pinnedIds])

  const togglePin = (id) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [id, ...prev]
    )
  }

  const handleCopy = async (text, key, label = 'Copied') => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(key)
      onToast?.(`${label} to clipboard`, 'success')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      onToast?.('Failed to copy', 'error')
      setCopiedId(null)
    }
  }

  const loadPassword = async (item) => {
    if (revealedPasswords[item.id]) return revealedPasswords[item.id]
    setLoadingIds((prev) => [...prev, item.id])
    try {
      const pwd = await onRevealPassword(item.password)
      setRevealedPasswords((prev) => ({ ...prev, [item.id]: pwd }))
      return pwd
    } catch {
      setDecryptErrors((prev) => ({ ...prev, [item.id]: 'Unable to decrypt.' }))
      return null
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== item.id))
    }
  }

  const toggleReveal = async (item) => {
    if (revealedIds.includes(item.id)) {
      setRevealedIds((prev) => prev.filter((id) => id !== item.id))
      return
    }
    const pwd = await loadPassword(item)
    if (pwd) setRevealedIds((prev) => [...prev, item.id])
  }

  const handlePasswordCopy = async (item) => {
    const pwd = await loadPassword(item)
    if (pwd) await handleCopy(pwd, `p-${item.id}`)
  }

  const toggleNotes = async (item) => {
    if (revealedNotes[item.id] !== undefined) {
      setRevealedNotes((prev) => {
        const next = { ...prev }
        delete next[item.id]
        return next
      })
      return
    }
    const decrypted = await onRevealNotes(item.notes)
    setRevealedNotes((prev) => ({ ...prev, [item.id]: decrypted }))
  }

  const startEdit = async (item) => {
    const pwd = await loadPassword(item)
    if (pwd === null) return
    const decryptedNotes = item.notes ? await onRevealNotes(item.notes) : ''
    setEditingItem(item.id)
    setEditForm({
      name:     item.name     || '',
      username: item.username || '',
      password: pwd,
      website:  item.website  || '',
      category: item.category || '',
      color:    item.color    || '#00e5a0',
      notes:    decryptedNotes,
    })
  }

  const cancelEdit = () => { setEditingItem(null); setEditForm({}) }

  const saveEdit = async () => {
    if (!editingItem) return
    await onEdit(editingItem, editForm)
    setRevealedPasswords((prev) => ({ ...prev, [editingItem]: editForm.password }))
    setEditingItem(null)
    setEditForm({})
  }

  if (!hasBookmarks) return (
    <div className="rounded-3xl p-16 text-center animate-fade-up"
      style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
      <div className="text-5xl mb-4">🔐</div>
      <p className="text-lg font-semibold mb-2">No credentials saved yet</p>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>Add your first entry using the form above.</p>
    </div>
  )

  if (searchTerm.trim() && bookmarks.length === 0) return (
    <div className="rounded-3xl p-16 text-center animate-fade-up"
      style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
      <p className="text-2xl font-bold mb-2">No Results</p>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Nothing matched "<span style={{ color: 'var(--teal)' }}>{searchTerm.trim()}</span>"
      </p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[...bookmarks.filter((b) => pinnedIds.includes(b.id)),
        ...bookmarks.filter((b) => !pinnedIds.includes(b.id))
      ].map((item, idx) => {
        const isRevealed = revealedIds.includes(item.id)
        const isLoading  = loadingIds.includes(item.id)
        const isEditing  = editingItem === item.id
        const isPinned   = pinnedIds.includes(item.id)
        const favicon    = getFaviconUrl(item.website)
        const catColor   = categoryColors[item.category] || 'var(--teal)'
        const preview    = isEditing ? { ...item, ...editForm } : item

        return (
          <article
            key={item.id}
            className="animate-card-in group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              animationDelay: `${idx * 60}ms`,
              background: 'linear-gradient(145deg, #0e0f1a, #0a0b14)',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 24px #00000040',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${catColor}50`
              e.currentTarget.style.boxShadow = `0 8px 40px ${catColor}15`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = '0 4px 24px #00000040'
            }}
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                {/* Favicon / initials */}
                <div
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden flex-shrink-0"
                  style={{ background: `${preview.color || catColor}20`, border: `1px solid ${preview.color || catColor}40` }}
                >
                  {favicon && !faviconErrors[item.id] ? (
                    <img src={favicon} alt="" className="h-6 w-6 object-contain"
                      onError={() => setFaviconErrors((prev) => ({ ...prev, [item.id]: true }))} />
                  ) : (
                    <span className="text-xs font-bold" style={{ color: preview.color || catColor }}>
                      {getCardInitials(preview)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-tight">{getCardTitle(preview)}</h3>
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full"
                    style={{ background: `${catColor}15`, color: catColor }}
                  >
                    {preview.category || 'Uncategorized'}
                  </span>
                </div>
              </div>

              {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => togglePin(item.id)}
                    className="px-2 py-1.5 rounded-xl text-sm transition-all"
                    style={{ color: isPinned ? 'var(--teal)' : 'var(--muted)' }}
                    title={isPinned ? 'Unpin' : 'Pin to top'}
                  >{isPinned ? '📌' : '📍'}</button>
                  <button
                    onClick={() => startEdit(item)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'var(--surface)', color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                  >Edit</button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: '#ff4d6a15', color: '#ff4d6a' }}
                  >✕</button>
                </div>
              )}
            </div>

            {/* URL */}
            {preview.website && (
              <a href={preview.website} target="_blank" rel="noopener noreferrer"
                className="block text-xs mb-4 truncate transition-colors hover:underline"
                style={{ color: 'var(--muted)' }}
                onClick={(e) => e.stopPropagation()}>
                🔗 {preview.website.replace(/^https?:\/\//, '')}
              </a>
            )}

            {/* Fields */}
            <div className="space-y-2">
              {/* Username */}
              <div className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] mb-0.5" style={{ color: 'var(--muted)' }}>Username</p>
                  <p className="text-sm font-medium truncate max-w-[160px]">{preview.username || '—'}</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleCopy(item.username, `u-${item.id}`)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      background: copiedId === `u-${item.id}` ? '#00e5a015' : 'transparent',
                      color: copiedId === `u-${item.id}` ? 'var(--teal)' : 'var(--muted)',
                    }}
                  >{copiedId === `u-${item.id}` ? '✓' : 'Copy'}</button>
                )}
              </div>

              {/* Password */}
              <div className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-[0.2em] mb-0.5" style={{ color: 'var(--muted)' }}>Password</p>
                  <p className="text-sm font-mono truncate" style={{ letterSpacing: isRevealed ? 'normal' : '0.15em' }}>
                    {isEditing
                      ? getPasswordMask(editForm.password?.length)
                      : isRevealed
                        ? revealedPasswords[item.id]
                        : getPasswordMask(item.passwordLength)}
                  </p>
                  {!isEditing && decryptErrors[item.id] && (
                    <p className="text-[10px] mt-1" style={{ color: '#ff4d6a' }}>{decryptErrors[item.id]}</p>
                  )}
                </div>
                {!isEditing && (
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button onClick={() => toggleReveal(item)} disabled={isLoading}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                      style={{ background: 'transparent', color: isLoading ? 'var(--muted)' : 'var(--teal)' }}>
                      {isLoading ? '...' : isRevealed ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handlePasswordCopy(item)} disabled={isLoading}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                      style={{
                        background: copiedId === `p-${item.id}` ? '#00e5a015' : 'transparent',
                        color: copiedId === `p-${item.id}` ? 'var(--teal)' : 'var(--muted)',
                      }}>
                      {copiedId === `p-${item.id}` ? '✓' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="flex flex-col gap-2 rounded-2xl px-4 py-3"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>Notes</p>
                    {!isEditing && (
                      <button onClick={() => toggleNotes(item)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                        style={{ background: 'transparent', color: 'var(--teal)' }}>
                        {revealedNotes[item.id] !== undefined ? 'Hide' : 'Reveal'}
                      </button>
                    )}
                  </div>
                  {revealedNotes[item.id] !== undefined ? (
                    <p className="text-sm text-neutral-300 whitespace-pre-wrap break-words">
                      {revealedNotes[item.id] || '—'}
                    </p>
                  ) : (
                    <p className="text-sm tracking-widest" style={{ color: 'var(--border-bright)' }}>••••••••</p>
                  )}
                </div>
              )}
            </div>

            {/* Edit form */}
            {isEditing && (
              <div className="mt-4 space-y-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                {['name', 'username', 'password', 'website'].map((field) => (
                  <input key={field}
                    type={field === 'password' ? 'password' : 'text'}
                    value={editForm[field] || ''}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                ))}
                <textarea
                  rows={3}
                  value={editForm.notes || ''}
                  placeholder="Notes"
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full resize-none rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={cancelEdit}
                    className="px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                    Cancel
                  </button>
                  <button onClick={saveEdit}
                    className="px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ background: 'var(--teal)', color: '#07080f' }}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

export default PasswordCard

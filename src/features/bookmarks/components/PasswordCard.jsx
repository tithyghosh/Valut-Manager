import React, { useState } from 'react'
import { getCardInitials, getCardTitle, getPasswordMask } from '../utils/bookmarkDisplay'

const PasswordCard = ({
  bookmarks,
  hasBookmarks,
  searchTerm,
  onDelete,
  onEdit,
  onRevealPassword,
}) => {
  const [revealedIds, setRevealedIds] = useState([])
  const [revealedPasswords, setRevealedPasswords] = useState({})
  const [loadingIds, setLoadingIds] = useState([])
  const [decryptErrors, setDecryptErrors] = useState({})
  const [copiedId, setCopiedId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({})
  const hasSearchTerm = searchTerm.trim().length > 0

  const handleCopy = async (text, key) => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(key)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setCopiedId(null)
    }
  }

  const loadPassword = async (item) => {
    if (revealedPasswords[item.id]) {
      return revealedPasswords[item.id]
    }

    setLoadingIds((prev) => [...prev, item.id])
    setDecryptErrors((prev) => {
      if (!prev[item.id]) return prev

      const nextErrors = { ...prev }
      delete nextErrors[item.id]
      return nextErrors
    })

    try {
      const decryptedPassword = await onRevealPassword(item.password)

      setRevealedPasswords((prev) => ({
        ...prev,
        [item.id]: decryptedPassword,
      }))
      return decryptedPassword
    } catch {
      setDecryptErrors((prev) => ({
        ...prev,
        [item.id]: 'Unable to decrypt this password.',
      }))
      return null
    } finally {
      setLoadingIds((prev) => prev.filter((itemId) => itemId !== item.id))
    }
  }

  const toggleReveal = async (item) => {
    if (revealedIds.includes(item.id)) {
      setRevealedIds((prev) => prev.filter((itemId) => itemId !== item.id))
      return
    }

    const decryptedPassword = await loadPassword(item)

    if (decryptedPassword) {
      setRevealedIds((prev) => [...prev, item.id])
    }
  }

  const handlePasswordCopy = async (item) => {
    const decryptedPassword = await loadPassword(item)

    if (decryptedPassword) {
      await handleCopy(decryptedPassword, `p-${item.id}`)
    }
  }

  const startEdit = async (item) => {
    const decryptedPassword = await loadPassword(item)

    if (decryptedPassword === null) {
      return
    }

    setEditingItem(item.id)
    setEditForm({
      name: item.name || '',
      username: item.username || '',
      password: decryptedPassword,
      website: item.website || '',
      category: item.category || '',
      color: item.color || '#3b82f6',
    })
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingItem) return

    await onEdit(editingItem, editForm)
    setRevealedPasswords((prev) => ({
      ...prev,
      [editingItem]: editForm.password,
    }))
    setEditingItem(null)
    setEditForm({})
  }

  if (!hasBookmarks) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/50 p-10 text-center shadow-2xl shadow-black/20">
        <p className="text-lg font-semibold text-white">No saved credentials yet</p>
        <p className="mt-2 text-sm text-neutral-400">
          Add a website from the form above and it will appear here.
        </p>
      </div>
    )
  }

  if (hasSearchTerm && bookmarks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-800 bg-linear-to-br from-neutral-900/70 to-neutral-800/40 p-10 text-center shadow-2xl shadow-black/30">
        <p className="text-2xl font-semibold tracking-wide text-white">
          Not Found
        </p>
        <p className="mt-3 text-sm text-neutral-400">
          No result found for "
          <span className="font-medium text-blue-400">{searchTerm.trim()}</span>
          "
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Try another name or URL
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {bookmarks.map((item) => {
        const isRevealed = revealedIds.includes(item.id)
        const isLoading = loadingIds.includes(item.id)
        const isEditing = editingItem === item.id
        const previewItem = isEditing
          ? {
              ...item,
              ...editForm,
              passwordLength: editForm.password?.length ?? item.passwordLength,
            }
          : item

        return (
          <article
            key={item.id}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-blue-500/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 text-sm font-semibold uppercase"
                  style={{
                    color: previewItem.color,
                    backgroundColor: `${previewItem.color}1A`,
                  }}
                >
                  {getCardInitials(previewItem)}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {getCardTitle(previewItem)}
                  </h3>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    {previewItem.category || 'Uncategorized'}
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="text-xs font-semibold text-neutral-400 transition hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="text-xs font-semibold text-red-500 transition hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>

            <p className="mt-4 text-sm text-neutral-400">
              {previewItem.website || 'No URL'}
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Username
                </dt>
                <dd className="flex items-center gap-2 text-neutral-50">
                  <span className="max-w-[55%] truncate">{previewItem.username || 'No username'}</span>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.username || 'No username', `u-${item.id}`)}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {copiedId === `u-${item.id}` ? '✓ Copied' : 'Copy'}
                    </button>
                  ) : null}
                </dd>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Password
                </dt>
                <dd className="flex max-w-[65%] flex-col items-end gap-1 text-neutral-50">
                  <div className="flex items-center gap-2">
                    <span>
                      {isEditing
                        ? getPasswordMask(previewItem.passwordLength)
                        : isRevealed
                          ? revealedPasswords[item.id]
                          : getPasswordMask(item.passwordLength)}
                    </span>
                    {!isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleReveal(item)}
                          disabled={isLoading}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:cursor-wait disabled:text-neutral-500"
                        >
                          {isLoading ? 'Decrypting...' : isRevealed ? 'Hide' : 'Reveal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePasswordCopy(item)}
                          disabled={isLoading}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:cursor-wait disabled:text-neutral-500"
                        >
                          {copiedId === `p-${item.id}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </>
                    ) : null}
                  </div>
                  {!isEditing && decryptErrors[item.id] ? (
                    <span className="text-xs text-red-400">
                      {decryptErrors[item.id]}
                    </span>
                  ) : null}
                </dd>
              </div>
            </dl>

            {isEditing ? (
              <div className="mt-4 space-y-3 border-t border-neutral-800 pt-4">
                {['name', 'username', 'password', 'website'].map((field) => (
                  <input
                    key={field}
                    type={field === 'password' ? 'password' : 'text'}
                    value={editForm[field] || ''}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none"
                  />
                ))}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

export default PasswordCard

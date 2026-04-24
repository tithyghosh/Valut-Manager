import React, { useEffect, useState } from 'react'
import Header from './features/header/Header'
import Form from './features/bookmarks/components/Form'
import MainBoard from './features/bookmarks/components/MainBoard'
import { deriveKey, encryptText, decryptText } from './features/bookmarks/utils/crypto'
import { useAutoLock } from './features/Auth/useAutoLock'

const STORAGE_KEY = 'vault-bookmarks'

const App = ({ masterPassword, onLock, onToast }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [vaultKey, setVaultKey] = useState(null)

  useEffect(() => {
    let cancelled = false
    deriveKey(masterPassword).then((key) => {
      if (!cancelled) setVaultKey(key)
    })
    return () => { cancelled = true }
  }, [masterPassword])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  useAutoLock(onLock, 10)

  const getVaultKey = async () => vaultKey ?? deriveKey(masterPassword)

  const handleAddBookmark = async (newBookmark) => {
    const key = await getVaultKey()
    const encryptedPassword = await encryptText(newBookmark.password, key)
    const encryptedNotes = newBookmark.notes?.trim()
      ? await encryptText(newBookmark.notes, key)
      : ''

    setBookmarks((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...newBookmark,
        password: encryptedPassword,
        passwordLength: newBookmark.password.length,
        notes: encryptedNotes,
      },
      ...prev,
    ])
  }

  const handleDeleteBookmark = (id) =>
    setBookmarks((prev) => prev.filter((b) => b.id !== id))

  const handleEditBookmark = async (id, updated) => {
    const nextBookmark = { ...updated }
    const key = await getVaultKey()

    if (typeof updated.password === 'string') {
      nextBookmark.password = await encryptText(updated.password, key)
      nextBookmark.passwordLength = updated.password.length
    }

    if (typeof updated.notes === 'string') {
      nextBookmark.notes = updated.notes.trim()
        ? await encryptText(updated.notes, key)
        : ''
    }

    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...nextBookmark } : b))
    )
  }

  const handleRevealPassword = async (encryptedPassword) => {
    const key = await getVaultKey()
    return decryptText(encryptedPassword, key)
  }

  const handleRevealNotes = async (encryptedNotes) => {
    if (!encryptedNotes) return ''
    const key = await getVaultKey()
    return decryptText(encryptedNotes, key)
  }

  const handleImport = (importedBookmarks) => {
    setBookmarks((prev) => {
      const existingIds = new Set(prev.map((b) => b.id))
      const newEntries = importedBookmarks.filter((b) => !existingIds.has(b.id))
      return [...newEntries, ...prev]
    })
  }

  return (
    <div className="min-h-screen" style={{ color: 'var(--text)' }}>
      <Header bookmarks={bookmarks} onLock={onLock} onToast={onToast} />
      <Form onAddBookmark={handleAddBookmark} onToast={onToast} />
      <MainBoard
        bookmarks={bookmarks}
        onDelete={handleDeleteBookmark}
        onEdit={handleEditBookmark}
        onRevealPassword={handleRevealPassword}
        onRevealNotes={handleRevealNotes}
        onImport={handleImport}
        onToast={onToast}
      />
    </div>
  )
}

export default App

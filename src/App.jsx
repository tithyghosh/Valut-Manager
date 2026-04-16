import React, { useEffect, useState } from 'react'
import Header from './features/header/Header'
import Form from './features/bookmarks/components/Form'
import MainBoard from './features/bookmarks/components/MainBoard'
import { deriveKey, encryptText, decryptText } from './features/bookmarks/utils/crypto'

const STORAGE_KEY = 'vault-bookmarks'

const App = ({ masterPassword }) => {
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

    const loadVaultKey = async () => {
      const nextKey = await deriveKey(masterPassword)

      if (!cancelled) {
        setVaultKey(nextKey)
      }
    }

    loadVaultKey()

    return () => {
      cancelled = true
    }
  }, [masterPassword])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const getVaultKey = async () => vaultKey ?? deriveKey(masterPassword)

  const handleAddBookmark = async (newBookmark) => {
    const key = await getVaultKey()
    const encryptedPassword = await encryptText(newBookmark.password, key)

    setBookmarks((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...newBookmark,
        password: encryptedPassword, // store encrypted
        passwordLength: newBookmark.password.length,
      },
      ...prev,
    ])
  }

  const handleDeleteBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const handleEditBookmark = async (id, updated) => {
    const nextBookmark = { ...updated }

    if (typeof updated.password === 'string') {
      const key = await getVaultKey()
      nextBookmark.password = await encryptText(updated.password, key)
      nextBookmark.passwordLength = updated.password.length
    }

    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...nextBookmark } : b))
    )
  }

  const handleRevealPassword = async (encryptedPassword) => {
    const key = await getVaultKey()
    return decryptText(encryptedPassword, key)
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Header />
      <Form onAddBookmark={handleAddBookmark} />
      <MainBoard
        bookmarks={bookmarks}
        onDelete={handleDeleteBookmark}
        onEdit={handleEditBookmark}
        onRevealPassword={handleRevealPassword}
      />
    </div>
  )
}

export default App

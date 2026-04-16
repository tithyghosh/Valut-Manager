import React, { useState } from 'react'
import { hashText } from '../bookmarks/utils/crypto'

const AuthGate = ({ onUnlock }) => {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const MASTER_KEY = 'vault-master'
  const isFirstTime = !localStorage.getItem(MASTER_KEY)

  const unlockVault = (password) => {
    setError('')
    onUnlock(password)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const normalizedInput = input.trim()

    if (normalizedInput.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)

    try {
      if (isFirstTime) {
        const verifier = await hashText(normalizedInput)
        localStorage.setItem(MASTER_KEY, verifier)
        unlockVault(normalizedInput)
        return
      }

      const stored = localStorage.getItem(MASTER_KEY)

      if (!stored) {
        const verifier = await hashText(normalizedInput)
        localStorage.setItem(MASTER_KEY, verifier)
        unlockVault(normalizedInput)
        return
      }

      const isLegacyPassword = !stored.startsWith('sha256:')
      const matches = isLegacyPassword
        ? normalizedInput === stored
        : (await hashText(normalizedInput)) === stored

      if (matches) {
        if (isLegacyPassword) {
          const verifier = await hashText(normalizedInput)
          localStorage.setItem(MASTER_KEY, verifier)
        }

        unlockVault(normalizedInput)
      } else {
        setError('Incorrect master password.')
        setInput('')
      }
    } catch {
      setError('Unable to unlock the vault right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-white mb-2">
          {isFirstTime ? 'Create Master Password' : 'Unlock Vault'}
        </h1>
        <p className="text-sm text-neutral-400 mb-8">
          {isFirstTime
            ? 'Set a master password to protect your vault'
            : 'Enter your master password to continue.'}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError('')
            }}
            placeholder="Master Password"
            className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition">
            {isSubmitting
              ? 'Unlocking...'
              : isFirstTime
                ? 'Create & Enter'
                : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthGate

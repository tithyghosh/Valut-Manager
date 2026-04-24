import React, { useState } from 'react'
import { hashText } from '../bookmarks/utils/crypto'

const LockIcon = ({ unlocked }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`w-10 h-10 transition-all duration-500 ${unlocked ? 'text-[#00e5a0]' : 'text-[#5a5f7a]'}`}
    stroke="currentColor"
    strokeWidth="1.5"
  >
    {unlocked ? (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </>
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    )}
  </svg>
)

const AuthGate = ({ onUnlock }) => {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const MASTER_KEY = 'vault-master'
  const isFirstTime = !localStorage.getItem(MASTER_KEY)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalizedInput = input.trim()

    if (normalizedInput.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (isFirstTime) {
        const verifier = await hashText(normalizedInput)
        localStorage.setItem(MASTER_KEY, verifier)
        setUnlocked(true)
        setTimeout(() => onUnlock(normalizedInput), 600)
        return
      }

      const stored = localStorage.getItem(MASTER_KEY)
      const isLegacyPassword = !stored.startsWith('sha256:')
      const matches = isLegacyPassword
        ? normalizedInput === stored
        : (await hashText(normalizedInput)) === stored

      if (matches) {
        if (isLegacyPassword) {
          localStorage.setItem(MASTER_KEY, await hashText(normalizedInput))
        }
        setUnlocked(true)
        setTimeout(() => onUnlock(normalizedInput), 600)
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
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--teal) 1px, transparent 1px), linear-gradient(90deg, var(--teal) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #00e5a0, transparent)' }}
      />

      <div className="animate-scale-in w-full max-w-md relative">
        {/* Top accent line */}
        <div
          className="h-px w-full mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--teal), transparent)' }}
        />

        <div
          className="glass-bright rounded-3xl p-6 sm:p-8 shadow-2xl"
          style={{ boxShadow: '0 0 60px #00e5a010, 0 32px 64px #00000060' }}
        >
          {/* Lock icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${unlocked ? 'bg-[#00e5a015]' : 'bg-[#1e2035]'}`}
              style={unlocked ? { boxShadow: '0 0 30px #00e5a030' } : {}}
            >
              <LockIcon unlocked={unlocked} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {isFirstTime ? 'Create Your Vault' : 'Unlock Vault'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {isFirstTime
                ? 'Set a master password to encrypt your credentials'
                : 'Enter your master password to access your vault'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError('') }}
                placeholder="Master password"
                autoFocus
                className="w-full rounded-2xl px-5 py-4 text-white font-mono text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${error ? '#ff4d6a' : input ? 'var(--teal)' : 'var(--border)'}`,
                  boxShadow: input && !error ? '0 0 0 3px #00e5a015' : 'none',
                  letterSpacing: input ? '0.2em' : 'normal',
                }}
              />
            </div>

            {error && (
              <p
                className="animate-fade-in text-sm text-center px-4 py-2 rounded-xl"
                style={{ color: '#ff4d6a', background: '#ff4d6a15', border: '1px solid #ff4d6a30' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || unlocked}
              className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-300 mt-2"
              style={{
                background: unlocked ? '#00e5a020' : 'linear-gradient(135deg, #00e5a0, #00b87a)',
                color: unlocked ? 'var(--teal)' : '#07080f',
                boxShadow: unlocked ? 'none' : '0 8px 32px #00e5a030',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {unlocked
                ? '✓ Vault Unlocked'
                : isSubmitting
                  ? 'Verifying...'
                  : isFirstTime
                    ? 'Create & Enter'
                    : 'Unlock'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
            🔒 Encrypted locally · Never leaves your device
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-px w-full mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--teal), transparent)' }}
        />
      </div>
    </div>
  )
}

export default AuthGate

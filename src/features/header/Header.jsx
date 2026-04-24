import { useEffect, useState } from 'react'
import { formatDate, getGreeting } from './headerDate'
import { ChangeMasterPassword } from '../Auth/ChangeMasterPassword'

const StatPill = ({ label, value, delay }) => (
  <div
    className={`animate-fade-up ${delay} flex flex-col items-center gap-1 px-5 py-3 rounded-2xl`}
    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
  >
    <span className="text-xl font-bold" style={{ color: 'var(--teal)' }}>{value}</span>
    <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>{label}</span>
  </div>
)

const Header = ({ bookmarks = [], onLock, onToast }) => {
  const [now, setNow] = useState(new Date())
  const [showChangePwd, setShowChangePwd] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const categories = [...new Set(bookmarks.map((b) => b.category).filter(Boolean))].length

  const newest = bookmarks[0]
    ? new Date(bookmarks[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—'

  return (
    <>
    <header
      className="relative border-b"
      style={{ borderColor: 'var(--border)', background: 'linear-gradient(to bottom, #0a0b14, var(--bg))' }}
    >
      {/* Top teal line */}
      <div
        className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--teal) 30%, var(--blue) 70%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Left — greeting + date */}
          <div className="space-y-3 animate-fade-up">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.4em]"
                style={{ color: 'var(--teal)' }}
              >
                Vault Manager
              </span>
              <span className="h-px flex-1 max-w-[60px]" style={{ background: 'var(--teal)', opacity: 0.4 }} />
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-none">
              {getGreeting(now)},
              <span className="text-shimmer ml-2">World!</span>
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {formatDate(now)}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                All credentials encrypted locally
              </span>
            </div>
          </div>

          {/* Right — stat pills + lock button */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatPill label="Credentials" value={bookmarks.length} delay="delay-100" />
            <StatPill label="Categories"  value={categories}        delay="delay-200" />
            <StatPill label="Last Added"  value={newest}            delay="delay-300" />

            <button
              onClick={() => setShowChangePwd(true)}
              className="animate-fade-up delay-400 flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.color = 'var(--teal)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              🔑 Password
            </button>

            {onLock && (
              <button
                onClick={onLock}
                className="animate-fade-up delay-400 flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ff4d6a50'
                  e.currentTarget.style.color = '#ff4d6a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--muted)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Lock Vault
              </button>
            )}
          </div>

        </div>
      </div>
    </header>

    {showChangePwd && (
      <ChangeMasterPassword
        onConfirm={() => setShowChangePwd(false)}
        onCancel={() => setShowChangePwd(false)}
        onToast={onToast}
      />
    )}
    </>
  )
}

export default Header
